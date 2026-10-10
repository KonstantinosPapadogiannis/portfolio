import { test as base, expect, type Page } from "@playwright/test";

// Every test fails if the page logs an error or warning, throws, or receives
// an HTTP error (fonts and prefetches included). Requests aborted by a
// navigation are not failures, nor, with JavaScript turned off, the scripts
// the browser declines to load.
export const test = base.extend<{ pageIssues: string[] }>({
  pageIssues: [
    async ({ page, javaScriptEnabled }, use) => {
      const issues: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error" || message.type() === "warning") {
          issues.push(`console.${message.type()}: ${message.text()}`);
        }
      });
      page.on("pageerror", (error) => issues.push(`pageerror: ${error.message}`));
      page.on("response", (response) => {
        if (response.status() >= 400) {
          issues.push(`HTTP ${response.status()}: ${response.url()}`);
        }
      });
      page.on("requestfailed", (request) => {
        const reason = request.failure()?.errorText ?? "";
        const scriptBlocked =
          !javaScriptEnabled && request.resourceType() === "script" && reason === "csp";
        if (!reason.includes("ERR_ABORTED") && !scriptBlocked) {
          issues.push(`request failed (${reason}): ${request.url()}`);
        }
      });

      await use(issues);

      expect(issues, "console, page or network problems").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export const html = (page: Page) => page.locator("html");

// The header's language switcher. The footer repeats it under the same label.
export const languageGroup = (page: Page) =>
  page.getByRole("banner").getByRole("group", { name: /^(Language|Γλώσσα)$/ });

export async function toggleTheme(page: Page, label: string, to: "light" | "dark") {
  await page.getByRole("button", { name: label }).click();
  await expect(html(page)).toHaveAttribute("data-theme", to);
}

// Records the data-theme value of every rendered frame (animation frame
// callbacks run just before paint), across full page loads, so a test can
// prove a dark page never painted a frame in the light theme.
export async function recordThemeChanges(page: Page) {
  await page.addInitScript(() => {
    if (location.protocol !== "http:") return;
    const key = "__themeLog";
    let last: string | undefined;
    const onFrame = () => {
      const theme =
        document.documentElement?.getAttribute("data-theme") ?? "none";
      if (theme !== last) {
        last = theme;
        const log = JSON.parse(sessionStorage.getItem(key) ?? "[]") as string[];
        log.push(theme);
        sessionStorage.setItem(key, JSON.stringify(log));
      }
      requestAnimationFrame(onFrame);
    };
    requestAnimationFrame(onFrame);
  });

  return async () =>
    page.evaluate(
      () => JSON.parse(sessionStorage.getItem("__themeLog") ?? "[]") as string[],
    );
}
