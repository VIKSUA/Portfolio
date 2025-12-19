# AGENTS

## Project overview
- Frontend: Vite + React + TypeScript portfolio page showing a list of GitHub repositories.
- Public repos are fetched without a token.
- Private repos metadata is fetched through a Cloudflare Worker proxy (GitHub token stored only in Worker secrets).

## Repository structure
- `/src` — frontend app
- `/worker` — Cloudflare Worker (separate Node project)
- `openspec/changes/...` — OpenSpec artifacts (if present)

## Environment & secrets rules
- `.env` must NEVER be committed.
- `.env.example` must be kept in sync and contain only non-sensitive placeholders.
- Frontend env vars must be `VITE_*` (public, bundled into the client).
- GitHub token must NEVER be stored in frontend env or committed; only stored via Cloudflare Worker secrets:
  - `wrangler secret put GITHUB_TOKEN`
- Worker CORS/allowed origins must not expose secrets; only metadata is returned.

## OpenSpec workflow
- When working under `openspec/changes/<change>/tasks.md`, pick exactly one unchecked task.
- Implement only what is needed for that task.
- Run minimal verification (typecheck/build if applicable).
- Commit with a Conventional Commits message that matches the task.
- Mark the task as done (`[x]`) and commit that change (same commit or follow-up docs commit).
- Only then proceed to the next task.
- Never batch multiple tasks into one commit unless explicitly asked.
- Prefer small commits, but always end the task with a commit.

## Commit rules (Conventional Commits)
- Use Conventional Commits: `<type>: <description>`
- Allowed types: `feat`, `fix`, `refactor`, `chore`, `docs`
- Use imperative, present tense, English, no trailing period.
- One logical change per commit.
- Examples:
  - `feat: make profile fields env-driven`
  - `fix: handle github rate limit fallback`
  - `chore: add commit message linting`

## Do not do
- Don’t add commit rules to README.
- Don’t commit `.env`, tokens, API keys.
- Don’t move files between `/src` and `/worker` without explicit request.
- Don’t introduce extra tooling unless requested.
- Keep changes minimal and reversible.
