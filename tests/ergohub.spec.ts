import { test, expect, html, siteOrigin } from "./fixtures";

const anastasiaLinkedin = "https://www.linkedin.com/in/anastasiazervas";

const sections = [
  "overview",
  "application",
  "containers",
  "pipeline",
  "kubernetes",
  "challenges",
  "learned",
];

// The tools named on the page, in each group of the overview. Names of
// tools are the same in both languages.
const stack = [
  "Java 21",
  "Spring Boot 3",
  "Spring Security",
  "JWT",
  "React",
  "Redux Toolkit",
  "JUnit",
  "Jest",
  "PostgreSQL",
  "Spring Data JPA",
  "MinIO",
  "Docker",
  "Jenkins",
  "Ansible",
  "Azure Container Registry",
  "AKS",
  "NGINX Ingress",
  "cert-manager",
  "Let’s Encrypt TLS",
];

// The six Jenkinsfiles in the repository: one for the API and one for the
// front end, for each way to deploy.
const jenkinsfiles = [
  "Jenkinsfile-backend",
  "Jenkinsfile-frontend",
  "Jenkinsfile-backend-ansible",
  "Jenkinsfile-frontend-ansible",
  "Jenkinsfile-backend-minikube",
  "Jenkinsfile-frontend-minikube",
];

// The Deployments in the namespace, as named in the manifests.
const workloads = ["frontend", "backend", "postgres", "minio", "mailhog"];

// Claims the project cannot support: sales words, figures for a service
// that never ran as one, and features the code does not have. Chat exists,
// but it polls the API every few seconds, so nothing is real-time. Compared
// after fold(). The page may say that something is absent ("no Helm chart").
const unsupportedClaims =
  /production[- ]?(ready|grade)|enterprise|highly scalable|\brobust|cutting-edge|seamless|revolutionary|\d\s*%|\bsla\b|\d[\d,. ]*\s*(users|χρηστες)|live demo|rs256|react 18|payment|πληρωμ|rating|real[- ]?time|πραγματικο χρονο|websocket|password reset|επαναφορα κωδικου|\bscore/;

// Details that stay private or out of date: any year before 2000, student
// numbers (seven digits from 20, never spelled out here), the university mail
// domain, the hosts the course deployment used and the public repository,
// which is not linked yet.
const privateDetails = [
  /\b19\d{2}\b/,
  /\b(it)?20\d{5}\b/,
  /hua\.gr/,
  /duckdns/,
  /cloud-native-freelance-platform/,
  /tel:/,
];

const fold = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("el");

const locales = [
  {
    path: "/work/ergohub",
    home: "/",
    lang: "en",
    title: "From Application Code to a Kubernetes Cluster",
    metaTitle: "ErgoHub: From Application Code to a Kubernetes Cluster",
    author: "Konstantinos Papadogiannis",
    period: "February–July 2025",
    team: "Team of two, with Anastasia Zerva",
    back: "More work",
    backEnd: "Back to the projects",
    contents: "Contents",
    six: "six Jenkinsfiles",
    figures: [
      "Two paths through the project",
      "A project, from posting to completion",
      "Stages of the two kubectl pipelines, as named in their Jenkinsfiles",
      "The freelance namespace on Azure Kubernetes Service",
    ],
  },
  {
    path: "/el/work/ergohub",
    home: "/el",
    lang: "el",
    title: "Από τον κώδικα της εφαρμογής σε ένα Kubernetes cluster",
    metaTitle: "ErgoHub: Από τον κώδικα της εφαρμογής σε ένα Kubernetes cluster",
    author: "Κωνσταντίνος Παπαδογιάννης",
    period: "Φεβρουάριος–Ιούλιος 2025",
    team: "Ομάδα δύο ατόμων, με την Αναστασία Ζέρβα",
    back: "Περισσότερα έργα",
    backEnd: "Πίσω στα έργα",
    contents: "Περιεχόμενα",
    six: "έξι Jenkinsfiles",
    figures: [
      "Δύο διαδρομές μέσα στο έργο",
      "Ένα έργο, από την ανάρτηση ως την ολοκλήρωση",
      "Τα στάδια των δύο pipelines με kubectl, όπως ονομάζονται στα Jenkinsfiles",
      "Το namespace freelance στο Azure Kubernetes Service",
    ],
  },
] as const;

for (const locale of locales) {
  test.describe(`ErgoHub case study (${locale.lang})`, () => {
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
        ["en", "/work/ergohub"],
        ["el", "/el/work/ergohub"],
        ["x-default", "/work/ergohub"],
      ]) {
        await expect(
          page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`),
        ).toHaveAttribute("href", `${siteOrigin}${path}`);
      }
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
        contributor: {
          "@type": "Person",
          name: "Anastasia Zerva",
          sameAs: "https://www.linkedin.com/in/anastasiazervas",
        },
      });

      const duplicates = await page.evaluate(() => {
        const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
        return ids.filter((id, i) => ids.indexOf(id) !== i);
      });
      expect(duplicates).toEqual([]);
    });

    test("an academic project of 2025, by a team of two", async ({ page }) => {
      await page.goto(locale.path);
      const head = page.locator("article > header");
      await expect(head.locator("p").first()).toContainText("2025");
      const facts = head.locator("dl");
      await expect(facts).toContainText(locale.period);
      await expect(facts).toContainText(locale.team);
    });

    test("the existing team attribution links only Anastasia Zerva's name", async ({ page }) => {
      await page.goto(locale.path);
      const name = locale.lang === "en" ? "Anastasia Zerva" : "Αναστασία Ζέρβα";
      const link = page.locator("section#overview").getByRole("link", { name, exact: true });
      await expect(link).toHaveAttribute("href", anastasiaLinkedin);
      await expect(link).toHaveText(name);
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

    test("seven sections, each in the contents list", async ({ page }) => {
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

    test("every tool in the stack is named", async ({ page }) => {
      await page.goto(locale.path);
      const overview = page.locator("section#overview");
      for (const item of stack) await expect(overview).toContainText(item);
    });

    test("six Jenkinsfiles, three ways to deploy", async ({ page }) => {
      await page.goto(locale.path);
      const pipeline = page.locator("section#pipeline");
      await expect(pipeline).toContainText(locale.six);
      for (const file of jenkinsfiles) {
        await expect(pipeline.getByText(file, { exact: true })).toHaveCount(1);
      }
      // Stage numbers run on across the phases of each pipeline.
      const stages = page.getByRole("figure", { name: locale.figures[2] });
      const starts = await stages
        .locator("ol")
        .evaluateAll((lists) => lists.map((list) => list.getAttribute("start")));
      expect(starts).toEqual(["1", "5", "7", "1", "8", "10"]);
    });

    test("the cluster figure lists the five Deployments", async ({ page }) => {
      await page.goto(locale.path);
      const cluster = page.getByRole("figure", { name: locale.figures[3] });
      const names = cluster.locator("ul > li > div:first-child > p:first-child");
      await expect(names).toHaveText(workloads);
    });

    test("diagrams are text, each named by its caption", async ({ page }) => {
      await page.goto(locale.path);
      const figures = page.getByRole("main").getByRole("figure");
      await expect(figures).toHaveCount(locale.figures.length);
      for (const [i, name] of locale.figures.entries()) {
        await expect(figures.nth(i)).toHaveAccessibleName(name);
      }
      await expect(page.getByRole("main").locator("img, canvas, video")).toHaveCount(0);
    });

    test("no unsupported claims and no private details", async ({ page }) => {
      await page.goto(locale.path);
      const text = await page.evaluate(() =>
        [
          document.body.innerText,
          document.title,
          ...[...document.querySelectorAll("meta[content]")].map((m) => m.getAttribute("content")),
          ...[...document.querySelectorAll('script[type="application/ld+json"]')].map(
            (s) => s.textContent,
          ),
        ].join("\n"),
      );
      expect(fold(text)).not.toMatch(unsupportedClaims);
      for (const pattern of privateDetails) expect(fold(text)).not.toMatch(pattern);
      const markup = await page.content();
      for (const pattern of privateDetails.slice(1)) expect(markup).not.toMatch(pattern);
      // The work of two people is not told as one person's.
      await expect(page.locator("section#overview")).toContainText(
        locale.lang === "en" ? "Anastasia Zerva" : "Αναστασία Ζέρβα",
      );
    });

    // One movement per section, once: each section below the fold waits,
    // fades in as it is reached and stays.
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
        const opacities = () =>
          page
            .locator("main [data-reveal], main [data-enter]")
            .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
        // The entrance is CSS only and ends on its own.
        await expect.poll(async () => (await opacities()).every((o) => o === "1")).toBe(true);
      });
    });

    for (const width of [320, 390]) {
      test(`fits a ${width}px phone`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.setViewportSize({ width, height: 844 });
        await page.goto(locale.path);
        const overflow = await page.evaluate(() => {
          const viewport = document.documentElement.clientWidth;
          const rights = [...document.querySelectorAll("main *")].map(
            (el) => el.getBoundingClientRect().right,
          );
          return {
            page: document.documentElement.scrollWidth - viewport,
            right: Math.max(...rights) - viewport,
          };
        });
        expect(overflow.page).toBeLessThanOrEqual(0);
        expect(overflow.right).toBeLessThanOrEqual(0);
      });
    }
  });
}
