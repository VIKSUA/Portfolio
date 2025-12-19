const getEnv = (key: string, fallback = "") => {
  const value = import.meta.env[key] as string | undefined;
  return value?.trim() || fallback;
};

export const getGitHubUsername = () => getEnv("VITE_GITHUB_USERNAME");

export const getPrivateApiBase = () => getEnv("VITE_PRIVATE_API_BASE");

export const getDisplayName = () => getEnv("VITE_DISPLAY_NAME", "Your Name");

export const getTitle = () => getEnv("VITE_TITLE", "Frontend Engineer");

export const getLocation = () => getEnv("VITE_LOCATION", "Toronto, Canada");

export const getLinkedInUrl = () => getEnv("VITE_LINKEDIN_URL");

export const getBasePath = () => getEnv("VITE_BASE_PATH", "/");
