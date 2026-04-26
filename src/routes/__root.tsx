import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AppHeader } from "@/components/AppHeader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass rounded-xl p-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Signal Lost</p>
        <h1 className="mt-3 text-7xl font-bold text-glow-primary font-mono">404</h1>
        <h2 className="mt-2 text-lg font-semibold">Sector Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The case file or route you requested is not in the audit grid.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground glow-primary hover:scale-105 transition-transform"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pre-Crime Bias Auditor — Analyst Console" },
      {
        name: "description",
        content:
          "Human-in-the-loop AI auditing console for predictive crime models. Review, audit, and override automated risk decisions.",
      },
      { property: "og:title", content: "Pre-Crime Bias Auditor — Analyst Console" },
      { name: "twitter:title", content: "Pre-Crime Bias Auditor — Analyst Console" },
      { name: "description", content: "Audits AI predictions for bias, preventing wrongful accusations with human oversight." },
      { property: "og:description", content: "Audits AI predictions for bias, preventing wrongful accusations with human oversight." },
      { name: "twitter:description", content: "Audits AI predictions for bias, preventing wrongful accusations with human oversight." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/11ee6d40-255a-417a-b764-da7c60e60a1c/id-preview-3c264704--2019f3ff-c0fb-4bf6-b940-f8d8854576dd.lovable.app-1777210286057.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/11ee6d40-255a-417a-b764-da7c60e60a1c/id-preview-3c264704--2019f3ff-c0fb-4bf6-b940-f8d8854576dd.lovable.app-1777210286057.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
