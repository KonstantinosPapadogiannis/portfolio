import { test, expect, html } from "./fixtures";

const sections = ["classification", "comparison", "segmentation-detection", "lessons"];

// The models as named on the page, the same in both languages.
const models = ["ViT-B/16", "VGG16-BN"];

// Claims the project cannot support: five exercises, one run each, measured
// on test accuracy, pixel accuracy and training loss only. No mAP or IoU
// figure, no precision or recall, no general ranking of architectures, no
// robustness, production or real-time use, no publication, no hype; and none
// of the figures from runs other than the submitted ones. Compared after
// fold(). "mAP" and "IoU" are named on the page only as what was not
// measured, so only a figure next to them counts.
const unsupportedClaims =
  /state[- ]of[- ]the[- ]art|\bsota\b|superior|outperform|υπερτερ|ανωτερ|better than (cnn|transformer)|καλυτερ\S* απο (τα |τους )?(cnn|transformer)|robust|ανθεκτικ|ευρωστ|production|παραγωγ|real[- ]time|πραγματικο χρονο|industry|βιομηχαν|publication|δημοσιευ|attention|quadratic|τετραγωνικ|o\(n|novel|breakthrough|revolutionary|excellent|εξαιρετικ|cutting-edge|leverag|precision|recall|\bmap\b[^.\n]{0,12}\d|\d\s*%?\s*\bmap\b|\biou\b[^.\n]{0,12}\d|\d\s*%?\s*\biou\b|93[.,]18|30[.,]85|41[.,]15|41[.,]76/;

// Details that stay private: student numbers (seven digits from 20, never
// spelled out here), the university mail domain, a course code, the teaching
// staff, and the project's files, notebooks, folders and storage.
const privateDetails = [
  /\b(it)?20\d{5}\b/,
  /hua\.gr/,
  /\bdit\s?\d{3}\b/,
  /professor|καθηγητ|instructor|διδασκ/,
  /\.ipynb|colab\.research|drive\.google|mydrive|\/content\/drive/,
  /computervision_project/,
  /tel:/,
];

const fold = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("el");

const words = (text: string) => text.match(/[\p{L}\p{N}][\p{L}\p{N}’'\-./]*/gu)?.length ?? 0;

const locales = [
  {
    path: "/work/computer-vision",
    home: "/",
    lang: "en",
    title: "Classification, segmentation and detection in PyTorch",
    metaTitle: "Computer Vision: Classification, Segmentation and Detection in PyTorch",
    author: "Konstantinos Papadogiannis",
    kind: "Individual academic project",
    period: "February 2026",
    context: ["Harokopio University of Athens", "Computer Vision and Graphics"],
    back: "More work",
    backEnd: "Back to projects",
    contents: "Contents",
    training: ["from scratch", "fine-tuned", "pretrained on ImageNet"],
    cifar100: ["CIFAR-100", "30.62%", "42.13%"],
    pets: [
      /Test accuracy\s+87\.24%/,
      /Test accuracy\s+90\.32%/,
      /Test accuracy\s+88\.28%/,
    ],
    figure: "CIFAR-10 test accuracy at the last epoch",
    columns: ["Model", "5 epochs", "10 epochs", "Time per epoch"],
    table: [
      ["95.85%", "95.63%", "376 s"],
      ["92.84%", "93.26%", "141 s"],
    ],
    comparison: ["2.4 to 3.0 percentage points", "2.7 times", "does not rank the two architectures"],
    segmentation: /Pixel accuracy\s+75\.79%/,
    detection: /Training loss, SGD, 10 epochs\s+0\.644\s+to\s+0\.161/,
    unmeasured: ["I computed no mAP", "without IoU"],
    counts: ["8,498", "2,501", "0.144"],
    runs: ["92.84%", "93.35%", "fixed seed"],
  },
  {
    path: "/el/work/computer-vision",
    home: "/el",
    lang: "el",
    title: "Classification, segmentation και detection σε PyTorch",
    metaTitle: "Όραση υπολογιστών: Classification, segmentation και detection σε PyTorch",
    author: "Κωνσταντίνος Παπαδογιάννης",
    kind: "Ατομικό ακαδημαϊκό έργο",
    period: "Φεβρουάριος 2026",
    context: ["Χαροκόπειο Πανεπιστήμιο", "Υπολογιστική Όραση και Γραφικά"],
    back: "Περισσότερα έργα",
    backEnd: "Πίσω στα έργα",
    contents: "Περιεχόμενα",
    training: ["από την αρχή", "fine-tuning", "προεκπαιδευμένο στο ImageNet"],
    cifar100: ["CIFAR-100", "30,62%", "42,13%"],
    pets: [
      /Test accuracy\s+87,24%/,
      /Test accuracy\s+90,32%/,
      /Test accuracy\s+88,28%/,
    ],
    figure: "Test accuracy στο CIFAR-10, στην τελευταία εποχή",
    columns: ["Μοντέλο", "5 εποχές", "10 εποχές", "Χρόνος ανά εποχή"],
    table: [
      ["95,85%", "95,63%", "376 s"],
      ["92,84%", "93,26%", "141 s"],
    ],
    comparison: [
      "2,4 έως 3,0 ποσοστιαίες μονάδες",
      "2,7 φορές",
      "δεν κατατάσσει τις δύο αρχιτεκτονικές",
    ],
    segmentation: /Pixel accuracy\s+75,79%/,
    detection: /Training loss, SGD, 10 εποχές\s+0,644\s+σε\s+0,161/,
    unmeasured: ["mAP δεν υπολόγισα", "χωρίς IoU"],
    counts: ["8.498", "2.501", "0,144"],
    runs: ["92,84%", "93,35%", "σταθερό seed"],
  },
] as const;

for (const locale of locales) {
  test.describe(`Computer vision case study (${locale.lang})`, () => {
    test("title, metadata and structured data", async ({ page }) => {
      await page.goto(locale.path);
      await expect(html(page)).toHaveAttribute("lang", locale.lang);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale.title);
      await expect(page).toHaveTitle(`${locale.metaTitle} — ${locale.author}`);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://kpapadogiannis.dev${locale.path}`,
      );
      for (const [hreflang, path] of [
        ["en", "/work/computer-vision"],
        ["el", "/el/work/computer-vision"],
        ["x-default", "/work/computer-vision"],
      ]) {
        await expect(
          page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`),
        ).toHaveAttribute("href", `https://kpapadogiannis.dev${path}`);
      }
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{80,}/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        new RegExp(`^${locale.kind}`),
      );
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        locale.metaTitle,
      );

      const ld = JSON.parse(
        (await page.locator('script[type="application/ld+json"]').textContent())!,
      );
      expect(ld).toMatchObject({
        "@type": "CreativeWork",
        name: locale.metaTitle,
        url: `https://kpapadogiannis.dev${locale.path}`,
        inLanguage: locale.lang,
        author: { "@type": "Person", name: locale.author },
      });

      const duplicates = await page.evaluate(() => {
        const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
        return ids.filter((id, i) => ids.indexOf(id) !== i);
      });
      expect(duplicates).toEqual([]);
    });

    test("an individual academic project of February 2026", async ({ page }) => {
      await page.goto(locale.path);
      const head = page.locator("article > header");
      const meta = head.locator("p").first();
      await expect(meta).toContainText(locale.kind);
      await expect(meta).toContainText("2026");
      await expect(head.locator("dl")).toContainText(locale.period);
      await expect(head.locator("dl")).toContainText("PyTorch");
      for (const text of locale.context) await expect(head.locator("dl")).toContainText(text);
    });

    test("both links back go to the other projects", async ({ page }) => {
      await page.goto(locale.path);
      const main = page.getByRole("main");
      const href = `${locale.home}#more-work`;
      await expect(main.getByRole("link", { name: locale.back, exact: true })).toHaveAttribute(
        "href",
        href,
      );
      const back = main.getByRole("link", { name: locale.backEnd, exact: true });
      await expect(back).toHaveAttribute("href", href);
      await back.click();
      await expect(page).toHaveURL(new RegExp(`${locale.home === "/" ? "/" : "/el"}#more-work$`));
      await expect(page.locator("#more-work")).toBeInViewport();
    });

    test("four sections, each in the contents list", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(locale.path);
      const contents = page.getByRole("navigation", { name: locale.contents });
      await expect(contents.getByRole("link")).toHaveCount(sections.length);
      await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveCount(
        sections.length,
      );
      for (const [i, id] of sections.entries()) {
        await expect(page.locator(`section#${id}`)).toHaveAttribute(
          "aria-labelledby",
          `${id}-heading`,
        );
        await expect(contents.getByRole("link").nth(i)).toHaveAttribute("href", `#${id}`);
      }
    });

    // What was trained from scratch and what was fine-tuned from pretrained
    // weights is said in words.
    test("says which models were trained from scratch and which fine-tuned", async ({ page }) => {
      await page.goto(locale.path);
      for (const text of locale.training) {
        await expect(page.getByRole("main")).toContainText(text);
      }
    });

    // The three ResNet18 runs, each with its test accuracy on a line of its
    // own, after the small CNN trained from scratch.
    test("classification: the CNN on CIFAR-100 and three ResNet18 runs", async ({ page }) => {
      await page.goto(locale.path);
      const section = page.locator("section#classification");
      for (const text of locale.cifar100) await expect(section).toContainText(text);
      await expect(section).toContainText("Oxford-IIIT Pet");
      const runs = section.locator("dl > div");
      await expect(runs.locator("dt")).toHaveText(["Feature extraction", "Fine-tuning", "Augmentation"]);
      for (const term of await runs.locator("dt").all()) {
        await expect(term).toHaveAttribute("lang", "en");
      }
      for (const [i, line] of locale.pets.entries()) {
        await expect(runs.nth(i).locator("dd > p").last()).toHaveText(line);
      }
    });

    // The comparison: what the gap and the time were in this setup, and that
    // they do not rank the architectures.
    test("model comparison: one setup, its gap, its time and its limit", async ({ page }) => {
      await page.goto(locale.path);
      const section = page.locator("section#comparison");
      for (const text of [...models, "CIFAR-10", "ImageNet"]) {
        await expect(section).toContainText(text);
      }
      for (const text of locale.comparison) await expect(section).toContainText(text);
    });

    test("segmentation and detection, with what was not measured", async ({ page }) => {
      await page.goto(locale.path);
      const section = page.locator("section#segmentation-detection");
      const rows = section.locator("dl > div");
      await expect(rows.locator("dt")).toHaveText(["Segmentation", "Detection"]);
      await expect(rows.nth(0).locator("dd > p").last()).toHaveText(locale.segmentation);
      await expect(rows.nth(1).locator("dd > p").last()).toHaveText(locale.detection);
      for (const text of ["U-Net", "SBD", "Faster R-CNN", "COCO", "VOC 2007"]) {
        await expect(section).toContainText(text);
      }
      for (const text of [...locale.unmeasured, ...locale.counts]) {
        await expect(section).toContainText(text);
      }
    });

    test("what I learned names the limits of the runs", async ({ page }) => {
      await page.goto(locale.path);
      const section = page.locator("section#lessons");
      for (const text of locale.runs) await expect(section).toContainText(text);
    });

    // One visual: the comparison as a table, named by its caption and
    // described by its note. No images.
    test("one figure, a table named by its caption", async ({ page }) => {
      await page.goto(locale.path);
      const figures = page.getByRole("main").getByRole("figure");
      await expect(figures).toHaveCount(1);
      await expect(figures).toHaveAccessibleName(locale.figure);
      await expect(figures).toHaveAttribute("aria-describedby", "results-note");
      await expect(page.getByRole("main").locator("img, picture, canvas, video, svg image")).toHaveCount(
        0,
      );

      const table = figures.getByRole("table");
      await expect(table.getByRole("columnheader")).toHaveText(locale.columns);
      const rows = table.locator("tbody tr");
      await expect(rows.getByRole("rowheader")).toHaveText(models);
      for (const header of await rows.getByRole("rowheader").all()) {
        await expect(header).toHaveAttribute("lang", "en");
      }
      for (const [i, values] of locale.table.entries()) {
        await expect(rows.nth(i).getByRole("cell")).toHaveText(values);
      }
    });

    test("no unsupported claims and no private details", async ({ page }) => {
      await page.goto(locale.path);
      const text = await page.evaluate(() =>
        [
          document.querySelector("main")!.innerText,
          document.title,
          ...[...document.querySelectorAll("meta[content]")].map((m) => m.getAttribute("content")),
          ...[...document.querySelectorAll('script[type="application/ld+json"]')].map(
            (s) => s.textContent,
          ),
        ].join("\n"),
      );
      expect(fold(text)).not.toMatch(unsupportedClaims);
      for (const pattern of privateDetails) expect(fold(text)).not.toMatch(pattern);
      expect(text).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
      const markup = await page.content();
      for (const pattern of privateDetails) expect(markup).not.toMatch(pattern);
    });

    // A compact technical case study: a two to three minute read, shorter
    // than the CUDA one.
    test("the article is short", async ({ page }) => {
      await page.goto(locale.path);
      const text = await page.locator("article").evaluate((article) => {
        const clone = article.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("nav, script, a").forEach((node) => node.remove());
        return clone.textContent!;
      });
      expect(words(text)).toBeGreaterThanOrEqual(350);
      expect(words(text)).toBeLessThanOrEqual(locale.lang === "en" ? 600 : 660);
    });

    // One movement per section, once. The table comes in with its section,
    // as one block, and no number in it counts up.
    test("sections come in once as they are reached", async ({ page }) => {
      await page.goto(locale.path);
      const items = page.locator("main [data-reveal]");
      const states = () =>
        items.evaluateAll((els) =>
          els.map((el) => ({
            state: (el as HTMLElement).dataset.revealState ?? "none",
            opacity: getComputedStyle(el).opacity,
          })),
        );
      await expect(items).toHaveCount(sections.length);
      await expect(page.locator("main figure [data-reveal], main figure[data-reveal]")).toHaveCount(
        0,
      );
      await expect
        .poll(async () => (await states()).filter((s) => s.state === "pending").length)
        .toBeGreaterThan(0);
      const height = (await page.getByRole("main").boundingBox())!.height;
      const figureText = await page.getByRole("figure").textContent();

      for (const item of await items.all()) {
        await item.evaluate((el) => el.scrollIntoView({ block: "center" }));
        await expect(item).not.toHaveAttribute("data-reveal-state", "pending");
      }
      await expect
        .poll(async () => (await states()).every((s) => s.state !== "pending" && s.opacity === "1"))
        .toBe(true);
      expect((await page.getByRole("main").boundingBox())!.height).toBe(height);
      expect(await page.getByRole("figure").textContent()).toBe(figureText);

      await page.evaluate(() => window.scrollTo(0, 0));
      expect((await states()).every((s) => s.state !== "pending" && s.opacity === "1")).toBe(true);
    });

    test("with reduced motion everything is shown at once", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(locale.path);
      await page.waitForLoadState("networkidle");
      const styles = await page.locator("main [data-reveal], main [data-enter]").evaluateAll((els) =>
        els.map((el) => ({
          state: (el as HTMLElement).dataset.revealState ?? "none",
          opacity: getComputedStyle(el).opacity,
        })),
      );
      expect(styles.length).toBeGreaterThan(sections.length);
      for (const style of styles) expect(style).toEqual({ state: "none", opacity: "1" });
    });

    test.describe("without JavaScript", () => {
      test.use({ javaScriptEnabled: false });

      test("the whole page is there and visible", async ({ page }) => {
        await page.goto(locale.path);
        await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveCount(
          sections.length,
        );
        await expect(page.getByRole("main").getByRole("figure")).toHaveCount(1);
        await expect(page.getByRole("figure")).toContainText(locale.table[0][1]);
        const opacities = () =>
          page
            .locator("main [data-reveal], main [data-enter]")
            .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
        // The entrance is CSS only and ends on its own.
        await expect.poll(async () => (await opacities()).every((o) => o === "1")).toBe(true);
      });
    });

    // Phones, and a 1280px window at 200% zoom (640 CSS pixels).
    for (const [width, height] of [
      [320, 844],
      [390, 844],
      [640, 400],
    ]) {
      test(`fits ${width}px`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.setViewportSize({ width, height });
        await page.goto(locale.path);
        const layout = await page.evaluate(() => {
          const viewport = document.documentElement.clientWidth;
          const rights = [...document.querySelectorAll("main *")].map(
            (el) => el.getBoundingClientRect().right,
          );
          const measured = [...document.querySelectorAll("main figure, main dd > p:last-child")];
          const sizes = measured
            .flatMap((el) => [...el.querySelectorAll("p, span, th, td, figcaption")])
            .filter((el) => el.textContent!.trim())
            .map((el) => parseFloat(getComputedStyle(el).fontSize));
          return {
            page: document.documentElement.scrollWidth - viewport,
            right: Math.max(...rights) - viewport,
            smallest: Math.min(...sizes),
          };
        });
        expect(layout.page).toBeLessThanOrEqual(0);
        expect(layout.right).toBeLessThanOrEqual(0);
        // The figures and their labels are never shrunk to fit.
        expect(layout.smallest).toBeGreaterThanOrEqual(11);
      });
    }
  });
}
