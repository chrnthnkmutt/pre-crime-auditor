import { Link } from "@tanstack/react-router";
import { Activity, Shield, LogOut } from "lucide-react";
import { useAuth, logout } from "@/lib/auth";

export function AppHeader() {
  const user = useAuth();
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
          <NavItem to="/">Home</NavItem>
          {user && <NavItem to="/dashboard">Dashboard</NavItem>}
          {user && <NavItem to="/audit-log">Audit Log</NavItem>}
          {!user && <NavItem to="/login">Login</NavItem>}
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
            <span>Auditor: <span className="text-foreground">{user?.username ?? "—"}</span></span>
          </div>
          {user && (
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-mono text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
              aria-label="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          )}
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
