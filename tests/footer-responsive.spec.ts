import type { Page } from "@playwright/test";
import { test, expect, html } from "./fixtures";

const mobileViewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 393, height: 852 },
  { width: 412, height: 915 },
  { width: 430, height: 932 },
] as const;

const desktopViewports = [
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;

const links = [
  {
    name: "GitHub",
    visibleLabel: "GitHub",
    href: "https://github.com/KonstantinosPapadogiannis",
    rel: "me",
  },
  {
    name: "LinkedIn",
    visibleLabel: "LinkedIn",
    href: "https://www.linkedin.com/in/konstantinos-papadogiannis/",
    rel: "me",
  },
  {
    name: "ORCID profile — 0009-0008-9445-2484",
    visibleLabel: "ORCID",
    href: "https://orcid.org/0009-0008-9445-2484",
    rel: "me",
  },
  {
    name: "Email",
    visibleLabel: "Email",
    href: "mailto:konstantinospapadogiannis.dev@gmail.com",
  },
] as const;

const removedCopy = [
  "Konstantinos Papadogiannis",
  "Backend systems, distributed software, and cloud infrastructure.",
  "Athens, Greece",
  "Navigate",
  "Work",
  "About",
  "Résumé",
  "Contact",
  "Elsewhere",
  "Open to graduate and junior roles.",
  "Back to top",
  "Built with Next.js + TypeScript",
  "Deployed on Vercel",
] as const;

type FooterMetrics = {
  documentOverflow: number;
  footerOverflow: number;
  footerHeight: number;
  minimumTargetHeight: number;
  clippedLink: boolean;
  overlappingLinks: boolean;
  rowCount: number;
  groupCenterOffset: number;
  maximumHorizontalGap: number;
};

async function footerMetrics(page: Page): Promise<FooterMetrics> {
  return page.getByRole("contentinfo").evaluate((footer) => {
    const viewportWidth = document.documentElement.clientWidth;
    const anchors = [...footer.querySelectorAll("a")].map((anchor) => {
      const rect = anchor.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
      };
    });
    const rows = new Set(anchors.map((anchor) => Math.round(anchor.top)));
    const left = Math.min(...anchors.map((anchor) => anchor.left));
    const right = Math.max(...anchors.map((anchor) => anchor.right));
    const orderedAnchors = [...anchors].sort((first, second) => first.left - second.left);
    const overlappingLinks = anchors.some((first, firstIndex) =>
      anchors.slice(firstIndex + 1).some(
        (second) =>
          Math.min(first.right, second.right) - Math.max(first.left, second.left) > 0.5 &&
          Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top) > 0.5,
      ),
    );

    return {
      documentOverflow: document.documentElement.scrollWidth - viewportWidth,
      footerOverflow: footer.scrollWidth - footer.clientWidth,
      footerHeight: footer.getBoundingClientRect().height,
      minimumTargetHeight: Math.min(...anchors.map((anchor) => anchor.height)),
      clippedLink: anchors.some(
        (anchor) => anchor.left < -0.5 || anchor.right > viewportWidth + 0.5,
      ),
      overlappingLinks,
      rowCount: rows.size,
      groupCenterOffset: Math.abs((left + right) / 2 - viewportWidth / 2),
      maximumHorizontalGap: Math.max(
        ...orderedAnchors.slice(1).map((anchor, index) => anchor.left - orderedAnchors[index].right),
      ),
    };
  });
}

for (const locale of [
  { label: "English", path: "/" },
  { label: "Greek", path: "/el" },
] as const) {
  for (const viewport of mobileViewports) {
    test(`${locale.label}: compact footer fits ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(locale.path);
      const metrics = await footerMetrics(page);

      expect(metrics.documentOverflow).toBe(0);
      expect(metrics.footerOverflow).toBe(0);
      expect(metrics.clippedLink).toBe(false);
      expect(metrics.overlappingLinks).toBe(false);
      expect(metrics.minimumTargetHeight).toBeGreaterThanOrEqual(44);
      expect(metrics.footerHeight).toBeGreaterThanOrEqual(120);
      expect(metrics.footerHeight).toBeLessThanOrEqual(150);
      expect(metrics.rowCount).toBe(2);
    });
  }
}

for (const viewport of desktopViewports) {
  test(`tablet and desktop use a compact contact band at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const metrics = await footerMetrics(page);

    expect(metrics.documentOverflow, `${viewport.width}px document overflow`).toBe(0);
    expect(metrics.footerOverflow, `${viewport.width}px footer overflow`).toBe(0);
    expect(metrics.clippedLink, `${viewport.width}px clipped link`).toBe(false);
    expect(metrics.overlappingLinks, `${viewport.width}px overlapping links`).toBe(false);
    if (viewport.width === 768) {
      expect(metrics.footerHeight, `${viewport.width}px footer height`).toBeLessThanOrEqual(130);
    } else {
      expect(metrics.footerHeight, `${viewport.width}px footer height`).toBeGreaterThanOrEqual(80);
      expect(metrics.footerHeight, `${viewport.width}px footer height`).toBeLessThanOrEqual(96);
      expect(metrics.groupCenterOffset, `${viewport.width}px group centering`).toBeLessThanOrEqual(1);
      expect(metrics.maximumHorizontalGap, `${viewport.width}px maximum gap`).toBeLessThanOrEqual(40);
    }
    expect(metrics.rowCount, `${viewport.width}px rows`).toBe(viewport.width === 768 ? 2 : 1);
  });
}

test("the footer exposes exactly four accessible professional links", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const path of ["/", "/el"] as const) {
    for (const theme of ["light", "dark"] as const) {
      await page.goto(path);
      await page.evaluate((value) => localStorage.setItem("theme", value), theme);
      await page.reload();
      await expect(html(page)).toHaveAttribute("data-theme", theme);

      const footer = page.getByRole("contentinfo");
      await expect(footer.getByRole("link")).toHaveCount(4);
      for (const item of links) {
        const link = footer.getByRole("link", { name: item.name, exact: true });
        await expect(link).toHaveText(item.visibleLabel);
        await expect(link).toHaveAttribute("href", item.href);
        if ("rel" in item) await expect(link).toHaveAttribute("rel", item.rel);
        else await expect(link).not.toHaveAttribute("rel", /.+/);
        await link.focus();
        await expect(link).toBeFocused();
      }
      await expect(footer).not.toContainText("0009-0008-9445-2484");
      await expect(footer).not.toContainText("konstantinospapadogiannis.dev@gmail.com");
      for (const copy of removedCopy) await expect(footer).not.toContainText(copy);
      await expect(footer).not.toContainText("©");
      await expect(footer.getByText("EN", { exact: true })).toHaveCount(0);
      await expect(footer.getByText("ΕΛ", { exact: true })).toHaveCount(0);
      await expect(footer.getByRole("group", { name: /Language|Γλώσσα/ })).toHaveCount(0);
      await expect(footer.getByRole("navigation")).toHaveCount(0);
    }
  }
});

test("390px footer geometry is independent of DPR", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium", "Custom DPR coverage is performed in Chromium");

  for (const deviceScaleFactor of [1, 2, 3]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor,
    });
    const page = await context.newPage();
    await page.goto("/");

    expect(await page.evaluate(() => devicePixelRatio)).toBe(deviceScaleFactor);
    const metrics = await footerMetrics(page);
    expect(metrics.documentOverflow).toBe(0);
    expect(metrics.footerOverflow).toBe(0);
    expect(metrics.minimumTargetHeight).toBeGreaterThanOrEqual(44);
    expect(metrics.footerHeight).toBeGreaterThanOrEqual(120);
    expect(metrics.footerHeight).toBeLessThanOrEqual(150);

    await context.close();
  }
});
