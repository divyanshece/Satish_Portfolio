#!/usr/bin/env node
/**
 * Fills the citation fields on src/data/publications.json from Crossref.
 *
 * Run by hand, once, when a paper is added or a DOI is corrected:
 *
 *   node scripts/backfill-crossref.mjs            # show what would change
 *   node scripts/backfill-crossref.mjs --write    # write it
 *
 * This is NOT part of the build. `npm run build` never touches the network:
 * the site is built from the committed JSON, so it can be rebuilt years from
 * now with every service in this file switched off.
 *
 * It only fills fields that are empty, and never overwrites a value already in
 * the file — a hand correction beats the registry. Titles and author lists are
 * left alone entirely: those are his record, formatted his way.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const file = path.resolve(here, "../src/data/publications.json");
const WRITE = process.argv.includes("--write");
/* Crossref asks callers to identify themselves; it buys the polite rate limit. */
const MAILTO = process.env.CROSSREF_MAILTO || "satishr@ce.iith.ac.in";

const pubs = JSON.parse(fs.readFileSync(file, "utf8"));

/** "2006-09" from Crossref's [[2006, 9, 14]] parts, as much as it actually gives. */
function isoDate(parts) {
  const p = parts?.["date-parts"]?.[0];
  if (!Array.isArray(p) || !p[0]) return undefined;
  const [y, m, d] = p;
  if (d) return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  if (m) return `${y}-${String(m).padStart(2, "0")}`;
  return String(y);
}

/** The print ISSN where Crossref distinguishes them, else the first listed. */
function issnOf(w) {
  const typed = w["issn-type"] || [];
  const print = typed.find((t) => t.type === "print")?.value;
  return print || typed[0]?.value || (Array.isArray(w.ISSN) ? w.ISSN[0] : undefined);
}

const FIELDS = ["issn", "volume", "issue", "pages", "date"];
let filled = 0, missing = 0;

for (const pub of pubs) {
  if (!pub.doi) { missing++; console.log(`  no doi   ${pub.id}`); continue; }

  const url = `https://api.crossref.org/works/${encodeURIComponent(pub.doi)}?mailto=${MAILTO}`;
  let w;
  try {
    const res = await fetch(url, { headers: { "User-Agent": `satishregonda.in (mailto:${MAILTO})` } });
    if (!res.ok) { console.log(`  HTTP ${res.status} ${pub.id} (${pub.doi})`); continue; }
    w = (await res.json()).message;
  } catch (e) {
    console.log(`  failed  ${pub.id}: ${e.message}`);
    continue;
  }

  const found = {
    issn: issnOf(w),
    volume: w.volume,
    issue: w.issue,
    pages: w.page,
    date: isoDate(w["published-print"]) || isoDate(w["published-online"]) || isoDate(w.published),
  };

  /* A year that disagrees with the registry is worth knowing about, but the
     file wins: he dates a paper by when it appeared, not when it was posted.
     Where they disagree the full date is dropped rather than written, so the
     citation metadata can never contradict the year the page shows. */
  const cy = found.date?.slice(0, 4);
  const clash = cy && String(pub.year) !== cy;
  if (clash) found.date = undefined;
  const note = clash ? `  (crossref year ${cy} != file ${pub.year}; date not written)` : "";

  const added = [];
  for (const f of FIELDS) {
    if (pub[f] || !found[f]) continue;
    pub[f] = String(found[f]);
    added.push(`${f}=${pub[f]}`);
  }

  if (added.length) { filled++; console.log(`  + ${pub.id}: ${added.join(", ")}${note}`); }
  else if (note) console.log(`    ${pub.id}:${note}`);

  await new Promise((r) => setTimeout(r, 120));
}

console.log(`\n${filled} record(s) gained fields, ${missing} without a DOI, ${pubs.length} total`);
if (WRITE) {
  fs.writeFileSync(file, JSON.stringify(pubs, null, 2) + "\n");
  console.log(`written to ${path.relative(process.cwd(), file)} — review the diff before committing`);
} else {
  console.log("dry run. Pass --write to save.");
}
