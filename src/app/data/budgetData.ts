// Mock Canadian budget data

export interface BudgetCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface YearlyBudget {
  year: number;
  total: number;
  categories: BudgetCategory[];
}

export const federalBudget2025: YearlyBudget = {
  year: 2025,
  total: 468500000000, // $468.5 billion
  categories: [
    { name: "Elderly Benefits", amount: 76200000000, percentage: 16.3, color: "#0B2545" },
    { name: "Health Transfers", amount: 52800000000, percentage: 11.3, color: "#193865" },
    { name: "Employment Insurance", amount: 27300000000, percentage: 5.8, color: "#234b7f" },
    { name: "Children & Families", amount: 31200000000, percentage: 6.7, color: "#2e5f99" },
    { name: "National Defence", amount: 34700000000, percentage: 7.4, color: "#3670ae" },
    { name: "Indigenous Services", amount: 18900000000, percentage: 4.0, color: "#5385ba" },
    { name: "Public Debt Charges", amount: 46800000000, percentage: 10.0, color: "#051220" },
    { name: "Infrastructure", amount: 23400000000, percentage: 5.0, color: "#719bc6" },
    { name: "Education & Skills", amount: 14000000000, percentage: 3.0, color: "#9ab8d6" },
    { name: "Immigration", amount: 9400000000, percentage: 2.0, color: "#c3d4e6" },
    { name: "Environment & Climate", amount: 21100000000, percentage: 4.5, color: "#e8eef5" },
    { name: "Other Programs", amount: 112700000000, percentage: 24.0, color: "#64748b" },
  ],
};

/** Category / sector labels — same source for filters, table, and charts (federal view). */
export const FEDERAL_CATEGORY_NAMES: readonly string[] = federalBudget2025.categories.map((c) => c.name);

export const federalBudgetHistory = [
  { year: 2020, total: 355600000000 },
  { year: 2021, total: 378900000000 },
  { year: 2022, total: 413200000000 },
  { year: 2023, total: 434800000000 },
  { year: 2024, total: 449200000000 },
  { year: 2025, total: 468500000000 },
];

/** Years with federal totals in `federalBudgetHistory` / `getFederalBudgetForYear` (ascending). */
export const FEDERAL_DATA_YEARS: readonly number[] = federalBudgetHistory.map((h) => h.year);

/** Demo years for provincial view (charts use 2025 snapshot; year drives labels). */
export const PROVINCIAL_DATA_YEARS: readonly number[] = [2023, 2024, 2025];

/** Demo years for municipal view (`municipalBudgets2025`). */
export const MUNICIPAL_DATA_YEARS: readonly number[] = [2023, 2024, 2025];

/** Approximate population for per-capita demo figures (scaled with total). */
const POPULATION_CANADA = 38_000_000;

export interface FederalBudgetSnapshot {
  year: number;
  total: number;
  perCapita: number;
  yoyPercent: number;
  categories: BudgetCategory[];
}

/** Federal totals and category mix for a fiscal year (demo: scaled from 2025 profile). */
export function getFederalBudgetForYear(year: number): FederalBudgetSnapshot {
  const row = federalBudgetHistory.find((h) => h.year === year);
  const total = row?.total ?? federalBudget2025.total;
  const prevYear = federalBudgetHistory.find((h) => h.year === year - 1);
  const yoyPercent =
    prevYear && prevYear.total > 0
      ? ((total - prevYear.total) / prevYear.total) * 100
      : 4.3;
  const perCapita = Math.round(total / POPULATION_CANADA);
  const scale = total / federalBudget2025.total;
  const categories = federalBudget2025.categories.map((c) => ({
    ...c,
    amount: Math.round(c.amount * scale),
  }));
  return { year, total, perCapita, yoyPercent, categories };
}

/**
 * Aggregate KPIs across `federalBudgetHistory` for the federal “All Year” default
 * (before a fiscal year is selected).
 */
export function getFederalBudgetAllYearsSummary(): {
  averageTotal: number;
  averagePerCapita: number;
  periodGrowthPercent: number;
} {
  const history = federalBudgetHistory;
  const n = history.length;
  const averageTotal = history.reduce((s, h) => s + h.total, 0) / n;
  let sumPc = 0;
  for (const h of history) {
    sumPc += getFederalBudgetForYear(h.year).perCapita;
  }
  const averagePerCapita = Math.round(sumPc / n);
  const first = history[0]!;
  const last = history[n - 1]!;
  const periodGrowthPercent =
    first.total > 0 ? ((last.total - first.total) / first.total) * 100 : 0;
  return { averageTotal, averagePerCapita, periodGrowthPercent };
}

export function formatBillions(amount: number): string {
  return `$${(amount / 1e9).toFixed(2)}B`;
}

export const provincialBudgets2025 = [
  {
    province: "Ontario",
    total: 214300000000,
    perCapita: 14234,
    topCategories: [
      { name: "Health", amount: 85700000000, percentage: 40.0 },
      { name: "Education", amount: 38600000000, percentage: 18.0 },
      { name: "Social Services", amount: 21400000000, percentage: 10.0 },
      { name: "Infrastructure", amount: 17100000000, percentage: 8.0 },
      { name: "Other", amount: 51500000000, percentage: 24.0 },
    ],
  },
  {
    province: "Quebec",
    total: 141900000000,
    perCapita: 16341,
    topCategories: [
      { name: "Health", amount: 59600000000, percentage: 42.0 },
      { name: "Education", amount: 24100000000, percentage: 17.0 },
      { name: "Social Services", amount: 15600000000, percentage: 11.0 },
      { name: "Infrastructure", amount: 11400000000, percentage: 8.0 },
      { name: "Other", amount: 31200000000, percentage: 22.0 },
    ],
  },
  {
    province: "British Columbia",
    total: 83200000000,
    perCapita: 15471,
    topCategories: [
      { name: "Health", amount: 33300000000, percentage: 40.0 },
      { name: "Education", amount: 15800000000, percentage: 19.0 },
      { name: "Social Services", amount: 7500000000, percentage: 9.0 },
      { name: "Infrastructure", amount: 6700000000, percentage: 8.0 },
      { name: "Other", amount: 19900000000, percentage: 24.0 },
    ],
  },
  {
    province: "Alberta",
    total: 73400000000,
    perCapita: 16140,
    topCategories: [
      { name: "Health", amount: 28700000000, percentage: 39.0 },
      { name: "Education", amount: 14000000000, percentage: 19.0 },
      { name: "Social Services", amount: 6600000000, percentage: 9.0 },
      { name: "Infrastructure", amount: 5900000000, percentage: 8.0 },
      { name: "Other", amount: 18200000000, percentage: 25.0 },
    ],
  },
  {
    province: "Manitoba",
    total: 23100000000,
    perCapita: 16547,
    topCategories: [
      { name: "Health", amount: 9700000000, percentage: 42.0 },
      { name: "Education", amount: 3900000000, percentage: 17.0 },
      { name: "Social Services", amount: 2500000000, percentage: 11.0 },
      { name: "Infrastructure", amount: 1900000000, percentage: 8.0 },
      { name: "Other", amount: 5100000000, percentage: 22.0 },
    ],
  },
  {
    province: "Saskatchewan",
    total: 18900000000,
    perCapita: 15745,
    topCategories: [
      { name: "Health", amount: 7600000000, percentage: 40.0 },
      { name: "Education", amount: 3400000000, percentage: 18.0 },
      { name: "Social Services", amount: 1700000000, percentage: 9.0 },
      { name: "Infrastructure", amount: 1500000000, percentage: 8.0 },
      { name: "Other", amount: 4700000000, percentage: 25.0 },
    ],
  },
];

/** Provincial sector labels — same for filters, charts, and category tables. */
export const PROVINCIAL_CATEGORY_NAMES: readonly string[] = [
  "Health",
  "Education",
  "Social Services",
  "Infrastructure",
  "Other",
];

/** Municipal sector labels — aligned with `municipalBudgets2025` category names. */
export const MUNICIPAL_CATEGORY_NAMES: readonly string[] = [
  "Transportation",
  "Emergency Services",
  "Parks & Recreation",
  "Water & Waste",
  "Other",
];

export const PROVINCIAL_CATEGORY_COLORS: Record<string, string> = {
  Health: "#0B2545",
  Education: "#193865",
  "Social Services": "#234b7f",
  Infrastructure: "#318cca",
  Other: "#94a3b8",
};

export type ProvincialBudgetRow = (typeof provincialBudgets2025)[number];

export function getProvincialBudgetRow(province: string): ProvincialBudgetRow | undefined {
  return provincialBudgets2025.find((p) => p.province === province);
}

/** Category with the largest share of the budget (for “top category” column). */
export function getHighestSpendCategory(p: ProvincialBudgetRow) {
  return p.topCategories.reduce((a, b) => (a.percentage >= b.percentage ? a : b));
}

export const municipalBudgets2025 = [
  {
    city: "Toronto",
    province: "ON",
    total: 16300000000,
    perCapita: 5541,
    topCategories: [
      { name: "Transportation", amount: 4900000000, percentage: 30.0 },
      { name: "Emergency Services", amount: 2600000000, percentage: 16.0 },
      { name: "Parks & Recreation", amount: 1300000000, percentage: 8.0 },
      { name: "Water & Waste", amount: 2100000000, percentage: 13.0 },
      { name: "Other", amount: 5400000000, percentage: 33.0 },
    ],
  },
  {
    city: "Montreal",
    province: "QC",
    total: 6800000000,
    perCapita: 3773,
    topCategories: [
      { name: "Transportation", amount: 2000000000, percentage: 29.0 },
      { name: "Emergency Services", amount: 1100000000, percentage: 16.0 },
      { name: "Parks & Recreation", amount: 550000000, percentage: 8.0 },
      { name: "Water & Waste", amount: 820000000, percentage: 12.0 },
      { name: "Other", amount: 2330000000, percentage: 35.0 },
    ],
  },
  {
    city: "Vancouver",
    province: "BC",
    total: 1900000000,
    perCapita: 2885,
    topCategories: [
      { name: "Transportation", amount: 570000000, percentage: 30.0 },
      { name: "Emergency Services", amount: 290000000, percentage: 15.0 },
      { name: "Parks & Recreation", amount: 190000000, percentage: 10.0 },
      { name: "Water & Waste", amount: 230000000, percentage: 12.0 },
      { name: "Other", amount: 620000000, percentage: 33.0 },
    ],
  },
  {
    city: "Calgary",
    province: "AB",
    total: 4700000000,
    perCapita: 3358,
    topCategories: [
      { name: "Transportation", amount: 1400000000, percentage: 30.0 },
      { name: "Emergency Services", amount: 710000000, percentage: 15.0 },
      { name: "Parks & Recreation", amount: 380000000, percentage: 8.0 },
      { name: "Water & Waste", amount: 610000000, percentage: 13.0 },
      { name: "Other", amount: 1600000000, percentage: 34.0 },
    ],
  },
  {
    city: "Ottawa",
    province: "ON",
    total: 4200000000,
    perCapita: 4042,
    topCategories: [
      { name: "Transportation", amount: 1300000000, percentage: 31.0 },
      { name: "Emergency Services", amount: 630000000, percentage: 15.0 },
      { name: "Parks & Recreation", amount: 340000000, percentage: 8.0 },
      { name: "Water & Waste", amount: 550000000, percentage: 13.0 },
      { name: "Other", amount: 1380000000, percentage: 33.0 },
    ],
  },
  {
    city: "Edmonton",
    province: "AB",
    total: 3900000000,
    perCapita: 3823,
    topCategories: [
      { name: "Transportation", amount: 1200000000, percentage: 31.0 },
      { name: "Emergency Services", amount: 590000000, percentage: 15.0 },
      { name: "Parks & Recreation", amount: 310000000, percentage: 8.0 },
      { name: "Water & Waste", amount: 470000000, percentage: 12.0 },
      { name: "Other", amount: 1330000000, percentage: 34.0 },
    ],
  },
];

export type MunicipalBudgetRow = (typeof municipalBudgets2025)[number];

/** Display order for municipal comparison charts (matches wireframe). */
export const MUNICIPAL_CHART_CITY_ORDER = [
  "Toronto",
  "Montreal",
  "Vancouver",
  "Calgary",
  "Ottawa",
  "Edmonton",
] as const;

export const MUNICIPAL_CATEGORY_COLORS: Record<string, string> = {
  Transportation: "#0B2545",
  "Emergency Services": "#193865",
  "Parks & Recreation": "#234b7f",
  "Water & Waste": "#318cca",
  Other: "#94a3b8",
};

/** Demo scaling by fiscal year (API uses the same logic). */
export function getMunicipalBudgetsForYear(year: number): MunicipalBudgetRow[] {
  const base = 2025;
  const t = year - base;
  const totalFactor = 1 + t * 0.012;
  const perCapFactor = 1 + t * 0.008;
  return municipalBudgets2025.map((row) => ({
    ...row,
    total: Math.round(row.total * totalFactor),
    perCapita: Math.round(row.perCapita * perCapFactor),
    topCategories: row.topCategories.map((c) => ({
      ...c,
      amount: Math.round(c.amount * totalFactor),
      percentage: c.percentage,
    })),
  }));
}

export function getMunicipalBudgetsForAllYears(): MunicipalBudgetRow[] {
  // For the demo dataset, category percentages remain constant while amounts scale linearly
  // with the year-based factor. So we can average the factors over the available years.
  const base = 2025;
  const years = [...MUNICIPAL_DATA_YEARS];
  const avgT = years.reduce((s, y) => s + (y - base), 0) / years.length;
  const totalFactor = 1 + avgT * 0.012;
  const perCapFactor = 1 + avgT * 0.008;

  return municipalBudgets2025.map((row) => ({
    ...row,
    total: Math.round(row.total * totalFactor),
    perCapita: Math.round(row.perCapita * perCapFactor),
    topCategories: row.topCategories.map((c) => ({
      ...c,
      amount: Math.round(c.amount * totalFactor),
      percentage: c.percentage,
    })),
  }));
}

export function getMunicipalBudgetRow(
  city: string,
  rows: MunicipalBudgetRow[],
): MunicipalBudgetRow | undefined {
  return rows.find((r) => r.city === city);
}

export function getHighestMunicipalCategory(row: MunicipalBudgetRow) {
  return row.topCategories.reduce((a, b) => (a.percentage >= b.percentage ? a : b));
}