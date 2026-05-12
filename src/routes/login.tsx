import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Lock, User, Shield, AlertCircle, Loader2, Fingerprint } from "lucide-react";
import { cn } from "@/lib/utils";
import { login as loginUser } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Analyst Login — Pre-Crime Bias Auditor" },
      { name: "description", content: "Secure login portal for authorized auditors of the Pre-Crime Division." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Credentials required. Both fields must be provided.");
      return;
    }
    setLoading(true);
    // Mock authentication delay
    setTimeout(() => {
      setLoading(false);
      loginUser(username.trim());
      navigate({ to: "/dashboard" });
    }, 900);
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-50 [background:radial-gradient(circle_at_30%_40%,var(--primary)/0.18,transparent_55%),radial-gradient(circle_at_70%_70%,var(--secondary)/0.12,transparent_55%)]" />
      <div className="absolute inset-0 -z-10 scanline opacity-40" />

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl gradient-primary glow-primary mb-3">
            <Shield className="h-7 w-7 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Pre-Crime Division · Secure Channel
          </p>
          <h1 className="mt-1 text-2xl font-bold text-glow-primary">Analyst Authentication</h1>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-xl p-6 border-glow space-y-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border pb-3">
            <Fingerprint className="h-3.5 w-3.5 text-primary" />
            <span>Identity Verification Required</span>
            <span className="ml-auto text-success flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> ENCRYPTED
            </span>
          </div>

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <Field
            label="Operator ID"
            icon={<User className="h-4 w-4" />}
            value={username}
            onChange={setUsername}
            placeholder="k.anders"
            autoFocus
          />

          <Field
            label="Access Cipher"
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            type="password"
          />

          <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
            <label className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
              <input type="checkbox" className="accent-primary" defaultChecked />
              <span>Persist session</span>
            </label>
            <a className="text-primary hover:text-glow-primary cursor-pointer">Lost cipher?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full inline-flex items-center justify-center gap-2 rounded-md gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground glow-primary transition-all",
              loading ? "opacity-70 cursor-wait" : "hover:scale-[1.02]"
            )}
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating…</>
            ) : (
              <><Lock className="h-4 w-4" /> Initiate Console Access</>
            )}
          </button>

          <p className="text-center font-mono text-[10px] text-muted-foreground pt-2 border-t border-border">
            DEMO MODE · Any non-empty credentials accepted
          </p>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">← Return to overview</Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label, icon, value, onChange, placeholder, type = "text", autoFocus,
}: {
  label: string; icon: React.ReactNode; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string; autoFocus?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        <input
          autoFocus={autoFocus}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md bg-input border border-border pl-10 pr-3 py-2.5 text-sm font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>
    </div>
  );
}
