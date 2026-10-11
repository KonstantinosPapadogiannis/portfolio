import { test, expect, html, languageGroup, siteOrigin } from "./fixtures";

test("English renders at / with lang=en", async ({ page }) => {
  await page.goto("/");
  await expect(html(page)).toHaveAttribute("lang", "en");
  await expect(
    page.getByRole("link", { name: "K. Papadogiannis, home" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Backend systems, distributed software, and cloud infrastructure.",
  );
});

test("Greek renders at /el with lang=el", async ({ page }) => {
  await page.goto("/el");
  await expect(html(page)).toHaveAttribute("lang", "el");
  await expect(
    page.getByRole("link", {
      name: "K. Papadogiannis, αρχική σελίδα",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Συστήματα backend, κατανεμημένο λογισμικό και υποδομές cloud.",
  );
});

test("skip link is the first tab stop and moves focus to main", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});

test("language switcher is a labelled group marking the current language", async ({
  page,
}) => {
  await page.goto("/");
  // One switcher in the header, one in the footer, built the same way.
  const groups = page.getByRole("group", { name: "Language" });
  await expect(groups).toHaveCount(2);

  for (const group of await groups.all()) {
    const english = group.getByRole("link", { name: "English" });
    const greek = group.getByRole("link", { name: "Ελληνικά" });

    await expect(english).toHaveAttribute("aria-current", "true");
    await expect(english).toHaveAttribute("lang", "en");
    await expect(greek).not.toHaveAttribute("aria-current");
    await expect(greek).toHaveAttribute("lang", "el");
    await expect(greek).toHaveAttribute("hreflang", "el");
    await expect(greek).toHaveAttribute("href", "/el");
    await expect(greek).toHaveText("ΕΛ");
  }
});

test("language links point at the canonical URL of the same page", async ({
  page,
}) => {
  const cases = [
    ["/", "/", "/el"],
    ["/el", "/", "/el"],
    ["/resume", "/resume", "/el/resume"],
    ["/el/resume", "/resume", "/el/resume"],
    ["/work/thesis", "/work/thesis", "/el/work/thesis"],
    ["/el/work/thesis", "/work/thesis", "/el/work/thesis"],
    ["/work/ergohub", "/work/ergohub", "/el/work/ergohub"],
    ["/el/work/ergohub", "/work/ergohub", "/el/work/ergohub"],
    ["/work/openstack", "/work/openstack", "/el/work/openstack"],
    ["/el/work/openstack", "/work/openstack", "/el/work/openstack"],
    ["/work/cuda", "/work/cuda", "/el/work/cuda"],
    ["/el/work/cuda", "/work/cuda", "/el/work/cuda"],
    ["/work/computer-vision", "/work/computer-vision", "/el/work/computer-vision"],
    ["/el/work/computer-vision", "/work/computer-vision", "/el/work/computer-vision"],
    ["/work/energy-data-mining", "/work/energy-data-mining", "/el/work/energy-data-mining"],
    ["/el/work/energy-data-mining", "/work/energy-data-mining", "/el/work/energy-data-mining"],
  ];
  for (const [path, en, el] of cases) {
    await page.goto(path);
    const group = languageGroup(page);
    await expect(group.getByRole("link", { name: "English" })).toHaveAttribute("href", en);
    await expect(group.getByRole("link", { name: "Ελληνικά" })).toHaveAttribute("href", el);
  }
});

test("the URL alone decides the language", async ({ browser }) => {
  const context = await browser.newContext({ locale: "el-GR" });
  const page = await context.newPage();

  // A Greek browser opening the English URL, after visiting the Greek site.
  await page.goto("/el");
  const response = await page.goto("/");
  expect(response?.request().redirectedFrom()).toBeNull();
  await expect(page).toHaveURL(/127\.0\.0\.1:3100\/$/);
  await expect(html(page)).toHaveAttribute("lang", "en");
  expect(await context.cookies()).toEqual([]);

  await context.close();
});

test("resume page links the existing PDF in both languages", async ({
  page,
  request,
}) => {
  for (const [path, title] of [
    ["/resume", "Résumé"],
    ["/el/resume", "Βιογραφικό"],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    const pdfLinks = page.locator('main a[href$=".pdf"]');
    await expect(pdfLinks).toHaveCount(2);
    await expect(pdfLinks.last()).toHaveAttribute("download", "");
  }

  const pdf = await request.get("/downloads/konstantinos-papadogiannis-cv.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toBe("application/pdf");
});

test("resume page describes the PDF and has its own Open Graph URL", async ({ page }) => {
  for (const [path, body] of [
    ["/resume", /^A one-page PDF in English/],
    ["/el/resume", /μόνο στα αγγλικά\.$/],
  ] as const) {
    await page.goto(path);
    await expect(page.locator("main p").first()).toHaveText(body);
    await expect(page.locator("main")).not.toContainText(/temporary|προσωριν/i);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{80,}/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      `${siteOrigin}${path}`,
    );
  }
});

test("homepage describes its subject as a Person, with no job title", async ({ page }) => {
  for (const [path, name, university] of [
    ["/", "Konstantinos Papadogiannis", "Harokopio University of Athens"],
    ["/el", "Κωνσταντίνος Παπαδογιάννης", "Χαροκόπειο Πανεπιστήμιο"],
  ] as const) {
    await page.goto(path);
    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(1);
    const person = JSON.parse((await scripts.textContent()) ?? "{}");
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe(name);
    expect(person.url).toBe(siteOrigin);
    expect(person.alumniOf.name).toBe(university);
    expect(person.sameAs).toEqual([
      "https://github.com/KonstantinosPapadogiannis",
      "https://www.linkedin.com/in/konstantinos-papadogiannis/",
      "https://orcid.org/0009-0008-9445-2484",
    ]);
    expect(person).not.toHaveProperty("jobTitle");
    expect(person).not.toHaveProperty("worksFor");
  }
});

test("theme toggle switches data-theme and reports its state", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Dark theme" });
  await expect(html(page)).toHaveAttribute("data-theme", "light");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(html(page)).toHaveAttribute("data-theme", "light");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
});

test("an unknown address answers 404 with the not-found page in its language", async ({
  page,
  pageIssues,
  request,
}) => {
  // Paths with a dot skip the proxy and reach the routes with their first
  // segment as the locale. They too are answered 404 from the first request.
  for (const path of ["/old.pdf", "/downloads/missing.pdf"]) {
    expect((await request.get(path)).status()).toBe(404);
  }

  const cases = [
    ["/does-not-exist", "en", "Page not found", "/"],
    ["/el/work/does-not-exist", "el", "Η σελίδα δεν βρέθηκε", "/el"],
  ] as const;
  for (const [path, lang, heading, home] of cases) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(html(page)).toHaveAttribute("lang", lang);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page.locator("main a")).toHaveAttribute("href", home);
    await expect(page.locator('meta[name="robots"][content="noindex"]').first()).toBeAttached();
    // Let the final document consume its font preloads before the next full
    // navigation. Firefox otherwise reports the superseded font as aborted.
    await page.evaluate(() => document.fonts.ready);
  }

  // The two 404 responses, and the browser reporting each once, are what this
  // test asks for. Anything else still fails it.
  for (const [path] of cases) {
    const http = pageIssues.indexOf(`HTTP 404: http://127.0.0.1:3100${path}`);
    expect(http).toBeGreaterThanOrEqual(0);
    pageIssues.splice(http, 1);
    const logged = pageIssues.findIndex((issue) =>
      issue.startsWith("console.error: Failed to load resource: the server responded with a status of 404"),
    );
    if (logged >= 0) pageIssues.splice(logged, 1);
  }
});

test("on a page shorter than the window the footer ends at the bottom edge", async ({
  page,
  pageIssues,
}) => {
  for (const size of [
    { width: 1440, height: 900 },
    { width: 2560, height: 1440 },
  ]) {
    await page.setViewportSize(size);
    for (const path of ["/resume", "/el/resume", "/does-not-exist"]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      // Read the already-loaded document directly. Firefox can regard a
      // speculative Next.js navigation as pending and make locator.evaluate
      // wait for it even though this full page load has completed.
      const bottom = await page.evaluate(() => {
        const footer = document.querySelector("footer");
        if (!footer) throw new Error("footer not found");
        return footer.getBoundingClientRect().bottom + window.scrollY;
      });
      expect(bottom).toBe(size.height);
      expect(
        await page.evaluate(() => document.documentElement.scrollHeight),
      ).toBe(size.height);
    }
  }

  // The 404 page answers 404 by design (see the test above).
  for (let i = pageIssues.length - 1; i >= 0; i--) {
    if (
      pageIssues[i] === "HTTP 404: http://127.0.0.1:3100/does-not-exist" ||
      pageIssues[i].startsWith(
        "console.error: Failed to load resource: the server responded with a status of 404",
      )
    ) {
      pageIssues.splice(i, 1);
    }
  }
});

test.describe("without JavaScript on a phone", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

  test("primary navigation remains usable instead of showing an inert menu button", async ({
    page,
  }) => {
    await page.goto("/");
    const banner = page.getByRole("banner");
    await expect(banner.getByRole("button", { name: "Menu" })).toBeHidden();
    const navigation = banner.getByRole("navigation", { name: "Main" });
    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole("link", { name: "Work" })).toHaveAttribute(
      "href",
      "/#work",
    );
  });
});

test("QA route is not indexed", async ({ page }) => {
  await page.goto("/qa/typography");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
});

test("the case studies are indexable", async ({ page }) => {
  for (const path of [
    "/work/thesis",
    "/el/work/thesis",
    "/work/ergohub",
    "/el/work/ergohub",
    "/work/openstack",
    "/el/work/openstack",
    "/work/cuda",
    "/el/work/cuda",
    "/work/computer-vision",
    "/el/work/computer-vision",
    "/work/energy-data-mining",
    "/el/work/energy-data-mining",
  ]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index, follow",
    );
  }
});

test("canonical and alternate URLs use the production domain", async ({ page }) => {
  for (const path of [
    "/",
    "/el",
    "/resume",
    "/work/thesis",
    "/el/work/thesis",
    "/work/ergohub",
    "/el/work/ergohub",
    "/work/openstack",
    "/el/work/openstack",
    "/work/cuda",
    "/el/work/cuda",
    "/work/computer-vision",
    "/el/work/computer-vision",
    "/work/energy-data-mining",
    "/el/work/energy-data-mining",
  ]) {
    const response = await page.goto(path);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).origin).toBe(siteOrigin);
    const alternates = page.locator('link[rel="alternate"][hreflang]');
    await expect(alternates).toHaveCount(3);
    for (const alternate of await alternates.all()) {
      expect(new URL((await alternate.getAttribute("href"))!).origin).toBe(
        siteOrigin,
      );
    }
    // No second list in the headers, on the host that happened to serve it.
    expect(response!.headers().link ?? "").not.toContain('rel="alternate"');
  }
});

test("sitemap lists each language version with the canonical URLs", async ({
  page,
  request,
}) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(locs).toEqual([
    "/",
    "/el",
    "/resume",
    "/el/resume",
    "/work/thesis",
    "/el/work/thesis",
    "/work/ergohub",
    "/el/work/ergohub",
    "/work/openstack",
    "/el/work/openstack",
    "/work/cuda",
    "/el/work/cuda",
    "/work/computer-vision",
    "/el/work/computer-vision",
    "/work/energy-data-mining",
    "/el/work/energy-data-mining",
  ]);
  expect(xml).not.toContain("/qa/");
  expect(xml).not.toMatch(/href="[^"]*\/el\/"/);
  expect(xml.match(/hreflang="x-default"/g)).toHaveLength(16);

  for (const path of [
    "/el",
    "/el/resume",
    "/el/work/thesis",
    "/el/work/ergohub",
    "/el/work/openstack",
    "/el/work/cuda",
    "/el/work/computer-vision",
    "/el/work/energy-data-mining",
  ]) {
    await page.goto(path);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).pathname).toBe(path);
  }
});
