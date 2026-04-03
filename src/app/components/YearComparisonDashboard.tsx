import { BarChart3, DollarSign } from "lucide-react";
import * as React from "react";
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
import { formatBillions } from "../data/budgetData";
import { computeYearComparison, type YearComparisonInput } from "../lib/yearComparison";
import { BudgetPieTooltip } from "./BudgetPieTooltip";
import { PieActiveShape } from "./PieActiveShape";

type Props = YearComparisonInput;

export function YearComparisonDashboard({
  level,
  yearA,
  yearB,
  province,
  municipalSelection,
}: Props) {
  const vm = React.useMemo(
    () => computeYearComparison({ level, yearA, yearB, province, municipalSelection }),
    [level, yearA, yearB, province, municipalSelection],
  );

  if (vm.error) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full min-w-0 rounded-xl border-2 py-3 text-sm text-amber-900 break-words"
        style={{ borderColor: "#fcd34d", backgroundColor: "#fffbeb" }}
        role="status"
      >
        {vm.error}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
      <p className="text-xs sm:text-sm text-gray-600 break-words">
        <span className="font-semibold text-gray-800">{vm.scopeLabel}</span>
        <span className="text-gray-400 mx-2 hidden sm:inline">·</span>
        <span className="block sm:inline sm:mt-0 mt-1">
          Pie and bar charts use <strong>combined</strong> amounts ({vm.yearLabelA} + {vm.yearLabelB}) by sector. The
          table lists each sector&apos;s total for each year separately.
        </span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="min-w-0 bg-white rounded-xl border-2 p-5 flex items-start gap-4 sm:col-span-1"
          style={{ borderColor: "#e8eef5" }}
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#e8eef5" }}
          >
            <BarChart3 className="w-6 h-6" style={{ color: "#0B2545" }} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Combined total ({vm.yearLabelA} + {vm.yearLabelB})</p>
            <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {formatBillions(vm.combinedTotal)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 p-5 flex items-start gap-4" style={{ borderColor: "#e8eef5" }}>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#e8eef5" }}
          >
            <DollarSign className="w-6 h-6" style={{ color: "#0B2545" }} />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total fiscal {vm.yearLabelA}</p>
            <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {formatBillions(vm.totalA)}
            </p>
          </div>
        </div>

        <div className="min-w-0 bg-white rounded-xl border-2 p-5 flex items-start gap-4" style={{ borderColor: "#e8eef5" }}>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#e8eef5" }}
          >
            <DollarSign className="w-6 h-6" style={{ color: "#0B2545" }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-600 mb-1">Total fiscal {vm.yearLabelB}</p>
            <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {formatBillions(vm.totalB)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="min-w-0 bg-white rounded-xl border-2 p-5 md:p-6" style={{ borderColor: "#e8eef5" }}>
          <h3
            className="text-lg font-bold text-gray-900 mb-1"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Combined sector mix
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Share of total combined spending ({vm.yearLabelA} + {vm.yearLabelB}) across sectors.
          </p>
          <div className="h-[220px] sm:h-[280px] w-full min-w-0 max-w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vm.pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={100}
                  paddingAngle={1}
                  activeShape={PieActiveShape}
                  animationDuration={280}
                  animationEasing="ease-out"
                  label={(props: { percent?: number }) =>
                    props.percent != null ? `${(props.percent * 100).toFixed(1)}%` : ""
                  }
                >
                  {vm.pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="#fff" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip content={BudgetPieTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mt-4">
            {vm.pieData.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs text-gray-900 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="leading-tight">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 bg-white rounded-xl border-2 p-5 md:p-6" style={{ borderColor: "#e8eef5" }}>
          <h3
            className="text-lg font-bold text-gray-900 mb-1"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            Combined spending by sector
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Billions — sum of both years per sector ({vm.yearLabelA} + {vm.yearLabelB}).
          </p>
          <div className="h-[min(400px,70vh)] sm:h-[400px] w-full min-w-0 max-w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vm.barData} layout="vertical" margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, "dataMax"]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 9 }} interval={0} />
                <Tooltip
                  formatter={(value) => {
                    const n = typeof value === "number" ? value : Number(value);
                    const v = Number.isFinite(n) ? n : 0;
                    return [`$${v.toFixed(2)}B`, "Combined"];
                  }}
                  labelFormatter={(name) => String(name)}
                />
                <Bar dataKey="billions" radius={[0, 4, 4, 0]}>
                  {vm.barData.map((entry) => {
                    const color =
                      vm.sectorRows.find((r) => r.name === entry.name)?.color ?? "#0B2545";
                    return <Cell key={entry.name} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 overflow-hidden" style={{ borderColor: "#e8eef5" }}>
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Sector totals by year
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Amounts for <strong>{vm.yearLabelA}</strong> and <strong>{vm.yearLabelB}</strong> before combining.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                  Sector
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                  Total {vm.yearLabelA}
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                  Total {vm.yearLabelB}
                </th>
                <th className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500 px-5 py-3">
                  Combined
                </th>
              </tr>
            </thead>
            <tbody>
              {vm.sectorRows.map((row) => (
                <tr key={row.name} className="border-b border-gray-100">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className="text-gray-900 font-medium">{row.name}</span>
                    </div>
                  </td>
                  <td
                    className="px-5 py-4 text-right font-bold text-gray-900"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {formatBillions(row.amountA)}
                  </td>
                  <td
                    className="px-5 py-4 text-right font-bold text-gray-900"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {formatBillions(row.amountB)}
                  </td>
                  <td
                    className="px-5 py-4 text-right text-gray-800"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {formatBillions(row.combined)}
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
                  {formatBillions(vm.totalA)}
                </td>
                <td
                  className="px-5 py-4 text-right font-bold text-gray-900"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {formatBillions(vm.totalB)}
                </td>
                <td
                  className="px-5 py-4 text-right font-bold text-gray-900"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {formatBillions(vm.combinedTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
