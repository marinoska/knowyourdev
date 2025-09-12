# KnowYourDev (KYD)

An AI platform for evaluating software engineers.
KYD analyzes CVs, scores tech stacks, and highlights strengths and red flags to help employers quickly assess developer suitability.  

> Note: This repository is a Work in Progress.

🌐 Try it here: [knowyourdev.onrender.com](https://knowyourdev.onrender.com/) — access requires credentials, please contact us to request them.

A monorepo for KYD containing the API service and the Web frontend. It uses pnpm workspaces and Turborepo for task orchestration.

## Screenshots

<div align="center" style="display: grid; grid-auto-flow: column; grid-auto-columns: min-content; justify-content: center; gap: 12px; overflow-x: auto; padding: 8px 0;">
  <a href="https://pub-20950701b3d644acb7590ce6d0873f5b.r2.dev/screenshot-1.png" title="Click to view full size">
    <img src="https://pub-20950701b3d644acb7590ce6d0873f5b.r2.dev/screenshot-1.png" alt="Candidate Matching" width="200" loading="lazy" />
  </a>
  <a href="https://pub-20950701b3d644acb7590ce6d0873f5b.r2.dev/screenshot-2.png" title="Click to view full size">
    <img src="https://pub-20950701b3d644acb7590ce6d0873f5b.r2.dev/screenshot-2.png" alt="Project Overview" width="200" loading="lazy" />
  </a>
  <a href="https://pub-20950701b3d644acb7590ce6d0873f5b.r2.dev/screenshot-3.png" title="Click to view full size">
    <img src="https://pub-20950701b3d644acb7590ce6d0873f5b.r2.dev/screenshot-3.png" alt="Insights and Risk Assessment" width="200" loading="lazy" />
  </a>
  <a href="https://pub-20950701b3d644acb7590ce6d0873f5b.r2.dev/screenshot-4.png" title="Click to view full size">
    <img src="https://pub-20950701b3d644acb7590ce6d0873f5b.r2.dev/screenshot-4.png" alt="Candidate Matching Details" width="200" loading="lazy" />
  </a>
</div>

## Contents
- apps/
  - api/ — Node.js/Express TypeScript API with AI-powered resume/project extraction
  - web/ — React + TypeScript + Vite frontend

## Prerequisites
- Node.js >= 22
- pnpm 9.x (this repo is configured with pnpm)

Check your versions:
- `node -v`
- `pnpm -v`

## Getting started
1. Clone the repo.
2. Install dependencies at the root:
   `pnpm install`
3. Build all workspaces (first-time setup or after dependency changes):
   `pnpm build`

4. Set up environment variables:
   - Copy `apps/api/.env.example` to `apps/api/.env` and fill required values.
   - Copy `apps/web/.env.example` to `apps/web/.env` and fill required values.
   - Note: .env.example files mirror the existing .env files’ keys and comments. Do not add inferred variables; keep them in sync with the real .env files.

5. Run the app(s) in development mode:
   - Run all dev tasks concurrently via Turborepo:
    `pnpm dev`
   - Or run a single app from its directory:
     - API: `pnpm --filter @kyd/api dev` (or `pnpm dev` if package defines it)
     - Web: `pnpm --filter @kyd/web dev` (or `pnpm dev`)

Note: Turborepo is configured in `turbo.json`. Tasks like build, dev, and lint are orchestrated across workspaces.

## Common scripts
From the repository root:
- `pnpm dev` — run all dev processes (non-cached, persistent) via turbo
- `pnpm build` — build all apps/packages via turbo
- `pnpm lint` — run lint across the workspace via turbo

You can also target a specific app with pnpm --filter. Examples:
- `pnpm --filter ./apps/api build`
- `pnpm --filter ./apps/web dev`

## API service (apps/api)
- Entry point: `apps/api/src/index.ts`
- HTTP/HTTPS: Controlled via `SCHEME` env variable (`http` or `https`). For `https`, certs are read from `apps/api/src/cert/key.pem` and `apps/api/src/cert/cert.pem`. 
- MongoDB: Startup/shutdown logic handled via `apps/api/src/app/mongo.ts` utilities. Ensure related env vars are provided.
- AI/LLM: Resume and project extraction chains live under `apps/api/src/chain`. They rely on prompts and an AI model provider configured in `apps/api/src/app/aiModel.ts` and utils.

To run only the API in dev, from root:
- `pnpm --filter ./apps/api dev`

## Web app (apps/web)
- Vite React + TypeScript. The scaffolded README in `apps/web/README.md` contains Vite/ESLint notes.
- API client lives under `apps/web/src/api`.

To run only the Web app in dev, from root:
- `pnpm --filter ./apps/web dev`


