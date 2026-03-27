import type { PieSectorDataItem } from "recharts";
import { Sector } from "recharts";

/** Extra pixels beyond the base outer radius for the hovered slice (“pop out”). */
const POP_OUT_PX = 12;

/**
 * Active donut slice: larger radius + light shadow. Used as Recharts `Pie` `activeShape`
 * (active index follows tooltip hover).
 */
export function PieActiveShape(props: PieSectorDataItem) {
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const innerRadius = Number(props.innerRadius ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const startAngle = Number(props.startAngle ?? 0);
  const endAngle = Number(props.endAngle ?? 0);
  const fill = typeof props.fill === "string" ? props.fill : "#888";
  const stroke = typeof props.stroke === "string" ? props.stroke : "#fff";
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
      outerRadius={outerRadius + POP_OUT_PX}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      cornerRadius={cornerRadius}
      style={{
        filter: "drop-shadow(0 3px 8px rgba(11, 37, 69, 0.22))",
        transition: "filter 0.2s ease-out",
      }}
    />
  );
}
