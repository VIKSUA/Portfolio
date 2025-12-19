import type { RepoCardData } from "../types/github.types";
import { EmptyState } from "./EmptyState";
import { Loading } from "./Loading";
import { RepoCard } from "./RepoCard";

type RepoListProps = {
  title: string;
  subtitle?: string;
  repos: RepoCardData[];
  isLoading: boolean;
  error?: string;
  onRetry?: () => void;
  emptyMessage: string;
  showStats?: boolean;
};

export const RepoList = ({
  title,
  subtitle,
  repos,
  isLoading,
  error,
  onRetry,
  emptyMessage,
  showStats = true
}: RepoListProps) => (
  <section className="mt-10">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      {onRetry && error && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-200 transition hover:border-slate-500"
        >
          Retry
        </button>
      )}
    </div>

    <div className="mt-6">
      {isLoading && <Loading />}

      {!isLoading && error && (
        <EmptyState
          title="Unable to load repositories"
          message={error}
        />
      )}

      {!isLoading && !error && repos.length === 0 && (
        <EmptyState title="Nothing here yet" message={emptyMessage} />
      )}

      {!isLoading && !error && repos.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {repos.map((repo) => (
            <RepoCard key={repo.name} repo={repo} showStats={showStats} />
          ))}
        </div>
      )}
    </div>
  </section>
);
