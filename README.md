# GitHub Pages Portfolio

Quick-to-clone React + TypeScript portfolio for GitHub Pages that lists your GitHub repositories.

## Features
- Public repositories fetched directly from GitHub (no token required).
- Private repositories fetched through a Cloudflare Worker proxy using a GitHub token stored as a Worker secret.
- Minimal metadata only (name, description, language, updated date, last commit, topics if available). No source code is exposed.

## Quick start (local)
```bash
git clone <your-repo-url>
cd portfolio
npm install
cp .env.example .env
npm run dev
```

Edit `.env` with your values:
```bash
VITE_GITHUB_USERNAME=your-github-username
VITE_BASE_PATH=/portfolio/
VITE_PRIVATE_API_BASE=https://your-worker.example.workers.dev
VITE_DISPLAY_NAME=Your Name
VITE_TITLE=Frontend Engineer
VITE_LOCATION=Toronto, Canada
VITE_LINKEDIN_URL=https://www.linkedin.com/in/your-profile
```

`VITE_PRIVATE_API_BASE` is optional. Without it, the Private panel stays disabled.

## Environment variables
- Vite exposes only `VITE_*` variables at build time.
- Define local values in `.env` (do not commit it).
- For GitHub Pages, set the same variables as GitHub Actions repository variables.
- Email is intentionally not part of the portfolio to avoid spam.

## Deploy frontend to GitHub Pages
1. Set `VITE_BASE_PATH` to your repo name, e.g. `/my-portfolio/`.
2. Add repository variables in GitHub (Actions → Variables).
3. Push to `main` and the workflow in `.github/workflows/deploy.yml` will publish.

Suggested variables:
- `VITE_BASE_PATH`
- `VITE_GITHUB_USERNAME`
- `VITE_DISPLAY_NAME`
- `VITE_TITLE`
- `VITE_LOCATION`
- `VITE_LINKEDIN_URL`
- `VITE_PRIVATE_API_BASE` (optional)

## Deploy Worker to Cloudflare
See `worker/README.md` for full instructions.

High-level:
```bash
cd worker
npm install
npx wrangler secret put GITHUB_TOKEN
npx wrangler deploy
```

Security note: the GitHub token is stored only in Worker secrets and never exposed in the frontend.

## Troubleshooting
- If you hit rate limits, wait a few minutes and retry.
- If private repos fail to load, confirm the token has `repo` scope and the Worker is deployed.
