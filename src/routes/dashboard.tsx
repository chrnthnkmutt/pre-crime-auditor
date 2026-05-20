import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getAllCasesFromDb, riskLevel, type Case } from "@/lib/cases";
import { CaseInboxItem } from "@/components/CaseInboxItem";
import { RiskMeter } from "@/components/RiskMeter";
import {
  buildFallbackXaiSummaryPreview,
  parseXaiSummaryPreview,
  type XaiSummaryPreview,
} from "@/lib/xai";
import { Search, Filter, Zap, ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Analyst Dashboard — Pre-Crime Bias Auditor" },
      {
        name: "description",
        content: "Real-time inbox of predictive risk alerts awaiting human audit.",
      },
    ],
  }),
  loader: async () => {
    const cases = await getAllCasesFromDb();
    return cases;
  },
  component: Dashboard,
});

function Dashboard() {
  const cases = Route.useLoaderData() as Case[];
  const [selectedId, setSelectedId] = useState(cases[0].id);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "critical" | "bias">("all");
  const [liveSummaryPreview, setLiveSummaryPreview] = useState<XaiSummaryPreview | null>(null);
  const [summaryStatus, setSummaryStatus] = useState<"loading" | "ready" | "fallback">("loading");

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      if (filter === "critical" && riskLevel(c.riskScore) !== "critical") return false;
      if (filter === "bias" && !c.biasWarning) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        c.citizenName.toLowerCase().includes(q) ||
        c.predictedCrime.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    });
  }, [cases, query, filter]);

  const selected = cases.find((c) => c.id === selectedId) ?? cases[0];

  useEffect(() => {
    let cancelled = false;

    async function loadLiveSummary() {
      setSummaryStatus("loading");
      setLiveSummaryPreview(null);

      try {
        const { getCaseXai } = await import("@/lib/xai.server");
        const xai = await getCaseXai({ data: { caseId: selected.id } });
        if (cancelled) return;

        const parsed = xai ? parseXaiSummaryPreview(xai.summary) : null;
        if (parsed) {
          setLiveSummaryPreview(parsed);
          setSummaryStatus("ready");
          return;
        }

        setSummaryStatus("fallback");
      } catch {
        if (!cancelled) setSummaryStatus("fallback");
      }
    }

    void loadLiveSummary();

    return () => {
      cancelled = true;
    };
  }, [selected.id]);

  const selectedSummaryPreview = liveSummaryPreview ?? buildFallbackXaiSummaryPreview(selected);

  const stats = useMemo(() => {
    const total = cases.length;
    const critical = cases.filter((c) => riskLevel(c.riskScore) === "critical").length;
    const bias = cases.filter((c) => c.biasWarning).length;
    const cleared = cases.filter((c) => c.status === "cleared").length;
    return { total, critical, bias, cleared };
  }, [cases]);

  return (
    <div className="px-6 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Active Alerts"
          value={stats.total}
          accent="primary"
          icon={<Zap className="h-4 w-4" />}
        />
        <StatCard
          label="Critical Risk"
          value={stats.critical}
          accent="danger"
          icon={<AlertTriangle className="h-4 w-4" />}
          pulse
        />
        <StatCard
          label="Bias Flagged"
          value={stats.bias}
          accent="warning"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard
          label="Cleared (24h)"
          value={stats.cleared}
          accent="success"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <section className="col-span-12 lg:col-span-4 xl:col-span-3">
          <div className="glass rounded-xl flex flex-col h-[calc(100vh-13rem)]">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="font-mono text-xs text-primary text-glow-primary">[01]</span>
                  Case Alert Inbox
                </h2>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {filtered.length} / {cases.length}
                </span>
              </div>
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search citizen, crime, ID…"
                  className="w-full rounded-md bg-input border border-border pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
              <div className="flex items-center gap-1">
                <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
                  All
                </FilterPill>
                <FilterPill active={filter === "critical"} onClick={() => setFilter("critical")}>
                  Critical
                </FilterPill>
                <FilterPill active={filter === "bias"} onClick={() => setFilter("bias")}>
                  <Filter className="h-3 w-3 mr-1 inline" />
                  Bias
                </FilterPill>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedId(c.id);
                  }}
                >
                  <CaseInboxItem case={c} active={c.id === selectedId} />
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-8">No matching cases.</p>
              )}
            </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-5 xl:col-span-6">
          <div className="glass rounded-xl p-6 h-[calc(100vh-13rem)] flex flex-col scanline">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Live Prediction · {selected.id}
                </p>
                <h2 className="text-lg font-semibold mt-0.5">{selected.citizenName}</h2>
                <p className="text-xs text-muted-foreground">
                  {selected.predictedCrime} · <span className="font-mono">{selected.district}</span>
                </p>
              </div>
              <Link
                to="/case/$caseId"
                params={{ caseId: selected.id }}
                className="flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 hover:border-glow transition-all"
              >
                Open Case File <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <RiskMeter score={selected.riskScore} size={300} />

              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                <MiniStat label="Triggers" value={selected.triggers.length} />
                <MiniStat label="Evidence" value={selected.evidence.length} />
                <MiniStat
                  label="Bias Flag"
                  value={selected.biasWarning ? "YES" : "—"}
                  alert={!!selected.biasWarning}
                />
              </div>
            </div>

            <div className="border-t border-border pt-3 mt-3 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
              <span>FLAGGED · {selected.flaggedAt}</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                MODEL_v4.09 · STREAMING
              </span>
            </div>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-3">
          <div className="glass rounded-xl p-5 h-[calc(100vh-13rem)] overflow-y-auto">
            <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-secondary text-glow-secondary">[03]</span>
              Quick AI Summary
            </h2>

            <div className="space-y-4 mb-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  AI-Generate Summary (Bias)
                </p>
                <p className="text-xs leading-relaxed text-foreground/85 whitespace-pre-wrap font-mono">
                  {summaryStatus === "loading"
                    ? "Loading live model output..."
                    : selectedSummaryPreview["AI-Generate Summary (Bias)"]}
                </p>
              </div>

              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Suspicious Reasoning with Evidence
                </p>
                <p className="text-xs leading-relaxed text-foreground/85 whitespace-pre-wrap font-mono">
                  {summaryStatus === "loading"
                    ? "Loading live model output..."
                    : selectedSummaryPreview["Suspicious Reasoning with Evidence"]}
                </p>
              </div>

              <div className="border-t border-border/60 pt-4 space-y-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    AI-Generate Summary (non-bias)
                  </p>
                  <p className="text-xs leading-relaxed text-foreground/85 whitespace-pre-wrap font-mono">
                    {summaryStatus === "loading"
                      ? "Loading live model output..."
                      : selectedSummaryPreview["AI-Generate Summary (non-bias)"]}
                  </p>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Reasoning with Evidence
                  </p>
                  <p className="text-xs leading-relaxed text-foreground/85 whitespace-pre-wrap font-mono">
                    {summaryStatus === "loading"
                      ? "Loading live model output..."
                      : selectedSummaryPreview["Reasoning with Evidence"]}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Key Triggers
              </p>
              <ul className="space-y-1.5">
                {selected.triggers.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                    <span className="mt-1 h-1 w-1 rounded-full bg-secondary shrink-0 shadow-[0_0_6px_var(--secondary)]" />
                    <span>{t}</span>
                  </li>
                ))}
                {selected.triggers.length === 0 && (
                  <li className="text-xs text-muted-foreground">No triggers recorded.</li>
                )}
              </ul>
            </div>

            {selected.biasWarning && (
              <div className="rounded-lg border border-warning/40 bg-warning/10 p-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-warning mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="h-3 w-3" /> Bias Warning
                </p>
                <p className="text-xs text-foreground/90">{selected.biasWarning}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  icon,
  pulse,
}: {
  label: string;
  value: number | string;
  accent: "primary" | "danger" | "warning" | "success";
  icon: React.ReactNode;
  pulse?: boolean;
}) {
  const styles = {
    primary: "text-primary text-glow-primary border-primary/30",
    danger: "text-destructive text-glow-danger border-destructive/40",
    warning: "text-warning border-warning/30",
    success: "text-success text-glow-success border-success/30",
  }[accent];
  return (
    <div className={cn("glass rounded-lg p-4 border", styles, pulse && "animate-pulse-glow")}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        {icon}
      </div>
      <p className="mt-2 font-mono text-3xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
  alert,
}: {
  label: string;
  value: number | string;
  alert?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3 text-center",
        alert ? "border-warning/40 bg-warning/10" : "border-border bg-background/40",
      )}
    >
      <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-mono text-lg font-bold", alert && "text-warning")}>{value}</p>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border transition-all",
        active
          ? "border-primary/60 bg-primary/15 text-primary text-glow-primary"
          : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
      )}
    >
      {children}
    </button>
  );
}
