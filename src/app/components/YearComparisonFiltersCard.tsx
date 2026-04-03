import { BarChart3 } from "lucide-react";
import { PROVINCE_OPTIONS } from "../hooks/useBudgetFiltersState";
import type { YearComparisonFiltersState } from "../hooks/useYearComparisonFiltersState";
import { BUDGET_LEVEL_OPTIONS, type BudgetLevel } from "../lib/budgetApi";
import { navButtonBase } from "../lib/navButtonStyles";
import { cn } from "./ui/utils";

type Props = YearComparisonFiltersState;

export function YearComparisonFiltersCard({
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
}: Props) {
  const compareButton = (
    <button
      type="button"
      className={cn(
        navButtonBase,
        "w-full sm:w-auto sm:min-w-[160px] justify-center border-2 border-[#318cca] bg-[#318cca] text-white hover:bg-[#f48945] hover:border-[#f48945]",
      )}
    >
      <BarChart3 className="w-4 h-4" />
      Compare Data
    </button>
  );

  const yearSelectClass =
    "w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca] disabled:opacity-60";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl border-2 p-5 md:p-6" style={{ borderColor: "#e8eef5" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Government Level</label>
            <select
              value={level}
              onChange={(e) => handleLevelChange(e.target.value as BudgetLevel)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca]"
            >
              {BUDGET_LEVEL_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div className="mt-4 flex flex-wrap gap-3">{compareButton}</div>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">First year</label>
            <select
              value={yearA}
              onChange={(e) => setYearA(e.target.value)}
              disabled={yearsLoading || yearOptions.length === 0}
              aria-busy={yearsLoading}
              className={yearSelectClass}
            >
              {yearOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Second year</label>
            <select
              value={yearB}
              onChange={(e) => setYearB(e.target.value)}
              disabled={yearsLoading || yearOptions.length === 0}
              aria-busy={yearsLoading}
              className={yearSelectClass}
            >
              {yearOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {level === "Province" ? (
            <div className="lg:col-span-2">
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
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Municipality</label>
              <select
                value={municipalSelection}
                onChange={(e) => setMunicipalSelection(e.target.value)}
                disabled={municipalLoading || municipalOptions.length === 0}
                aria-busy={municipalLoading}
                className={yearSelectClass}
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
      </div>
    </section>
  );
}
