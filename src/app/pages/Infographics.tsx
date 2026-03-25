import { Facebook, Linkedin, Mail, Twitter } from "lucide-react";
import * as React from "react";
import { BUDGET_LEVEL_OPTIONS, type BudgetLevel, getBudgetApiBase, toBudgetLevelParam } from "../lib/budgetApi";
import { cn } from "../components/ui/utils";
import { navButtonBase } from "../lib/navButtonStyles";

const SHARE_LINKS = [
  { name: "Email", href: "mailto:?subject=CivicLens Infographics&body=https://civiclens.ca/infographics", Icon: Mail },
  { name: "Facebook", href: "https://www.facebook.com/sharer/sharer.php?u=https://civiclens.ca/infographics", Icon: Facebook },
  { name: "X", href: "https://x.com/intent/tweet?url=https://civiclens.ca/infographics&text=Infographics", Icon: Twitter },
  { name: "LinkedIn", href: "https://www.linkedin.com/sharing/share-offsite/?url=https://civiclens.ca", Icon: Linkedin },
];

type InfographicItem = {
  id: string;
  title: string;
  subtitle: string;
  dateLabel: string;
  imageSrc: string;
  body: string;
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

function makeInfographicImage(title: string, subtitle: string, body: string, accent: string): string {
  const safeTitle = svgEscape(title).slice(0, 42);
  const safeSubtitle = svgEscape(subtitle).slice(0, 40);
  const safeBody = svgEscape(body).slice(0, 110);
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
<text x='40' y='164' fill='white' font-size='26' font-family='Arial, sans-serif' font-weight='700'>DATA DETAILS</text>
<rect x='40' y='196' width='560' height='1' fill='rgba(255,255,255,0.16)'/>
<text x='40' y='236' fill='white' font-size='16' font-family='Arial, sans-serif'>${safeBody}</text>
<rect x='40' y='316' width='220' height='14' rx='7' fill='rgba(255,255,255,0.2)'/>
<rect x='40' y='316' width='110' height='14' rx='7' fill='${accent}'/>
<circle cx='540' cy='290' r='54' fill='rgba(255,255,255,0.1)'/>
<circle cx='540' cy='290' r='40' fill='${accent}'/>
<text x='505' y='295' fill='white' font-size='14' font-family='Arial, sans-serif' font-weight='700'>MCP</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

type GlamaServerResponse = {
  name?: string;
  namespace?: string;
  description?: string;
  attributes?: string[];
};

function buildInfographicItems(
  glama: GlamaServerResponse,
  level: BudgetLevel,
  year: string,
  category: string,
): InfographicItem[] {
  const accent = pickAccent(level);
  const subtitle = category ? `${level} • ${category}` : `${level} • All categories`;
  const dateLabel = `${year} • Infographics`;
  const baseName = glama.name ?? "Government of Canada Open Data MCP Servers";
  const body = glama.description ?? "No description provided by the Glama MCP server listing.";
  const attrs = Array.isArray(glama.attributes) && glama.attributes.length > 0 ? glama.attributes : ["MCP server attributes"];

  const overview: InfographicItem = {
    id: `overview-${level}`,
    title: baseName,
    subtitle,
    dateLabel,
    imageSrc: makeInfographicImage(baseName, subtitle, body, accent),
    body,
  };

  const attrItems: InfographicItem[] = attrs.slice(0, 8).map((attr, idx) => ({
    id: `attr-${idx}-${attr}`,
    title: attr,
    subtitle,
    dateLabel,
    imageSrc: makeInfographicImage(attr, subtitle, body, accent),
    body,
  }));

  return [overview, ...attrItems].slice(0, 9);
}

export default function Infographics() {
  const [level, setLevel] = React.useState<BudgetLevel>("Federal");
  const [year, setYear] = React.useState<string>("2025");
  const [category, setCategory] = React.useState<string>("");
  const [yearOptions, setYearOptions] = React.useState<string[]>(["2025"]);
  const [categoryOptions, setCategoryOptions] = React.useState<string[]>([]);
  const [yearsLoading, setYearsLoading] = React.useState(false);
  const [categoriesLoading, setCategoriesLoading] = React.useState(false);
  const [glamaServer, setGlamaServer] = React.useState<GlamaServerResponse | null>(null);
  const [glamaLoading, setGlamaLoading] = React.useState(true);
  const [glamaError, setGlamaError] = React.useState<string | null>(null);
  const [expandedItem, setExpandedItem] = React.useState<InfographicItem | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const endpoint = "https://glama.ai/api/mcp/v1/servers/krunal16-c/gov-ca-mcp";
    setGlamaLoading(true);
    setGlamaError(null);

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch Glama MCP server listing");
        return res.json() as Promise<GlamaServerResponse>;
      })
      .then((data) => {
        if (!cancelled) setGlamaServer(data);
      })
      .catch((err) => {
        if (!cancelled) setGlamaError(String(err ?? "Unknown error"));
      })
      .finally(() => {
        if (!cancelled) setGlamaLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
        if (!cancelled) setCategoryOptions(list);
      })
      .catch(() => {
        if (!cancelled) setCategoryOptions([]);
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
      setCategory("");
      return;
    }
    setCategory((prev) => (categoryOptions.includes(prev) ? prev : categoryOptions[0]!));
  }, [categoryOptions]);

  const infographicItems = React.useMemo(() => {
    if (!glamaServer) return [];
    return buildInfographicItems(glamaServer, level, year, category);
  }, [glamaServer, level, year, category]);

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
                We turn complex public finance data into clear, visual stories that make budgets easier to understand.
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

      {glamaLoading && glamaServer == null ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="rounded-xl border-2 px-5 py-12 text-center text-gray-600" style={{ borderColor: "#e8eef5" }}>
            Loading infographic data…
          </div>
        </div>
      ) : null}

      {!glamaLoading && glamaServer == null && glamaError ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="rounded-xl border-2 px-5 py-8 text-center text-gray-600" style={{ borderColor: "#e8eef5" }} role="status">
            Failed to load Glama infographic data.
          </div>
        </div>
      ) : null}
    </div>
  );
}
