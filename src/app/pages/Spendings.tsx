import * as React from "react";
import { FederalBudgetDashboard } from "../components/FederalBudgetDashboard";
import { BudgetFiltersCard } from "../components/BudgetFiltersCard";
import { MunicipalBudgetDashboard } from "../components/MunicipalBudgetDashboard";
import { ProvincialBudgetDashboard } from "../components/ProvincialBudgetDashboard";
import { SharePageSocialRow } from "../components/SharePageSocialRow";
import { useBudgetFiltersState } from "../hooks/useBudgetFiltersState";
import type { BudgetLevel } from "../lib/budgetApi";

function spendingsLevelQuery(level: BudgetLevel): "federal" | "province" | "municipal" {
  if (level === "Federal") return "federal";
  if (level === "Province") return "province";
  return "municipal";
}

export default function Spendings() {
  const filters = useBudgetFiltersState({ syncUrlLevel: true });
  const { level, year, sector, province, municipalRows, municipalLoading, municipalSelection } = filters;

  const title =
    level === "Federal"
      ? year
        ? `Federal Budget ${year}`
        : "Federal Budget"
      : level === "Province"
        ? year
          ? `Provincial Budgets ${year}`
          : "Provincial Budgets"
        : year
          ? `Municipal Budgets ${year}`
          : "Municipal Budgets";
  const subtitle =
    level === "Federal"
      ? "Government of Canada spending breakdown and allocation across departments and programs."
      : level === "Province"
        ? "Compare provincial government spending across Canada's provinces and territories"
        : "Explore how major Canadian cities allocate budgets for local services and infrastructure.";

  const sharePageUrl = React.useMemo(() => {
    const base =
      typeof window !== "undefined" ? window.location.origin : "https://civiclens.ca";
    return `${base}/spendings?level=${spendingsLevelQuery(level)}`;
  }, [level]);

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <section
        style={{
          background: "linear-gradient(to bottom right, #0B2545, #193865, #234b7f)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
            <div className="max-w-3xl min-w-0">
              <h1
                className="text-[1.65rem] leading-tight sm:text-4xl md:text-5xl font-bold text-white mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-white/90">{subtitle}</p>
            </div>
            <SharePageSocialRow
              pageUrl={sharePageUrl}
              shareTitle={`CivicLens — ${title}`}
            />
          </div>
        </div>
      </section>

      <BudgetFiltersCard {...filters} />

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
