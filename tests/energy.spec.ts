import { test, expect, html, siteOrigin } from "./fixtures";

const sections = ["classification", "forecasting", "comparison"];

// The forecast figure: test RMSE in kWh, the baseline first. Model names are
// the same in both languages.
const forecast = [
  { name: "Persistence baseline", rmse: 6.84 },
  { name: "Random Forest", rmse: 5.59 },
  { name: "LSTM", rmse: 5.61 },
];

// Claims the project cannot support: one household, one chronological split,
// the models scored once on the test days. No model beats the others in
// general, the forecasters are level, deep learning is not ranked against
// anything, and nothing was deployed or published. The figures of the
// README and of earlier runs (about 99%, the validation scores, the LSTM's
// validation errors, ARIMA and Prophet) are not shown. Compared after fold().
const unsupportedClaims =
  /\bbeat|outperform|superior|υπερτερ|ανωτερ|ξεπερν|best model|καλυτερο μοντελο|the only model|το μονο μοντελο|deep learning|βαθια μαθηση|state[- ]of[- ]the[- ]art|highly accurate|cutting-edge|leverag|ai-powered|production|παραγωγ|deployed|real[- ]time|πραγματικο χρονο|publication|δημοσιευ|~\s*99|\b99\s*%|0[.,]99\b|89[.,]1|85[.,]6|97[.,]0|90[.,]1\b|87[.,]2|97[.,]1|5[.,]57|5[.,]43|13[.,]1[67]|12[.,]43/;

// Details that stay private: student numbers (seven digits from 20, never
// spelled out here), the university mail domain, a course code, the teaching
// staff, and the project's repository, files, notebooks and folders.
const privateDetails = [
  /\b(it)?20\d{5}\b/,
  /hua\.gr/,
  /\bdit\s?\d{3}\b/,
  /professor|καθηγητ|instructor|διδασκ/,
  /data_mining|\.ipynb|\.csv|colab\.research|drive\.google|\/home\/|επιφανεια/,
  /tel:/,
];

// The page says "team of two" and names no one else. (The teammate is named
// on the thesis page, so the name is in the site's messages, not on this page.)
const teammate = /zerv|ζερβ/;

const fold = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("el");

const words = (text: string) => text.match(/[\p{L}\p{N}][\p{L}\p{N}’'\-./]*/gu)?.length ?? 0;

const locales = [
  {
    path: "/work/energy-data-mining",
    home: "/",
    lang: "en",
    title: "Classifying and forecasting household energy use",
    metaTitle: "Energy Data Mining: Classifying and Forecasting Household Consumption",
    author: "Konstantinos Papadogiannis",
    kind: "Team academic project",
    period: "January 2026",
    team: "Team of two",
    context: ["Harokopio University of Athens", "Data Mining"],
    back: "More work",
    backEnd: "Back to projects",
    headings: [
      "Classification: high-consumption days",
      "Forecasting: the next day’s total",
      "What the comparison showed",
    ],
    split: ["27.15 kWh", "training days", "1,418 days", "60/20/20", "284 test days"],
    model: "Test set, 284 days",
    metrics: ["89.4%", "86.1%", "96.3%"],
    others: ["Random Forest (88.4%)", "logistic regression (86.6%)", "Only 36%", "score 64%"],
    forecasting: ["persistence", "5.68 kWh", "0.02 kWh", "5.56 kWh", "not seeded", "level"],
    caption: "Next-day forecast: test RMSE, lower is better",
    values: ["6.84 kWh", "5.59 kWh", "5.61 kWh"],
    marks: ["reference", "18% below the baseline", "18% below the baseline"],
    note: ["start at zero", "284 and 285 days"],
    comparison: ["between 5.56 and 5.68 kWh", "6.84 kWh", "ARIMA(1,1,1)", "Prophet", "not comparable"],
  },
  {
    path: "/el/work/energy-data-mining",
    home: "/el",
    lang: "el",
    title: "Classification και forecasting της κατανάλωσης ενός νοικοκυριού",
    metaTitle: "Εξόρυξη δεδομένων ενέργειας: classification και forecasting οικιακής κατανάλωσης",
    author: "Κωνσταντίνος Παπαδογιάννης",
    kind: "Ομαδικό ακαδημαϊκό έργο",
    period: "Ιανουάριος 2026",
    team: "Ομάδα δύο ατόμων",
    context: ["Χαροκόπειο Πανεπιστήμιο", "Εξόρυξη Δεδομένων"],
    back: "Περισσότερα έργα",
    backEnd: "Πίσω στα έργα",
    headings: [
      "Classification: ημέρες υψηλής κατανάλωσης",
      "Forecasting: η κατανάλωση της επόμενης ημέρας",
      "Τι έδειξε η σύγκριση",
    ],
    split: ["27,15 kWh", "ημερών εκπαίδευσης", "1.418 ημέρες", "60/20/20", "284 ημέρες του test set"],
    model: "Test set, 284 ημέρες",
    metrics: ["89,4%", "86,1%", "96,3%"],
    others: ["Random Forest (88,4%)", "logistic regression (86,6%)", "Μόνο το 36%", "ήδη 64%"],
    forecasting: ["persistence", "5,68 kWh", "0,02 kWh", "5,56 kWh", "σταθερό seed", "ισάξια"],
    caption: "Forecasting επόμενης ημέρας: test RMSE, όσο μικρότερο τόσο καλύτερα",
    values: ["6,84 kWh", "5,59 kWh", "5,61 kWh"],
    marks: ["σημείο αναφοράς", "18% κάτω από το baseline", "18% κάτω από το baseline"],
    note: ["από το μηδέν", "284 και 285 ημέρες"],
    comparison: ["μεταξύ 5,56 και 5,68 kWh", "6,84 kWh", "ARIMA(1,1,1)", "Prophet", "δεν είναι συγκρίσιμα"],
  },
] as const;

for (const locale of locales) {
  test.describe(`Energy data mining case study (${locale.lang})`, () => {
    test("title, metadata and structured data", async ({ page }) => {
      await page.goto(locale.path);
      await expect(html(page)).toHaveAttribute("lang", locale.lang);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale.title);
      await expect(page).toHaveTitle(`${locale.metaTitle} — ${locale.author}`);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${siteOrigin}${locale.path}`,
      );
      for (const [hreflang, path] of [
        ["en", "/work/energy-data-mining"],
        ["el", "/el/work/energy-data-mining"],
        ["x-default", "/work/energy-data-mining"],
      ]) {
        await expect(
          page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`),
        ).toHaveAttribute("href", `${siteOrigin}${path}`);
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
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        `${siteOrigin}${locale.path}`,
      );

      const ld = JSON.parse(
        (await page.locator('script[type="application/ld+json"]').textContent())!,
      );
      expect(ld).toMatchObject({
        "@type": "CreativeWork",
        name: locale.metaTitle,
        url: `${siteOrigin}${locale.path}`,
        inLanguage: locale.lang,
        author: {
          "@type": "Person",
          "@id": `${siteOrigin}/#person`,
          name: "Konstantinos Papadogiannis",
          url: `${siteOrigin}/`,
        },
      });
      // The second member is not named on this page, nor in its data.
      expect(ld).not.toHaveProperty("contributor");

      const duplicates = await page.evaluate(() => {
        const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
        return ids.filter((id, i) => ids.indexOf(id) !== i);
      });
      expect(duplicates).toEqual([]);
    });

    test("a team academic project of two, January 2026", async ({ page }) => {
      await page.goto(locale.path);
      const head = page.locator("article > header");
      const meta = head.locator("p").first();
      await expect(meta).toContainText(locale.kind);
      await expect(meta).toContainText("2026");
      const facts = head.locator("dl");
      for (const text of [locale.period, locale.team, ...locale.context, "scikit-learn"]) {
        await expect(facts).toContainText(text);
      }
    });

    test("both links back go to the other projects, and nothing leads off the site", async ({
      page,
    }) => {
      await page.goto(locale.path);
      const main = page.getByRole("main");
      await expect(main.locator('a[href^="http"]')).toHaveCount(0);
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

    test("three sections in one column, without a contents list", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(locale.path);
      await expect(page.getByRole("main").getByRole("navigation")).toHaveCount(0);
      await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveText([
        ...locale.headings,
      ]);
      for (const id of sections) {
        await expect(page.locator(`section#${id}`)).toHaveAttribute(
          "aria-labelledby",
          `${id}-heading`,
        );
      }
    });

    // The target, the threshold and the split, then one model's three test
    // metrics, each under its own name: accuracy and ROC-AUC are two figures.
    test("classification: target, split and the test metrics by name", async ({ page }) => {
      await page.goto(locale.path);
      const section = page.locator("section#classification");
      for (const text of locale.split) await expect(section).toContainText(text);

      await expect(section).toContainText("Gradient Boosting");
      await expect(section.getByText(locale.model, { exact: true })).toBeVisible();
      const metrics = section.locator("dl > div");
      await expect(metrics.locator("dt")).toHaveText(["Accuracy", "F1", "ROC-AUC"]);
      await expect(metrics.locator("dd")).toHaveText([...locale.metrics]);
      for (const term of await metrics.locator("dt").all()) {
        await expect(term).toHaveAttribute("lang", "en");
      }

      // The other models, and what the class balance means for accuracy.
      for (const text of locale.others) await expect(section).toContainText(text);
    });

    // The target and the reference, how the models were scored, the gap
    // between the two forecasters and why it is not read as a ranking.
    test("forecasting: against persistence, with the two forecasters read as level", async ({
      page,
    }) => {
      await page.goto(locale.path);
      const section = page.locator("section#forecasting");
      for (const text of [...locale.forecasting, "Ridge", "LSTM", "RMSE"]) {
        await expect(section).toContainText(text);
      }
    });

    test("the comparison: the range, the baseline and what was left out", async ({ page }) => {
      await page.goto(locale.path);
      const section = page.locator("section#comparison");
      for (const text of locale.comparison) await expect(section).toContainText(text);
    });

    // One visual: three bars on one scale from zero, the baseline the full
    // width. Each row names the model and writes its value and its distance
    // from the baseline, so nothing depends on the bars or their colour.
    test("one figure: test RMSE beside the baseline, readable without the bars", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(locale.path);
      const main = page.getByRole("main");
      const figure = main.getByRole("figure");
      await expect(figure).toHaveCount(1);
      await expect(figure).toHaveAccessibleName(locale.caption);
      await expect(figure).toHaveAttribute("aria-describedby", "forecast-note");
      for (const text of locale.note) await expect(page.locator("#forecast-note")).toContainText(text);
      await expect(main.locator("img, picture, canvas, video, svg image")).toHaveCount(0);
      await expect(figure.locator("svg")).toHaveCount(0);

      const rows = figure.getByRole("listitem");
      await expect(rows).toHaveCount(forecast.length);
      for (const [i, { name }] of forecast.entries()) {
        const row = rows.nth(i);
        await expect(row.locator('[lang="en"]')).toHaveText(name);
        await expect(row).toContainText(locale.values[i]);
        await expect(row).toContainText(locale.marks[i]);
        await expect(row.locator(".font-mono")).toHaveText(locale.values[i]);
      }

      // The bars are for the eye only, and drawn to scale.
      const bars = figure.locator('[aria-hidden="true"]');
      await expect(bars).toHaveCount(forecast.length);
      const widths = await bars.evaluateAll((els) =>
        els.map((el) => ({
          track: el.getBoundingClientRect().width,
          bar: el.firstElementChild!.getBoundingClientRect().width,
        })),
      );
      for (const [i, { rmse }] of forecast.entries()) {
        expect(widths[i].bar / widths[i].track).toBeCloseTo(rmse / forecast[0].rmse, 2);
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
      expect(fold(text)).not.toMatch(teammate);
      for (const pattern of privateDetails) expect(fold(text)).not.toMatch(pattern);
      expect(text).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
      const markup = await page.content();
      for (const pattern of privateDetails) expect(markup).not.toMatch(pattern);
    });

    // The most compact of the case studies: a two to three minute read.
    test("the article is short", async ({ page }) => {
      await page.goto(locale.path);
      const text = await page.locator("article").evaluate((article) => {
        const clone = article.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("nav, script, a").forEach((node) => node.remove());
        return clone.textContent!;
      });
      expect(words(text)).toBeGreaterThanOrEqual(350);
      expect(words(text)).toBeLessThanOrEqual(locale.lang === "en" ? 550 : 630);
    });

    // One movement per section, once. The figure comes in with its section,
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
        await expect(page.getByRole("figure")).toContainText(locale.values[1]);
        await expect(page.locator("section#classification dl")).toContainText(locale.metrics[2]);
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
          const sizes = [...document.querySelectorAll("main figure, main section dl")]
            .flatMap((el) => [...el.querySelectorAll("p, span, dt, dd, figcaption")])
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
