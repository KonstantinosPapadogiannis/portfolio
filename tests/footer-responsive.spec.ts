import { test, expect, html } from "./fixtures";

const portraitViewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 393, height: 852 },
  { width: 412, height: 915 },
  { width: 430, height: 932 },
] as const;

const landscapeViewports = [
  { width: 568, height: 320 },
  { width: 667, height: 375 },
  { width: 844, height: 390 },
  { width: 932, height: 430 },
] as const;

type FooterMetrics = {
  documentOverflow: number;
  footerOverflow: number;
  footerHeight: number;
  nameLines: number;
  minimumTargetHeight: number;
  clippedLink: boolean;
  overlappingLinks: boolean;
  bottomRowMisalignment: number;
};

async function footerMetrics(page: import("@playwright/test").Page): Promise<FooterMetrics> {
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
    const name = footer.querySelector("p.font-brand");
    const range = document.createRange();
    if (name) range.selectNodeContents(name);
    const lineTops = name
      ? [...range.getClientRects()]
          .map((rect) => rect.top)
          .filter((top, index, values) => index === 0 || Math.abs(top - values[index - 1]) > 0.5)
      : [];

    const overlappingLinks = anchors.some((first, firstIndex) =>
      anchors.slice(firstIndex + 1).some(
        (second) =>
          Math.min(first.right, second.right) - Math.max(first.left, second.left) > 0.5 &&
          Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top) > 0.5,
      ),
    );

    const bottomRow = footer.querySelector(":scope > div > div:last-child");
    const bottomChildren = bottomRow ? [...bottomRow.children] : [];
    const bottomCenters = bottomChildren.map((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });

    return {
      documentOverflow: document.documentElement.scrollWidth - viewportWidth,
      footerOverflow: footer.scrollWidth - footer.clientWidth,
      footerHeight: footer.getBoundingClientRect().height,
      nameLines: lineTops.length,
      minimumTargetHeight: Math.min(...anchors.map((anchor) => anchor.height)),
      clippedLink: anchors.some(
        (anchor) => anchor.left < -0.5 || anchor.right > viewportWidth + 0.5,
      ),
      overlappingLinks,
      bottomRowMisalignment:
        bottomCenters.length > 1 ? Math.max(...bottomCenters) - Math.min(...bottomCenters) : 0,
    };
  });
}

for (const locale of [
  { label: "English", path: "/" },
  { label: "Greek", path: "/el" },
] as const) {
  for (const viewport of portraitViewports) {
    test(`${locale.label}: footer remains compact and usable at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(locale.path);
      const metrics = await footerMetrics(page);

      expect(metrics.documentOverflow, `${viewport.width}px document overflow`).toBe(0);
      expect(metrics.footerOverflow, `${viewport.width}px footer overflow`).toBe(0);
      expect(metrics.clippedLink, `${viewport.width}px clipped link`).toBe(false);
      expect(metrics.overlappingLinks, `${viewport.width}px overlapping links`).toBe(false);
      expect(metrics.minimumTargetHeight, `${viewport.width}px touch targets`).toBeGreaterThanOrEqual(
        44,
      );
      expect(metrics.nameLines, `${viewport.width}px name wrapping`).toBe(
        viewport.width === 320 ? 2 : 1,
      );
      expect(metrics.bottomRowMisalignment, `${viewport.width}px bottom-row alignment`).toBeLessThan(
        1,
      );

      const maximumHeight = viewport.width === 320 ? 630 : viewport.width === 360 ? 520 : 480;
      expect(metrics.footerHeight, `${viewport.width}px footer height`).toBeLessThanOrEqual(
        maximumHeight,
      );
    });
  }
}

test("the footer remains robust in representative phone landscape layouts", async ({ page }) => {
  for (const viewport of landscapeViewports) {
    await page.setViewportSize(viewport);
    await page.goto("/el");
    const metrics = await footerMetrics(page);

    expect(metrics.documentOverflow, `${viewport.width}x${viewport.height} document overflow`).toBe(0);
    expect(metrics.footerOverflow, `${viewport.width}x${viewport.height} footer overflow`).toBe(0);
    expect(metrics.clippedLink, `${viewport.width}x${viewport.height} clipped link`).toBe(false);
    expect(metrics.overlappingLinks, `${viewport.width}x${viewport.height} overlapping links`).toBe(
      false,
    );
    expect(metrics.minimumTargetHeight).toBeGreaterThanOrEqual(44);
  }
});

test("mobile footer controls keep their behavior, focus, links and themes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const path of ["/", "/el"] as const) {
    for (const theme of ["light", "dark"] as const) {
      await page.goto(path);
      await page.evaluate((value) => localStorage.setItem("theme", value), theme);
      await page.reload();
      await expect(html(page)).toHaveAttribute("data-theme", theme);

      const footer = page.getByRole("contentinfo");
      await expect(footer).toBeVisible();
      await expect(footer.locator('a[href="https://github.com/KonstantinosPapadogiannis"]')).toHaveCount(1);
      await expect(
        footer.locator('a[href="https://www.linkedin.com/in/konstantinos-papadogiannis/"]'),
      ).toHaveCount(1);
      await expect(footer.locator('a[href="https://orcid.org/0009-0008-9445-2484"]')).toHaveCount(1);
      await expect(
        footer.locator('a[href="mailto:konstantinospapadogiannis.dev@gmail.com"]'),
      ).toHaveCount(1);

      for (const link of await footer.getByRole("link").all()) {
        await link.focus();
        await expect(link).toBeFocused();
      }
    }
  }

  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await footer.scrollIntoViewIfNeeded();
  await footer.getByRole("group", { name: "Language" }).getByRole("link", { name: "ΕΛ" }).click();
  await expect(page).toHaveURL(/\/el$/);

  await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await page.getByRole("contentinfo").locator('a[href="#top"]').click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test("tablet and desktop footer composition remains stable", async ({ page }) => {
  for (const viewport of [
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const metrics = await footerMetrics(page);

    expect(metrics.documentOverflow).toBe(0);
    expect(metrics.footerOverflow).toBe(0);
    expect(metrics.clippedLink).toBe(false);
    expect(metrics.overlappingLinks).toBe(false);
    expect(metrics.nameLines).toBe(1);
    expect(metrics.footerHeight).toBeLessThanOrEqual(viewport.width === 768 ? 467 : 310);
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
    expect(metrics.nameLines).toBe(1);
    expect(metrics.minimumTargetHeight).toBeGreaterThanOrEqual(44);

    await context.close();
  }
});
