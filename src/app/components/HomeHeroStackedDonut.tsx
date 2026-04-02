import { useCallback, useMemo, useState } from "react";
import type { PieSectorDataItem, TooltipContentProps } from "recharts";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatBillions } from "../data/budgetData";

const TOOLTIP_COLOR = "rgb(11, 37, 69)";

type DonutDatum = {
  name: string;
  value: number;
  color: string;
};

function DonutTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const data = item.payload as DonutDatum | undefined;
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

export function HomeHeroStackedDonut() {
  const outerData = [
    { name: "Health", value: 96_000_000_000, color: "#5aa647" },
    { name: "Education", value: 54_000_000_000, color: "#2f7d32" },
    { name: "Infrastructure", value: 28_000_000_000, color: "#f1a238" },
    { name: "Social Services", value: 36_000_000_000, color: "#d16534" },
    { name: "Environment", value: 22_000_000_000, color: "#3b82f6" },
  ];

  const innerData = [
    { name: "Health", value: 88_000_000_000, color: "#5aa647" },
    { name: "Education", value: 50_000_000_000, color: "#2f7d32" },
    { name: "Infrastructure", value: 30_000_000_000, color: "#f1a238" },
    { name: "Social Services", value: 32_000_000_000, color: "#d16534" },
    { name: "Environment", value: 20_000_000_000, color: "#3b82f6" },
  ];

  const innerByName = new Map(innerData.map((d) => [d.name, d.value]));
  const donutData: DonutDatum[] = outerData.map((d) => ({
    name: d.name,
    color: d.color,
    value: d.value + (innerByName.get(d.name) ?? 0),
  }));

  const [expanded, setExpanded] = useState(false);
  const [backgroundHint, setBackgroundHint] = useState<string | null>(null);

  const { innerRadius, outerRadius } = useMemo(() => {
    const bi = Math.max(42, Math.min(74, donutData.length * 13));
    const bo = Math.max(88, Math.min(152, donutData.length * 30));
    const boost = expanded ? 22 : 0;
    return {
      innerRadius: bi + boost * 0.45,
      outerRadius: bo + boost,
    };
  }, [donutData.length, expanded]);

  const handleSliceClick = useCallback(
    (_data: PieSectorDataItem, _index: number, e: React.MouseEvent<SVGGraphicsElement>) => {
      e.stopPropagation();
      setExpanded(true);
      setBackgroundHint(null);
    },
    [],
  );

  const handleChartBackgroundClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as Element).closest(".recharts-pie-sector")) {
      return;
    }
    setBackgroundHint("Click slice");
    setExpanded(false);
  }, []);

  return (
    <div className="w-full h-full flex flex-col min-h-0 flex-1">
      <p
        className="shrink-0 text-base sm:text-lg font-semibold text-white/90 mb-2 text-center lg:text-left"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        Interactive chart
      </p>

      {backgroundHint != null ? (
        <p
          className="shrink-0 text-center lg:text-left text-sm text-white/75 mb-2"
          style={{ fontFamily: "Montserrat, sans-serif" }}
          role="status"
        >
          {backgroundHint}
        </p>
      ) : null}

      <div
        className="flex-1 min-h-[260px] sm:min-h-[300px] lg:min-h-0 w-full transition-transform duration-300 ease-out [&_path]:outline-none [&_path]:focus:outline-none"
        style={{ transform: expanded ? "scale(1.08)" : "scale(1)", transformOrigin: "center center" }}
      >
        {/* Background clicks show hint; slice clicks use stopPropagation + Pie onClick */}
        <div className="h-full w-full cursor-default" onClick={handleChartBackgroundClick}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={1}
                isAnimationActive
                animationDuration={380}
                animationEasing="ease-out"
                onClick={handleSliceClick}
              >
                {donutData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth={1}
                    className="cursor-pointer"
                    style={{ outline: "none" }}
                  />
                ))}
              </Pie>
              <Tooltip content={DonutTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
