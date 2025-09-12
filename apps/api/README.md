# KYD API (apps/api)

Node.js/Express TypeScript API powering KYD. It exposes endpoints for uploads and AI-powered resume/project extraction chains.

## Prerequisites
- Node.js >= 22
- pnpm 9.x
- MongoDB connection (Atlas or self-hosted)
- OpenAI API key (and any optional providers you enable)

## Setup
1. Install dependencies from repo root:
   - pnpm install
2. Configure environment variables:
   - Copy .env.example to .env
   - Fill values (OpenAI, MongoDB, logger, etc.). See .env.example which mirrors a working .env.
3. Start in development:
   - From repo root: pnpm --filter ./apps/api dev
   - Or inside this folder: pnpm dev

## Scripts
- pnpm dev — run with tsx + nodemon (watches src/index.ts)
- pnpm build — compile TypeScript to dist (tsc and tsc-alias)
- pnpm start — run the compiled server (dist/index.js)
- pnpm lint — lint source files
- pnpm format — format code
- pnpm fetch-cv — run local script to fetch a CV sample

## Environment variables
This service reads env vars on startup. The .env.example file mirrors keys and comments. Important keys:
- PORT: server port (e.g., 5050)
- SCHEME: http or https
- LOGGER_FILE, LOGGER_LEVEL: logging configuration
- ALLOWED_ORIGIN: CORS origin for the web app (e.g., http://localhost:5173)
- OPENAI_API_KEY, OPENAI_MODEL: LLM provider
- LANGCHAIN_*: tracing and project settings
- MONGO_CONNECTION: MongoDB connection string
- AUTH0_API_AUDIENCE, AUTH0_API_ISSUER: API auth configuration
- CLOUDFLARE_*: R2 storage settings (optional)
- HF_TOKEN: Hugging Face token (optional)

## HTTPS notes
If SCHEME=https, local certs are read from ./src/cert/key.pem and ./src/cert/cert.pem (see src/index.ts). For local development, you can keep SCHEME=http.

## Code map
- src/index.ts — server bootstrap (http/https, graceful shutdown)
- src/app/* — env, logger, mongo utilities, AI model setup
- src/chain/* — extraction chains, prompts, and utilities
- src/routes/* — controllers and routing (REST API)
- src/services/* — domain services (uploads, etc.)

## Troubleshooting
- Missing env var: check apps/api/.env and messages like "<KEY> is undefined" (src/app/env.ts throws if missing)
- Mongo connection: verify MONGO_CONNECTION and that your IP is whitelisted
- OpenAI: ensure OPENAI_API_KEY is valid and has access to the configured model
- HTTPS: if enabled, ensure key/cert paths are correct, otherwise use SCHEME=http
