import { riskLevel } from "@/lib/cases";
import { cn } from "@/lib/utils";

interface Props {
  score: number;
  size?: number;
  animated?: boolean;
  label?: string;
}

export function RiskMeter({ score, size = 240, animated = true, label = "Risk Score" }: Props) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const lvl = riskLevel(score);

  const colorVar = {
    critical: "var(--danger)",
    high: "var(--secondary)",
    medium: "var(--warning)",
    low: "var(--success)",
  }[lvl];

  const glowClass = {
    critical: "text-glow-danger",
    high: "text-glow-secondary",
    medium: "",
    low: "text-glow-success",
  }[lvl];

  const labelText = {
    critical: "CRITICAL",
    high: "HIGH",
    medium: "MODERATE",
    low: "LOW",
  }[lvl];

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      {/* outer ring decoration */}
      <div
        className="absolute inset-0 rounded-full border border-border-glow opacity-40"
        style={{ animation: animated ? "spin 30s linear infinite" : undefined }}
      />
      <div className="absolute inset-3 rounded-full border border-dashed border-border opacity-50" />

      <svg width={size} height={size} className="relative -rotate-90">
        <defs>
          <filter id={`glow-${score}`}>
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--border)"
          strokeWidth={stroke}
          fill="none"
          opacity={0.4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colorVar}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          filter={`url(#glow-${score})`}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.6s ease",
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </span>
        <div className={cn("font-mono text-6xl font-bold tabular-nums", glowClass)} style={{ color: colorVar }}>
          {score}
          <span className="text-2xl text-muted-foreground">%</span>
        </div>
        <span className={cn("mt-1 text-xs font-mono font-semibold tracking-[0.2em]", glowClass)} style={{ color: colorVar }}>
          {labelText}
        </span>
      </div>
    </div>
  );
}
