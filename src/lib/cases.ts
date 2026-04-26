export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface Evidence {
  id: string;
  type: "email" | "chat" | "receipt" | "log" | "transaction";
  title: string;
  source: string;
  timestamp: string;
  preview: string;
  flagged: boolean;
}

export interface FeatureWeight {
  feature: string;
  weight: number; // 0..1
  reasoning: string;
  biased?: boolean;
}

export interface Case {
  id: string;
  citizenName: string;
  citizenId: string;
  predictedCrime: string;
  riskScore: number; // 0..100
  status: "pending" | "auditing" | "cleared";
  flaggedAt: string;
  district: string;
  aiSummary: string;
  triggers: string[];
  suspiciousPhrases: string[];
  features: FeatureWeight[];
  evidence: Evidence[];
  biasWarning?: string;
}

export const cases: Case[] = [
  {
    id: "PCA-2049-0317",
    citizenName: "Elena Vasquez",
    citizenId: "C-88241-A",
    predictedCrime: "Financial Fraud (Tier-2)",
    riskScore: 87,
    status: "pending",
    flaggedAt: "03:47:22 UTC",
    district: "Sector 7 — Meridian",
    aiSummary:
      "Subject exhibits 14 anomalous behavioral markers across a 72-hour window, including off-hour data access, encrypted communication spikes, and atypical financial routing patterns. Predictive model assigns 87% probability of premeditated financial fraud within 96 hours.",
    triggers: [
      "Encrypted message volume +340% (72h)",
      "Wire transfer to unverified entity",
      "VPN access at 03:14 local",
      "Search query: 'offshore account anonymity'",
    ],
    suspiciousPhrases: [
      "...we should keep this off the record...",
      "delete after reading",
      "they won't trace it if we route through Tallinn",
    ],
    features: [
      { feature: "Off-hour system access", weight: 0.92, reasoning: "Login at 03:14 flagged as anomaly versus 6-month baseline." },
      { feature: "Encrypted comms spike", weight: 0.81, reasoning: "Signal traffic 4.4× weekly average." },
      { feature: "Financial routing pattern", weight: 0.74, reasoning: "Two-hop transfer through high-risk jurisdiction." },
      { feature: "Lexical sentiment", weight: 0.61, reasoning: "Phrases match deception corpus at 0.61 confidence.", biased: true },
      { feature: "Geo-cluster (Sector 7)", weight: 0.42, reasoning: "District weighting — historical model bias detected.", biased: true },
      { feature: "Peer network risk", weight: 0.38, reasoning: "Two contacts previously flagged." },
    ],
    evidence: [
      { id: "E-01", type: "email", title: "Re: Q3 Reconciliation", source: "elena.v@meridian.corp", timestamp: "02:11", preview: "...we should keep this off the record. Books look clean from the outside.", flagged: true },
      { id: "E-02", type: "chat", title: "Signal :: M. Krause", source: "Signal", timestamp: "03:09", preview: "Routing confirmed. Tallinn relay is hot.", flagged: true },
      { id: "E-03", type: "receipt", title: "Wire Transfer #88-2241", source: "Meridian Bank", timestamp: "03:22", preview: "$48,200.00 → Acct ending 9921 (unverified)", flagged: true },
      { id: "E-04", type: "log", title: "VPN Session Log", source: "CorpNet", timestamp: "03:14", preview: "Tunnel opened — egress: Reykjavik node", flagged: false },
      { id: "E-05", type: "transaction", title: "Coffee — Nox Café", source: "Card *4421", timestamp: "08:42", preview: "$6.20 — routine purchase", flagged: false },
    ],
    biasWarning: "Geo-cluster feature shows 18% disparate impact on Sector 7 residents. Review recommended.",
  },
  {
    id: "PCA-2049-0312",
    citizenName: "Marcus Tan",
    citizenId: "C-77103-B",
    predictedCrime: "Cyber Intrusion",
    riskScore: 94,
    status: "pending",
    flaggedAt: "01:12:08 UTC",
    district: "Sector 3 — Helix",
    aiSummary:
      "Subject's network reconnaissance patterns match 9/12 indicators of pre-attack staging. Critical-tier alert.",
    triggers: ["Port scans on internal subnet", "Cred-stuffing tool signature", "Tor exit relay use"],
    suspiciousPhrases: ["root pivot ready", "burn the logs after"],
    features: [
      { feature: "Recon pattern match", weight: 0.95, reasoning: "Behavioral fingerprint matches APT-44 staging." },
      { feature: "Tool signature", weight: 0.88, reasoning: "Hashcat variant detected on endpoint." },
      { feature: "Anonymization use", weight: 0.7, reasoning: "Tor + VPN chained." },
    ],
    evidence: [
      { id: "E-01", type: "log", title: "IDS Alert 9921", source: "Sentinel", timestamp: "01:02", preview: "Port scan: 1024-65535 on 10.4.0.0/16", flagged: true },
    ],
  },
  {
    id: "PCA-2049-0309",
    citizenName: "Aria Okafor",
    citizenId: "C-44918-C",
    predictedCrime: "Workplace Sabotage",
    riskScore: 62,
    status: "auditing",
    flaggedAt: "22:48:11 UTC",
    district: "Sector 12 — Vega",
    aiSummary: "Moderate-risk pattern. Several contextual factors warrant human review before escalation.",
    triggers: ["Unusual file deletion volume", "After-hours building access"],
    suspiciousPhrases: [],
    features: [
      { feature: "File deletion spike", weight: 0.66, reasoning: "203 files purged in 12 minutes." },
      { feature: "Badge swipe anomaly", weight: 0.44, reasoning: "Building entry at 23:11.", biased: true },
    ],
    evidence: [],
    biasWarning: "Badge anomaly weighted using shift-pattern model with documented night-shift bias.",
  },
  {
    id: "PCA-2049-0301",
    citizenName: "Jonas Reiter",
    citizenId: "C-22014-D",
    predictedCrime: "Public Disturbance",
    riskScore: 38,
    status: "pending",
    flaggedAt: "19:30:00 UTC",
    district: "Sector 2 — Lumen",
    aiSummary: "Low-confidence prediction. Model exhibits known sensitivity to proximity-based clustering.",
    triggers: ["Crowd proximity score elevated"],
    suspiciousPhrases: [],
    features: [
      { feature: "Crowd proximity", weight: 0.4, reasoning: "Within 8m of prior incident location.", biased: true },
    ],
    evidence: [],
  },
  {
    id: "PCA-2049-0298",
    citizenName: "Priya Shah",
    citizenId: "C-90112-E",
    predictedCrime: "Insider Trading",
    riskScore: 71,
    status: "pending",
    flaggedAt: "14:02:55 UTC",
    district: "Sector 9 — Apex",
    aiSummary: "Trade timing correlates with non-public corporate event by 4.2σ.",
    triggers: ["Options purchase 11h pre-announcement", "Comms with insider contact"],
    suspiciousPhrases: ["catalyst confirmed Tuesday"],
    features: [
      { feature: "Trade timing anomaly", weight: 0.83, reasoning: "Statistical improbability of coincidence." },
      { feature: "Contact graph", weight: 0.55, reasoning: "Direct edge to corporate insider." },
    ],
    evidence: [],
  },
  {
    id: "PCA-2049-0287",
    citizenName: "Liam O'Sullivan",
    citizenId: "C-11842-F",
    predictedCrime: "Unauthorized Access",
    riskScore: 24,
    status: "cleared",
    flaggedAt: "08:14:00 UTC",
    district: "Sector 5 — Cobalt",
    aiSummary: "Cleared on audit — legitimate maintenance window mis-flagged.",
    triggers: [],
    suspiciousPhrases: [],
    features: [],
    evidence: [],
  },
];

export function getCase(id: string): Case | undefined {
  return cases.find((c) => c.id === id);
}

export function riskLevel(score: number): RiskLevel {
  if (score >= 85) return "critical";
  if (score >= 65) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export function riskColor(score: number): string {
  const lvl = riskLevel(score);
  return {
    critical: "danger",
    high: "secondary",
    medium: "warning",
    low: "success",
  }[lvl];
}
