# Open items

Everything the site needs that we do not yet have. Ordered by what blocks what.

Every count here was checked against `src/data/` and `dist/` on 2026-10-11.

## Blocking launch

The domain answers as of 2026-11-01. What stands between the site and the public
is the nameserver swap (1b) and the Pages project behind it. Items 3 and 4 are
ours and wait on nothing.


| # | Item | Who | Why it blocks |
|---|---|---|---|
| 1 | ~~Clear the `clientHold`~~ **resolved 2026-11-01** | — | The hold is gone. `satishregonda.in` answers from `ns77`/`ns78.domaincontrol.com`, NOERROR, SOA serial 2026090300. The two A records it returns (`3.33.130.190`, `15.197.148.33`) both reverse to `awsglobalaccelerator.com` — GoDaddy's parking front end, not anything of ours. No MX and no SPF exist, which confirms no mail is carried on this domain and the nameserver swap below breaks nothing. |
| 1b | **Repoint the nameservers at Cloudflare** | Whoever holds the GoDaddy login | The Cloudflare zone is being created now. Until GoDaddy's two nameservers are replaced with the pair Cloudflare assigns, Cloudflare is not authoritative for the domain, the Pages custom domain sits at Pending, and no certificate is issued. This is the last step that is not ours. |
| 2 | **Name a second owner** | Dr. Regonda | A colleague or senior PhD student with access to Cloudflare, GitHub and the Google Cloud project, who receives every failure email and holds a printed runbook. A site whose bus factor is one is not delivered. |
| 2b | ~~Initialise a git repository~~ **resolved 2026-11-01** | — | `github.com/divyanshece/Satish_Portfolio`, first commit `955b576`, pushed. `research/source-docs/` is held out by the root `.gitignore` so his mobile number does not travel with the code. One thing is still wrong: the Actions workflow sits at `site/.github/workflows/publish.yml`, where GitHub does not look for it. It moves to the repository root, with `working-directory: site`, once the Cloudflare secrets exist — not before, or its cron fails twice a day into his inbox. |
| 3 | **Create the Google workbook** | Us, then handed to him | `docs/SHEET-SCHEMA.md` is the exact layout. Until it exists, `npm run sync` has nothing to read and the site builds from the committed JSON — which works, but leaves him unable to edit anything. **The People tab must carry `photo`, `linkedin` and `blurb`; Teaching must carry `credits` and `note`; and Publications must carry `abstract`, `date`, `issn`, `order` and `meta_description`** — all added to the sync map on 2026-10-10 and 2026-11-01. A sheet missing any of them blanks that field on the first sync: no photographs, or 22 abstracts gone and 32 pages quietly ineligible for Scholar again. `date`, `issn` and `order` were already in use and had never been mapped at all. |
| 4 | **Deploy the join form's email receiver** | Us, signed in to the Google account that will keep the applications | Paste `apps-script/Form.gs` into a new Apps Script project, run `testSetup` once (it asks for permission, creates the applications sheet and emails Dr. Regonda a sample), then Deploy → Web app → Execute as Me, Anyone, and put the `/exec` address in `PUBLIC_JOIN_FORM_URL` in Cloudflare Pages. No settings to fill in. Until then `/join/` shows his email address and his four points instead of the form. |

## Being found: what only he can do

These are ordered. Nothing here can be done from the repository, and each one is
worth more than any further markup change.

| # | Item | Why | Time |
| - | ---- | --- | ---- |
| A | **Repoint the Google Scholar homepage field** to `https://satishregonda.in/`. Scholar profile → pencil beside the name → Homepage. | His Scholar profile is the strongest signal Google holds about which URL is his, and it currently names the old Google Site. Do this only once the domain answers. | 1 min |
| B | **Ask the Civil Engineering web administrator to relink `iith.ac.in/ce/satishr/`** — Personal Homepage → `https://satishregonda.in/`, and add his Scholar and ORCID links. | That page has two outbound links and one points at the old site. An institutional `.ac.in` page vouching for the domain is the highest-value external edit available. | 10 min to write, weeks to land |
| C | **Fill in ORCID `0000-0003-3188-9415`**, which is nearly empty: websites (this site first), also-known-as, biography, employment, education, and the Crossref auto-update wizard for the 32 works. | The site already names ORCID; ORCID names nothing back. A one-way claim is not corroboration. | 45 min |
| D | **Fix the LinkedIn headline** so it leads with the professorship, and put `https://satishregonda.in` in the Website field and the About text. | LinkedIn is what the data brokers scrape; a stale headline there is being republished elsewhere as fact. | 10 min |
| E | **The last ten abstracts.** 22 of the 32 were sourced from Crossref and OpenAlex on 2026-11-01 and now ship, so `citation_abstract_html_url` went from 0 pages to 22. Ten are left, every one of them a journal that never deposited an abstract anywhere: `2026-rainfall-attributes-peninsular`, `2025-crowdsourced-flood-impact`, `2024-multivariate-drought-indices`, `2024-exceedance-runoff-urban`, `2023-serayu-copula`, `2022-high-res-rainfall-hyderabad`, `2014-hefs-verification-1`, `2014-hefs-verification-2`, `2013-hmos-ensemble-forecasting` and `2005-ensemble-streamflow-forecasting` — the last of which has no DOI at all. Crossref, OpenAlex and Semantic Scholar were all tried. Only he can supply these, from his own files or the publisher's page. | Those ten pages stay ineligible for Scholar until they have one. Scholar re-reads an existing page only every 6–9 months, so this is worth doing before the site is widely crawled rather than after. | ~1 hour |
| F | **Strip the old Google Site to a one-line pointer** — but only after A and B have landed and the new site is indexed. | Google Sites supports no redirect and no cross-domain canonical, so content is the only lever. Deleting it early turns a link that passes authority into a dead end. | 20 min |
| G | **Fix the Google Play listing**: the developer block shows the legal name "Suresh Regonda" and no website. Set the website to the SnapFlood page. | A public identity mismatch beside an `iith.ac.in` email is exactly what stops the records consolidating. | 15 min |
| H | **Set the App Store marketing URL** to the same page. | Same reason. | 10 min |
| I | **Repoint `snapflood.in`**, which currently redirects to a host that does not resolve. | It is the only brand domain lever there is. | 10 min |
| J | **Decide what `raftwaters.com` is.** It serves a rafting template today, so the site names `/group/` as the group's page and does not assert the domain. | Either the group gets a real site there, or it redirects here. | 5 min |
| K | **Search Console**, under his own account, verified by DNS: submit the sitemap and inspect the home and about pages once each. | The only place the actual queries and any structured-data errors will show. | 20 min |

## Closed by the student form (2026-10-10)

The Graduate Student Information Form came back with 16 responses, and he sent the
full course list in the same round. Both items below were the two largest content
gaps on the site; what remains of each is named here and nowhere else.

| # | Item | What is left |
|---|---|---|
| 5 | **Alumni destinations** | 13 of the 16 alumni now carry a current position, and Abhay Sachan (M.Tech 2026) was added, who was not on the site at all. **Vaishnavi B, Dagani Koteswara Rao and Vimal Chandra Sharma** did not respond and still show nothing. |
| 6 | **Course codes and credits** | All 17 courses he teaches carry the IITH code and credit count, split into what runs this semester (3) and the rest of the rotation (14), with two he no longer offers on a line of their own. **One question for him:** "Fluid Mechanics Laboratory" is on the site but absent from his list, while CE3501 "Hydraulic Engineering Laboratory" is new — if those are one course renamed, merge them. |

## Content we cannot invent

| # | Item | Notes |
|---|---|---|
| 7 | **Abstracts** | Done for 22 of 32 on 2026-11-01, sourced from Crossref (11) and OpenAlex (11) and checked for the two ways that import goes wrong: a stray `Abstract.` prefix, and a structured abstract whose headings were lost in deposit, leaving `Narmada River Basin, India.` orphaned at the front of `2026-hybrid-hydrologic-framework`. **The `Study region:` label on that one was reconstructed by us, not taken from the source — he should confirm or drop it.** That record also carries the journal's five Highlights bullets, which were left in. The remaining ten are item E. |
| 8 | **Which papers may be self-hosted** | Nine works are CC BY and safe to mirror. Four are free to read at the publisher but carry no licence at all, which is not the same thing. Without this we cannot host PDFs, and without PDFs Scholar has less to index. |
| 9 | **Awards, editorial roles, memberships** | Nothing is findable in any public source, and no data file carries a field for any of the three. The only service record on the site is a single 2021 AGU session convenership in `talks.json`. If awards or editorial roles exist they need rows; if they do not, those sections are simply not emitted, which looks better than an empty heading. |
| 10 | **Water imagery** | The photographs we have are all indoors. A river, a reservoir, a gauge, a flooded street — from the group's existing field archive rather than a new shoot. |
| 15 | **Five student photographs** | Deepak, Bharathi Radha Josyula, Vaishnavi B, Dagani Koteswara Rao and Vimal Chandra Sharma have no portrait, so their cards show an initials tile. Four of the five also have no LinkedIn. They did not answer the form. |

## Facts to confirm

| # | Item | Current value | Source of doubt |
|---|---|---|---|
| 11 | PIN code | `502285` | His CV and old site say 502285; the IITH directory says 502284. Either is acceptable per the client, so we use his own document. This site becomes the canonical record. |
| 12 | ~~IITH faculty page URL~~ **resolved 2026-09-06** | `https://iith.ac.in/ce/satishr/` | Verified: returns 200, names him and his post. Now in `settings.iith_url`, so it appears in the footer, in `Person.sameAs` and as the institution's URL. That page still links to the old Google Site — see item B above. |
| 13 | Publication count | 32 records | His CV listed more entries than his old website did (29). We transcribed the CV, and later rounds added two more. 31 of the 32 carry a DOI. Every count on the site derives from the data, so correcting the data corrects the site. |
| 14 | Is he recruiting right now? | Yes, Jan 2027 intake | Drives the intake notice at the foot of `/` and the band on `/join/`. Past `recruiting_deadline` the site swaps itself to a permanently-true admissions line, so it can never claim a closed intake. **`recruiting_deadline` is 2026-11-15** — about five weeks out as of 2026-10-11, which is the real argument for launching rather than polishing. |
| 16 | Padmini's viva date | `2025-02`, with `end_year` 2026 | He corrected her graduation year to 2026 on 2026-10-10; the viva month was not part of that. The field is stored but rendered nowhere, and a February viva ahead of a 2026 convocation is ordinary, so it was left as it stood. |

## Checked against his LinkedIn export (2026-09-11)

`Downloads/Profile.pdf` was compared against `src/data/positions.json`. Most of the record
matches. These do not, and only he can settle them.

1. **Assistant Professor end date.** The site says Feb 2017 – Aug 2022. LinkedIn says
   Feb 2017 – **Feb 2025**, while also showing Associate Professor from Sep 2022. He cannot
   have held both; the site's version is the consistent one, so this is very likely a stale
   LinkedIn entry he should close out. Confirm, then fix LinkedIn rather than the site.
2. **World Bank end date.** Site: May 2014 – Dec 2016. LinkedIn: May 2014 – **Feb 2017**,
   which runs straight into his IITH start. LinkedIn is probably right.
3. **NOAA job title.** Site: "Research Hydrologist". LinkedIn: "**Research Scientist**".
   Which was the official title on the appointment?
4. **Chairperson, Rural Development Centre.** Site shows it ending Aug 2026. LinkedIn says
   **Present**. That end date is now in the past, so the site currently shows the post as
   finished — if the term was extended, the site is wrong today and not merely unconfirmed.
   Also "Centre" (site) vs "Center" (LinkedIn) — which spelling does IITH use officially?
5. **NOAA employer of record.** LinkedIn groups the two NOAA roles under "NOAA … **& Riverside
   Technology Inc.**". Was Riverside the contracting employer? The site says only NWS / NOAA.
6. **B.Tech institution.** Site: "Kakatiya Institute of Technology and Sciences, Warangal".
   LinkedIn: "…, **Kakatiya University**". Both look plausible; which does he use?

Deliberately NOT changed:
- **Education spans.** LinkedIn carries 1996–2000, 2000–2002, 2002–2006; the site prints only
  the completion year, by design. Say the word if he wants the spans shown.
- **Two Graduate Research Assistant roles** (CU Boulder 2002–2006, IIT Kanpur 2001–2002) are on
  LinkedIn and not on the site. They are student posts, and the Education section already covers
  those years.

## Deferred by decision

- **The blog.** Wanted, but not a priority. The content model carries it so nothing needs rebuilding later; the section is not built and no nav item is emitted until there is a first post.
- **`raftwaters.com`.** The group's domain, currently serving GoDaddy's auto-generated placeholder. The site links to it from `/group/` and `/products/snapflood/`; that link is a single value in `settings.raft_site_url`, so if the domain changes it is a one-cell edit.
- **VarshaAnalytics.** Listed as a product with "Not yet public" in the absence colour. Remove the row when it ships, or delete it if it is not to be mentioned.
- **Event mode.** `settings.site_state` is modelled but the home page does not yet reorder for a flood. Worth building before the next monsoon, not before launch.

## Known gaps in this build

- **UFIS tile videos.** None are shipped — `public/ufis/video/` exists but holds no MP4. The diagram on `/group/` is built to play a short looping clip in any tile; the clips the group generated in Canva are not on the published `ufis.my.canva.site` (that bundle carries only the five portrait SnapFlood demo renditions). Once they arrive as MP4 files, drop each into `site/public/ufis/video/` named after its tile (`weather.mp4`, `hydro.mp4`, `geospatial.mp4`, …) and rebuild; the tile picks it up with the still as its poster, muted and looping, and stays a still for anyone who asks for reduced motion.
- No PDF hosting, so no `citation_pdf_url` in the Highwire tags. Scholar can index the pages but has no full text to attach.
- No search. Thirty-two publications with real theme links and Ctrl-F covers it; a search index would cost more bytes than the rest of the site.
