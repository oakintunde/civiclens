import { BookOpen, CalendarDays, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import * as React from "react";
import { cn } from "../components/ui/utils";
import { navButtonPrimary } from "../lib/navButtonStyles";
import { getBudgetApiBase } from "../lib/budgetApi";

type NewsApiArticle = {
  source?: { name?: string };
  title?: string;
  description?: string;
  url?: string;
  publishedAt?: string;
};

type BudgetLevel = "federal" | "provincial" | "municipal";

type CategorizedArticle = NewsApiArticle & { level: BudgetLevel };

type BlogPost = {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  /** Display label for government level (Federal / Provincial / Municipal). */
  category: string;
  level: BudgetLevel;
  sourceName: string;
  excerpt: string;
  externalUrl?: string;
  content: Array<{ heading?: string; body: string }>;
};

/** Keep only headlines that clearly mention “budget” (client-side clean). */
function filterBudgetArticles(articles: NewsApiArticle[]): NewsApiArticle[] {
  return articles.filter((article) =>
    (article.title ?? "").toLowerCase().includes("budget"),
  );
}

/** Infer scope from headline keywords (wireframe logic). */
function categorizeArticle(article: NewsApiArticle): CategorizedArticle {
  const title = (article.title ?? "").toLowerCase();
  let level: BudgetLevel = "federal";
  if (title.includes("ontario") || title.includes("bc")) {
    level = "provincial";
  }
  if (title.includes("city") || title.includes("toronto")) {
    level = "municipal";
  }
  return { ...article, level };
}

function levelLabel(level: BudgetLevel): string {
  switch (level) {
    case "federal":
      return "Federal";
    case "provincial":
      return "Provincial";
    case "municipal":
      return "Municipal";
    default:
      return "Federal";
  }
}

function mapArticleToPost(a: CategorizedArticle, index: number): BlogPost {
  const title = a.title ?? "Untitled article";
  const published = a.publishedAt ? new Date(a.publishedAt) : null;
  const dateLabel = published
    ? published.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";
  const dateIso = published ? published.toISOString().slice(0, 10) : "";
  const excerpt = (a.description ?? "").trim() || title;
  const sourceName = a.source?.name?.trim() || "News";

  return {
    id: a.url ?? `news-${dateIso}-${index}`,
    title,
    date: dateIso,
    dateLabel,
    category: levelLabel(a.level),
    level: a.level,
    sourceName,
    excerpt,
    externalUrl: a.url,
    content: [
      {
        heading: "Summary",
        body: excerpt,
      },
    ],
  };
}

export default function Blog() {
  const NEWS_API_BASE =
    (import.meta as { env: { VITE_NEWS_API_URL?: string } }).env
      .VITE_NEWS_API_URL || "http://localhost:3001/api/news";

  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const pageSize = 12;
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const SUBSCRIBE_API_URL = `${getBudgetApiBase()}/api/subscribe`;
  const [subscriberName, setSubscriberName] = React.useState("");
  const [subscriberEmail, setSubscriberEmail] = React.useState("");
  const [subscribeSubmitting, setSubscribeSubmitting] = React.useState(false);
  const [subscribeResultMessage, setSubscribeResultMessage] = React.useState<string | null>(null);
  const [subscribeErrorMessage, setSubscribeErrorMessage] = React.useState<string | null>(null);

  const validateSubscribe = () => {
    const name = subscriberName.trim();
    const email = subscriberEmail.trim().toLowerCase();
    if (!name || name.length < 2) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email address.";
    return null;
  };

  const onSubmitSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeErrorMessage(null);
    setSubscribeResultMessage(null);

    const validationError = validateSubscribe();
    if (validationError) {
      setSubscribeErrorMessage(validationError);
      return;
    }

    setSubscribeSubmitting(true);
    try {
      const res = await fetch(SUBSCRIBE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subscriberName, email: subscriberEmail }),
      });

      const data = (await res.json().catch(() => ({}))) as
        | { alreadySubscribed?: boolean; message?: string; error?: string }
        | { error?: string };

      if (!res.ok) {
        setSubscribeErrorMessage((data as { error?: string }).error ?? "Subscription failed.");
        return;
      }

      setSubscribeResultMessage(data.message ?? "Thank you for subscribing!");
      if (!data.alreadySubscribed) {
        setSubscriberName("");
        setSubscriberEmail("");
      }
    } catch {
      setSubscribeErrorMessage("Network error. Please try again.");
    } finally {
      setSubscribeSubmitting(false);
    }
  };

  React.useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      setLoading(true);
      setError(null);
      try {
        const url = new URL(NEWS_API_BASE);
        url.searchParams.set("page", String(page));

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch news");

        const payload: unknown = await res.json();
        let articles: NewsApiArticle[] = [];
        let total = 0;

        if (Array.isArray(payload)) {
          articles = payload as NewsApiArticle[];
          total = articles.length;
        } else if (payload && typeof payload === "object" && "articles" in payload) {
          const p = payload as {
            articles?: NewsApiArticle[];
            totalResults?: number;
          };
          articles = p.articles ?? [];
          total = typeof p.totalResults === "number" ? p.totalResults : articles.length;
        }

        const filtered = filterBudgetArticles(articles);
        const categorized = filtered.map(categorizeArticle);
        const mapped = categorized.map(mapArticleToPost);

        if (!cancelled) {
          setPosts(mapped);
          setTotalResults(total);
        }
      } catch {
        if (!cancelled) {
          setPosts([]);
          setTotalResults(0);
          setError("Could not load articles. Is the news server running?");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadNews();
    return () => {
      cancelled = true;
    };
  }, [NEWS_API_BASE, page]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <div
        style={{
          background: "linear-gradient(to bottom right, #0B2545, #193865, #234b7f)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold text-white"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Blog
              </h1>
            </div>
            <p className="mt-1 text-base md:text-lg text-white/90 max-w-3xl">
              Canadian budget news from trusted outlets—scope (federal / provincial / municipal), date, source, and quick links.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-2xl font-bold text-gray-900"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Latest posts
              </h2>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>Page {page}</span>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm mb-4" role="alert">
                {error}
              </p>
            )}

            {loading ? (
              <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
                {Array.from({ length: pageSize }, (_, i) => i).map((i) => (
                  <div
                    key={i}
                    className="rounded-xl border-2 border-[#e8eef5] p-5 animate-pulse bg-white min-h-[220px]"
                  >
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                    <div className="h-6 bg-gray-200 rounded w-4/5 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <p className="text-gray-600">No articles found for this page.</p>
            ) : (
              <>
                <ul className="grid w-full list-none grid-cols-1 gap-5 p-0 m-0 md:grid-cols-3">
                  {posts.map((post) => {
                    return (
                      <li key={post.id} className="min-h-0 h-full min-w-0">
                        <article
                          className="flex h-full flex-col rounded-xl border-2 border-[#e8eef5] bg-white p-5 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[#f48945] hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                        >
                          <div className="flex justify-between items-start gap-2 mb-3">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-600 min-w-0">
                              <CalendarDays className="w-4 h-4 shrink-0 text-[#0B2545]" />
                              <time dateTime={post.date || undefined}>{post.dateLabel}</time>
                              <span className="text-gray-400 hidden sm:inline">·</span>
                              <span className="text-gray-700 line-clamp-1">{post.sourceName}</span>
                            </div>
                            <span
                              className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                              style={{
                                backgroundColor: "#e8eef5",
                                color: "#0B2545",
                                fontFamily: "Montserrat, sans-serif",
                              }}
                              title={`Scope: ${post.category}`}
                            >
                              {post.category}
                            </span>
                          </div>

                          <h3
                            className="text-base font-bold text-gray-900 mb-2 line-clamp-3"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {post.title}
                          </h3>

                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
                            {post.excerpt}
                          </p>

                          <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                            {post.externalUrl ? (
                              <a
                                href={post.externalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={cn(navButtonPrimary, "w-full sm:w-auto")}
                              >
                                Read full article
                              </a>
                            ) : null}
                          </div>
                        </article>
                      </li>
                    );
                  })}
                </ul>

                <nav
                  className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                  aria-label="Blog pagination"
                >
                  <p className="text-sm text-gray-600">
                    Showing page <strong>{page}</strong> of <strong>{totalPages}</strong>
                    {totalResults > 0 ? (
                      <span className="text-gray-500"> ({totalResults.toLocaleString()} total results)</span>
                    ) : null}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={page <= 1 || loading}
                      className={cn(navButtonPrimary, "disabled:opacity-40 disabled:cursor-not-allowed")}
                    >
                      <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden />
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={page >= totalPages || loading}
                      className={cn(navButtonPrimary, "disabled:opacity-40 disabled:cursor-not-allowed")}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
                    </button>
                  </div>
                </nav>
                <div
                  className="mt-8 border-t border-gray-200"
                  aria-hidden="true"
                />
              </>
            )}
        </div>
      </div>

      {/* Subscribe Section — matches Home (before footer in layout) */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border-2 p-8 md:p-12"
            style={{ borderColor: "#e8eef5" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Subscribe to get updates
                </h2>
                <p className="text-gray-600">
                  Active citizens are keeping abreast of our work within civic-tech space; you should too!
                </p>
              </div>

              <div>
                <form className="space-y-4" onSubmit={onSubmitSubscribe}>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={subscriberName}
                    onChange={(e) => setSubscriberName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 outline-none transition-all"
                    style={{
                      borderColor: "#d1d5db",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#0B2545";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11, 37, 69, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#d1d5db";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={subscriberEmail}
                    onChange={(e) => setSubscriberEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 outline-none transition-all"
                    style={{
                      borderColor: "#d1d5db",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#0B2545";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(11, 37, 69, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#d1d5db";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="submit"
                    disabled={subscribeSubmitting}
                    className={cn(
                      navButtonPrimary,
                      "w-full",
                      subscribeSubmitting ? "opacity-70 cursor-not-allowed" : "",
                    )}
                  >
                    {subscribeSubmitting ? "Subscribing…" : "Subscribe"}
                  </button>
                  {subscribeResultMessage ? (
                    <p className="text-sm font-semibold text-[#0B2545] mt-2">
                      {subscribeResultMessage}
                    </p>
                  ) : null}
                  {subscribeErrorMessage ? (
                    <p className="text-sm font-semibold text-red-600 mt-2">
                      {subscribeErrorMessage}
                    </p>
                  ) : null}
                  <p className="text-xs text-gray-500 mt-3">
                    Entering your name, email address and clicking &quot;Subscribe&quot; means you agree to receive
                    updates about the work we do at CivicLens. The CivicLens will never spam you. Please,{" "}
                    <a href="#" className="hover:underline" style={{ color: "#0B2545" }}>
                      click here
                    </a>{" "}
                    to learn more about how we protect your privacy.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
