/**
 * Two text transforms that are the site's fingerprint. Both are derived at
 * build time from data, never hand-typed into content.
 *
 *  1. Trainee marks on author lists. He types nothing about students; adding
 *     someone to the roster retroactively marks every paper they co-authored.
 *  2. Hydronyms. Named water bodies render as hydrography — italic, in the
 *     accent — the way a topographic sheet labels them.
 */

import { people, settings } from "./content";

/* ------------------------------------------------------------------ *
 * trainee marks
 * ------------------------------------------------------------------ */

export const MARKS: Record<string, string> = {
  phd: "*",
  mtech: "†",
  btech: "‡",
  intern: "‡",
  postdoc: "#",
};

export const MARK_LEGEND = [
  { mark: "*", label: "PhD student", article: "a PhD student" },
  { mark: "†", label: "M.Tech", article: "an M.Tech student" },
  { mark: "‡", label: "B.Tech / intern", article: "a B.Tech student or intern" },
];

/** NFKD, strip diacritics and punctuation, collapse space, lowercase. */
function norm(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[.,'’`-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// Built once. Exact matches only — nothing is ever guessed.
const aliasIndex = new Map<string, (typeof people)[number]>();
for (const p of people) {
  for (const a of [p.name, ...p.aliases]) aliasIndex.set(norm(a), p);
}
const selfForms = new Set(settings.name_citation_forms.map(norm));

export type MarkedAuthor = {
  name: string;
  mark: string | null;
  /** "PhD student" — read out beside the name where the page only underlines it. */
  label: string | null;
  isSelf: boolean;
};

/**
 * Papers appear well after the work is done. Padmini defended in February 2025
 * and has two 2026 papers from her thesis; marking her as an alumna on those
 * would be technically defensible and factually silly. Two years of grace after
 * the viva covers ordinary review and production lag without ever reaching far
 * enough to mislabel a senior collaborator.
 */
const PUBLICATION_LAG_YEARS = 2;

/**
 * Mark one author string against the roster, choosing the role by the paper's
 * year against the window the person was in the group.
 */
export function markAuthor(author: string, year: number): MarkedAuthor {
  const key = norm(author);
  if (selfForms.has(key)) return { name: author, mark: null, label: null, isSelf: true };

  const person = aliasIndex.get(key);
  if (!person) return { name: author, mark: null, label: null, isSelf: false };

  const from = person.start_year ?? -Infinity;
  const to = person.end_year ? person.end_year + PUBLICATION_LAG_YEARS : Infinity;
  const inWindow = year >= from && year <= to;

  const mark = inWindow ? (MARKS[person.role] ?? null) : null;
  const label = mark ? (MARK_LEGEND.find((l) => l.mark === mark)?.label ?? null) : null;
  return { name: author, mark, label, isSelf: false };
}

export function markAuthors(authors: string[], year: number): MarkedAuthor[] {
  return authors.map((a) => markAuthor(a, year));
}

/** Which marks actually occur in a given set of papers, so the legend only
 *  ever prints the symbols the page below it uses. */
export function legendFor(pubs: { authors: string[]; year: number }[]) {
  const used = new Set<string>();
  for (const p of pubs) for (const a of markAuthors(p.authors, p.year)) if (a.mark) used.add(a.mark);
  return MARK_LEGEND.filter((l) => used.has(l.mark));
}

/* ------------------------------------------------------------------ *
 * hydronyms
 * ------------------------------------------------------------------ */

/** Named water bodies. Longest first, so "Osman Sagar" wins over "Sagar". */
export const HYDRONYMS = [
  "Hussain Sagar", "Himayat Sagar", "Osman Sagar",
  "Brahmaputra", "Godavari", "Narmada", "Krishna", "Serayu",
  "Sabari", "Musi", "Gunnison",
].sort((a, b) => b.length - a.length);

const HYDRONYM_RE = new RegExp(`\\b(${HYDRONYMS.join("|")})\\b`, "g");

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Wrap named water bodies for prose and captions ONLY.
 *
 * Deliberately not applied to headings, publication titles, author strings,
 * venue names or code: restyling a source's own typography would misrepresent
 * it. Input is escaped first, so this is safe on untrusted sheet content.
 */
export function hydronyms(text: string): string {
  return escapeHtml(text).replace(HYDRONYM_RE, '<i class="hyd">$1</i>');
}

/* ------------------------------------------------------------------ *
 * dates and small formatting
 * ------------------------------------------------------------------ */

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-08" → "Aug 2026"; "2026-08-14" → "14 Aug 2026"; "2026" → "2026". */
export function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!m) return y;
  const mon = MONTHS_SHORT[Number(m) - 1] ?? m;
  return d ? `${Number(d)} ${mon} ${y}` : `${mon} ${y}`;
}

export function longDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!m) return y;
  const mon = MONTHS[Number(m) - 1] ?? m;
  return d ? `${Number(d)} ${mon} ${y}` : `${mon} ${y}`;
}

/** "2017-02" → "2017". Positions print years, not months. */
export function year(iso: string): string {
  return iso.split("-")[0];
}

/** An en dash range that reads correctly while something is still running. */
export function span(start: string, end: string): string {
  const s = year(start);
  return end ? `${s}–${year(end)}` : `${s}–`;
}

export function doiUrl(doi: string): string {
  return `https://doi.org/${doi}`;
}

/* ------------------------------------------------------------------ *
 * search-result lines
 * ------------------------------------------------------------------ */

/**
 * A <title> is a label, not a sentence. Where a long title has an early clause
 * boundary, stop there; where it has none, leave it whole — a machine cut in
 * the middle of a phrase reads worse than letting the search engine truncate,
 * and a mangled title is one of the things that gets a title rewritten.
 */
export function shortTitle(title: string, max = 65): string {
  if (title.length <= max) return title;
  const m = title.match(/^(.{25,}?)\s*[:—–]\s/);
  return m && m[1].length <= max ? m[1] : title;
}

/**
 * Trim prose to the width a result line can show, at a sentence end where there
 * is one and a word boundary otherwise. Never mid-word.
 */
export function summarise(text: string, max = 155): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const window = t.slice(0, max + 1);
  const stop = Math.max(window.lastIndexOf(". "), window.lastIndexOf("? "), window.lastIndexOf("! "));
  if (stop > 60) return t.slice(0, stop + 1);
  return `${window.slice(0, window.lastIndexOf(" "))}…`;
}
