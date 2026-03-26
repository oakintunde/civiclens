import type { BudgetInfographicDataset } from "./budgetInfographicDataset";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function miniIconPath(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("health")) return "M12 4 L20 22 L4 22 Z";
  if (n.includes("education") || n.includes("skill")) return "M4 6 H20 V18 H4 Z M8 10 H16";
  if (n.includes("defence") || n.includes("defense")) return "M6 18 L12 6 L18 18 Z";
  if (n.includes("transport")) return "M4 16 H20 L18 8 H6 Z";
  if (n.includes("water") || n.includes("waste")) return "M8 6 C8 6 4 14 8 18 C12 22 16 14 16 10 C16 6 12 4 8 6 Z";
  if (n.includes("emergency") || n.includes("police")) return "M12 4 L14 12 H22 L15 17 L18 25 L12 20 L6 25 L9 17 L2 12 H10 Z";
  if (n.includes("park") || n.includes("recreation")) return "M12 4 C8 4 4 8 4 14 C4 20 12 24 12 24 C12 24 20 20 20 14 C20 8 16 4 12 4 Z";
  if (n.includes("elderly") || n.includes("family") || n.includes("children")) return "M12 6 C9 6 6 9 6 14 C6 19 12 22 12 22 C12 22 18 19 18 14 C18 9 15 6 12 6 Z";
  if (n.includes("debt")) return "M4 8 H20 V20 H4 Z M8 12 H16 M8 16 H14";
  if (n.includes("infrastructure")) return "M4 20 H20 M6 20 V10 H10 V20 M14 20 V14 H18 V20";
  return "M6 6 L18 12 L6 18 Z";
}

function layoutRects(weights: number[], W: number, H: number): { x: number; y: number; w: number; h: number }[] {
  const pad = 12;
  const innerW = W - 2 * pad;
  const innerH = H - 2 * pad;
  const n = weights.length;
  if (n === 0) return [];
  if (n === 1) return [{ x: pad, y: pad, w: innerW, h: innerH }];
  const leftRatio = 0.55;
  const lw = innerW * leftRatio;
  const rw = innerW - lw - pad;
  const rects: { x: number; y: number; w: number; h: number }[] = [];
  rects.push({ x: pad, y: pad, w: lw - pad, h: innerH });
  const sub = weights.slice(1);
  const sum = sub.reduce((a, b) => a + b, 0) || 1;
  let cy = pad;
  const gap = 8;
  let used = 0;
  sub.forEach((wt, i) => {
    const isLast = i === sub.length - 1;
    const share = (wt / sum) * innerH;
    const hh = isLast ? Math.max(40, innerH - used) : Math.max(52, share - gap);
    rects.push({ x: pad + lw, y: cy, w: rw, h: hh });
    used += hh + gap;
    cy += hh + gap;
  });
  return rects;
}

function formatBlockAmount(amount: number): string {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)}T`;
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B`;
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(1)}M`;
  return `${Math.round(amount / 1e3)}K`;
}

export function renderBudgetInfographicSvg(data: BudgetInfographicDataset): string {
  const W = 720;
  const H = 920;
  const headerH = 120;
  const totalH = 100;
  const gridY = headerH + totalH + 16;
  const gridH = H - gridY - 56;
  const gx = 24;
  const innerW = W - 48;
  const weights = data.items.map((i) => i.amount);
  const rects = layoutRects(weights, innerW, gridH);

  const blocks = data.items
    .map((item, idx) => {
      const r = rects[idx];
      if (!r) return "";
      const rx = gx + r.x;
      const ry = gridY + r.y;
      const isHi = Boolean(data.highlightName && item.name === data.highlightName);
      const stroke = isHi ? "#f48945" : "#ffffff";
      const sw = isHi ? 4 : 2;
      const textFill = "#ffffff";
      const icon = miniIconPath(item.name);
      return `
  <g>
    <rect x="${rx}" y="${ry}" width="${r.w}" height="${r.h}" rx="6" fill="${item.color}" stroke="${stroke}" stroke-width="${sw}"/>
    <path d="${icon}" fill="${textFill}" fill-opacity="0.35" transform="translate(${rx + 12},${ry + 10}) scale(0.85)"/>
    <text x="${rx + 14}" y="${ry + 44}" fill="${textFill}" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700">${esc(item.name)}</text>
    <text x="${rx + 14}" y="${ry + 72}" fill="${textFill}" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="800">${esc(
      formatBlockAmount(item.amount),
    )}</text>
  </g>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <pattern id="headerPat" patternUnits="userSpaceOnUse" width="12" height="12">
      <path d="M0 12 L12 0 M-2 2 L2 -2 M10 14 L14 10" stroke="#1a202c" stroke-width="0.8" opacity="0.35"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="#f8fafc"/>
  <rect x="0" y="0" width="${W}" height="${headerH}" fill="#2d3748"/>
  <rect x="0" y="0" width="${W}" height="${headerH}" fill="url(#headerPat)" opacity="0.5"/>
  <text x="32" y="52" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="800">${esc(
    data.headerYearLine1,
  )}</text>
  <text x="32" y="92" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="800">${esc(
    data.headerYearLine2,
  )}</text>
  <text x="120" y="58" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="800">${esc(
    data.headline,
  )}</text>
  <text x="120" y="88" fill="#e2e8f0" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="600">${esc(
    data.subtitle,
  )}</text>
  <rect x="${W - 108}" y="28" width="76" height="64" rx="6" fill="#ffffff" fill-opacity="0.1"/>
  <path d="M${W - 96} 44 L${W - 52} 44 M${W - 74} 52 L${W - 74} 76 M${W - 88} 68 H${W - 60}" stroke="#ffffff" stroke-opacity="0.45" stroke-width="2" fill="none"/>
  <rect x="24" y="${headerH + 12}" width="${W - 48}" height="${totalH - 8}" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <text x="44" y="${headerH + 42}" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="600">${esc(
    data.totalLabel,
  )}</text>
  <text x="44" y="${headerH + 82}" fill="#1e293b" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800">${esc(
    data.totalFormatted,
  )}</text>
  ${blocks}
  <text x="36" y="${H - 28}" fill="#94a3b8" font-family="Arial, Helvetica, sans-serif" font-size="11">${esc(data.unitNote)}</text>
  <text x="${W - 36}" y="${H - 28}" fill="#94a3b8" font-family="Arial, Helvetica, sans-serif" font-size="11" text-anchor="end">${esc(
    data.sourceNote,
  )}</text>
</svg>`;
}
