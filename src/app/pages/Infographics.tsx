import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import * as React from "react";
import { cn } from "../components/ui/utils";
import {
  getFederalBudgetForYear,
  getMunicipalBudgetsForYear,
  provincialBudgets2025,
} from "../data/budgetData";
import { BUDGET_LEVEL_OPTIONS, type BudgetLevel, getBudgetApiBase, toBudgetLevelParam } from "../lib/budgetApi";
import { navButtonBase } from "../lib/navButtonStyles";

const SHARE_LINKS = [
  { name: "Facebook", href: "https://www.facebook.com/sharer/sharer.php?u=https://civiclens.ca/infographics", Icon: Facebook },
  { name: "Instagram", href: "https://www.instagram.com/", Icon: Instagram },
  { name: "X", href: "https://x.com/intent/tweet?url=https://civiclens.ca/infographics&text=Infographics", Icon: Twitter },
  { name: "LinkedIn", href: "https://www.linkedin.com/sharing/share-offsite/?url=https://civiclens.ca/infographics", Icon: Linkedin },
];

type InfographicItem = {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  amount: number;
  imageSrc: string;
};

function pickAccent(level: BudgetLevel): string {
  if (level === "Federal") return "#0B2545";
  if (level === "Province") return "#318cca";
  return "#f48945";
}

function svgEscape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatAmountShort(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(0)}M`;
  return `$${Math.round(amount).toLocaleString("en-CA")}`;
}

function makeInfographicImage(title: string, subtitle: string, amount: number, accent: string): string {
  const safeTitle = svgEscape(title).slice(0, 42);
  const safeSubtitle = svgEscape(subtitle).slice(0, 42);
  const amountLabel = formatAmountShort(amount);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='420' viewBox='0 0 640 420'>
<defs>
<linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
<stop offset='0%' stop-color='#0B2545'/>
<stop offset='100%' stop-color='#193865'/>
</linearGradient>
</defs>
<rect width='640' height='420' fill='url(#bg)'/>
<rect x='24' y='24' width='592' height='58' rx='10' fill='rgba(255,255,255,0.08)'/>
<text x='40' y='61' fill='white' font-size='22' font-family='Arial, sans-serif' font-weight='700'>${safeTitle}</text>
<text x='40' y='113' fill='#d6e4ef' font-size='16' font-family='Arial, sans-serif'>${safeSubtitle}</text>
<text x='40' y='164' fill='white' font-size='48' font-family='Arial, sans-serif' font-weight='700'>${amountLabel}</text>
<rect x='40' y='220' width='420' height='18' rx='9' fill='rgba(255,255,255,0.18)'/>
<rect x='40' y='220' width='160' height='18' rx='9' fill='${accent}'/>
<rect x='40' y='258' width='280' height='16' rx='8' fill='rgba(255,255,255,0.18)'/>
<rect x='40' y='258' width='220' height='16' rx='8' fill='#8ab6d6'/>
<circle cx='560' cy='300' r='64' fill='rgba(255,255,255,0.08)'/>
<circle cx='560' cy='300' r='46' fill='${accent}'/>
<text x='528' y='307' fill='white' font-size='16' font-family='Arial, sans-serif' font-weight='700'>BUDGET</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const ALL_CATEGORIES_OPTION = "All";

function buildProvinceBudgetsForYear(year: number) {
  const base = 2025;
  const t = year - base;
  const factor = 1 + t * 0.012;
  return provincialBudgets2025.map((p) => ({
    ...p,
    total: Math.round(p.total * factor),
    perCapita: Math.round(p.perCapita * factor),
    topCategories: p.topCategories.map((c) => ({ ...c, amount: Math.round(c.amount * factor) })),
  }));
}

function buildInfographicItems(level: BudgetLevel, year: string, category: string): InfographicItem[] {
  const accent = pickAccent(level);
  const isAll = !category || category === ALL_CATEGORIES_OPTION;
  const y = parseInt(year, 10) || 2025;
  const dateLabel = `${y} • Infographics`;

  if (level === "Federal") {
    const snap = getFederalBudgetForYear(y);
    const list = snap.categories
      .filter((c) => isAll || c.name === category)
      .sort((a, b) => b.amount - a.amount);
    return list.slice(0, 9).map((c, idx) => ({
      id: `fed-${c.name}-${idx}`,
      title: c.name,
      subtitle: isAll ? "Federal spending category" : `Federal spending: ${c.name}`,
      dateLabel,
      amount: c.amount,
      imageSrc: makeInfographicImage(c.name, isAll ? "Federal spending category" : c.name, c.amount, accent),
    }));
  }

  if (level === "Province") {
    const budgets = buildProvinceBudgetsForYear(y);
    const rows = budgets.flatMap((p) =>
      p.topCategories
        .filter((c) => isAll || c.name === category)
        .map((c, idx) => ({
          id: `prov-${p.province}-${c.name}-${idx}`,
          title: `${p.province} - ${c.name}`,
          subtitle: isAll ? "Provincial spending category" : `Provincial spending: ${c.name}`,
          dateLabel,
          amount: c.amount,
          imageSrc: makeInfographicImage(`${p.province}`, c.name, c.amount, accent),
        })),
    );
    return rows.sort((a, b) => b.amount - a.amount).slice(0, 9);
  }

  const cities = getMunicipalBudgetsForYear(y);
  const rows = cities.flatMap((m) =>
    m.topCategories
      .filter((c) => isAll || c.name === category)
      .map((c, idx) => ({
        id: `mun-${m.city}-${c.name}-${idx}`,
        title: `${m.city} - ${c.name}`,
        subtitle: isAll ? "Municipal spending category" : `Municipal spending: ${c.name}`,
        dateLabel,
        amount: c.amount,
        imageSrc: makeInfographicImage(`${m.city}`, c.name, c.amount, accent),
      })),
  );
  return rows.sort((a, b) => b.amount - a.amount).slice(0, 9);
}

export default function Infographics() {
  const [level, setLevel] = React.useState<BudgetLevel>("Federal");
  const [year, setYear] = React.useState<string>("2025");
  const [category, setCategory] = React.useState<string>(ALL_CATEGORIES_OPTION);
  const [yearOptions, setYearOptions] = React.useState<string[]>(["2025"]);
  const [categoryOptions, setCategoryOptions] = React.useState<string[]>([]);
  const [yearsLoading, setYearsLoading] = React.useState(false);
  const [categoriesLoading, setCategoriesLoading] = React.useState(false);
  const [expandedItem, setExpandedItem] = React.useState<InfographicItem | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const base = getBudgetApiBase();
    const param = toBudgetLevelParam(level);
    setYearsLoading(true);
    setCategoriesLoading(true);

    const yearsP = fetch(`${base}/api/budget-years?level=${param}`)
      .then((res) => {
        if (!res.ok) throw new Error("budget-years fetch failed");
        return res.json() as Promise<{ years?: unknown }>;
      })
      .then((data) => {
        const list = Array.isArray(data.years)
          ? data.years
              .map((y) => (typeof y === "number" ? String(y) : typeof y === "string" ? y : null))
              .filter((x): x is string => x !== null && x.length > 0)
          : [];
        if (!cancelled && list.length > 0) setYearOptions(list);
      })
      .catch(() => {
        if (!cancelled) setYearOptions(["2025"]);
      })
      .finally(() => {
        if (!cancelled) setYearsLoading(false);
      });

    const categoriesP = fetch(`${base}/api/categories?level=${param}`)
      .then((res) => {
        if (!res.ok) throw new Error("categories fetch failed");
        return res.json() as Promise<{ categories?: unknown }>;
      })
      .then((data) => {
        const list = Array.isArray(data.categories)
          ? data.categories.filter((x): x is string => typeof x === "string" && x.length > 0)
          : [];
        if (!cancelled) setCategoryOptions([ALL_CATEGORIES_OPTION, ...list]);
      })
      .catch(() => {
        if (!cancelled) setCategoryOptions([ALL_CATEGORIES_OPTION]);
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false);
      });

    return () => {
      cancelled = true;
      void yearsP;
      void categoriesP;
    };
  }, [level]);

  React.useEffect(() => {
    if (yearOptions.length === 0) return;
    setYear((prev) => (yearOptions.includes(prev) ? prev : yearOptions[0]!));
  }, [yearOptions]);

  React.useEffect(() => {
    if (categoryOptions.length === 0) {
      setCategory(ALL_CATEGORIES_OPTION);
      return;
    }
    setCategory((prev) => (categoryOptions.includes(prev) ? prev : categoryOptions[0]!));
  }, [categoryOptions]);

  const infographicItems = React.useMemo(
    () => buildInfographicItems(level, year, category),
    [level, year, category],
  );

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <section
        style={{
          background: "linear-gradient(to bottom right, #0B2545, #193865, #234b7f)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-3xl">
              <h1
                className="text-4xl md:text-5xl font-bold text-white mb-3"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Infographics
              </h1>
              <p className="text-base md:text-lg text-white/90">
                We pioneered the art of using data and design to simplify the budget
              </p>
            </div>

            <div className="self-start md:self-auto">
              <p className="text-white font-semibold mb-3 md:text-right">Share this page</p>
              <div className="flex items-center gap-2 md:justify-end">
                {SHARE_LINKS.map(({ name, href, Icon }, idx) => (
                  <div key={name} className="flex items-center gap-2">
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Share on ${name}`}
                      title={`Share on ${name}`}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 border-white/80 text-white hover:bg-[#f48945] hover:border-[#f48945] transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                    {idx < SHARE_LINKS.length - 1 ? <span className="text-white/40">|</span> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border-2 p-5 md:p-6" style={{ borderColor: "#e8eef5" }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Government Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as BudgetLevel)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca]"
              >
                {BUDGET_LEVEL_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={yearsLoading || yearOptions.length === 0}
                aria-busy={yearsLoading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca] disabled:opacity-60"
              >
                {yearOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={categoriesLoading || categoryOptions.length === 0}
                aria-busy={categoriesLoading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca] disabled:opacity-60"
              >
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-start gap-3">
            <button
              type="button"
              className={cn(
                navButtonBase,
                "min-w-[140px] border-2 border-[#318cca] bg-[#318cca] text-white hover:bg-[#f48945] hover:border-[#f48945]",
              )}
            >
              Filter
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {infographicItems.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-xl border-2 overflow-hidden"
              style={{ borderColor: "#e8eef5" }}
            >
              <div
                className="relative cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => setExpandedItem(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setExpandedItem(item);
                }}
              >
                <img src={item.imageSrc} alt={item.title} className="w-full h-[280px] object-cover" />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">{item.dateLabel}</p>
                <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {expandedItem ? (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setExpandedItem(null)}
        >
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-end mb-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-white text-gray-900 font-medium"
                onClick={() => setExpandedItem(null)}
              >
                Close
              </button>
            </div>
            <img
              src={expandedItem.imageSrc}
              alt={expandedItem.title}
              className="w-full h-auto rounded-xl border-2 border-white/20"
            />
          </div>
        </div>
      ) : null}

      {infographicItems.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="rounded-xl border-2 px-5 py-8 text-center text-gray-600" style={{ borderColor: "#e8eef5" }} role="status">
            No infographic cards available for the selected filters.
          </div>
        </div>
      ) : null}
    </div>
  );
}
