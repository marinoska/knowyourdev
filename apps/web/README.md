# KYD Web (apps/web)

React + TypeScript + Vite frontend for KYD. It communicates with the KYD API and uses Auth0 for authentication.

## Prerequisites
- Node.js >= 22
- pnpm 9.x

## Setup
1. Install dependencies from the repo root:
   - pnpm install
2. Build workspaces (first-time setup or after dependency changes):
   - pnpm build
3. Configure environment variables:
   - Copy .env.example to .env
   - Fill values: VITE_KYD_API_ENDPOINT, VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, VITE_AUTH0_API_AUDIENCE
   - Note: Vite reads env vars prefixed with VITE_, and .env.example mirrors a working .env
4. Start in development:
   - From repo root: pnpm --filter ./apps/web dev
   - Or inside this folder: pnpm dev

## Scripts
- pnpm dev — start Vite dev server
- pnpm build — type-check and build for production
- pnpm preview — preview the production build
- pnpm lint — lint the codebase


## Useful paths
- src/components — UI components
- src/pages — pages and forms
- src/api — API client and React Query setup

