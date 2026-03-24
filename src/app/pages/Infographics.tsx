import { Facebook, Linkedin, Mail, Twitter } from "lucide-react";
import * as React from "react";

const SHARE_LINKS = [
  { name: "Email", href: "mailto:?subject=CivicLens Infographics&body=https://civiclens.ca/infographics", Icon: Mail },
  { name: "Facebook", href: "https://www.facebook.com/sharer/sharer.php?u=https://civiclens.ca/infographics", Icon: Facebook },
  { name: "X", href: "https://x.com/intent/tweet?url=https://civiclens.ca/infographics&text=Infographics", Icon: Twitter },
  { name: "LinkedIn", href: "https://www.linkedin.com/sharing/share-offsite/?url=https://civiclens.ca", Icon: Linkedin },
];

const LEVEL_OPTIONS = ["Federal", "Province", "Municipal"] as const;

function getApiBase(): string {
  const explicit = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "");
  if (explicit) return explicit;
  const newsUrl = import.meta.env.VITE_NEWS_API_URL as string | undefined;
  if (newsUrl) {
    try {
      return new URL(newsUrl).origin;
    } catch {
      /* ignore */
    }
  }
  return "http://localhost:3001";
}

function levelQueryParam(level: (typeof LEVEL_OPTIONS)[number]): "federal" | "province" | "municipal" {
  if (level === "Federal") return "federal";
  if (level === "Province") return "province";
  return "municipal";
}

export default function Infographics() {
  const [level, setLevel] = React.useState<(typeof LEVEL_OPTIONS)[number]>("Federal");
  const [year, setYear] = React.useState<string>("2025");
  const [category, setCategory] = React.useState<string>("");
  const [yearOptions, setYearOptions] = React.useState<string[]>(["2025"]);
  const [categoryOptions, setCategoryOptions] = React.useState<string[]>([]);
  const [yearsLoading, setYearsLoading] = React.useState(false);
  const [categoriesLoading, setCategoriesLoading] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const base = getApiBase();
    const param = levelQueryParam(level);
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Government Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as (typeof LEVEL_OPTIONS)[number])}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-[#318cca] focus:border-[#318cca]"
              >
                {LEVEL_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
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

            <div>
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
        </div>
      </section>
    </div>
  );
}
