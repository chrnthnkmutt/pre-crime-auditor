import { Link } from "@tanstack/react-router";
import { Activity, Shield } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-border">
      <div className="flex h-14 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-md gradient-primary glow-primary">
            <Shield className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Pre-Crime Division
            </span>
            <span className="text-sm font-semibold text-glow-primary">
              BIAS AUDITOR <span className="text-secondary">v4.09</span>
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <NavItem to="/">Dashboard</NavItem>
          <NavItem to="/audit-log">Audit Log</NavItem>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 font-mono text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
            </span>
            <span className="text-muted-foreground">SYS</span>
            <span className="text-success text-glow-success">ONLINE</span>
          </div>
          <div className="hidden md:flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span>Auditor: <span className="text-foreground">K. Anders</span></span>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md transition-all hover:text-foreground hover:bg-accent"
      activeProps={{ className: "text-primary text-glow-primary bg-accent" }}
      activeOptions={{ exact: true }}
    >
      {children}
    </Link>
  );
}
