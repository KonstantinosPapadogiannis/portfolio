// Regenerates the share images public/og/en.png and public/og/el.png
// (1200×630) from the QA page /qa/og, which draws them with the site's own
// fonts, colours and motif.
//
// The page exists only in a QA build, so build and start one first:
//
//   ENABLE_QA_ROUTES=1 pnpm build
//   ENABLE_QA_ROUTES=1 pnpm exec next start -p 3100
//   node scripts/og-images.mjs [base URL, default http://127.0.0.1:3100]
//
// Run it again whenever the hero headline, the name or the degree changes.

import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://127.0.0.1:3100";
const pages = { en: "/qa/og", el: "/el/qa/og" };

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  await mkdir("public/og", { recursive: true });
  for (const [locale, path] of Object.entries(pages)) {
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    if (!response?.ok()) throw new Error(`${path} answered ${response?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const card = page.locator("#og-card");
    const box = await card.boundingBox();
    if (box?.width !== 1200 || box?.height !== 630) {
      throw new Error(`${path}: #og-card is ${box?.width}×${box?.height}, not 1200×630`);
    }
    await card.screenshot({ path: `public/og/${locale}.png`, animations: "disabled" });
    console.log(`public/og/${locale}.png`);
  }
} finally {
  await browser.close();
}
