import { BookOpen, CalendarDays, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import * as React from "react";
import { cn } from "../components/ui/utils";
import { LOCAL_BLOG_POSTS } from "../data/localBlogPosts";
import type { BlogBudgetLevel, BlogPost } from "../lib/blogPostTypes";
import { getNewsApiUrl } from "../lib/budgetApi";
import { navButtonPrimary } from "../lib/navButtonStyles";

type NewsApiArticle = {
  source?: { name?: string };
  title?: string;
  description?: string;
  url?: string;
  publishedAt?: string;
};

type CategorizedArticle = NewsApiArticle & { level: BlogBudgetLevel };

/** Infer scope from headline keywords (wireframe logic). */
function categorizeArticle(article: NewsApiArticle): CategorizedArticle {
  const title = (article.title ?? "").toLowerCase();
  let level: BlogBudgetLevel = "federal";
  if (title.includes("ontario") || title.includes("bc")) {
    level = "provincial";
  }
  if (title.includes("city") || title.includes("toronto")) {
    level = "municipal";
  }
  return { ...article, level };
}

function levelLabel(level: BlogBudgetLevel): string {
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

function sliceLocalPosts(page: number, pageSize: number): { posts: BlogPost[]; total: number } {
  const total = LOCAL_BLOG_POSTS.length;
  const start = (page - 1) * pageSize;
  return {
    posts: LOCAL_BLOG_POSTS.slice(start, start + pageSize),
    total,
  };
}

export default function Blog() {
  const newsEndpoint = getNewsApiUrl();

  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalResults, setTotalResults] = React.useState(0);
  const pageSize = 12;
  const [loading, setLoading] = React.useState(true);
  /** After a failed or empty API response, paginate bundled posts only (works offline). */
  const [feedMode, setFeedMode] = React.useState<"remote" | "local">("remote");

  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  React.useEffect(() => {
    let cancelled = false;

    if (feedMode === "local") {
      const { posts: localSlice, total } = sliceLocalPosts(page, pageSize);
      setPosts(localSlice);
      setTotalResults(total);
      setLoading(false);
      return;
    }

    async function loadNews() {
      setLoading(true);
      try {
        const url = newsEndpoint.startsWith("http")
          ? new URL(newsEndpoint)
          : new URL(newsEndpoint, window.location.origin);
        url.searchParams.set("page", String(page));

        const res = await fetch(url.toString());
        let payload: unknown;
        try {
          payload = await res.json();
        } catch {
          throw new Error("Invalid response from news server.");
        }

        if (!res.ok) {
          const msg =
            payload && typeof payload === "object" && payload !== null && "error" in payload
              ? String((payload as { error?: string }).error ?? "")
              : "";
          throw new Error(msg || "Failed to fetch news");
        }

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

        const categorized = articles.map(categorizeArticle);
        const mapped = categorized.map(mapArticleToPost);

        if (!cancelled) {
          if (mapped.length > 0) {
            setPosts(mapped);
            setTotalResults(total);
          } else {
            setFeedMode("local");
            const { posts: localSlice, total: localTotal } = sliceLocalPosts(page, pageSize);
            setPosts(localSlice);
            setTotalResults(localTotal);
          }
        }
      } catch (e) {
        if (!cancelled) {
          if (import.meta.env.DEV) {
            console.warn("[Blog] Live news fetch failed; using bundled posts.", e);
          }
          setFeedMode("local");
          const { posts: localSlice, total: localTotal } = sliceLocalPosts(page, pageSize);
          setPosts(localSlice);
          setTotalResults(localTotal);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadNews();
    return () => {
      cancelled = true;
    };
  }, [newsEndpoint, page, feedMode]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="w-full min-w-0 max-w-full" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div
        style={{
          background: "linear-gradient(to bottom right, #0B2545, #193865, #234b7f)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1
                className="text-[1.65rem] sm:text-4xl md:text-5xl font-bold text-white min-w-0 break-words"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Blog
              </h1>
            </div>
            <p className="mt-1 text-base md:text-lg text-white/90 max-w-3xl break-words">
              Canadian budget news from trusted outlets—scope (federal / provincial / municipal), date, source, and quick
              links. Saved highlights load when you are offline or the live feed is unavailable.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2
              className="text-xl sm:text-2xl font-bold text-gray-900 min-w-0"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Latest posts
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 sm:shrink-0">
              <BookOpen className="w-4 h-4" />
              <span>Page {page}</span>
              {feedMode === "local" ? (
                <span className="text-amber-800 font-medium">· Saved links</span>
              ) : null}
            </div>
          </div>

          {feedMode === "local" && !loading ? (
            <p
              className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4"
              role="status"
            >
              Live news is unavailable or returned no articles (for example, offline or the server is down). These
              entries are saved inside the app so you can still open trusted federal, provincial, and municipal budget
              pages.
            </p>
          ) : null}

          {loading ? (
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              <ul className="grid w-full list-none grid-cols-1 gap-5 p-0 m-0 sm:grid-cols-2 lg:grid-cols-3">
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
                <p className="text-sm text-gray-600 order-2 sm:order-1">
                  Showing page <strong>{page}</strong> of <strong>{totalPages}</strong>
                  {totalResults > 0 ? (
                    <span className="text-gray-500"> ({totalResults.toLocaleString()} total results)</span>
                  ) : null}
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={page <= 1 || loading}
                    className={cn(
                      navButtonPrimary,
                      "disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto justify-center min-h-[44px]",
                    )}
                  >
                    <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={page >= totalPages || loading}
                    className={cn(
                      navButtonPrimary,
                      "disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto justify-center min-h-[44px]",
                    )}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 shrink-0" aria-hidden />
                  </button>
                </div>
              </nav>
              <div className="mt-8 border-t border-gray-200" aria-hidden="true" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
