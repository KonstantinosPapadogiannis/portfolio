import type { Locator, Page } from "@playwright/test";
import { test, expect } from "./fixtures";

const locales = [
  {
    home: "/",
    nav: "Main",
    menu: "Menu",
    links: { work: "Work", about: "About", contact: "Contact" },
    headings: { work: "Selected work", about: /^About\b/, contact: "Contact" },
  },
  {
    home: "/el",
    nav: "Κύρια πλοήγηση",
    menu: "Μενού",
    links: { work: "Έργα", about: "Σχετικά", contact: "Επικοινωνία" },
    headings: { work: "Επιλεγμένα έργα", about: /^Σχετικά/, contact: "Επικοινωνία" },
  },
] as const;

const sections = ["work", "about", "contact"] as const;

const hrefFor = (home: string, id: string) =>
  `${home === "/" ? "/" : home}#${id}`;

// True when the element with focus sits inside the section or after it, which
// is where the next Tab lands after a native fragment navigation.
const focusFollows = (page: Page, id: string) =>
  page.evaluate((sectionId) => {
    const section = document.getElementById(sectionId)!;
    const active = document.activeElement!;
    return (
      section.contains(active) ||
      Boolean(
        section.compareDocumentPosition(active) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      )
    );
  }, id);

async function expectSectionShown(section: Locator, heading: Locator) {
  await expect(heading).toBeInViewport();
  // The section starts inside the viewport, not cut off above it.
  expect((await section.boundingBox())!.y).toBeGreaterThanOrEqual(0);
}

for (const locale of locales) {
  test.describe(`header navigation (${locale.home})`, () => {
    test("section links point at the locale's homepage anchors", async ({
      page,
    }) => {
      await page.goto(locale.home);
      const nav = page.getByRole("navigation", { name: locale.nav });
      for (const id of sections) {
        await expect(
          nav.getByRole("link", { name: locale.links[id], exact: true }),
        ).toHaveAttribute("href", hrefFor(locale.home, id));
      }
    });

    for (const id of sections) {
      test(`clicking ${id} scrolls to #${id}`, async ({ page }) => {
        await page.goto(locale.home);
        await page
          .getByRole("navigation", { name: locale.nav })
          .getByRole("link", { name: locale.links[id], exact: true })
          .click();

        await expect(page).toHaveURL(new RegExp(`${locale.home === "/" ? "/" : "/el"}#${id}$`));
        const section = page.locator(`#${id}`);
        const heading = section.getByRole("heading", {
          level: 2,
          name: locale.headings[id],
        });
        await expectSectionShown(section, heading);
      });
    }

    test("keyboard: Enter on a section link moves the focus start point", async ({
      page,
    }) => {
      await page.goto(locale.home);
      for (const id of ["about", "contact"] as const) {
        await page.evaluate(() => window.scrollTo(0, 0));
        const link = page
          .getByRole("navigation", { name: locale.nav })
          .getByRole("link", { name: locale.links[id], exact: true });
        await link.focus();
        await page.keyboard.press("Enter");

        await expect(page).toHaveURL(new RegExp(`#${id}$`));
        await expect(page.locator(`#${id} h2`)).toBeInViewport();
        await page.keyboard.press("Tab");
        expect(await focusFollows(page, id)).toBe(true);
      }
    });

    test("section links work from another page", async ({ page }) => {
      await page.goto(locale.home === "/" ? "/resume" : "/el/resume");
      await page
        .getByRole("navigation", { name: locale.nav })
        .getByRole("link", { name: locale.links.contact, exact: true })
        .click();

      await expect(page).toHaveURL(new RegExp(`${locale.home === "/" ? "/" : "/el"}#contact$`));
      await expect(page.locator("#contact h2")).toBeInViewport();
    });
  });

  test.describe(`mobile navigation (${locale.home})`, () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("menu opens, follows a section link and closes", async ({ page }) => {
      await page.goto(locale.home);
      const desktopNav = page.locator("header nav").first();
      await expect(desktopNav).toBeHidden();

      const button = page.getByRole("button", { name: locale.menu });
      await expect(button).toHaveAttribute("aria-expanded", "false");
      await button.click();
      await expect(button).toHaveAttribute("aria-expanded", "true");

      const menu = page.locator(`#${await button.getAttribute("aria-controls")}`);
      await expect(menu).toBeVisible();
      await menu.getByRole("link", { name: locale.links.about, exact: true }).click();

      await expect(page).toHaveURL(new RegExp(`#about$`));
      await expect(menu).toBeHidden();
      await expect(button).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator("#about h2")).toBeInViewport();
    });

    test("Escape closes the menu and returns focus to the button", async ({
      page,
    }) => {
      await page.goto(locale.home);
      const button = page.getByRole("button", { name: locale.menu });
      await button.click();
      const menu = page.locator(`#${await button.getAttribute("aria-controls")}`);
      await menu.getByRole("link").first().focus();
      await page.keyboard.press("Escape");

      await expect(menu).toBeHidden();
      await expect(button).toBeFocused();
    });

  });

  test(`no horizontal overflow (${locale.home})`, async ({ page }) => {
    const prefix = locale.home === "/" ? "" : "/el";
    const paths = [locale.home, `${prefix}/resume`, `${prefix}/work/thesis`, `${prefix}/qa/typography`];
    for (const width of [390, 768, 1440, 1728]) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of paths) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        );
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    }
  });
}
