export const BUDGET_LEVEL_OPTIONS = ["Federal", "Province", "Municipal"] as const;

export type BudgetLevel = (typeof BUDGET_LEVEL_OPTIONS)[number];

export function getBudgetApiBase(): string {
  const explicit = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "");
  if (explicit) return explicit;

  // Vite dev: use same-origin paths so `server.proxy` forwards /api → localhost:3001.
  // Avoids cross-origin issues (and some browser policies) when the UI is on :5173.
  if (import.meta.env.DEV) {
    return "";
  }

  const newsUrl = import.meta.env.VITE_NEWS_API_URL as string | undefined;
  if (newsUrl) {
    try {
      return new URL(newsUrl).origin;
    } catch {
      /* ignore invalid URL */
    }
  }
  return "http://localhost:3001";
}

export function toBudgetLevelParam(level: BudgetLevel): "federal" | "province" | "municipal" {
  if (level === "Federal") return "federal";
  if (level === "Province") return "province";
  return "municipal";
}
