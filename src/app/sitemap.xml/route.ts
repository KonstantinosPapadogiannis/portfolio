import { siteConfig } from "@/config/site";

const sitemapNamespace = "http://www.sitemaps.org/schemas/sitemap/0.9";
const xhtmlNamespace = "http://www.w3.org/1999/xhtml";

const pages = [
  "/",
  "/resume",
  "/work/thesis",
  "/work/ergohub",
  "/work/openstack",
  "/work/cuda",
  "/work/computer-vision",
  "/work/energy-data-mining",
] as const;

function escapeXml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&apos;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

function absoluteUrl(path: string) {
  return `${siteConfig.url}${path}`;
}

function greekPath(path: string) {
  return path === "/" ? "/el" : `/el${path}`;
}

function sitemapEntry(location: string, english: string, greek: string) {
  const alternate = (language: string, href: string) =>
    `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(href)}" />`;

  return [
    "  <url>",
    `    <loc>${escapeXml(location)}</loc>`,
    alternate("en", english),
    alternate("el", greek),
    alternate("x-default", english),
    "  </url>",
  ].join("\n");
}

export function GET() {
  const entries = pages.flatMap((path) => {
    const english = absoluteUrl(path);
    const greek = absoluteUrl(greekPath(path));

    return [sitemapEntry(english, english, greek), sitemapEntry(greek, english, greek)];
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<urlset xmlns="${sitemapNamespace}" xmlns:xhtml="${xhtmlNamespace}">`,
    ...entries,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
