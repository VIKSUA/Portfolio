export type GitHubRepoApi = {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
  fork: boolean;
  owner: {
    login: string;
  };
};

export type GitHubCommitApi = {
  sha: string;
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
};

export type RepoCardData = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  htmlUrl: string;
  topics?: string[];
  lastCommitMessage?: string;
  lastCommitDate?: string;
};

export type PrivateRepoResponse = {
  name: string;
  description: string | null;
  language: string | null;
  updated_at: string;
  html_url?: string;
  topics?: string[];
  last_commit_message?: string;
  last_commit_date?: string;
};
