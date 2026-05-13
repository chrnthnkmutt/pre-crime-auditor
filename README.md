# Pre-Crime Auditor

Pre-Crime Auditor is a Minority Report-inspired demo app for reviewing AI-generated risk predictions before they become "facts." It presents a cinematic analyst console where a human can inspect the model's reasoning, compare it with evidence, flag bias, and override a bad call.

The app is intentionally fictional. It borrows the visual language of the Pre-Crime system from the film, but the actual theme here is human oversight for predictive AI.

## What You Can Do

- Open the landing page and enter the analyst console
- Sign in through a demo-only login flow
- Review a live inbox of predicted cases
- Inspect a detailed case file with risk score, evidence, and explainable AI output
- Submit an audit and lower the case risk when the model is wrong
- Browse an audit log of reviewed cases and outcomes

## How It Feels

- The landing page is styled like a Pre-Crime command center
- Case views feel like digital dossiers pulled from a future surveillance system
- Risk scores, bias warnings, and override controls are framed as a human safeguard against automation errors

## Getting Started

This project uses npm.

```bash
npm install
npm run dev
```

Then open:

- `http://localhost:8080/`

## Scripts

- `npm run dev` - start the local Vite development server
- `npm run build` - build the app for production
- `npm run build:dev` - build with development mode settings
- `npm run preview` - preview a production build locally
- `npm run lint` - run ESLint
- `npm run format` - format the code with Prettier

## Key Screens

- `src/routes/index.tsx` - cinematic landing page and entry point
- `src/routes/login.tsx` - demo analyst authentication
- `src/routes/dashboard.tsx` - live case inbox and risk overview
- `src/routes/audit-log.tsx` - historical audit log
- `src/routes/case.$caseId.tsx` - detailed case file with audit tools
- `src/routes/__root.tsx` - root layout and document shell

## Stack

- React 19
- TanStack Start / TanStack Router
- Vite
- Tailwind CSS
- Radix UI
- Lucide icons

## Notes

- The login flow is demo-only and accepts any non-empty credentials.
- Case data is mocked locally in the app.
- If you change dependencies, restart the dev server so the app picks up the new install tree.
