#!/usr/bin/env node
/**
 * Writes STUDENT-DATA.csv from src/data/people.json.
 *
 *   node scripts/student-data-csv.mjs
 *
 * The sheet to hand round. It carries what the site already knows and leaves
 * the rest blank, so an empty cell is the question.
 *
 * `picture` says yes or no. Where it is no, paste a Drive link in
 * `picture_link` and we fetch it — nobody should have to name a file.
 *
 * It is generated, not authored. Filling a cell here does not change the site;
 * the answers come back into src/data/people.json, or into the Google Sheet
 * once that exists.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const people = JSON.parse(fs.readFileSync(path.resolve(here, "../src/data/people.json"), "utf8"));
const out = path.resolve(here, "../../STUDENT-DATA.csv");

const ROLE = { phd: "PhD", mtech: "M.Tech", btech: "B.Tech", postdoc: "Postdoc", intern: "Intern", staff: "Staff", visitor: "Visitor" };

/** A CSV cell: quoted only when it has to be, so the file stays readable. */
const cell = (v) => {
  const s = (v ?? "").toString().trim().replace(/\s+/g, " ");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const HEAD = [
  "id", "name", "status", "degree", "years",
  "picture", "picture_link", "linkedin_url", "working_area", "currently",
];

const rows = people.map((p) => {
  const alum = p.status !== "current";
  const years = [p.start_year, p.end_year].filter(Boolean).join("–") || "";

  return [
    p.id,
    p.name,
    alum ? "alumnus" : "current",
    /* The assistantship is part of the degree, not a note beside it. */
    p.programme || ROLE[p.role] || p.role,
    years,
    p.photo ? "yes" : "no",
    "",
    p.linkedin || "",
    p.blurb || p.topic || "",
    /* Only an alumnus has a "currently". */
    alum ? p.first_position || "" : "n/a",
  ];
});

/* Plain CSV, unpadded. This file is opened in a spreadsheet, filled in and
   sent back, so a column aligned with spaces would arrive as values with
   trailing whitespace and headers that no importer matches. */
const line = (cells) => cells.map(cell).join(",");

fs.writeFileSync(out, [line(HEAD), ...rows.map(line)].join("\n") + "\n");

console.log(`student-data-csv: wrote ${path.relative(process.cwd(), out)} — ${rows.length} people`);
const blank = [["picture", 5, "no"], ["LinkedIn", 7, ""], ["working area", 8, ""], ["currently", 9, ""]];
for (const [label, i, empty] of blank) {
  const n = rows.filter((r) => (r[i] ?? "") === empty).length;
  if (n) console.log(`  ${label.padEnd(13)} ${n} to fill`);
}
