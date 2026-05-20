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
- `npm run dev:all` - watch `data/cases.json`, regenerate the DB, and run the dev server together
- `npm run build` - build the app for production
- `npm run build:dev` - build with development mode settings
- `npm run preview` - preview a production build locally
- `npm run lint` - run ESLint
- `npm run format` - format the code with Prettier
- `npm run generate-db` - regenerate `data/cases.db` and the browser-ready copies in `public/`

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
 - OpenAI SDK (Microsoft Foundry-compatible)

## Notes

- The login flow is demo-only and accepts any non-empty credentials.
- Case data is seeded from `data/cases.json` and loaded through SQLite in the browser when the generated DB is available.
- Server-side rendering falls back to the JSON seed, so the app can boot even if the browser-only SQLite assets are not present yet.
- If you change dependencies, restart the dev server so the app picks up the new install tree.

## XAI Provider

- Live XAI generation is optional and uses the OpenAI SDK against a Microsoft Foundry-compatible endpoint.
- Put your local model key in `.env` as `api_key=...`.
- The app reads `api_key` from `.env` for authentication and uses the Foundry endpoint/deployment defaults below unless overridden.
- Configure these environment variables if you want to override the defaults:
```bash
# Preferred/local (simple):
api_key=...

# Alternate names accepted by the server code (any of these will work):
AI_FOUNDRY_API_KEY=...           # common explicit name
FOUNDRY_OPENAI_API_KEY=...       # alternate
OPENAI_API_KEY=...               # OpenAI-compatible name

# Endpoint and model overrides (optional):
AI_FOUNDRY_ENDPOINT=https://your-foundry-openai-compatible-endpoint/openai/v1/
AI_FOUNDRY_DEPLOYMENT_NAME=gpt-5.4-mini

``` 

- The server code will also accept other legacy/alternate env names for compatibility. If these values are not provided, the app uses a sensible default endpoint and deployment (see defaults below).

- Default values used by the app when not overridden:

	- Endpoint: `https://formula1-test1-resource.cognitiveservices.azure.com/openai/v1/`
	- Deployment / model: `gpt-5.4-mini`

- If the variables are missing or the model call fails, the UI falls back to the seeded explanations in `data/cases.json`.
- Do not commit `.env`; keep it local to your machine.

## Database (local development)

- Seed data is stored in `data/cases.json` and a generated SQLite binary is written to `data/cases.db` when you run the generator script.
- To keep the browser copy in sync, use:

```bash
npm install
npm run dev:all
```

- `npm run generate-db` also writes `public/data/cases.db` and `public/sql-wasm.wasm` so the dev server can serve them immediately; these generated browser assets are ignored by git.
- At runtime the app uses `sql.js` (SQLite compiled to WASM) in the browser and first tries to load `/data/cases.db`; if that fails, it falls back to the JSON seed.

- Note: `sql.js` is marked as an optional dependency in `package.json`. If you don't need the in-browser SQLite binary you can still run the app and rely on the JSON seed.

These steps keep the seed editable as JSON (`data/cases.json`) while producing a fast, queryable SQLite file for testing and offline workflows.
