# KnowYourDev (KYD)

An AI platform for evaluating software engineersq
KYD analyzes CVs, scores tech stacks, and highlights strengths and red flags to help employers quickly assess developer suitability.  

> Note: This repository is a Work in Progress (WIP). Features, APIs, and documentation may change.

🌐 Try it here: [knowyourdev.onrender.com](https://knowyourdev.onrender.com/) — access requires credentials, please contact us to request them.

A monorepo for KYD containing the API service and the Web frontend. It uses pnpm workspaces and Turborepo for task orchestration.

## Screenshots

<!--
  When hosted, files in a public/ directory are accessible via URLs.
  For GitHub Pages, use: https://<username>.github.io/<repository-name>/<path-to-screenshot.png>
  Example for this repo:
  https://marinoska.github.io/knowyourdev/apps/web/public/screenshot-1.png
-->
<div style="display:flex; gap:12px; align-items:flex-start; justify-content:center; flex-wrap:nowrap; overflow-x:auto; padding:8px 0;">
  <img src="https://marinoska.github.io/knowyourdev/apps/web/public/screenshot-1.png" alt="Candidate Matching" style="height:200px; width:auto; flex:0 0 auto;" />
  <img src="https://marinoska.github.io/knowyourdev/apps/web/public/screenshot-2.png" alt="Project Overview" style="height:200px; width:auto; flex:0 0 auto;" />
  <img src="https://marinoska.github.io/knowyourdev/apps/web/public/screenshot-3.png" alt="Insights and Risk Assessment" style="height:200px; width:auto; flex:0 0 auto;" />
</div>

Small note: if you are browsing the repository on GitHub, the images above are shown via hosted URLs. If you prefer local relative paths for repository rendering, replace the src attributes with ./apps/web/public/screenshot-*.png.

## Contents
- apps/
  - api/ — Node.js/Express TypeScript API with AI-powered resume/project extraction
  - web/ — React + TypeScript + Vite frontend

## Prerequisites
- Node.js >= 22
- pnpm 9.x (this repo is configured with pnpm)

Check your versions:
- node -v
- pnpm -v

## Getting started
1. Clone the repo.
2. Install dependencies at the root:
   pnpm install
3. Build all workspaces (first-time setup or after dependency changes):
   pnpm build

4. Set up environment variables:
   - Copy apps/api/.env.example to apps/api/.env and fill required values.
   - Copy apps/web/.env.example to apps/web/.env and fill required values.
   - Note: .env.example files mirror the existing .env files’ keys and comments. Do not add inferred variables; keep them in sync with the real .env files.

5. Run the app(s) in development mode:
   - Run all dev tasks concurrently via Turborepo:
     pnpm dev
   - Or run a single app from its directory:
     - API: pnpm --filter @kyd/api dev (or pnpm dev if package defines it)
     - Web: pnpm --filter @kyd/web dev (or pnpm dev)

Note: Turborepo is configured in turbo.json. Tasks like build, dev, and lint are orchestrated across workspaces.

## Common scripts
From the repository root:
- pnpm dev — run all dev processes (non-cached, persistent) via turbo
- pnpm build — build all apps/packages via turbo
- pnpm lint — run lint across the workspace via turbo
- pnpm format — format codebase with Prettier

You can also target a specific app with pnpm --filter. Examples:
- pnpm --filter ./apps/api build
- pnpm --filter ./apps/web dev

## API service (apps/api)
- Entry point: apps/api/src/index.ts
- HTTP/HTTPS: Controlled via SCHEME env variable (http or https). For https, certs are read from apps/api/src/cert/key.pem and cert.pem.
- MongoDB: Startup/shutdown logic handled via app/mongo.ts utilities. Ensure related env vars are provided.
- AI/LLM: Resume and project extraction chains live under apps/api/src/chain. They rely on prompts and an AI model provider configured in apps/api/src/app/aiModel.ts and utils.

To run only the API in dev, from root:
- pnpm --filter ./apps/api dev

## Web app (apps/web)
- Vite React + TypeScript. The scaffolded README in apps/web/README.md contains Vite/ESLint notes.
- API client lives under apps/web/src/api.

To run only the Web app in dev, from root:
- pnpm --filter ./apps/web dev


