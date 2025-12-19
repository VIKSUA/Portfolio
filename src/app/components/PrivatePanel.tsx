import { useCallback, useMemo, useState } from "react";
import { fetchPrivateRepos } from "../services/githubPrivate.service";
import type { RepoCardData } from "../types/github.types";
import { RepoList } from "./RepoList";

const DISCLAIMER =
  "Private work is shared via limited metadata; code access can be provided on request.";

type PrivatePanelProps = {
  username: string;
  baseUrl?: string;
};

export const PrivatePanel = ({ username, baseUrl }: PrivatePanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [repos, setRepos] = useState<RepoCardData[]>([]);

  const isEnabled = useMemo(() => Boolean(baseUrl), [baseUrl]);

  const handleLoad = useCallback(async () => {
    if (!baseUrl) return;
    setIsOpen(true);
    setIsLoading(true);
    setError(undefined);
    try {
      const data = await fetchPrivateRepos(baseUrl, username);
      setRepos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load private work.");
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, username]);

  const handleToggle = () => {
    if (!isEnabled) return;
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    handleLoad();
  };

  return (
    <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">Private Work</h2>
          <p className="mt-1 text-sm text-slate-400">{DISCLAIMER}</p>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          disabled={!isEnabled}
          className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
          aria-expanded={isOpen}
        >
          {isOpen ? "Hide private work" : "Load private work"}
        </button>
      </div>

      {!isEnabled && (
        <p className="mt-4 text-sm text-slate-500">
          Private panel disabled. Set VITE_PRIVATE_API_BASE to a Cloudflare Worker URL.
        </p>
      )}

      {isOpen && (
        <div className="mt-6">
          <RepoList
            title="Private repositories"
            subtitle="Shared via Cloudflare Worker proxy"
            repos={repos}
            isLoading={isLoading}
            error={error}
            onRetry={handleLoad}
            emptyMessage="No private repositories returned by the proxy."
            showStats={false}
          />
        </div>
      )}
    </section>
  );
};
