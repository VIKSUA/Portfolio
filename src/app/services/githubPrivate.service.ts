import type { PrivateRepoResponse, RepoCardData } from "../types/github.types";

const toRepoCard = (repo: PrivateRepoResponse): RepoCardData => ({
  name: repo.name,
  description: repo.description ?? null,
  language: repo.language ?? null,
  stars: 0,
  forks: 0,
  updatedAt: repo.updated_at,
  htmlUrl: repo.html_url || "#",
  topics: repo.topics ?? [],
  lastCommitMessage: repo.last_commit_message,
  lastCommitDate: repo.last_commit_date
});

export const fetchPrivateRepos = async (
  baseUrl: string,
  username: string
): Promise<RepoCardData[]> => {
  const response = await fetch(`${baseUrl}/private/repos?username=${username}`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Unable to load private repositories.");
  }

  const data = (await response.json()) as PrivateRepoResponse[];
  return data.map(toRepoCard);
};
