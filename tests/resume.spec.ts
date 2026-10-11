import { readFile } from "node:fs/promises";
import { test, expect } from "./fixtures";
import { readPdf } from "./pdf";

// The public CV, built from cv/ and committed at this path. These tests read
// the file the server sends, so a missing or replaced PDF fails here.
const cvPath = "/downloads/konstantinos-papadogiannis-cv.pdf";

const approvedLinks = [
  "mailto:konstantinospapadogiannis.dev@gmail.com",
  "https://www.linkedin.com/in/konstantinos-papadogiannis/",
  "https://github.com/KonstantinosPapadogiannis",
];

// Patterns, not values: an international or Greek mobile number, a
// university address, a student number and a link to a single repository.
const phone = /(\+|\b00)\d{2}[\s\d]{8,}|\b69\d([\s.-]?\d){7}\b/;
const universityAddress = /hua\.gr/i;
const studentNumber = /\bit\d{6,8}\b/i;
const repositoryLink = /github\.com\/[^\s/]+\/[^\s/]+/i;

test("the CV is served as a one-page PDF the browser can show", async ({ request }) => {
  const response = await request.get(cvPath);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("application/pdf");
  // No attachment disposition, so "View" opens the browser's PDF viewer.
  expect(response.headers()["content-disposition"] ?? "").not.toMatch(/attachment/i);

  const body = await response.body();
  expect(body.subarray(0, 5).toString("latin1")).toBe("%PDF-");
  expect(readPdf(body).pages).toBe(1);
});

test("the CV states the approved academic record and contact details", async ({ request }) => {
  const { text, information } = readPdf(await (await request.get(cvPath)).body());

  expect(text).toContain("Konstantinos Papadogiannis");
  expect(text).toContain("Harokopio University of Athens");
  expect(text).toContain("Average 7.51 / 10");
  expect(text).toMatch(/Bachelor[’']s Thesis: 10 \/ 10/);
  expect(text).toContain("konstantinospapadogiannis.dev@gmail.com");
  expect(text).not.toMatch(/7\.45|Very Good|Λίαν/i);

  expect(information.Title).toBe("Konstantinos Papadogiannis, Curriculum Vitae");
  expect(information.Author).toBe("Konstantinos Papadogiannis");
});

test("the CV has no phone number, university details or repository links", async ({
  request,
}) => {
  const { text, links, information } = readPdf(await (await request.get(cvPath)).body());
  const everything = [text, ...links, ...Object.values(information)].join("\n");

  expect(everything).not.toMatch(phone);
  expect(everything).not.toMatch(universityAddress);
  expect(everything).not.toMatch(studentNumber);
  expect(everything).not.toMatch(repositoryLink);
  expect(links.toSorted()).toEqual(approvedLinks.toSorted());
});

test("the CV carries no local paths or build file names", async ({ request }) => {
  const { raw, information } = readPdf(await (await request.get(cvPath)).body());

  expect(raw).not.toMatch(/\/(home|Users|tmp)\//);
  expect(raw).not.toMatch(/PTEX\.|\.tex\b/);
  expect(Object.keys(information).toSorted()).toEqual(
    ["Author", "CreationDate", "Creator", "Keywords", "ModDate", "Producer", "Subject", "Title"],
  );
});

test("the résumé page downloads the same PDF it serves", async ({ page, request }) => {
  const served = await (await request.get(cvPath)).body();

  for (const [path, label] of [
    ["/resume", "Download PDF"],
    ["/el/resume", "Λήψη PDF"],
  ] as const) {
    await page.goto(path);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: label }).click(),
    ]);
    expect(download.suggestedFilename()).toBe("konstantinos-papadogiannis-cv.pdf");
    const saved = await readFile(await download.path());
    expect(saved.equals(served)).toBe(true);
  }
});

test("the résumé page's view link opens the PDF in place", async ({ page }) => {
  for (const [path, label] of [
    ["/resume", "View PDF"],
    ["/el/resume", "Προβολή PDF"],
  ] as const) {
    await page.goto(path);
    const view = page.getByRole("link", { name: label });
    await expect(view).toHaveAttribute("href", cvPath);
    await expect(view).not.toHaveAttribute("download");
    const response = await page.request.get(new URL(cvPath, page.url()).href);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("application/pdf");
  }
});
