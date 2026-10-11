import { test, expect, html, publicPages } from "./fixtures";
import { isIndexable } from "../src/config/deployment";

const cv = "/downloads/konstantinos-papadogiannis-cv.pdf";

test("every response carries the security headers", async ({ request }) => {
  for (const path of ["/", "/el/work/cuda", "/does-not-exist", "/robots.txt", "/og/en.png", cv]) {
    const headers = (await request.get(path)).headers();
    expect(headers["x-content-type-options"], path).toBe("nosniff");
    expect(headers["referrer-policy"], path).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"], path).toContain("camera=()");
    expect(headers["permissions-policy"], path).toContain("geolocation=()");
    expect(headers["strict-transport-security"], path).toBe("max-age=63072000");
    expect(headers["cross-origin-opener-policy"], path).toBe("same-origin");
    expect(headers["x-frame-options"], path).toBe("DENY");
    expect(headers, path).not.toHaveProperty("x-powered-by");
    if (isIndexable()) expect(headers, path).not.toHaveProperty("x-robots-tag");
  }
});

test("pages have a content security policy limited to this origin", async ({ request }) => {
  for (const path of ["/", "/el/resume", "/does-not-exist", "/robots.txt"]) {
    const policy = (await request.get(path)).headers()["content-security-policy"] ?? "";
    const directives = Object.fromEntries(
      policy.split(";").map((directive) => {
        const [name, ...values] = directive.trim().split(/\s+/);
        return [name, values.join(" ")];
      }),
    );
    expect(directives, path).toEqual({
      "default-src": "'self'",
      "script-src": "'self' 'unsafe-inline'",
      "style-src": "'self' 'unsafe-inline'",
      "img-src": "'self'",
      "font-src": "'self'",
      "connect-src": "'self'",
      "object-src": "'none'",
      "base-uri": "'self'",
      "form-action": "'self'",
      "frame-ancestors": "'none'",
    });
  }

  // The CV is a PDF, opened by the browser's viewer, not a page.
  const pdf = (await request.get(cv)).headers();
  expect(pdf["content-type"]).toBe("application/pdf");
  expect(pdf).not.toHaveProperty("content-security-policy");
});

test("nothing on the site breaks the policy", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { __violations: string[] }).__violations = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      (window as unknown as { __violations: string[] }).__violations.push(
        `${event.violatedDirective} ${event.blockedURI}`,
      );
    });
  });
  const violations = () =>
    page.evaluate(() => (window as unknown as { __violations: string[] }).__violations);

  for (const path of publicPages) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(await violations(), path).toEqual([]);
  }

  // The theme script, a client-side navigation and the fonts after it.
  await page.goto("/");
  await page.getByRole("button", { name: "Dark theme" }).click();
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
  await page.getByRole("banner").getByRole("link", { name: "Résumé" }).click();
  await expect(page).toHaveURL(/\/resume$/);
  await page.reload();
  await expect(html(page)).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => document.fonts.status)).toBe("loaded");
  expect(await violations()).toEqual([]);
});
