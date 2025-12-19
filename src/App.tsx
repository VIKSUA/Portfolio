import { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "./app/components/ErrorBoundary";
import { PrivatePanel } from "./app/components/PrivatePanel";
import { RepoList } from "./app/components/RepoList";
import { fetchPublicRepos } from "./app/services/githubPublic.service";
import type { RepoCardData } from "./app/types/github.types";
import { formatDate } from "./app/utils/format";
import {
  getDisplayName,
  getGitHubUsername,
  getLinkedInUrl,
  getLocation,
  getPrivateApiBase,
  getTitle
} from "./app/utils/env";

const MAX_PUBLIC_REPOS = 8;
const INCLUDE_FORKS = false;

const AppShell = () => {
  const username = useMemo(() => getGitHubUsername(), []);
  const privateBase = useMemo(() => getPrivateApiBase(), []);
  const displayName = useMemo(() => getDisplayName(), []);
  const title = useMemo(() => getTitle(), []);
  const location = useMemo(() => getLocation(), []);
  const linkedInUrl = useMemo(() => getLinkedInUrl(), []);
  const [publicRepos, setPublicRepos] = useState<RepoCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const loadPublicRepos = useCallback(async () => {
    if (!username) {
      setError("Missing VITE_GITHUB_USERNAME. Update your .env file.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(undefined);
    try {
      const repos = await fetchPublicRepos(username, {
        limit: MAX_PUBLIC_REPOS,
        includeForks: INCLUDE_FORKS
      });
      setPublicRepos(repos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load repositories.");
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadPublicRepos();
  }, [loadPublicRepos]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Portfolio</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white">
            {displayName}
          </h1>
          <p className="mt-2 text-lg text-slate-300">
            {title} · {location}
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer">
              GitHub
            </a>
            {linkedInUrl && (
              <a href={linkedInUrl} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
          </div>
        </header>

        <RepoList
          title="Public repositories"
          subtitle="Latest work from GitHub (no token required)"
          repos={publicRepos}
          isLoading={isLoading}
          error={error}
          onRetry={loadPublicRepos}
          emptyMessage="No public repositories found."
        />

        <PrivatePanel username={username} baseUrl={privateBase} />

        <footer className="mt-12 text-xs text-slate-500">
          Last updated {formatDate(new Date().toISOString())}
        </footer>
      </div>
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <AppShell />
  </ErrorBoundary>
);

export default App;
