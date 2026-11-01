#!/usr/bin/env node
/**
 * fetch-abstracts — fill in the abstract of any paper that has none.
 *
 * WHY THIS EXISTS
 * ---------------
 * Google Scholar will not index a paper page that carries bibliographic data
 * and nothing else. Every `/publications/<id>/` emits citation_abstract_html_url
 * only when the record has an abstract, so a paper without one is on the site
 * and invisible to Scholar. Asking a busy person to paste an abstract for every
 * new paper is a step that will be skipped, so this does it instead.
 *
 * WHERE IT LOOKS
 *   1. Crossref   — the publisher's own deposited abstract, usually complete.
 *   2. OpenAlex   — its inverted word index, rebuilt into prose.
 * Semantic Scholar was tried for the ten this could not find on 2026-11-01 and
 * added nothing, so it is not called.
 *
 * WHAT IT WILL NOT DO
 * -------------------
 * It never touches a record that already has an abstract. A sentence he wrote
 * himself always wins over a publisher's deposit, and this script must be safe
 * to run at any time without reviewing the diff.
 *
 * It never fails the build. A paper with no abstract is a page that is merely
 * less visible; an unreachable API must not stand between him and a publish.
 * Network errors are counted, reported and shrugged off.
 *
 *   node scripts/fetch-abstracts.mjs           (or: npm run abstracts)
 *   node scripts/fetch-abstracts.mjs --dry-run
 *
 * In GitHub Actions it also writes `changed=true|false` to GITHUB_OUTPUT, which
 * is what lets the workflow commit a newly-found abstract back to the
 * repository rather than re-fetching it on every publish.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "src/data/publications.json");
const DRY = process.argv.includes("--dry-run");

/* Crossref and OpenAlex both ask for a contact address and both give faster,
   more reliable service when you supply one. This is the project's address,
   not a personal one. */
const UA = "satishregonda.in (+https://satishregonda.in; mailto:snapflood@iith.ac.in)";

/** The schema requires 40 characters. Anything shorter is a stub, not an abstract. */
const MIN = 40;

async function getJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Crossref returns JATS XML. Strip it to prose.
 *
 * Two things seen in the wild and handled here: a leading
 * <jats:title>Abstract</jats:title>, and a bare "Abstract." left over once the
 * tags are gone. Both would otherwise be printed on the page as if he had
 * written the word twice.
 */
function tidy(raw) {
  if (!raw) return null;
  let s = String(raw)
    .replace(/<jats:title>\s*abstract\s*<\/jats:title>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  s = s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/­/g, "")          // soft hyphens break search matching
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^abstract[:.\s—-]+/i, "")
    .trim();
  return s.length >= MIN ? s : null;
}

/** OpenAlex stores {word: [positions]}. Put the words back in order. */
function fromInverted(index) {
  if (!index) return null;
  const at = [];
  for (const [word, places] of Object.entries(index)) for (const i of places) at[i] = word;
  const words = at.filter((w) => w !== undefined);
  return words.length ? tidy(words.join(" ")) : null;
}

const pubs = JSON.parse(fs.readFileSync(FILE, "utf8"));
const todo = pubs.filter((p) => !p.abstract && p.doi);
const noDoi = pubs.filter((p) => !p.abstract && !p.doi);

console.log("fetch-abstracts");
console.log(`  ${pubs.length} publications, ${pubs.length - todo.length - noDoi.length} already have an abstract.`);
if (!todo.length) {
  console.log("  Nothing to look up.");
}

let found = 0;
const failed = [];
for (const p of todo) {
  const doi = encodeURI(p.doi);
  let text = null;
  let source = null;

  try {
    const m = await getJson(`https://api.crossref.org/works/${doi}`);
    text = tidy(m?.message?.abstract);
    if (text) source = "crossref";
  } catch (err) {
    failed.push(`${p.id} (crossref: ${err.message})`);
  }

  if (!text) {
    try {
      const w = await getJson(`https://api.openalex.org/works/doi:${doi}`);
      text = fromInverted(w?.abstract_inverted_index);
      if (text) source = "openalex";
    } catch (err) {
      failed.push(`${p.id} (openalex: ${err.message})`);
    }
  }

  if (text) {
    p.abstract = text;
    found += 1;
    console.log(`  + ${p.id} — ${text.length} chars from ${source}`);
  } else {
    console.log(`  · ${p.id} — no abstract deposited anywhere`);
  }

  await new Promise((r) => setTimeout(r, 250)); // be a polite client
}

if (noDoi.length) {
  console.log(`  ${noDoi.length} record(s) have no DOI, so there is nothing to look up:`);
  for (const p of noDoi) console.log(`    ${p.id}`);
}

if (failed.length) {
  console.log("");
  console.log("  Lookups that errored (the paper is unchanged, not lost):");
  for (const f of failed) console.log(`    ${f}`);
}

const changed = found > 0;
if (changed && !DRY) {
  fs.writeFileSync(FILE, `${JSON.stringify(pubs, null, 2)}\n`, "utf8");
}

console.log("");
const still = pubs.filter((p) => !p.abstract).length;
console.log(
  changed
    ? `  ${found} abstract(s) added${DRY ? " (dry run, nothing written)" : ""}. ${still} of ${pubs.length} still have none.`
    : `  No new abstracts. ${still} of ${pubs.length} have none; those need his own words.`
);

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed && !DRY}\n`, "utf8");
}
