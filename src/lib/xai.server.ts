import OpenAI from "openai";
import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import type { Case } from "@/lib/cases";
import { getCaseFromDb } from "@/lib/cases";
import type { XaiInsight } from "@/lib/xai";

const featureInsightSchema = z.object({
  feature: z.string().min(1),
  reasoning: z.string().min(1),
  biased: z.boolean().optional(),
});

const xaiSchema = z.object({
  "AI-Generate Summary (Bias)": z.string().min(1),
  "Suspicious Reasoning with Evidence": z.string().min(1),
  "AI-Generate Summary (non-bias)": z.string().min(1),
  "Reasoning with Evidence": z.string().min(1),
  summary: z.unknown().optional(),
  triggers: z.array(z.string().min(1)).default([]),
  featureInsights: z.array(featureInsightSchema).default([]),
  biasWarning: z.string().min(1).optional(),
  confidence: z.union([z.number(), z.string()]).optional(),
});

const DEFAULT_FOUNDRY_ENDPOINT =
  "https://formula1-test1-resource.cognitiveservices.azure.com/openai/v1/";
const DEFAULT_FOUNDRY_DEPLOYMENT = "gpt-5.4-mini";

function readEnv(...keys: string[]) {
  for (const key of keys) {
    const value = typeof process !== "undefined" ? process.env?.[key] : undefined;
    if (value && value.trim()) return value.trim();
  }
  return undefined;
}

function stripCodeFences(content: string) {
  return content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseXaiPayload(content: string) {
  const cleaned = stripCodeFences(content);

  try {
    return JSON.parse(cleaned) as unknown;
  } catch {
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as unknown;
    }
    throw new Error("XAI payload is not valid JSON");
  }
}

export async function generateCaseXai(caseData: Case): Promise<XaiInsight | null> {
  const apiKey = readEnv(
    "api_key",
    "AI_FOUNDRY_API_KEY",
    "FOUNDRY_OPENAI_API_KEY",
    "OPENAI_API_KEY",
  );
  const baseURL =
    readEnv(
      "AI_FOUNDRY_ENDPOINT",
      "AI_FOUNDRY_BASE_URL",
      "FOUNDRY_OPENAI_BASE_URL",
      "OPENAI_BASE_URL",
    ) ?? DEFAULT_FOUNDRY_ENDPOINT;
  const model =
    readEnv(
      "AI_FOUNDRY_DEPLOYMENT_NAME",
      "AI_FOUNDRY_MODEL",
      "FOUNDRY_OPENAI_MODEL",
      "OPENAI_MODEL",
    ) ?? DEFAULT_FOUNDRY_DEPLOYMENT;

  if (!apiKey || !baseURL || !model) {
    console.info("[xai] skipped model call", {
      caseId: caseData.id,
      reason: "missing configuration",
      hasApiKey: !!apiKey,
      hasBaseURL: !!baseURL,
      hasModel: !!model,
    });
    return null;
  }

  const client = new OpenAI({ apiKey, baseURL });
  const startedAt = Date.now();

  console.info("[xai] starting model call", {
    caseId: caseData.id,
    provider: "Microsoft Foundry",
    baseURL,
    model,
  });

  const response = await client.chat.completions.create({
    model,
    temperature: 0.2,
    max_completion_tokens: 900,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "developer",
        content:
          "Return valid JSON only. Keep every string short. Use exactly these preview keys: 'AI-Generate Summary (Bias)', 'Suspicious Reasoning with Evidence', 'AI-Generate Summary (non-bias)', and 'Reasoning with Evidence'. Also include triggers, featureInsights, biasWarning, and confidence. Use at most 2 short sentences per preview field, 3-5 short triggers, and one brief reasoning sentence per feature. Cite only one or two evidence ids or titles in each evidence-based field.",
      },
      {
        role: "user",
        content: [
          "Case data:",
          JSON.stringify(
            {
              id: caseData.id,
              citizenName: caseData.citizenName,
              citizenId: caseData.citizenId,
              predictedCrime: caseData.predictedCrime,
              riskScore: caseData.riskScore,
              district: caseData.district,
              aiSummary: caseData.aiSummary,
              triggers: caseData.triggers,
              suspiciousPhrases: caseData.suspiciousPhrases,
              biasWarning: caseData.biasWarning,
            },
            null,
            2,
          ),
          "Feature list:",
          JSON.stringify(caseData.features, null, 2),
          "Evidence list:",
          JSON.stringify(caseData.evidence, null, 2),
          "Return 3-5 short triggers, one featureInsight per supplied feature using the exact feature names, and a confidence score from 0 to 1. Do not elaborate beyond the minimum needed to fit inside a compact JSON response.",
        ].join("\n\n"),
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) return null;

  const parsed = xaiSchema.safeParse(parseXaiPayload(content));
  if (!parsed.success) {
    console.warn("[xai] model returned unparseable payload", {
      caseId: caseData.id,
      provider: "Microsoft Foundry",
      model,
      latencyMs: Date.now() - startedAt,
      contentPreview: stripCodeFences(content),
    });
    return null;
  }

  const latencyMs = Date.now() - startedAt;
  const summaryPreview = {
    "AI-Generate Summary (Bias)": parsed.data["AI-Generate Summary (Bias)"],
    "Suspicious Reasoning with Evidence": parsed.data["Suspicious Reasoning with Evidence"],
    "AI-Generate Summary (non-bias)": parsed.data["AI-Generate Summary (non-bias)"],
    "Reasoning with Evidence": parsed.data["Reasoning with Evidence"],
  };
  const confidence = typeof parsed.data.confidence === "string"
    ? Number.parseFloat(parsed.data.confidence)
    : parsed.data.confidence ?? caseData.riskScore / 100;

  console.info("[xai] model call completed", {
    caseId: caseData.id,
    provider: "Microsoft Foundry",
    model,
    latencyMs,
    confidence,
    featureCount: parsed.data.featureInsights.length,
    contentPreview: summaryPreview,
  });

  console.info("[xai] model summary preview", {
    caseId: caseData.id,
    provider: "Microsoft Foundry",
    model,
    preview: summaryPreview,
  });

  return {
    provider: "Microsoft Foundry",
    model,
    confidence,
    generatedAt: new Date().toISOString(),
    summary: JSON.stringify(summaryPreview),
    triggers: parsed.data.triggers,
    featureInsights: parsed.data.featureInsights,
    biasWarning: parsed.data.biasWarning,
    usage: {
      liveModelUsed: true,
      latencyMs,
      source: baseURL,
    },
  };
}

export const getCaseXai = createServerFn({ method: "GET" })
  .inputValidator((input: { caseId: string }) => input)
  .handler(async ({ data }) => {
    const caseData = await getCaseFromDb(data.caseId);
    if (!caseData) return null;
    return generateCaseXai(caseData);
  });
