import { test, expect, html, siteOrigin } from "./fixtures";

const sections = ["baseline", "bottleneck", "optimisation", "result"];

// The kernels as named in the source, in the order they were written.
const kernels = ["naive_matmul", "tiled_matmul", "register_blocked_matmul"];

// The measured times at N = 4096, in seconds (src/config/work.ts). The bars
// are drawn on the first kernel's time.
const seconds = [0.305967, 0.190668, 0.086069];

// Claims the project cannot support: it timed three kernels, once each, and
// never profiled them. No bandwidth, occupancy, FLOPS, cache figures,
// utilisation or averages; no cause for the first launch's time; no
// production, industry, publication or new algorithm; no hype. Compared after
// fold(). "Profile" is not on the list: the page says it did not profile.
const unsupportedClaims =
  /flops|gflop|tflop|bandwidth|ευρος ζωνης|occupancy|cache|κρυφη μνημη|\bl2\b|latency|hit rate|utili[sz]|throughput|nsight|nvprof|\bjit\b|just-in-time|averag|μεσος ορος|μεσο ορο|production|παραγωγ|industry|βιομηχαν|publication|δημοσιευ|novel|state[- ]of[- ]the[- ]art|blazing|massive|extreme|breakthrough|revolutionary|highly optimi|cutting-edge|leverag|\d\s*%/;

// Details that stay private: student numbers (seven digits from 20, never
// spelled out here), the university mail domain, a course code, the teaching
// staff, the names of the project's files, notebook and folder.
const privateDetails = [
  /\b(it)?20\d{5}\b/,
  /hua\.gr/,
  /\bdit\s?\d{3}\b/,
  /professor|καθηγητ|instructor|διδασκ/,
  /deliverable\s?\d|matrix_mul\.cu|\.ipynb|colab\.research/,
  /_2η_/,
  /tel:/,
];

const fold = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("el");

const words = (text: string) => text.match(/[\p{L}\p{N}][\p{L}\p{N}’'\-./]*/gu)?.length ?? 0;

const locales = [
  {
    path: "/work/cuda",
    home: "/",
    lang: "en",
    title: "From 306 ms to 86 ms",
    metaTitle: "CUDA: Matrix Multiplication from 306 ms to 86 ms",
    author: "Konstantinos Papadogiannis",
    kind: "Individual academic project",
    period: "June 2026",
    platform: "NVIDIA Tesla T4",
    back: "More work",
    backEnd: "Back to projects",
    contents: "Contents",
    figure: "Kernel time at N = 4096 on an NVIDIA T4",
    times: ["306.0 ms", "190.7 ms", "86.1 ms"],
    ratios: ["baseline", "1.6× speedup", "3.6× speedup"],
    measured: [/306\.0 ms\s+to\s+190\.7 ms\s+1\.6× speedup/, /190\.7 ms\s+to\s+86\.1 ms\s+2\.2× speedup/],
    loads: "8,192",
    result: "A 3.6× speedup",
    range: "3.2× to 5.8×",
    checksum: ["same checksum", "not an element-by-element check"],
  },
  {
    path: "/el/work/cuda",
    home: "/el",
    lang: "el",
    title: "Από 306 ms σε 86 ms",
    metaTitle: "CUDA: Πολλαπλασιασμός πινάκων από 306 ms σε 86 ms",
    author: "Κωνσταντίνος Παπαδογιάννης",
    kind: "Ατομικό ακαδημαϊκό έργο",
    period: "Ιούνιος 2026",
    platform: "NVIDIA Tesla T4",
    back: "Περισσότερα έργα",
    backEnd: "Πίσω στα έργα",
    contents: "Περιεχόμενα",
    figure: "Χρόνος kernel για N = 4096 σε NVIDIA T4",
    times: ["306,0 ms", "190,7 ms", "86,1 ms"],
    ratios: ["αφετηρία", "επιτάχυνση 1,6×", "επιτάχυνση 3,6×"],
    measured: [
      /306,0 ms\s+σε\s+190,7 ms\s+επιτάχυνση 1,6×/,
      /190,7 ms\s+σε\s+86,1 ms\s+επιτάχυνση 2,2×/,
    ],
    loads: "8.192",
    result: "Επιτάχυνση 3,6×",
    range: "3,2× έως 5,8×",
    checksum: ["το ίδιο checksum", "όχι ότι ελέγχθηκαν στοιχείο προς στοιχείο"],
  },
] as const;

for (const locale of locales) {
  test.describe(`CUDA case study (${locale.lang})`, () => {
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
        ["en", "/work/cuda"],
        ["el", "/el/work/cuda"],
        ["x-default", "/work/cuda"],
      ]) {
        await expect(
          page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`),
        ).toHaveAttribute("href", `${siteOrigin}${path}`);
      }
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{80,}/);
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
        url: `${siteOrigin}${locale.path}`,
        inLanguage: locale.lang,
        author: {
          "@type": "Person",
          "@id": `${siteOrigin}/#person`,
          name: "Konstantinos Papadogiannis",
          url: `${siteOrigin}/`,
        },
      });

      const duplicates = await page.evaluate(() => {
        const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
        return ids.filter((id, i) => ids.indexOf(id) !== i);
      });
      expect(duplicates).toEqual([]);
    });

    test("an individual academic project of 2026, on a T4", async ({ page }) => {
      await page.goto(locale.path);
      const head = page.locator("article > header");
      const meta = head.locator("p").first();
      await expect(meta).toContainText(locale.kind);
      await expect(meta).toContainText("2026");
      await expect(head.locator("dl")).toContainText(locale.period);
      await expect(head.locator("dl")).toContainText(locale.platform);
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

    // What the page says about the method is what the program did: one timed
    // launch, copies excluded, the same inputs, a checksum. Nothing more.
    test("the workload, the timing and the reasoning about loads", async ({ page }) => {
      await page.goto(locale.path);
      const baseline = page.locator("section#baseline");
      await expect(baseline).toContainText(/N\s=\s4096/);
      for (const name of ["gettimeofday", "cudaDeviceSynchronize"]) {
        await expect(baseline.locator("code", { hasText: name })).toHaveCount(1);
      }
      await expect(page.locator("section#bottleneck")).toContainText(locale.loads);
    });

    // Each change with the times before and after it, on a line of its own
    // apart from the explanation.
    test("tiling and register blocking, each with its measured times", async ({ page }) => {
      await page.goto(locale.path);
      const changes = page.locator("section#optimisation dl > div");
      await expect(changes.locator("dt")).toHaveText(["Tiling", "Register blocking"]);
      for (const term of await changes.locator("dt").all()) {
        await expect(term).toHaveAttribute("lang", "en");
      }
      for (const [i, line] of locale.measured.entries()) {
        await expect(changes.nth(i).locator("dd > p").last()).toHaveText(line);
      }
      await expect(changes.nth(0)).toContainText("shared memory");
      await expect(changes.nth(1)).toContainText("registers");
    });

    test("the result, its range and what the checksum shows", async ({ page }) => {
      await page.goto(locale.path);
      const result = page.locator("section#result");
      await expect(result.getByRole("heading", { level: 2 })).toContainText(locale.result);
      await expect(result).toContainText(locale.range);
      for (const text of locale.checksum) await expect(result).toContainText(text);
      // A ratio is a speedup, never "× faster".
      await expect(page.getByRole("main")).not.toContainText(/×\s*(faster|ταχύτερ)/);
    });

    test("one figure, in text, named by its caption", async ({ page }) => {
      await page.goto(locale.path);
      const figures = page.getByRole("main").getByRole("figure");
      await expect(figures).toHaveCount(1);
      await expect(figures).toHaveAccessibleName(locale.figure);
      await expect(figures).toHaveAttribute("aria-describedby", "benchmark-note");
      await expect(page.getByRole("main").locator("img, canvas, video, svg image")).toHaveCount(0);

      const rows = figures.locator("ol > li");
      await expect(rows).toHaveCount(kernels.length);
      await expect(rows.locator('[lang="en"]')).toHaveText(kernels);
      for (const [i, row] of (await rows.all()).entries()) {
        await expect(row).toContainText(locale.times[i]);
        await expect(row).toContainText(locale.ratios[i]);
      }

      // The bars are for the eye only, on one scale: the first kernel's time is
      // the full width.
      const bars = rows.locator('[aria-hidden="true"]');
      await expect(bars).toHaveCount(kernels.length);
      const widths = await bars.evaluateAll((els) =>
        els.map((el) => parseFloat((el.firstElementChild as HTMLElement).style.width)),
      );
      for (const [i, width] of widths.entries()) {
        expect(width).toBeCloseTo((seconds[i] / seconds[0]) * 100, 3);
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

    // A focused technical case study: two to four minutes to read.
    test("the article is short", async ({ page }) => {
      await page.goto(locale.path);
      const text = await page.locator("article").evaluate((article) => {
        const clone = article.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("nav, script, a").forEach((node) => node.remove());
        return clone.textContent!;
      });
      expect(words(text)).toBeGreaterThanOrEqual(500);
      expect(words(text)).toBeLessThanOrEqual(locale.lang === "en" ? 700 : 820);
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
        await expect(page.getByRole("figure")).toContainText(locale.times[2]);
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
          const measured = [
            ...document.querySelectorAll("main figure, #optimisation dd > p:last-child"),
          ];
          const sizes = measured
            .flatMap((el) => [...el.querySelectorAll("p, li, span")])
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
