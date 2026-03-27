import { Building2, DollarSign, MapPin, Users } from "lucide-react";
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
import {
  formatBillions,
  getHighestMunicipalCategory,
  MUNICIPAL_CATEGORY_COLORS,
  MUNICIPAL_CHART_CITY_ORDER,
  type MunicipalBudgetRow,
} from "../data/budgetData";
import { cn } from "./ui/utils";

const BAR_FILL = "#0B2545";

type Props = {
  year: string;
  /** Matches Category dropdown; highlighted in pie and breakdown. */
  selectedSector: string;
  rows: MunicipalBudgetRow[];
  loading?: boolean;
  municipalSelection?: string;
};

function formatMillions(amount: number): string {
  return `$${Math.round(amount / 1e6).toLocaleString("en-CA")}M`;
}

function chartRowsOrdered(rows: MunicipalBudgetRow[]): MunicipalBudgetRow[] {
  return MUNICIPAL_CHART_CITY_ORDER.map((name) => rows.find((r) => r.city === name)).filter(
    (r): r is MunicipalBudgetRow => r != null,
  );
}

export function MunicipalBudgetDashboard({
  year,
  selectedSector,
  rows,
  loading,
  municipalSelection = "All Municipalities",
}: Props) {
  const hasSelectedSector = selectedSector !== "";
  const isAllMunicipalities = municipalSelection === "All Municipalities";
  const visibleRows = isAllMunicipalities ? rows : rows.filter((r) => r.city === municipalSelection);

  const ordered = chartRowsOrdered(visibleRows);
  const comparisonBars = ordered.map((r) => ({
    city: r.city,
    billions: r.total / 1e9,
    perCapita: r.perCapita,
  }));

  const allMunicipalitiesRow: MunicipalBudgetRow | undefined = isAllMunicipalities
    ? (() => {
        if (visibleRows.length === 0) return undefined;
        const total = visibleRows.reduce((sum, r) => sum + r.total, 0);
        const perCapita = Math.round(
          visibleRows.reduce((sum, r) => sum + r.perCapita, 0) / visibleRows.length,
        );
        const byCategory = new Map<string, number>();
        for (const row of visibleRows) {
          for (const c of row.topCategories) {
            byCategory.set(c.name, (byCategory.get(c.name) ?? 0) + c.amount);
          }
        }
        const topCategories = [...byCategory.entries()].map(([name, amount]) => ({
          name,
          amount,
          percentage: total > 0 ? (amount / total) * 100 : 0,
        }));
        return { city: "All province", province: "All", total, perCapita, topCategories };
      })()
    : undefined;

  const selectedRow = isAllMunicipalities ? allMunicipalitiesRow : visibleRows[0];
  const categoriesWithColors =
    selectedRow?.topCategories.map((c) => ({
      ...c,
      color: MUNICIPAL_CATEGORY_COLORS[c.name] ?? "#64748b",
    })) ?? [];

  const pieData = categoriesWithColors.map((c) => ({
    name: c.name,
    value: c.amount,
    percentage: c.percentage,
    color: c.color,
  }));

  const breakdownSorted = [...categoriesWithColors].sort((a, b) => b.amount - a.amount);
  const detailPctSum = categoriesWithColors.reduce((s, c) => s + c.percentage, 0);

  const overviewRows = visibleRows.map((r) => {
    const top = getHighestMunicipalCategory(r);
    return {
      city: r.city,
      province: r.province,
      total: r.total,
      perCapita: r.perCapita,
      topCategory: `${top.name} (${top.percentage.toFixed(0)}%)`,
    };
  });

  if (loading && visibleRows.length === 0) {
    return (
      <div
        className="rounded-xl border-2 px-5 py-12 text-center text-gray-600"
        style={{ borderColor: "#e8eef5" }}
        role="status"
      >
        Loading municipal budget data…
      </div>
    );
  }

  if (!loading && visibleRows.length === 0) {
    return (
      <div
        className="rounded-xl border-2 px-5 py-8 text-center text-gray-600"
        style={{ borderColor: "#e8eef5" }}
        role="status"
      >
        No municipal budget data is available for this year.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* City detail */}
      {selectedRow ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3
              className="text-lg font-bold text-gray-900"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              City spending detail
            </h3>
            <p className="text-sm text-gray-600">
              {isAllMunicipalities
                ? "Showing aggregated detail for all municipalities."
                : `Showing ${selectedRow.city}, ${selectedRow.province}.`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div
              className="bg-white rounded-xl border-2 p-5 flex items-start gap-4 shadow-sm"
              style={{ borderColor: "#e8eef5" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <Building2 className="w-6 h-6" style={{ color: "#0B2545" }} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">City</p>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {selectedRow.city}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{selectedRow.province}</p>
              </div>
            </div>

            <div
              className="bg-white rounded-xl border-2 p-5 flex items-start gap-4 shadow-sm"
              style={{ borderColor: "#e8eef5" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <DollarSign className="w-6 h-6" style={{ color: "#0B2545" }} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total budget</p>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {formatBillions(selectedRow.total)}
                </p>
              </div>
            </div>

            <div
              className="bg-white rounded-xl border-2 p-5 flex items-start gap-4 shadow-sm"
              style={{ borderColor: "#e8eef5" }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#e8eef5" }}
              >
                <Users className="w-6 h-6" style={{ color: "#0B2545" }} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Per capita</p>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  ${selectedRow.perCapita.toLocaleString("en-CA")}
                </p>
              </div>
            </div>

            <div
              className="bg-white rounded-xl border-2 p-5 flex items-start gap-4 shadow-sm"
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
                  {selectedRow.province}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              className="bg-white rounded-xl border-2 p-5 md:p-6 shadow-sm"
              style={{ borderColor: "#e8eef5" }}
            >
              <h3
                className="text-lg font-bold text-gray-900 mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {selectedRow.city} Spending Distribution
              </h3>
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
                        props.percent != null ? `${(props.percent * 100).toFixed(0)}%` : ""
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
              className="bg-white rounded-xl border-2 p-5 md:p-6 shadow-sm"
              style={{ borderColor: "#e8eef5" }}
            >
              <h3
                className="text-lg font-bold text-gray-900 mb-4"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Category breakdown
              </h3>
              <ul className="space-y-4">
                {breakdownSorted.map((c) => {
                  const selected = c.name === selectedSector;
                  return (
                    <li key={c.name}>
                      <div className="flex justify-between gap-2 text-sm mb-1">
                        <span className={cn("font-medium", selected ? "text-gray-900" : "text-gray-700")}>
                          {c.name}
                        </span>
                        <span
                          className="text-gray-900 shrink-0 font-semibold"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {formatMillions(c.amount)} ({c.percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", selected ? "bg-[#f48945]" : "")}
                          style={{
                            width: `${Math.min(100, c.percentage)}%`,
                            backgroundColor: selected ? undefined : c.color,
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                Shares total {detailPctSum.toFixed(0)}% (demo rounding).
              </p>
            </div>
          </div>
        </>
      ) : null}

      {/* Other sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="bg-white rounded-xl border-2 p-5 md:p-6 shadow-sm"
          style={{ borderColor: "#e8eef5" }}
        >
          <h3
            className="text-lg font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Total Budget Comparison
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            Fiscal year {year ? year : "All Year"} (demo data)
          </p>
          <div className="h-[min(280px,65vh)] sm:h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonBars} margin={{ top: 8, right: 8, left: 4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="city" tick={{ fontSize: 10 }} interval={0} />
                <YAxis
                  width={44}
                  domain={[0, 20]}
                  tick={{ fontSize: 10 }}
                  label={{
                    value: "Billions ($)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 10, fill: "#6b7280" },
                  }}
                />
                <Tooltip
                  formatter={(value) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const v = Number.isFinite(n) ? n : 0;
                    return [`$${v.toFixed(2)}B`, "Total"];
                  }}
                  labelFormatter={(label) => String(label)}
                />
                <Bar dataKey="billions" fill={BAR_FILL} radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="bg-white rounded-xl border-2 p-5 md:p-6 shadow-sm"
          style={{ borderColor: "#e8eef5" }}
        >
          <h3
            className="text-lg font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Per Capita Spending
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            Fiscal year {year ? year : "All Year"} (demo data)
          </p>
          <div className="h-[min(280px,65vh)] sm:h-[280px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonBars} margin={{ top: 8, right: 8, left: 4, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="city" tick={{ fontSize: 10 }} interval={0} />
                <YAxis
                  width={48}
                  domain={[0, 6000]}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `${v}`}
                  label={{
                    value: "Per Capita ($)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 10, fill: "#6b7280" },
                  }}
                />
                <Tooltip
                  formatter={(value) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const v = Number.isFinite(n) ? Math.round(n) : 0;
                    return [`$${v.toLocaleString("en-CA")}`, "Per capita"];
                  }}
                  labelFormatter={(label) => String(label)}
                />
                <Bar dataKey="perCapita" fill={BAR_FILL} radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 overflow-hidden shadow-sm" style={{ borderColor: "#e8eef5" }}>
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {isAllMunicipalities ? "All Cities Overview" : `${municipalSelection} Overview`}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                  City
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                  Province
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                  Total budget
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                  Per capita
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                  Top category
                </th>
              </tr>
            </thead>
            <tbody>
              {overviewRows.map((row) => (
                <tr key={row.city} className="border-b border-gray-100">
                  <td className="px-5 py-4 text-gray-900 font-medium">{row.city}</td>
                  <td className="px-5 py-4 text-gray-800">{row.province}</td>
                  <td
                    className="px-5 py-4 text-gray-900 font-semibold"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {formatBillions(row.total)}
                  </td>
                  <td className="px-5 py-4 text-gray-800">${row.perCapita.toLocaleString("en-CA")}</td>
                  <td className="px-5 py-4 text-gray-800">{row.topCategory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
