import type { Page } from "@playwright/test";
import {
  test,
  expect,
  html,
  languageGroup,
  toggleTheme,
  recordThemeChanges,
} from "./fixtures";

const firstFamily = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el) => getComputedStyle(el).fontFamily.split(",")[0].replace(/"/g, ""));

async function switchLanguage(page: Page, to: "English" | "Ελληνικά") {
  await languageGroup(page).getByRole("link", { name: to }).click();
}

// After the first switch to dark, the document never takes the light theme
// again, including on the first frame of each newly loaded page.
function expectNoLightAfterDark(log: string[]) {
  const afterDark = log.slice(log.indexOf("dark"));
  expect(log).toContain("dark");
  expect(afterDark.filter((entry) => /light|none/.test(entry))).toEqual([]);
}

test("EN light → dark → EL → EN keeps the theme and updates lang and fonts", async ({
  page,
}) => {
  const themeLog = await recordThemeChanges(page);
  await page.goto("/");
  await expect(html(page)).toHaveAttribute("data-theme", "light");
  expect(await firstFamily(page, "h1")).toBe("Geist");

  await toggleTheme(page, "Dark theme", "dark");

  await switchLanguage(page, "Ελληνικά");
  await expect(page).toHaveURL(/\/el$/);
  await expect(html(page)).toHaveAttribute("lang", "el");
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Σκούρο θέμα" })).toBeVisible();
  expect(await firstFamily(page, "h1")).toBe("Inter");

  await switchLanguage(page, "English");
  await expect(page).toHaveURL(/127\.0\.0\.1:3100\/$/);
  await expect(html(page)).toHaveAttribute("lang", "en");
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
  expect(await firstFamily(page, "h1")).toBe("Geist");

  expectNoLightAfterDark(await themeLog());
});

test("EL dark → EN keeps the theme", async ({ page }) => {
  const themeLog = await recordThemeChanges(page);
  await page.goto("/el");
  await toggleTheme(page, "Σκούρο θέμα", "dark");

  await switchLanguage(page, "English");
  await expect(page).toHaveURL(/127\.0\.0\.1:3100\/$/);
  await expect(html(page)).toHaveAttribute("lang", "en");
  await expect(html(page)).toHaveAttribute("data-theme", "dark");

  expectNoLightAfterDark(await themeLog());
});

// The router keeps the English layout while the Greek page is shown and brings
// it back with the theme it had when it was hidden. The theme chosen last wins.
test("EN dark → EL light → EN keeps the theme chosen last", async ({ page }) => {
  const themeLog = await recordThemeChanges(page);
  await page.goto("/");
  await toggleTheme(page, "Dark theme", "dark");

  await switchLanguage(page, "Ελληνικά");
  await expect(page).toHaveURL(/\/el$/);
  await toggleTheme(page, "Σκούρο θέμα", "light");

  await switchLanguage(page, "English");
  await expect(page).toHaveURL(/127\.0\.0\.1:3100\/$/);
  await expect(html(page)).toHaveAttribute("lang", "en");
  await expect(html(page)).toHaveAttribute("data-theme", "light");
  // next-themes agrees: the next toggle goes to dark.
  await toggleTheme(page, "Dark theme", "dark");

  // One painted change per toggle, and no frame in between. A busy browser
  // can run a frame before the theme script at the top of <body> has been
  // parsed; nothing is stored yet, so that frame has the light colours of
  // :root and counts as the first light one.
  const log = await themeLog();
  if (log[0] === "none") log[0] = "light";
  expect(log.filter((theme, i) => theme !== log[i - 1])).toEqual(["light", "dark", "light", "dark"]);
});

test("dark theme survives a reload without a light first frame", async ({
  page,
}) => {
  const themeLog = await recordThemeChanges(page);
  await page.goto("/el");
  await toggleTheme(page, "Σκούρο θέμα", "dark");
  await page.reload();
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
  expectNoLightAfterDark(await themeLog());
});

test("language switch preserves the route", async ({ page }) => {
  await page.goto("/resume");
  await switchLanguage(page, "Ελληνικά");
  await expect(page).toHaveURL(/\/el\/resume$/);
  await expect(html(page)).toHaveAttribute("lang", "el");
  await expect(page.getByRole("heading", { level: 1, name: "Βιογραφικό" })).toBeVisible();

  await switchLanguage(page, "English");
  await expect(page).toHaveURL(/127\.0\.0\.1:3100\/resume$/);
  await expect(html(page)).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1, name: "Résumé" })).toBeVisible();
});

test("language switch in dark mode on a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await toggleTheme(page, "Dark theme", "dark");
  await switchLanguage(page, "Ελληνικά");
  await expect(page).toHaveURL(/\/el$/);
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Μενού" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

test("language links are keyboard operable", async ({ page }) => {
  await page.goto("/");
  const greek = languageGroup(page).getByRole("link", { name: "Ελληνικά" });
  await greek.focus();
  await expect(greek).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/el$/);
  await expect(html(page)).toHaveAttribute("lang", "el");
});

test("the footer language switcher keeps the route", async ({ page }) => {
  await page.goto("/resume");
  await page
    .getByRole("contentinfo")
    .getByRole("group", { name: "Language" })
    .getByRole("link", { name: "Ελληνικά" })
    .click();
  await expect(page).toHaveURL(/\/el\/resume$/);
  await expect(html(page)).toHaveAttribute("lang", "el");
});

for (const theme of ["light", "dark"] as const) {
  for (const path of ["/", "/el"]) {
    test(`${path} in ${theme} loads without console or network problems`, async ({
      page,
    }) => {
      await page.goto(path);
      if (theme === "dark") {
        await toggleTheme(page, path === "/" ? "Dark theme" : "Σκούρο θέμα", "dark");
        await page.reload();
        await expect(html(page)).toHaveAttribute("data-theme", "dark");
      }
      // Not "networkidle": on a second load Chromium serves the cached route
      // prefetches (stale-while-revalidate) and revalidates them in the
      // background, and Playwright never sees those requests finish.
      await page.waitForLoadState("load");
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.fonts.status)).toBe("loaded");
      // The pageIssues fixture asserts the console and network log.
    });
  }
}
