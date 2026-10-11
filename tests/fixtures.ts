import { test as base, expect, type Page, type Request } from "@playwright/test";
import { resolveSiteUrl } from "../src/config/deployment";

// How Chromium, Firefox and WebKit name a request that a navigation aborted.
const abortReasons = ["net::ERR_ABORTED", "NS_BINDING_ABORTED", "Load request cancelled"];

// Firefox and WebKit can also describe a navigation-cancelled load as a page
// message. Return the exact resource URL only for those two native messages.
// A matching string is not enough to ignore it: the fixture
// also requires evidence that the resource crossed a navigation boundary.
function cancelledMessageUrl(kind: string, message: string) {
  if (kind === "pageerror") {
    const match = message.match(
      /^\/([^/ ]+)(\/[^ ]*\?_rsc=[\w-]+) due to access control checks\.$/,
    );
    if (match) return `http://${match[1]}${match[2]}`;
  }

  if (kind === "console.warning") {
    const match = message.match(
      /^\[JavaScript Warning: "Loading failed for the <script> with source [“"](https?:\/\/[^”"]+\/_next\/static\/chunks\/[\w-]+\.js)[”"]\./,
    );
    if (match) return match[1];
  }

  return undefined;
}

// Every test fails if the page logs an error or warning, throws, or receives
// an HTTP error (fonts and prefetches included). Requests aborted by a
// navigation are not failures, nor, with JavaScript turned off, the scripts
// the browser declines to load.
export const test = base.extend<{ pageIssues: string[] }>({
  pageIssues: [
    async ({ page, javaScriptEnabled, browserName }, use) => {
      const issues: string[] = [];
      const requests = new Map<Request, { generation: number; url: string }>();
      const recentlyEnded: { generation: number; url: string; at: number }[] = [];
      const pendingAborts: { generation: number; url: string; reason: string; at: number }[] = [];
      const cancelledByNavigation = new Set<string>();
      const navigationTransitions: { generation: number; at: number; origin: string }[] = [];
      const possibleCancellationMessages: {
        generation: number;
        kind: string;
        text: string;
        url: string;
        at: number;
      }[] = [];
      let generation = 0;
      let pendingDocumentUrl: string | undefined;
      let committedUrl = "";

      const cancellationKey = (value: number, url: string) => `${value}\n${url}`;
      const beginNavigation = (navigationUrl: string) => {
        const previous = generation;
        generation++;
        const now = Date.now();
        navigationTransitions.push({
          generation,
          at: now,
          origin: new URL(navigationUrl).origin,
        });
        for (const [request, record] of requests) {
          if (request.frame() === page.mainFrame() && record.generation < generation) {
            cancelledByNavigation.add(cancellationKey(generation, record.url));
          }
        }
        // Firefox and WebKit can emit the cancellation event just before the
        // new document request. Keep only the immediately preceding page's
        // resources, inside a short transition window.
        for (const record of recentlyEnded) {
          if (record.generation === previous && now - record.at <= 2_000) {
            cancelledByNavigation.add(cancellationKey(generation, record.url));
          }
        }
        for (const record of pendingAborts) {
          if (record.generation === previous && now - record.at <= 2_000) {
            cancelledByNavigation.add(cancellationKey(generation, record.url));
          }
        }
      };

      page.on("request", (request) => {
        if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
          beginNavigation(request.url());
          pendingDocumentUrl = request.url();
        }
        requests.set(request, { generation, url: request.url() });
      });
      page.on("requestfinished", (request) => {
        const record = requests.get(request);
        if (record) recentlyEnded.push({ ...record, at: Date.now() });
        requests.delete(request);
      });
      page.on("framenavigated", (frame) => {
        if (frame !== page.mainFrame()) return;
        const url = frame.url();
        if (pendingDocumentUrl === url) {
          pendingDocumentUrl = undefined;
        } else if (committedUrl && url !== committedUrl) {
          // Client-side navigation: there is no document request to start a
          // new generation, so the committed main-frame URL does it.
          beginNavigation(url);
        }
        committedUrl = url;
      });

      const report = (kind: string, text: string) => {
        const url = cancelledMessageUrl(kind, text);
        if (url) {
          possibleCancellationMessages.push({ generation, kind, text, url, at: Date.now() });
        } else {
          issues.push(`${kind}: ${text}`);
        }
      };

      page.on("console", (message) => {
        if (message.type() === "error" || message.type() === "warning") {
          report(`console.${message.type()}`, message.text());
        }
      });
      page.on("pageerror", (error) => report("pageerror", error.message));
      page.on("response", (response) => {
        if (response.status() >= 400) {
          issues.push(`HTTP ${response.status()}: ${response.url()}`);
        }
      });
      page.on("requestfailed", (request) => {
        const reason = request.failure()?.errorText ?? "";
        const record = requests.get(request);
        requests.delete(request);
        const scriptBlocked =
          !javaScriptEnabled && request.resourceType() === "script" && reason === "csp";
        const superseded =
          record !== undefined &&
          record.generation < generation &&
          request.frame() === page.mainFrame();
        if (abortReasons.includes(reason) && superseded) {
          cancelledByNavigation.add(cancellationKey(generation, request.url()));
        } else if (
          abortReasons.includes(reason) &&
          record !== undefined &&
          request.frame() === page.mainFrame()
        ) {
          // Defer the decision: in some engines this event precedes the
          // document request that proves the old page was superseded.
          pendingAborts.push({ ...record, reason, at: Date.now() });
        } else if (!scriptBlocked) {
          issues.push(`request failed (${reason}): ${request.url()}`);
        }
      });

      await use(issues);

      for (const message of possibleCancellationMessages) {
        // Some engines emit the message immediately before the new document's
        // request event, others immediately after it. In both orders the URL
        // must match a resource active across that precise navigation.
        const requestCorrelated = [message.generation, message.generation + 1].some((value) =>
          cancelledByNavigation.has(cancellationKey(value, message.url)),
        );
        // WebKit can surface an RSC prefetch it cancelled internally without
        // exposing that prefetch through Playwright's request events. Accept
        // only its exact native page-error shape, on the same origin, within
        // 250 ms of the immediately adjacent main-frame navigation. HTTP
        // errors and other request/console failures remain independently fatal.
        const nativeWebKitCancellation =
          browserName === "webkit" &&
          message.kind === "pageerror" &&
          navigationTransitions.some(
            (transition) =>
              (transition.generation === message.generation ||
                transition.generation === message.generation + 1) &&
              Math.abs(transition.at - message.at) <= 250 &&
              transition.origin === new URL(message.url).origin,
          );
        if (!requestCorrelated && !nativeWebKitCancellation) {
          issues.push(`${message.kind}: ${message.text}`);
        }
      }
      for (const request of pendingAborts) {
        if (!cancelledByNavigation.has(cancellationKey(request.generation + 1, request.url))) {
          issues.push(`request failed (${request.reason}): ${request.url}`);
        }
      }

      expect(issues, "console, page or network problems").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

// The canonical origin of the build under test, resolved from the same
// environment the web server is started with (src/config/deployment.ts).
export const siteOrigin = resolveSiteUrl();

// Every public page, in both languages.
export const publicPages = [
  "/",
  "/el",
  "/resume",
  "/el/resume",
  ...["thesis", "ergohub", "openstack", "cuda", "computer-vision", "energy-data-mining"].flatMap(
    (slug) => [`/work/${slug}`, `/el/work/${slug}`],
  ),
];

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
