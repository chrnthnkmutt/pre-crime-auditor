import type { FeatureWeight } from "@/lib/cases";

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
