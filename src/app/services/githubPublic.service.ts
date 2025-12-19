import type { GitHubCommitApi, GitHubRepoApi, RepoCardData } from "../types/github.types";

const PUBLIC_REPOS_ENDPOINT = "https://api.github.com/users";
const COMMITS_ENDPOINT = "https://api.github.com/repos";

const toRepoCard = (repo: GitHubRepoApi): RepoCardData => ({
  name: repo.name,
  description: repo.description,
  language: repo.language,
  stars: repo.stargazers_count,
  forks: repo.forks_count,
  updatedAt: repo.updated_at,
  htmlUrl: repo.html_url
});

const fetchLastCommit = async (owner: string, repo: string) => {
  const response = await fetch(`${COMMITS_ENDPOINT}/${owner}/${repo}/commits?per_page=1`);
  if (!response.ok) {
    throw new Error(`Failed to load commit for ${repo}`);
  }
  const data = (await response.json()) as GitHubCommitApi[];
  const first = data[0];
  if (!first) return undefined;
  return {
    message: first.commit.message,
    date: first.commit.author.date
  };
};

export type PublicRepoOptions = {
  limit?: number;
  includeForks?: boolean;
};

export const fetchPublicRepos = async (
  username: string,
  { limit = 8, includeForks = false }: PublicRepoOptions = {}
): Promise<RepoCardData[]> => {
  const response = await fetch(
    `${PUBLIC_REPOS_ENDPOINT}/${username}/repos?per_page=100&sort=updated`
  );

  if (!response.ok) {
    throw new Error("Unable to load public repositories.");
  }

  const repos = (await response.json()) as GitHubRepoApi[];
  const filtered = includeForks ? repos : repos.filter((repo) => !repo.fork);
  const sliced = filtered.slice(0, limit);

  const commitResults = await Promise.allSettled(
    sliced.map((repo) => fetchLastCommit(repo.owner.login, repo.name))
  );

  return sliced.map((repo, index) => {
    const base = toRepoCard(repo);
    const result = commitResults[index];
    if (result.status === "fulfilled" && result.value) {
      return {
        ...base,
        lastCommitMessage: result.value.message,
        lastCommitDate: result.value.date
      };
    }
    return base;
  });
};
