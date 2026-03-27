import { DollarSign, MapPin, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "./ui/utils";
import {
  formatBillions,
  getHighestSpendCategory,
  getProvincialBudgetRow,
  PROVINCIAL_CATEGORY_COLORS,
  PROVINCIAL_DATA_YEARS,
  provincialBudgets2025,
} from "../data/budgetData";

const ALL_PROVINCES = "All Provinces";

type Props = {
  year: string;
  provinceSelection: string;
  selectedSector: string;
};

export function ProvincialBudgetDashboard({ year, provinceSelection, selectedSector }: Props) {
  const row = provinceSelection !== ALL_PROVINCES ? getProvincialBudgetRow(provinceSelection) : undefined;
  const showSingleProvince = Boolean(row);

  const hasSelectedSector = selectedSector !== "";

  const yearNumber = year ? Number.parseInt(year, 10) : null;
  const baseYear = 2025;
  const scaleForYear = (y: number) => 1 + (y - baseYear) * 0.012;
  const avgScaleForAllYears =
    PROVINCIAL_DATA_YEARS.reduce((s, y) => s + scaleForYear(y), 0) / PROVINCIAL_DATA_YEARS.length;
  const scaleFactor = yearNumber == null ? avgScaleForAllYears : scaleForYear(yearNumber);

  const scaledRow =
    row == null
      ? undefined
      : {
          ...row,
          total: Math.round(row.total * scaleFactor),
          perCapita: Math.round(row.perCapita * scaleFactor),
          topCategories: row.topCategories.map((c) => ({
            ...c,
            amount: Math.round(c.amount * scaleFactor),
          })),
        };

  const categoriesWithColors =
    scaledRow?.topCategories.map((c) => ({
      ...c,
      color: PROVINCIAL_CATEGORY_COLORS[c.name] ?? "#64748b",
    })) ?? [];

  const pieData = categoriesWithColors.map((c) => ({
    name: c.name,
    value: c.amount,
    percentage: c.percentage,
    color: c.color,
  }));

  const comparisonRows = provincialBudgets2025.map((p) => ({
    name: p.province,
    totalBillions: (p.total * scaleFactor) / 1e9,
    perCapita: Math.round(p.perCapita * scaleFactor),
  }));

  const overviewTableRows = provincialBudgets2025.map((p) => {
    const top = getHighestSpendCategory(p);
    return {
      province: p.province,
      total: Math.round(p.total * scaleFactor),
      perCapita: Math.round(p.perCapita * scaleFactor),
      topCategory: `${top.name} (${top.percentage.toFixed(0)}%)`,
    };
  });

  const detailRowsSorted = [...categoriesWithColors].sort((a, b) => b.amount - a.amount);
  const detailPctSum = categoriesWithColors.reduce((s, c) => s + c.percentage, 0);

  return (
    <div className="space-y-8">
      {provinceSelection !== ALL_PROVINCES && !row ? (
        <div
          className="rounded-xl border-2 px-4 py-3 text-sm text-amber-900"
          style={{ borderColor: "#fcd34d", backgroundColor: "#fffbeb" }}
          role="status"
        >
          No detailed spending breakdown is available for this province in the demo dataset. Comparison charts and
          the overview table still reflect provinces with data.
        </div>
      ) : null}

      {/* Single-province: summary + pie + category details */}
      {showSingleProvince && scaledRow ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className="bg-white rounded-xl border-2 p-5 flex items-start gap-4"
              style={{ borderColor: "#e8eef5" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <MapPin className="w-6 h-6" style={{ color: "#0B2545" }} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Province</p>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {scaledRow.province}
                </p>
              </div>
            </div>
            <div
              className="bg-white rounded-xl border-2 p-5 flex items-start gap-4"
              style={{ borderColor: "#e8eef5" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <DollarSign className="w-6 h-6" style={{ color: "#0B2545" }} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {formatBillions(scaledRow.total)}
                </p>
              </div>
            </div>
            <div
              className="bg-white rounded-xl border-2 p-5 flex items-start gap-4"
              style={{ borderColor: "#e8eef5" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <Users className="w-6 h-6" style={{ color: "#0B2545" }} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Per Capita</p>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  ${scaledRow.perCapita.toLocaleString("en-CA")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="bg-white rounded-xl border-2 p-5 md:p-6"
              style={{ borderColor: "#e8eef5" }}
            >
              <h3
                className="text-lg font-bold text-gray-900 mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {scaledRow.province} Spending Distribution
              </h3>
              <p className="text-xs text-gray-500 mb-2">
                Fiscal year {yearNumber == null ? "All Year" : yearNumber} (demo data)
              </p>
              <div className="h-[240px] sm:h-[280px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={100}
                      paddingAngle={1}
                      label={(props: { percent?: number }) =>
                        props.percent != null ? `${(props.percent * 100).toFixed(1)}%` : ""
                      }
                    >
                      {pieData.map((entry) => {
                        const selected = hasSelectedSector && entry.name === selectedSector;
                        return (
                          <Cell
                            key={entry.name}
                            fill={entry.color}
                            fillOpacity={hasSelectedSector ? (selected ? 1 : 0.35) : 1}
                            stroke={hasSelectedSector ? (selected ? "#f48945" : "#fff") : "#fff"}
                            strokeWidth={hasSelectedSector ? (selected ? 4 : 1) : 1}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip
                      formatter={(value) => {
                        const n = typeof value === "number" ? value : Number(value);
                        return [formatBillions(Number.isFinite(n) ? n : 0), "Amount"];
                      }}
                      labelFormatter={(name) => String(name)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-4">
                {categoriesWithColors.map((c) => (
                  <div
                    key={c.name}
                    className={cn(
                      "flex items-center gap-2 text-xs",
                      c.name === selectedSector ? "text-gray-900 font-semibold" : "text-gray-500",
                    )}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="leading-tight">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="bg-white rounded-xl border-2 p-5 md:p-6"
              style={{ borderColor: "#e8eef5" }}
            >
              <h3
                className="text-lg font-bold text-gray-900 mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Category Details
              </h3>
              <ul className="space-y-4">
                {categoriesWithColors.map((c) => {
                  const selected = c.name === selectedSector;
                  return (
                    <li key={c.name}>
                      <div className="flex justify-between items-baseline gap-2 mb-1">
                        <span className={cn("font-medium text-gray-900", selected && "text-[#0B2545]")}>
                          {c.name}
                        </span>
                        <span className="text-sm shrink-0 text-gray-800">
                          <span className="font-bold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                            {formatBillions(c.amount)}
                          </span>
                          <span className="text-gray-600"> ({c.percentage.toFixed(0)}%)</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, c.percentage)}%`,
                            backgroundColor: selected ? "#f48945" : c.color,
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </>
      ) : null}

      {/* Comparison charts — always for provincial view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="bg-white rounded-xl border-2 p-5 md:p-6"
          style={{ borderColor: "#e8eef5" }}
        >
          <h3
            className="text-lg font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Total Budget Comparison
          </h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonRows} margin={{ top: 8, right: 8, left: 8, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis
                  label={{ value: "Billions ($)", angle: -90, position: "insideLeft" }}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const v = Number.isFinite(n) ? n : 0;
                    return [`$${v.toFixed(1)}B`, "Total budget"];
                  }}
                />
                <Bar dataKey="totalBillions" fill="#0B2545" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="bg-white rounded-xl border-2 p-5 md:p-6"
          style={{ borderColor: "#e8eef5" }}
        >
          <h3
            className="text-lg font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Per Capita Spending Comparison
          </h3>
          <div className="h-[min(320px,70vh)] sm:h-[320px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonRows} margin={{ top: 8, right: 8, left: 4, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9 }}
                  angle={-25}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis
                  width={52}
                  label={{ value: "Per Capita ($)", angle: -90, position: "insideLeft" }}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => v.toLocaleString("en-CA")}
                />
                <Tooltip
                  formatter={(value) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const v = Number.isFinite(n) ? n : 0;
                    return [`$${v.toLocaleString("en-CA")}`, "Per capita"];
                  }}
                />
                <Bar dataKey="perCapita" fill="#0B2545" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed breakdown — only when a province with data is selected */}
      {showSingleProvince && scaledRow ? (
        <div
          className="bg-white rounded-xl border-2 overflow-hidden"
          style={{ borderColor: "#e8eef5" }}
        >
          <div className="px-5 py-4 border-b border-gray-100">
            <h3
              className="text-lg font-bold text-gray-900"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Detailed Category Breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                    Category
                  </th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                    Amount
                  </th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                    Percentage
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3 min-w-[200px]">
                    Visual
                  </th>
                </tr>
              </thead>
              <tbody>
                {detailRowsSorted.map((r) => {
                  const sel = r.name === selectedSector;
                  return (
                    <tr
                      key={r.name}
                      className={cn("border-b border-gray-100", sel && "bg-[#fff7f0]")}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: r.color }}
                          />
                          <span className="text-gray-900 font-medium">{r.name}</span>
                        </div>
                      </td>
                      <td
                        className="px-5 py-4 text-right font-bold text-gray-900"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {formatBillions(r.amount)}
                      </td>
                      <td className="px-5 py-4 text-right text-gray-800">{r.percentage.toFixed(1)}%</td>
                      <td className="px-5 py-4">
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, r.percentage)}%`,
                              backgroundColor: sel ? "#f48945" : r.color,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 bg-[#f8fbff]" style={{ borderColor: "#e8eef5" }}>
                  <td className="px-5 py-4 font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Total
                  </td>
                  <td
                    className="px-5 py-4 text-right font-bold text-gray-900"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {formatBillions(scaledRow.total)}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-gray-900">
                    {detailPctSum.toFixed(1)}%
                  </td>
                  <td className="px-5 py-4" aria-hidden />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : null}

      {/* All provinces overview */}
      <div
        className="bg-white rounded-xl border-2 overflow-hidden"
        style={{ borderColor: "#e8eef5" }}
      >
        <div className="px-5 py-4 border-b border-gray-100">
          <h3
            className="text-lg font-bold text-gray-900"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            All Provinces Overview
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {showSingleProvince
              ? "Compare all provinces with available data (totals, per capita, and highest spending category)."
              : "Provincial totals, per capita spending, and top category for each province in the dataset."}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                  Province
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                  Total Budget
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                  Per Capita
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                  Top Category
                </th>
              </tr>
            </thead>
            <tbody>
              {overviewTableRows.map((r) => (
                <tr key={r.province} className="border-b border-gray-100 last:border-0">
                  <td className="px-5 py-4 font-medium text-gray-900">{r.province}</td>
                  <td
                    className="px-5 py-4 text-right font-bold text-gray-900"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {formatBillions(r.total)}
                  </td>
                  <td className="px-5 py-4 text-right text-gray-800">
                    ${r.perCapita.toLocaleString("en-CA")}
                  </td>
                  <td className="px-5 py-4 text-gray-800">{r.topCategory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
