#!/usr/bin/env node
/**
 * grep-check — the anti-generic gate.
 *
 * This site has a house style, and the fastest way to lose it is one hurried
 * pull request that pastes in a card with a shadow, a rounded corner and a
 * violet gradient. None of those are bugs, so no test catches them. This does.
 *
 * It walks src/ and reads every .astro and .css file, then checks nine rules
 * that together describe what this site is not. It has no dependencies, reads
 * nothing outside src/, writes nothing at all, and finishes in milliseconds.
 *
 *   node scripts/grep-check.mjs        (or: npm run grep-check)
 *
 * Exit 0 when clean, exit 1 with a per-violation report otherwise.
 *
 * Where it runs:
 *   pull_request  — a hard gate. A violation fails the check and the pull
 *                   request cannot be merged until it is fixed.
 *   publish       — a warning only. Style must never stand between him and a
 *                   corrected recruiting sentence at 11pm.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const EXTS = new Set([".astro", ".css"]);

/* ------------------------------------------------------------------ *
 * rules — each one says what is wrong AND why the site works this way
 * ------------------------------------------------------------------ */

const WHY = {
  shadow:
    "box-shadow is never used. Separation is a hairline rule (.rule-hair) or space.",
  radius:
    "border-radius is 0 everywhere. Squared corners are the whole object.",
  gradient:
    "No gradients. The exceptions are mechanisms, not looks: the open-ended bar in Trajectory.astro and the rain, mask and sweep in UfisDiagram.astro.",
  palette:
    "That colour is not in the palette. Only var(--…) tokens from tokens.css.",
  grid3:
    "repeat(3, 1fr) is the three-equal-cards grid every template ships with. " +
    "Lay the section out to fit its content instead.",
  typeface:
    "Two families only: Piazzolla (var(--serif)) and Martian Mono (var(--mono)), " +
    "both self-hosted. The site makes zero third-party requests.",
  accentFill:
    "--accent is a link colour, the active nav underline, the focus ring, a " +
    "hydronym and the 2px rule on a selected publication. It is never a fill.",
  script:
    "The site ships zero client-side JavaScript. Filters are real hrefs and " +
    "disclosure is <details>. Only <script type=\"application/ld+json\"> is allowed.",
  emoji:
    "No emoji. Marks on this site are typographic: * † ‡ and the mono micro rules.",
};

const BANNED_HEX = ["6366F1", "4F46E5", "818CF8", "8B5CF6", "A855F7"];
const BANNED_COLOUR_WORDS = ["indigo", "violet", "blueviolet", "darkviolet"];
const BANNED_FACES = [
  "Inter",
  "Roboto",
  "Lato",
  "Montserrat",
  "Poppins",
  "Open Sans",
  "Playfair Display",
  "Space Grotesk",
];

/** Gradients are banned as decoration — the colour wash every template ships
 *  with. Two files may use them for a mechanism rather than a look:
 *   - Trajectory.astro: the open-ended bar of an appointment that has not ended.
 *   - UfisDiagram.astro: rain streaks, a fade mask and a refresh sweep — the
 *     moving parts of the one diagram where motion was explicitly asked for. */
const GRADIENT_EXEMPT = new Set(["src/components/Trajectory.astro", "src/components/UfisDiagram.astro"]);

/* ------------------------------------------------------------------ *
 * plumbing
 * ------------------------------------------------------------------ */

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXTS.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

/** Offset -> 1-based line number, via a precomputed table of line starts. */
function lineIndexer(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") starts.push(i + 1);
  return (offset) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
}

/**
 * The stretches of a file that are CSS.
 *
 * A .css file is CSS end to end. In a .astro file only the <style> blocks are,
 * which is what keeps the word "violet" legal in a sentence and illegal as a
 * colour.
 */
function cssRegions(file, text) {
  if (path.extname(file) === ".css") return [{ start: 0, end: text.length }];
  const regions = [];
  const open = /<style\b[^>]*>/gi;
  let m;
  while ((m = open.exec(text)) !== null) {
    const start = m.index + m[0].length;
    const close = text.toLowerCase().indexOf("</style>", start);
    const end = close === -1 ? text.length : close;
    regions.push({ start, end });
    open.lastIndex = end;
  }
  return regions;
}

/** Every `property: value` pair inside a CSS region, with real file offsets. */
function declarations(text, regions) {
  const out = [];
  const decl = /(^|[;{}])\s*(-{0,2}[a-zA-Z][-a-zA-Z0-9]*)\s*:\s*([^;{}]*)/g;
  for (const region of regions) {
    const slice = text.slice(region.start, region.end);
    let m;
    while ((m = decl.exec(slice)) !== null) {
      out.push({
        prop: m[2].toLowerCase(),
        value: m[3].trim(),
        offset: region.start + m.index + m[0].indexOf(m[2]),
      });
    }
  }
  return out;
}

const ZERO_RADIUS = /^(0(px|rem|em|%|q|pt|vh|vw)?(\s*\/\s*0(px|rem|em|%)?)?\s*)+$/i;
const wordRe = (word) => new RegExp(`(^|[^-\\w])${word.replace(/ /g, "\\s+")}($|[^-\\w])`, "i");

/* ------------------------------------------------------------------ *
 * the checks
 * ------------------------------------------------------------------ */

function checkFile(file, rel, violations) {
  const text = fs.readFileSync(file, "utf8");
  const lineOf = lineIndexer(text);
  const isAstro = path.extname(file) === ".astro";
  const regions = cssRegions(file, text);
  const inCss = (offset) => regions.some((r) => offset >= r.start && offset < r.end);

  const add = (offset, rule, found) =>
    violations.push({ rel, line: lineOf(offset), rule, found, why: WHY[rule] });

  /* 1 + 2 + 6 + 7 — declaration-level rules */
  for (const { prop, value, offset } of declarations(text, regions)) {
    const lower = value.toLowerCase();

    if (prop === "box-shadow" && lower !== "none") {
      add(offset, "shadow", `box-shadow: ${value}`);
    }

    if (/(^|-)border-radius$|^border-[a-z]+-radius$|^border-radius$/.test(prop)) {
      if (!ZERO_RADIUS.test(lower)) add(offset, "radius", `${prop}: ${value}`);
    }

    if (prop.startsWith("background") && /var\(\s*--accent/.test(lower)) {
      add(offset, "accentFill", `${prop}: ${value}`);
    }

    if (prop === "font-family" || prop === "font") {
      for (const face of BANNED_FACES) {
        if (wordRe(face).test(value)) add(offset, "typeface", `${face} in ${prop}: ${value}`);
      }
    }

    for (const word of BANNED_COLOUR_WORDS) {
      if (wordRe(word).test(value)) add(offset, "palette", `${word} in ${prop}: ${value}`);
    }
  }

  /* 3 — gradients, anywhere in the CSS */
  if (!GRADIENT_EXEMPT.has(rel)) {
    const grad = /\b(linear|radial|conic)-gradient\s*\(/gi;
    let m;
    while ((m = grad.exec(text)) !== null) {
      if (inCss(m.index)) add(m.index, "gradient", m[0]);
    }
  }

  /* 4 — the template palette, in CSS or in markup */
  const hex = new RegExp(`#?\\b(${BANNED_HEX.join("|")})\\b`, "gi");
  let h;
  while ((h = hex.exec(text)) !== null) add(h.index, "palette", h[0]);

  /* 5 — the three-equal-cards grid, in either of its two usual spellings */
  const grid = /repeat\(\s*3\s*,\s*(1fr|minmax\([^)]*\))\s*\)/gi;
  let g;
  while ((g = grid.exec(text)) !== null) {
    if (inCss(g.index)) add(g.index, "grid3", g[0]);
  }

  /* 8 + 9 — .astro only */
  if (isAstro) {
    const script = /<script\b[^>]*>/gi;
    let s;
    while ((s = script.exec(text)) !== null) {
      if (!/type\s*=\s*["']application\/ld\+json["']/i.test(s[0])) {
        add(s.index, "script", s[0].slice(0, 60));
      }
    }

    const emoji = /\p{Extended_Pictographic}/gu;
    let e;
    while ((e = emoji.exec(text)) !== null) add(e.index, "emoji", e[0]);
  }
}

/* ------------------------------------------------------------------ *
 * run
 * ------------------------------------------------------------------ */

const files = walk(SRC);
const violations = [];
for (const file of files) {
  checkFile(file, path.relative(ROOT, file).split(path.sep).join("/"), violations);
}

const RULE_COUNT = 9;
const label = {
  shadow: "box-shadow",
  radius: "non-zero radius",
  gradient: "gradient",
  palette: "off-palette colour",
  grid3: "repeat(3, 1fr)",
  typeface: "banned typeface",
  accentFill: "accent as a fill",
  script: "client-side script",
  emoji: "emoji",
};

console.log("grep-check — house style gate");
console.log(`  ${files.length} files read (src/**/*.astro, src/**/*.css), ${RULE_COUNT} rules`);

if (violations.length === 0) {
  console.log("  0 violations. The house style holds.");
  process.exit(0);
}

violations.sort((a, b) => a.rel.localeCompare(b.rel) || a.line - b.line);

const width = Math.max(...violations.map((v) => label[v.rule].length));
let lastFile = "";
let lastWhy = "";
console.log("");
for (const v of violations) {
  if (v.rel !== lastFile) {
    console.log(`  ${v.rel}`);
    lastFile = v.rel;
    lastWhy = "";
  }
  console.log(`    line ${String(v.line).padStart(4)}  ${label[v.rule].padEnd(width)}  ${v.found}`);
  if (v.why !== lastWhy) {
    console.log(`              ${" ".repeat(width)}  ${v.why}`);
    lastWhy = v.why;
  }
}

const fileCount = new Set(violations.map((v) => v.rel)).size;
console.log("");
console.log(
  `  ${violations.length} violation${violations.length === 1 ? "" : "s"} in ` +
    `${fileCount} file${fileCount === 1 ? "" : "s"}. See src/styles/tokens.css for the palette.`
);
process.exit(1);
