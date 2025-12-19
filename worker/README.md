# Cloudflare Worker Proxy

This worker proxies private GitHub repo metadata using a GitHub token stored in Worker secrets. It never sends the token to the client.

## Setup

1. Install Wrangler in the worker directory.

```bash
cd worker
npm install
```

2. Set the GitHub token secret (requires `repo` scope for private repos).

```bash
npx wrangler secret put GITHUB_TOKEN
```

3. (Optional) Set allowed origin.

```bash
npx wrangler secret put ALLOWED_ORIGIN
```

4. Run locally.

```bash
npx wrangler dev
```

5. Deploy.

```bash
npx wrangler deploy
```

## Endpoint

`GET /private/repos?username=YOUR_GITHUB_USERNAME`

Returns safe metadata: name, description, language, updated_at, html_url, topics (if available), last_commit_message, last_commit_date.

## Notes

- If the token lacks access, the worker returns an error explaining missing scope.
- Basic caching is enabled for 60s and there is a simple per-IP throttling in-memory.
