import * as React from "react";
import { BudgetFiltersCard } from "../components/BudgetFiltersCard";
import { BudgetInfographicPanel } from "../components/BudgetInfographicPanel";
import { SharePageSocialRow } from "../components/SharePageSocialRow";
import { useBudgetFiltersState } from "../hooks/useBudgetFiltersState";

export default function Infographics() {
  const filters = useBudgetFiltersState({ syncUrlLevel: false });

  const pageUrl = React.useMemo(() => {
    if (typeof window !== "undefined") return `${window.location.origin}/infographics`;
    return "https://civiclens.ca/infographics";
  }, []);

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <section
        style={{
          background: "linear-gradient(to bottom right, #0B2545, #193865, #234b7f)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-3xl">
              <h1
                className="text-4xl md:text-5xl font-bold text-white mb-3"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Infographics
              </h1>
              <p className="text-base md:text-lg text-white/90">
                We pioneered the art of using data and design to simplify the budget
              </p>
            </div>

            <SharePageSocialRow pageUrl={pageUrl} shareTitle="Infographics — CivicLens" />
          </div>
        </div>
      </section>

      <BudgetFiltersCard {...filters} />

      <BudgetInfographicPanel
        level={filters.level}
        year={filters.year}
        sector={filters.sector}
        province={filters.province}
        municipalSelection={filters.municipalSelection}
        municipalRows={filters.municipalRows}
      />
    </div>
  );
}
