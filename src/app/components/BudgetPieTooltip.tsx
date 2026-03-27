import type { TooltipContentProps } from "recharts";
import { formatBillions } from "../data/budgetData";

const TOOLTIP_COLOR = "rgb(11, 37, 69)";

type PieDatum = {
  name?: string;
  value?: number;
  percentage?: number;
};

/**
 * Donut/pie hover: sector (category) name + amount, CivicLens navy text.
 */
export function BudgetPieTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const data = item.payload as PieDatum | undefined;
  const sector = String(data?.name ?? item.name ?? "").trim();
  const raw = data?.value ?? item.value;
  const n = typeof raw === "number" ? raw : Number(raw);
  const value = Number.isFinite(n) ? n : 0;

  if (!sector) return null;

  return (
    <div
      className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md text-sm leading-snug"
      style={{ color: TOOLTIP_COLOR, fontFamily: "Montserrat, sans-serif" }}
    >
      <div className="font-semibold">{sector}</div>
      <div className="mt-0.5">{formatBillions(value)}</div>
    </div>
  );
}
