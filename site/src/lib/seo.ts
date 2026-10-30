/**
 * Structured data and citation metadata.
 *
 * Everything here is derived from src/data. Nothing in this file is a claim the
 * pages do not already make in words: structured data that says more than the
 * visible page is the fastest way to be dropped from an index.
 *
 * None of this is behaviour. A JSON-LD block is a data island the browser never
 * executes, and a meta tag runs nothing at all.
 *
 * The nodes are addressed by @id and restated on more than one page. That is
 * deliberate: an @id resolves to one entity however many pages assert it, so
 * repeating the graph corroborates the record rather than duplicating it.
 */

import { settings, positions } from "./content";
import type { publications } from "./content";
import { doiUrl } from "./text";

export type Publication = (typeof publications)[number];

/** One `<meta name=… content=…>` pair. */
export type MetaTag = { name: string; content: string };

/** Must match `site` in astro.config.mjs. Endpoints prefer the Astro context. */
export const SITE = "https://satishregonda.in";

const HOME = `${SITE}/`;
const WEBSITE_ID = `${SITE}/#website`;
const PERSON_ID = `${SITE}/#person`;
const INSTITUTION_ID = `${SITE}/#iith`;
const RAFT_ID = `${SITE}/#raft`;

/** The URL of the one page per paper, under `trailingSlash: "always"`. */
export function publicationUrl(pub: Publication): string {
  return `${SITE}/publications/${pub.id}/`;
}

/* ------------------------------------------------------------------ *
 * the person
 * ------------------------------------------------------------------ */

/**
 * Subject terms, not a summary. These are the fields he publishes in, written
 * the way an indexer expects to read them; the pages themselves say all of this
 * in his own sentences.
 */
const KNOWS_ABOUT = [
  "Flood forecasting",
  "Urban flooding",
  "Hydrologic ensemble prediction",
  "Streamflow forecasting",
  "Monsoon hydroclimatology",
  "Hydrologic data collection",
];

/** ["Civil Engineering", "Climate Change"] → "Civil Engineering and Climate Change". */
function andList(parts: string[]): string {
  if (parts.length < 2) return parts.join("");
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

const uniq = (xs: string[]) => xs.filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);

/** The degrees listed on /about/, as institutions. Derived, never typed. */
function alumniOf() {
  const orgs = uniq(positions.filter((p) => p.kind === "education").map((p) => p.org));
  return orgs.length ? orgs.map((name) => ({ "@type": "CollegeOrUniversity", name })) : undefined;
}

/** The office, as an address a machine can read. Blank parts drop out. */
function postalAddress() {
  const a = {
    "@type": "PostalAddress",
    streetAddress: settings.address_street || undefined,
    addressLocality: settings.address_locality || undefined,
    addressRegion: settings.address_region || undefined,
    postalCode: settings.address_postcode || undefined,
    addressCountry: settings.address_country || undefined,
  };
  const filled = Object.keys(a).filter((k) => k !== "@type" && (a as Record<string, unknown>)[k]);
  /* Nothing structured on file: fall back to the one string the sheet holds. */
  return filled.length ? a : settings.address;
}

/**
 * The @graph for a page that is about him: the site, the page, the person, his
 * institution and his group, cross-referenced by @id so a consumer reads them
 * as one record.
 *
 * Undefined values are left undefined on purpose — JSON.stringify drops those
 * keys, so an empty URL in the sheet removes the property rather than shipping
 * an empty string.
 */
export function personJsonLd(pageUrl: string = HOME) {
  const jobTitle = settings.departments.length
    ? `${settings.title} of ${andList(settings.departments)}`
    : settings.title;

  /* The institutional page first: an .ac.in record of the same person is the
     reference an indexer trusts most to corroborate the rest. */
  const sameAs = uniq([
    settings.iith_url,
    settings.scholar_url,
    settings.orcid_url,
    settings.linkedin_url,
    ...Object.values(settings.profiles ?? {}),
  ]);

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: HOME,
    name: settings.name,
    alternateName: uniq([settings.name_full, settings.name_display ?? ""]),
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
    /* No potentialAction/SearchAction: the sitelinks search box was retired in
       2024 and this site has no search page to point one at. */
  };

  const institution = {
    "@type": "CollegeOrUniversity",
    "@id": INSTITUTION_ID,
    name: "Indian Institute of Technology Hyderabad",
    alternateName: settings.institution,
    url: settings.iith_url || undefined,
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${pageUrl}#profile`,
    url: pageUrl,
    name: settings.name_full,
    description: settings.bio_short_25,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
  };

  const person = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: settings.name_full,
    givenName: "Satish Kumar",
    familyName: "Regonda",
    honorificPrefix: "Dr.",
    /* The forms he publishes under. Invisible here, and set in bold in every
       author list on the site — the pages already say this at scale. */
    alternateName: uniq([
      settings.name,
      settings.name_display ?? "",
      ...settings.name_citation_forms,
    ]),
    disambiguatingDescription: `${jobTitle} at ${settings.institution}`,
    url: HOME,
    mainEntityOfPage: { "@id": WEBSITE_ID },
    image: {
      "@type": "ImageObject",
      url: `${SITE}/img/portrait.jpg`,
      width: 704,
      height: 880,
    },
    jobTitle,
    email: `mailto:${settings.email}`,
    description: settings.bio_short_60,
    affiliation: { "@id": INSTITUTION_ID },
    worksFor: { "@id": INSTITUTION_ID },
    memberOf: { "@id": RAFT_ID },
    alumniOf: alumniOf(),
    knowsAbout: KNOWS_ABOUT,
    sameAs: sameAs.length ? sameAs : undefined,
    workLocation: {
      "@type": "Place",
      name: `${settings.institution}, ${settings.office}`,
      address: postalAddress(),
    },
  };

  const raft = {
    "@type": "Organization",
    "@id": RAFT_ID,
    name: "RAFT Waters",
    alternateName: "Rainfall-runoff Analysis, Modelling & Forecasting Tools",
    description:
      "The research group Satish Regonda leads at IIT Hyderabad, building flood " +
      "forecasting and citizen-observation tools for Indian cities and rivers.",
    /* The group's page on this site, which is the page that describes it. The
       group's own domain is named here only once it serves the group. */
    url: `${SITE}/group/`,
    parentOrganization: { "@id": INSTITUTION_ID },
    member: { "@id": PERSON_ID },
    sameAs: Object.values(settings.raft_socials).length
      ? Object.values(settings.raft_socials)
      : undefined,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [website, profilePage, person, institution, raft],
  };
}

/* ------------------------------------------------------------------ *
 * page-level nodes
 * ------------------------------------------------------------------ */

/** The trail below the root. "Home" is prepended; pass the rest in order. */
export function breadcrumb(trail: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", url: HOME }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

/** A page of his writing: attributed, so the reader and the indexer agree who wrote it. */
export function webPageJsonLd(opts: { url: string; name: string; description: string; about?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${opts.url}#page`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    about: opts.about,
    author: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en",
  };
}

/** A list page: what it collects, and every item in it. */
export function collectionJsonLd(opts: {
  url: string;
  name: string;
  description: string;
  items: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${opts.url}#page`,
    url: opts.url,
    name: opts.name,
    description: opts.description,
    about: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: it.url,
      })),
    },
  };
}

/**
 * An app the group publishes. No aggregateRating: a rating the site does not
 * hold is a spam-policy violation, and one baked into a static build is stale
 * the week it ships.
 */
export function softwareJsonLd(opts: {
  url: string;
  name: string;
  description: string;
  operatingSystem?: string;
  downloadUrl?: string[];
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "MobileApplication"],
    "@id": `${opts.url}#app`,
    name: opts.name,
    url: opts.url,
    description: opts.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: opts.operatingSystem,
    creator: { "@id": RAFT_ID },
    author: { "@id": PERSON_ID },
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    downloadUrl: opts.downloadUrl?.length ? opts.downloadUrl : undefined,
    sameAs: opts.sameAs?.length ? opts.sameAs : undefined,
  };
}

/* ------------------------------------------------------------------ *
 * one paper
 * ------------------------------------------------------------------ */

/**
 * Which Highwire tag names the thing a paper appeared in. A preprint has no
 * container tag in the set, so it gets none rather than a wrong one.
 */
const VENUE_TAG: Record<Publication["type"], string | null> = {
  journal: "citation_journal_title",
  chapter: "citation_inbook_title",
  conference: "citation_conference_title",
  report: "citation_technical_report_institution",
  preprint: null,
};

/** "977–996" and "977-996" both split; "W09404" is a single-page article number. */
function splitPages(pages?: string): { first?: string; last?: string } {
  if (!pages) return {};
  const parts = pages.split(/\s*[–—-]\s*/).filter(Boolean);
  if (parts.length === 0) return {};
  return { first: parts[0], last: parts.length > 1 ? parts[parts.length - 1] : undefined };
}

/**
 * The Highwire Press meta set for one paper, in the order Scholar's own
 * documentation lists it. A tag whose value is missing is omitted entirely: an
 * empty citation_doi is worse than no citation_doi.
 *
 * There is deliberately no citation_pdf_url. The site hosts no full text, and
 * pointing Scholar at a page that does not serve one is the single thing that
 * gets a site dropped from the index. The tag ships in the same commit as the
 * file, never earlier.
 */
export function highwireTags(pub: Publication): MetaTag[] {
  const tags: MetaTag[] = [];
  const add = (name: string, content?: string | null) => {
    if (content) tags.push({ name, content });
  };

  add("citation_title", pub.title);
  for (const author of pub.authors) add("citation_author", author);
  /* Scholar prefers a full date; a bare year is legal but is the coarsest form. */
  add("citation_publication_date", pub.date || String(pub.year));

  const venueTag = VENUE_TAG[pub.type];
  if (venueTag) add(venueTag, pub.venue);

  add("citation_issn", pub.issn);
  add("citation_volume", pub.volume);
  add("citation_issue", pub.issue);

  const { first, last } = splitPages(pub.pages);
  add("citation_firstpage", first);
  add("citation_lastpage", last);

  add("citation_doi", pub.doi);

  /* Only where the page actually shows one. Never a URL that serves nothing. */
  if (pub.abstract) add("citation_abstract_html_url", publicationUrl(pub));

  return tags;
}

/**
 * What the paper appeared in, nested the way schema.org nests it: an article
 * sits in an issue, which sits in a volume, which sits in the periodical. A
 * volume or issue the sheet does not record simply drops out of the chain.
 *
 * Anything that is not a journal article gets a plain CreativeWork container —
 * a book, proceedings or institution named, and nothing implied about it.
 */
function container(pub: Publication) {
  if (pub.type !== "journal") return { "@type": "CreativeWork", name: pub.venue };

  let node: Record<string, unknown> = { "@type": "Periodical", name: pub.venue };
  if (pub.issn) node = { ...node, issn: pub.issn };
  if (pub.volume) node = { "@type": "PublicationVolume", volumeNumber: pub.volume, isPartOf: node };
  if (pub.issue) node = { "@type": "PublicationIssue", issueNumber: pub.issue, isPartOf: node };
  return node;
}

/** His own name in an author list resolves to the person this site is about. */
const SELF = new Set(settings.name_citation_forms.map((s) => s.toLowerCase()));
function authorNode(name: string) {
  if (!SELF.has(name.toLowerCase())) return { "@type": "Person", name };
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name,
    url: HOME,
    sameAs: uniq([settings.orcid_url, settings.scholar_url]),
  };
}

/**
 * The same paper as schema.org. `url` defaults to its page on this site; pass
 * the canonical the route already computed when there is one.
 */
export function articleJsonLd(pub: Publication, url: string = publicationUrl(pub)) {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: pub.title,
    name: pub.title,
    abstract: pub.abstract,
    author: pub.authors.map(authorNode),
    datePublished: pub.date || String(pub.year),
    isPartOf: container(pub),
    pagination: pub.pages,
    identifier: pub.doi ? doiUrl(pub.doi) : undefined,
    sameAs: pub.url,
    inLanguage: "en",
  };
}
