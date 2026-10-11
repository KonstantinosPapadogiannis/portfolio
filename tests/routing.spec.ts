import type {Page} from "@playwright/test";
import {routing} from "../src/i18n/routing";
import {test, expect, html, languageGroup} from "./fixtures";

const canonicalPages = [
  "/",
  "/el",
  "/resume",
  "/el/resume",
  "/work/thesis",
  "/el/work/thesis",
] as const;

const prefixedEnglishPages = [
  ["/en", "/"],
  ["/en/resume", "/resume"],
  ["/en/work/thesis", "/work/thesis"],
] as const;

test("canonical locale routes return 200 without redirects or locale cookies", async ({
  request,
}) => {
  for (const path of canonicalPages) {
    const response = await request.get(path, {maxRedirects: 0});
    expect(response.status(), path).toBe(200);
    expect(response.headers()["location"], path).toBeUndefined();
    expect(response.headers()["set-cookie"], path).toBeUndefined();
  }
});

test("explicit English prefixes canonicalize in exactly one hop", async ({request}) => {
  for (const [source, destination] of prefixedEnglishPages) {
    const first = await request.get(source, {maxRedirects: 0});
    expect(first.status(), source).toBe(307);
    expect(first.headers()["location"], source).toBe(destination);
    expect(first.headers()["set-cookie"], source).toBeUndefined();

    const canonical = await request.get(source, {maxRedirects: 1});
    expect(canonical.status(), source).toBe(200);
    expect(new URL(canonical.url()).pathname, source).toBe(destination);
  }
});

test("routing ignores browser language and never stores a locale cookie", async ({
  request,
}) => {
  expect(routing.localeDetection).toBe(false);
  expect(routing.localeCookie).toBe(false);

  const response = await request.get("/", {
    headers: {"accept-language": "el-GR,el;q=0.9,en;q=0.8"},
    maxRedirects: 0,
  });
  expect(response.status()).toBe(200);
  expect(response.headers()["location"]).toBeUndefined();
  expect(response.headers()["set-cookie"]).toBeUndefined();
  expect(await response.text()).toContain('lang="en"');
});

test("canonical pages survive direct entry and hard reload", async ({page}) => {
  for (const path of canonicalPages) {
    const first = await page.goto(path);
    expect(first?.status(), path).toBe(200);
    expect(new URL(page.url()).pathname, path).toBe(path);

    const reloaded = await page.reload();
    // Firefox can validate its cached document and expose the resulting 304
    // to Playwright. Both statuses leave a fully rendered canonical page.
    expect([200, 304], path).toContain(reloaded?.status());
    expect(new URL(page.url()).pathname, path).toBe(path);
    await expect(html(page)).toHaveAttribute("lang", path.startsWith("/el") ? "el" : "en");
  }
});

async function installLocaleTransitionAudit(page: Page) {
  await page.evaluate(() => {
    type Audit = {cls: number; languages: string[]};
    const audit: Audit = {
      cls: 0,
      languages: [document.documentElement.lang],
    };
    (window as typeof window & {__localeTransitionAudit: Audit}).__localeTransitionAudit =
      audit;

    new MutationObserver(() => {
      const language = document.documentElement.lang;
      if (audit.languages.at(-1) !== language) audit.languages.push(language);
    }).observe(document.documentElement, {attributes: true, attributeFilter: ["lang"]});

    if (PerformanceObserver.supportedEntryTypes.includes("layout-shift")) {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {hadRecentInput: boolean; value: number};
          if (!shift.hadRecentInput) audit.cls += shift.value;
        }
      }).observe({type: "layout-shift", buffered: true});
    }
  });
}

for (const [englishPath, greekPath] of [
  ["/", "/el"],
  ["/resume", "/el/resume"],
  ["/work/thesis", "/el/work/thesis"],
] as const) {
  test(`language switch preserves ${englishPath} without a document reload or redirect`, async ({
    page,
  }) => {
    await page.goto(englishPath);
    await page.evaluate(() => document.fonts.ready);
    await installLocaleTransitionAudit(page);

    const documentRequests: string[] = [];
    const redirectedRequests: string[] = [];
    const redirectResponses: string[] = [];
    const fontRequests: string[] = [];

    page.on("request", (request) => {
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
        documentRequests.push(request.url());
      }
      if (request.redirectedFrom()) redirectedRequests.push(request.url());
      if (request.url().includes("/fonts/inter-") && request.url().endsWith(".woff2")) {
        fontRequests.push(request.url());
      }
    });
    page.on("response", (response) => {
      if (response.status() >= 300 && response.status() < 400) {
        redirectResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    const greek = languageGroup(page).getByRole("link", {name: "Ελληνικά"});
    await expect(greek).toHaveAttribute("href", greekPath);
    await greek.click();
    await expect(page).toHaveURL(new RegExp(`${greekPath.replaceAll("/", "\\/")}$`));
    await expect(html(page)).toHaveAttribute("lang", "el");
    await page.evaluate(() => document.fonts.ready);

    const english = languageGroup(page).getByRole("link", {name: "English"});
    await expect(english).toHaveAttribute("href", englishPath);
    await english.click();
    await expect(page).toHaveURL(
      new RegExp(
        `${englishPath === "/" ? "127\\.0\\.0\\.1:3100\\/" : englishPath.replaceAll("/", "\\/")}$`,
      ),
    );
    await expect(html(page)).toHaveAttribute("lang", "en");
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );

    const audit = await page.evaluate(
      () =>
        (window as typeof window & {
          __localeTransitionAudit: {cls: number; languages: string[]};
        }).__localeTransitionAudit,
    );

    expect(documentRequests).toEqual([]);
    expect(redirectedRequests).toEqual([]);
    expect(redirectResponses).toEqual([]);
    expect(audit.languages).toEqual(["en", "el", "en"]);
    expect(audit.cls).toBeLessThanOrEqual(0.001);
    expect(fontRequests.filter((url) => url.endsWith("/latin.woff2"))).toHaveLength(1);
    expect(new Set(fontRequests).size).toBe(fontRequests.length);
  });
}
