import { useState } from "react";
import { type Case } from "@/lib/cases";
import { cn } from "@/lib/utils";
import { Mail, MessageSquare, Receipt, FileText, CreditCard, Flag, ChevronDown } from "lucide-react";

const iconFor = {
  email: Mail,
  chat: MessageSquare,
  receipt: Receipt,
  log: FileText,
  transaction: CreditCard,
};

export function EvidenceList({ case: c }: { case: Case }) {
  const [expanded, setExpanded] = useState<string | null>(c.evidence[0]?.id ?? null);

  if (c.evidence.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">No evidence files attached to this case.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {c.evidence.map((e) => {
        const Icon = iconFor[e.type];
        const isOpen = expanded === e.id;
        return (
          <button
            key={e.id}
            onClick={() => setExpanded(isOpen ? null : e.id)}
            className={cn(
              "w-full text-left glass rounded-lg p-3 transition-all hover:border-glow",
              isOpen && "border-glow",
              e.flagged && "border-destructive/30",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                  e.flagged ? "bg-destructive/15 text-destructive" : "bg-accent text-primary",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{e.title}</p>
                  {e.flagged && (
                    <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-destructive">
                      <Flag className="h-3 w-3" /> flagged
                    </span>
                  )}
                </div>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                  {e.source} · {e.timestamp} · {e.id}
                </p>
              </div>
              <ChevronDown
                className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")}
              />
            </div>
            {isOpen && (
              <div className="mt-3 pt-3 border-t border-border animate-fade-in">
                <p className="text-xs font-mono text-foreground/80 leading-relaxed bg-background/60 rounded-md p-3 border border-border">
                  {e.preview}
                </p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
