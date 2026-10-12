import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";

const site = {
  name: "Konstantinos Papadogiannis",
  pdf: "/downloads/konstantinos-papadogiannis-cv.pdf",
  github: "https://github.com/KonstantinosPapadogiannis",
  linkedin: "https://www.linkedin.com/in/konstantinos-papadogiannis/",
  anastasiaLinkedin: "https://www.linkedin.com/in/anastasia-zervas/",
  // The public record, never the my-orcid?orcid= address.
  orcid: "https://orcid.org/0009-0008-9445-2484",
  email: "konstantinospapadogiannis.dev@gmail.com",
};

const locales = [
  {
    home: "/",
    prefix: "",
    name: "Konstantinos Papadogiannis",
    homeLink: "K. Papadogiannis, home",
    nav: ["Work", "About", "Résumé", "Contact"],
    selectedWork: "Selected work",
    resume: "Résumé (PDF)",
    cta: "Read case study",
    thesisTitle: "Distributed subsidy management on Hyperledger Fabric",
    caseTitle: "Designing Trust Across Seven Organisations",
    ergohub: {
      title: "Freelance marketplace on Azure Kubernetes",
      team: "Team of two",
      pipelines: "6 Jenkins pipeline definitions",
      caseTitle: "From Application Code to a Kubernetes Cluster",
    },
    openstack: {
      title: "Private cloud deployment on Google Cloud",
      signals: ["DevStack", "Google Cloud", "Linux networking"],
      caseTitle: "A Private Cloud Inside One Google Cloud VM",
      maxWords: 70,
    },
    cuda: {
      title: "GPU matrix multiplication with CUDA",
      signals: ["NVIDIA T4", "4096 × 4096", "tiling", "register blocking"],
      result: ["306 ms", "86 ms", "3.6× speedup"],
      summary: "Runtime reduced from 306 ms to 86 ms, a 3.6× speedup",
      caseTitle: "From 306 ms to 86 ms",
      maxWords: 65,
    },
    vision: {
      name: "Computer vision",
      title: "Classification, segmentation and detection in PyTorch",
      tasks: ["image classification", "semantic segmentation", "object detection"],
      results: [
        ["CIFAR-10", ["ViT-B/16 95.63%", "VGG16-BN 93.26%"]],
        ["Oxford-IIIT Pet", ["ResNet18 90.32%"]],
      ],
      metric: "Test accuracy at the last epoch",
      caseTitle: "Classification, segmentation and detection in PyTorch",
    },
    energy: {
      name: "Energy data mining",
      title: "Classifying and forecasting energy consumption",
      kind: "Academic project · Team of two",
      tasks: ["high-consumption days", "next day’s total", "persistence baseline"],
      results: [
        ["Gradient Boosting", ["89.4% test accuracy", "96.3% ROC-AUC"]],
        ["Random Forest", ["5.59 kWh test RMSE", "baseline 6.84 kWh"]],
      ],
      caseTitle: "Classifying and forecasting household energy use",
    },
    figure: "System architecture / simplified",
    organisations: "Organisations on the channel",
    portrait: "Portrait of Konstantinos Papadogiannis",
    backToTop: "Back to top",
    elsewhere: "Elsewhere",
    orcid: "ORCID profile — 0009-0008-9445-2484",
    heroLabel: "Konstantinos Papadogiannis, Athens, GR",
    about: "About, Background",
    story: {
      label: "My story",
      statement: "Curiosity came before code.",
      chapters: ["01 Curiosity", "02 Depth", "03 Direction"],
      terms: [
        "Peristeri",
        "PlayStation 2",
        "W3Schools",
        "DevOps",
        "Computer Architecture",
        "Anastasia Zerva",
      ],
      research: "research-oriented collaboration",
      pull: "I want to understand before I implement.",
      callback: "What is happening underneath — and what can I build once I understand it?",
    },
    academic: {
      record: [
        ["Average", "7.51 / 10"],
        ["Thesis", "10 / 10"],
      ],
      highlights: "Academic highlights",
      groups: [
        "Systems and infrastructure",
        "Software and computing",
        "AI, data and intelligent systems",
        "Networks, security and digital systems",
      ],
      courses: {
        10: [
          "Numerical Analysis",
          "DevOps Concepts & Tools",
          "Modern Parallel Architectures & High-Performance Programming",
        ],
        9: [
          "Programming II",
          "Object-Oriented Programming I",
          "Economics of Digital Technology",
          "Data Mining",
          "Computer Vision & Graphics",
          "Systems & Interfaces Evaluation",
          "Cloud Computing Management",
          "Information Retrieval & Natural Language Processing",
        ],
        8: [
          "Signals & Systems",
          "Telecommunication Systems",
          "Distributed Systems",
          "Simulation",
          "Information Systems Security",
        ],
      },
    },
    technologies: "Technologies, Used in my projects",
    interests: {
      label: "Interests",
      lead: "Areas I keep exploring.",
      themes: [
        "Systems and infrastructure",
        "Blockchain and financial protocols",
        "Security, identity and trust",
        "AI and intelligent systems",
        "Financial technology and markets",
      ],
      explore: /\bexplor/,
      openSource: "open-source",
    },
  },
  {
    home: "/el",
    prefix: "/el",
    name: "Κωνσταντίνος Παπαδογιάννης",
    homeLink: "K. Papadogiannis, αρχική σελίδα",
    nav: ["Έργα", "Σχετικά", "Βιογραφικό", "Επικοινωνία"],
    selectedWork: "Επιλεγμένα έργα",
    resume: "Βιογραφικό (PDF, στα αγγλικά)",
    cta: "Διαβάστε τη μελέτη περίπτωσης",
    thesisTitle: "Κατανεμημένη διαχείριση επιδοτήσεων σε Hyperledger Fabric",
    caseTitle: "Σχεδιάζοντας εμπιστοσύνη ανάμεσα σε επτά οργανισμούς",
    ergohub: {
      title: "Πλατφόρμα freelance σε Azure Kubernetes",
      team: "Ομάδα δύο ατόμων",
      pipelines: "6 ορισμοί Jenkins pipeline",
      caseTitle: "Από τον κώδικα της εφαρμογής σε ένα Kubernetes cluster",
    },
    openstack: {
      title: "Ιδιωτικό cloud στο Google Cloud",
      signals: ["DevStack", "Google Cloud", "Δικτύωση Linux"],
      caseTitle: "Ένα ιδιωτικό cloud μέσα σε ένα VM του Google Cloud",
      // Greek takes a few more words for the same sentences.
      maxWords: 80,
    },
    cuda: {
      title: "Πολλαπλασιασμός πινάκων σε GPU με CUDA",
      signals: ["NVIDIA T4", "4096 × 4096", "tiling", "register blocking"],
      result: ["306 ms", "86 ms", "επιτάχυνση 3,6×"],
      summary: "Ο χρόνος εκτέλεσης μειώθηκε από 306 ms σε 86 ms, επιτάχυνση 3,6×",
      caseTitle: "Από 306 ms σε 86 ms",
      maxWords: 75,
    },
    vision: {
      name: "Όραση υπολογιστών",
      title: "Classification, segmentation και detection σε PyTorch",
      tasks: ["image classification", "semantic segmentation", "object detection"],
      results: [
        ["CIFAR-10", ["ViT-B/16 95,63%", "VGG16-BN 93,26%"]],
        ["Oxford-IIIT Pet", ["ResNet18 90,32%"]],
      ],
      metric: "Test accuracy στην τελευταία εποχή",
      caseTitle: "Classification, segmentation και detection σε PyTorch",
    },
    energy: {
      name: "Εξόρυξη δεδομένων ενέργειας",
      title: "Classification και forecasting κατανάλωσης ενέργειας",
      kind: "Ακαδημαϊκό έργο · Ομάδα δύο ατόμων",
      tasks: ["υψηλής κατανάλωσης", "επόμενης ημέρας", "persistence baseline"],
      results: [
        ["Gradient Boosting", ["89,4% test accuracy", "96,3% ROC-AUC"]],
        ["Random Forest", ["5,59 kWh test RMSE", "baseline 6,84 kWh"]],
      ],
      caseTitle: "Classification και forecasting της κατανάλωσης ενός νοικοκυριού",
    },
    figure: "Αρχιτεκτονική συστήματος / απλοποιημένη",
    organisations: "Οργανισμοί στο κανάλι",
    portrait: "Πορτρέτο του Κωνσταντίνου Παπαδογιάννη",
    backToTop: "Επιστροφή στην αρχή",
    elsewhere: "Σύνδεσμοι",
    orcid: "Προφίλ ORCID — 0009-0008-9445-2484",
    heroLabel: "Κωνσταντίνος Παπαδογιάννης, Αθήνα",
    about: "Σχετικά, Υπόβαθρο",
    story: {
      label: "Η διαδρομή μου",
      statement: "Η περιέργεια ήρθε πριν από τον κώδικα.",
      chapters: ["01 Περιέργεια", "02 Βάθος", "03 Κατεύθυνση"],
      terms: [
        "Περιστέρι",
        "PlayStation 2",
        "W3Schools",
        "DevOps",
        "Αρχιτεκτονική Υπολογιστών",
        "Αναστασία Ζέρβα",
      ],
      research: "συνεργασία με ερευνητικό προσανατολισμό",
      pull: "Θέλω να καταλαβαίνω πριν εφαρμόσω.",
      callback: "Τι συμβαίνει από πίσω — και τι μπορώ να χτίσω όταν το καταλάβω;",
    },
    academic: {
      record: [
        ["Μέσος όρος", "7,51 / 10"],
        ["Πτυχιακή", "10 / 10"],
      ],
      highlights: "Ακαδημαϊκές επιδόσεις",
      groups: [
        "Συστήματα και υποδομές",
        "Λογισμικό και υπολογιστική",
        "AI, δεδομένα και ευφυή συστήματα",
        "Δίκτυα, ασφάλεια και ψηφιακά συστήματα",
      ],
      courses: {
        10: [
          "Αριθμητική Ανάλυση",
          "Βασικές Έννοιες και Εργαλεία DevOps",
          "Σύγχρονες Παράλληλες Αρχιτεκτονικές και Προγραμματισμός Υψηλής Απόδοσης",
        ],
        9: [
          "Προγραμματισμός II",
          "Αντικειμενοστραφής Προγραμματισμός I",
          "Οικονομικά της Ψηφιακής Τεχνολογίας",
          "Εξόρυξη Δεδομένων",
          "Υπολογιστική Όραση και Γραφικά",
          "Αξιολόγηση Συστημάτων και Διεπαφών",
          "Διαχείριση Υπολογιστικού Νέφους",
          "Ανάκτηση Πληροφορίας και Επεξεργασία Φυσικής Γλώσσας",
        ],
        8: [
          "Σήματα και Συστήματα",
          "Τηλεπικοινωνιακά Συστήματα",
          "Κατανεμημένα Συστήματα",
          "Προσομοίωση",
          "Ασφάλεια Πληροφοριακών Συστημάτων",
        ],
      },
    },
    technologies: "Τεχνολογίες, Στα έργα μου",
    interests: {
      label: "Ενδιαφέροντα",
      lead: "Πεδία που συνεχίζω να εξερευνώ.",
      themes: [
        "Συστήματα και υποδομές",
        "Blockchain και χρηματοοικονομικά πρωτόκολλα",
        "Ασφάλεια, ταυτότητα και εμπιστοσύνη",
        "AI και ευφυή συστήματα",
        "Χρηματοοικονομική τεχνολογία και αγορές",
      ],
      explore: /εξερευν/,
      openSource: "ανοιχτού κώδικα",
    },
  },
] as const;

// Terms that stay in English in both languages, one or more from each group
// of interests, so none of the groups is dropped from the copy.
const interestTerms = [
  "Kubernetes",
  "CUDA",
  "Linux",
  "Bitcoin",
  "Ethereum",
  "Solana",
  "DeFi",
  "Web3",
  "PKI",
  "self-custody",
  "LLM",
  "MCP",
  "ETF",
];

// Wording that would present an interest as expertise, compared after fold().
const expertiseClaims =
  /expert|speciali[sz]|advanced|master|proficien|seasoned|passion|enthusias|cutting-edge|εξειδικ|ειδημ|εμπειρογνωμ|παθος|λατρ/;

// Academic copy that has been superseded or must not be published: the old
// average and its classification, course and credit counts, and a course
// that is not on the verified record. Compared after fold().
const retiredAcademicCopy = [
  /\b7[.,]45\b/,
  /very good/,
  /λιαν καλως/,
  /\b\d+\s*(\/|of|απο)\s*\d+\s*(courses|modules|μαθηματα)/,
  /\bects\b/,
  /computer networks/,
  /δικτυα υπολογιστων/,
];

// The year of birth and the age stay private: neither is published in any
// form. The age at which the story starts ("around twelve") is not his age.
// No year before 2000 appears anywhere, so the year itself is never named
// here either. Compared after fold().
const privateDetails = [
  /\b19\d{2}\b/,
  /birth ?date|date of birth|ημερομηνια γεννησης/,
  /(born|γεννηθηκα)\b[^.]{0,40}\b(19|20)\d{2}\b/,
  /\b\d{1,2}[\s-]*years?[\s-]*old\b/,
  /\b\d{1,2}\s*(χρονων|ετων)\b/,
];

// The collaboration in the story is between two people. Nothing may present
// it as a lab, a company, a formal group or employment. Compared after fold().
const institutionalClaims =
  /\blab\b|\blaborator|εργαστηρ|company|εταιρ|start-?up|research group|ερευνητικη ομαδα|employ|υπαλληλ|\bhired\b/;

// Phrases the story must not use. Compared after fold().
const storyCliches =
  /passion|παθος|my journey began|ever since i was a child|cutting-edge|changing the world|technology enthusiast|lifelong learner|driven individual|driven by curiosity|results-oriented|innovative solutions|stubborn|πεισματαρ|ξεροκεφαλ/;

// Any whitespace as a plain space, so "PlayStation 2" matches its no-break
// space.
const plain = (text: string) => text.replace(/\s+/g, " ");

// Case and accents removed, so "KONSTANTINOS" set by text-transform and
// Greek capitals without the tonos still match.
const fold = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("el");

const hero = (page: Page) => page.locator('section[aria-labelledby="hero-heading"]');

// The sections whose blocks fade in as they are reached, besides the story,
// by the id of their heading. The hero has its own entrance on load.
const revealedSections = ["work", "about", "academic", "interests", "more-work", "technologies"];

type RevealWindow = typeof window & {
  __revealObservers: { created: number; disconnected: number };
  __layoutShift: { value: number };
};

for (const locale of locales) {
  test.describe(`homepage (${locale.home})`, () => {
    test("hero links to the work, the résumé PDF and both profiles", async ({ page }) => {
      await page.goto(locale.home);
      const links = hero(page);

      await expect(links.getByRole("link", { name: locale.selectedWork })).toHaveAttribute(
        "href",
        "#work",
      );
      const resume = links.getByRole("link", { name: locale.resume, exact: true });
      await expect(resume).toHaveAttribute("href", site.pdf);
      await expect(resume).toHaveAttribute("hreflang", "en");
      for (const [name, href] of [
        ["GitHub", site.github],
        ["LinkedIn", site.linkedin],
      ]) {
        const link = links.getByRole("link", { name, exact: true });
        await expect(link).toHaveAttribute("href", href);
        await expect(link).toHaveAttribute("rel", "me");
      }
    });

    test("the selected work button scrolls to the thesis", async ({ page }) => {
      await page.goto(locale.home);
      await hero(page).getByRole("link", { name: locale.selectedWork }).click();
      await expect(page).toHaveURL(/#work$/);
      await expect(page.getByRole("heading", { level: 3, name: locale.thesisTitle })).toBeInViewport();
    });

    // The header carries the short form. The full name appears once on the
    // page itself, in the hero, and is not repeated in the compact footer.
    test("the full name is in the hero, not the header or footer", async ({ page }) => {
      await page.goto(locale.home);
      const count = (text: string, name: string) => fold(text).split(fold(name)).length - 1;
      expect(count(await page.getByRole("banner").innerText(), locale.name)).toBe(0);
      expect(count(await page.getByRole("main").innerText(), locale.name)).toBe(1);
      expect(count(await hero(page).innerText(), locale.name)).toBe(1);
      expect(count(await page.getByRole("contentinfo").innerText(), site.name)).toBe(0);
    });

    // "K. Papadogiannis" in the header and the full name in metadata. The
    // compact footer does not duplicate either brand treatment.
    test("brand: short form in the header and full name in metadata", async ({ page }) => {
      await page.goto(locale.home);
      await expect(
        page.getByRole("banner").getByRole("link", { name: locale.homeLink, exact: true }),
      ).toHaveText("K. Papadogiannis");
      await expect(page.getByRole("contentinfo")).not.toContainText(site.name);

      await expect(page).toHaveTitle(new RegExp(`^${locale.name} — `));
      await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
        "content",
        locale.name,
      );

      for (const path of [
        locale.home,
        `${locale.prefix}/work/thesis`,
        `${locale.prefix}/work/ergohub`,
        `${locale.prefix}/work/openstack`,
        `${locale.prefix}/work/cuda`,
        `${locale.prefix}/work/computer-vision`,
        `${locale.prefix}/work/energy-data-mining`,
      ]) {
        await page.goto(path);
        expect(await page.locator("body").innerText(), path).not.toMatch(/\bKP\b/);
      }
    });

    test("the architecture shows seven organisations on one channel", async ({ page }) => {
      await page.goto(locale.home);
      const figure = page.getByRole("figure", { name: locale.figure });
      await figure.scrollIntoViewIfNeeded();
      await expect(figure).toBeVisible();
      await expect(
        figure.getByRole("list", { name: locale.organisations }).getByRole("listitem"),
      ).toHaveCount(7);
      await expect(figure.getByText("subsidychannel", { exact: true })).toBeVisible();
      await expect(figure.getByRole("list", { name: "Chaincodes" }).getByRole("listitem")).toHaveText([
        "policy-chaincode",
        "entitlement-chaincode",
        "subsidy-chaincode",
      ]);
      // Drawn in HTML and CSS, so nothing in it is an image.
      await expect(figure.locator("img, svg image, canvas")).toHaveCount(0);
    });

    test("the portrait loads at 4:5", async ({ page }) => {
      await page.goto(locale.home);
      const portrait = page.getByRole("img", { name: locale.portrait });
      await portrait.scrollIntoViewIfNeeded();
      await expect
        .poll(() => portrait.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth))
        .toBeGreaterThan(0);
      const box = (await portrait.boundingBox())!;
      expect(box.height / box.width).toBeCloseTo(1.25, 2);
    });

    test("six projects, the thesis first", async ({ page }) => {
      await page.goto(locale.home);
      const articles = page.getByRole("main").getByRole("article");
      await expect(articles).toHaveCount(6);
      await expect(articles.first()).toHaveAccessibleName(locale.thesisTitle);
    });

    test("the thesis link opens the case study page", async ({ page }) => {
      await page.goto(locale.home);
      const cta = page
        .getByRole("article", { name: locale.thesisTitle })
        .getByRole("link", { name: locale.cta, exact: true });
      await expect(cta).toHaveAttribute("href", `${locale.prefix}/work/thesis`);
      await cta.click();
      await expect(page).toHaveURL(new RegExp(`${locale.prefix}/work/thesis$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale.caseTitle);
    });

    // A major project with a case study: its title and meta, a description of
    // two to four sentences, one or two concrete signals and the link to the
    // case study (docs/CONTENT_AND_VOICE.md). Below the thesis, in More work.
    test("ErgoHub: a short entry with its signals, linked to its case study", async ({ page }) => {
      await page.goto(locale.home);
      await expect(
        page.locator("#work").getByRole("article", { name: locale.ergohub.title }),
      ).toHaveCount(0);
      const entry = page
        .locator("#more-work")
        .getByRole("article", { name: locale.ergohub.title });
      await expect(entry).toContainText("2025");
      await expect(entry).toContainText(locale.ergohub.team);
      await expect(entry).toContainText(locale.ergohub.pipelines);
      for (const item of ["Docker", "ACR", "AKS"]) await expect(entry).toContainText(item);

      const words = (text: string) => text.match(/[\p{L}\p{N}][\p{L}\p{N}’'-]*/gu)?.length ?? 0;
      const title = await entry.getByRole("heading", { level: 3 }).innerText();
      const body = await entry.locator("h3 + p").innerText();
      const signals = await entry.locator("h3 + p + p").innerText();
      const sentences = body.split(/[.!?](?:\s|$)/).filter((part) => part.trim()).length;
      expect(sentences).toBeGreaterThanOrEqual(2);
      expect(sentences).toBeLessThanOrEqual(4);
      const total = words(title) + words(body) + words(signals);
      expect(total).toBeGreaterThanOrEqual(45);
      expect(total).toBeLessThanOrEqual(80);

      const cta = entry.getByRole("link", { name: `${locale.cta}: ErgoHub`, exact: true });
      await expect(cta).toHaveAttribute("href", `${locale.prefix}/work/ergohub`);
      await cta.click();
      await expect(page).toHaveURL(new RegExp(`${locale.prefix}/work/ergohub$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale.ergohub.caseTitle);
    });

    // A focused case study: what was built, where, the problem it was about
    // and what worked at the end, in one short entry; three signals, no list
    // of tools; the link to the case study.
    test("OpenStack: a short entry with its signals, linked to its case study", async ({
      page,
    }) => {
      await page.goto(locale.home);
      const entry = page
        .locator("#more-work")
        .getByRole("article", { name: locale.openstack.title });
      await expect(entry).toContainText("2026");
      const signals = entry.locator("h3 + p + p");
      for (const item of locale.openstack.signals) await expect(signals).toContainText(item);

      const words = (text: string) => text.match(/[\p{L}\p{N}][\p{L}\p{N}’'-]*/gu)?.length ?? 0;
      const title = await entry.getByRole("heading", { level: 3 }).innerText();
      const body = await entry.locator("h3 + p").innerText();
      const sentences = body.split(/[.!?](?:\s|$)/).filter((part) => part.trim()).length;
      expect(sentences).toBeGreaterThanOrEqual(2);
      expect(sentences).toBeLessThanOrEqual(4);
      const total = words(title) + words(body) + words(await signals.innerText());
      expect(total).toBeGreaterThanOrEqual(45);
      expect(total).toBeLessThanOrEqual(locale.openstack.maxWords);

      const cta = entry.getByRole("link", { name: `${locale.cta}: OpenStack`, exact: true });
      await expect(cta).toHaveAttribute("href", `${locale.prefix}/work/openstack`);
      await cta.click();
      await expect(page).toHaveURL(new RegExp(`${locale.prefix}/work/openstack$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        locale.openstack.caseTitle,
      );
    });

    // The measured result in one line, the scale and the platform, and what
    // changed between the kernels said as a sentence, not as a list of terms.
    test("CUDA: a short entry with its result, linked to its case study", async ({ page }) => {
      await page.goto(locale.home);
      const entry = page.locator("#more-work").getByRole("article", { name: locale.cuda.title });
      await expect(entry).toContainText("2026");
      const body = entry.locator("h3 + p");
      for (const item of locale.cuda.signals) await expect(body).toContainText(item);
      const result = entry.locator("h3 + p + p");
      await expect(result.locator(".sr-only")).toHaveText(locale.cuda.summary);
      // What is drawn: the two times, the arrow between them and the ratio.
      const shown = result.locator('[aria-hidden="true"] span:not(:has(span))');
      await expect(shown).toHaveText(locale.cuda.result);
      await expect(entry).not.toContainText(/×\s*(faster|ταχύτερ)/);

      const words = (text: string) => text.match(/[\p{L}\p{N}][\p{L}\p{N}’'-]*/gu)?.length ?? 0;
      const title = await entry.getByRole("heading", { level: 3 }).innerText();
      const sentences = (await body.innerText())
        .split(/[.!?](?:\s|$)/)
        .filter((part) => part.trim()).length;
      expect(sentences).toBeGreaterThanOrEqual(2);
      expect(sentences).toBeLessThanOrEqual(4);
      const total =
        words(title) + words(await body.innerText()) + words((await shown.allInnerTexts()).join(" "));
      expect(total).toBeGreaterThanOrEqual(40);
      expect(total).toBeLessThanOrEqual(locale.cuda.maxWords);

      const cta = entry.getByRole("link", { name: `${locale.cta}: CUDA`, exact: true });
      await expect(cta).toHaveAttribute("href", `${locale.prefix}/work/cuda`);
      await cta.click();
      await expect(page).toHaveURL(new RegExp(`${locale.prefix}/work/cuda$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale.cuda.caseTitle);
    });

    // A secondary project with a case study: the three tasks in two
    // sentences, test accuracy on two datasets with the metric named under
    // them, and the link to the case study. Not every model it trained.
    test("Computer vision: a short entry with measured results, linked to its case study", async ({
      page,
    }) => {
      await page.goto(locale.home);
      const entry = page
        .locator("#more-work")
        .getByRole("article", { name: locale.vision.title });
      await expect(entry).toContainText("2026");
      const body = entry.locator("h4 + p");
      for (const task of locale.vision.tasks) await expect(body).toContainText(task);

      const results = entry.locator("dl");
      await expect(results.locator("dt")).toHaveText(
        locale.vision.results.map(([dataset]) => dataset),
      );
      for (const [i, [, models]] of locale.vision.results.entries()) {
        for (const model of models) await expect(results.locator("dd").nth(i)).toContainText(model);
      }
      await expect(entry).toContainText(locale.vision.metric);
      // Only figures the case study reports: no mAP, no IoU.
      await expect(entry).not.toContainText(/mAP|IoU|93[.,]18/);

      const words = (text: string) => text.match(/[\p{L}\p{N}][\p{L}\p{N}’'-]*/gu)?.length ?? 0;
      const text = await body.innerText();
      const sentences = text.split(/[.!?](?:\s|$)/).filter((part) => part.trim()).length;
      expect(sentences).toBeGreaterThanOrEqual(2);
      expect(sentences).toBeLessThanOrEqual(3);
      expect(words(text)).toBeGreaterThanOrEqual(40);
      expect(words(text)).toBeLessThanOrEqual(60);

      const cta = entry.getByRole("link", {
        name: `${locale.cta}: ${locale.vision.name}`,
        exact: true,
      });
      await expect(cta).toHaveAttribute("href", `${locale.prefix}/work/computer-vision`);
      await cta.click();
      await expect(page).toHaveURL(new RegExp(`${locale.prefix}/work/computer-vision$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale.vision.caseTitle);
    });

    // The other secondary project with a case study: a team project of two,
    // the two tasks on the same data, one result of each with its metric
    // named, and the link. Accuracy and ROC-AUC are two figures, never one,
    // and the forecast is shown beside its baseline.
    test("Energy data mining: two tasks, a result of each, linked to its case study", async ({
      page,
    }) => {
      await page.goto(locale.home);
      const entry = page
        .locator("#more-work")
        .getByRole("article", { name: locale.energy.title });
      await expect(entry).toContainText("2026");
      await expect(entry).toContainText(locale.energy.kind);
      const body = entry.locator("h4 + p");
      for (const task of locale.energy.tasks) await expect(body).toContainText(task);

      const results = entry.locator("dl");
      await expect(results.locator("dt")).toHaveText(
        locale.energy.results.map(([model]) => model),
      );
      for (const [i, [, figures]] of locale.energy.results.entries()) {
        for (const figure of figures) {
          await expect(results.locator("dd").nth(i)).toContainText(figure);
        }
      }
      await expect(entry).not.toContainText(/99\s*%|0[.,]99|outperform|beat|υπερτερ/i);

      const words = (text: string) => text.match(/[\p{L}\p{N}][\p{L}\p{N}’'-]*/gu)?.length ?? 0;
      const text = await body.innerText();
      expect(words(text)).toBeGreaterThanOrEqual(40);
      expect(words(text)).toBeLessThanOrEqual(locale.prefix ? 60 : 55);

      const cta = entry.getByRole("link", {
        name: `${locale.cta}: ${locale.energy.name}`,
        exact: true,
      });
      await expect(cta).toHaveText(locale.cta);
      await expect(cta).toHaveAttribute("href", `${locale.prefix}/work/energy-data-mining`);
      await cta.click();
      await expect(page).toHaveURL(new RegExp(`${locale.prefix}/work/energy-data-mining$`));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale.energy.caseTitle);
    });

    test("footer contains only the four professional contact links", async ({ page }) => {
      await page.goto(locale.home);
      const footer = page.getByRole("contentinfo");

      const profiles = footer
        .getByRole("list", { name: "Professional profiles and contact" })
        .getByRole("link");
      await expect(profiles).toHaveCount(4);
      const profileLinks = footer.locator('a[rel="me"]');
      await expect(profileLinks).toHaveCount(3);
      for (const [i, [name, href]] of [
        ["GitHub", site.github],
        ["LinkedIn", site.linkedin],
        ["ORCID profile — 0009-0008-9445-2484", site.orcid],
      ].entries()) {
        const link = profileLinks.nth(i);
        await expect(link).toHaveAccessibleName(name);
        await expect(link).toHaveAttribute("href", href);
        await expect(link).toHaveAttribute("rel", "me");
        await expect(link).not.toHaveAttribute("target", /.+/);
      }
      // One ORCID link, to the public record, with its icon loaded.
      const orcid = footer.locator('a[href*="orcid.org"]');
      await expect(orcid).toHaveCount(1);
      await expect(orcid).toHaveAttribute("href", site.orcid);
      await expect(orcid.locator("img")).toHaveAttribute("alt", "");
      await expect
        .poll(() => orcid.locator("img").evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0);
      expect(await page.content()).not.toContain("my-orcid");
      // One mail link with a short visible label and the approved address as its target.
      const mail = footer.locator('a[href^="mailto:"]');
      await expect(mail).toHaveCount(1);
      await expect(mail).toHaveAccessibleName("Email");
      await expect(mail).toHaveAttribute("href", `mailto:${site.email}`);
      await expect(footer).not.toContainText(site.email);
      await expect(mail).not.toHaveAttribute("rel", /.+/);
      await expect(footer).not.toContainText("Navigate");
      await expect(footer).not.toContainText("Back to top");
      await expect(footer).not.toContainText("Open to graduate and junior roles");
    });

    test("education: the average and the thesis grade, in the reader's number format", async ({
      page,
    }) => {
      await page.goto(locale.home);
      const record = page.locator("#about dl");
      const pairs = await record.evaluate((dl) =>
        [...dl.querySelectorAll("dt")].map((dt) => [
          dt.textContent!.trim(),
          dt.nextElementSibling!.textContent!.trim(),
        ]),
      );
      expect(pairs).toEqual(locale.academic.record);

      // Nothing superseded or private anywhere in the page or its metadata.
      const text = await page.evaluate(() =>
        [
          document.body.innerText,
          document.title,
          ...[...document.querySelectorAll("meta[content]")].map((m) =>
            m.getAttribute("content"),
          ),
        ].join("\n"),
      );
      for (const pattern of retiredAcademicCopy) expect(fold(text)).not.toMatch(pattern);
    });

    test("academic highlights: the verified courses by field, the thesis kept apart", async ({
      page,
    }) => {
      await page.goto(locale.home);
      // A section of its own, not a part of About.
      await expect(page.getByRole("region", { name: locale.about }).getByRole("region")).toHaveCount(
        0,
      );
      const section = page.getByRole("region", { name: locale.academic.highlights });
      await expect(section.getByRole("heading", { level: 2 })).toHaveAccessibleName(
        locale.academic.highlights,
      );
      await expect(section.getByRole("heading", { level: 3 })).toHaveText([
        ...locale.academic.groups,
      ]);

      const rows = await section.getByRole("listitem").evaluateAll((items) =>
        items.map((item) => ({
          name: item.firstElementChild!.textContent!.trim(),
          grade: item.lastElementChild!.textContent!.trim(),
        })),
      );
      const courses: Record<string, readonly string[]> = locale.academic.courses;
      const expected = Object.entries(courses).flatMap(([grade, names]) =>
        names.map((name) => ({ name, grade: `${grade} / 10` })),
      );
      expect(rows).toHaveLength(16);
      expect(rows).toEqual(expect.arrayContaining(expected));
      // The thesis has its own grade above, not a row among the courses.
      for (const { name } of rows) expect(fold(name)).not.toMatch(/thesis|πτυχιακ/);
      // Type and rules only.
      await expect(section.locator("img, svg, canvas, progress, meter")).toHaveCount(0);
    });

    // Long names wrap beside their grade on phones; nothing reaches past the
    // screen and the grades keep one column.
    for (const width of [320, 390]) {
      test(`academic highlights fit a ${width}px phone, grades in one column`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(locale.home);
        const academic = page.locator("#academic");
        await academic.scrollIntoViewIfNeeded();
        const layout = await academic.evaluate((el) => {
          const viewport = document.documentElement.clientWidth;
          const rights = [...el.querySelectorAll("*")].map((n) => n.getBoundingClientRect().right);
          const rows = [...el.querySelectorAll("li")].map((li) => {
            const name = li.firstElementChild!.getBoundingClientRect();
            const grade = li.lastElementChild!.getBoundingClientRect();
            return { nameRight: name.right, gradeLeft: grade.left, gradeRight: grade.right };
          });
          return {
            page: document.documentElement.scrollWidth - viewport,
            right: Math.max(...rights) - viewport,
            rows,
          };
        });
        expect(layout.page).toBeLessThanOrEqual(0);
        expect(layout.right).toBeLessThanOrEqual(0);
        expect(layout.rows).toHaveLength(16);
        for (const row of layout.rows) expect(row.nameRight).toBeLessThanOrEqual(row.gradeLeft);
        expect(new Set(layout.rows.map((row) => Math.round(row.gradeRight))).size).toBe(1);
      });
    }

    // On a phone nothing in the footer reaches past the screen, and every link
    // is at least 44px tall.
    for (const width of [320, 390]) {
      test(`footer fits a ${width}px phone, with touch-sized links`, async ({ page }) => {
        await page.setViewportSize({ width, height: 844 });
        await page.goto(locale.home);
        const footer = page.getByRole("contentinfo");
        await footer.scrollIntoViewIfNeeded();

        const overflow = await footer.evaluate((el) => {
          const rights = [...el.querySelectorAll("*")].map((n) => n.getBoundingClientRect().right);
          return {
            scroll: el.scrollWidth - el.clientWidth,
            right: Math.max(...rights) - document.documentElement.clientWidth,
          };
        });
        expect(overflow.scroll).toBeLessThanOrEqual(0);
        expect(overflow.right).toBeLessThanOrEqual(0);

        const links = await footer.getByRole("link").all();
        expect(links.length).toBeGreaterThan(0);
        for (const link of links) {
          await expect(link).toBeInViewport({ ratio: 1 });
          const box = (await link.boundingBox())!;
          expect(box.height, await link.innerText()).toBeGreaterThanOrEqual(44);
        }
      });
    }

    test("the light canvas is the reference off-white, with no white surfaces", async ({
      page,
    }) => {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(locale.home);
        const backgrounds = await page.evaluate(() => {
          const bg = (el: Element) => getComputedStyle(el).backgroundColor;
          return {
            canvas: [document.documentElement, document.body].map(bg),
            sections: [
              ...document.querySelectorAll("body > div, header, main, main > section"),
            ].map(bg),
            all: [...document.querySelectorAll("body *")].map(bg),
          };
        });
        // #F3F1EB, measured from assets/references/homepage-*.png.
        expect(backgrounds.canvas).toEqual(["rgb(243, 241, 235)", "rgb(243, 241, 235)"]);
        for (const fill of backgrounds.sections) {
          expect(["rgba(0, 0, 0, 0)", "rgb(243, 241, 235)"]).toContain(fill);
        }
        expect(backgrounds.all).not.toContain("rgb(255, 255, 255)");
      }
      // The architecture panel is the one lighter surface, as in the reference.
      const panelBackground = await page.evaluate((label) => {
        const figure = [...document.querySelectorAll("figure")].find((candidate) =>
          candidate.querySelector("figcaption")?.textContent?.includes(label),
        );
        const panel = figure?.querySelector(":scope > div");
        return panel ? getComputedStyle(panel).backgroundColor : undefined;
      }, locale.figure);
      expect(panelBackground).toBe("rgb(251, 250, 246)");
    });

    test("story: a section of its own, after About, with the verified facts", async ({ page }) => {
      await page.goto(locale.home);
      const section = page.getByRole("region", { name: locale.story.label });
      await expect(section.getByRole("heading", { level: 2 })).toHaveAccessibleName(
        locale.story.label,
      );
      await expect(section.getByText(locale.story.statement, { exact: true })).toBeVisible();
      await expect(section.getByRole("heading", { level: 3 })).toHaveText([
        ...locale.story.chapters,
      ]);
      await expect(section.getByText(locale.story.pull, { exact: true })).toBeVisible();
      // The closing line answers the question the story starts with.
      await expect(section.getByText(locale.story.callback, { exact: true })).toBeVisible();

      const text = plain(await section.innerText());
      for (const term of locale.story.terms) expect(text).toContain(term);
      const collaborator = locale.story.terms.at(-1)!;
      await expect(section.getByRole("link", { name: collaborator, exact: true })).toHaveAttribute(
        "href",
        site.anastasiaLinkedin,
      );
      expect(text).toContain(locale.story.research);
      expect(fold(text)).not.toMatch(institutionalClaims);
      expect(fold(text)).not.toMatch(storyCliches);
      // The story is not repeated in About.
      expect(await page.locator("#about").innerText()).not.toContain("PlayStation");
      // Type and space only: no photographs, illustrations or icons.
      await expect(section.locator("img, picture, svg, canvas, video")).toHaveCount(0);
    });

    test("the year of birth and the age are not published", async ({ page }) => {
      for (const path of [
        locale.home,
        `${locale.prefix}/work/thesis`,
        `${locale.prefix}/work/ergohub`,
        `${locale.prefix}/work/openstack`,
        `${locale.prefix}/work/cuda`,
        `${locale.prefix}/work/computer-vision`,
        `${locale.prefix}/work/energy-data-mining`,
        `${locale.prefix}/resume`,
      ]) {
        await page.goto(path);
        const text = await page.evaluate(() =>
          [
            document.body.innerText,
            document.title,
            ...[...document.querySelectorAll("meta[content]")].map((m) =>
              m.getAttribute("content"),
            ),
            ...[...document.querySelectorAll('script[type="application/ld+json"]')].map(
              (s) => s.textContent,
            ),
          ].join("\n"),
        );
        for (const pattern of privateDetails) expect(fold(text), path).not.toMatch(pattern);
      }
    });

    // Paragraphs below the fold fade in as they reach the viewport, once.
    test("story: hidden text fades in on scroll and stays", async ({ page }) => {
      await page.goto(locale.home);
      const items = page.locator("#story [data-reveal]");
      const states = () =>
        items.evaluateAll((els) =>
          els.map((el) => ({
            state: (el as HTMLElement).dataset.revealState ?? "none",
            opacity: getComputedStyle(el).opacity,
          })),
        );
      // Below the fold on load, so every item waits.
      await expect.poll(async () => (await states()).every((s) => s.state === "pending")).toBe(true);
      const height = (await page.locator("#story").boundingBox())!.height;

      for (const item of await items.all()) await item.scrollIntoViewIfNeeded();
      await expect
        .poll(async () => (await states()).every((s) => s.state === "shown" && s.opacity === "1"))
        .toBe(true);
      // Opacity and transform only: the section keeps its height.
      expect((await page.locator("#story").boundingBox())!.height).toBe(height);

      // Back to the top and down again: nothing hides a second time.
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator("#story").scrollIntoViewIfNeeded();
      expect((await states()).every((s) => s.state === "shown" && s.opacity === "1")).toBe(true);
    });

    test("story: with reduced motion everything is shown at once", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(locale.home);
      await page.waitForLoadState("networkidle");
      const items = page.locator("#story [data-reveal]");
      expect(await items.count()).toBeGreaterThan(0);
      const styles = await items.evaluateAll((els) =>
        els.map((el) => ({
          state: (el as HTMLElement).dataset.revealState ?? "none",
          opacity: getComputedStyle(el).opacity,
          transform: getComputedStyle(el).transform,
        })),
      );
      for (const style of styles) {
        expect(style).toEqual({ state: "none", opacity: "1", transform: "none" });
      }
    });

    test("hero: one short entrance on load, in CSS, that ends visible", async ({ page }) => {
      await page.goto(locale.home);
      const parts = hero(page).locator("[data-enter]");
      expect(await parts.count()).toBeGreaterThan(0);
      const animations = await parts.evaluateAll((els) =>
        els.map((el) => {
          const style = getComputedStyle(el);
          return [style.animationName, style.animationDuration, style.animationIterationCount];
        }),
      );
      for (const animation of animations) expect(animation).toEqual(["enter", "0.5s", "1"]);
      await expect
        .poll(() => parts.evaluateAll((els) => els.every((el) => getComputedStyle(el).opacity === "1")))
        .toBe(true);

      // In the first frame the label and the headline are already opaque
      // (they only move); the parts after them fade in.
      const firstFrame = await parts.evaluateAll((els) =>
        els.map((el) => {
          const element = el as HTMLElement;
          element.style.animation = "none";
          void element.offsetWidth;
          element.style.animation = "";
          const [animation] = element.getAnimations();
          animation.pause();
          animation.currentTime = 0;
          const opacity = getComputedStyle(element).opacity;
          animation.finish();
          return [element.dataset.enter, opacity];
        }),
      );
      for (const [step, opacity] of firstFrame) expect(opacity).toBe(step === "1" ? "1" : "0");
    });

    // Every section after the hero comes in as the story does, block by
    // block and once, through one observer for the whole page that is
    // dropped when nothing is left to show. Opacity and transform only, so
    // nothing moves in the layout. The footer does not move at all.
    test("sections: blocks below the fold come in once, without moving the layout", async ({
      page,
    }) => {
      await page.addInitScript(() => {
        const Native = window.IntersectionObserver;
        const log = { created: 0, disconnected: 0 };
        const reveal = new WeakSet<IntersectionObserver>();
        // The reveal observer is the one with its margin (components/ui/reveal.tsx).
        window.IntersectionObserver = class extends Native {
          constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
            super(callback, options);
            if (options?.rootMargin === "0px 0px -8% 0px") {
              reveal.add(this);
              log.created++;
            }
          }
          disconnect() {
            if (reveal.has(this)) log.disconnected++;
            super.disconnect();
          }
        };
        // Layout shifts are reported by Chromium only.
        const shift = { value: 0 };
        if (PerformanceObserver.supportedEntryTypes.includes("layout-shift")) {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as (PerformanceEntry & {
              value: number;
              hadRecentInput: boolean;
            })[]) {
              if (!entry.hadRecentInput) shift.value += entry.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
        }
        Object.assign(window, { __revealObservers: log, __layoutShift: shift });
      });
      await page.goto(locale.home);

      for (const id of revealedSections) {
        await expect(
          page.locator(`section[aria-labelledby="${id}-heading"] [data-reveal]`).first(),
        ).toBeAttached();
      }
      await expect(
        page.getByRole("contentinfo").locator("[data-reveal], [data-enter]"),
      ).toHaveCount(0);

      const items = page.locator("main [data-reveal]");
      const states = () =>
        items.evaluateAll((els) =>
          els.map((el) => ({
            state: (el as HTMLElement).dataset.revealState ?? "none",
            opacity: getComputedStyle(el).opacity,
            top: el.getBoundingClientRect().top,
          })),
        );
      const observers = () => page.evaluate(() => (window as RevealWindow).__revealObservers);
      await expect.poll(async () => (await states()).some((s) => s.state === "pending")).toBe(true);
      expect(await observers()).toEqual({ created: 1, disconnected: 0 });
      // Nothing that was on screen when the script ran is hidden.
      const viewport = page.viewportSize()!.height;
      for (const s of await states()) if (s.top < viewport) expect(s.state).not.toBe("pending");
      const height = (await page.getByRole("main").boundingBox())!.height;

      // Read down the page: each block is shown as it is reached.
      for (const item of await items.all()) {
        await item.evaluate((el) => el.scrollIntoView({ block: "center" }));
        await expect(item).not.toHaveAttribute("data-reveal-state", "pending");
      }
      await expect.poll(async () => (await states()).every((s) => s.opacity === "1")).toBe(true);
      expect((await page.getByRole("main").boundingBox())!.height).toBe(height);
      expect(await observers()).toEqual({ created: 1, disconnected: 1 });
      // Zero where layout shifts are not reported; the height of main, above,
      // is checked in every browser.
      const shift = await page.evaluate(() => (window as RevealWindow).__layoutShift.value);
      expect(shift).toBeLessThan(0.01);

      // Back to the top and down again: nothing hides a second time.
      await page.evaluate(() => window.scrollTo(0, 0));
      expect((await states()).every((s) => s.state !== "pending" && s.opacity === "1")).toBe(true);
    });

    test("sections: with reduced motion everything is shown at once", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(locale.home);
      await page.waitForLoadState("networkidle");
      const styles = await page
        .locator("main [data-reveal], main [data-enter]")
        .evaluateAll((els) =>
          els.map((el) => ({
            state: (el as HTMLElement).dataset.revealState ?? "none",
            opacity: getComputedStyle(el).opacity,
            transform: getComputedStyle(el).transform,
          })),
        );
      expect(styles.length).toBeGreaterThan(30);
      for (const style of styles) {
        expect(style).toEqual({ state: "none", opacity: "1", transform: "none" });
      }
    });

    test.describe("without JavaScript", () => {
      test.use({ javaScriptEnabled: false });

      test("sections: every block and the hero are visible", async ({ page }) => {
        await page.goto(locale.home);
        const opacities = () =>
          page
            .locator("main [data-reveal], main [data-enter]")
            .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
        expect((await opacities()).length).toBeGreaterThan(30);
        // The entrance is CSS only and ends on its own.
        await expect.poll(async () => (await opacities()).every((o) => o === "1")).toBe(true);
      });

      test("story: the whole story is there and visible", async ({ page }) => {
        await page.goto(locale.home);
        const section = page.getByRole("region", { name: locale.story.label });
        await expect(section.getByText(locale.story.pull, { exact: true })).toBeVisible();
        await expect(section.getByText(locale.story.callback, { exact: true })).toBeVisible();
        const opacities = await section
          .locator("[data-reveal]")
          .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
        expect(opacities.length).toBeGreaterThan(0);
        for (const opacity of opacities) expect(opacity).toBe("1");
      });
    });

    // Phones, and a 1280px window at 200% zoom (640 CSS pixels): one column,
    // nothing reaches past the screen.
    for (const [width, height] of [
      [320, 844],
      [390, 844],
      [640, 400],
    ]) {
      test(`story fits ${width}px, in one column`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.setViewportSize({ width, height });
        await page.goto(locale.home);
        const story = page.locator("#story");
        await story.scrollIntoViewIfNeeded();
        const layout = await story.evaluate((el) => {
          const viewport = document.documentElement.clientWidth;
          const rights = [...el.querySelectorAll("*")].map((n) => n.getBoundingClientRect().right);
          const lefts = [...el.querySelectorAll("p")].map((p) => Math.round(p.getBoundingClientRect().left));
          return {
            page: document.documentElement.scrollWidth - viewport,
            right: Math.max(...rights) - viewport,
            columns: new Set(lefts).size,
          };
        });
        expect(layout.page).toBeLessThanOrEqual(0);
        expect(layout.right).toBeLessThanOrEqual(0);
        expect(layout.columns).toBe(1);
        // Each chapter title sits above its text.
        for (const chapter of await story.locator("h3").all()) {
          await chapter.scrollIntoViewIfNeeded();
          await expect(chapter).toBeInViewport({ ratio: 1 });
        }
      });
    }

    test("interests: five themes between About and More work, framed as exploration", async ({
      page,
    }) => {
      await page.goto(locale.home);
      const section = page.getByRole("region", { name: locale.interests.label });
      await expect(section.getByRole("heading", { level: 2 })).toHaveAccessibleName(
        locale.interests.label,
      );
      await expect(section.getByText(locale.interests.lead, { exact: true })).toBeVisible();
      await expect(section.getByRole("heading", { level: 3 })).toHaveText([
        ...locale.interests.themes,
      ]);
      expect(await page.locator("main h2").evaluateAll((headings) => headings.map((h) => h.id))).toEqual([
        "work-heading",
        "about-heading",
        "story-heading",
        "academic-heading",
        "interests-heading",
        "more-work-heading",
        "technologies-heading",
      ]);

      const text = await section.innerText();
      for (const term of [...interestTerms, locale.interests.openSource]) {
        expect(text).toContain(term);
      }
      expect(fold(text)).toMatch(locale.interests.explore);
      expect(fold(text)).not.toMatch(expertiseClaims);
      // Type and rules only: no icons, logos or images.
      await expect(section.locator("img, svg, canvas")).toHaveCount(0);
    });

    test("interests: names and descriptions never collide", async ({ page }) => {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(locale.home);
        const rows = await page
          .getByRole("region", { name: locale.interests.label })
          .getByRole("listitem")
          .evaluateAll((items) =>
            items.map((item) => {
              const name = item.querySelector("h3")!.getBoundingClientRect();
              const body = item.querySelector("p")!.getBoundingClientRect();
              return { name, body, right: Math.max(name.right, body.right) };
            }),
          );
        expect(rows).toHaveLength(5);
        for (const { name, body, right } of rows) {
          expect(right, `inside the viewport at ${width}px`).toBeLessThanOrEqual(width);
          // Side by side on desktop, stacked on phones.
          if (width === 1440) expect(name.right).toBeLessThanOrEqual(body.left);
          else expect(name.bottom).toBeLessThanOrEqual(body.top);
        }
      }
    });

    test("label separators are read as commas, with no space before any punctuation", async ({
      page,
    }) => {
      await page.goto(locale.home);
      await expect(page.locator("#about-heading")).toHaveAccessibleName(locale.about);
      await expect(page.locator("#technologies-heading")).toHaveAccessibleName(
        locale.technologies,
      );
      expect(await hero(page).ariaSnapshot()).toContain(`- paragraph: ${locale.heroLabel}`);
      // The slash stays visible.
      expect(
        await page
          .locator("#about-heading .separator-slash")
          .evaluate((el) => getComputedStyle(el, "::before").content),
      ).toMatch(/^"\/"/);
      for (const landmark of [page.getByRole("main"), page.getByRole("contentinfo")]) {
        expect(await landmark.ariaSnapshot()).not.toMatch(/\s[,.;:](\s|$)/m);
      }
    });

    test("no phone number in the page", async ({ page }) => {
      await page.goto(locale.home);
      const markup = await page.content();
      expect(markup).not.toContain("tel:");
      // Greek mobile and landline numbers, with or without +30.
      expect(markup).not.toMatch(/(\+30[\s-]?)?\b(69|21)\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/);
    });
  });
}

test("keyboard order follows the page and every stop shows a focus ring", async ({ page }) => {
  await page.goto("/");
  const expected = [
    "Skip to content",
    "K. Papadogiannis, home",
    "Work",
    "About",
    "Résumé",
    "Contact",
    "English",
    "Ελληνικά",
    "Dark theme",
    "Selected work",
    "Résumé (PDF)",
    "GitHub",
    "LinkedIn",
    "Read case study",
    "Anastasia Zerva",
    "Read case study: ErgoHub",
    "Read case study: OpenStack",
    "Read case study: CUDA",
    "Read case study: Computer vision",
    "Read case study: Energy data mining",
    "GitHub",
    "LinkedIn",
    "ORCID profile — 0009-0008-9445-2484",
    "Email",
  ];

  const stops: string[] = [];
  for (let i = 0; i < expected.length; i++) {
    await page.keyboard.press("Tab");
    const stop = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const style = getComputedStyle(el);
      return {
        name: el.getAttribute("aria-label") ?? el.textContent!.replace(/\s+/g, " ").trim(),
        ring: el.matches(":focus-visible") && style.outlineStyle === "solid" && style.outlineWidth === "2px",
      };
    });
    expect(stop.ring, `focus ring on "${stop.name}"`).toBe(true);
    stops.push(stop.name);
  }
  expect(stops).toEqual(expected);
});
