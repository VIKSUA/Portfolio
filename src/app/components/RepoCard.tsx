import type { RepoCardData } from "../types/github.types";
import { formatDate, formatRelative } from "../utils/format";

type RepoCardProps = {
  repo: RepoCardData;
  showStats?: boolean;
};

export const RepoCard = ({ repo, showStats = true }: RepoCardProps) => (
  <article className="flex h-full flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-slate-950/30">
    <header className="flex items-start justify-between gap-3">
      <div>
        <h3 className="font-display text-lg font-semibold text-slate-100">
          <a href={repo.htmlUrl} target="_blank" rel="noreferrer">
            {repo.name}
          </a>
        </h3>
        {repo.description && (
          <p className="mt-1 text-sm text-slate-300">{repo.description}</p>
        )}
      </div>
      {repo.language && (
        <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-300">
          {repo.language}
        </span>
      )}
    </header>

    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
      <span>Updated {formatRelative(repo.updatedAt)}</span>
      <span>{formatDate(repo.updatedAt)}</span>
      {repo.lastCommitDate && <span>Last commit {formatRelative(repo.lastCommitDate)}</span>}
    </div>

    {repo.topics && repo.topics.length > 0 && (
      <div className="flex flex-wrap gap-2 text-xs text-slate-300">
        {repo.topics.map((topic) => (
          <span
            key={topic}
            className="rounded-full border border-slate-800 bg-slate-950/60 px-2 py-1"
          >
            {topic}
          </span>
        ))}
      </div>
    )}

    {repo.lastCommitMessage && (
      <div className="rounded-lg bg-slate-950/60 p-3 text-xs text-slate-300">
        {repo.lastCommitMessage}
      </div>
    )}

    {showStats && (
      <div className="mt-auto flex flex-wrap gap-3 text-xs text-slate-400">
        <span>Stars {repo.stars}</span>
        <span>Forks {repo.forks}</span>
      </div>
    )}
  </article>
);
