import { TrendingUp } from "lucide-react";
import { YearComparisonFiltersCard } from "../components/YearComparisonFiltersCard";
import { useYearComparisonFiltersState } from "../hooks/useYearComparisonFiltersState";

/** Linked from Home and footer; full comparison UI not built yet. */
export function YearComparison() {
  const filters = useYearComparisonFiltersState();

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <div
        style={{
          background: "linear-gradient(to bottom right, #0B2545, #193865, #234b7f)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden />
              </div>
              <h1
                className="text-[1.65rem] sm:text-4xl md:text-5xl font-bold text-white min-w-0"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Year-over-Year Trends
              </h1>
            </div>
            <p className="mt-1 text-base md:text-lg text-white/90 max-w-3xl">
              Track budget changes over time and understand spending trends from 2020 to 2025.
            </p>
          </div>
        </div>
      </div>

      <YearComparisonFiltersCard {...filters} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <p className="text-gray-600 max-w-3xl">
          Comparison charts for <strong>{filters.yearA}</strong> vs <strong>{filters.yearB}</strong> are coming
          soon.
        </p>
      </div>
    </div>
  );
}
