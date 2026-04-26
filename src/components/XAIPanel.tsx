import { useState } from "react";
import { type FeatureWeight } from "@/lib/cases";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react";

interface Props {
  features: FeatureWeight[];
  biasWarning?: string;
}

export function XAIPanel({ features, biasWarning }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const sorted = [...features].sort((a, b) => b.weight - a.weight);

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="font-mono text-xs text-primary text-glow-primary">[XAI]</span>
            AI Justification Breakdown
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Feature weights driving the prediction
          </p>
        </div>
        <Info className="h-4 w-4 text-muted-foreground" />
      </div>

      {biasWarning && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/10 p-3 animate-fade-in">
          <AlertTriangle className="h-4 w-4 shrink-0 text-warning mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-warning">BIAS WARNING</p>
            <p className="text-xs text-foreground/90 mt-0.5">{biasWarning}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map((f) => (
          <div
            key={f.feature}
            onMouseEnter={() => setHovered(f.feature)}
            onMouseLeave={() => setHovered(null)}
            className="group relative"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground/90">{f.feature}</span>
                {f.biased && (
                  <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-warning/40 bg-warning/10 text-warning">
                    bias
                  </span>
                )}
              </div>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {(f.weight * 100).toFixed(0)}%
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
                  f.biased ? "bg-warning" : "bg-primary",
                  f.biased ? "" : "shadow-[0_0_10px_var(--primary)]",
                )}
                style={{ width: `${f.weight * 100}%` }}
              />
            </div>

            {hovered === f.feature && (
              <div className="absolute z-10 top-full mt-2 left-0 right-0 glass-strong rounded-lg p-3 border-glow animate-scale-in">
                <p className="text-xs text-foreground/90">{f.reasoning}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
