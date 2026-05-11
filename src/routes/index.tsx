import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Brain,
  Eye,
  AlertTriangle,
  ScrollText,
  Lock,
  ArrowRight,
  Activity,
  Zap,
  Network,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pre-Crime Bias Auditor — Human Oversight for AI Predictions" },
      {
        name: "description",
        content:
          "A human-in-the-loop console that audits predictive crime AI for bias, missing context, and wrongful accusations.",
      },
      { property: "og:title", content: "Pre-Crime Bias Auditor — Human Oversight for AI Predictions" },
      { property: "og:description", content: "Audit AI-generated risk scores. Detect bias. Override wrongful accusations." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden scanline">
        <div className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(circle_at_20%_20%,var(--primary)/0.15,transparent_50%),radial-gradient(circle_at_80%_60%,var(--secondary)/0.12,transparent_55%)]" />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-primary text-glow-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Pre-Crime Division · Model v4.09
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
            When the AI says <span className="text-destructive text-glow-danger">guilty</span>,<br />
            <span className="text-glow-primary">a human says wait.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-foreground/80">
            The Pre-Crime Bias Auditor is a control center for reviewing predictive risk scores —
            surfacing the missing context, hidden bias, and silent errors behind every machine accusation.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 rounded-md gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-primary hover:scale-105 transition-transform"
            >
              <Lock className="h-4 w-4" /> Enter Analyst Console
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/audit-log"
              className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/15 transition-all"
            >
              <ScrollText className="h-4 w-4" /> View Audit Log
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <HeroStat value="94%" label="Avg. AI Confidence" accent="danger" />
            <HeroStat value="6 / 6" label="Cases w/ Bias Found" accent="warning" />
            <HeroStat value="100%" label="Human-Reviewed" accent="success" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-secondary text-glow-secondary">
            // Capabilities
          </p>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold">Built to interrogate the machine</h2>
          <p className="mt-3 text-foreground/70 max-w-2xl mx-auto">
            Every feature is designed to expose the gap between what the AI sees and what actually happened.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Feature
            icon={<Activity className="h-5 w-5" />}
            title="Live Risk Inbox"
            desc="Stream of incoming AI predictions sorted by severity, with critical alerts pulsing for immediate review."
            tag="01"
          />
          <Feature
            icon={<Brain className="h-5 w-5" />}
            title="XAI Justification"
            desc="See the exact feature weights driving each prediction — and where the model's logic breaks down."
            tag="02"
          />
          <Feature
            icon={<AlertTriangle className="h-5 w-5" />}
            title="Bias Detection"
            desc="Automatic warnings when the model relies on patterns that ignore human context or sanctioned behavior."
            tag="03"
          />
          <Feature
            icon={<Eye className="h-5 w-5" />}
            title="Evidence Reconciliation"
            desc="Compare the AI's claim against raw evidence: chats, logs, IDs, and the human truth behind the data."
            tag="04"
          />
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="System Override"
            desc="One-click clearance once an audit reduces risk below threshold — wrongful accusations don't pass."
            tag="05"
          />
          <Feature
            icon={<ScrollText className="h-5 w-5" />}
            title="Immutable Audit Log"
            desc="Every override, every correction, every reasoning note — preserved for accountability and oversight."
            tag="06"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-border/60 bg-card/20">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center mb-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary text-glow-primary">
              // Workflow
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold">Three steps from accusation to truth</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Step n="01" title="Receive" icon={<Network className="h-5 w-5" />}
              desc="AI flags a citizen with a risk score. Inbox surfaces the case in real time." />
            <Step n="02" title="Audit" icon={<Brain className="h-5 w-5" />}
              desc="Inspect the XAI breakdown, raw evidence, and any bias warnings — then file a structured correction." />
            <Step n="03" title="Override" icon={<ShieldCheck className="h-5 w-5" />}
              desc="Risk score drops. Once below threshold, override the prediction and protect the accused." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="glass rounded-2xl p-10 border-glow scanline">
          <Zap className="h-8 w-8 mx-auto text-secondary text-glow-secondary" />
          <h2 className="mt-4 text-2xl md:text-3xl font-bold">
            The model isn't always right. <span className="text-glow-primary">You are the safeguard.</span>
          </h2>
          <p className="mt-3 text-sm text-foreground/70">
            Sign in to the analyst console and start auditing live cases.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-md gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-primary hover:scale-105 transition-transform"
          >
            <Lock className="h-4 w-4" /> Access the Console
          </Link>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ value, label, accent }: { value: string; label: string; accent: "danger" | "warning" | "success" }) {
  const styles = {
    danger: "text-destructive text-glow-danger border-destructive/40",
    warning: "text-warning border-warning/40",
    success: "text-success text-glow-success border-success/40",
  }[accent];
  return (
    <div className={`glass rounded-lg border p-4 ${styles}`}>
      <p className="font-mono text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    </div>
  );
}

function Feature({ icon, title, desc, tag }: { icon: React.ReactNode; title: string; desc: string; tag: string }) {
  return (
    <div className="glass rounded-xl p-5 hover:border-glow transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 border border-primary/30 text-primary group-hover:glow-primary transition-all">
          {icon}
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">[{tag}]</span>
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1.5 text-xs text-foreground/70 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ n, title, icon, desc }: { n: string; title: string; icon: React.ReactNode; desc: string }) {
  return (
    <div className="glass rounded-xl p-6 relative">
      <span className="absolute top-4 right-5 font-mono text-3xl font-bold text-primary/20">{n}</span>
      <div className="flex h-10 w-10 items-center justify-center rounded-md gradient-primary glow-primary text-primary-foreground">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-2 text-xs text-foreground/70 leading-relaxed">{desc}</p>
    </div>
  );
}
  const [selectedId, setSelectedId] = useState(cases[0].id);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "critical" | "bias">("all");

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
  }, [query, filter]);

  const selected = cases.find((c) => c.id === selectedId) ?? cases[0];

  const stats = useMemo(() => {
    const total = cases.length;
    const critical = cases.filter((c) => riskLevel(c.riskScore) === "critical").length;
    const bias = cases.filter((c) => c.biasWarning).length;
    const cleared = cases.filter((c) => c.status === "cleared").length;
    return { total, critical, bias, cleared };
  }, []);

  return (
    <div className="px-6 py-6">
      {/* Stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Active Alerts" value={stats.total} accent="primary" icon={<Zap className="h-4 w-4" />} />
        <StatCard label="Critical Risk" value={stats.critical} accent="danger" icon={<AlertTriangle className="h-4 w-4" />} pulse />
        <StatCard label="Bias Flagged" value={stats.bias} accent="warning" icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Cleared (24h)" value={stats.cleared} accent="success" icon={<ShieldCheck className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* LEFT — Inbox */}
        <section className="col-span-12 lg:col-span-4 xl:col-span-3">
          <div className="glass rounded-xl flex flex-col h-[calc(100vh-13rem)]">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="font-mono text-xs text-primary text-glow-primary">[01]</span>
                  Case Alert Inbox
                </h2>
                <span className="font-mono text-[10px] text-muted-foreground">{filtered.length} / {cases.length}</span>
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
                <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>All</FilterPill>
                <FilterPill active={filter === "critical"} onClick={() => setFilter("critical")}>Critical</FilterPill>
                <FilterPill active={filter === "bias"} onClick={() => setFilter("bias")}>
                  <Filter className="h-3 w-3 mr-1 inline" />Bias
                </FilterPill>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filtered.map((c) => (
                <div key={c.id} onClick={(e) => { e.preventDefault(); setSelectedId(c.id); }}>
                  <CaseInboxItem case={c} active={c.id === selectedId} />
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-8">No matching cases.</p>
              )}
            </div>
          </div>
        </section>

        {/* CENTER — Risk Meter */}
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

        {/* RIGHT — Quick AI Summary */}
        <section className="col-span-12 lg:col-span-3">
          <div className="glass rounded-xl p-5 h-[calc(100vh-13rem)] overflow-y-auto">
            <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-secondary text-glow-secondary">[03]</span>
              Quick AI Summary
            </h2>

            <p className="text-xs leading-relaxed text-foreground/85 mb-5">
              {selected.aiSummary}
            </p>

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
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
        {icon}
      </div>
      <p className="mt-2 font-mono text-3xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function MiniStat({ label, value, alert }: { label: string; value: number | string; alert?: boolean }) {
  return (
    <div className={cn("rounded-lg border p-3 text-center", alert ? "border-warning/40 bg-warning/10" : "border-border bg-background/40")}>
      <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-mono text-lg font-bold", alert && "text-warning")}>{value}</p>
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
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
