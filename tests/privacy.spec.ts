import { readdir, readFile } from "node:fs/promises";
import type { APIRequestContext } from "@playwright/test";
import { test, expect, publicPages } from "./fixtures";
import * as privacy from "./privacy";

// Everything a visitor can fetch is checked against the patterns in
// privacy.ts: each page as served (markup, metadata, structured data and the
// data the browser renders it from), the 404 page, robots.txt, the sitemap,
// the scripts and styles the pages load, and the files in public/. The CV
// has its own checks in resume.spec.ts.

const notFoundPages = ["/does-not-exist", "/el/work/does-not-exist"];

async function served(request: APIRequestContext) {
  const documents = new Map<string, string>();
  for (const path of [...publicPages, ...notFoundPages, "/robots.txt", "/sitemap.xml"]) {
    documents.set(path, await (await request.get(path)).text());
  }
  const assets = new Set<string>();
  for (const body of documents.values()) {
    for (const [asset] of body.matchAll(/\/_next\/static\/[^"'\s\\)]+\.(?:js|css)/g)) {
      assets.add(asset);
    }
  }
  return { documents, assets: [...assets] };
}

function emailsIn(text: string) {
  return [...new Set(text.match(privacy.email) ?? [])];
}

test("pages, metadata and structured data show no private details", async ({ request }) => {
  const { documents } = await served(request);
  expect(documents.size).toBe(publicPages.length + notFoundPages.length + 2);

  for (const [path, body] of documents) {
    for (const [name, pattern] of Object.entries({
      phone: privacy.phone,
      universityAddress: privacy.universityAddress,
      studentNumber: privacy.studentNumber,
      repositoryLink: privacy.repositoryLink,
      age: privacy.age,
      classification: privacy.classification,
      localPath: privacy.localPath,
      deploymentHost: privacy.deploymentHost,
    })) {
      expect(pattern.test(body), `${name} in ${path}`).toBe(false);
    }
    for (const address of emailsIn(body)) {
      expect(address, `email address in ${path}`).toBe(privacy.publicEmail);
    }
  }
});

test("no page text mentions a year before 2000", async ({ page }) => {
  for (const path of publicPages) {
    await page.goto(path);
    const text = await page.evaluate(() =>
      [
        document.body.innerText,
        document.title,
        ...[...document.querySelectorAll("meta[content]")].map((meta) => meta.getAttribute("content")),
        ...[...document.querySelectorAll('script[type="application/ld+json"]')].map(
          (script) => script.textContent,
        ),
        ...[...document.querySelectorAll("[alt], [aria-label], [title]")].flatMap((element) =>
          ["alt", "aria-label", "title"].map((name) => element.getAttribute(name) ?? ""),
        ),
      ].join("\n"),
    );
    expect(privacy.earlyYear.test(text), `year before 2000 in ${path}`).toBe(false);
  }
});

test("scripts and styles carry no private details and no source maps", async ({ request }) => {
  const { assets } = await served(request);
  expect(assets.length).toBeGreaterThan(5);

  for (const asset of assets) {
    const response = await request.get(asset);
    expect(response.status(), asset).toBe(200);
    const body = await response.text();
    for (const [name, pattern] of Object.entries({
      universityAddress: privacy.universityAddress,
      studentNumber: privacy.studentNumber,
      deploymentHost: privacy.deploymentHost,
      // Library code mentions file:// URLs; a path on this computer is the
      // concern here.
      localPath: /\/home\/[a-z]|\/Users\/[A-Z]/,
    })) {
      expect(pattern.test(body), `${name} in ${asset}`).toBe(false);
    }
    for (const address of emailsIn(body)) {
      expect(address, `email address in ${asset}`).toBe(privacy.publicEmail);
    }
    expect(body, `source map reference in ${asset}`).not.toContain("sourceMappingURL");
    expect((await request.get(`${asset}.map`)).status(), `${asset}.map`).toBe(404);
  }
});

test("public/ holds only the files the site serves, without embedded metadata", async () => {
  const files = (await readdir("public", { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => `${entry.parentPath.replace(/^public\/?/, "")}/${entry.name}`.replace(/^\//, ""))
    .toSorted();
  expect(files).toEqual([
    "downloads/konstantinos-papadogiannis-cv.pdf",
    "favicon.ico",
    "fonts/inter-4.001/OFL.txt",
    "fonts/inter-4.001/cyrillic-ext.woff2",
    "fonts/inter-4.001/cyrillic.woff2",
    "fonts/inter-4.001/greek-ext.woff2",
    "fonts/inter-4.001/greek.woff2",
    "fonts/inter-4.001/latin-ext.woff2",
    "fonts/inter-4.001/latin.woff2",
    "fonts/inter-4.001/vietnamese.woff2",
    "images/ORCID-iD_icon_vector.svg",
    "images/portrait.jpg",
    "og/el.png",
    "og/en.png",
  ]);

  // The portrait is a plain JFIF file: no EXIF or XMP block (APP1), so no
  // camera, location or editing history.
  const portrait = await readFile("public/images/portrait.jpg");
  const markers: number[] = [];
  for (let offset = 2; offset < portrait.length && portrait[offset] === 0xff; ) {
    const marker = portrait[offset + 1];
    if (marker === 0xda) break;
    markers.push(marker);
    offset += 2 + portrait.readUInt16BE(offset + 2);
  }
  expect(markers).toContain(0xe0);
  expect(markers).not.toContain(0xe1);

  // The share images hold pixels only: no text or EXIF chunks.
  for (const locale of ["en", "el"]) {
    const png = await readFile(`public/og/${locale}.png`);
    const chunks: string[] = [];
    for (let offset = 8; offset < png.length; offset += 12 + png.readUInt32BE(offset)) {
      chunks.push(png.toString("latin1", offset + 4, offset + 8));
    }
    expect(chunks.at(-1), `og/${locale}.png`).toBe("IEND");
    expect(chunks.filter((type) => /^(tEXt|iTXt|zTXt|eXIf)$/.test(type))).toEqual([]);
  }

  // Inter's files are as Google Fonts serves them: their name table holds
  // the font's copyright, version and licence address, which the licence
  // beside them repeats.
  for (const text of ["public/images/ORCID-iD_icon_vector.svg", "public/fonts/inter-4.001/OFL.txt"]) {
    const body = await readFile(text, "utf8");
    expect(privacy.localPath.test(body), text).toBe(false);
    expect(emailsIn(body), text).toEqual([]);
  }
});
