import { test, expect, html } from "./fixtures";

const anastasiaLinkedin = "https://www.linkedin.com/in/anastasia-zervas/";

const collaboratorLocations = [
  { label: "My Story EN", path: "/", scope: "section#story", name: "Anastasia Zerva" },
  { label: "My Story EL", path: "/el", scope: "section#story", name: "Αναστασία Ζέρβα" },
  { label: "ErgoHub EN", path: "/work/ergohub", scope: "section#overview", name: "Anastasia Zerva" },
  { label: "ErgoHub EL", path: "/el/work/ergohub", scope: "section#overview", name: "Αναστασία Ζέρβα" },
  { label: "Thesis EN", path: "/work/thesis", scope: "section#overview", name: "Anastasia Zerva" },
  { label: "Thesis EL", path: "/el/work/thesis", scope: "section#overview", name: "Αναστασία Ζέρβα" },
] as const;

for (const location of collaboratorLocations) {
  test(`${location.label}: the collaborator link is a usable external anchor`, async ({ page }) => {
    await page.route(anastasiaLinkedin, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<!doctype html><title>Anastasia Zerva</title>",
      });
    });

    const openSourcePage = async () => {
      await page.goto(location.path);
      return page.locator(location.scope).getByRole("link", { name: location.name, exact: true });
    };

    let link = await openSourcePage();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", anastasiaLinkedin);
    await expect(link).toHaveText(location.name);
    expect(await link.evaluate((element) => element.tagName)).toBe("A");

    await link.focus();
    await expect(link).toBeFocused();
    expect(
      await link.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const hit = document.elementFromPoint(
          bounds.left + bounds.width / 2,
          bounds.top + bounds.height / 2,
        );
        return hit === element || (hit !== null && element.contains(hit));
      }),
    ).toBe(true);

    await link.click();
    await expect(page).toHaveURL(anastasiaLinkedin);

    link = await openSourcePage();
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(anastasiaLinkedin);
  });
}

const footerRoutes = ["/", "/el", "/work/thesis", "/el/work/thesis"] as const;
const profileUrls = [
  "https://github.com/KonstantinosPapadogiannis",
  "https://www.linkedin.com/in/konstantinos-papadogiannis/",
  "https://orcid.org/0009-0008-9445-2484",
] as const;

for (const path of footerRoutes) {
  test(`${path}: the footer contains only the four professional contact items`, async ({ page }) => {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ["light", "dark"] as const) {
        await page.goto(path);
        await page.evaluate((value) => localStorage.setItem("theme", value), theme);
        await page.reload();
        await expect(html(page)).toHaveAttribute("data-theme", theme);

        const footer = page.getByRole("contentinfo");
        await expect(footer).toBeVisible();
        await expect(footer).not.toContainText("Built with Next.js + TypeScript");
        await expect(footer).not.toContainText("Deployed on Vercel");
        await expect(footer).not.toContainText("Konstantinos Papadogiannis");
        await expect(footer).not.toContainText("Open to graduate and junior roles");
        await expect(footer).not.toContainText("Athens, Greece");
        await expect(footer.getByRole("link")).toHaveCount(4);
        for (const href of profileUrls) {
          await expect(footer.locator(`a[href="${href}"]`)).toHaveCount(1);
        }
        await expect(
          footer.locator('a[href="mailto:konstantinospapadogiannis.dev@gmail.com"]'),
        ).toHaveCount(1);
      }
    }
  });
}
