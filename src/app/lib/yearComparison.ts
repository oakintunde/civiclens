import type { BudgetLevel } from "./budgetApi";
import {
  getFederalBudgetForYear,
  getMunicipalBudgetsForYear,
  getProvincialBudgetRow,
  MUNICIPAL_CATEGORY_COLORS,
  PROVINCIAL_CATEGORY_COLORS,
  provincialBudgets2025,
  type MunicipalBudgetRow,
  type ProvincialBudgetRow,
} from "../data/budgetData";
import { ALL_MUNICIPALS } from "../hooks/useBudgetFiltersState";

const ALL_PROVINCES = "All Provinces";

const PROV_BASE_YEAR = 2025;
function scaleProvincialFactor(year: number): number {
  return 1 + (year - PROV_BASE_YEAR) * 0.012;
}

function scaleProvincialRow(row: ProvincialBudgetRow, year: number): ProvincialBudgetRow {
  const f = scaleProvincialFactor(year);
  return {
    ...row,
    total: Math.round(row.total * f),
    perCapita: Math.round(row.perCapita * f),
    topCategories: row.topCategories.map((c) => ({
      ...c,
      amount: Math.round(c.amount * f),
    })),
  };
}

function categoriesToMap(cats: { name: string; amount: number }[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const c of cats) m.set(c.name, c.amount);
  return m;
}

function aggregateProvincialAll(year: number): { total: number; byName: Map<string, number> } {
  let total = 0;
  const byName = new Map<string, number>();
  for (const p of provincialBudgets2025) {
    const scaled = scaleProvincialRow(p, year);
    total += scaled.total;
    for (const c of scaled.topCategories) {
      byName.set(c.name, (byName.get(c.name) ?? 0) + c.amount);
    }
  }
  return { total, byName };
}

function aggregateMunicipalRows(rows: MunicipalBudgetRow[]): { total: number; byName: Map<string, number> } {
  if (rows.length === 0) return { total: 0, byName: new Map() };
  const total = rows.reduce((s, r) => s + r.total, 0);
  const byName = new Map<string, number>();
  for (const r of rows) {
    for (const c of r.topCategories) {
      byName.set(c.name, (byName.get(c.name) ?? 0) + c.amount);
    }
  }
  return { total, byName };
}

export type ComparisonSectorRow = {
  name: string;
  color: string;
  amountA: number;
  amountB: number;
  combined: number;
};

export type YearComparisonViewModel = {
  yearLabelA: string;
  yearLabelB: string;
  scopeLabel: string;
  totalA: number;
  totalB: number;
  combinedTotal: number;
  sectorRows: ComparisonSectorRow[];
  pieData: { name: string; value: number; percentage: number; color: string }[];
  barData: { name: string; billions: number }[];
  error?: string;
};

function buildView(
  yearLabelA: string,
  yearLabelB: string,
  scopeLabel: string,
  totalA: number,
  totalB: number,
  rows: ComparisonSectorRow[],
): YearComparisonViewModel {
  const sortedDesc = [...rows].sort((a, b) => b.combined - a.combined);
  const sumCombined = sortedDesc.reduce((s, r) => s + r.combined, 0);
  const pieData = sortedDesc.map((r) => ({
    name: r.name,
    value: r.combined,
    percentage: sumCombined > 0 ? (r.combined / sumCombined) * 100 : 0,
    color: r.color,
  }));
  const barData = [...sortedDesc]
    .sort((a, b) => a.combined - b.combined)
    .map((r) => ({ name: r.name, billions: r.combined / 1e9 }));

  return {
    yearLabelA,
    yearLabelB,
    scopeLabel,
    totalA,
    totalB,
    combinedTotal: totalA + totalB,
    sectorRows: sortedDesc,
    pieData,
    barData,
  };
}

export type YearComparisonInput = {
  level: BudgetLevel;
  yearA: string;
  yearB: string;
  province: string;
  municipalSelection: string;
};

export function computeYearComparison(input: YearComparisonInput): YearComparisonViewModel {
  const { level, yearA, yearB, province, municipalSelection } = input;
  const yA = parseInt(yearA, 10);
  const yB = parseInt(yearB, 10);
  if (!Number.isFinite(yA) || !Number.isFinite(yB)) {
    return {
      yearLabelA: yearA,
      yearLabelB: yearB,
      scopeLabel: "",
      totalA: 0,
      totalB: 0,
      combinedTotal: 0,
      sectorRows: [],
      pieData: [],
      barData: [],
      error: "Select two valid fiscal years.",
    };
  }

  if (level === "Federal") {
    const snapA = getFederalBudgetForYear(yA);
    const snapB = getFederalBudgetForYear(yB);
    const mapA = categoriesToMap(snapA.categories);
    const mapB = categoriesToMap(snapB.categories);
    const names = new Set([...mapA.keys(), ...mapB.keys()]);
    const rows: ComparisonSectorRow[] = [];
    const colorByName = new Map(snapA.categories.map((c) => [c.name, c.color] as const));
    for (const b of snapB.categories) {
      if (!colorByName.has(b.name)) colorByName.set(b.name, b.color);
    }
    for (const name of names) {
      const a = mapA.get(name) ?? 0;
      const b = mapB.get(name) ?? 0;
      rows.push({
        name,
        color: colorByName.get(name) ?? "#64748b",
        amountA: a,
        amountB: b,
        combined: a + b,
      });
    }
    return buildView(yearA, yearB, "Federal — Canada", snapA.total, snapB.total, rows);
  }

  if (level === "Province") {
    if (province === ALL_PROVINCES) {
      const aggA = aggregateProvincialAll(yA);
      const aggB = aggregateProvincialAll(yB);
      const names = new Set([...aggA.byName.keys(), ...aggB.byName.keys()]);
      const rows: ComparisonSectorRow[] = [];
      for (const name of names) {
        const a = aggA.byName.get(name) ?? 0;
        const b = aggB.byName.get(name) ?? 0;
        rows.push({
          name,
          color: PROVINCIAL_CATEGORY_COLORS[name] ?? "#64748b",
          amountA: a,
          amountB: b,
          combined: a + b,
        });
      }
      return buildView(yearA, yearB, "Provincial — all provinces (demo aggregate)", aggA.total, aggB.total, rows);
    }

    const row = getProvincialBudgetRow(province);
    if (!row) {
      return {
        yearLabelA: yearA,
        yearLabelB: yearB,
        scopeLabel: province,
        totalA: 0,
        totalB: 0,
        combinedTotal: 0,
        sectorRows: [],
        pieData: [],
        barData: [],
        error: `No demo budget data for ${province}.`,
      };
    }
    const scaledA = scaleProvincialRow(row, yA);
    const scaledB = scaleProvincialRow(row, yB);
    const mapA = categoriesToMap(scaledA.topCategories);
    const mapB = categoriesToMap(scaledB.topCategories);
    const names = new Set([...mapA.keys(), ...mapB.keys()]);
    const rows: ComparisonSectorRow[] = [];
    for (const name of names) {
      const a = mapA.get(name) ?? 0;
      const b = mapB.get(name) ?? 0;
      rows.push({
        name,
        color: PROVINCIAL_CATEGORY_COLORS[name] ?? "#64748b",
        amountA: a,
        amountB: b,
        combined: a + b,
      });
    }
    return buildView(yearA, yearB, `Provincial — ${province}`, scaledA.total, scaledB.total, rows);
  }

  // Municipal
  const rowsA = getMunicipalBudgetsForYear(yA);
  const rowsB = getMunicipalBudgetsForYear(yB);
  const visibleA =
    municipalSelection === ALL_MUNICIPALS ? rowsA : rowsA.filter((r) => r.city === municipalSelection);
  const visibleB =
    municipalSelection === ALL_MUNICIPALS ? rowsB : rowsB.filter((r) => r.city === municipalSelection);

  if (municipalSelection !== ALL_MUNICIPALS) {
    if (visibleA.length === 0 || visibleB.length === 0) {
      return {
        yearLabelA: yearA,
        yearLabelB: yearB,
        scopeLabel: municipalSelection,
        totalA: 0,
        totalB: 0,
        combinedTotal: 0,
        sectorRows: [],
        pieData: [],
        barData: [],
        error: `No municipal data for ${municipalSelection} in one of the selected years.`,
      };
    }
  }

  const aggA = aggregateMunicipalRows(visibleA);
  const aggB = aggregateMunicipalRows(visibleB);
  const names = new Set([...aggA.byName.keys(), ...aggB.byName.keys()]);
  const sectorRows: ComparisonSectorRow[] = [];
  for (const name of names) {
    const a = aggA.byName.get(name) ?? 0;
    const b = aggB.byName.get(name) ?? 0;
    sectorRows.push({
      name,
      color: MUNICIPAL_CATEGORY_COLORS[name] ?? "#64748b",
      amountA: a,
      amountB: b,
      combined: a + b,
    });
  }

  const scope =
    municipalSelection === ALL_MUNICIPALS
      ? "Municipal — all municipalities (demo)"
      : `Municipal — ${municipalSelection}`;

  return buildView(yearA, yearB, scope, aggA.total, aggB.total, sectorRows);
}
