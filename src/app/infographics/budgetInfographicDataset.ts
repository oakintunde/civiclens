import type { BudgetLevel } from "../lib/budgetApi";
import {
  getFederalBudgetAllYearsSummary,
  getFederalBudgetForYear,
  getMunicipalBudgetsForYear,
  getMunicipalBudgetRow,
  getProvincialBudgetRow,
  MUNICIPAL_CATEGORY_COLORS,
  PROVINCIAL_CATEGORY_COLORS,
  provincialBudgets2025,
  type MunicipalBudgetRow,
} from "../data/budgetData";

export type InfographicBlock = {
  name: string;
  amount: number;
  color: string;
};

export type BudgetInfographicDataset = {
  level: BudgetLevel;
  headerYearLine1: string;
  headerYearLine2: string;
  headline: string;
  subtitle: string;
  totalLabel: string;
  totalFormatted: string;
  unitNote: string;
  sourceNote: string;
  items: InfographicBlock[];
  highlightName: string | null;
};

function formatCompactCad(amount: number): string {
  if (amount >= 1e12) return `$${(amount / 1e12).toFixed(2)}T`;
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  return `$${Math.round(amount).toLocaleString("en-CA")}`;
}

function yearHeaderParts(yearStr: string): [string, string] {
  if (!yearStr) return ["All", "Yr"];
  const y = yearStr.length >= 4 ? yearStr : `20${yearStr}`;
  return [y.slice(0, 2), y.slice(2)];
}

function scaleProvincialRows(year: number) {
  const base = 2025;
  const t = year - base;
  const factor = 1 + t * 0.012;
  return provincialBudgets2025.map((p) => ({
    province: p.province,
    total: Math.round(p.total * factor),
    topCategories: p.topCategories.map((c) => ({
      name: c.name,
      amount: Math.round(c.amount * factor),
      percentage: c.percentage,
    })),
  }));
}

const PROVINCE_PALETTE = ["#2d3748", "#5a7d6a", "#6b8f7a", "#c45c4a", "#8b5a5a", "#4a5568"];

function pickColor(map: Record<string, string>, name: string, fallback: string): string {
  return map[name] ?? fallback;
}

const MAX_BLOCKS = 8;

function trimItems(items: InfographicBlock[]): InfographicBlock[] {
  const sorted = [...items].sort((a, b) => b.amount - a.amount);
  if (sorted.length <= MAX_BLOCKS) return sorted;
  const head = sorted.slice(0, MAX_BLOCKS - 1);
  const rest = sorted.slice(MAX_BLOCKS - 1);
  const otherSum = rest.reduce((s, x) => s + x.amount, 0);
  head.push({ name: "Other", amount: otherSum, color: "#64748b" });
  return head;
}

export function buildBudgetInfographicDataset(params: {
  level: BudgetLevel;
  year: string;
  sector: string;
  province: string;
  municipalSelection: string;
  municipalRows: MunicipalBudgetRow[] | null;
}): BudgetInfographicDataset | null {
  const { level, year, sector, province, municipalSelection, municipalRows } = params;
  const y = year ? parseInt(year, 10) || 2025 : null;
  const [headerYearLine1, headerYearLine2] = yearHeaderParts(year);
  const highlightName = sector || null;

  if (level === "Federal") {
    const allYears = year === "";
    const summary = allYears ? getFederalBudgetAllYearsSummary() : null;
    const snap = getFederalBudgetForYear(y ?? 2025);
    const scale = allYears && summary ? summary.averageTotal / Math.max(1, snap.total) : 1;
    const categories = snap.categories.map((c) => ({
      name: c.name,
      amount: Math.round(c.amount * scale),
      color: c.color,
    }));
    let items = categories;
    if (sector) {
      items = categories.filter((c) => c.name === sector);
      if (items.length === 0) items = trimItems(categories);
    } else {
      items = trimItems(categories);
    }
    let total = allYears && summary ? summary.averageTotal : snap.total;
    let totalLabelStr = allYears ? "Average annual budget" : "Total federal budget";
    if (sector && items.length === 1) {
      totalLabelStr = sector;
      total = items[0]!.amount;
    }
    return {
      level,
      headerYearLine1,
      headerYearLine2,
      headline: "FEDERAL BUDGET",
      subtitle: allYears ? "Spending overview (all years, avg.)" : "Federal spending breakdown",
      totalLabel: totalLabelStr,
      totalFormatted: formatCompactCad(total),
      unitNote: "Amounts in CAD (demo data)",
      sourceNote: "CivicLens",
      items,
      highlightName,
    };
  }

  if (level === "Province") {
    const yr = y ?? 2025;
    const scaled = scaleProvincialRows(yr);
    if (province === "All Provinces") {
      const rows = [...scaled].sort((a, b) => b.total - a.total).slice(0, MAX_BLOCKS);
      const items: InfographicBlock[] = rows.map((r, i) => ({
        name: r.province,
        amount: r.total,
        color: PROVINCE_PALETTE[i % PROVINCE_PALETTE.length] ?? "#64748b",
      }));
      const total = scaled.reduce((s, r) => s + r.total, 0);
      return {
        level,
        headerYearLine1,
        headerYearLine2,
        headline: "PROVINCIAL BUDGETS",
        subtitle: `Top provinces by total spend — ${yr}`,
        totalLabel: "Combined provincial total (demo)",
        totalFormatted: formatCompactCad(total),
        unitNote: "Amounts in CAD (demo data)",
        sourceNote: "CivicLens",
        items: trimItems(items),
        highlightName: null,
      };
    }
    const row = getProvincialBudgetRow(province);
    if (!row) return null;
    const scaledRow = scaled.find((r) => r.province === province);
    const cats = scaledRow?.topCategories ?? row.topCategories;
    let blocks: InfographicBlock[] = cats.map((c) => ({
      name: c.name,
      amount: c.amount,
      color: pickColor(PROVINCIAL_CATEGORY_COLORS, c.name, "#64748b"),
    }));
    if (sector) {
      blocks = blocks.filter((b) => b.name === sector);
      if (blocks.length === 0) {
        blocks = cats.map((c) => ({
          name: c.name,
          amount: c.amount,
          color: pickColor(PROVINCIAL_CATEGORY_COLORS, c.name, "#64748b"),
        }));
      }
    }
    blocks = trimItems(blocks);
    let total = scaledRow?.total ?? row.total;
    let totalLabelStr = "Total provincial budget";
    if (sector && blocks.length === 1) {
      totalLabelStr = sector;
      total = blocks[0]!.amount;
    }
    return {
      level,
      headerYearLine1,
      headerYearLine2,
      headline: "PROVINCIAL BUDGET",
      subtitle: `${province} — category breakdown`,
      totalLabel: totalLabelStr,
      totalFormatted: formatCompactCad(total),
      unitNote: "Amounts in CAD (demo data)",
      sourceNote: "CivicLens",
      items: blocks,
      highlightName: highlightName,
    };
  }

  /* Municipal */
  const yr = y ?? 2025;
  const rows = municipalRows?.length ? municipalRows : getMunicipalBudgetsForYear(yr);
  if (municipalSelection === "All Municipalities") {
    const sorted = [...rows].sort((a, b) => b.total - a.total).slice(0, MAX_BLOCKS);
    const items: InfographicBlock[] = sorted.map((r, i) => ({
      name: r.city,
      amount: r.total,
      color: PROVINCE_PALETTE[i % PROVINCE_PALETTE.length] ?? "#64748b",
    }));
    const total = rows.reduce((s, r) => s + r.total, 0);
    return {
      level,
      headerYearLine1,
      headerYearLine2,
      headline: "MUNICIPAL BUDGETS",
      subtitle: `Top cities by total spend — ${yr}`,
      totalLabel: "Combined municipal total (demo)",
      totalFormatted: formatCompactCad(total),
      unitNote: "Amounts in CAD (demo data)",
      sourceNote: "CivicLens",
      items: trimItems(items),
      highlightName: null,
    };
  }
  const cityRow = getMunicipalBudgetRow(municipalSelection, rows);
  if (!cityRow) return null;
  let blocks: InfographicBlock[] = cityRow.topCategories.map((c) => ({
    name: c.name,
    amount: c.amount,
    color: pickColor(MUNICIPAL_CATEGORY_COLORS, c.name, "#64748b"),
  }));
  if (sector) {
    blocks = blocks.filter((b) => b.name === sector);
    if (blocks.length === 0) {
      blocks = cityRow.topCategories.map((c) => ({
        name: c.name,
        amount: c.amount,
        color: pickColor(MUNICIPAL_CATEGORY_COLORS, c.name, "#64748b"),
      }));
    }
  }
  blocks = trimItems(blocks);
  let total = cityRow.total;
  let totalLabelStr = "Total municipal budget";
  if (sector && blocks.length === 1) {
    totalLabelStr = sector;
    total = blocks[0]!.amount;
  }
  return {
    level,
    headerYearLine1,
    headerYearLine2,
    headline: "MUNICIPAL BUDGET",
    subtitle: `${cityRow.city} — category breakdown`,
    totalLabel: totalLabelStr,
    totalFormatted: formatCompactCad(total),
    unitNote: "Amounts in CAD (demo data)",
    sourceNote: "CivicLens",
    items: blocks,
    highlightName: highlightName,
  };
}
