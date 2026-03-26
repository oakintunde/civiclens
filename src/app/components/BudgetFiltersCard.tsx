import { Filter } from "lucide-react";
import { BUDGET_LEVEL_OPTIONS, type BudgetLevel } from "../lib/budgetApi";
import { navButtonBase } from "../lib/navButtonStyles";
import { cn } from "./ui/utils";
import {
  FEDERAL_SECTOR_PLACEHOLDER_LABEL,
  FEDERAL_YEAR_PLACEHOLDER_LABEL,
  PROVINCE_OPTIONS,
  PROV_MUNI_SECTOR_PLACEHOLDER_LABEL,
  type BudgetFiltersState,
} from "../hooks/useBudgetFiltersState";

type Props = BudgetFiltersState;

export function BudgetFiltersCard({
  level,
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
}: Props) {
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
              <option value="">{FEDERAL_YEAR_PLACEHOLDER_LABEL}</option>
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
              <option value="">
                {level === "Federal"
                  ? FEDERAL_SECTOR_PLACEHOLDER_LABEL
                  : PROV_MUNI_SECTOR_PLACEHOLDER_LABEL}
              </option>
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
  );
}
