# Pre-Crime Bias Auditor

An app that simulates a human-in-the-loop review console for AI-generated risk scores. The UI centers on auditing predicted cases, inspecting explainable AI output, reconciling evidence, and overriding bad decisions.

## What it does

- Presents a landing page for the auditor console
- Provides a demo login flow for analyst access
- Lists case files in an audit log
- Opens detailed case views with risk scoring, evidence review, and XAI breakdowns
- Uses a polished, cinematic UI built with React, TanStack Router, and Tailwind CSS

## Getting Started

This repository is set up to run with npm.

```bash
npm install
npm run dev
```

The app will start on:

- `http://localhost:8080/`

## Available Scripts

- `npm run dev` - start the local Vite development server
- `npm run build` - build the app for production
- `npm run build:dev` - build using the development mode settings
- `npm run preview` - preview a production build locally
- `npm run lint` - run ESLint
- `npm run format` - format the code with Prettier

## Project Structure

- `src/routes/index.tsx` - landing page
- `src/routes/login.tsx` - demo analyst login
- `src/routes/audit-log.tsx` - audit log list
- `src/routes/case.$caseId.tsx` - detailed case review screen
- `src/routes/__root.tsx` - root layout and document shell
- `src/router.tsx` - router factory
- `src/components/` - shared UI panels and widgets
- `src/lib/` - mock auth, case data, and utilities

## Stack

- React 19
- TanStack Start / TanStack Router
- Vite
- Tailwind CSS
- Radix UI and Lucide icons

## Notes

- The login flow is demo-only and accepts any non-empty credentials.
- Case data is mocked locally in the app.
- If the dev server is already running, restart it after dependency changes so TanStack SSR picks up the new install tree.
