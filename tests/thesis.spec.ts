import { test, expect, html, languageGroup, toggleTheme, siteOrigin } from "./fixtures";

const anastasiaLinkedin = "https://www.linkedin.com/in/anastasia-zervas/";

const sections = [
  "overview",
  "challenge",
  "design",
  "architecture",
  "policy",
  "signing",
  "privacy",
  "perspectives",
  "testing",
  "performance",
  "limitations",
  "learned",
  "outcome",
];

const locales = [
  {
    path: "/work/thesis",
    home: "/",
    lang: "en",
    title: "Designing Trust Across Seven Organisations",
    subtitle: "A permissioned dApp for verifiable agricultural subsidy workflows",
    author: "Konstantinos Papadogiannis",
    back: "Selected work",
    backEnd: "Back to selected work",
    contents: "Contents",
    disclaimer: "It is not an official OPEKEPE service",
    attribution: "Anastasia Zerva led the Hyperledger Fabric infrastructure",
    portals: "Portals",
    actors: [
      "Farmers",
      "OPEKEPE",
      "AADE",
      "Regional authorities",
      "Ministry",
      "Bank",
      "EU Observer",
    ],
    signing: "Offline signing / two rounds, nine steps",
    limitations: [
      "Simulated registries, no real funds",
      "A test policy, not law",
      "Self-custody with real farmers is untested",
      "Erasure is reduced, not solved",
      "Contracts only know their inputs",
    ],
    frontendTests: "More than 300",
    timings: ["about 0.075 ms", "about 0.21 ms"],
    gallery: {
      label: "Where the data lives",
      previous: "Previous slide",
      next: "Next slide",
      slide: (n: number) => `${n} of 4`,
      announcement: "Slide 2 of 4: Tax and land facts",
      goTo: "Show slide 4: Young farmer’s diploma",
    },
    themeToggle: "Dark theme",
  },
  {
    path: "/el/work/thesis",
    home: "/el",
    lang: "el",
    title: "Σχεδιάζοντας εμπιστοσύνη ανάμεσα σε επτά οργανισμούς",
    subtitle: "Ένα permissioned dApp για επαληθεύσιμες διαδικασίες αγροτικών επιδοτήσεων",
    author: "Κωνσταντίνος Παπαδογιάννης",
    back: "Επιλεγμένα έργα",
    backEnd: "Πίσω στα επιλεγμένα έργα",
    contents: "Περιεχόμενα",
    disclaimer: "Δεν είναι επίσημη υπηρεσία του ΟΠΕΚΕΠΕ",
    attribution: "η Αναστασία Ζέρβα είχε την ευθύνη της υποδομής Hyperledger Fabric",
    portals: "Portals",
    actors: [
      "Αγρότες",
      "ΟΠΕΚΕΠΕ",
      "ΑΑΔΕ",
      "Περιφερειακές αρχές",
      "Υπουργείο",
      "Τράπεζα",
      "Παρατηρητής ΕΕ",
    ],
    signing: "Offline υπογραφή / δύο γύροι, εννέα βήματα",
    limitations: [
      "Προσομοιωμένα μητρώα, χωρίς πραγματικά χρήματα",
      "Δοκιμαστική πολιτική, όχι νόμος",
      "Η αυτοθεματοφυλακή δεν δοκιμάστηκε με αγρότες",
      "Η διαγραφή περιορίζεται, δεν λύνεται",
      "Τα contracts ξέρουν μόνο τις εισόδους τους",
    ],
    frontendTests: "Πάνω από 300",
    timings: ["περίπου 0,075 ms", "περίπου 0,21 ms"],
    gallery: {
      label: "Πού βρίσκονται τα δεδομένα",
      previous: "Προηγούμενη διαφάνεια",
      next: "Επόμενη διαφάνεια",
      slide: (n: number) => `${n} από 4`,
      announcement: "Διαφάνεια 2 από 4: Φορολογικά και κτηματικά στοιχεία",
      goTo: "Εμφάνιση διαφάνειας 4: Πτυχίο νέου αγρότη",
    },
    themeToggle: "Σκούρο θέμα",
  },
] as const;

for (const locale of locales) {
  test.describe(`thesis case study (${locale.lang})`, () => {
    test("title, metadata and structured data", async ({ page }) => {
      await page.goto(locale.path);
      await expect(html(page)).toHaveAttribute("lang", locale.lang);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale.title);
      await expect(page.getByRole("main")).toContainText(locale.subtitle);
      await expect(page).toHaveTitle(`${locale.title} — ${locale.author}`);

      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${siteOrigin}${locale.path}`,
      );
      for (const [hreflang, path] of [
        ["en", "/work/thesis"],
        ["el", "/el/work/thesis"],
        ["x-default", "/work/thesis"],
      ]) {
        await expect(
          page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`),
        ).toHaveAttribute("href", `${siteOrigin}${path}`);
      }

      const ld = JSON.parse(
        (await page.locator('script[type="application/ld+json"]').textContent())!,
      );
      expect(ld).toMatchObject({
        "@type": "CreativeWork",
        name: locale.title,
        alternativeHeadline: locale.subtitle,
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
          sameAs: "https://www.linkedin.com/in/anastasia-zervas/",
        },
      });

      const duplicates = await page.evaluate(() => {
        const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
        return ids.filter((id, i) => ids.indexOf(id) !== i);
      });
      expect(duplicates).toEqual([]);
    });

    test("both links back go to the work section", async ({ page }) => {
      await page.goto(locale.path);
      const main = page.getByRole("main");
      const href = `${locale.home}#work`;
      await expect(main.getByRole("link", { name: locale.back, exact: true })).toHaveAttribute(
        "href",
        href,
      );
      const back = main.getByRole("link", { name: locale.backEnd, exact: true });
      await expect(back).toHaveAttribute("href", href);
      await back.click();
      await expect(page).toHaveURL(new RegExp(`${locale.home === "/" ? "/" : "/el"}#work$`));
    });

    test("thirteen sections, each in the contents list", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(locale.path);
      const contents = page.getByRole("navigation", { name: locale.contents });
      await expect(contents.getByRole("link")).toHaveCount(sections.length);
      await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveCount(
        sections.length,
      );

      for (const [i, id] of sections.entries()) {
        const section = page.locator(`section#${id}`);
        await expect(section).toHaveAttribute("aria-labelledby", `${id}-heading`);
        await expect(contents.getByRole("link").nth(i)).toHaveAttribute("href", `#${id}`);
      }

      // Below 1280px the contents list gives way to the text.
      await page.setViewportSize({ width: 1024, height: 900 });
      await expect(contents).toBeHidden();
    });

    test("states what the prototype is not, and who built what", async ({ page }) => {
      await page.goto(locale.path);
      const overview = page.locator("section#overview");
      await expect(overview).toContainText(locale.disclaimer);
      await expect(overview).toContainText(locale.attribution);
      const name = locale.lang === "en" ? "Anastasia Zerva" : "Αναστασία Ζέρβα";
      const link = overview.getByRole("link", { name, exact: true });
      await expect(link).toHaveAttribute("href", anastasiaLinkedin);
      await expect(link).toHaveText(name);
    });

    test("seven actors and nine signing steps", async ({ page }) => {
      await page.goto(locale.path);
      const portals = page.getByRole("list", { name: locale.portals });
      await expect(portals.getByRole("heading", { level: 3 })).toHaveText([...locale.actors]);

      const flow = page.getByRole("figure", { name: locale.signing });
      const rounds = flow.locator("ol");
      await expect(rounds).toHaveCount(2);
      await expect(rounds.first()).toHaveAttribute("start", "1");
      await expect(rounds.last()).toHaveAttribute("start", "6");
      await expect(flow.locator("ol > li")).toHaveCount(9);
    });

    test("evidence, timings and limitations", async ({ page }) => {
      await page.goto(locale.path);
      const testing = page.locator("section#testing");
      await expect(testing).toContainText("157");
      await expect(testing).toContainText(locale.frontendTests);
      // Counts from earlier drafts of the thesis that are no longer true.
      await expect(page.getByRole("main")).not.toContainText(/\b(165|313)\b/);

      const performance = page.locator("section#performance");
      for (const timing of locale.timings) await expect(performance).toContainText(timing);

      await expect(
        page.locator("section#limitations").getByRole("heading", { level: 3 }),
      ).toHaveText([...locale.limitations]);
    });

    test("the data gallery moves only when asked", async ({ page }) => {
      await page.clock.install();
      await page.goto(locale.path);
      const gallery = page.getByRole("region", { name: locale.gallery.label });
      // Hidden slides are inert; only the active one can be reached.
      const slides = gallery.locator('[role="group"]');
      await expect(slides).toHaveCount(4);
      for (let i = 1; i <= 4; i++) {
        await expect(slides.nth(i - 1)).toHaveAttribute("aria-label", locale.gallery.slide(i));
      }

      const expectActive = async (n: number) => {
        for (let i = 1; i <= 4; i++) {
          if (i === n) await expect(slides.nth(i - 1)).not.toHaveAttribute("inert");
          else await expect(slides.nth(i - 1)).toHaveAttribute("inert", "");
        }
      };

      await expectActive(1);
      // No autoplay: a minute later the first slide is still showing.
      await page.clock.runFor(60_000);
      await expectActive(1);

      const live = gallery.locator('[aria-live="polite"]');
      await expect(live).toHaveText("");

      await gallery.getByRole("button", { name: locale.gallery.next }).click();
      await expectActive(2);
      await expect(live).toHaveText(locale.gallery.announcement);

      await gallery.getByRole("button", { name: locale.gallery.previous }).click();
      await expectActive(1);
      // Previous from the first slide wraps to the last.
      await gallery.getByRole("button", { name: locale.gallery.previous }).click();
      await expectActive(4);

      // Arrow keys while a control has focus.
      await gallery.getByRole("button", { name: locale.gallery.next }).focus();
      await page.keyboard.press("ArrowRight");
      await expectActive(1);

      const indicator = gallery.getByRole("button", { name: locale.gallery.goTo });
      await indicator.click();
      await expectActive(4);
      await expect(indicator).toHaveAttribute("aria-current", "true");
    });

    test("dark theme and the language switch keep the reader on the page", async ({ page }) => {
      await page.goto(locale.path);
      await toggleTheme(page, locale.themeToggle, "dark");

      const other = locale.lang === "en" ? locales[1] : locales[0];
      await languageGroup(page)
        .getByRole("link", { name: other.lang === "el" ? "Ελληνικά" : "English" })
        .click();
      await expect(page).toHaveURL(new RegExp(`${other.path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(other.title);
      await expect(html(page)).toHaveAttribute("data-theme", "dark");
    });
  });
}
