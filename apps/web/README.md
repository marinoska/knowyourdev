# KYD Web (apps/web)

React + TypeScript + Vite frontend for KYD. It communicates with the KYD API and uses Auth0 for authentication.

## Prerequisites
- Node.js >= 22
- pnpm 9.x

## Setup
1. Install dependencies from the repo root:
   - pnpm install
2. Configure environment variables:
   - Copy .env.example to .env
   - Fill values: VITE_KYD_API_ENDPOINT, VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID, VITE_AUTH0_API_AUDIENCE
   - Note: Vite reads env vars prefixed with VITE_, and .env.example mirrors a working .env
3. Start in development:
   - From repo root: pnpm --filter ./apps/web dev
   - Or inside this folder: pnpm dev

## Scripts
- pnpm dev — start Vite dev server
- pnpm build — type-check and build for production
- pnpm preview — preview the production build
- pnpm lint — lint the codebase

## Environment variables
- VITE_KYD_API_ENDPOINT — base URL of the API (e.g., http://knowyourdev.local:5050/api)
- VITE_AUTH0_API_AUDIENCE — API audience used for token requests
- VITE_AUTH0_DOMAIN — Auth0 tenant domain (e.g., your-tenant.eu.auth0.com)
- VITE_AUTH0_CLIENT_ID — Auth0 application client ID

These variables are consumed in:
- src/api/client.ts (API host)
- src/api/ApiClientProvider.tsx (Auth0 audience)
- src/main.tsx (Auth0 domain/clientId and API audience)

## Useful paths
- src/components — UI components
- src/pages — pages and forms
- src/api — API client and React Query setup

## Troubleshooting
- If API requests fail with 401, ensure you are authenticated and the audience matches the API’s expected AUTH0_API_AUDIENCE
- If the app cannot reach the API, verify VITE_KYD_API_ENDPOINT and CORS (ALLOWED_ORIGIN on the API)
- Node version mismatch — ensure Node >= 22
