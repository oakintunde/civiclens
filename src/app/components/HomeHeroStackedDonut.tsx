import { useCallback, useState } from "react";
import type { PieSectorDataItem, PieSectorShapeProps, TooltipContentProps } from "recharts";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, Tooltip } from "recharts";
import { formatBillions } from "../data/budgetData";

const TOOLTIP_COLOR = "rgb(11, 37, 69)";

type DonutDatum = {
  name: string;
  value: number;
  color: string;
};

function ActiveSector({ popOutPx, ...props }: PieSectorDataItem & { popOutPx: number }) {
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const innerRadius = Number(props.innerRadius ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const startAngle = Number(props.startAngle ?? 0);
  const endAngle = Number(props.endAngle ?? 0);
  const fill = typeof props.fill === "string" ? props.fill : "#888";
  const stroke = typeof props.stroke === "string" ? props.stroke : fill;
  const strokeWidth = typeof props.strokeWidth === "number" ? props.strokeWidth : 1;
  const cornerRadius =
    typeof props.cornerRadius === "number" && !Number.isNaN(props.cornerRadius)
      ? props.cornerRadius
      : undefined;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + popOutPx}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      cornerRadius={cornerRadius}
      style={{
        outline: "none",
        filter: "drop-shadow(0 3px 8px rgba(11, 37, 69, 0.22))",
        transition: "filter 0.2s ease-out, outer-radius 0.2s ease-out",
      }}
    />
  );
}

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

  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const handleSliceClick = useCallback(
    (_data: PieSectorDataItem, index: number, e: React.MouseEvent<SVGGraphicsElement>) => {
      e.stopPropagation();
      setClickedIndex((prev) => (prev === index ? null : index));
    },
    [],
  );

  const handleChartBackgroundClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as Element).closest(".recharts-pie-sector")) return;
    setClickedIndex(null);
  }, []);

  const renderSectorShape = useCallback(
    (props: PieSectorShapeProps) => {
      const expanded = props.isActive || props.index === clickedIndex;
      if (expanded) {
        return <ActiveSector {...props} popOutPx={10} />;
      }
      const { isActive, index, ...rest } = props;
      void isActive;
      void index;
      return (
        <Sector
          {...rest}
          style={{
            outline: "none",
            ...(rest.style && typeof rest.style === "object" ? rest.style : {}),
          }}
        />
      );
    },
    [clickedIndex],
  );

  return (
    <div className="w-full h-full flex flex-col min-h-0 flex-1">
      <p
        className="shrink-0 text-base sm:text-lg font-semibold text-white/90 mb-2 text-center lg:text-left"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        Interactive chart
      </p>

      <div className="flex-1 min-h-[260px] sm:min-h-[300px] lg:min-h-0 w-full [&_path]:outline-none">
        <div className="h-full w-full cursor-default" onClick={handleChartBackgroundClick}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={Math.max(42, Math.min(74, donutData.length * 13))}
                outerRadius={Math.max(88, Math.min(152, donutData.length * 30))}
                paddingAngle={1}
                isAnimationActive
                animationDuration={520}
                animationEasing="ease-out"
                shape={renderSectorShape}
                onClick={handleSliceClick}
              >
                {donutData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth={1}
                    className="cursor-pointer"
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
