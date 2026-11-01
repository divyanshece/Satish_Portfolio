#!/usr/bin/env node
/**
 * sync-from-google — the only thing on this project that talks to Google.
 *
 *   npm run sync
 *
 * It reads one Google workbook and writes src/data/*.json. That is all it does.
 * `npm run build` never touches the network: it compiles the JSON files that are
 * committed to this repository. So the pipeline is
 *
 *     Google Sheet  ->  npm run sync  ->  src/data/*.json  ->  npm run build
 *                                        (committed)          (no network)
 *
 * and every arrow after the first one still works if Google is gone. Setting
 * SHEETS_DISABLED=1 removes the first arrow permanently and the site keeps
 * publishing from the committed files. See docs/RUNBOOK.md.
 *
 * Two design rules matter more than the code:
 *
 *   1. Headers are checked before a single row is read. If a tab or a required
 *      column is missing, the script says so in a sentence a non-technical
 *      person can act on and exits without writing any file. A half-read sheet
 *      must never reach src/data.
 *
 *   2. The credential is read-only. It cannot write to the sheet, cannot delete
 *      a tab, and cannot be used to reach anything else in the Drive. That is
 *      why the publish log is written by Apps Script and not by the build.
 *
 * Environment:
 *   SHEETS_DISABLED     "1" -> print a message and exit 0, touching nothing.
 *   GOOGLE_SA_KEY_B64   base64 of the service account JSON key. Base64 because a
 *                       PEM private key pasted raw into a CI secret loses its
 *                       newlines and then nothing works for an afternoon.
 *   SHEET_ID            the long id out of the sheet URL.
 *   SYNC_SUMMARY_FILE   optional path. Writes a machine-readable run summary
 *                       there for the publish workflow. Nothing else uses it.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "src", "data");
const SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

/* ================================================================== *
 * 1. The shape the workbook must have.
 *
 * `required` here means exactly one thing: the column header must exist in
 * row 1. It does not mean every cell is filled. An empty required cell is
 * written through to the JSON so that the build's own validation names the
 * row it came from, drops that one row, and publishes everything else.
 *
 * The types are the whole coercion table. UNFORMATTED_VALUE gives us real
 * numbers and real booleans from checkboxes; everything else arrives as text.
 * ================================================================== */

const TEXT = "text";
const NUMBER = "number";
const NUMBER_OR_NULL = "number_or_null";
const BOOL = "bool";
const LIST = "list";
const LINKS = "links";
const DATE = "date";

const SETTINGS_KEYS = [
  { name: "name", required: true, type: TEXT },
  { name: "name_full", required: true, type: TEXT },
  { name: "name_citation_forms", required: true, type: LIST },
  { name: "title", required: true, type: TEXT },
  { name: "departments", required: true, type: LIST },
  { name: "institution", required: true, type: TEXT },
  { name: "office", required: true, type: TEXT },
  { name: "address", required: true, type: TEXT },
  { name: "email", required: true, type: TEXT },
  { name: "scholar_url", required: true, type: TEXT },
  { name: "orcid_url", required: true, type: TEXT },
  { name: "linkedin_url", required: true, type: TEXT },
  { name: "iith_url", required: true, type: TEXT },
  { name: "raft_site_url", required: true, type: TEXT },
  { name: "recruiting_status", required: true, type: TEXT },
  { name: "recruiting_deadline", required: true, type: TEXT },
  { name: "recruiting_review_by", required: true, type: TEXT },
  { name: "currently", required: true, type: TEXT },
  { name: "bio_short_25", required: true, type: TEXT },
  { name: "bio_short_60", required: true, type: TEXT },
  { name: "products_standfirst", required: true, type: TEXT },
  { name: "site_state", required: false, type: TEXT },
  { name: "site_state_line", required: false, type: TEXT },
  { name: "site_state_until", required: false, type: TEXT },
];

/**
 * Rows in the Settings tab whose key starts with this prefix are collected into
 * the raft_socials object: "raft_social.LinkedIn" becomes raft_socials.LinkedIn.
 * One row per network, so adding one is adding a row rather than editing a list
 * inside a cell.
 */
const SOCIAL_PREFIX = "raft_social.";

const COLLECTIONS = [
  {
    tab: "Settings",
    file: "settings.json",
    kind: "keyvalue",
    keys: SETTINGS_KEYS,
  },
  {
    tab: "Positions",
    file: "positions.json",
    kind: "rows",
    columns: [
      { name: "kind", required: true, type: TEXT },
      { name: "org", required: true, type: TEXT },
      { name: "role", required: true, type: TEXT },
      { name: "city", required: false, type: TEXT },
      { name: "start", required: true, type: TEXT },
      { name: "end", required: false, type: TEXT, keepEmpty: true },
      { name: "note", required: false, type: TEXT },
      { name: "order", required: true, type: NUMBER },
    ],
  },
  {
    tab: "Research",
    file: "research.json",
    kind: "rows",
    columns: [
      { name: "slug", required: true, type: TEXT },
      { name: "claim", required: true, type: TEXT },
      { name: "confidence", required: true, type: TEXT },
      { name: "revised", required: true, type: DATE },
      { name: "summary", required: true, type: TEXT },
      { name: "figure", required: false, type: TEXT },
      { name: "figure_alt", required: false, type: TEXT },
      { name: "figure_caption", required: false, type: TEXT },
      { name: "figure_credit", required: false, type: TEXT },
      { name: "order", required: true, type: NUMBER },
    ],
  },
  {
    tab: "Publications",
    file: "publications.json",
    kind: "rows",
    columns: [
      { name: "id", required: true, type: TEXT },
      { name: "type", required: true, type: TEXT },
      { name: "year", required: true, type: NUMBER },
      { name: "title", required: true, type: TEXT },
      { name: "authors", required: true, type: LIST },
      { name: "venue", required: true, type: TEXT },
      { name: "volume", required: false, type: TEXT },
      { name: "issue", required: false, type: TEXT },
      { name: "pages", required: false, type: TEXT },
      { name: "doi", required: false, type: TEXT },
      { name: "url", required: false, type: TEXT },
      { name: "theme", required: false, type: TEXT },
      { name: "selected", required: false, type: BOOL, keepEmpty: true },
      { name: "selected_order", required: false, type: NUMBER },
      { name: "takeaway", required: false, type: TEXT },
      { name: "note", required: false, type: TEXT },
      { name: "open_access", required: false, type: TEXT },
      { name: "exclude", required: false, type: BOOL },
    ],
  },
  {
    tab: "People",
    file: "people.json",
    kind: "rows",
    columns: [
      { name: "id", required: true, type: TEXT },
      { name: "name", required: true, type: TEXT },
      { name: "aliases", required: false, type: LIST, keepEmpty: true },
      { name: "role", required: true, type: TEXT },
      { name: "status", required: true, type: TEXT },
      { name: "programme", required: false, type: TEXT },
      { name: "department", required: false, type: TEXT },
      { name: "start_year", required: false, type: NUMBER },
      { name: "end_year", required: false, type: NUMBER },
      { name: "viva_date", required: false, type: DATE },
      { name: "topic", required: false, type: TEXT },
      { name: "blurb", required: false, type: TEXT },
      { name: "thesis_title", required: false, type: TEXT },
      { name: "photo", required: false, type: TEXT, keepEmpty: true },
      { name: "linkedin", required: false, type: TEXT, keepEmpty: true },
      { name: "co_supervisor", required: false, type: TEXT },
      { name: "note", required: false, type: TEXT },
      { name: "first_position", required: false, type: TEXT },
      { name: "first_position_year", required: false, type: NUMBER },
      { name: "sector", required: false, type: TEXT },
      { name: "order", required: true, type: NUMBER },
    ],
  },
  {
    tab: "Projects",
    file: "projects.json",
    kind: "rows",
    columns: [
      { name: "slug", required: true, type: TEXT },
      { name: "title", required: true, type: TEXT },
      { name: "funder", required: true, type: TEXT },
      { name: "role", required: true, type: TEXT },
      { name: "partners", required: false, type: TEXT },
      { name: "start_year", required: false, type: NUMBER_OR_NULL, keepEmpty: true },
      { name: "end_year", required: false, type: NUMBER_OR_NULL, keepEmpty: true },
      { name: "status", required: true, type: TEXT },
      { name: "summary", required: false, type: TEXT },
      { name: "theme", required: false, type: TEXT },
      { name: "public_output", required: false, type: BOOL, keepEmpty: true },
      { name: "order", required: true, type: NUMBER },
    ],
  },
  {
    tab: "Products",
    file: "products.json",
    kind: "rows",
    columns: [
      { name: "slug", required: true, type: TEXT },
      { name: "name", required: true, type: TEXT },
      { name: "kind", required: true, type: TEXT },
      { name: "status", required: true, type: TEXT },
      { name: "audience", required: false, type: TEXT },
      { name: "blurb", required: true, type: TEXT },
      { name: "state_lines", required: false, type: LIST },
      { name: "links", required: false, type: LINKS },
      { name: "partners", required: false, type: LIST },
      { name: "funders", required: false, type: LIST },
      { name: "contact", required: false, type: TEXT },
      { name: "absent_note", required: false, type: TEXT },
      { name: "page", required: false, type: BOOL, keepEmpty: true },
      { name: "order", required: true, type: NUMBER },
    ],
  },
  {
    tab: "Teaching",
    file: "teaching.json",
    kind: "rows",
    columns: [
      { name: "code", required: false, type: TEXT },
      { name: "title", required: true, type: TEXT },
      { name: "credits", required: false, type: NUMBER_OR_NULL },
      { name: "level", required: false, type: TEXT, keepEmpty: true },
      { name: "semesters", required: false, type: TEXT },
      { name: "status", required: true, type: TEXT },
      { name: "note", required: false, type: TEXT },
      { name: "order", required: true, type: NUMBER },
    ],
  },
  {
    tab: "Press",
    file: "press.json",
    kind: "rows",
    columns: [
      { name: "date", required: true, type: DATE },
      { name: "outlet", required: true, type: TEXT },
      { name: "headline", required: true, type: TEXT },
      { name: "kind", required: true, type: TEXT },
      { name: "url", required: false, type: TEXT },
      { name: "quote", required: false, type: TEXT },
    ],
  },
];

/* ================================================================== *
 * 2. Failure. One shape, one exit, no files written.
 * ================================================================== */

const NOTHING_CHANGED =
  "Nothing on the website has changed. The site is still showing the last good version.";

/**
 * Print the problem between markers and stop.
 *
 * The markers are not decoration. Apps Script pulls the text between them out
 * of the build log so the failure email says what is actually wrong, instead of
 * telling him to go and read a log. Keep them if you change this function.
 */
function stop(lines) {
  const body = Array.isArray(lines) ? lines : [lines];
  const text = [...body, "", NOTHING_CHANGED];
  console.error("");
  console.error("--- WHAT WENT WRONG ---");
  for (const line of text) console.error(line);
  console.error("--- END ---");
  if (process.env.GITHUB_ACTIONS === "true") {
    console.error(`::error title=Publish stopped::${body[0]}`);
  }
  process.exit(1);
}

/* ================================================================== *
 * 3. The dead Google switch.
 * ================================================================== */

if (process.env.SHEETS_DISABLED === "1") {
  console.log("sync — skipped.");
  console.log("");
  console.log("  SHEETS_DISABLED is set to 1, so this script did not contact Google at all.");
  console.log("  The site will be built from the JSON files already committed in src/data,");
  console.log("  which is a complete copy of the content. Nothing is missing and nothing");
  console.log("  is broken; the sheet has simply been taken out of the loop.");
  console.log("");
  console.log("  To turn the sheet back on, remove SHEETS_DISABLED. See docs/RUNBOOK.md.");
  writeSummary({ disabled: true, changed: false, collections: {}, skipped: [], attention: [] });
  process.exit(0);
}

/* ================================================================== *
 * 4. Credentials.
 * ================================================================== */

function readCredentials() {
  const b64 = process.env.GOOGLE_SA_KEY_B64;
  if (!b64 || !b64.trim()) {
    stop([
      "The Google service account key is missing.",
      "",
      "This build had no GOOGLE_SA_KEY_B64 value, so it could not open the sheet.",
      "In GitHub the value lives in Settings, Secrets and variables, Actions.",
      "Running it on a laptop instead? Put it in a .env file next to package.json.",
    ]);
  }
  let json;
  try {
    json = JSON.parse(Buffer.from(b64.trim(), "base64").toString("utf8"));
  } catch {
    stop([
      "The Google service account key could not be read.",
      "",
      "GOOGLE_SA_KEY_B64 must be the whole key file, base64 encoded, on one line.",
      "On a Mac: base64 -i key.json | pbcopy",
      "Then paste that into the secret. Do not paste the key file itself.",
    ]);
  }
  if (!json.client_email || !json.private_key) {
    stop([
      "The Google service account key is not a service account key.",
      "",
      "The decoded file has no client_email and no private_key in it.",
      'Download a new key: Google Cloud console, the service account, Keys, Add key, JSON.',
    ]);
  }
  return json;
}

function sheetId() {
  const id = (process.env.SHEET_ID || "").trim();
  if (!id) {
    stop([
      "The sheet id is missing.",
      "",
      "SHEET_ID was empty, so this build did not know which workbook to read.",
      "It is the long code in the sheet's own web address, between /d/ and /edit.",
    ]);
  }
  return id;
}

/* ================================================================== *
 * 5. Reading. One metadata call, then one batchGet for every tab.
 * ================================================================== */

async function fetchWorkbook(id, credentials) {
  const auth = new google.auth.GoogleAuth({ credentials, scopes: [SCOPE] });
  const sheets = google.sheets({ version: "v4", auth });
  const who = credentials.client_email;

  let meta;
  try {
    // Cheap metadata call: it tells us which tabs exist, so a missing tab is
    // reported as a sentence instead of as a range parse error from the API.
    meta = await sheets.spreadsheets.get({
      spreadsheetId: id,
      fields: "properties.title,sheets.properties.title",
    });
  } catch (err) {
    const code = err?.code ?? err?.response?.status;
    if (code === 403) {
      stop([
        "This build is not allowed to open the sheet.",
        "",
        `Open the workbook, press Share, and add ${who} as a Viewer.`,
        "Viewer is enough and is deliberate: the build can read the sheet and can",
        "never write to it, so a broken build cannot damage the content.",
      ]);
    }
    if (code === 404) {
      stop([
        "No workbook was found with that id.",
        "",
        `SHEET_ID is currently "${id}".`,
        "Check it against the sheet's web address, the part between /d/ and /edit.",
      ]);
    }
    stop([
      "The sheet could not be read.",
      "",
      `Google replied: ${err?.message ?? String(err)}`,
      "If this says timeout or network, it is usually temporary. Try again in a few minutes.",
    ]);
  }

  const present = (meta.data.sheets ?? []).map((s) => s.properties.title);
  const missing = COLLECTIONS.filter((c) => !present.includes(c.tab)).map((c) => c.tab);
  if (missing.length) {
    const plural = missing.length > 1;
    stop([
      plural
        ? `The workbook is missing ${missing.length} tabs: ${missing.map((t) => `"${t}"`).join(", ")}.`
        : `The workbook is missing a tab: "${missing[0]}".`,
      "",
      `The tabs in it right now are: ${present.join(", ")}.`,
      "Tab names are matched exactly, including capital letters. Check the row of",
      "tabs along the bottom of the sheet, and look in the hidden tabs as well",
      "(right-click any tab, then All sheets).",
    ]);
  }

  let res;
  try {
    // One call for every tab. Ten separate calls would be ten chances to be
    // rate limited, and would read the tabs at ten slightly different moments.
    res = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: id,
      ranges: COLLECTIONS.map((c) => `'${c.tab}'`),
      majorDimension: "ROWS",
      valueRenderOption: "UNFORMATTED_VALUE",
      dateTimeRenderOption: "FORMATTED_STRING",
    });
  } catch (err) {
    stop([
      "The sheet was found but its contents could not be read.",
      "",
      `Google replied: ${err?.message ?? String(err)}`,
    ]);
  }

  const grids = new Map();
  (res.data.valueRanges ?? []).forEach((range, i) => {
    grids.set(COLLECTIONS[i].tab, range.values ?? []);
  });
  return { title: meta.data.properties?.title ?? "(untitled)", grids };
}

/* ================================================================== *
 * 6. assertHeaders — runs before a single row is parsed.
 *
 * Every problem in the workbook is collected and reported together. Fixing one
 * column, publishing, and being told about the next one is a bad afternoon.
 * ================================================================== */

function headerKey(cell) {
  return String(cell ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function assertHeaders(grids) {
  const problems = [];
  const notes = [];

  for (const collection of COLLECTIONS) {
    const grid = grids.get(collection.tab) ?? [];
    const header = (grid[0] ?? []).map(headerKey);

    if (header.filter(Boolean).length === 0) {
      problems.push(
        `Tab "${collection.tab}" has no column headings. Row 1 must carry the ` +
          `column names, and it is empty.`
      );
      continue;
    }

    if (collection.kind === "keyvalue") {
      // Settings is deliberately two columns, key and value, one setting per
      // row. See docs/SHEET-SCHEMA.md for why it is not one wide row.
      if (!header.includes("key") || !header.includes("value")) {
        problems.push(
          `Tab "${collection.tab}" must have two columns headed "key" and "value". ` +
            `Row 1 currently reads: ${header.filter(Boolean).join(", ")}.`
        );
        continue;
      }
      const keyCol = header.indexOf("key");
      const seen = new Set(
        grid.slice(1).map((row) => String(row?.[keyCol] ?? "").trim()).filter(Boolean)
      );
      for (const spec of collection.keys) {
        if (spec.required && !seen.has(spec.name)) {
          problems.push(
            `Tab "${collection.tab}" has no row for "${spec.name}". Add a row with ` +
              `${spec.name} in the key column and its text in the value column.`
          );
        }
        if (!spec.required && !seen.has(spec.name)) {
          notes.push(`${collection.tab}: no row for "${spec.name}", so its default is used.`);
        }
      }
      continue;
    }

    for (const column of collection.columns) {
      if (column.required && !header.includes(column.name)) {
        problems.push(
          `Tab "${collection.tab}" is missing a column: "${column.name}". ` +
            `Columns currently there: ${header.filter(Boolean).join(", ")}. Check row 1.`
        );
      }
      if (!column.required && !header.includes(column.name)) {
        notes.push(`${collection.tab}: no "${column.name}" column, so it is left out.`);
      }
    }

    const known = new Set(collection.columns.map((c) => c.name));
    for (const name of header) {
      if (name && !known.has(name)) {
        notes.push(`${collection.tab}: column "${name}" is not used by the website.`);
      }
    }
  }

  if (problems.length) {
    const head =
      problems.length === 1
        ? "The sheet could not be published."
        : `The sheet could not be published. There are ${problems.length} things to fix.`;
    stop([head, "", ...problems.map((p, i) => (problems.length > 1 ? `${i + 1}. ${p}` : p))]);
  }

  return notes;
}

/* ================================================================== *
 * 7. Coercion. Sheet cells to the exact JSON the content layer expects.
 * ================================================================== */

const attention = [];

/** "Publications row 12: 'year' says 'forthcoming'." — the sentence he reads. */
function flag(tab, rowNumber, column, saw) {
  attention.push(`${tab} row ${rowNumber}: '${column}' says '${saw}'.`);
}

function asText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  return String(value).trim();
}

function asNumber(value, ctx) {
  if (typeof value === "number") return value;
  const text = asText(value);
  if (text === "") return undefined;
  const n = Number(text.replace(/,/g, ""));
  if (Number.isFinite(n)) return n;
  flag(ctx.tab, ctx.row, ctx.column, text);
  return text; // written through, so the build names the row and skips just it
}

function asBool(value, ctx) {
  if (typeof value === "boolean") return value;
  const text = asText(value).toLowerCase();
  if (text === "") return false;
  if (["true", "yes", "y", "1", "x"].includes(text)) return true;
  if (["false", "no", "n", "0"].includes(text)) return false;
  flag(ctx.tab, ctx.row, ctx.column, asText(value));
  return false;
}

function asList(value) {
  return asText(value)
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
}

/** "Google Play | https://…; App Store | https://…" */
function asLinks(value, ctx) {
  const out = [];
  for (const entry of asList(value)) {
    const bar = entry.indexOf("|");
    if (bar === -1) {
      flag(ctx.tab, ctx.row, ctx.column, entry);
      continue;
    }
    const label = entry.slice(0, bar).trim();
    const url = entry.slice(bar + 1).trim();
    if (!label || !url) {
      flag(ctx.tab, ctx.row, ctx.column, entry);
      continue;
    }
    out.push({ label, url });
  }
  return out;
}

/**
 * Dates are YYYY, YYYY-MM or YYYY-MM-DD.
 *
 * A bare year typed into a date column comes back as the number 2023, and a
 * real date cell comes back as a serial like 46000. Nothing sits between them,
 * so the two cases separate cleanly at 3000.
 */
function asDate(value) {
  if (typeof value === "number") {
    if (Number.isInteger(value) && value >= 1000 && value < 3000) return String(value);
    const ms = Math.round((value - 25569) * 86400000);
    const d = new Date(ms);
    return Number.isFinite(d.getTime()) ? d.toISOString().slice(0, 10) : String(value);
  }
  const text = asText(value);
  const m = text.match(/^(\d{4})(?:[-/](\d{1,2}))?(?:[-/](\d{1,2}))?(?:[T ].*)?$/);
  if (!m) return text; // passed through; the build will name the row
  const parts = [m[1]];
  if (m[2]) parts.push(m[2].padStart(2, "0"));
  if (m[3]) parts.push(m[3].padStart(2, "0"));
  return parts.join("-");
}

function coerce(spec, raw, ctx) {
  switch (spec.type) {
    case NUMBER:
      return asNumber(raw, ctx);
    case NUMBER_OR_NULL: {
      const n = asNumber(raw, ctx);
      return n === undefined ? null : n;
    }
    case BOOL:
      return asBool(raw, ctx);
    case LIST:
      return asList(raw);
    case LINKS:
      return asLinks(raw, ctx);
    case DATE:
      return asDate(raw);
    default:
      return asText(raw);
  }
}

/**
 * Empty enough to leave out of the JSON entirely.
 *
 * An unticked checkbox counts as empty: the content layer already defaults
 * `exclude`, `page` and the rest to false, and thirty rows of "exclude": false
 * would bury the one row that says true. Columns that must always be written
 * out anyway are marked keepEmpty in the table above.
 */
function isEmpty(value) {
  if (value === undefined || value === null) return true;
  if (value === false) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/* ================================================================== *
 * 8. Rows.
 * ================================================================== */

const skipped = [];

function isBlankRow(row) {
  return (row ?? []).every((cell) => asText(cell) === "");
}

/** The example row. Row 2 of every tab starts with "#" and shows the format. */
function isExampleRow(row) {
  return asText(row?.[0]).startsWith("#");
}

function parseRows(collection, grid) {
  const header = (grid[0] ?? []).map(headerKey);
  const index = new Map(header.map((name, i) => [name, i]));
  const out = [];

  grid.slice(1).forEach((row, i) => {
    const rowNumber = i + 2;
    if (isBlankRow(row)) {
      skipped.push({ tab: collection.tab, row: rowNumber, why: "blank" });
      return;
    }
    if (isExampleRow(row)) {
      skipped.push({ tab: collection.tab, row: rowNumber, why: "example" });
      return;
    }

    const record = {};
    for (const column of collection.columns) {
      if (!index.has(column.name)) continue;
      const ctx = { tab: collection.tab, row: rowNumber, column: column.name };
      const value = coerce(column, row[index.get(column.name)], ctx);
      if (column.required || column.keepEmpty || !isEmpty(value)) {
        record[column.name] = value === undefined ? "" : value;
      }
    }
    out.push(record);
  });

  return out;
}

function parseSettings(collection, grid) {
  const header = (grid[0] ?? []).map(headerKey);
  const keyCol = header.indexOf("key");
  const valueCol = header.indexOf("value");
  const byKey = new Map();
  const socials = {};

  grid.slice(1).forEach((row, i) => {
    const rowNumber = i + 2;
    const key = asText(row?.[keyCol]);
    if (!key) {
      if (!isBlankRow(row)) skipped.push({ tab: collection.tab, row: rowNumber, why: "no key" });
      return;
    }
    if (key.startsWith("#")) {
      skipped.push({ tab: collection.tab, row: rowNumber, why: "example" });
      return;
    }
    if (key.startsWith(SOCIAL_PREFIX)) {
      const label = key.slice(SOCIAL_PREFIX.length).trim();
      const url = asText(row?.[valueCol]);
      if (label && url) socials[label] = url;
      return;
    }
    byKey.set(key, { raw: row?.[valueCol], row: rowNumber });
  });

  const settings = {};
  for (const spec of collection.keys) {
    const found = byKey.get(spec.name);
    if (!found) continue; // optional only; assertHeaders has already run
    const ctx = { tab: collection.tab, row: found.row, column: spec.name };
    settings[spec.name] = coerce(spec, found.raw, ctx);
  }
  settings.raft_socials = socials;
  return settings;
}

/* ================================================================== *
 * 9. Writing, but only when something actually changed.
 * ================================================================== */

function sha(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function writeIfChanged(file, value) {
  const target = path.join(DATA_DIR, file);
  const next = `${JSON.stringify(value, null, 2)}\n`;
  let current = "";
  try {
    current = fs.readFileSync(target, "utf8");
  } catch {
    current = "";
  }
  if (current && sha(current) === sha(next)) return false;
  fs.writeFileSync(target, next, "utf8");
  return true;
}

function writeSummary(summary) {
  /* The step output the workflow branches on.
   *
   * publish.yml guards "Commit the content back" with
   * `if: steps.sync.outputs.changed == 'true'`, and nothing used to write that
   * output, so the guard was never true and the commit step could never run.
   * A sheet edit would have reached the live site and then been forgotten: the
   * next build would read the old committed JSON and quietly undo it. The file
   * summary below is for the Apps Script and is read from the deployed site;
   * this line is for the workflow, and the two are written together so they
   * cannot disagree about whether anything changed. */
  const out = process.env.GITHUB_OUTPUT;
  if (out) {
    try {
      fs.appendFileSync(out, `changed=${summary.changed === true}\n`, "utf8");
    } catch (err) {
      console.warn(`  (could not write the step output: ${err.message})`);
    }
  }

  const target = process.env.SYNC_SUMMARY_FILE;
  if (!target) return;
  try {
    fs.mkdirSync(path.dirname(path.resolve(target)), { recursive: true });
    fs.writeFileSync(
      path.resolve(target),
      `${JSON.stringify({ generated: new Date().toISOString(), ...summary }, null, 2)}\n`,
      "utf8"
    );
  } catch (err) {
    console.warn(`  (could not write the run summary to ${target}: ${err.message})`);
  }
}

/* ================================================================== *
 * 10. Run.
 * ================================================================== */

const credentials = readCredentials();
const id = sheetId();
const { title, grids } = await fetchWorkbook(id, credentials);

// Headers first, always. Nothing below this line runs on a broken workbook.
const notes = assertHeaders(grids);

const parsed = [];
for (const collection of COLLECTIONS) {
  const grid = grids.get(collection.tab) ?? [];
  const value =
    collection.kind === "keyvalue"
      ? parseSettings(collection, grid)
      : parseRows(collection, grid);
  parsed.push({ collection, value });
}

const results = parsed.map(({ collection, value }) => ({
  tab: collection.tab,
  file: collection.file,
  count: Array.isArray(value) ? value.length : Object.keys(value).length,
  unit: Array.isArray(value) ? "records" : "settings",
  changed: writeIfChanged(collection.file, value),
}));

/* ---------- the report ---------- */

const nameWidth = Math.max(...results.map((r) => r.tab.length));
const changedFiles = results.filter((r) => r.changed);

console.log("sync — Google Sheet to src/data");
console.log(`  Workbook: ${title}`);
console.log(`  Read as:  ${credentials.client_email} (read-only)`);
console.log("");

for (const r of results) {
  const state = r.changed ? "updated" : "unchanged";
  console.log(
    `  ${r.tab.padEnd(nameWidth)}  ${String(r.count).padStart(4)} ${r.unit.padEnd(9)}  ${state}`
  );
}

console.log("");
if (skipped.length) {
  const examples = skipped.filter((s) => s.why === "example").length;
  const blanks = skipped.filter((s) => s.why === "blank").length;
  const other = skipped.filter((s) => s.why !== "example" && s.why !== "blank");
  const bits = [];
  if (examples) bits.push(`${examples} example ${examples === 1 ? "row" : "rows"} (starting with #)`);
  if (blanks) bits.push(`${blanks} empty ${blanks === 1 ? "row" : "rows"}`);
  console.log(`  Rows skipped: ${bits.join(", ") || skipped.length}.`);
  for (const s of other) console.log(`    ${s.tab} row ${s.row}: ${s.why}.`);
}

if (attention.length) {
  console.log("");
  console.log(`  ${attention.length} cell${attention.length === 1 ? "" : "s"} need attention:`);
  for (const line of attention) console.log(`    ${line}`);
  console.log("");
  console.log("  Those rows are written out as they are. The build checks them again,");
  console.log("  leaves out any row it cannot read, and publishes everything else.");
}

if (notes.length) {
  console.log("");
  console.log("  Notes:");
  for (const note of notes) console.log(`    ${note}`);
}

console.log("");
console.log(
  changedFiles.length
    ? `  ${changedFiles.length} of ${results.length} files updated: ` +
        `${changedFiles.map((r) => r.file).join(", ")}.`
    : `  Nothing changed. All ${results.length} files already match the sheet.`
);

writeSummary({
  disabled: false,
  workbook: title,
  changed: changedFiles.length > 0,
  changed_files: changedFiles.map((r) => r.file),
  collections: Object.fromEntries(results.map((r) => [r.tab, r.count])),
  ignored_rows: skipped.map((s) => `${s.tab} row ${s.row}: ${s.why} row, left out.`),
  attention,
  notes,
});

// The publish workflow only commits when something moved.
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(
    process.env.GITHUB_OUTPUT,
    `changed=${changedFiles.length > 0}\nattention=${attention.length}\n`
  );
}
