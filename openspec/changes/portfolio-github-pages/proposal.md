# Proposal: GitHub Pages Portfolio

## Goals
- Build a static portfolio using React + TypeScript (Vite) for GitHub Pages.
- Show public GitHub repositories and last commit data without tokens.
- Provide a private section that loads via a Cloudflare Worker proxy with secrets.
- Keep UI clean, responsive, accessible, and resilient to API failures.

## Non-Goals
- Server-side rendering or dynamic backend hosting.
- Storing tokens in the frontend or GitHub Actions.
- Full analytics or blog features.

## Architecture
- Vite builds static assets for GitHub Pages.
- Public data fetched directly from GitHub REST API.
- Private data fetched through Cloudflare Worker proxy using GitHub token secret.
- ErrorBoundary and per-request handling for graceful failures.

## Risks
- GitHub REST API rate limits for unauthenticated requests.
- Private proxy requires correct token scope and Cloudflare Worker setup.

## Deployment
- GitHub Actions builds and deploys to GitHub Pages.
- Base path configured via `VITE_BASE_PATH`.
- Worker deployed separately via Wrangler.
