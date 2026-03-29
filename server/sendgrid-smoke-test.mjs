/**
 * SendGrid onboarding / smoke test — same auth pattern as server/index.js.
 *
 * Usage (after sourcing secrets — never commit keys):
 *   set -a && source server/sendgrid.env && set +a
 *   npm run test:sendgrid -- you@example.com
 *
 * Or:
 *   SENDGRID_API_KEY="SG...." SENDGRID_FROM_EMAIL="verified@yourdomain.com" \
 *     node server/sendgrid-smoke-test.mjs you@example.com
 *
 * EU subuser: export SENDGRID_DATA_RESIDENCY=eu
 */

import { Client } from "@sendgrid/client";
import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY?.trim();
const from = process.env.SENDGRID_FROM_EMAIL?.trim();
const to = process.argv[2]?.trim() || process.env.SENDGRID_TEST_TO?.trim();

if (!apiKey) {
  console.error("Missing SENDGRID_API_KEY. Source server/sendgrid.env or export it.");
  process.exit(1);
}
if (!from) {
  console.error("Missing SENDGRID_FROM_EMAIL (must be a verified sender in SendGrid).");
  process.exit(1);
}
if (!to) {
  console.error("Usage: npm run test:sendgrid -- <recipient@email.com>");
  console.error("   or set SENDGRID_TEST_TO in the environment.");
  process.exit(1);
}

const client = new Client();
if (String(process.env.SENDGRID_DATA_RESIDENCY ?? "").toLowerCase() === "eu") {
  client.setDataResidency("eu");
}
client.setApiKey(apiKey);
sgMail.setClient(client);

const msg = {
  to,
  from,
  subject: "CivicLens — SendGrid test",
  text: "If you received this, SendGrid is configured correctly for CivicLens.",
  html: "<p>If you received this, <strong>SendGrid</strong> is configured correctly for CivicLens.</p>",
};

try {
  await sgMail.send(msg);
  console.log("Email sent successfully to", to);
} catch (err) {
  console.error("SendGrid error:", err?.response?.body ?? err?.message ?? err);
  process.exit(1);
}
