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

function expectLanguageFonts(rows: RenderedText[]) {
  expect(rows.length).toBeGreaterThan(5);
  for (const row of rows) {
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
]) {
  test(`every text run on ${path} is drawn by its language's web font`, async ({
    page,
  }) => {
    await page.goto(path);
    expectLanguageFonts(await renderedFonts(page));
  });
}

test("Greek coverage strings render entirely in Inter", async ({ page }) => {
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
