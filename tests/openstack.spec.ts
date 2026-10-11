import { test, expect, html, siteOrigin } from "./fixtures";

const sections = ["environment", "openstack", "network", "debugging", "application", "reflection"];

// The OpenStack services the tenant was built with. Proper names, the same in
// both languages.
const services = ["Keystone", "Glance", "Nova", "Neutron"];

// What the figure names, from the project's report and notes: the host's
// interface and bridge, the two things added on the host, and the instances.
const components = [
  "ens4",
  "br-ex",
  "iptables",
  "brex-setup.service",
  "vm-app",
  "vm-db",
  "PostgreSQL 14",
  "MASQUERADE",
];

// Claims the project cannot support: an individual lab on one VM, never a
// service anyone used. Nor anything OpenStack offers that the project did not
// deploy, or the public exposure it never had. Compared after fold().
const unsupportedClaims =
  /production|παραγωγη|enterprise|company|εταιρ|client|customer|πελατ|real[- ]?time|high availability|υψηλη διαθεσιμοτητα|multi[- ]?node|kubernetes|cinder|swift|octavia|load balanc|ceph|kolla|uptime|\d\s*%|cutting-edge|seamless|\brobust|public internet|publicly|δημοσια προσβασιμ/;

// Details that stay private: addresses of any kind, project IDs (32 hex
// digits), student numbers (seven digits from 20, never spelled out here),
// the university mail domain, the course code, names of the cloud projects
// and VMs (all start with "devstack-") and any password written out.
const privateDetails = [
  /\b\d{1,3}(\.\d{1,3}){3}\b/,
  /\b[0-9a-f]{32}\b/,
  /\b(it)?20\d{5}\b/,
  /hua\.gr/,
  /\bdit\s?\d{3}\b/,
  /devstack-/,
  /passw(or)?d\s*[:=]|κωδικ\w*\s*[:=]/,
  /tel:/,
];

const fold = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("el");

const words = (text: string) => text.match(/[\p{L}\p{N}][\p{L}\p{N}’'\-./]*/gu)?.length ?? 0;

const locales = [
  {
    path: "/work/openstack",
    home: "/",
    lang: "en",
    title: "A Private Cloud Inside One Google Cloud VM",
    metaTitle: "OpenStack: A Private Cloud Inside One Google Cloud VM",
    author: "Konstantinos Papadogiannis",
    kind: "Individual academic project",
    period: "June 2026",
    back: "More work",
    backEnd: "Back to the projects",
    contents: "Contents",
    figure: "The layers an instance’s traffic crosses, inside one Google Cloud VM",
    added: "Added on the host:",
    outbound: ["Instance", "Neutron router", "br-ex", "ens4", "Google Cloud"],
  },
  {
    path: "/el/work/openstack",
    home: "/el",
    lang: "el",
    title: "Ένα ιδιωτικό cloud μέσα σε ένα VM του Google Cloud",
    metaTitle: "OpenStack: Ένα ιδιωτικό cloud μέσα σε ένα VM του Google Cloud",
    author: "Κωνσταντίνος Παπαδογιάννης",
    kind: "Ατομικό ακαδημαϊκό έργο",
    period: "Ιούνιος 2026",
    back: "Περισσότερα έργα",
    backEnd: "Πίσω στα έργα",
    contents: "Περιεχόμενα",
    figure: "Τα επίπεδα που διασχίζει η κίνηση ενός instance, μέσα σε ένα VM του Google Cloud",
    added: "Προστέθηκε στον host:",
    outbound: ["Instance", "Router του Neutron", "br-ex", "ens4", "Google Cloud"],
  },
] as const;

for (const locale of locales) {
  test.describe(`OpenStack case study (${locale.lang})`, () => {
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
        ["en", "/work/openstack"],
        ["el", "/el/work/openstack"],
        ["x-default", "/work/openstack"],
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
        author: { "@type": "Person", name: locale.author },
      });

      const duplicates = await page.evaluate(() => {
        const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
        return ids.filter((id, i) => ids.indexOf(id) !== i);
      });
      expect(duplicates).toEqual([]);
    });

    test("an individual academic project of 2026", async ({ page }) => {
      await page.goto(locale.path);
      const head = page.locator("article > header");
      const meta = head.locator("p").first();
      await expect(meta).toContainText(locale.kind);
      await expect(meta).toContainText("2026");
      await expect(head.locator("dl")).toContainText(locale.period);
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

    test("six sections, each in the contents list", async ({ page }) => {
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

    test("the components the project used are named", async ({ page }) => {
      await page.goto(locale.path);
      const layer = page.locator("section#openstack");
      for (const service of services) {
        await expect(layer.locator("dt", { hasText: service })).toHaveAttribute("lang", "en");
      }
      await expect(layer).toContainText("24 systemd units");
      const figure = page.getByRole("figure", { name: locale.figure });
      for (const name of components) await expect(figure).toContainText(name);
      const debugging = page.locator("section#debugging");
      for (const name of ["tcpdump", "MASQUERADE", "iptables-persistent", "brex-setup.service"]) {
        await expect(debugging).toContainText(name);
      }
    });

    test("one diagram, in text, named by its caption", async ({ page }) => {
      await page.goto(locale.path);
      const figures = page.getByRole("main").getByRole("figure");
      await expect(figures).toHaveCount(1);
      await expect(figures).toHaveAccessibleName(locale.figure);
      await expect(page.getByRole("main").locator("img, canvas, video")).toHaveCount(0);

      // What was added on the host is said in words, not only by the dashed
      // line, and the way out is described to assistive technology.
      await expect(figures.locator("div.border-dashed > p:first-child")).toHaveText([
        `${locale.added} iptables`,
        `${locale.added} brex-setup.service`,
      ]);
      await expect(figures).toHaveAttribute("aria-describedby", "network-paths");
      await expect(page.locator("#network-paths ol > li")).toHaveText([...locale.outbound]);
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
      // No address of any person in the case study itself.
      expect(text).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
      const markup = await page.content();
      for (const pattern of privateDetails.slice(2)) expect(markup).not.toMatch(pattern);
    });

    // A focused case study: three to five minutes to read.
    test("the article is short", async ({ page }) => {
      await page.goto(locale.path);
      const text = await page.locator("article").evaluate((article) => {
        const clone = article.cloneNode(true) as HTMLElement;
        clone.querySelectorAll("nav, script, a").forEach((node) => node.remove());
        return clone.textContent!;
      });
      expect(words(text)).toBeGreaterThanOrEqual(600);
      expect(words(text)).toBeLessThanOrEqual(locale.lang === "en" ? 900 : 1050);
    });

    // One movement per section, once: each section below the fold waits,
    // fades in as it is reached and stays. The diagram comes in with its
    // section, as one block.
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

      for (const item of await items.all()) {
        await item.evaluate((el) => el.scrollIntoView({ block: "center" }));
        await expect(item).not.toHaveAttribute("data-reveal-state", "pending");
      }
      await expect
        .poll(async () => (await states()).every((s) => s.state !== "pending" && s.opacity === "1"))
        .toBe(true);
      expect((await page.getByRole("main").boundingBox())!.height).toBe(height);

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
          const figure = document.querySelector("main figure")!;
          const sizes = [...figure.querySelectorAll("p, li, span")]
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
        // The diagram's text is never shrunk to fit.
        expect(layout.smallest).toBeGreaterThanOrEqual(11);
      });
    }
  });
}
