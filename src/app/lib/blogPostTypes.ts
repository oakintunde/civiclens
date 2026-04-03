export type BlogBudgetLevel = "federal" | "provincial" | "municipal";

export type BlogPost = {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  category: string;
  level: BlogBudgetLevel;
  sourceName: string;
  excerpt: string;
  externalUrl?: string;
  content: Array<{ heading?: string; body: string }>;
};
