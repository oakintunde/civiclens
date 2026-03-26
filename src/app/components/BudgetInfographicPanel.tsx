import { Download } from "lucide-react";
import * as React from "react";
import { buildBudgetInfographicDataset } from "../infographics/budgetInfographicDataset";
import { renderBudgetInfographicSvg } from "../infographics/renderBudgetInfographicSvg";
import { downloadSvgAsPng } from "../infographics/svgToPng";
import type { BudgetLevel } from "../lib/budgetApi";
import type { MunicipalBudgetRow } from "../data/budgetData";
import { navButtonBase } from "../lib/navButtonStyles";
import { cn } from "./ui/utils";

type Props = {
  level: BudgetLevel;
  year: string;
  sector: string;
  province: string;
  municipalSelection: string;
  municipalRows: MunicipalBudgetRow[] | null;
};

export function BudgetInfographicPanel({
  level,
  year,
  sector,
  province,
  municipalSelection,
  municipalRows,
}: Props) {
  const [downloading, setDownloading] = React.useState(false);

  const dataset = React.useMemo(
    () =>
      buildBudgetInfographicDataset({
        level,
        year,
        sector,
        province,
        municipalSelection,
        municipalRows,
      }),
    [level, year, sector, province, municipalSelection, municipalRows],
  );

  const svgMarkup = React.useMemo(
    () => (dataset ? renderBudgetInfographicSvg(dataset) : ""),
    [dataset],
  );

  const dataUrl = React.useMemo(() => {
    if (!svgMarkup) return "";
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;
  }, [svgMarkup]);

  const handleDownloadPng = () => {
    if (!svgMarkup) return;
    setDownloading(true);
    void downloadSvgAsPng(
      svgMarkup,
      `civiclens-infographic-${level.toLowerCase()}-${year || "all"}-${Date.now()}.png`,
    )
      .catch(() => {
        /* optional: toast */
      })
      .finally(() => setDownloading(false));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Budget infographic
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Digital summary from your filters — download a PNG to share.
          </p>
        </div>
        <button
          type="button"
          disabled={!svgMarkup || downloading}
          onClick={handleDownloadPng}
          className={cn(
            navButtonBase,
            "min-w-[180px] border-2 border-[#318cca] bg-[#318cca] text-white hover:bg-[#f48945] hover:border-[#f48945] disabled:opacity-50",
          )}
        >
          <Download className="w-4 h-4" />
          {downloading ? "Exporting…" : "Download PNG"}
        </button>
      </div>

      {!dataset ? (
        <div
          className="rounded-xl border-2 px-5 py-8 text-center text-gray-700 bg-white"
          style={{ borderColor: "#e8eef5" }}
          role="status"
        >
          No infographic is available for this province or municipality in the demo dataset. Try another selection.
        </div>
      ) : (
        <div
          className="rounded-xl border-2 p-4 md:p-6 bg-white shadow-sm overflow-x-auto"
          style={{ borderColor: "#e8eef5" }}
        >
          <img
            src={dataUrl}
            alt={`${dataset.headline} infographic`}
            className="mx-auto max-w-full h-auto w-full max-w-[720px] block"
            width={720}
            height={920}
          />
        </div>
      )}
    </section>
  );
}
