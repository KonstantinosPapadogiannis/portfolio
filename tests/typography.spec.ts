import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";

type RenderedText = {
  lang: string;
  text: string;
  declared: string;
  // Prose with inline code: the code is drawn in Plex Mono, inside the run.
  hasCode: boolean;
  fonts: { familyName: string; isCustomFont: boolean }[];
};

const GREEK = /[Ͱ-Ͽἀ-῿]/;
// The name in the header and footer, set in Latin in both languages.
const BRAND = ["K. Papadogiannis", "Konstantinos Papadogiannis"];

// Asks Chromium which font files actually drew each visible text node, so a
// silent fallback to a system font cannot pass unnoticed.
const chromiumOnly = "the fonts that drew a text run are read through Chromium's DevTools protocol";

async function renderedFonts(page: Page): Promise<RenderedText[]> {
  await page.evaluate(() => document.fonts.ready);
  const meta = await page.evaluate(() => {
    const rows: { lang: string; text: string; declared: string; hasCode: boolean }[] = [];
    for (const el of document.querySelectorAll("body *")) {
      const ownText = [...el.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.nodeValue ?? "")
        .join("")
        .trim();
      if (!ownText || !el.checkVisibility()) continue;
      el.setAttribute("data-font-audit", String(rows.length));
      rows.push({
        lang: el.closest("[lang]")?.getAttribute("lang") ?? "",
        text: ownText,
        declared: getComputedStyle(el).fontFamily.split(",")[0].replace(/"/g, "").trim(),
        hasCode: el.querySelector("code") !== null,
      });
    }
    return rows;
  });

  const cdp = await page.context().newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("CSS.enable");
  const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", {
    nodeId: root.nodeId,
    selector: "[data-font-audit]",
  });

  const result: RenderedText[] = [];
  for (const nodeId of nodeIds) {
    const { attributes } = await cdp.send("DOM.getAttributes", { nodeId });
    const index = Number(attributes[attributes.indexOf("data-font-audit") + 1]);
    const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", { nodeId });
    result.push({ ...meta[index], fonts });
  }
  await cdp.detach();
  return result;
}

// The CSS family of the "ΕΛ" label holds Inter's Greek file alone
// (globals.css); what draws it is Inter.
const drawnBy = (family: string) => (family === "Inter Greek" ? "Inter" : family);

function expectLanguageFonts(rows: RenderedText[]) {
  expect(rows.length).toBeGreaterThan(5);
  for (const { declared, ...rest } of rows) {
    const row = { ...rest, declared: drawnBy(declared) };
    const where = `"${row.text.slice(0, 50)}" (lang=${row.lang})`;
    const families = row.fonts.map((font) => font.familyName);

    // One web font per text run: no fallback glyphs, no mid-sentence switch
    // other than to Plex Mono for inline code.
    const expected = row.hasCode ? [row.declared, "IBM Plex Mono"] : [row.declared];
    expect([...families].sort(), where).toEqual([...new Set(expected)].sort());
    expect(row.fonts.every((font) => font.isCustomFont), where).toBe(true);

    if (GREEK.test(row.text)) {
      const text = families.filter((family) => !(row.hasCode && family === "IBM Plex Mono"));
      expect(text, where).toEqual(["Inter"]);
    }
    if (row.lang === "el") {
      // Greek prose is Inter; code tags stay in Plex Mono, the Latin name in
      // the header and footer in Geist.
      const allowed = BRAND.includes(row.text) ? ["Geist"] : ["Inter", "IBM Plex Mono"];
      expect(allowed, where).toContain(row.declared);
    }
    if (row.lang === "en") {
      expect(["Geist", "IBM Plex Mono"], where).toContain(row.declared);
    }
  }
}

for (const path of [
  "/qa/typography",
  "/el/qa/typography",
  "/",
  "/el",
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
  test(`every text run on ${path} is drawn by its language's web font`, async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", chromiumOnly);
    await page.goto(path);
    expectLanguageFonts(await renderedFonts(page));
  });
}

// Inter is preloaded by language (src/config/fonts.ts): its Greek file on
// every page, for the "ΕΛ" label, and its Latin file only on Greek pages,
// where the Latin words of the headline would otherwise arrive after the
// first paint and move the lines below them. English pages never fetch the
// Latin file.
const interFiles = (urls: string[]) =>
  urls.filter((url) => url.includes("/fonts/inter-")).map((url) => url.split("/").pop()).sort();

for (const [path, expected] of [
  ["/", ["greek.woff2"]],
  ["/work/thesis", ["greek.woff2"]],
  ["/el", ["greek.woff2", "latin.woff2"]],
  ["/el/work/thesis", ["greek.woff2", "latin.woff2"]],
] as const) {
  test(`${path} preloads and fetches the Inter files of its language`, async ({ page }) => {
    const fetched: string[] = [];
    page.on("request", (request) => fetched.push(request.url()));
    const response = await page.goto(path);
    const preloaded = [
      ...((await response!.headerValue("link")) ?? "").matchAll(/<([^>]+)>; rel=preload; as="font"/g),
    ].map(([, href]) => href);
    await page.evaluate(() => document.fonts.ready);

    expect(interFiles(preloaded)).toEqual(expected);
    // Firefox reports a preloaded file twice, once for the preload and once
    // for its use; the server receives one request.
    expect(interFiles([...new Set(fetched)])).toEqual(expected);
  });
}

// Switching to Greek inside the page: the router does not add a preload for
// the Latin file (next.config.ts), and the font loads it once.
test("switching to Greek in the page loads Inter's Latin file once", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const fetched: string[] = [];
  page.on("request", (request) => fetched.push(request.url()));

  await page
    .getByRole("banner")
    .getByRole("group", { name: "Language" })
    .getByRole("link", { name: "Ελληνικά" })
    .click();
  await expect(page.locator("html")).toHaveAttribute("lang", "el");
  // Inter's Latin face, the one whose range starts at U+0.
  const latinLoaded = () =>
    page.evaluate(() =>
      [...document.fonts].some(
        (face) =>
          face.family === "Inter" &&
          face.unicodeRange.toLowerCase().startsWith("u+0-") &&
          face.status === "loaded",
      ),
    );
  await expect.poll(latinLoaded).toBe(true);

  expect(interFiles(fetched)).toEqual(["latin.woff2"]);
  await expect(page.locator('link[rel="preload"][href$="/latin.woff2"]')).toHaveCount(0);
});

test("a delayed Inter Latin file does not move the Greek layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  const geometry = () =>
    page.evaluate(() => {
      const rect = (selector: string) => {
        const box = document.querySelector(selector)!.getBoundingClientRect();
        return { top: box.top, right: box.right, bottom: box.bottom, left: box.left };
      };
      return {
        heading: rect("#hero-heading"),
        intro: rect('main [data-enter="2"]'),
        actions: rect('main [data-enter="2"]:not(p)'),
        selectedWork: rect("#work"),
      };
    });

  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    let release = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    let requests = 0;
    const pattern = "**/fonts/inter-4.001/latin.woff2";

    await page.route(pattern, async (route) => {
      requests++;
      await gate;
      await route.continue();
    });

    try {
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await page
        .getByRole("banner")
        .getByRole("group", { name: "Language" })
        .getByRole("link", { name: "Ελληνικά" })
        .evaluate((link: HTMLElement) => link.click());
      await expect(page.locator("html")).toHaveAttribute("lang", "el");
      await expect.poll(() => requests).toBe(1);

      const before = await geometry();
      release();
      await expect
        .poll(() =>
          page.evaluate(() =>
            [...document.fonts].some(
              (face) =>
                face.family === "Inter" &&
                face.unicodeRange.toLowerCase().startsWith("u+0-") &&
                face.status === "loaded",
            ),
          ),
        )
        .toBe(true);
      const after = await geometry();

      for (const key of Object.keys(before) as (keyof typeof before)[]) {
        for (const edge of Object.keys(before[key]) as (keyof (typeof before)[typeof key])[]) {
          expect(Math.abs(before[key][edge] - after[key][edge]), `${width}px ${key}.${edge}`).toBeLessThanOrEqual(1);
        }
      }
      expect(requests, `${width}px`).toBe(1);
    } finally {
      release();
      await page.unroute(pattern);
    }
  }
});

test("Greek coverage strings render entirely in Inter", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", chromiumOnly);
  await page.goto("/qa/typography");
  const block = page.getByTestId("qa-diacritics");
  await expect(block.getByText("Ά Έ Ή Ί Ό Ύ Ώ").first()).toBeVisible();
  await expect(block.getByText("ΐ ΰ").first()).toBeVisible();

  const rows = (await renderedFonts(page)).filter((row) => GREEK.test(row.text));
  for (const line of ["ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ", "ά έ ή ί ό ύ ώ", "ϊ ϋ", "ς"]) {
    expect(rows.some((row) => row.text === line), line).toBe(true);
  }
  const mixed = rows.find((row) => row.text.startsWith("Κατανεμημένα"));
  expect(mixed?.fonts.map((font) => font.familyName)).toEqual(["Inter"]);
  expect(
    await page.evaluate(() =>
      document.fonts.check("700 64px Inter", "ΐΰϊϋςΆΏ"),
    ),
  ).toBe(true);
});

test("uppercase Greek labels drop the tonos", async ({ page }) => {
  await page.goto("/qa/typography");
  await expect(page.getByTestId("uppercase")).toHaveText(
    "ΕΠΙΛΕΓΜΕΝΑ ΕΡΓΑ · ΣΧΕΤΙΚΑ · ΕΠΙΚΟΙΝΩΝΙΑ · ΥΨΟΣ · ΑΡΘΡΟ",
    { useInnerText: true },
  );
});

test("English and Greek labels take the same line box", async ({
  page,
}) => {
  await page.goto("/qa/typography");
  const boxes = await Promise.all(
    ["qa-en", "qa-el"].map((id) =>
      page.getByTestId(id).getByTestId("eyebrow").boundingBox(),
    ),
  );
  const [en, el] = boxes.map((box) => box!);
  // Label rows of the two languages start on the same line and keep the
  // same line height, so switching language does not shift the layout.
  expect(Math.abs(en.y - el.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(en.height - el.height)).toBeLessThanOrEqual(1);
});
