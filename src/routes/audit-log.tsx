import { createFileRoute, Link } from "@tanstack/react-router";
import { getAllCasesFromDb, riskLevel, type Case } from "@/lib/cases";
import { cn } from "@/lib/utils";
import { ArrowRight, FileSearch } from "lucide-react";

export const Route = createFileRoute("/audit-log")({
  head: () => ({
    meta: [
      { title: "Audit Log — Pre-Crime Bias Auditor" },
      { name: "description", content: "Complete log of human audits performed across the predictive crime system." },
    ],
  }),
  loader: async () => {
    const cases = await getAllCasesFromDb();
    return cases;
  },
  component: AuditLog,
});

function AuditLog() {
  const cases = Route.useLoaderData() as Case[];

  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          [02] Historical Records
        </p>
        <h1 className="text-2xl font-bold text-glow-primary mt-1 flex items-center gap-2">
          <FileSearch className="h-6 w-6 text-primary" /> Audit Log
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          All cases reviewed by the human auditor pool — sortable by risk and bias detection.
        </p>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-border bg-background/40 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <div className="col-span-2">Case ID</div>
          <div className="col-span-3">Subject</div>
          <div className="col-span-3">Predicted Crime</div>
          <div className="col-span-1">Risk</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Open</div>
        </div>
        {cases.map((c) => {
          const lvl = riskLevel(c.riskScore);
          const lvlColor = {
            critical: "text-destructive text-glow-danger",
            high: "text-secondary text-glow-secondary",
            medium: "text-warning",
            low: "text-success text-glow-success",
          }[lvl];
          return (
            <Link
              key={c.id}
              to="/case/$caseId"
              params={{ caseId: c.id }}
              className="grid grid-cols-12 gap-3 px-5 py-4 border-b border-border last:border-b-0 items-center hover:bg-accent/30 transition-colors group"
            >
              <div className="col-span-2 font-mono text-xs text-muted-foreground">{c.id}</div>
              <div className="col-span-3">
                <p className="text-sm font-medium">{c.citizenName}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{c.district}</p>
              </div>
              <div className="col-span-3 text-sm text-foreground/90">{c.predictedCrime}</div>
              <div className={cn("col-span-1 font-mono text-sm font-bold tabular-nums", lvlColor)}>
                {c.riskScore}%
              </div>
              <div className="col-span-2">
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded border",
                    c.status === "cleared" && "border-success/40 bg-success/10 text-success",
                    c.status === "auditing" && "border-primary/40 bg-primary/10 text-primary",
                    c.status === "pending" && "border-secondary/40 bg-secondary/10 text-secondary",
                  )}
                >
                  {c.status}
                </span>
              </div>
              <div className="col-span-1 flex justify-end">
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
