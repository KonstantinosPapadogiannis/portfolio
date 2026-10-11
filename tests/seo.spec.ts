import { readFileSync } from "node:fs";
import { test, expect, html, publicPages, siteOrigin } from "./fixtures";
import { defaultSiteUrl, isIndexable, resolveSiteUrl } from "../src/config/deployment";

const messages = {
  en: JSON.parse(readFileSync("content/en/messages.json", "utf8")),
  el: JSON.parse(readFileSync("content/el/messages.json", "utf8")),
};

const localeOf = (path: string) => (path === "/el" || path.startsWith("/el/") ? "el" : "en");

test.describe("deployment configuration", () => {
  test("the canonical origin is pinned to the public domain", () => {
    expect(defaultSiteUrl).toBe("https://kpapadogiannis.dev");
    expect(resolveSiteUrl()).toBe(defaultSiteUrl);
  });

  test("only production may be indexed", () => {
    expect(isIndexable({})).toBe(true);
    expect(isIndexable({ VERCEL_ENV: "production" })).toBe(true);
    expect(isIndexable({ VERCEL_ENV: "preview" })).toBe(false);
    expect(isIndexable({ VERCEL_ENV: "development" })).toBe(false);
  });

  test("every public resource uses the canonical public domain", async ({ request }) => {
    for (const path of [...publicPages, "/robots.txt", "/sitemap.xml"]) {
      const body = await (await request.get(path)).text();
      expect(body, path).toContain("kpapadogiannis.dev");
      expect(body, path).not.toMatch(/kpapadogiannis\.vercel\.app/);
    }
  });
});

test("every public page names the human author, creator and publisher", async ({ page }) => {
  for (const path of publicPages) {
    await page.goto(path);
    await expect(page.locator('meta[name="author"]')).toHaveAttribute(
      "content",
      "Konstantinos Papadogiannis",
    );
    await expect(page.locator('meta[name="creator"]')).toHaveAttribute(
      "content",
      "Konstantinos Papadogiannis",
    );
    await expect(page.locator('meta[name="publisher"]')).toHaveAttribute(
      "content",
      "Konstantinos Papadogiannis",
    );
    await expect(page.locator('link[rel="author"]')).toHaveAttribute("href", defaultSiteUrl);
  }
});

test("every page has its own title and a description of 140–160 characters", async ({
  page,
}) => {
  const titles = new Map<string, string>();
  for (const path of publicPages) {
    await page.goto(path);
    const title = await page.title();
    expect(titles.has(title), `${path} repeats the title of ${titles.get(title)}`).toBe(false);
    titles.set(title, path);

    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description!.length, path).toBeGreaterThanOrEqual(140);
    expect(description!.length, path).toBeLessThanOrEqual(160);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      "content",
      description!,
    );
  }
});

test("every page has a share card with the image of its language", async ({ page }) => {
  for (const path of publicPages) {
    const locale = localeOf(path);
    await page.goto(path);
    const meta = async (selector: string) =>
      page.locator(`meta[${selector}]`).getAttribute("content");

    const image = `${siteOrigin}/og/${locale}.png`;
    expect(await meta('property="og:image"'), path).toBe(image);
    expect(await meta('property="og:image:width"'), path).toBe("1200");
    expect(await meta('property="og:image:height"'), path).toBe("630");
    expect(await meta('property="og:image:alt"'), path).toBe(messages[locale].site.ogImageAlt);
    expect(new URL((await meta('property="og:url"'))!).href, path).toBe(
      new URL(path, siteOrigin).href,
    );
    expect(await meta('property="og:locale"'), path).toBe(locale === "el" ? "el_GR" : "en_US");

    expect(await meta('name="twitter:card"'), path).toBe("summary_large_image");
    expect(await meta('name="twitter:image"'), path).toBe(image);
    expect(await meta('name="twitter:title"'), path).toBe(await meta('property="og:title"'));
    expect(await meta('name="twitter:description"'), path).toBe(
      await meta('name="description"'),
    );
  }
});

test("the share images are 1200×630 PNG files", async ({ request }) => {
  for (const locale of ["en", "el"]) {
    const response = await request.get(`/og/${locale}.png`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
    const png = await response.body();
    expect(png.subarray(1, 4).toString("latin1")).toBe("PNG");
    // The IHDR chunk follows the signature: width, then height.
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  }
});

test("the share-image composition stays inside its 1200×630 canvas", async ({ page }) => {
  for (const path of ["/qa/og", "/el/qa/og"]) {
    await page.goto(path);
    const card = await page.locator("#og-card").boundingBox();
    expect(card, path).not.toBeNull();

    for (const element of await page.locator("#og-card p, #og-card svg").all()) {
      const box = await element.boundingBox();
      expect(box, path).not.toBeNull();
      expect(box!.x, path).toBeGreaterThanOrEqual(card!.x);
      expect(box!.y, path).toBeGreaterThanOrEqual(card!.y);
      expect(box!.x + box!.width, path).toBeLessThanOrEqual(card!.x + card!.width);
      expect(box!.y + box!.height, path).toBeLessThanOrEqual(card!.y + card!.height);
    }
  }
});

test("robots.txt allows the site and points at the sitemap on the canonical origin", async ({
  request,
}) => {
  test.skip(!isIndexable(), "a preview build answers noindex instead");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("User-Agent: *\nAllow: /");
  expect(robots).toContain(`Sitemap: ${siteOrigin}/sitemap.xml`);
  expect(robots).not.toMatch(/Disallow: \/\s*$/m);

  const sitemap = await (await request.get("/sitemap.xml")).text();
  const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  expect(locs).toHaveLength(publicPages.length);
  for (const loc of locs) expect(new URL(loc).origin).toBe(siteOrigin);
});

test.describe("the 404 page", () => {
  const cases = [
    { path: "/does-not-exist", locale: "en" },
    { path: "/el/work/does-not-exist", locale: "el" },
    // Addresses the proxy does not see: a dot in the path, or an /api prefix.
    { path: "/old.pdf", locale: "en" },
    // The explicit /el matcher keeps the language for a dotted Greek path.
    { path: "/el/old.pdf", locale: "el" },
    { path: "/api/anything", locale: "en" },
  ] as const;

  test("is rendered on the server with its own title and description", async ({ request }) => {
    for (const { path, locale } of cases) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(404);
      const body = await response.text();
      const notFound = messages[locale].notFound;
      const name = messages[locale].site.name;

      expect(body, path).toContain(`<html lang="${locale}"`);
      expect(body, path).toContain(`<title>${notFound.title} — ${name}</title>`);
      expect(body, path).toMatch(new RegExp(`<h1[^>]*>${notFound.title}</h1>`));
      expect(body, path).toContain(`<meta name="description" content="${notFound.body}"/>`);
      expect(body, path).toContain('<meta name="robots" content="noindex"/>');
      expect(body, path).not.toContain('rel="canonical"');
      expect(body, path).not.toContain("og:url");
      // Not the empty document Next.js sends when rendering failed.
      expect(body, path).not.toContain("__next_error__");
    }
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("still shows the message and the way home", async ({ page, pageIssues }) => {
      for (const { path, locale } of cases.slice(0, 2)) {
        const response = await page.goto(path);
        expect(response?.status()).toBe(404);
        await expect(html(page)).toHaveAttribute("lang", locale);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          messages[locale].notFound.title,
        );
        const home = page.getByRole("main").getByRole("link");
        await expect(home).toHaveText(messages[locale].notFound.home);
        await expect(home).toHaveAttribute("href", locale === "el" ? "/el" : "/");
        await expect(page.getByRole("contentinfo")).toBeVisible();
      }

      // The two 404 responses are what this test asks for.
      for (let i = pageIssues.length - 1; i >= 0; i--) {
        if (
          /^HTTP 404: http:\/\/127\.0\.0\.1:3100\/(does-not-exist|el\/work\/does-not-exist)$/.test(
            pageIssues[i],
          ) ||
          pageIssues[i].startsWith(
            "console.error: Failed to load resource: the server responded with a status of 404",
          )
        ) {
          pageIssues.splice(i, 1);
        }
      }
    });
  });
});
