# The content workbook

One Google workbook holds everything on satishregonda.in. `npm run sync` reads
it and writes `src/data/*.json`; `npm run build` compiles those files and never
touches the network. This document is the exact layout that script expects.

If you are here to fix a failed publish, the message you were sent names the tab
and the column. Find that tab below and compare it with what is in the sheet.

---

## Rules that apply to every tab

**Row 1 is the column headings.** They are matched loosely enough to be typed by
hand: capital letters are ignored and spaces become underscores, so `Start year`,
`start_year` and `START YEAR` are the same column. Anything else in the name is
dropped.

**Row 2 is the example row.** Its first cell starts with `#`, which is how the
script knows to leave it out. Keep it. It is the fastest way for anyone to see
what a filled row looks like, and it costs nothing.

**Blank rows are ignored,** so there is no harm in spacing a long tab out.

**Columns the website does not use are ignored.** Add a working column, a note to
yourself, a colour-coded status of your own. The sync prints a line saying it saw
a column it does not use, and carries on.

**Lists go in one cell, separated by semicolons.**
`Ponukumati, P.; Regonda, S. K.` becomes two authors.

**Links go in one cell as `Label | URL`, separated by semicolons.**
`Google Play | https://play.google.com/…; App Store | https://apps.apple.com/…`

**Yes or no columns are checkboxes.** Insert, Tick box. The words `TRUE`, `yes`,
`y`, `1` and `x` also work if you would rather type.

**Dates are `2026`, `2026-08` or `2026-08-14`.** Format those cells as plain text
(Format, Number, Plain text) so Google does not rewrite them into 14/08/2026.
A bare year typed as a number is understood.

**A required column means the heading must exist in row 1.** It does not mean
every cell under it is filled. An empty required cell does not stop the publish:
that one row is left out of the website, the rest publishes, and the log names
the row so you can fix it.

**Every tab needs an `order` column** except Press and Settings, which sort
themselves by date. Number them 10, 20, 30 rather than 1, 2, 3, so a new row can
be slipped between two existing ones without renumbering the tab.

---

## Settings

Two columns, `key` and `value`, one setting per row.

**Why it is not one wide row.** The obvious design is a single row with twenty-four
columns, one per setting. It fails the first time somebody sorts the sheet or
inserts a column in the middle: every value shifts one cell sideways, nothing
errors, and the site publishes his email address into the office field. A tall
key/value tab cannot do that. Sorting it, inserting rows, reordering it, moving a
row to the bottom — none of it changes which value belongs to which key, because
the key travels in the cell next to the value.

| key | Required | Accepted values | Example |
|---|---|---|---|
| `name` | yes | Text, short form | `Satish Regonda` |
| `name_full` | yes | Text | `Satish Kumar Regonda` |
| `name_display` | no | Text | `Dr. Satish K. Regonda` — how the name is set in the header and footer; leave blank to use `name_full` |
| `address_street` | no | Text | `Department of Civil Engineering, IIT Hyderabad` — the office as a machine-readable address. Leave all five blank and the single `address` line is used instead |
| `address_locality` | no | Text | `Kandi, Sangareddy` |
| `address_region` | no | Text | `Telangana` |
| `address_postcode` | no | Text | `502285` |
| `address_country` | no | Text | `IN` — two letters |
| `name_citation_forms` | yes | List. Every way his name appears in an author list | `Regonda, S. K.; Regonda, S.K.; S. K. Regonda` |
| `title` | yes | Text | `Associate Professor` |
| `departments` | yes | List | `Civil Engineering; Climate Change` |
| `institution` | yes | Text | `IIT Hyderabad` |
| `office` | yes | Text | `Room B-212` |
| `address` | yes | Text, one line | `Department of Civil Engineering, IIT Hyderabad, Kandi, Sangareddy 502285, Telangana, India` |
| `email` | yes | One address | `satishr@ce.iith.ac.in` |
| `scholar_url` | yes | A web address, or empty | `https://scholar.google.com/citations?user=cTXdUlUAAAAJ` |
| `orcid_url` | yes | A web address, or empty | `https://orcid.org/0000-0003-3188-9415` |
| `linkedin_url` | yes | A web address, or empty | `https://in.linkedin.com/in/satish-regonda-3a08a115` |
| `iith_url` | yes | A web address, or empty. Empty means the footer link is not shown | |
| `raft_site_url` | yes | A web address, or empty | `https://raftwaters.com` |
| `recruiting_status` | yes | Text, up to 160 characters | `Accepting PhD applicants for the January 2027 intake.` |
| `recruiting_deadline` | yes | A date, or empty | `2026-11-15` |
| `recruiting_review_by` | yes | A date, or empty | `2026-12-01` |
| `currently` | yes | Text, up to 600 characters. What he is working on now | `Building the Urban Flood Information System with the GHMC…` |
| `bio_short_25` | yes | Text, roughly 25 words | `Satish Regonda is an Associate Professor of Civil Engineering and Climate Change at IIT Hyderabad…` |
| `bio_short_60` | yes | Text, roughly 60 words | `Satish Regonda is an Associate Professor in the Departments of…` |
| `products_standfirst` | yes | Text. The opening line of the products page | `Software from the group that puts rainfall and flood information in the hands of the people who need it…` |
| `site_state` | no | `normal`, `watch` or `event` | `normal` |
| `site_state_line` | no | Text. Shown across the top during a flood | `Heavy rainfall warning for Hyderabad until Thursday.` |
| `site_state_until` | no | A date. After it, the line stops showing | `2026-07-24` |
| `raft_social.<name>` | no | One row per network. The part after the dot is the label shown | key `raft_social.LinkedIn`, value `https://www.linkedin.com/company/raftwaters` |
| `publish_now` | no | A tick box. Ticking it publishes the site. The website never reads this value | |

Two more keys are worth knowing about. `recruiting_deadline` is not decoration:
once that date has passed, the site stops printing the recruiting sentence by
itself and prints a permanently true one instead, so it can never advertise a
closed intake. And a `site_state_line` with no `site_state_until` will sit at the
top of the site until somebody clears it.

---

## Positions

The appointments and degrees behind the trajectory chart on `/about/`.

| Column | Required | Accepted values | Example |
|---|---|---|---|
| `kind` | yes | `appointment`, `education` or `visiting` | `appointment` |
| `org` | yes | Text | `NWS / NOAA` |
| `role` | yes | Text | `Research Hydrologist, Office of Hydrologic Development` |
| `city` | no | Text | `Silver Spring, Maryland` |
| `start` | yes | A date. `2007-10` is enough | `2007-10` |
| `end` | no | A date. Leave empty for a current post: the bar is drawn open-ended | `2013-11` |
| `note` | no | Text. Used for a thesis title on a degree row | `Thesis: Investigation of chaotic behaviour in hydrologic time series` |
| `order` | yes | Number. Lower is higher up the page | `50` |

---

## Research

The four claims on `/research/`, each with its own page.

| Column | Required | Accepted values | Example |
|---|---|---|---|
| `slug` | yes | Lowercase letters, numbers and hyphens. It becomes the web address | `urban-flooding-hyderabad` |
| `claim` | yes | Text, up to 120 characters. A sentence that could be wrong | `Hyderabad's floods are a forecasting problem as much as a drainage problem.` |
| `confidence` | yes | `virtually certain`, `very likely`, `likely`, `high confidence`, `medium confidence`, `low confidence` | `high confidence` |
| `revised` | yes | A date. When the claim was last reconsidered | `2026-03-01` |
| `summary` | yes | Text, up to 300 characters | `The city's worst events come from rainfall that is intense, short and spatially tiny…` |
| `figure` | no | A file name in `public/figures/` | `fig-hmda.jpg` |
| `figure_alt` | no | Text, up to 220 characters. Describe what the figure **shows**, not what it is called | `Map of the Hyderabad Metropolitan Development Authority region showing district boundaries…` |
| `figure_caption` | no | Text | `The Hyderabad Metropolitan Development Authority region, with the GHMC boundary inside it.` |
| `figure_credit` | no | Text. Source and licence | `Dagani, Regonda & Dornadula (2021), Water 13, 637. CC BY.` |
| `order` | yes | Number | `10` |

Adding a figure means adding the image file to the repository as well. That is a
developer job, not a sheet job. Everything else on this tab is editable here.

---

## Publications

| Column | Required | Accepted values | Example |
|---|---|---|---|
| `id` | yes | Lowercase letters, numbers and hyphens. Becomes the page address, so do not change it once published | `2026-telegram-bot-flood-info` |
| `type` | yes | `journal`, `chapter`, `conference`, `preprint` or `report` | `journal` |
| `year` | yes | A four digit year | `2026` |
| `title` | yes | Text, exactly as published | `Web-messaging-based dissemination of urban rainfall and flood information: a Telegram bot framework` |
| `authors` | yes | List, in publication order, as the journal prints them | `Ponukumati, P.; Regonda, S. K.` |
| `venue` | yes | Journal, book or conference name | `npj Natural Hazards` |
| `volume` | no | Text or number | `13` |
| `issue` | no | Text or number | `2` |
| `pages` | no | Text | `637-651` |
| `doi` | no | Starts `10.` and must **not** end in a full stop | `10.1038/s44304-026-00234-3` |
| `url` | no | A web address, when there is no DOI | `https://…` |
| `theme` | no | The `slug` of a row on the Research tab. This is what links a paper to a claim | `urban-flooding-hyderabad` |
| `selected` | no | Tick box. Ticked papers appear on the home page | ticked |
| `selected_order` | no | Number. The order of the selected papers, 1 first | `1` |
| `takeaway` | no | Text, one sentence, for selected papers. What the paper found | `A Telegram bot that pushes rainfall and flood information to people who will never open a dashboard.` |
| `note` | no | Text | |
| `open_access` | no | `cc-by`, `cc-by-nc-nd`, `green`, `bronze` or `closed`. Empty means closed | `cc-by` |
| `exclude` | no | Tick box. Ticked rows are kept in the sheet and left off the website | |
| `abstract` | no | Text. His own abstract, at least 40 characters | Google Scholar will not index a paper page that shows only a citation. This is the single field that makes these pages eligible |
| `issn` | no | Text, `0043-1397` | Filled from Crossref by `node scripts/backfill-crossref.mjs` |
| `issue` | no | Text | Same |
| `date` | no | Text, `2026-01` or `2026-01-14` | Same. Left blank where Crossref's year disagrees with the `year` column, so the metadata can never contradict the page |
| `meta_description` | no | Text, at most 160 characters | Overrides the search-result line for this paper. Leave blank and it is derived from the abstract, or from the citation |

The trailing full stop on a DOI is refused on purpose. It is the single commonest
way a DOI link dies, because a copied citation carries the sentence's full stop
along with it.

Nobody types a publication count anywhere. Every count on the site is derived
from the number of rows here.

---

## People

Current members and alumni. This tab does more than fill the group page: adding
someone here retroactively marks their name in every author list on the site,
with `*` for a PhD student, `†` for M.Tech and `‡` for B.Tech or an intern.

| Column | Required | Accepted values | Example |
|---|---|---|---|
| `id` | yes | Lowercase letters, numbers and hyphens | `saipriya-sr` |
| `name` | yes | Text, as they write it | `Saipriya S. R.` |
| `aliases` | no | List. **Every** way their name appears in an author list. This is what makes the marks work | `Saipriya, S. R.; Saipriya, S.R.; S. R. Saipriya` |
| `role` | yes | `phd`, `mtech`, `btech`, `postdoc`, `staff`, `intern` or `visitor` | `phd` |
| `status` | yes | `current` or `alumni` | `current` |
| `programme` | no | Text | |
| `department` | no | Text. Only when it is not Civil Engineering | `Climate Change` |
| `start_year` | no | A year. Used to decide which papers carry their mark | `2021` |
| `end_year` | no | A year. Papers up to two years after it still carry the mark, because publication lags the work | `2025` |
| `viva_date` | no | A date | `2025-02-14` |
| `topic` | no | Text, up to 200 characters | `Urban hydroclimatology and flood modelling for the city of Hyderabad` |
| `thesis_title` | no | Text, exactly as on the thesis | `Urban flood modelling — a web-based decision tool for the Hyderabad city` |
| `co_supervisor` | no | Text | `Dr. Aalok Khandekar` |
| `note` | no | Text | `co-supervised` |
| `first_position` | no | Text. Where they went next. **Only with their permission** | `Scientist, Central Water Commission` |
| `first_position_year` | no | A year | `2025` |
| `sector` | no | `academia`, `government`, `industry` or `other` | `government` |
| `order` | yes | Number | `10` |

An alumnus with no `first_position` shows "Placement not recorded" on the site,
in the colour the site reserves for a gap in the record. That is deliberate and
it is honest. Filling the column in is the single biggest improvement available
to the group page, and it needs each person's agreement first. See
`docs/OPEN-ITEMS.md`.

---

## Projects

| Column | Required | Accepted values | Example |
|---|---|---|---|
| `slug` | yes | Lowercase letters, numbers and hyphens | `ghmc-rads` |
| `title` | yes | Text | `GHMC-RADS — Rainfall Analytics and Decision Support Platform` |
| `funder` | yes | Text | `Greater Hyderabad Municipal Corporation` |
| `role` | yes | Text | `PI` |
| `partners` | no | Text | `A collaboration with four other institutes` |
| `start_year` | no | A year, or empty | `2026` |
| `end_year` | no | A year, or empty. Empty on an ongoing project draws the bar open-ended | |
| `status` | yes | `ongoing` or `completed` | `ongoing` |
| `summary` | no | Text | `Real-time rainfall monitoring and decision support for urban flood management in Hyderabad…` |
| `theme` | no | The `slug` of a Research row | `urban-flooding-hyderabad` |
| `public_output` | no | Tick box. Ticked when there is something public to point at | |
| `order` | yes | Number | `10` |

---

## Products

The tools on `/products/`.

| Column | Required | Accepted values | Example |
|---|---|---|---|
| `slug` | yes | Lowercase letters, numbers and hyphens | `snapflood` |
| `name` | yes | Text | `SnapFlood` |
| `kind` | yes | Text | `Mobile app` |
| `status` | yes | `live`, `slow`, `development` or `archived` | `live` |
| `audience` | no | Text. Who it is for | `Anyone with a phone` |
| `blurb` | yes | Text. What it does, in one or two sentences | `Photograph a flooded street, upload it with a location…` |
| `state_lines` | no | List. The short facts printed beside it | `Mobile app; Live; 100+ installs` |
| `links` | no | Links, `Label \| URL` separated by semicolons | `Google Play \| https://play.google.com/…; App Store \| https://apps.apple.com/…` |
| `partners` | no | List | `Greater Hyderabad Municipal Corporation; India Meteorological Department` |
| `funders` | no | List | `DST-SPLICE Climate Change Programme` |
| `contact` | no | An address | `snapflood@iith.ac.in` |
| `absent_note` | no | Text. Why there is no link yet. It prints in the absence colour | `Dashboard not yet public` |
| `page` | no | Tick box. Ticked means it has its own page, which a developer has to build | ticked |
| `order` | yes | Number | `10` |

`absent_note` is the one place on this tab where being honest about a missing
thing matters more than the entry looking complete. "Not yet public" is a fact.
An empty space is a question.

---

## Teaching

| Column | Required | Accepted values | Example |
|---|---|---|---|
| `code` | no | Text | `CE 5140` |
| `title` | yes | Text | `Engineering Hydrology` |
| `level` | no | Text | `PG` |
| `semesters` | no | Text | `Monsoon 2024, Monsoon 2025` |
| `status` | yes | `current` or `past` | `current` |
| `order` | yes | Number | `10` |

Course codes, levels and semesters are the three columns most worth filling in.
A bare title tells a student nothing about whether they can take the course.

---

## Press

**The page this fed was taken down on 2026-09-12** and `/media/` now redirects to
`/about/#h-contact`. The tab, `src/data/press.json` and the loader in
`src/lib/content.ts` are all still in place, so filling the tab is harmless and
restoring the page is a matter of writing the route again — but nothing on the
site reads these rows today.

| Column | Required | Accepted values | Example |
|---|---|---|---|
| `date` | yes | A date | `2023-10-06` |
| `outlet` | yes | Text | `Deccan Chronicle` |
| `headline` | yes | Text, as printed | `Innovative Urban Flood Information System aims to transform city's resilience` |
| `kind` | yes | `coverage`, `byline` or `video` | `coverage` |
| `url` | no | A web address | `https://www.youtube.com/watch?v=zz9i62ucZ3c` |
| `quote` | no | Text. A line worth pulling out | |

---

## The machine tabs

Four more tabs exist. None of them is read by the website, and none of them can
break a publish. They are kept in the same workbook so there is one thing to
back up and one thing to hand over.

### README

The first tab, and the only one written for a person who has never seen this
sheet before. Two columns, `topic` and `what to do`. It should say, in his own
words: what this workbook is, that ticking `publish_now` on the Settings tab
publishes the website, that the site keeps serving its last good version if a
publish fails, and where the runbook is. Nothing reads it. It exists so that the
sheet explains itself without anyone's help.

### _Publish Log

Written by the Apps Script attached to this workbook, not by the website build.
The build reads the sheet with a read-only credential — that is what stops any
software failure from damaging the content — and a read-only credential cannot
write a log row. So the log is written from this side instead.

| Column | What is in it |
|---|---|
| `When` | Date and time |
| `What happened` | `Publish requested`, `Published`, `Published, partly` or `Not published` |
| `Detail` | The plain-English explanation. On a failure this is the sentence to act on |
| `Who` | What started it: the checkbox, the menu, or the twice-daily automatic publish |
| `Run` | A link to the build, for a developer |

Do not sort, edit or reorder this tab. The script reads the last few rows of it
to decide whether a publish is already running, so a resorted log makes it start
a second one.

### _Alumni Replies

The landing tab for the alumni round: a Google Form asking each graduate where
they went and whether they are happy to have it on the site. Nothing here reaches
the website automatically, on purpose. Somebody reads a reply, checks that the
person said yes, and types the answer into `first_position` on the People tab.
Consent is not a thing to automate.

Suggested columns: `Timestamp`, `Name`, `Year finished`, `Where you are now`,
`May we publish this? (yes/no)`, `Anything to correct on the site`.

### Applicants

Written by the join form on `/join/`, through a separate Apps Script web app
(`apps-script/Form.gs`). One row per application, and every row is also emailed
to him in full under the subject "Looking for an Opportunity: <name> (<role>)",
with Reply-To set to the applicant.

If no workbook is configured, the script creates its own the first time it
runs, named "satishregonda.in — join form applications", and remembers it.

| Column | What is in it |
|---|---|
| `Received` | Date and time |
| `Name`, `Email` | What they typed |
| `Applying for` | `PhD`, `Postdoctoral research` or `Internship` |
| `Research interests` | His first question |
| `Background and skills` | His second |
| `Why this group` | His third |
| `Hopes to learn and contribute` | His fourth |
| `CV or profile` | A link, if they gave one |
| `Replied` | Empty. His column, filled in by hand |

The form has a hidden field a person never sees. Anything that fills it in is a
bot, and is dropped without a row and without an email. The same answers sent
twice within ten minutes are kept once. Bots are shown the same
thank-you page as everyone else, so they learn nothing from being caught.
