# Decisions

- Routing: Single-page app without router to keep GitHub Pages simple.
- Data: GitHub REST API for public repos, best-effort commit fetch per repo.
- Private access: Cloudflare Worker proxy with token in secrets and 60s cache.
- Base path: Use `VITE_BASE_PATH` for GitHub Pages deployment.
