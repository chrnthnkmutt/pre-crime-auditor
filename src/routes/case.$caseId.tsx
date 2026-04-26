import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getCase, riskLevel, type Case } from "@/lib/cases";
import { RiskMeter } from "@/components/RiskMeter";
import { XAIPanel } from "@/components/XAIPanel";
import { EvidenceList } from "@/components/EvidenceList";
import { AuditFormPanel } from "@/components/AuditFormPanel";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Brain,
  FolderOpen,
  ScanLine,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Target,
  AlertTriangle,
  FileEdit,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/case/$caseId")({
  head: ({ params }) => ({
    meta: [
      { title: `Case ${params.caseId} — Pre-Crime Bias Auditor` },
      { name: "description", content: "Detailed digital case file with explainable AI breakdown and audit tools." },
    ],
  }),
  loader: ({ params }): Case => {
    const c = getCase(params.caseId);
    if (!c) throw notFound();
    return c;
  },
  component: CaseFileView,
});

type Tab = "ai" | "evidence" | "xai";

function CaseFileView() {
  const initialCase = Route.useLoaderData() as Case;
  const [tab, setTab] = useState<Tab>("ai");
  const [riskScore, setRiskScore] = useState(initialCase.riskScore);
  const [auditOpen, setAuditOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [updatedExplanation, setUpdatedExplanation] = useState<string | null>(null);
  const [cleared, setCleared] = useState(false);
  const [auditMeta, setAuditMeta] = useState<{ time: number; bias: boolean; accuracy: number } | null>(null);
  const [startTime] = useState(Date.now());

  const c: Case = initialCase;
  const lvl = riskLevel(riskScore);
  const overrideUnlocked = riskScore < 40;

  function handleSubmit(data: { category: string; errorType: string; evidenceId: string; notes: string }) {
    setAuditOpen(false);
    setAdjusting(true);
    setSubmitted(true);

    // Animate risk meter decreasing
    setTimeout(() => {
      const adjusted = Math.max(15, riskScore - 38);
      setRiskScore(adjusted);
      setUpdatedExplanation(
        `Context adjusted. Misclassification detected in "${data.errorType}". Lexical and geo-cluster features down-weighted by 0.42. Re-evaluation suggests prediction is no longer actionable.`,
      );
      setAuditMeta({
        time: Math.round((Date.now() - startTime) / 1000),
        bias: data.errorType.toLowerCase().includes("bias"),
        accuracy: 92,
      });
      setAdjusting(false);
    }, 600);
  }

  function handleOverride() {
    setCleared(true);
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = useMemo(
    () => [
      { id: "ai", label: "AI Profile", icon: <Brain className="h-3.5 w-3.5" /> },
      { id: "evidence", label: "Raw Evidence", icon: <FolderOpen className="h-3.5 w-3.5" /> },
      { id: "xai", label: "XAI Breakdown", icon: <ScanLine className="h-3.5 w-3.5" /> },
    ],
    [],
  );

  if (cleared) {
    return <CaseClearedScreen caseId={c.id} citizenName={c.citizenName} auditMeta={auditMeta} />;
  }

  return (
    <div className="px-6 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          DASHBOARD
        </Link>
        <span className="font-mono text-[10px] text-muted-foreground">
          CASE FILE · <span className="text-foreground">{c.id}</span>
        </span>
      </div>

      {/* Header */}
      <div className="glass rounded-xl p-5 mb-4 scanline">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Subject Profile
            </p>
            <h1 className="text-2xl font-bold mt-1">{c.citizenName}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-mono">{c.citizenId}</span> · {c.district}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase px-2 py-1 rounded border border-secondary/40 bg-secondary/10 text-secondary">
                {c.predictedCrime}
              </span>
              {c.biasWarning && (
                <span className="font-mono text-[10px] uppercase px-2 py-1 rounded border border-warning/40 bg-warning/10 text-warning flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Bias Suspected
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAuditOpen(true)}
              className="flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 hover:border-glow transition-all"
            >
              <FileEdit className="h-4 w-4" /> Open Audit Form
            </button>
            <button
              onClick={handleOverride}
              disabled={!overrideUnlocked}
              className={cn(
                "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all",
                overrideUnlocked
                  ? "gradient-primary text-primary-foreground glow-primary hover:scale-105"
                  : "border border-border bg-muted/40 text-muted-foreground cursor-not-allowed opacity-60",
              )}
            >
              {overrideUnlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              System Override
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left tabs */}
        <section className="col-span-12 lg:col-span-8">
          <div className="glass rounded-xl">
            <div className="flex items-center border-b border-border px-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-colors",
                    tab === t.id ? "text-primary text-glow-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.icon}
                  {t.label}
                  {tab === t.id && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary shadow-[0_0_10px_var(--primary)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-5 min-h-[28rem]">
              {tab === "ai" && (
                <div className="animate-fade-in space-y-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      AI-Generated Summary
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/90">{c.aiSummary}</p>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Suspicion Reasoning
                    </p>
                    <ul className="space-y-2">
                      {c.triggers.map((t, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 rounded-md bg-background/50 border border-border p-3 text-sm"
                        >
                          <Sparkles className="h-4 w-4 shrink-0 text-secondary mt-0.5" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {c.suspiciousPhrases.length > 0 && (
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        Highlighted Phrases <span className="text-destructive">[flagged]</span>
                      </p>
                      <div className="space-y-2">
                        {c.suspiciousPhrases.map((p, i) => (
                          <blockquote
                            key={i}
                            className="rounded-md border-l-2 border-destructive bg-destructive/5 px-3 py-2 text-sm font-mono text-foreground/90 italic"
                          >
                            <mark className="bg-destructive/30 text-foreground px-1 rounded">
                              "{p}"
                            </mark>
                          </blockquote>
                        ))}
                      </div>
                    </div>
                  )}

                  {updatedExplanation && (
                    <div className="rounded-lg border border-success/40 bg-success/10 p-4 animate-fade-in">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-success mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3" /> AI Re-Evaluation
                      </p>
                      <p className="text-sm text-foreground/90">{updatedExplanation}</p>
                    </div>
                  )}
                </div>
              )}

              {tab === "evidence" && (
                <div className="animate-fade-in">
                  <EvidenceList case={c} />
                </div>
              )}

              {tab === "xai" && (
                <div className="animate-fade-in">
                  <XAIPanel features={c.features} biasWarning={c.biasWarning} />
                </div>
              )}
            </div>
          </div>

          {submitted && auditMeta && (
            <div className="mt-4 glass rounded-xl p-5 animate-fade-in">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                <span className="font-mono text-xs text-success text-glow-success">[POST-AUDIT]</span>
                Submission Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <PostAuditCard
                  label="Audit Accuracy"
                  value={`${auditMeta.accuracy}%`}
                  icon={<Target className="h-4 w-4" />}
                  progress={auditMeta.accuracy}
                  accent="success"
                />
                <PostAuditCard
                  label="Time Taken"
                  value={`${auditMeta.time}s`}
                  icon={<Clock className="h-4 w-4" />}
                  progress={Math.min(100, (auditMeta.time / 60) * 100)}
                  accent="primary"
                />
                <PostAuditCard
                  label="Bias Detected"
                  value={auditMeta.bias ? "YES" : "NO"}
                  icon={<AlertTriangle className="h-4 w-4" />}
                  progress={auditMeta.bias ? 100 : 0}
                  accent={auditMeta.bias ? "warning" : "success"}
                />
              </div>
            </div>
          )}
        </section>

        {/* Right risk panel */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="glass rounded-xl p-5 sticky top-20">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center mb-4">
              Live Risk Assessment
            </p>
            <div className={cn("flex justify-center transition-all", adjusting && "animate-flicker")}>
              <RiskMeter score={riskScore} size={220} />
            </div>

            <div className="mt-5 space-y-2">
              <RiskRow label="Status" value={lvl.toUpperCase()} />
              <RiskRow label="Override Threshold" value="< 40%" />
              <RiskRow label="Model" value="v4.09 / pcm-x" />
              <RiskRow label="Confidence" value="0.87" />
            </div>

            {!overrideUnlocked && (
              <div className="mt-4 rounded-md border border-border bg-background/40 p-3 text-center">
                <Lock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Override locked · risk above threshold
                </p>
              </div>
            )}
            {overrideUnlocked && (
              <div className="mt-4 rounded-md border border-success/40 bg-success/10 p-3 text-center animate-fade-in">
                <Unlock className="h-4 w-4 mx-auto text-success mb-1" />
                <p className="font-mono text-[10px] uppercase tracking-wider text-success text-glow-success">
                  Override unlocked
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      <AuditFormPanel open={auditOpen} onClose={() => setAuditOpen(false)} case={c} onSubmit={handleSubmit} />
    </div>
  );
}

function RiskRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs border-b border-border/50 pb-2">
      <span className="font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold text-foreground">{value}</span>
    </div>
  );
}

function PostAuditCard({
  label,
  value,
  icon,
  progress,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  progress: number;
  accent: "primary" | "success" | "warning";
}) {
  const colorVar = { primary: "var(--primary)", success: "var(--success)", warning: "var(--warning)" }[accent];
  return (
    <div className="rounded-lg border border-border bg-background/40 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <span style={{ color: colorVar }}>{icon}</span>
      </div>
      <p className="font-mono text-2xl font-bold mb-2" style={{ color: colorVar }}>
        {value}
      </p>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${progress}%`, backgroundColor: colorVar, boxShadow: `0 0 8px ${colorVar}` }}
        />
      </div>
    </div>
  );
}

function CaseClearedScreen({
  caseId,
  citizenName,
  auditMeta,
}: {
  caseId: string;
  citizenName: string;
  auditMeta: { time: number; bias: boolean; accuracy: number } | null;
}) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
      <div className="glass rounded-2xl p-12 max-w-lg w-full text-center scanline">
        <div className="relative mx-auto mb-6 h-24 w-24">
          <div className={cn("absolute inset-0 rounded-full bg-success/20 transition-transform duration-700", phase >= 1 ? "scale-100" : "scale-0")} />
          <div className={cn("absolute inset-2 rounded-full bg-success/30 transition-transform duration-700 delay-100", phase >= 1 ? "scale-100" : "scale-0")} />
          <div className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-500", phase >= 2 ? "opacity-100" : "opacity-0")}>
            <CheckCircle2 className="h-14 w-14 text-success text-glow-success" strokeWidth={2.5} />
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-success text-glow-success">
          System Override Confirmed
        </p>
        <h1 className="text-3xl font-bold mt-2">Case Cleared</h1>
        <p className="text-sm text-muted-foreground mt-2">
          <span className="font-mono">{caseId}</span> — {citizenName} has been removed from active surveillance.
        </p>

        {auditMeta && (
          <div className="mt-6 grid grid-cols-3 gap-3 text-left">
            <div className="rounded-md border border-border bg-background/40 p-3">
              <p className="font-mono text-[9px] uppercase text-muted-foreground">Accuracy</p>
              <p className="font-mono text-lg font-bold text-success">{auditMeta.accuracy}%</p>
            </div>
            <div className="rounded-md border border-border bg-background/40 p-3">
              <p className="font-mono text-[9px] uppercase text-muted-foreground">Time</p>
              <p className="font-mono text-lg font-bold text-primary">{auditMeta.time}s</p>
            </div>
            <div className="rounded-md border border-border bg-background/40 p-3">
              <p className="font-mono text-[9px] uppercase text-muted-foreground">Bias</p>
              <p className={cn("font-mono text-lg font-bold", auditMeta.bias ? "text-warning" : "text-success")}>
                {auditMeta.bias ? "YES" : "NO"}
              </p>
            </div>
          </div>
        )}

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-primary hover:scale-105 transition-transform"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Inbox
        </Link>
      </div>
    </div>
  );
}
