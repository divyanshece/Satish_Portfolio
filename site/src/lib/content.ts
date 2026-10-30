/**
 * The content layer.
 *
 * Every page reads from here and nowhere else. The JSON files under src/data
 * are the committed copy of the Google Sheet — `npm run sync` overwrites them,
 * `npm run build` never touches the network. That is the whole longevity story:
 * if Google is gone, this repo still builds the site.
 *
 * Validation has two classes, deliberately:
 *
 *   FATAL  a missing file, or a shape so broken there is nothing to render.
 *          The build stops and the live site keeps serving the last good deploy.
 *
 *   SKIP   one bad row. It is dropped, a warning is printed naming the row,
 *          and everything else publishes. This is the important one: a
 *          half-finished publication entry must never stop him fixing a
 *          recruiting sentence at 11pm.
 */

import { z } from "zod";

import rawSettings from "../data/settings.json";
import rawPositions from "../data/positions.json";
import rawResearch from "../data/research.json";
import rawPublications from "../data/publications.json";
import rawPeople from "../data/people.json";
import rawProjects from "../data/projects.json";
import rawProducts from "../data/products.json";
import rawTeaching from "../data/teaching.json";
import rawPress from "../data/press.json";
import rawTalks from "../data/talks.json";
import rawProse from "../data/prose.json";

/* ------------------------------------------------------------------ *
 * schemas
 * ------------------------------------------------------------------ */

const slug = z.string().regex(/^[a-z0-9-]{2,60}$/, "must be a lowercase slug");
const isoish = z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, "must be YYYY, YYYY-MM or YYYY-MM-DD");

export const SettingsSchema = z.object({
  name: z.string().min(1),
  name_full: z.string().min(1),
  /** How the name is set in the header and footer, e.g. "Dr. Satish K. Regonda". Falls back to name_full. */
  name_display: z.string().optional(),
  name_citation_forms: z.array(z.string()).min(1),
  title: z.string(),
  departments: z.array(z.string()),
  institution: z.string(),
  office: z.string(),
  address: z.string(),
  email: z.string().email(),
  scholar_url: z.string().url().or(z.literal("")),
  orcid_url: z.string().url().or(z.literal("")),
  linkedin_url: z.string().url().or(z.literal("")),
  iith_url: z.string().url().or(z.literal("")),
  /** The office as a machine-readable address. Blank parts drop out of the graph. */
  address_street: z.string().default(""),
  address_locality: z.string().default(""),
  address_region: z.string().default(""),
  address_postcode: z.string().default(""),
  address_country: z.string().default(""),
  /** Other records of the same person, each one opened and confirmed to be him. */
  profiles: z.record(z.string(), z.string().url()).default({}),
  raft_site_url: z.string().url().or(z.literal("")),
  raft_socials: z.record(z.string(), z.string().url()).default({}),
  raft_email: z.string().email().or(z.literal("")).default(""),
  raft_location: z.string().default(""),
  recruiting_status: z.string().max(160),
  recruiting_deadline: z.string().or(z.literal("")),
  recruiting_review_by: z.string().or(z.literal("")),
  currently: z.string().max(600),
  bio_short_25: z.string(),
  bio_short_60: z.string(),
  products_standfirst: z.string(),
  site_state: z.enum(["normal", "watch", "event"]).default("normal"),
  site_state_line: z.string().default(""),
  site_state_until: z.string().default(""),
});

const PositionSchema = z.object({
  kind: z.enum(["appointment", "education", "visiting"]),
  org: z.string().min(1),
  role: z.string().min(1),
  city: z.string().optional(),
  start: z.string().min(4),
  end: z.string().default(""),
  note: z.string().optional(),
  order: z.number(),
});

const ResearchSchema = z.object({
  slug,
  title: z.string().max(120),
  short: z.string().max(30),   // the chip label; the claim is too long for one
  summary: z.string().max(800),
  figure: z.string().optional(),
  figure_alt: z.string().max(220).optional(),
  figure_caption: z.string().optional(),
  figure_credit: z.string().optional(),
  order: z.number(),
  meta_description: z.string().max(160).optional(),
});

const PublicationSchema = z.object({
  id: slug,
  type: z.enum(["journal", "chapter", "conference", "preprint", "report"]),
  year: z.number().int().min(1990).max(2100),
  title: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  venue: z.string().min(1),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
  // A trailing period is the single commonest way a DOI link dies. Refuse it.
  doi: z.string().regex(/^10\.\d{4,9}\/\S*[^.\s]$/, "not a resolvable DOI").optional(),
  url: z.string().url().optional(),
  theme: slug.optional(),
  note: z.string().optional(),
  open_access: z.enum(["cc-by", "cc-by-nc-nd", "green", "bronze", "closed"]).default("closed"),
  exclude: z.boolean().default(false),
  /** His own abstract. Scholar will not index a paper page without one. */
  abstract: z.string().min(40).optional(),
  issn: z.string().regex(/^\d{4}-\d{3}[\dX]$/).optional(),
  /** Full published date where the record has one; the year is the fallback. */
  date: z.string().optional(),
  /** Overrides the derived search-result line for this paper. */
  meta_description: z.string().max(160).optional(),
  /** His own sequence within a year. Set from the order he lists them in. */
  order: z.number().optional(),
});

/**
 * Talks, invited seminars and scientific service.
 *
 * Not publications: nothing here is peer reviewed and none of it has a DOI, so
 * it stays out of the record and off the paper pages. It is career evidence,
 * which is why it sits on /about/ with the appointments.
 */
const TalkSchema = z.object({
  kind: z.enum(["conference", "seminar", "service"]),
  year: z.number().int().min(1990).max(2100),
  /** As he writes it: "21–23 October 2013", "January 2019". */
  when: z.string().min(1),
  authors: z.array(z.string().min(1)).optional(),
  title: z.string().min(1),
  role: z.string().optional(),
  venue: z.string().min(1),
  where: z.string().optional(),
  note: z.string().optional(),
  order: z.number(),
});

const PersonSchema = z.object({
  id: slug,
  name: z.string().min(1),
  aliases: z.array(z.string()).default([]),
  role: z.enum(["phd", "mtech", "btech", "postdoc", "staff", "intern", "visitor"]),
  status: z.enum(["current", "alumni"]),
  programme: z.string().optional(),
  department: z.string().optional(),
  start_year: z.number().int().optional(),
  end_year: z.number().int().optional(),
  viva_date: z.string().optional(),
  topic: z.string().max(300).optional(),
  /** Their own description of their work, in their words, from his site. */
  blurb: z.string().optional(),
  thesis_title: z.string().optional(),
  /** Filenames under public/people/. Empty until we have the photograph and
   *  the person has agreed to it being published. */
  photo: z.string().default(""),
  linkedin: z.string().url().or(z.literal("")).default(""),
  co_supervisor: z.string().optional(),
  note: z.string().optional(),
  // Deliberately absent for everyone until he confirms each person agreed.
  first_position: z.string().default(""),
  first_position_year: z.number().int().optional(),
  sector: z.enum(["academia", "government", "industry", "other"]).optional(),
  order: z.number(),
});

const ProjectSchema = z.object({
  slug,
  title: z.string().min(1),
  funder: z.string().min(1),
  role: z.string().min(1),
  partners: z.string().optional(),
  start_year: z.number().int().nullable().optional(),
  end_year: z.number().int().nullable().optional(),
  status: z.enum(["ongoing", "completed"]),
  summary: z.string().optional(),
  theme: slug.optional(),
  public_output: z.boolean().default(false),
  order: z.number(),
});

const ProductSchema = z.object({
  slug,
  name: z.string().min(1),
  kind: z.string().min(1),
  status: z.enum(["live", "slow", "development", "archived"]),
  audience: z.string().optional(),
  blurb: z.string().min(1),
  state_lines: z.array(z.string()).default([]),
  links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  absent_note: z.string().optional(),
  page: z.boolean().default(false),
  order: z.number(),
});

const TeachingSchema = z.object({
  code: z.string().optional(),
  title: z.string().min(1),
  /** Credits as the IITH catalogue gives them, so 1.5 is a real value. */
  credits: z.number().optional(),
  level: z.string().default(""),
  semesters: z.string().optional(),
  /** "now" runs this semester; "also" is in his rotation but not running now;
   *  "past" is a course that is no longer offered. */
  status: z.enum(["now", "also", "past"]),
  note: z.string().optional(),
  order: z.number(),
});

/** An off-site URL, or a root-relative path to a page on this site. */
const linkish = z
  .string()
  .refine((v) => /^https?:\/\//.test(v) || /^\/[^\s]*$/.test(v), {
    message: "must be a full URL or a path starting with /",
  });


const PressSchema = z.object({
  date: isoish,
  outlet: z.string().min(1),
  headline: z.string().min(1),
  kind: z.enum(["coverage", "byline", "video"]),
  url: z.string().url().optional(),
  quote: z.string().optional(),
});

/* ------------------------------------------------------------------ *
 * validation
 * ------------------------------------------------------------------ */

const warnings: string[] = [];

/** SKIP class: drop bad rows by name, keep the rest, report at the end. */
function rows<T extends z.ZodTypeAny>(schema: T, data: unknown[], label: string): z.infer<T>[] {
  const kept: z.infer<T>[] = [];
  data.forEach((row, i) => {
    const r = schema.safeParse(row);
    if (r.success) {
      kept.push(r.data);
    } else {
      const id = (row as any)?.id ?? (row as any)?.slug ?? (row as any)?.title ?? `row ${i + 2}`;
      const why = r.error.issues.map((e) => `${e.path.join(".") || "(root)"}: ${e.message}`).join("; ");
      warnings.push(`${label} — skipped "${id}" (${why})`);
    }
  });
  return kept;
}

/** FATAL class: without this there is nothing to render, so stop the build. */
function one<T extends z.ZodTypeAny>(schema: T, data: unknown, label: string): z.infer<T> {
  const r = schema.safeParse(data);
  if (!r.success) {
    const why = r.error.issues.map((e) => `  ${e.path.join(".") || "(root)"}: ${e.message}`).join("\n");
    throw new Error(
      `\nThe ${label} could not be read, so nothing was published.\n` +
        `Nothing on the website has changed.\n\n${why}\n`
    );
  }
  return r.data;
}

export const settings = one(SettingsSchema, rawSettings, "Settings tab");

/** His own words, taken from his site. Nothing here is written by anyone else. */
export const prose = rawProse as {
  bio_home: string[];
  raft_name: string;
  raft_tagline: string;
  raft_themes: string[];
  raft_mission: string[];
  raft_goal: string;
  /* His join invitation, split into its parts so the page can set each one
     once. Joined back together they are his two paragraphs, word for word. */
  join_areas: string[];
  join_aim: string;
  join_welcome_before: string;
  join_welcome: string[];
  join_welcome_after: string;
  research_overview: string;
  urban_flood: string;
  join_how: string;
  snapflood_upload: string;
};

export const positions = rows(PositionSchema, rawPositions, "Positions")
  .sort((a, b) => a.order - b.order);

export const research = rows(ResearchSchema, rawResearch, "Research")
  .sort((a, b) => a.order - b.order);

export const publications = rows(PublicationSchema, rawPublications, "Publications")
  .filter((p) => !p.exclude)
  /* Newest year first, and inside a year the order he puts them in — which is
     not alphabetical and is not something the data can derive. */
  .sort((a, b) => b.year - a.year || (a.order ?? 1e9) - (b.order ?? 1e9) || a.title.localeCompare(b.title));

export const people = rows(PersonSchema, rawPeople, "People")
  .sort((a, b) => a.order - b.order);

export const projects = rows(ProjectSchema, rawProjects, "Projects")
  .sort((a, b) => a.order - b.order);

export const products = rows(ProductSchema, rawProducts, "Products")
  .sort((a, b) => a.order - b.order);

export const teaching = rows(TeachingSchema, rawTeaching, "Teaching")
  .sort((a, b) => a.order - b.order);

/** The courses he teaches — what a count of "courses" means. The two the
 *  institute no longer offers are still on the page, but counting them would
 *  say he teaches nineteen when he teaches seventeen. */
export const coursesTaught = teaching.filter((c) => c.status !== "past");


export const talks = rows(TalkSchema, rawTalks, "Talks")
  .sort((a, b) => b.year - a.year || a.order - b.order);

/** One kind of talk, newest first. */
export function talksOfKind(kind: "conference" | "seminar" | "service") {
  return talks.filter((t) => t.kind === kind);
}

export const press = rows(PressSchema, rawPress, "Press")
  .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));

/* ------------------------------------------------------------------ *
 * derived — nothing below is ever typed by hand
 * ------------------------------------------------------------------ */

/* Current students run oldest-joined first, so the person furthest through
   the programme is at the top. Alumni run most-recently-graduated first. The
   `order` field is only a tiebreaker within a year. */
export const currentPeople = people
  .filter((p) => p.status === "current")
  .sort((a, b) => (a.start_year ?? 9999) - (b.start_year ?? 9999) || a.order - b.order);

export const alumni = people
  .filter((p) => p.status === "alumni")
  .sort((a, b) => (b.end_year ?? 0) - (a.end_year ?? 0) || a.order - b.order);

/** Counts render from the data. No human retypes a total anywhere on this site. */
export const counts = {
  publications: publications.length,
  currentPhd: currentPeople.filter((p) => p.role === "phd").length,
  currentMtech: currentPeople.filter((p) => p.role === "mtech").length,
  current: currentPeople.length,
  alumni: alumni.length,
  alumniPhd: alumni.filter((p) => p.role === "phd").length,
  products: products.length,
  projects: projects.length,
  ongoingProjects: projects.filter((p) => p.status === "ongoing").length,
  placementsKnown: alumni.filter((p) => p.first_position).length,
  photosKnown: people.filter((p) => p.photo).length,
  earliestAlumnusYear: Math.min(...alumni.map((p) => p.end_year ?? 9999)),
};

/** Fills {name} placeholders in an editable string, so a sentence he owns can
 *  still carry a number the build derives. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** The most recent papers, for the home page. Newest first, nothing curated. */
export const recentPublications = publications.slice(0, 6);

export function publicationsByTheme(themeSlug: string) {
  return publications.filter((p) => p.theme === themeSlug);
}
export function projectsByTheme(themeSlug: string) {
  return projects.filter((p) => p.theme === themeSlug);
}
/** Intrinsic pixel size of each research figure, so every <img> reserves the
 *  right box and nothing shifts as they load. Measured from the files. */
export const FIGURE_SIZE: Record<string, [number, number]> = {
  "fig-hmda.jpg": [720, 702],
  "fig-godavari-basin.jpg": [760, 546],
  "fig-hydrographs.jpg": [760, 630],
  "fig-inundation.jpg": [655, 700],
};

export function researchBySlug(themeSlug: string) {
  return research.find((r) => r.slug === themeSlug);
}
export function productBySlug(s: string) {
  return products.find((p) => p.slug === s);
}

/** Where the recruiting line is past its deadline, the site tells the truth
 *  by itself rather than waiting for him to remember. */
export function recruitingLine(today = new Date()) {
  const d = settings.recruiting_deadline;
  const expired = d && new Date(d) < today;
  if (!settings.recruiting_status || expired) {
    return {
      text: "Admissions run through the IIT Hyderabad portal. Write to me if you are interested.",
      deadline: null as string | null,
    };
  }
  return { text: settings.recruiting_status, deadline: d || null };
}

export function reportWarnings() {
  if (warnings.length) {
    console.warn(`\nPublished with ${warnings.length} item(s) skipped:`);
    warnings.forEach((w) => console.warn(`   ${w}`));
    console.warn("");
  }
  return warnings;
}

/* Nothing else calls this, so it is called here: the module is imported once
   per build, and a skipped row that is never reported is a silent failure. */
reportWarnings();
