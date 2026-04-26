import { useMemo, useState } from "react";
import { z } from "zod";
import { type Case } from "@/lib/cases";
import { cn } from "@/lib/utils";
import { X, Paperclip, Send, AlertCircle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  case: Case;
  onSubmit: (data: { category: string; errorType: string; evidenceId: string; notes: string }) => void;
}

const CATEGORIES = ["False Positive", "Bias Detected", "Insufficient Evidence", "Context Misread", "Confirmed Risk"] as const;
const ERROR_TYPES = ["Demographic Bias", "Temporal Anomaly Misread", "Lexical Misclassification", "Geo-Cluster Bias", "None"] as const;

const PLACEHOLDER = "__select__";
const NOTES_MIN = 12;
const NOTES_MAX = 1000;

type FormErrors = Partial<Record<"category" | "errorType" | "evidenceId" | "notes", string>>;

function buildSchema(evidenceIds: string[]) {
  const evidenceCheck =
    evidenceIds.length === 0
      ? z.string()
      : z
          .string()
          .min(1, { message: "Select an evidence file to attach" })
          .refine((v) => evidenceIds.includes(v), { message: "Selected evidence is not part of this case" });

  return z.object({
    category: z
      .string()
      .min(1, { message: "Select a case category" })
      .refine((v) => (CATEGORIES as readonly string[]).includes(v), { message: "Invalid category" }),
    errorType: z
      .string()
      .min(1, { message: "Select an error type" })
      .refine((v) => (ERROR_TYPES as readonly string[]).includes(v), { message: "Invalid error type" }),
    evidenceId: evidenceCheck,
    notes: z
      .string()
      .trim()
      .min(NOTES_MIN, { message: `Notes must be at least ${NOTES_MIN} characters` })
      .max(NOTES_MAX, { message: `Notes must be under ${NOTES_MAX} characters` }),
  });
}

export function AuditFormPanel({ open, onClose, case: c, onSubmit }: Props) {
  const evidenceIds = useMemo(() => c.evidence.map((e) => e.id), [c]);
  const noEvidence = evidenceIds.length === 0;

  const [category, setCategory] = useState<string>(PLACEHOLDER);
  const [errorType, setErrorType] = useState<string>(PLACEHOLDER);
  const [evidenceId, setEvidenceId] = useState<string>(noEvidence ? "" : PLACEHOLDER);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const schema = useMemo(() => buildSchema(evidenceIds), [evidenceIds]);

  function validate(silent = false): FormErrors {
    const candidate = {
      category: category === PLACEHOLDER ? "" : category,
      errorType: errorType === PLACEHOLDER ? "" : errorType,
      evidenceId: noEvidence ? "" : evidenceId === PLACEHOLDER ? "" : evidenceId,
      notes,
    };
    const result = schema.safeParse(candidate);
    if (result.success) {
      if (!silent) setErrors({});
      return {};
    }
    const next: FormErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FormErrors;
      if (key && !next[key]) next[key] = issue.message;
    }
    if (!silent) setErrors(next);
    return next;
  }

  function handleFieldChange<K extends keyof FormErrors>(field: K, setter: (v: string) => void, value: string) {
    setter(value);
    if (submitAttempted && errors[field]) {
      // Clear this field's error optimistically; full re-validate on next blur/submit
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);
    const next = validate();
    if (Object.keys(next).length > 0) {
      // Focus first error field
      const order: (keyof FormErrors)[] = ["category", "errorType", "evidenceId", "notes"];
      const firstKey = order.find((k) => next[k]);
      if (firstKey) {
        document.getElementById(`audit-${firstKey}`)?.focus();
      }
      return;
    }
    onSubmit({
      category,
      errorType,
      evidenceId: noEvidence ? "" : evidenceId,
      notes: notes.trim(),
    });
  }

  function resetAndClose() {
    setErrors({});
    setSubmitAttempted(false);
    onClose();
  }

  const notesLen = notes.trim().length;
  const notesOver = notesLen > NOTES_MAX;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/70 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={resetAndClose}
      />
      <aside
        role="dialog"
        aria-label="Universal Audit Form"
        aria-modal="true"
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
            type="button"
            onClick={resetAndClose}
            aria-label="Close audit form"
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="p-5 space-y-5 overflow-y-auto h-[calc(100%-3.5rem)]"
        >
          <Field label="Case Category" required error={errors.category} htmlFor="audit-category">
            <NeonSelect
              id="audit-category"
              value={category}
              onChange={(v) => handleFieldChange("category", setCategory, v)}
              onBlur={() => submitAttempted && validate()}
              options={CATEGORIES as readonly string[]}
              placeholder="Select category…"
              invalid={!!errors.category}
            />
          </Field>

          <Field label="Error Type" required error={errors.errorType} htmlFor="audit-errorType">
            <NeonSelect
              id="audit-errorType"
              value={errorType}
              onChange={(v) => handleFieldChange("errorType", setErrorType, v)}
              onBlur={() => submitAttempted && validate()}
              options={ERROR_TYPES as readonly string[]}
              placeholder="Select error type…"
              invalid={!!errors.errorType}
            />
          </Field>

          <Field
            label="Evidence Attachment"
            required={!noEvidence}
            error={errors.evidenceId}
            htmlFor="audit-evidenceId"
          >
            <div className="relative">
              <Paperclip
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                  errors.evidenceId ? "text-destructive" : "text-muted-foreground",
                )}
              />
              <select
                id="audit-evidenceId"
                value={evidenceId}
                onChange={(e) => handleFieldChange("evidenceId", setEvidenceId, e.target.value)}
                onBlur={() => submitAttempted && validate()}
                disabled={noEvidence}
                aria-invalid={!!errors.evidenceId}
                aria-describedby={errors.evidenceId ? "audit-evidenceId-error" : undefined}
                className={cn(
                  "w-full rounded-md bg-input border pl-9 pr-3 py-2.5 text-sm font-mono text-foreground transition-all",
                  "focus:outline-none focus:ring-2",
                  errors.evidenceId
                    ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                    : "border-border focus:border-primary focus:ring-primary/30",
                  noEvidence && "opacity-50 cursor-not-allowed",
                )}
              >
                {noEvidence ? (
                  <option value="">— no evidence on file —</option>
                ) : (
                  <>
                    <option value={PLACEHOLDER} disabled>
                      Select evidence…
                    </option>
                    {c.evidence.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.id} — {ev.title}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </Field>

          <Field label="Auditor Notes" required error={errors.notes} htmlFor="audit-notes">
            <textarea
              id="audit-notes"
              value={notes}
              onChange={(e) => handleFieldChange("notes", setNotes, e.target.value)}
              onBlur={() => submitAttempted && validate()}
              rows={6}
              maxLength={NOTES_MAX + 200}
              aria-invalid={!!errors.notes}
              aria-describedby={errors.notes ? "audit-notes-error" : "audit-notes-counter"}
              placeholder="Document your reasoning, contextual factors, and decision rationale…"
              className={cn(
                "w-full rounded-md bg-input border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all resize-none",
                "focus:outline-none focus:ring-2",
                errors.notes
                  ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                  : "border-border focus:border-primary focus:ring-primary/30",
              )}
            />
            <div
              id="audit-notes-counter"
              className={cn(
                "mt-1.5 flex items-center justify-between font-mono text-[10px]",
                notesOver ? "text-destructive" : "text-muted-foreground",
              )}
            >
              <span>min {NOTES_MIN} chars</span>
              <span className="tabular-nums">
                {notesLen} / {NOTES_MAX}
              </span>
            </div>
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

function Field({
  label,
  required,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2"
      >
        {label}
        {required && <span className="text-destructive text-glow-danger">*</span>}
      </label>
      {children}
      {error && (
        <p
          id={htmlFor ? `${htmlFor}-error` : undefined}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 font-mono text-[10px] text-destructive animate-fade-in"
        >
          <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

function NeonSelect({
  id,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  invalid,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  options: readonly string[];
  placeholder?: string;
  invalid?: boolean;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      aria-invalid={invalid}
      aria-describedby={invalid && id ? `${id}-error` : undefined}
      className={cn(
        "w-full rounded-md bg-input border px-3 py-2.5 text-sm text-foreground transition-all",
        "focus:outline-none focus:ring-2",
        invalid
          ? "border-destructive focus:border-destructive focus:ring-destructive/30"
          : "border-border focus:border-primary focus:ring-primary/30",
      )}
    >
      {placeholder && (
        <option value={PLACEHOLDER} disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
