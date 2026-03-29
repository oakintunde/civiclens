import cors from "cors";
import express from "express";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Client } from "@sendgrid/client";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MUNICIPAL_BUDGETS_BASE = JSON.parse(
  readFileSync(join(__dirname, "municipalBudgetsBase.json"), "utf8"),
);

function scaleMunicipalBudgets(year, baseRows) {
  const y = Number(year) || 2025;
  const base = 2025;
  const t = y - base;
  const totalFactor = 1 + t * 0.012;
  const perCapFactor = 1 + t * 0.008;
  return baseRows.map((row) => ({
    ...row,
    total: Math.round(row.total * totalFactor),
    perCapita: Math.round(row.perCapita * perCapFactor),
    topCategories: row.topCategories.map((c) => ({
      ...c,
      amount: Math.round(c.amount * totalFactor),
      percentage: c.percentage,
    })),
  }));
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const SUBSCRIBERS_FILE = join(__dirname, "subscribers.json");

function loadSubscribers() {
  if (!existsSync(SUBSCRIBERS_FILE)) return { subscribers: [] };
  try {
    const raw = readFileSync(SUBSCRIBERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.subscribers)) return { subscribers: [] };
    return parsed;
  } catch {
    return { subscribers: [] };
  }
}

function saveSubscribers(data) {
  writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(data, null, 2), "utf8");
}

function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

function isValidEmail(email) {
  const e = normalizeEmail(email);
  // Simple pragmatic validation for UI submissions.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;

  const port = parseInt(String(process.env.SMTP_PORT ?? "587"), 10) || 587;
  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS ?? "",
        }
      : undefined,
  });
}

/**
 * SendGrid (preferred when SENDGRID_API_KEY is set).
 * Optional: SENDGRID_DATA_RESIDENCY=eu for EU-pinned subusers.
 * Optional: SENDGRID_FROM_EMAIL (must be a verified sender in SendGrid).
 */
async function sendSubscriptionEmailSendGrid({ name, email }) {
  const apiKey = process.env.SENDGRID_API_KEY?.trim();
  if (!apiKey) return false;

  // EU residency must be set on the client before setApiKey so the correct API host is used.
  const client = new Client();
  const residency = String(process.env.SENDGRID_DATA_RESIDENCY ?? "").toLowerCase();
  if (residency === "eu") {
    client.setDataResidency("eu");
  }
  client.setApiKey(apiKey);
  sgMail.setClient(client);

  const from =
    process.env.SENDGRID_FROM_EMAIL?.trim() || "do-not-reply@thecivic-lens.netlify.app";
  const safeName = String(name ?? "").trim() || "there";
  const subject = "Your subscription is confirmed";
  const text = `Dear ${safeName},

This email confirms your subscription to receive latest updates on the Civic Lens website.

— CivicLens`;
  const html = `<p>Dear ${escapeHtml(safeName)},</p><p>This email confirms your subscription <strong>to receive latest updates on the Civic Lens website.</strong></p><p>— CivicLens</p>`;

  await sgMail.send({
    to: email,
    from,
    subject,
    text,
    html,
  });
  return true;
}

async function sendSubscriptionEmailSmtp({ name, email }) {
  const transporter = createTransporter();
  if (!transporter) return false;

  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "no-reply@civiclens.ca";
  const subject = "Subscription confirmed — CivicLens";
  const safeName = String(name ?? "").trim() || "there";
  const text = `Hi ${safeName},\n\nThanks for subscribing to CivicLens updates!\n\nYou can reply to this email if you have questions.\n\n— CivicLens`;

  await transporter.sendMail({
    from,
    to: email,
    subject,
    text,
  });
  return true;
}

async function sendSubscriptionEmail({ name, email }) {
  if (process.env.SENDGRID_API_KEY?.trim()) {
    try {
      await sendSubscriptionEmailSendGrid({ name, email });
      return true;
    } catch (err) {
      console.error("[subscribe] SendGrid send failed:", err);
      throw err;
    }
  }

  const transporter = createTransporter();
  if (!transporter) {
    console.log("[subscribe] No SENDGRID_API_KEY or SMTP; skipping email send.");
    return false;
  }

  await sendSubscriptionEmailSmtp({ name, email });
  return true;
}

// NewsAPI key (also override with NEWS_API_KEY env in production)
const NEWS_API_KEY =
  process.env.NEWS_API_KEY || "ca747807efb740c18e4719bc8f626917";

/**
 * Same query as wireframe — filtering & categorization happen in the React app.
 * @see https://newsapi.org/docs/endpoints/everything
 */
const NEWS_QUERY =
  '("canada budget" OR "federal budget canada" OR "bc budget" OR "ontario budget")';

const NEWS_DOMAINS = "cbc.ca,globalnews.ca,ctvnews.ca,theglobeandmail.com";

const PAGE_SIZE = 12;

/** Mirrors `budgetData` lists for federal / provincial / municipal filters. */
const CATEGORY_LISTS = {
  federal: [
    "Elderly Benefits",
    "Health Transfers",
    "Employment Insurance",
    "Children & Families",
    "National Defence",
    "Indigenous Services",
    "Public Debt Charges",
    "Infrastructure",
    "Education & Skills",
    "Immigration",
    "Environment & Climate",
    "Other Programs",
  ],
  province: ["Health", "Education", "Social Services", "Infrastructure", "Other"],
  municipal: [
    "Transportation",
    "Emergency Services",
    "Parks & Recreation",
    "Water & Waste",
    "Other",
  ],
};

/** Years available per level — mirrors `budgetData` (federal: history rows; province/municipal: demo range). */
const BUDGET_YEARS = {
  federal: [2025, 2024, 2023, 2022, 2021, 2020],
  province: [2025, 2024, 2023],
  municipal: [2025, 2024, 2023],
};

app.get("/api/budget-years", (req, res) => {
  const raw = String(req.query.level ?? "federal").toLowerCase();
  const key =
    raw === "province" || raw === "provincial"
      ? "province"
      : raw === "municipal" || raw === "municipality"
        ? "municipal"
        : "federal";
  const years = BUDGET_YEARS[key];
  if (!years) {
    return res.status(400).json({ error: "Invalid level" });
  }
  res.json({ level: key, years });
});

app.get("/api/categories", (req, res) => {
  const raw = String(req.query.level ?? "federal").toLowerCase();
  const key =
    raw === "province" || raw === "provincial"
      ? "province"
      : raw === "municipal" || raw === "municipality"
        ? "municipal"
        : "federal";
  const categories = CATEGORY_LISTS[key];
  if (!categories) {
    return res.status(400).json({ error: "Invalid level" });
  }
  res.json({ level: key, categories });
});

app.get("/api/municipal-budgets", (req, res) => {
  const raw = String(req.query.year ?? "2025");
  const year = Math.min(2100, Math.max(2000, parseInt(raw, 10) || 2025));
  const cities = scaleMunicipalBudgets(year, MUNICIPAL_BUDGETS_BASE);
  res.json({ year, cities });
});

app.post("/api/subscribe", async (req, res) => {
  try {
    const { name, email } = req.body ?? {};
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = String(name ?? "").trim();

    if (!normalizedName || normalizedName.length < 2) {
      return res.status(400).json({ error: "Please enter your name." });
    }
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const data = loadSubscribers();
    const existing = data.subscribers.find((s) => normalizeEmail(s.email) === normalizedEmail);
    if (existing) {
      return res.json({
        ok: true,
        alreadySubscribed: true,
        message: "Thank you, we already have your email address*.",
      });
    }

    data.subscribers.push({
      name: normalizedName,
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    });
    saveSubscribers(data);

    // Best-effort email confirmation (does not block subscription storage).
    try {
      await sendSubscriptionEmail({ name: normalizedName, email: normalizedEmail });
    } catch (err) {
      console.error("[subscribe] Failed to send email:", err);
    }

    return res.json({
      ok: true,
      alreadySubscribed: false,
      message: "Thank you for subscribing! Please check your email.",
    });
  } catch (err) {
    return res.status(500).json({ error: "Subscription failed." });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1);

    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.set("q", NEWS_QUERY);
    url.searchParams.set("domains", NEWS_DOMAINS);
    url.searchParams.set("language", "en");
    url.searchParams.set("sortBy", "publishedAt");
    url.searchParams.set("pageSize", String(PAGE_SIZE));
    url.searchParams.set("page", String(page));
    url.searchParams.set("apiKey", NEWS_API_KEY);

    const response = await fetch(url.toString());
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch news" });
    }

    let data = await response.json();

    // If the domain filter is too strict and returns no results,
    // retry without domains so the blog page isn't empty.
    if (data && typeof data.totalResults === "number" && data.totalResults === 0) {
      try {
        const retryUrl = new URL(url.toString());
        retryUrl.searchParams.delete("domains");
        const retryRes = await fetch(retryUrl.toString());
        if (retryRes.ok) {
          const retryData = await retryRes.json();
          data = retryData;
        }
      } catch {
        /* ignore retry errors, keep initial response */
      }
    }

    res.json({
      articles: data.articles ?? [],
      totalResults: typeof data.totalResults === "number" ? data.totalResults : 0,
      page,
      pageSize: PAGE_SIZE,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`News API server running on http://localhost:${port}`);
});
