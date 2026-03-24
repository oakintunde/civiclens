import { Filter } from "lucide-react";
import * as React from "react";
import { useSearchParams } from "react-router";
import { FederalBudgetDashboard } from "../components/FederalBudgetDashboard";
import { MunicipalBudgetDashboard } from "../components/MunicipalBudgetDashboard";
import { ProvincialBudgetDashboard } from "../components/ProvincialBudgetDashboard";
import { cn } from "../components/ui/utils";
import {
  FEDERAL_CATEGORY_NAMES,
  FEDERAL_DATA_YEARS,
  getMunicipalBudgetsForYear,
  MUNICIPAL_CATEGORY_NAMES,
  MUNICIPAL_DATA_YEARS,
  type MunicipalBudgetRow,
  PROVINCIAL_CATEGORY_NAMES,
  PROVINCIAL_DATA_YEARS,
} from "../data/budgetData";
import { BUDGET_LEVEL_OPTIONS, type BudgetLevel, getBudgetApiBase, toBudgetLevelParam } from "../lib/budgetApi";
import { navButtonBase } from "../lib/navButtonStyles";

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

const PROVINCE_OPTIONS = [
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
const ALL_MUNICIPALS = "All Municipalities";

export default function Spendings() {
  const [searchParams] = useSearchParams();
  const [level, setLevel] = React.useState<BudgetLevel>("Federal");
  const [year, setYear] = React.useState<string>("2025");
  const [sector, setSector] = React.useState<string>(FEDERAL_CATEGORY_NAMES[0] ?? "Elderly Benefits");
  const [province, setProvince] = React.useState<(typeof PROVINCE_OPTIONS)[number]>("All Provinces");
  const [categories, setCategories] = React.useState<string[]>(() => fallbackCategoriesForLevel("Federal"));
  const [categoriesLoading, setCategoriesLoading] = React.useState(false);
  const [yearOptions, setYearOptions] = React.useState<string[]>(() => fallbackYearsForLevel("Federal"));
  const [yearsLoading, setYearsLoading] = React.useState(false);
  const [municipalRows, setMunicipalRows] = React.useState<MunicipalBudgetRow[] | null>(null);
  const [municipalLoading, setMunicipalLoading] = React.useState(false);
  const [municipalSelection, setMunicipalSelection] = React.useState<string>(ALL_MUNICIPALS);

  React.useEffect(() => {
    const raw = searchParams.get("level")?.toLowerCase();
    if (raw === "province" || raw === "provincial") {
      setLevel("Province");
      return;
    }
    if (raw === "municipal" || raw === "municipality") {
      setLevel("Municipal");
      return;
    }
    if (raw === "federal") {
      setLevel("Federal");
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (level !== "Municipal") return;
    let cancelled = false;
    const y = parseInt(year, 10) || 2025;
    setMunicipalLoading(true);
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
    setSector((prev) => (categories.includes(prev) ? prev : categories[0]!));
  }, [categories]);

  React.useEffect(() => {
    if (yearOptions.length === 0) return;
    setYear((prev) => (yearOptions.includes(prev) ? prev : yearOptions[0]!));
  }, [yearOptions]);

  const municipalOptions = React.useMemo(() => {
    const rows = municipalRows ?? getMunicipalBudgetsForYear(parseInt(year, 10) || 2025);
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
  const title =
    level === "Federal"
      ? `Federal Budget ${year}`
      : level === "Province"
        ? `Provincial Budgets ${year}`
        : `Municipal Budgets ${year}`;
  const subtitle =
    level === "Federal"
      ? "Government of Canada spending breakdown and allocation across departments and programs."
      : level === "Province"
        ? "Compare provincial government spending across Canada's provinces and territories"
        : "Explore how major Canadian cities allocate budgets for local services and infrastructure.";

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <section
        style={{
          background: "linear-gradient(to bottom right, #0B2545, #193865, #234b7f)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-2"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {title}
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-3xl">
            {subtitle}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border-2 p-5 md:p-6" style={{ borderColor: "#e8eef5" }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Government Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as BudgetLevel)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca]"
              >
                {BUDGET_LEVEL_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={yearsLoading || yearOptions.length === 0}
                aria-busy={yearsLoading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca] disabled:opacity-60"
              >
                {yearOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className={level === "Province" || level === "Municipal" ? "lg:col-span-2" : "lg:col-span-5"}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {level === "Federal" ? "Sector" : "Category"}
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                disabled={categoriesLoading || sectorOptions.length === 0}
                aria-busy={categoriesLoading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca] disabled:opacity-60"
              >
                {sectorOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {level === "Province" ? (
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value as (typeof PROVINCE_OPTIONS)[number])}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca]"
                >
                  {PROVINCE_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {level === "Municipal" ? (
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Municipality</label>
                <select
                  value={municipalSelection}
                  onChange={(e) => setMunicipalSelection(e.target.value)}
                  disabled={municipalLoading || municipalOptions.length === 0}
                  aria-busy={municipalLoading}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca] disabled:opacity-60"
                >
                  {municipalOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap justify-start gap-3">
              <button
                type="button"
                className={cn(
                  navButtonBase,
                  "min-w-[140px] border-2 border-[#318cca] bg-[#318cca] text-white hover:bg-[#f48945] hover:border-[#f48945]",
                )}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
          </div>

        </div>
      </section>

      {level === "Federal" ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <FederalBudgetDashboard year={year} selectedSector={sector} />
        </section>
      ) : null}

      {level === "Province" ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <ProvincialBudgetDashboard year={year} provinceSelection={province} selectedSector={sector} />
        </section>
      ) : null}

      {level === "Municipal" ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <MunicipalBudgetDashboard
            year={year}
            selectedSector={sector}
            rows={municipalRows ?? []}
            loading={municipalLoading}
            municipalSelection={municipalSelection}
          />
        </section>
      ) : null}
    </div>
  );
}