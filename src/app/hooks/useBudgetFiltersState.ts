import * as React from "react";
import { useSearchParams } from "react-router";
import {
  FEDERAL_CATEGORY_NAMES,
  FEDERAL_DATA_YEARS,
  getMunicipalBudgetsForAllYears,
  getMunicipalBudgetsForYear,
  MUNICIPAL_CATEGORY_NAMES,
  MUNICIPAL_DATA_YEARS,
  type MunicipalBudgetRow,
  PROVINCIAL_CATEGORY_NAMES,
  PROVINCIAL_DATA_YEARS,
} from "../data/budgetData";
import { type BudgetLevel, getBudgetApiBase, toBudgetLevelParam } from "../lib/budgetApi";

export const PROVINCE_OPTIONS = [
  "All Provinces",
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
] as const;

export const ALL_MUNICIPALS = "All Municipalities";

export const FEDERAL_YEAR_PLACEHOLDER_LABEL = "Select Year e.g. 2025";
export const FEDERAL_SECTOR_PLACEHOLDER_LABEL = "Select Sector e.g. Health Transfers";
export const PROV_MUNI_SECTOR_PLACEHOLDER_LABEL = "Select Sector e.g. Education";

function fallbackCategoriesForLevel(level: BudgetLevel): string[] {
  if (level === "Federal") return [...FEDERAL_CATEGORY_NAMES];
  if (level === "Province") return [...PROVINCIAL_CATEGORY_NAMES];
  return [...MUNICIPAL_CATEGORY_NAMES];
}

function fallbackYearsForLevel(level: BudgetLevel): string[] {
  if (level === "Federal") return [...FEDERAL_DATA_YEARS].reverse().map(String);
  if (level === "Province") return [...PROVINCIAL_DATA_YEARS].reverse().map(String);
  return [...MUNICIPAL_DATA_YEARS].reverse().map(String);
}

export type UseBudgetFiltersStateOptions = {
  /** When true, read `?level=` from URL (Spendings). Infographics should use false. */
  syncUrlLevel?: boolean;
};

export function useBudgetFiltersState(options: UseBudgetFiltersStateOptions = {}) {
  const { syncUrlLevel = false } = options;
  const [searchParams] = useSearchParams();

  const [level, setLevel] = React.useState<BudgetLevel>("Federal");
  const [year, setYear] = React.useState<string>("");
  const [sector, setSector] = React.useState<string>("");
  const [province, setProvince] = React.useState<(typeof PROVINCE_OPTIONS)[number]>("All Provinces");
  const [categories, setCategories] = React.useState<string[]>(() => fallbackCategoriesForLevel("Federal"));
  const [categoriesLoading, setCategoriesLoading] = React.useState(false);
  const [yearOptions, setYearOptions] = React.useState<string[]>(() => fallbackYearsForLevel("Federal"));
  const [yearsLoading, setYearsLoading] = React.useState(false);
  const [municipalRows, setMunicipalRows] = React.useState<MunicipalBudgetRow[] | null>(null);
  const [municipalLoading, setMunicipalLoading] = React.useState(false);
  const [municipalSelection, setMunicipalSelection] = React.useState<string>(ALL_MUNICIPALS);

  React.useEffect(() => {
    if (!syncUrlLevel) return;
    const raw = searchParams.get("level")?.toLowerCase();
    if (raw === "province" || raw === "provincial") {
      setLevel("Province");
      // Default state: "all years" + "all sectors"
      setYear("");
      setSector("");
      return;
    }
    if (raw === "municipal" || raw === "municipality") {
      setLevel("Municipal");
      // Default state: "all years" + "all sectors"
      setYear("");
      setSector("");
      setMunicipalRows(getMunicipalBudgetsForAllYears());
      setMunicipalLoading(false);
      return;
    }
    if (raw === "federal") {
      setLevel("Federal");
      setYear("");
      setSector("");
    }
  }, [searchParams, syncUrlLevel]);

  React.useEffect(() => {
    if (level !== "Municipal") return;
    let cancelled = false;
    setMunicipalLoading(true);

    // Default year (empty string) means "All years" in the UI.
    if (year === "") {
      setMunicipalRows(getMunicipalBudgetsForAllYears());
      setMunicipalLoading(false);
      return () => {
        cancelled = true;
      };
    }

    const y = parseInt(year, 10) || 2025;
    fetch(`${getBudgetApiBase()}/api/municipal-budgets?year=${y}`)
      .then((res) => {
        if (!res.ok) throw new Error("municipal budgets fetch failed");
        return res.json() as Promise<{ cities?: unknown }>;
      })
      .then((data) => {
        const list = Array.isArray(data.cities) ? data.cities : [];
        if (!cancelled) {
          setMunicipalRows(
            list.length > 0 ? (list as MunicipalBudgetRow[]) : getMunicipalBudgetsForYear(y),
          );
        }
      })
      .catch(() => {
        if (!cancelled) setMunicipalRows(getMunicipalBudgetsForYear(y));
      })
      .finally(() => {
        if (!cancelled) setMunicipalLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [level, year]);

  React.useEffect(() => {
    setCategories(fallbackCategoriesForLevel(level));
    setYearOptions(fallbackYearsForLevel(level));
    let cancelled = false;
    const param = toBudgetLevelParam(level);
    const base = getBudgetApiBase();
    setCategoriesLoading(true);
    setYearsLoading(true);

    const categoriesP = fetch(`${base}/api/categories?level=${param}`)
      .then((res) => {
        if (!res.ok) throw new Error("categories fetch failed");
        return res.json() as Promise<{ categories?: unknown }>;
      })
      .then((data) => {
        const list = Array.isArray(data.categories)
          ? data.categories.filter((x): x is string => typeof x === "string" && x.length > 0)
          : [];
        if (!cancelled && list.length > 0) setCategories(list);
      })
      .catch(() => {
        /* keep client fallback */
      });

    const yearsP = fetch(`${base}/api/budget-years?level=${param}`)
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
      })
      .catch(() => {
        /* keep client fallback */
      });

    Promise.all([categoriesP, yearsP]).finally(() => {
      if (!cancelled) {
        setCategoriesLoading(false);
        setYearsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [level]);

  React.useEffect(() => {
    if (categories.length === 0) return;
    if (level === "Federal") {
      setSector((prev) => {
        if (prev === "") return "";
        return categories.includes(prev) ? prev : "";
      });
      return;
    }
    setSector((prev) => {
      // Province/Municipal default: keep "" so the UI stays on "Select Sector".
      if (prev === "") return "";
      if (!categories.includes(prev)) return categories[0]!;
      return prev;
    });
  }, [categories, level]);

  React.useEffect(() => {
    if (yearOptions.length === 0) return;
    if (level === "Federal") {
      setYear((prev) => {
        if (prev === "") return "";
        return yearOptions.includes(prev) ? prev : "";
      });
      return;
    }
    setYear((prev) => {
      // Province/Municipal default: keep "" so the UI stays on "Select Year".
      if (prev === "") return "";
      if (!yearOptions.includes(prev)) return yearOptions[0]!;
      return prev;
    });
  }, [yearOptions, level]);

  const municipalOptions = React.useMemo(() => {
    const rows =
      municipalRows ??
      (year === "" ? getMunicipalBudgetsForAllYears() : getMunicipalBudgetsForYear(parseInt(year, 10) || 2025));
    return [ALL_MUNICIPALS, ...rows.map((r) => r.city)];
  }, [municipalRows, year]);

  React.useEffect(() => {
    if (level !== "Municipal") {
      setMunicipalSelection(ALL_MUNICIPALS);
      return;
    }
    setMunicipalSelection((prev) => (municipalOptions.includes(prev) ? prev : ALL_MUNICIPALS));
  }, [level, municipalOptions]);

  const sectorOptions = categories;

  const handleLevelChange = React.useCallback((next: BudgetLevel) => {
    setLevel(next);
    if (next === "Federal") {
      setYear("");
      setSector("");
    } else {
      // Province/Municipal default: keep placeholders ("all years" + "all sectors")
      setYear("");
      setSector("");
      if (next === "Municipal") {
        setMunicipalRows(getMunicipalBudgetsForAllYears());
        setMunicipalLoading(false);
      }
    }
  }, []);

  return {
    level,
    setLevel,
    handleLevelChange,
    year,
    setYear,
    sector,
    setSector,
    province,
    setProvince,
    categoriesLoading,
    yearsLoading,
    yearOptions,
    sectorOptions,
    municipalOptions,
    municipalLoading,
    municipalSelection,
    setMunicipalSelection,
    municipalRows,
  };
}

export type BudgetFiltersState = ReturnType<typeof useBudgetFiltersState>;
