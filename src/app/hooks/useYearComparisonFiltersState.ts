import * as React from "react";
import {
  FEDERAL_DATA_YEARS,
  getMunicipalBudgetsForAllYears,
  getMunicipalBudgetsForYear,
  type MunicipalBudgetRow,
  MUNICIPAL_DATA_YEARS,
  PROVINCIAL_DATA_YEARS,
} from "../data/budgetData";
import { type BudgetLevel, getBudgetApiBase, toBudgetLevelParam } from "../lib/budgetApi";
import { ALL_MUNICIPALS, PROVINCE_OPTIONS } from "./useBudgetFiltersState";

function fallbackYearsForLevel(level: BudgetLevel): string[] {
  if (level === "Federal") return [...FEDERAL_DATA_YEARS].reverse().map(String);
  if (level === "Province") return [...PROVINCIAL_DATA_YEARS].reverse().map(String);
  return [...MUNICIPAL_DATA_YEARS].reverse().map(String);
}

/** Latest year to use when resolving municipal city lists for two comparison years. */
function refYearForMunicipal(yearA: string, yearB: string): number {
  const a = parseInt(yearA, 10);
  const b = parseInt(yearB, 10);
  const max = Math.max(Number.isFinite(a) ? a : 0, Number.isFinite(b) ? b : 0);
  return max > 0 ? max : 2025;
}

export function useYearComparisonFiltersState() {
  const [level, setLevel] = React.useState<BudgetLevel>("Federal");
  const [yearOptions, setYearOptions] = React.useState<string[]>(() => fallbackYearsForLevel("Federal"));
  const [yearsLoading, setYearsLoading] = React.useState(false);
  const [yearA, setYearA] = React.useState<string>("2025");
  const [yearB, setYearB] = React.useState<string>("2024");
  const [province, setProvince] = React.useState<(typeof PROVINCE_OPTIONS)[number]>("All Provinces");
  const [municipalRows, setMunicipalRows] = React.useState<MunicipalBudgetRow[] | null>(null);
  const [municipalLoading, setMunicipalLoading] = React.useState(false);
  const [municipalSelection, setMunicipalSelection] = React.useState<string>(ALL_MUNICIPALS);

  const handleLevelChange = React.useCallback((next: BudgetLevel) => {
    setLevel(next);
    const nextOpts = fallbackYearsForLevel(next);
    setYearOptions(nextOpts);
    const desc = [...nextOpts].sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
    setYearA(desc[0] ?? "");
    setYearB(desc[1] ?? desc[0] ?? "");
    setProvince("All Provinces");
    setMunicipalSelection(ALL_MUNICIPALS);
    if (next === "Municipal") {
      setMunicipalRows(getMunicipalBudgetsForAllYears());
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const param = toBudgetLevelParam(level);
    const base = getBudgetApiBase();
    setYearsLoading(true);

    fetch(`${base}/api/budget-years?level=${param}`)
      .then((res) => {
        if (!res.ok) throw new Error("budget-years fetch failed");
        return res.json() as Promise<{ years?: unknown }>;
      })
      .then((data) => {
        const list = Array.isArray(data.years)
          ? data.years
              .map((y) => (typeof y === "number" ? String(y) : typeof y === "string" ? y : null))
              .filter((x): x is string => x !== null && x.length > 0)
          : [];
        if (!cancelled && list.length > 0) setYearOptions(list);
        if (!cancelled && list.length === 0) setYearOptions(fallbackYearsForLevel(level));
      })
      .catch(() => {
        if (!cancelled) setYearOptions(fallbackYearsForLevel(level));
      })
      .finally(() => {
        if (!cancelled) setYearsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [level]);

  React.useEffect(() => {
    if (yearOptions.length === 0) return;
    const desc = [...yearOptions].sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
    setYearA((prev) => (desc.includes(prev) ? prev : desc[0]!));
    setYearB((prev) => (desc.includes(prev) ? prev : desc[1] ?? desc[0]!));
  }, [yearOptions]);

  const refYear = refYearForMunicipal(yearA, yearB);

  React.useEffect(() => {
    if (level !== "Municipal") return;
    let cancelled = false;
    setMunicipalLoading(true);

    fetch(`${getBudgetApiBase()}/api/municipal-budgets?year=${refYear}`)
      .then((res) => {
        if (!res.ok) throw new Error("municipal budgets fetch failed");
        return res.json() as Promise<{ cities?: unknown }>;
      })
      .then((data) => {
        const list = Array.isArray(data.cities) ? data.cities : [];
        if (!cancelled) {
          setMunicipalRows(
            list.length > 0 ? (list as MunicipalBudgetRow[]) : getMunicipalBudgetsForYear(refYear),
          );
        }
      })
      .catch(() => {
        if (!cancelled) setMunicipalRows(getMunicipalBudgetsForYear(refYear));
      })
      .finally(() => {
        if (!cancelled) setMunicipalLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [level, refYear]);

  const municipalOptions = React.useMemo(() => {
    const rows = municipalRows ?? getMunicipalBudgetsForYear(refYear);
    return [ALL_MUNICIPALS, ...rows.map((r) => r.city)];
  }, [municipalRows, refYear]);

  React.useEffect(() => {
    if (level !== "Municipal") {
      setMunicipalSelection(ALL_MUNICIPALS);
      return;
    }
    setMunicipalSelection((prev) => (municipalOptions.includes(prev) ? prev : ALL_MUNICIPALS));
  }, [level, municipalOptions]);

  return {
    level,
    handleLevelChange,
    yearA,
    setYearA,
    yearB,
    setYearB,
    yearOptions,
    yearsLoading,
    province,
    setProvince,
    municipalOptions,
    municipalLoading,
    municipalSelection,
    setMunicipalSelection,
    municipalRows,
    /** Convenience for future charts */
    comparisonRefYear: refYear,
  };
}

export type YearComparisonFiltersState = ReturnType<typeof useYearComparisonFiltersState>;
