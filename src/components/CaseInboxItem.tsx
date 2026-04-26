import { Link } from "@tanstack/react-router";
import { type Case, riskLevel } from "@/lib/cases";
import { cn } from "@/lib/utils";
import { AlertTriangle, ChevronRight } from "lucide-react";

interface Props {
  case: Case;
  active?: boolean;
}

export function CaseInboxItem({ case: c, active }: Props) {
  const lvl = riskLevel(c.riskScore);
  const isCritical = lvl === "critical";
  const isHigh = lvl === "high";

  return (
    <Link
      to="/case/$caseId"
      params={{ caseId: c.id }}
      className={cn(
        "group relative block rounded-lg border p-3 transition-all duration-200",
        "hover:border-glow hover:bg-accent/50",
        active ? "border-primary/60 bg-accent/40 glow-soft" : "border-border bg-card/40",
        isCritical && "border-destructive/40",
      )}
    >
      {isCritical && (
        <span className="pointer-events-none absolute inset-0 rounded-lg animate-pulse-glow opacity-60" />
      )}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {c.id}
            </span>
            {c.biasWarning && (
              <span title="Bias detected" className="text-warning">
                <AlertTriangle className="h-3 w-3" />
              </span>
            )}
          </div>
          <p className="truncate text-sm font-semibold text-foreground">{c.citizenName}</p>
          <p className="truncate text-xs text-muted-foreground mt-0.5">{c.predictedCrime}</p>
          <p className="font-mono text-[10px] text-muted-foreground mt-1.5">
            {c.district} · {c.flaggedAt}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <RiskBadge score={c.riskScore} />
          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
}

function RiskBadge({ score }: { score: number }) {
  const lvl = riskLevel(score);
  const styles = {
    critical: "bg-destructive/15 text-destructive border-destructive/40 text-glow-danger",
    high: "bg-secondary/15 text-secondary border-secondary/40 text-glow-secondary",
    medium: "bg-warning/15 text-warning border-warning/40",
    low: "bg-success/15 text-success border-success/40 text-glow-success",
  }[lvl];

  return (
    <span
      className={cn(
        "font-mono text-xs font-bold px-2 py-0.5 rounded border tabular-nums",
        styles,
      )}
    >
      {score}%
    </span>
  );
}
