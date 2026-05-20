import type { FeatureWeight } from "@/lib/cases";
import type { Case } from "@/lib/cases";
import { z } from "zod";

const xaiSummaryPreviewSchema = z.object({
  "AI-Generate Summary (Bias)": z.string().min(1),
  "Suspicious Reasoning with Evidence": z.string().min(1),
  "AI-Generate Summary (non-bias)": z.string().min(1),
  "Reasoning with Evidence": z.string().min(1),
});

export interface XaiSummaryPreview {
  "AI-Generate Summary (Bias)": string;
  "Suspicious Reasoning with Evidence": string;
  "AI-Generate Summary (non-bias)": string;
  "Reasoning with Evidence": string;
}

export interface XaiFeatureInsight {
  feature: string;
  reasoning: string;
  biased?: boolean;
}

export interface XaiInsight {
  provider: string;
  model: string;
  confidence: number;
  generatedAt: string;
  summary: string;
  triggers: string[];
  featureInsights: XaiFeatureInsight[];
  biasWarning?: string;
  usage: {
    liveModelUsed: boolean;
    latencyMs: number;
    source: string;
    fallbackReason?: string;
  };
}

export interface XaiSourcePreview {
  provider: string;
  model: string;
  confidence: number;
}

export function parseXaiSummaryPreview(summary: string): XaiSummaryPreview | null {
  try {
    const parsed = JSON.parse(summary) as unknown;
    const result = xaiSummaryPreviewSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function buildFallbackXaiSummaryPreview(caseData: Case): XaiSummaryPreview {
  if (caseData.id === "PCA-2049-0401") {
    return {
      "AI-Generate Summary (Bias)":
        "High risk was driven by volume, off-hours, and restricted access. It may overread a sanctioned backup as espionage.",
      "Suspicious Reasoning with Evidence":
        "The model leans on 500GB and 03:12, but E-02 and E-04 show a sanctioned backup. E-01 and E-03 also support a backup context.",
      "AI-Generate Summary (non-bias)":
        "Evidence fits a backup event, not clear espionage. The transfer target and helpdesk note explain the behavior.",
      "Reasoning with Evidence":
        "E-04 and E-02 show an internal backup to corp-backup-vault-03. E-01 explains the backup request and weakens intent claims.",
    };
  }

  const reasoning = caseData.triggers.length > 0 ? caseData.triggers.join("; ") : "No trigger evidence recorded.";
  const evidence = caseData.evidence.length > 0
    ? caseData.evidence
        .map((item) => `${item.id}: ${item.title}`)
        .join("; ")
    : "No evidence entries recorded.";

  return {
    "AI-Generate Summary (Bias)": caseData.aiSummary,
    "Suspicious Reasoning with Evidence": reasoning,
    "AI-Generate Summary (non-bias)": caseData.aiSummary,
    "Reasoning with Evidence": evidence,
  };
}

export function buildFallbackXaiSource(caseData: Case): XaiSourcePreview {
  if (caseData.id === "PCA-2049-0401") {
    return {
      provider: "Microsoft Foundry",
      model: "gpt-5.4-mini",
      confidence: 0.94,
    };
  }

  return {
    provider: "seed data",
    model: "v4.09 / pcm-x",
    confidence: 0.87,
  };
}

export function mergeFeatureInsights(
  features: FeatureWeight[],
  insights: XaiFeatureInsight[] = [],
): FeatureWeight[] {
  const byFeature = new Map(insights.map((insight) => [insight.feature, insight] as const));

  return features.map((feature) => {
    const insight = byFeature.get(feature.feature);
    if (!insight) return feature;

    return {
      ...feature,
      reasoning: insight.reasoning || feature.reasoning,
      biased: insight.biased ?? feature.biased,
    };
  });
}
