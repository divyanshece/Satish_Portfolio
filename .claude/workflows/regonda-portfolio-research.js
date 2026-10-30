export const meta = {
  name: 'regonda-portfolio-research',
  description: 'Deep research: academic portfolio UI/UX exemplars, content recon of the current Google Site, and Drive/Sheets-as-CMS architecture for satishregonda.in',
  phases: [
    { title: 'Research', detail: '15 parallel agents: content recon, design exemplars, tech architecture' },
    { title: 'Synthesize', detail: 'Merge everything into one opinionated design + architecture brief' },
    { title: 'Critique', detail: '3 adversarial lenses: genericness, editor-feasibility, completeness' },
    { title: 'Revise', detail: 'Fold critiques into the final brief' },
  ],
}

const REPORT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    topic: { type: 'string', description: 'One line: what this agent researched' },
    key_findings: {
      type: 'array',
      items: { type: 'string' },
      description: '8-20 CONCRETE, SPECIFIC findings. Named sites, named typefaces, named APIs, real numbers. Zero generic advice like "keep it clean".',
    },
    exemplars: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string', description: 'Person or lab name + institution' },
          url: { type: 'string', description: 'Real URL you actually fetched successfully' },
          what_works: { type: 'string', description: 'Specific design/IA decisions that make it good' },
          steal_this: { type: 'string', description: 'The one precise thing worth borrowing for our site' },
        },
        required: ['name', 'url', 'what_works', 'steal_this'],
      },
    },
    recommendations: { type: 'array', items: { type: 'string' }, description: 'Actionable, specific recommendations for THIS project' },
    pitfalls: { type: 'array', items: { type: 'string' }, description: 'Things that would make the site worse / traps to avoid' },
    details: { type: 'string', description: 'Long-form markdown notes: raw content inventory, API details, code snippets, numbers, quotes. Be generous here.' },
  },
  required: ['topic', 'key_findings', 'recommendations', 'details'],
}

const WEB = 'You have web access. Load WebSearch and WebFetch via ToolSearch if they are not already available, then use them aggressively (15+ searches/fetches). CRITICAL: never invent a URL or a fact. Every exemplar URL you list must be one you actually fetched successfully. Mark anything unverified as UNVERIFIED.'

const CONTEXT = `PROJECT CONTEXT (shared by all agents):
We are designing and building a new personal academic website at the domain satishregonda.in for Dr. Satish Regonda, a faculty member (Civil Engineering / Climate Change) at IIT Hyderabad, India. His field is hydrology, hydroclimatology, water resources, streamflow and flood forecasting, monsoon/climate variability, and urban flooding. He leads a research group called the RAFT research team (separate site raftwaters.in exists and will be hosted separately and linked).

His current site is a plain Google Sites page: https://sites.google.com/iith.ac.in/satishregonda/home
Goals for the new site:
- Modern, professional, aesthetic, MINIMAL, editorially crafted. It must NOT read as a generic template or an AI-generated site.
- Includes a blog the professor will post to over time.
- The professor (non-technical) must be able to edit content himself, ideally through Google Drive / Google Sheets / Google Docs (text, images, publications, current students, alumni, news).
- Modular content structure. Static frontend hosted on the purchased domain.
- RAFT group gets a rich single page on this site, linking out to raftwaters.in.`

const FAN = [
  {
    label: 'recon:current-site',
    prompt: `${CONTEXT}

${WEB}

YOUR JOB: a complete, faithful CONTENT INVENTORY of the existing site so we can migrate it.

1. WebFetch https://sites.google.com/iith.ac.in/satishregonda/home and then discover and fetch EVERY subpage. Google Sites subpages follow https://sites.google.com/iith.ac.in/satishregonda/<slug> - try the slugs you find in the navigation, plus likely ones: home, research, publications, journal-publications, conference, teaching, courses, students, group, team, people, raft, alumni, cv, contact, news, awards, projects, gallery, opportunities, positions.
2. Also WebFetch https://raftwaters.in and https://www.raftwaters.in and http://raftwaters.in - report whether the domain resolves, what is on it, what stack it appears to use, and whether it looks finished.

In "details", REPRODUCE THE ACTUAL TEXT as faithfully as you can, page by page: full bio paragraphs, research theme descriptions, the complete publication list (authors, year, title, journal, volume/pages, DOI if shown), course codes and names, every named current student and their topic, every named alumnus and where they went, awards, funded projects, contact block, and the URL + description of every image.

Then analyse: what content TYPES exist (these become CMS collections), what is missing that a strong faculty site should have, what is stale/broken/duplicated, and what the current information architecture is. Fidelity and completeness matter more than commentary here.`,
  },
  {
    label: 'recon:scholar-dossier',
    prompt: `${CONTEXT}

${WEB}

YOUR JOB: build a verified public dossier on Dr. Satish Regonda (IIT Hyderabad, Civil Engineering / hydrology). Note there may be name variants: "Satish Kumar Regonda", "S. Regonda", "Regonda SK".

Find and verify, with URLs:
(a) his IITH faculty profile page and the CE department listing;
(b) Google Scholar profile URL, citation count, h-index, i10-index, and his 10 most-cited papers;
(c) ORCID iD, Scopus author ID, Web of Science / Publons, ResearchGate, LinkedIn, X/Twitter, GitHub if any;
(d) what RAFT stands for, the group's stated mission/scope, and any member list;
(e) publications from 2018 to 2026 with full citations and DOIs;
(f) funded/sponsored projects, sponsors (DST, MoES, SERB, World Bank, etc.), awards, editorial board roles, reviewer roles, professional memberships;
(g) education history and prior affiliations (verify whether these include e.g. University of Colorado Boulder / CIRES, NOAA Colorado Basin River Forecast Center, Riverside Technology, IIT Bombay, Osmania University - confirm, do not assume);
(h) courses he teaches at IITH;
(i) any news coverage, interviews, talks, or media mentions.

Also check: does Google Scholar expose an API? (It does not officially - note what the practical options are, e.g. SerpApi, scholarly, manual BibTeX export.) Does he have an ORCID record with works populated? Is he in OpenAlex / Semantic Scholar / Crossref, and what are his identifiers there?

In "details", give a clean, structured, citation-ready dossier with a clear UNVERIFIED section for anything you could not confirm.`,
  },
  {
    label: 'design:us-professor-sites',
    prompt: `${CONTEXT}

${WEB}

YOUR JOB: study the personal websites of respected professors at top US universities (MIT, Stanford, CMU, Berkeley, Princeton, Caltech, Harvard, Michigan, UW, Columbia) and extract what makes the GOOD ones feel hand-crafted, confident and timeless rather than templated.

Actually fetch and examine at least 15 real sites. Good starting candidates to verify and then branch from: Andrej Karpathy, Chris Olah, Fernanda Viegas, Rebecca Fiebrink, Jeffrey Heer (UW Interactive Data Lab), Maneesh Agrawala (Stanford), Pat Hanrahan, Bjoern Hartmann (Berkeley), Michael Bernstein (Stanford HCI), Arvind Narayanan (Princeton), Ed Chi, Jon Kleinberg (Cornell), Daniela Rus (MIT CSAIL), Regina Barzilay, Dina Katabi, Hal Abelson, Scott Aaronson (UT Austin), Terence Tao (UCLA), Tim Roughgarden, Julia Evans, Nadia Polikarpova, Emery Berger (UMass), Matt Might, Philip Guo (UCSD), Amy Ko (UW), Cynthia Rudin (Duke), David Blei (Columbia). Branch out to civil/environmental/earth-science faculty too.

For each, note concretely: page width and measure, typeface choices (inspect what fonts they actually use), type scale, whether there is a hero image and how the headshot is treated, navigation pattern (top bar vs sidebar vs single scroll), how publications are laid out, use of color (usually one accent), whitespace rhythm, whether there is motion, footer treatment, mobile behaviour.

Then answer the key question directly: what specific, copyable design decisions separate a site that feels like it was made by a thoughtful human with taste from one that feels like a Bootstrap/Wix/AI template? Be concrete (e.g. "asymmetric two-column grid with a sticky left rail", "serif body at 19px/1.65 with 68ch measure", "no card shadows anywhere - hairline rules instead").`,
  },
  {
    label: 'design:intl-professor-sites',
    prompt: `${CONTEXT}

${WEB}

YOUR JOB: same brief as a sibling agent, but for NON-US and NON-CS academics, so we get a wider aesthetic vocabulary. Study personal sites of professors at Oxford, Cambridge, Imperial, UCL, ETH Zurich, EPFL, TU Delft, KTH, TU Munich, Wageningen, NUS, Tsinghua, University of Tokyo, University of Melbourne, and strong Indian institutions (IITs, IISc, IIIT, ISI, TIFR, Ashoka, Krea).

Deliberately cover fields OUTSIDE computer science: civil/environmental engineering, hydrology, earth and climate science, economics, geography, public policy, architecture. These fields have different conventions (fieldwork photography, maps, data figures, policy briefs) and that is directly relevant to a hydrologist.

Also specifically survey: how do the BEST Indian academic personal sites look, and what is the typical (usually poor) baseline? What would make an IIT professor's site stand out as internationally credible without looking imported?

For each exemplar record the same concrete details: typography, grid, color, headshot treatment, how research areas are communicated visually, how field photos / data figures / maps are used, navigation, mobile behaviour. Note which ones use diagrams or figures from their own papers as visual identity - that is a strong anti-generic move.`,
  },
  {
    label: 'design:lab-group-sites',
    prompt: `${CONTEXT}

${WEB}

YOUR JOB: study RESEARCH GROUP / LAB websites (not individual faculty pages) and extract the best patterns for a group page, because our site needs one rich single page for the RAFT research team, plus current-students and alumni sections.

Fetch at least 15 real lab sites. Candidates to verify and branch from: MIT Media Lab groups, Stanford HCI Group, UW Interactive Data Lab (idl.cs.washington.edu), Berkeley RISELab/Sky Computing, CMU HCII labs, Google DeepMind research pages, Allen Institute, ETH labs, Oxford Robotics Institute, hydrology and climate labs (see sibling agent), Princeton Visual AI Lab, Stanford Vision Lab, MIT Senseable City Lab, Columbia Water Center, and any lab site you find that is genuinely well designed.

Extract concrete patterns for:
- People pages: grid vs list, photo treatment (circle vs square vs duotone vs no photo), what metadata per person, how PhD/MS/intern tiers are separated, how ALUMNI are shown (with current placement - this is high value and often done badly), how to handle missing photos gracefully.
- News / updates feeds: format, density, dating, how they avoid looking dead when updates are sparse.
- Research themes: how a lab communicates 3-6 thrusts visually without stock icons.
- Projects: card vs list, how funded projects and sponsors are credited.
- Joining/opportunities pages: what strong ones say to prospective students.
- Publications at group scale.

Call out specifically: what makes a lab page feel ALIVE and real (candid photos, dated updates, named people, specific projects) versus feeling like a brochure.`,
  },
  {
    label: 'design:water-climate-domain',
    prompt: `${CONTEXT}

${WEB}

YOUR JOB: domain-specific visual research. Study how hydrology, water resources, climate and earth-science scientists and groups present themselves online, so our design speaks the language of the field rather than looking like a generic tech portfolio.

Fetch real sites for: Columbia Water Center, NOAA/NWS river forecast centres, NCAR/UCAR and CIRES researchers, Upmanu Lall, Balaji Rajagopalan (CU Boulder), Casey Brown (UMass), Marc Bierkens / Utrecht Hydrology, TU Delft water resources, Wageningen hydrology, IIT/IISc water groups, ICIMOD, IWMI, the Global Flood Awareness System, and individual hydrologists with good personal sites.

Extract:
- How maps, basin diagrams, hydrographs, satellite imagery and field photography are used as visual identity, and how to do this tastefully (not clip-art water droplets, not stock photos of rivers).
- Color palettes that read as "water/climate science" without being cliche blue-gradient. Look at what cartographic and scientific palettes (ColorBrewer, cmocean, Scientific Colour Maps) offer as an accent-color source.
- How data figures from papers are reused as hero/section imagery, and the practical rules (contrast, cropping, dark-mode handling, alt text, attribution).
- How field/site photos of India (rivers, reservoirs, monsoon flooding, gauging stations, fieldwork with students) could form the photographic backbone. What makes such photography look editorial rather than like a slideshow.
- Any conventions for presenting datasets, models, code, and forecasting tools that a hydrologist audience expects.

Also: what does the audience actually come for? (prospective students, collaborators, funding agencies, journalists, policymakers.) What must be findable in 5 seconds for each.`,
  },
  {
    label: 'design:anti-generic-tells',
    prompt: `${CONTEXT}

${WEB}

YOUR JOB: the most important agent for the brief. Answer, with evidence: what exactly makes a website read as "made by AI" or "made from a template", and what makes one read as designed by a person with taste? The client explicitly said the site must not feel AI-generated.

Research current (2025-2026) commentary from designers, typographers and developers on: AI-generated website tells, "AI slop" design, the sameness of Tailwind/shadcn defaults, the purple-gradient/glassmorphism era, LLM-default aesthetics. Search design blogs, Are.na, Dribbble critiques, Hacker News threads, typography sites (Practical Typography by Matthew Butterick, Typewolf, Fonts In Use), and portfolio-critique communities.

Produce a precise CHECKLIST split into two lists:
A) BANNED / dead-giveaway signals - be very concrete. Cover things like: purple-to-blue gradients, glassmorphism cards, rounded-2xl shadow-lg cards everywhere, Inter as the only typeface, emoji as section icons, generic Lucide/Heroicons icon grids, "Elevate your X" copy voice, three-column feature grids with icon+title+lorem, stock photos, hero sections with a centered headline + two CTA buttons, fake testimonial carousels, animated gradient blobs, unnecessary scroll-triggered fade-ins, "Let's connect!" energy, over-even 8pt everything with zero asymmetry, meaningless numbers/stat counters, and AI-generated imagery.
B) SIGNALS OF A REAL DESIGNER - equally concrete. Things like: a real typeface pairing with an opinion, optical rather than mathematical spacing, asymmetry, a genuinely restrained palette (often near-monochrome plus one accent), hairline rules instead of shadows, real photography with real people, idiosyncratic but consistent details, generous measure control, text that sounds like a specific person, dates and specifics rather than adjectives, deliberate imperfection, editorial layout borrowed from print.

Also research: what typographic and layout conventions do respected editorial/print-inspired web properties use (e.g. Works in Progress, Asterisk, Increment, The Pudding, Stripe Press, Nautilus, Aeon, Quanta, MIT Press, university press sites)? These are a better model for an academic site than SaaS landing pages.

End with a concrete "taste rubric" of 15-25 yes/no checks we can run against our own design before shipping.`,
  },
  {
    label: 'design:type-color-systems',
    prompt: `${CONTEXT}

${WEB}

${'YOUR JOB: specify the typographic and color system, concretely enough to implement.'}

TYPOGRAPHY - research and recommend 3 distinct, defensible pairings suitable for a serious academic/scientific site. For each candidate typeface verify: exact name, foundry, license (SIL OFL / Google Fonts / commercial / free-for-web), where to get it, available weights and optical sizes, whether it has real italics and small caps, tabular figures (needed for publication years and citation counts), and file size / variable-font availability.

Strong candidates to actually evaluate (verify licensing for each): Source Serif 4, Newsreader, Literata, Spectral, Lora, EB Garamond, Crimson Pro, Libre Baskerville, Fraunces, Instrument Serif, Petrona, Bitter, Charter/Charis SIL, IBM Plex Serif and Plex Sans, Inter (and why it is a tell if used alone), Public Sans, Söhne alternatives, Geist, General Sans / Switzer / Satoshi (Fontshare), Untitled Sans alternatives, Neue Haas Grotesk alternatives, Space Grotesk, Karla, Work Sans, Atkinson Hyperlegible, JetBrains Mono, iA Writer Quattro, Berkeley Mono alternatives. Fontshare (Indian Type Foundry) is worth a close look for free, high-quality, non-obvious faces.

For each of your 3 pairings give: display/heading face + weight, body face + size/line-height/measure, UI/meta face, mono face, a full modular type scale in rem with line heights, and a one-line statement of the mood it creates. Say which one you recommend and why, given "minimal, editorial, scientific, Indian institution, must not look templated".

COLOR - specify 2-3 palettes as actual hex values with light AND dark mode tokens: page background (usually an off-white with a hint of warmth or coolness, not pure #fff), primary text, secondary text, hairline/border, surface, and exactly one accent (plus one optional secondary accent). Verify WCAG AA contrast ratios for every text-on-background pair and state the computed ratios. Explain the reasoning for the accent choice in a hydrology/climate context. Also give the rules for when the accent may be used.

Also cover: spacing scale, grid (column count, max widths for prose vs full-bleed), border radii policy, shadow policy, focus-ring treatment, and a link-styling decision (underline offset/thickness) - academic sites are link-dense and this matters a lot.`,
  },
  {
    label: 'design:writing-blog',
    prompt: `${CONTEXT}

${WEB}

YOUR JOB: design research for the BLOG / writing section, which the professor will post to over time (likely infrequently, in mixed formats: research explainers, opinion on water policy, field notes, advice for students, group news).

Study the best writing-first personal sites and academic blogs. Fetch and analyse at least 15: Andrej Karpathy's blog, Chris Olah / Distill, Gwern, Scott Aaronson's Shtetl-Optimized, Terence Tao's blog, Matt Might, Philip Guo, Julia Evans, Dan Luu, Simon Willison, Maggie Appleton, Amelia Wattenberger, Nicky Case, Bartosz Ciechanowski, Ethan Mollick's One Useful Thing, Works in Progress, Asterisk Magazine, Stratechery, Robin Sloan, Craig Mod, Frank Chimero, Jason Kottke, Ken Shirriff, Tom MacWright, Ben Kuhn.

Extract concretely:
- Index page design: reverse-chron list vs cards vs year-grouped; how much metadata (date, reading time, tags); how to make an index with only 3 posts still look intentional rather than empty (this is critical for us - the blog starts empty).
- Post page design: measure, type size, heading hierarchy, how figures/captions/tables/equations/code are handled, footnotes and margin notes, pull quotes, blockquote treatment, how images are sized and captioned.
- Reading experience: TOC placement, progress indicators (usually a tell - discuss), estimated reading time (discuss), scroll behaviour, print stylesheet.
- Discovery: tags/categories, series, archive page, search, RSS/Atom (still expected in academic circles), newsletter/email subscribe (should we?), permalink and slug conventions, OG/Twitter cards.
- Equations (KaTeX vs MathJax), citation/reference blocks, embedded charts and maps, and dark-mode handling of scientific figures.
- Voice and framing: how do academic bloggers title and open posts so they do not read as marketing?

Give a specific recommended structure for our blog, including what an empty-state and a 3-post state should look like.`,
  },
  {
    label: 'design:pubs-people-teaching',
    prompt: `${CONTEXT}

${WEB}

YOUR JOB: nail the design patterns for the three highest-traffic academic page types: PUBLICATIONS, PEOPLE (current students + alumni), and TEACHING.

PUBLICATIONS - fetch at least 12 real faculty publication pages across fields and compare. Analyse: grouping (by year descending vs by type vs by theme vs "selected" + "all"), how the author's own name is emphasised in the author list, how student co-authors are marked (many labs asterisk their students - a lovely detail), what links are offered (DOI, PDF, arXiv, code, data, slides, video, bibtex, press) and how they are styled without becoming a button soup, whether venue is bolded or italicised, how to show 100+ items without a wall of grey, filtering/search UX, counts and citation metrics (should we show them?), "selected publications" curation, hover/expanded abstracts, and how BibTeX copy-to-clipboard is offered. Note who does this beautifully and who does not.

PEOPLE - patterns for current PhD/MTech/BTech students and, importantly, ALUMNI with their current positions. Photo treatment, fallbacks when there is no photo, ordering, what metadata per person (cohort year, topic, co-advisor, links), how to show a group that grows and shrinks, and how alumni placement lists build a lab's credibility.

TEACHING - how faculty present courses: current vs past, course code/name/semester/level, syllabus and materials links, whether to link to institutional LMS, student feedback/quotes, and teaching philosophy statements. Also mentoring, outreach, and service.

Additionally cover: CV page vs downloadable PDF (and keeping them in sync), a News/Updates feed, an Awards/Honours section, a Talks section, a Data/Code/Tools section, and a Contact page that is useful (office, address, how to reach out, an explicit note for prospective students, which is the single most-emailed topic a professor gets).

Be concrete and cite exemplars with URLs.`,
  },
  {
    label: 'tech:drive-sheets-cms',
    prompt: `${CONTEXT}

${WEB}

YOUR JOB: the core technical question. The professor must be able to edit site content himself using Google tools (Sheets for structured data, Drive for images, Docs for prose). Research and specify how to do this WELL, with real API limits and real failure modes.

Cover thoroughly:
1. Reading Google Sheets programmatically: the Sheets API v4 (auth options: OAuth vs service account vs API key on a public sheet), the legacy gviz/tq JSON endpoint, "Publish to web" CSV export, and the opensheet-style proxies. For each: exact URL shape, auth requirements, quotas and rate limits (state the real numbers, e.g. requests per minute per project/user), reliability, and whether it works at build time in CI. Verify current 2026 status - Google has deprecated things before.
2. Images from Google Drive: how to get a stable, hot-linkable image URL from a Drive file, why the classic drive.google.com/uc?export=view and thumbnail URLs are unreliable, rate limiting and the "quota exceeded" failure, CORS, and the recommended approach - probably downloading at build time via the Drive API and committing/optimising them. Detail an image pipeline: Drive folder -> build-time fetch -> resize/AVIF/WebP -> hashed filenames -> next/image or equivalent. Cover how the professor pastes a Drive link into a Sheet cell and what our build does with it.
3. Google Docs as a prose source: the Docs API, exporting to HTML/Markdown, cleanliness of that HTML, handling headings/lists/images/links/footnotes, and libraries that convert Docs to Markdown. Compare with just using a Sheet cell for short prose.
4. The build/publish trigger: how does an edit in a Sheet become a live site? Options: scheduled rebuilds (GitHub Actions cron), a Google Apps Script onEdit trigger that calls a deploy webhook, a manual "Publish" button (an Apps Script menu item or a simple protected page), Vercel/Netlify deploy hooks, and ISR/on-demand revalidation. Give latency, cost, and reliability for each, and recommend one. Include how a non-technical user gets feedback that the publish worked or failed.
5. Validation and safety: what happens if he deletes a column, misspells a header, pastes a bad link, or leaves a required field blank? Specify a schema-validation layer (e.g. Zod) that fails the build with a HUMAN-READABLE error, plus the idea of never breaking the live site (build fails -> previous deploy stays up). Also: data-entry ergonomics in Sheets - frozen headers, data validation dropdowns, example rows, a README tab, protected header ranges.
6. Honest alternatives comparison: Google Sheets/Drive vs Notion API vs Airtable vs Decap CMS vs Sveltia CMS vs TinaCMS vs Pages CMS vs Keystatic vs Sanity vs Contentful vs Prismic vs Payload vs plain Markdown in GitHub with the github.dev editor. For each: cost at our scale, learning curve for a 50-something non-technical professor, offline/mobile editing, image handling, versioning/rollback, vendor risk, and whether it survives the developer (Divyansh) disappearing in 2 years. Give a clear recommendation, and consider a HYBRID (Sheets for tabular data like publications/people/news; a git-backed visual CMS for long-form pages and blog posts).

In "details", include actual code snippets and exact URL formats.`,
  },
  {
    label: 'tech:publications-automation',
    prompt: `${CONTEXT}

${WEB}

YOUR JOB: specify how the publications list stays current with as little manual work as possible, since keeping publications up to date is the single biggest maintenance burden on a faculty site.

Research and give exact, current (2026) details for:
1. ORCID Public API - endpoints, auth (public token flow), what a works record contains, how complete it typically is, rate limits, and whether it can be the single source of truth.
2. Crossref REST API - query by ORCID or author name, what metadata comes back, the polite pool / mailto convention, rate limits.
3. OpenAlex API - author disambiguation, works endpoint, rate limits (state the real numbers and the mailto convention), citation counts, concepts, open-access status and best_oa_location for free PDF links. Assess whether OpenAlex alone could power the whole publications page including citation counts.
4. Semantic Scholar Graph API - endpoints, API key requirements, rate limits, what it adds (tldr summaries, influential citation counts, PDF links).
5. Google Scholar - confirm there is no official API; evaluate SerpApi (cost), the scholarly Python package (blocking/CAPTCHA reality), and manual BibTeX export from the Scholar profile. Assess: is periodically exporting BibTeX from Scholar and committing it the pragmatic winner?
6. BibTeX pipelines - parsing libraries (citation-js, bibtex-parse-js, bibtexparse, Python bibtexparser/pybtex), rendering styles (CSL/citeproc-js with a chosen CSL style), and how to render a citation consistently.
7. DOI resolution, arXiv API, Unpaywall for legal free-PDF links, and how to link PDFs that we are allowed to host.
8. A recommended concrete architecture: which source is canonical, how a scheduled job (GitHub Action) refreshes it, how the professor overrides or curates (e.g. a "featured" flag, a manual entry for a paper the APIs missed, an author-name-highlight rule, a student-coauthor asterisk), how to dedupe across sources, and how to keep it deterministic so the site does not change under him.
9. Also: Highwire Press meta tags (citation_title, citation_author, citation_publication_date, citation_pdf_url) so Google Scholar can index papers hosted on the site, and schema.org ScholarlyArticle / Person / Organization JSON-LD.

Include real request URLs and sample JSON shapes in "details".`,
  },
  {
    label: 'tech:blog-authoring-flow',
    prompt: `${CONTEXT}

${WEB}

${'YOUR JOB: specify the blog authoring pipeline for a non-technical academic author who will publish infrequently and wants zero friction.'}

Evaluate, in depth and with current 2026 accuracy:
1. Google Docs as the writing surface -> published to the site. Research the Docs API export path, docs-to-markdown converters (e.g. the Docs to Markdown add-on, google-docs-to-markdown, docs-markdown libraries), how images inside a Doc are extracted, how headings/lists/links/footnotes/tables survive, and how "publish this draft" is signalled (a Drive folder called Published vs a Sheet row with a status column vs a naming convention). This is the most likely winner given the client's stated preference - stress-test it hard and find the real problems (image extraction, smart quotes, pasted formatting garbage, ordering, slugs, dates, drafts, edits after publish, deletion).
2. Git-backed visual CMS alternatives that a professor could actually use: Decap CMS, Sveltia CMS, Pages CMS, TinaCMS, Keystatic, Prose.io. For each: hosting/auth requirements (Netlify Identity is EOL - verify), GitHub OAuth setup, editorial workflow/drafts, media library, mobile usability, maintenance risk.
3. Notion as a blog CMS: the API, rate limits, block-to-HTML conversion fidelity, image URL expiry (this is a real gotcha - detail it).
4. Substack/Ghost/Medium embedded or cross-posted; Hashnode headless; Buttondown for email. Assess whether the blog should also be an email newsletter.
5. Markdown/MDX in the repo with a preview deploy - what the actual friction is for a non-technical author, and whether github.dev or a simple in-repo editor closes the gap.

Then specify the RECOMMENDED pipeline end to end: where he writes, how he marks a post ready, what runs, how long until it is live, what happens on failure, how he fixes a typo after publishing, how images get optimised, how drafts stay private, how the date and slug are set, and how we get RSS. Include the fallback if the primary path breaks.

Also cover blog content ergonomics: figure captions, equations, footnotes, syntax highlighting, tables, embedded charts/maps, and how to keep all of that possible from the chosen authoring surface.`,
  },
  {
    label: 'tech:stack-hosting-deploy',
    prompt: `${CONTEXT}

${WEB}

YOUR JOB: recommend the frontend stack and hosting, with real 2026 pricing, limits and India-specific performance considerations. The domain satishregonda.in is already purchased. A second site, raftwaters.in, also needs hosting and is described as "ready" - likely static files.

Cover:
1. Framework choice: Astro vs Next.js (App Router) vs SvelteKit vs Eleventy vs Hugo vs plain Vite. Weigh: static output quality, build-time data fetching from Google APIs, image optimisation, MDX/content collections, view transitions, JS payload (a minimal academic site should ship almost no JS), long-term maintainability by a future developer, and ecosystem. Astro's content collections and content layer are directly relevant - research their current capabilities for remote data sources. Give a clear recommendation with reasoning, and name the runner-up.
2. Hosting: Vercel, Netlify, Cloudflare Pages/Workers, GitHub Pages, Render. For each give current free-tier limits, what triggers paid tiers, build minutes, bandwidth, custom domain and SSL support for a .in domain, whether commercial/personal-use terms are an issue for an academic site, and edge presence in India (Mumbai/Chennai/Delhi PoPs). Cloudflare's India presence and free tier deserve close attention.
3. DNS and domain: where .in domains are typically registered (the registrar matters - check if they need to move nameservers), setting apex + www, email forwarding for a contact address, and how to attach raftwaters.in as a second project. Also: should the personal site and the group site share a repo/monorepo or be separate?
4. Analytics that respect privacy and are free/cheap: Plausible, Umami (self-host), Cloudflare Web Analytics, GoatCounter, Simple Analytics, Vercel Analytics. Recommend one.
5. Forms/contact: whether to have a contact form at all, spam risk, email obfuscation, Formspree/Web3Forms/Cloudflare Turnstile.
6. Ops: GitHub repo layout, CI (GitHub Actions), preview deploys, environment secrets for Google service-account credentials, secret rotation, and a runbook for "the site broke and Divyansh is unreachable".
7. Cost: total realistic annual cost of the whole thing, and what the free path looks like.
8. Search on the site: Pagefind vs Fuse.js vs Algolia DocSearch. For a site with publications and blog posts, what is right?

Give real numbers and cite the pricing/limits pages you fetched.`,
  },
  {
    label: 'tech:perf-a11y-seo',
    prompt: `${CONTEXT}

${WEB}

YOUR JOB: the quality layer - performance, accessibility, SEO and scholarly discoverability. Academic sites are read on bad connections, by screen readers, by search engines, and by Google Scholar's crawler.

Cover concretely:
1. Performance budget for a text-heavy site: target LCP/INP/CLS numbers, a realistic JS budget in KB, font loading strategy (self-host vs Google Fonts CDN, font-display, preload, subsetting, variable fonts, unicode-range, avoiding FOUT/FOIT), image strategy (AVIF/WebP, responsive srcset, aspect-ratio to prevent CLS, lazy loading, LQIP/blur placeholders), and how to keep it fast on a 3G connection in India.
2. Accessibility: WCAG 2.2 AA specifics that actually bite on this kind of site - color contrast, focus visibility, skip links, heading order, link text ("read more" is a fail), alt text conventions for scientific figures and headshots, reduced-motion, keyboard navigation of any filter/search UI, form labels, and language attributes. Also: how to write good alt text for a hydrograph or a map.
3. SEO for a person: title/description patterns, canonical URLs, sitemap.xml, robots.txt, OG and Twitter card images (and how to generate per-page OG images at build time), JSON-LD (Person, Organization, ScholarlyArticle, BlogPosting, Course), and how to win the search for the professor's name over ResearchGate/LinkedIn/Scholar.
4. Google Scholar indexing: the Highwire Press meta tag set required for Scholar to index a PDF hosted on our site, plus Scholar's crawl requirements (PDF must be linked from an HTML abstract page, etc.). Fetch Google Scholar's official inclusion guidelines and quote the requirements.
5. Dark mode done properly for a scientific site: how to handle figures with white backgrounds, images, maps, and equations in dark mode. Options and trade-offs (filter inversion is usually wrong - discuss).
6. Print stylesheet, and a CV that prints well.
7. Longevity: link rot, archiving with the Wayback Machine, stable permalink policy, and what happens to the site in 10 years.
8. Privacy/compliance: no-cookie analytics, DPDP Act (India) awareness, email harvesting protection.

Give a shippable checklist with specific thresholds and code snippets.`,
  },
]

log('Fanning out ' + FAN.length + ' research agents')
phase('Research')
const reports = (await parallel(
  FAN.map(t => () => agent(t.prompt, { label: t.label, phase: 'Research', schema: REPORT_SCHEMA }))
)).filter(Boolean)

log('Got ' + reports.length + ' reports; synthesizing')
phase('Synthesize')

const brief = await agent(`${CONTEXT}

You are the lead designer + architect. Fifteen research agents just returned. Your job is to write THE BRIEF: one opinionated, decisive, implementation-ready document. Not a survey. Not "here are some options to consider." Make calls, and justify them in one line each.

Here is all the research as JSON:

${JSON.stringify(reports)}

Write a long markdown document with EXACTLY these sections:

## 1. Who this site is for
The 5 real audiences and the one thing each needs in 5 seconds. Derived from the research, not invented.

## 2. Positioning and voice
What this site should feel like in one sentence, and 3 adjectives it must NOT be. How the copy should sound (with 2 rewritten sample paragraphs: a bio and a research-theme blurb, using the REAL verified facts from the recon dossier - mark any invented placeholder clearly as [PLACEHOLDER]).

## 3. Design direction
Pick ONE direction and name it. Then give the runner-up in 3 lines and say why it lost. For the chosen direction specify: the mood, the reference points (with URLs), and the single organising idea that makes it non-generic.

## 4. The design system, concretely
- Typography: exact typefaces, foundry, license, source, weights, and a full type scale table (element / font / size rem / line-height / weight / letter-spacing / measure).
- Color: full token table with hex values for light AND dark mode, plus computed WCAG contrast ratios for every text pair.
- Spacing scale, grid and max-widths, radius policy, border/hairline policy, shadow policy (probably: none), link styling, focus ring, motion policy.
- 5-8 signature details that are the "fingerprint" of this site - specific, unusual-but-tasteful decisions no template would produce.

## 5. Information architecture
Full sitemap with every route. For each page: purpose, the audience it serves, and its content blocks in order. Say explicitly what is a real page vs a section of the home page. Include the RAFT group page and how it relates to raftwaters.in.

## 6. Page-by-page layout specs
For each page, a text wireframe (ASCII-ish block diagram) plus notes on desktop and mobile. Be specific about the home page above-the-fold: what the visitor sees first, and why it is not a centered-headline-plus-two-buttons hero.

## 7. Content model
Every collection as a table: collection name, where it is edited (which Sheet tab / Drive folder / Doc), every field with type, required/optional, validation rule, and an example row. Cover at minimum: site settings, bio, research themes, publications, projects/grants, people (current), alumni, teaching/courses, news/updates, talks, awards, blog posts, gallery/photos, and CV.

## 8. Technical architecture
The stack, with the decision and the runner-up for each layer. Data flow diagram in text: Google Sheet/Drive/Doc -> fetch -> validate -> build -> deploy -> CDN. Exact APIs, auth model, secrets, caching, image pipeline, publication sync, search, RSS, sitemap, OG images. Include the failure-mode table: what breaks, what the professor sees, what the fallback is.

## 9. The professor's workflow
Written as if for him, non-technical, step by step: how to change his bio, add a publication, add a student, move a student to alumni, post a blog entry, add a photo, and publish. Include how long each takes and how he knows it worked. Then list what he can NOT do himself and who he asks.

## 10. Build plan
Phases with a checklist of deliverables per phase, in dependency order, plus what we need FROM the professor at each phase (photos, CV, text, Drive access) and a realistic effort estimate per phase.

## 11. Anti-generic rubric
The 20-point yes/no checklist from the research, adapted to this project, that we will run against the site before shipping.

## 12. Open questions for the client
Only the ones that genuinely change the build.

Be specific everywhere. Use real names, real hex codes, real URLs, real field names. Where the research conflicts, say so and pick a side.`, { phase: 'Synthesize' })

log('Brief drafted; running adversarial critique')
phase('Critique')

const CRITIQUE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    lens: { type: 'string' },
    verdict: { type: 'string', description: 'One paragraph: does the brief succeed on this lens?' },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          severity: { type: 'string', enum: ['blocker', 'major', 'minor'] },
          section: { type: 'string' },
          problem: { type: 'string' },
          fix: { type: 'string', description: 'The concrete replacement, not just "reconsider this"' },
        },
        required: ['severity', 'section', 'problem', 'fix'],
      },
    },
    missing: { type: 'array', items: { type: 'string' }, description: 'Things absent from the brief entirely that must be added' },
  },
  required: ['lens', 'verdict', 'issues'],
}

const LENSES = [
  {
    label: 'critique:genericness',
    prompt: `You are a hostile, highly-opinionated art director reviewing a design brief. The client's #1 requirement is that the finished site must NOT look AI-generated or templated. Your job is to find every place this brief would produce something generic.

Attack: is the "design direction" actually a direction, or a vibe word? Are the typeface choices safe/obvious (is this just Inter + a serif)? Is the palette actually distinctive or is it the default off-white + one blue? Are the "signature details" real or are they decoration? Would the home-page layout described here be indistinguishable from 10,000 other sites? Is the copy voice specific to a hydrologist in Hyderabad, or interchangeable? Does the dark mode add value or is it there because everything has it? Does the layout have any asymmetry, any tension, any point of view? Is there any evidence of a real human's taste, or a set of safe defaults arranged neatly?

Be merciless and be SPECIFIC. Every issue must come with a concrete replacement - name the actual typeface, the actual hex, the actual layout move.`,
  },
  {
    label: 'critique:editor-feasibility',
    prompt: `You are a pragmatic senior engineer who has watched three "the client will edit it in a Google Sheet" CMSes die. Review this design brief for whether a 50-something professor with no technical background will actually be able to maintain this site two years from now, after the developer has moved on.

Attack: every step of the editing workflow. What happens when he pastes a Drive link that is not shared publicly? When he adds a row but leaves the date blank? When he renames a tab? When Google changes an API? When the build fails at 11pm before a grant deadline? When he wants to reorder publications? When he wants to fix a typo in a published blog post? When he is on his phone in an airport? When the service-account key expires? When GitHub Actions free minutes run out? When two people edit at once?

Also attack the maintenance burden: how many moving parts does this have, and what is the minimum-viable version that has 80% of the value with 30% of the parts? Is the publications automation actually going to work, or is it going to produce a wrong author list and get quietly abandoned?

Every issue needs a concrete fix, including possibly "cut this feature."`,
  },
  {
    label: 'critique:completeness',
    prompt: `You are a meticulous reviewer checking a design brief for COMPLETENESS and internal consistency before a build starts.

Attack: What did the brief not answer that the builder will hit on day one? Check that every route in the sitemap has a layout spec, that every content type in the model has a place it is edited AND a place it is displayed, and that nothing in the recon inventory of the professor's existing site was silently dropped in migration. Check for contradictions between sections (e.g. a field named one thing in section 7 and another in section 8). Check that the RAFT group page and the relationship to raftwaters.in is genuinely resolved and not hand-waved. Check that the empty states are specified (blog with 0 posts, news with 0 items, alumni with 0 people, a student with no photo). Check that error and edge cases are specified. Check that accessibility, performance, SEO and Google Scholar indexing requirements are actually in the plan and not just mentioned. Check the build plan is in true dependency order and that "what we need from the professor" is complete and gathered early enough. Check that the open questions section does not contain questions the research already answered.

Also: what is in this brief that should be CUT because it adds scope without value?`,
  },
]

const critiques = (await parallel(
  LENSES.map(l => () => agent(l.prompt + '\n\n=== THE BRIEF ===\n\n' + brief, { label: l.label, phase: 'Critique', schema: CRITIQUE_SCHEMA }))
)).filter(Boolean)

log('Critiques in; revising')
phase('Revise')

const finalBrief = await agent(`You wrote the design + architecture brief below. Three adversarial reviewers tore into it. Rewrite the brief in full, folding in every fix you agree with and explicitly rejecting (in a short "Rejected critiques" note at the very end) any you disagree with, with a one-line reason.

Keep the same 12-section structure. Do not shorten it into a summary - it must remain the complete, implementation-ready document, only better: sharper design direction, more distinctive and defensible type/color choices, a simpler and more robust editing story, no unspecified pages or fields, and no contradictions. Where a reviewer said something is generic, replace it with something specific rather than deleting it.

=== ORIGINAL BRIEF ===
${brief}

=== CRITIQUES ===
${JSON.stringify(critiques)}`, { phase: 'Revise' })

return { reports, brief, critiques, finalBrief }
