const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;

const requestCounts = new Map();

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
});

const jsonResponse = (data, init) => {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
      ...(init?.headers || {})
    }
  });
};

const checkRateLimit = (ip) => {
  if (!ip) return null;
  const now = Date.now();
  const entry = requestCounts.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  entry.count += 1;
  requestCounts.set(ip, entry);
  if (entry.count > RATE_LIMIT_MAX) {
    return entry.resetAt;
  }
  return null;
};

const fetchLastCommit = async (owner, repo, token) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
    {
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "portfolio-worker"
      }
    }
  );

  if (!response.ok) return undefined;
  const data = await response.json();
  const first = data[0];
  if (!first) return undefined;
  return {
    message: first.commit?.message,
    date: first.commit?.author?.date
  };
};

const handlePrivateRepos = async (request, env, ctx) => {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  if (!username) {
    return jsonResponse({ error: "Missing username query parameter." }, { status: 400 });
  }

  const token = env.GITHUB_TOKEN;
  if (!token) {
    return jsonResponse(
      { error: "Missing GITHUB_TOKEN secret in worker environment." },
      { status: 500 }
    );
  }

  const cache = caches.default;
  const cacheKey = new Request(url.toString(), { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const response = await fetch(
    "https://api.github.com/user/repos?per_page=100&sort=updated&visibility=private",
    {
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "portfolio-worker",
        Accept: "application/vnd.github+json"
      }
    }
  );

  if (!response.ok) {
    const body = await response.text();
    return jsonResponse(
      {
        error:
          "Unable to load private repositories. Ensure the token has repo scope and access to the user.",
        details: body
      },
      { status: response.status }
    );
  }

  const repos = await response.json();
  const usernameLower = username.toLowerCase();
  const filtered = repos.filter((repo) => repo?.owner?.login?.toLowerCase() === usernameLower);

  const commitResults = await Promise.allSettled(
    filtered.map((repo) => fetchLastCommit(repo.owner.login, repo.name, token))
  );

  const payload = filtered.map((repo, index) => {
    const commit = commitResults[index];
    return {
      name: repo.name,
      description: repo.description,
      language: repo.language,
      topics: repo.topics,
      updated_at: repo.updated_at,
      html_url: repo.html_url,
      last_commit_message: commit.status === "fulfilled" ? commit.value?.message : undefined,
      last_commit_date: commit.status === "fulfilled" ? commit.value?.date : undefined
    };
  });

  const responseBody = jsonResponse(payload, { status: 200 });
  ctx.waitUntil(cache.put(cacheKey, responseBody.clone()));
  return responseBody;
};

export default {
  async fetch(request, env, ctx) {
    const origin = env.ALLOWED_ORIGIN || "*";
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    const url = new URL(request.url);
    if (request.method !== "GET") {
      return new Response("Method not allowed", { status: 405, headers });
    }

    const ip = request.headers.get("cf-connecting-ip");
    const resetAt = checkRateLimit(ip);
    if (resetAt) {
      return jsonResponse(
        { error: "Too many requests. Please retry soon." },
        {
          status: 429,
          headers: {
            ...headers,
            "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString()
          }
        }
      );
    }

    if (url.pathname === "/private/repos") {
      const response = await handlePrivateRepos(request, env, ctx);
      response.headers.set("Access-Control-Allow-Origin", headers["Access-Control-Allow-Origin"]);
      response.headers.set("Access-Control-Allow-Methods", headers["Access-Control-Allow-Methods"]);
      response.headers.set("Access-Control-Allow-Headers", headers["Access-Control-Allow-Headers"]);
      return response;
    }

    return new Response("Not found", { status: 404, headers });
  }
};
