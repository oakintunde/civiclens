import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react";
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
import { cn } from "../components/ui/utils";
import { formatBillions, getFederalBudgetForYear } from "../data/budgetData";

type Props = {
  year: string;
  /** Matches Sector dropdown / table category names; highlighted in charts. */
  selectedSector: string;
};

export function FederalBudgetDashboard({ year, selectedSector }: Props) {
  const y = Number.parseInt(year, 10) || 2025;
  const snap = getFederalBudgetForYear(y);

  const pieData = snap.categories.map((c) => ({
    name: c.name,
    value: c.amount,
    percentage: c.percentage,
    color: c.color,
  }));

  const barData = [...snap.categories]
    .sort((a, b) => a.amount - b.amount)
    .map((c) => ({
      name: c.name,
      billions: c.amount / 1e9,
    }));

  const tableRows = [...snap.categories].sort((a, b) => b.amount - a.amount);

  const totalPercentage = snap.categories.reduce((sum, c) => sum + c.percentage, 0);

  return (
    <div className="space-y-8">
      {/* Summary metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
              {formatBillions(snap.total)}
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
              ${snap.perCapita.toLocaleString("en-CA")}
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
            <TrendingUp className="w-6 h-6" style={{ color: "#0B2545" }} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">YoY Growth</p>
            <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {snap.yoyPercent >= 0 ? "+" : ""}
              {snap.yoyPercent.toFixed(1)}%
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
            <Calendar className="w-6 h-6" style={{ color: "#0B2545" }} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Fiscal Year</p>
            <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {snap.year}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="bg-white rounded-xl border-2 p-5 md:p-6"
          style={{ borderColor: "#e8eef5" }}
        >
          <h3
            className="text-lg font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Budget Distribution
          </h3>
          <div className="h-[280px] w-full">
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
                    const selected = entry.name === selectedSector;
                    return (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                        fillOpacity={selected ? 1 : 0.35}
                        stroke={selected ? "#f48945" : "#fff"}
                        strokeWidth={selected ? 4 : 1}
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
            {snap.categories.map((c) => (
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
            Spending by Category (Billions)
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  domain={[0, "dataMax"]}
                  tickFormatter={(v) => `${v}`}
                  tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={118}
                  tick={{ fontSize: 10 }}
                  interval={0}
                />
                <Tooltip
                  formatter={(value) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const v = Number.isFinite(n) ? n : 0;
                    return [`$${v.toFixed(1)}B`, "Spending"];
                  }}
                  labelFormatter={(name) => String(name)}
                />
                <Bar dataKey="billions" radius={[0, 4, 4, 0]}>
                  {barData.map((entry) => {
                    const selected = entry.name === selectedSector;
                    return (
                      <Cell
                        key={entry.name}
                        fill={selected ? "#f48945" : "#0B2545"}
                        fillOpacity={selected ? 1 : 0.35}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed table */}
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
              {tableRows.map((row) => (
                <tr
                  key={row.name}
                  className={cn(
                    "border-b border-gray-100",
                    row.name === selectedSector && "bg-[#fff7f0]",
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="text-gray-900 font-medium">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {formatBillions(row.amount)}
                  </td>
                  <td className="px-5 py-4 text-right text-gray-800">{row.percentage.toFixed(1)}%</td>
                  <td className="px-5 py-4">
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          row.name === selectedSector ? "bg-[#f48945]" : "bg-[#0B2545]",
                        )}
                        style={{ width: `${Math.min(100, row.percentage)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
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
                  {formatBillions(snap.total)}
                </td>
                <td className="px-5 py-4 text-right font-bold text-gray-900">
                  {totalPercentage.toFixed(1)}%
                </td>
                <td className="px-5 py-4" aria-hidden />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
