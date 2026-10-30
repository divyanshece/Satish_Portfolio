#!/usr/bin/env node
/**
 * The head gate. `grep-check.mjs` guards house style in src/; this walks the
 * built site and checks what a search engine and a link preview actually read.
 *
 *   node scripts/seo-check.mjs            # after npm run build
 *
 * Failures are things that are wrong: a missing canonical, a duplicate title, a
 * share card that would not render, structured data that does not parse.
 * Warnings are things that are merely long — a title Google will truncate is
 * not a defect, but it is worth seeing before it ships.
 *
 * Zero dependencies, and it reads only what is on disk.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(here, "../dist");
const SITE = "https://satishregonda.in";

if (!fs.existsSync(DIST)) {
  console.error("seo-check — no dist/. Run `npm run build` first.");
  process.exit(1);
}

/* ---- helpers ---------------------------------------------------------- */

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });

const decode = (s) =>
  s
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

const one = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]) : null;
};
const all = (html, re) => [...html.matchAll(re)].map((m) => decode(m[1]));

const meta = (html, name) =>
  one(html, new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, "i"));
const prop = (html, p) =>
  one(html, new RegExp(`<meta\\s+property="${p}"\\s+content="([^"]*)"`, "i"));

/** dist/about/index.html → /about/ ; dist/index.html → / ; dist/404.html → /404 */
function routeOf(file) {
  const rel = path.relative(DIST, file).split(path.sep).join("/");
  if (rel === "404.html") return "/404";
  return "/" + rel.replace(/index\.html$/, "");
}

/* ---- checks ----------------------------------------------------------- */

const files = walk(DIST).sort();
const errors = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();

for (const file of files) {
  const route = routeOf(file);
  const html = fs.readFileSync(file, "utf8");
  const fail = (msg) => errors.push({ route, msg });
  const warn = (msg) => warnings.push({ route, msg });

  /* one title, one h1 */
  const titleTags = all(html, /<title[^>]*>([\s\S]*?)<\/title>/gi);
  if (titleTags.length !== 1) fail(`${titleTags.length} <title> elements, expected 1`);
  const h1s = all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  if (h1s.length !== 1) fail(`${h1s.length} <h1> elements, expected 1`);

  const title = titleTags[0]?.trim();
  if (title) {
    if (titles.has(title)) fail(`title duplicates ${titles.get(title)}`);
    else titles.set(title, route);
    if (title.length > 60) warn(`title is ${title.length} chars, over the ~60 a result line shows`);
  }

  /* description */
  const desc = meta(html, "description");
  if (!desc) fail("no meta description");
  else {
    if (descriptions.has(desc)) fail(`description duplicates ${descriptions.get(desc)}`);
    else descriptions.set(desc, route);
    if (desc.length > 160) warn(`description is ${desc.length} chars, over ~160`);
    if (desc.length < 70) warn(`description is only ${desc.length} chars`);
  }

  /* canonical: self-referential and absolute, except on the 404 */
  const canonical = one(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  if (route === "/404") {
    if (canonical) fail(`404 must not name a canonical (found ${canonical})`);
  } else if (!canonical) {
    fail("no canonical");
  } else {
    if (!canonical.startsWith("https://")) fail(`canonical is not absolute https: ${canonical}`);
    const want = `${SITE}${route}`;
    if (canonical !== want) fail(`canonical is ${canonical}, expected ${want}`);
  }

  /* the share card */
  for (const p of ["og:title", "og:description", "og:url", "og:image", "og:type"]) {
    if (!prop(html, p)) fail(`no ${p}`);
  }
  const ogImage = prop(html, "og:image");
  if (ogImage && !/^https?:\/\//.test(ogImage)) fail(`og:image is not absolute: ${ogImage}`);
  if (ogImage) {
    const local = path.join(DIST, ogImage.replace(SITE, ""));
    if (ogImage.startsWith(SITE) && !fs.existsSync(local)) fail(`og:image is missing from dist: ${ogImage}`);
  }
  const ogUrl = prop(html, "og:url");
  if (ogUrl && !/^https?:\/\//.test(ogUrl)) fail(`og:url is not absolute: ${ogUrl}`);

  /* the only script this site permits, and it has to parse */
  const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
  for (const [, attrs, body] of scripts) {
    if (!/type="application\/ld\+json"/i.test(attrs)) {
      fail(`a <script> that is not application/ld+json: <script${attrs}>`);
      continue;
    }
    try {
      JSON.parse(body);
    } catch (e) {
      fail(`JSON-LD does not parse: ${e.message}`);
    }
  }

  /* a link that leaves the site opens a tab of its own, so the reader does not
     lose their place. src/lib/links.ts decides; this is what stops one being
     added later without it. */
  for (const [, tag, href] of html.matchAll(/<a\s+([^>]*href="(https?:\/\/[^"]*)"[^>]*)>/gi)) {
    if (href.includes("satishregonda.in")) continue;
    if (!/target="_blank"/.test(tag)) fail(`external link with no target="_blank": ${href}`);
    else if (!/rel="[^"]*noopener/.test(tag)) fail(`target="_blank" with no rel=noopener: ${href}`);
  }

  /* images: alt, and a box reserved before they load */
  for (const [, tag] of html.matchAll(/<img\s+([^>]*)>/gi)) {
    if (!/\balt=/.test(tag)) fail(`<img> with no alt: ${tag.slice(0, 80)}`);
    if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag))
      fail(`<img> with no width/height: ${tag.slice(0, 80)}`);
  }

  /* a heading order a reader can follow */
  const firstHeading = html.match(/<h([1-6])[^>]*>/i);
  if (firstHeading && firstHeading[1] !== "1") warn(`first heading is an h${firstHeading[1]}, before the h1`);
}

/* the sitemap covers every page except the 404 */
const sitemap = path.join(DIST, "sitemap-0.xml");
if (!fs.existsSync(sitemap)) {
  errors.push({ route: "/sitemap-0.xml", msg: "no sitemap" });
} else {
  const locs = all(fs.readFileSync(sitemap, "utf8"), /<loc>([^<]*)<\/loc>/g);
  const expected = files.length - 1; // dist/404.html is deliberately not listed
  if (locs.length !== expected)
    errors.push({ route: "/sitemap-0.xml", msg: `${locs.length} URLs for ${expected} indexable pages` });
  const bad = locs.filter((l) => !l.startsWith(`${SITE}/`));
  if (bad.length) errors.push({ route: "/sitemap-0.xml", msg: `${bad.length} URL(s) off-site, e.g. ${bad[0]}` });
}

/* robots.txt names the sitemap */
const robots = path.join(DIST, "robots.txt");
if (!fs.existsSync(robots)) errors.push({ route: "/robots.txt", msg: "missing" });
else if (!fs.readFileSync(robots, "utf8").includes("Sitemap:"))
  errors.push({ route: "/robots.txt", msg: "no Sitemap: directive" });

/* ---- report ----------------------------------------------------------- */

console.log("seo-check — the head, as a crawler reads it\n");
console.log(`  ${files.length} pages, ${titles.size} unique titles, ${descriptions.size} unique descriptions`);

for (const w of warnings) console.log(`  warn  ${w.route}\n          ${w.msg}`);
for (const e of errors) console.log(`  FAIL  ${e.route}\n          ${e.msg}`);

console.log(
  `\n  ${errors.length} failure(s), ${warnings.length} warning(s).` +
    (errors.length ? "" : " The head holds.")
);
process.exit(errors.length ? 1 : 0);
