import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { test, expect, html, publicPages } from "./fixtures";

// Automated accessibility checks. axe finds only part of what WCAG asks
// for; what has to be checked by hand, with a screen reader among others,
// is listed in docs/ACCESSIBILITY.md.

const notFoundPages = ["/does-not-exist", "/el/work/does-not-exist"];
const allPages = [...publicPages, ...notFoundPages];

// WCAG 2.0, 2.1 and 2.2, levels A and AA.
const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"];

// Opens a page. A 404 is what the not-found addresses are expected to
// answer, so their response, and the browser reporting it once, are taken
// out of the page issues; anything else still fails the test.
async function open(page: Page, path: string, pageIssues: string[]) {
  const response = await page.goto(path);
  if (!notFoundPages.includes(path)) {
    expect(response?.status(), path).toBe(200);
    return;
  }
  expect(response?.status(), path).toBe(404);
  await page.waitForLoadState("load");
  const http = pageIssues.indexOf(`HTTP 404: http://127.0.0.1:3100${path}`);
  expect(http).toBeGreaterThanOrEqual(0);
  pageIssues.splice(http, 1);
  const logged = pageIssues.findIndex((issue) =>
    issue.startsWith("console.error: Failed to load resource: the server responded with a status of 404"),
  );
  if (logged >= 0) pageIssues.splice(logged, 1);
}

// Whether the page scrolls sideways, and by how much.
const horizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test.describe("axe finds no WCAG A or AA violation", () => {
  // With reduced motion every section is in its final state, so contrast is
  // measured on what the reader sees once it has come in.
  test.use({ reducedMotion: "reduce" });

  for (const theme of ["light", "dark"] as const) {
    for (const path of allPages) {
      test(`${path} (${theme})`, async ({ page, pageIssues }) => {
        await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
        await open(page, path, pageIssues);
        await expect(html(page)).toHaveAttribute("data-theme", theme);

        const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
        const violations = results.violations.map(
          ({ id, impact, nodes }) => `${id} (${impact}): ${nodes.map((node) => node.target.join(" ")).join(", ")}`,
        );
        expect(violations).toEqual([]);
      });
    }
  }
});

// Browser zoom on a 1280px window: the layout viewport shrinks to 1280/zoom
// CSS pixels and every pixel is drawn larger. 400% is the 320 CSS pixels of
// WCAG 1.4.10 (Reflow).
for (const zoom of [2, 4]) {
  test.describe(`at ${zoom * 100}% zoom`, () => {
    test.use({ viewport: { width: 1280 / zoom, height: 900 / zoom }, deviceScaleFactor: zoom });

    for (const path of allPages) {
      test(`${path} reflows without scrolling sideways`, async ({ page, pageIssues }) => {
        await open(page, path, pageIssues);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        expect(await horizontalOverflow(page)).toBe(0);
      });
    }
  });
}

// A larger default text size in the browser settings (not zoom): text set in
// rem grows with it, and so do the breakpoints, which are in rem too.
// Chromium sets it through the DevTools protocol, as its settings page does.
test.describe("with a larger default text size", () => {
  const conditions = [
    { width: 1280, size: 32 },
    { width: 1280, size: 24 },
    { width: 390, size: 32 },
    { width: 390, size: 24 },
  ];

  for (const path of allPages) {
    test(`${path} keeps its text and controls on screen`, async ({
      page,
      pageIssues,
      browserName,
    }) => {
      test.skip(browserName !== "chromium", "the default text size is set through Chromium's DevTools protocol");
      const session = await page.context().newCDPSession(page);

      for (const { width, size } of conditions) {
        await page.setViewportSize({ width, height: 900 });
        await session.send("Page.setFontSizes", {
          fontSizes: { standard: size, fixed: Math.round((size * 13) / 16) },
        });
        await open(page, path, pageIssues);

        const condition = `${width}px, ${size}px text`;
        expect(
          await html(page).evaluate((root) => getComputedStyle(root).fontSize),
          condition,
        ).toBe(`${size}px`);
        expect(await horizontalOverflow(page), condition).toBe(0);
        await expect(page.getByRole("heading", { level: 1 }), condition).toBeVisible();

        // The breakpoints moved with the text: the navigation is behind the
        // menu button, which stays inside the window.
        const menu = page.getByRole("banner").getByRole("button", { name: /^(Menu|Μενού)$/ });
        await expect(menu, condition).toBeVisible();
        const box = (await menu.boundingBox())!;
        expect(box.x, condition).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width, condition).toBeLessThanOrEqual(width);
      }
    });
  }
});
