import { useState } from "react";
import { type Case } from "@/lib/cases";
import { cn } from "@/lib/utils";
import { X, Paperclip, Send } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  case: Case;
  onSubmit: (data: { category: string; errorType: string; evidenceId: string; notes: string }) => void;
}

const CATEGORIES = ["False Positive", "Bias Detected", "Insufficient Evidence", "Context Misread", "Confirmed Risk"];
const ERROR_TYPES = ["Demographic Bias", "Temporal Anomaly Misread", "Lexical Misclassification", "Geo-Cluster Bias", "None"];

export function AuditFormPanel({ open, onClose, case: c, onSubmit }: Props) {
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [errorType, setErrorType] = useState(ERROR_TYPES[0]);
  const [evidenceId, setEvidenceId] = useState(c.evidence[0]?.id ?? "");
  const [notes, setNotes] = useState("");

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/70 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-md glass-strong border-l border-border-glow",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Universal Audit Form
            </p>
            <p className="text-sm font-semibold text-glow-primary">Submit Review · {c.id}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ category, errorType, evidenceId, notes });
          }}
          className="p-5 space-y-5 overflow-y-auto h-[calc(100%-3.5rem)]"
        >
          <Field label="Case Category">
            <NeonSelect value={category} onChange={setCategory} options={CATEGORIES} />
          </Field>

          <Field label="Error Type">
            <NeonSelect value={errorType} onChange={setErrorType} options={ERROR_TYPES} />
          </Field>

          <Field label="Evidence Attachment">
            <div className="relative">
              <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={evidenceId}
                onChange={(e) => setEvidenceId(e.target.value)}
                className="w-full rounded-md bg-input border border-border pl-9 pr-3 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              >
                {c.evidence.length === 0 && <option value="">— none —</option>}
                {c.evidence.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.id} — {ev.title}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Auditor Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Document your reasoning, contextual factors, and decision rationale…"
              className="w-full rounded-md bg-input border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all resize-none"
            />
          </Field>

          <div className="pt-2">
            <button
              type="submit"
              className="group w-full flex items-center justify-center gap-2 rounded-md gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground glow-primary hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <Send className="h-4 w-4" />
              Submit Audit Review
            </button>
            <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground">
              Submission triggers AI re-evaluation · cryptographically signed
            </p>
          </div>
        </form>
      </aside>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function NeonSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md bg-input border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}
