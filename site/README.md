# satishregonda.in

The personal academic site of Dr. Satish Kumar Regonda, Associate Professor of
Civil Engineering and Climate Change at IIT Hyderabad. He is a hydrologist:
flood forecasting, urban flooding in Hyderabad, monsoon hydroclimatology. He
leads the RAFT research group.

This README is for a developer picking the project up cold. The operations side,
written for a non-technical reader, is [`docs/RUNBOOK.md`](docs/RUNBOOK.md).

---

## Run it

```bash
npm install       # already done in this checkout
npm run dev       # http://localhost:4321
npm run build     # writes dist/
npm run preview   # serves dist/
```

Node 25, pinned in `.node-version`. There is nothing else to install, no
database, no environment variable needed to build, and no network access needed
to build. A clean clone builds.

```bash
npm run grep-check   # the house style gate. See below.
npm run check        # astro check, types
npm run sync         # reads the Google Sheet. Needs credentials; see below.
```

---

## The stack, and why

**Astro 5, static output.** Every page is generated at build time into plain
HTML. There is no server, no runtime, no hydration, and no client-side
JavaScript at all. The site is a folder of files.

**Zero client JavaScript, as a rule rather than an outcome.** Filters are real
links to real URLs. Disclosure is `<details>`. There is no theme toggle, no
carousel and no analytics. `npm run grep-check` fails the build on any `<script>`
that is not JSON-LD, so the rule cannot erode.

**Two self-hosted typefaces.** Piazzolla and Martian Mono, subset to Latin and
served from `/fonts/`. The site makes zero third-party requests: no font CDN, no
tag manager, nothing that can be blocked, slow down or watch a visitor.

**Zod at the content boundary.** `src/lib/content.ts` validates every record.
Failures fall into two classes on purpose: a missing file or a broken Settings
tab stops the build, a single bad row is dropped with a named warning and
everything else publishes. A half-finished publication entry must never stop him
fixing a recruiting sentence at 11pm.

**Google Sheets as the editor, not as the source.** The content lives in this
repository as JSON. The sheet is how he edits it. See below.

**Cloudflare Pages.** Static hosting, instant rollback, and a deploy that is
atomic: it either replaces the whole site or leaves the previous one serving.

**Not used, deliberately:** no CSS framework, no component library, no image CDN,
no CMS service, no client-side router, no analytics. Every one of those is a
dependency that outlives its usefulness and has to be maintained by whoever
inherits this.

---

## How content gets from him to the site

```
   Google Sheet
        |
        |  scripts/sync-from-google.mjs   (read-only service account,
        |                                  one batchGet, header check first)
        v
   src/data/*.json          committed to git on every publish
        |
        |  npm run build                  (no network, ever)
        v
   dist/                    uploaded to Cloudflare Pages in one atomic deploy
```

**He ticks `publish_now` on the Settings tab.** The Apps Script bound to the
workbook (`apps-script/Code.gs`) unticks it, checks that a publish is not already
running, and sends a `repository_dispatch` to GitHub.

**`.github/workflows/publish.yml` runs.** It syncs the sheet, commits any changed
JSON back to the repository with `[skip ci]`, builds, and deploys. It also runs
on a schedule at 01:30 and 13:30 IST, so an edit reaches the site whether or not
anyone remembers to tick anything.

**The sync script checks headers before it parses a single row.** A missing tab
or a missing required column ends the run with a sentence a non-technical person
can act on, and no file is written. A half-read sheet must never reach
`src/data`.

**The publish log is written by Apps Script, not by the build.** The service
account has `spreadsheets.readonly` and nothing else, which is the main safety
property of the whole pipeline: no CI failure and no leaked secret can alter his
content, because the credential that touches the sheet cannot write. A read-only
credential also cannot append a log row, so the log is written from the sheet
side, by a script already running as him. The cost is that the log lags by up to
fifteen minutes.

**The dead Google switch.** Set `SHEETS_DISABLED=1` and the build compiles from
the committed JSON with no network call to Google at all. Everything still
publishes; only editing from the sheet stops. This is the longevity story, and it
is testable today: `SHEETS_DISABLED=1 npm run sync && npm run build`.

The exact tab and column layout is [`docs/SHEET-SCHEMA.md`](docs/SHEET-SCHEMA.md).

### Environment

Copy `.env.example` to `.env`. Nothing here is needed to build.

| Variable | Used by | What it is |
|---|---|---|
| `SHEETS_DISABLED` | `npm run sync` | `1` skips Google entirely and exits 0 |
| `GOOGLE_SA_KEY_B64` | `npm run sync` | The service account key JSON, base64 encoded. Base64 because a PEM private key pasted into a CI secret loses its newlines |
| `SHEET_ID` | `npm run sync` | The workbook id |
| `PUBLIC_JOIN_FORM_URL` | the build | Where `/join/` posts. Empty renders the email fallback instead of the form, which is a correct degradation |

---

## House rules

A reviewer checks these, and `npm run grep-check` enforces the mechanical half of
them on every pull request.

1. **Zero client-side JavaScript.** No `<script>` except `application/ld+json`,
   no `client:` directives, no `onclick`. Filters are hrefs; disclosure is
   `<details>`.
2. **No dark mode.** One light palette, painted explicitly. The site is a paper
   object and says so in its colophon.
3. **`border-radius` is 0 everywhere. `box-shadow` is never used. No gradients,**
   with one sanctioned exception: the open-ended bar in `Trajectory.astro`.
4. **`--accent` is never a background or a fill.** It is the link colour, the
   active nav underline, the focus ring, a hydronym, and the 2px rule on a
   selected publication. Nothing else.
5. **`--mark` means absence, only absence, and never appears without words.**
   "No open copy", "placement not recorded", "not yet public". The colour repeats
   what the words already say; it never replaces them.
6. **Counts are always derived** from `counts` or `.length`. No total is ever
   typed by a human, in the data or in the copy.
7. **`hydronyms()` applies to body prose and captions only.** Never inside a
   heading, a publication title, an author string, a venue or code: restyling a
   source's own typography misrepresents it.
8. **Figures sit on `.plate`.** Every `<img>` carries width, height,
   `decoding="async"`, `loading="lazy"` unless it is on the first screen, and
   real alt text. Alt text for a scientific figure describes what it *shows*.
9. **Empty states are specified, never accidental.** An empty collection means
   the section and its heading are not emitted. An alumnus with no
   `first_position` renders "Placement not recorded", never a dangling "Now:".
10. **Copy voice:** first person, plain, specific. Every sentence carries a
    proper noun, a number or a date. No marketing language, no exclamation marks,
    no emoji. British spelling.

### The style gate

```bash
npm run grep-check
```

Walks `src/**/*.{astro,css}` and fails on: `box-shadow`; any non-zero
`border-radius`; a gradient outside `Trajectory.astro`; the stock template
palette (`#6366F1` and friends, `indigo`, `violet` as colour values);
`repeat(3, 1fr)`; the stock typefaces (Inter, Roboto, Lato, Montserrat, Poppins,
Open Sans, Playfair Display, Space Grotesk); `background` referencing
`var(--accent)`; a `<script>` that is not JSON-LD; and emoji.

None of those are bugs, so no test catches them, and any one of them turns this
site into every other site. It is a hard gate on pull requests and a warning on
content publishes: style must never stand between him and a corrected sentence.

---

## Where things are

```
site/
├── .github/workflows/publish.yml   two jobs: content-publish, code-pr
├── .node-version                   25
├── apps-script/
│   ├── Code.gs                     the publish button, bound to the workbook
│   └── Form.gs                     the /join/ form endpoint, a web app
├── docs/
│   ├── RUNBOOK.md                  operations, for a non-technical reader
│   ├── SHEET-SCHEMA.md             the exact tab and column layout
│   └── OPEN-ITEMS.md               what the site still needs, and from whom
├── public/
│   ├── _headers                    CSP, HSTS, cache policy
│   ├── _redirects                  vanity paths from the old Google Site
│   ├── fonts/                      Piazzolla, Martian Mono, subset woff2
│   ├── figures/                    scientific figures, on .plate
│   └── img/
├── scripts/
│   ├── sync-from-google.mjs        the only code that talks to Google
│   └── grep-check.mjs              the house style gate
└── src/
    ├── components/                 Masthead, Footer, StatusStrip, Trajectory,
    │                               PublicationRow, Claim, ProductRow, JoinForm,
    │                               UfisDiagram
    ├── data/                       the committed copy of the sheet. 10 files.
    ├── layouts/Base.astro          props: { title?, description }
    ├── lib/
    │   ├── content.ts              all data, all validation, all derived counts
    │   └── text.ts                 author marks, hydronyms, date helpers
    ├── pages/                      one file per route
    └── styles/
        ├── tokens.css              every colour, space and type step
        └── global.css              the shared classes pages reuse
```

Two files are the contract. `src/lib/content.ts` is the only place any page reads
data from, and it exports everything derived: `counts`, `selectedPublications`,
`publicationsByTheme()`, `recruitingLine()`. `src/styles/tokens.css` is the only
place a colour is defined. A page that invents a hex or retypes a total is
wrong even if it renders correctly.

`src/lib/text.ts` holds the two transforms that are the site's fingerprint.
`markAuthors()` marks trainees in every author list from the People roster, so
adding a student to the sheet retroactively marks every paper they co-authored
and he never types a mark by hand. `hydronyms()` sets named water bodies in
italic accent, the way a topographic sheet labels them.

---

## Deploying

Cloudflare Pages, from `.github/workflows/publish.yml`. Repository secrets:
`GOOGLE_SA_KEY_B64`, `SHEET_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
Repository variables: `SHEETS_DISABLED`, `CLOUDFLARE_PROJECT`.

A failed run deploys nothing and the previous deployment keeps serving. Rolling
back is Cloudflare, Deployments, the previous one, Rollback, and takes about a
minute; the procedure is in the runbook.

The Apps Script projects are deployed by hand, once. Setup steps are commented at
the top of each `.gs` file, including which Script Properties to fill in. The
GitHub token lives in Script Properties and never in the source.
