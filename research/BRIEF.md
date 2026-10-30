# THE BRIEF — satishregonda.in

**Dr. Satish Kumar Regonda · Associate Professor, Civil Engineering & Climate Change, IIT Hyderabad**
Revision 2. Lead designer + architect. Three adversarial reviews are folded in; the calls that changed are marked **▲ changed** where it matters. Rejected critiques are listed at the very end with reasons.

---

**Three findings from recon that change the brief before we start:**

1. **`raftwaters.in` does not exist.** NXDOMAIN on both Google and Cloudflare DoH, for A and NS records, verified independently by three agents. There is nothing to link to. The RAFT material on this site is the group's only public presence and is written to stand alone.
2. **`satishregonda.in` does not resolve.** No nameservers, no delegation. DoH cannot distinguish *unregistered* from *registered-but-undelegated*, so **the first action in Phase 0 is an RDAP lookup, not a question to the client** (see §12.1).
3. **`snapflood.in` is a live-but-broken redirect chain** — it 301s to `www.snapflood.civil.iith.ac.in`, which is itself NXDOMAIN. A real, fixable asset currently pointing at nothing.

**One rule that governs every number in this document:** counts are **derived at build from the sheet, never typed into copy**. Where a mockup shows `{n}`, that is literal — the template renders the count. The current site's own figures disagree with each other (18 vs 15 alumni, 9 vs 12 current students, 56 vs 55 vs 39 publications), and Phase 1 reconciles them once, into the sheet, after which no human retypes a total anywhere.

---

## 1. Who this site is for

Five audiences. Each arrives from a different place, with a different question, and gives us about five seconds. The current Google Site serves none of them well.

| # | Audience | Arrives from | The one thing they need in 5 seconds | Where we put it |
|---|---|---|---|---|
| **1** | **Prospective PhD / M.Tech students** (highest volume, by a distance) | Googling his name after a paper; the IITH admissions page; a WhatsApp forward | **"Is he taking students right now, and for what?"** — a dated status line, not a paragraph about welcoming motivated candidates | A wire-service status line on the home page, above the fold **on a 390px phone**, driven by three cells in the sheet. Full detail at `/join/`. |
| **2** | **Academic peers and collaborators** (hydrology, hydroclimatology, water resources; India, US, Indonesia) | A citation, a conference programme, Google Scholar | **"What is he working on now, and which papers matter?"** — recent work with DOIs, not a wall | `/research/` as four numbered claims with calibrated confidence, and six selected papers on the home page before the full list |
| **3** | **Funders and programme officers** (DST, SERB, MoES/IITM Monsoon Mission, NDMA, World Bank, CSR donors) | A proposal review, a referral, `giving.iith.ac.in` | **"Has he shipped anything, and who funded him before?"** — projects with agency, period, role, and a working link to a tool a citizen can install | `/tools/` at top level, plus a funders block on `/research/` and on `/tools/snapflood/` |
| **4** | **Journalists and city agencies** (GHMC, HMDA, IMD, TSDPS, Telangana Irrigation, CWC) — **traffic spikes during monsoon and flood events** | News search during a flood; prior coverage; the UFIS video | **"What does SnapFlood/UFIS do, who do I call, can I quote him?"** | `/tools/snapflood/` as a real page with a system diagram and a press line under the masthead; `/press/` with three verified 2023 articles and three **sourced prior quotes**. **▲ And EVENT MODE (§5.4), which reorders the home page during a flood.** |
| **5** | **His own students** (current group + course enrolment) | A course code, a lab WhatsApp group | **"Where is the syllabus / who is in the group / how do I reach him?"** | `/teaching/` with real course codes, `/group/` as one scrolling page |

Two things worth stating plainly, because they set priorities:

- **Audience 1 is the largest, the worst-served today, and arrives on a phone.** The current Opportunities page is genuinely well written, and it contains no funding status, no deadline, no named fellowship and no alumni destinations. Eighteen alumni are listed with thesis titles and viva dates and **zero placement information**. That single missing column is the highest-value new content on the site — which is why it moves to **Phase 0, day one** (§10), not into a two-day content sprint.
- **Audience 4 is time-critical and currently unreachable.** SnapFlood — a citizen-science flood app with 100+ installs, funded by DST-SPLICE/NUC/NMSKCC and the GoI AI CoE for Sustainable Cities, covered by NewsMeter, The Hans India and Deccan Chronicle — sits three clicks deep under Research → SnapFlood, on a page whose sample images are unlicensed press photographs from Hindustan Times and The Hindu. **▲ And the site as originally designed looked identical on a dry Tuesday and during a Musi flood, which is the largest single miss in revision 1.**

---

## 2. Positioning and voice

### The sentence

> **A quiet, precisely typeset field bulletin from someone who built national flood forecasting systems in Washington and now forecasts the water in one Indian city.**

That arc is the editorial spine, and it is verified fact: **NOAA/NWS Office of Hydrologic Development (2006–2013) → World Bank (2014–2016) → Johns Hopkins (2015–2016) → IIT Hyderabad (Feb 2017–)**, HEFS to SnapFlood, continental United States to the Musi. Nobody else in Indian hydrology has that CV, and it is currently buried in a bulleted list on a page called "Education & Employment." **▲ It now has a data source** (the `Positions` tab, §7.3) and a drawn rendering (the trajectory timeline, §6.1) rather than being a fact with nowhere to live.

### Three adjectives it must NOT be

1. **Corporate.** No "leveraging cutting-edge AI/ML to transform water resource management." No stat counters. No two-button hero. No "Let's connect!"
2. **Institutional.** Not a second IITH departmental page. The reason for a personal domain is that it can say things a CMS cannot — a photograph from a gauge, an opinion about drainage policy, a placement list, a flood bulletin.
3. **Warm-editorial-template.** Cream ground, rusty-orange accent, big italicised serif headline, tracked-out uppercase eyebrows, a scrolling ticker. We deflect every one (§3–4).

**▲ And a fourth, which revision 1 failed:** it must not be **defined by what it avoids**. A direction assembled from negations converges on the average of what is left, and in 2026 that average is a cool near-monochrome ground, one desaturated teal, hairlines at full ink, mono metadata and a left-hand year rail — which is what revision 1 specified. §3 now leads with a positive source (operational hydrology's own printed and screen artefacts), takes **structure** from it rather than CSS details, and names three choices that are matters of taste and are not defended.

### How the copy sounds

- **First person, always,** on his own pages. Third person only in the 60-word press bio at `/press/`.
- **Keep his sentence rhythm.** His current bio reads *"In brief, after masters at the IIT Kanpur, I pursued PhD at the University of Colorado at Boulder."* The article usage is his voice. Copy-edit for clarity; never for polish.
- **▲ Both sample rewrites below are drafts assembled from his existing written sentences. The shipped versions come from a recorded interview** (Phase 1, §10): twenty minutes, transcribed, paragraphs built from his actual clauses, with **at least two non-idiomatic constructions preserved verbatim per page** and a note in the style guide forbidding a copy-editor from removing them.
- **Every sentence carries a proper noun, a number, or a date.** ▲ This is a **review prompt and a CI warning**, not a build failure — the proper-noun half is not reliably greppable. CI flags any home-page or `/join/` sentence containing no digit and no non-sentence-initial capital, and prints it in the log.
- **▲ Banned patterns, one canonical list, in `config/banned-words.json`, referenced by both §2 and §11.** The 2023 vocabulary list is necessary and insufficient; the 2026 tell is rhythm.

```jsonc
{
  "words": ["elevate","unlock","empower","leverage","harness","streamline",
            "seamless","cutting-edge","transformative","groundbreaking",
            "ever-evolving","at the intersection of","passionate about",
            "delve","tapestry","multifaceted","let's connect",
            "quiet","considered","deliberate","honest","simply",
            "game-changer","holistic approach","holistic solution"],
  "patterns": [
    { "id":"reversal",  "re":"\\b(is|was|are|were) not [^.]{3,60}\\.\\s+(It|They|That) (is|was|are|were)\\b" },
    { "id":"not-just",  "re":"\\b[Ii]t'?s not just [^.]{2,60}[—-] it'?s\\b" },
    { "id":"fragment",  "re":"(?m)\\.\\s+((?:\\w+[ ]){0,3}\\w+)\\.$" },
    { "id":"dash-pile", "re":"(?m)^[^\\n]*—[^\\n]*—[^\\n]*$" },
    { "id":"triad",     "re":"\\bthe \\w+, the \\w+,? and the \\w+\\b" }
  ],
  "limits": { "exclamation_marks_site_wide": 1 }
}
```

**▲ `robust` is deliberately not on the list** — it is a standard technical term in his field (robust regression, robustness of an ensemble), and banning it would fail his own publish. **▲ The check never blocks his publish** (§8.5): it is a hard gate on developer pull requests and a warning-only line in the publish log for content he writes.

- **Say the uncertainty.** In this genre, hedging is a credibility signal, and §6.2 now makes it structural: each of the four research claims carries an **IPCC AR6 calibrated-language tag** (*high confidence*, *medium confidence*, *very likely*) — his own discipline's vocabulary, applied to his own claims.

### Sample rewrite 1 — the home-page lead and bio (draft; interview supersedes)

> **For seven years I forecast rivers across the continental United States. Since February 2017 I have done it for one city, Hyderabad, and for the Godavari and the Narmada.**
>
> At NOAA's Office of Hydrologic Development in Silver Spring I worked on the US National Weather Service's Hydrologic Ensemble Forecast Service, the post-processing that turns one streamflow number into a distribution a reservoir operator can act on. I came to IIT Hyderabad in February 2017 to do the same work for Indian rivers, and I have ended up doing most of it for one city.
>
> Hyderabad floods for reasons that are only partly about the drainage. Rain here arrives in short intense bursts over a few square kilometres, and our gauge network was built to measure a different kind of rain. Afterwards we have almost no record of where the water actually stood. My group works at both ends of that gap: the meteorology and hydrology that produce the flood, and the data collection that would let anyone check whether we got it right.
>
> I did my masters at the IIT Kanpur and my PhD at the University of Colorado at Boulder, and I worked with the World Bank and at Johns Hopkins before I came back to India in 2017.

*Preserved verbatim, do not copy-edit:* **"only partly about the drainage"** and **"at the IIT Kanpur"**. Both are his. A style-guide note carries this instruction to any future editor.

*Checked against `banned-words.json`: no reversal, no fragment closer, no triad, zero em-dashes, every sentence carries a proper noun or a date.* `[PLACEHOLDER: confirm "seven years" — Oct 2007–Nov 2013 as Research Hydrologist plus the NRC postdoc Oct 2006–Oct 2007; he may prefer "six years" or "from 2006".]`

### Sample rewrite 2 — a research-theme blurb (`/research/urban-flooding-hyderabad/`)

> **Hyderabad's floods are a forecasting problem as much as a drainage problem.** *(high confidence)*
>
> The city's worst events come from rainfall that is intense, short and spatially tiny, and the observing network was never built to see it. Between 2019 and 2024 we characterised what high-temporal-resolution rainfall over Hyderabad actually looks like, which synoptic circulation patterns bring it, and how much of it the satellite products miss at the space and time scales a city planner needs. Our IMERG assessment found the largest errors exactly where a planner needs the estimate to be good, which is at sub-daily scales over a few square kilometres.
>
> That gap in the observations is what the second half of this work is for. **SnapFlood** is a phone app that lets anyone photograph a flooded street and upload it with a location, building an archive of where water stood. It feeds the **Urban Flood Information System (UFIS)**, developed with GHMC, IMD, the Telangana State Development Planning Society, the Irrigation Department and the Central Water Commission. The work started in 2019 under a DST-SPLICE Climate Change Programme grant.
>
> {n_papers} papers, one app, one dashboard and {n_theses} PhD theses have come out of it so far, and the archive holds {n_reports} citizen reports as of {date}.

> ▲ **Sidenote, in the right rail:** In September 1908 the **Musi** rose to a peak that killed an estimated 15,000 people in one night and produced the two reservoirs, **Osman Sagar** and **Himayat Sagar**, that still govern how the city drains. Every flood Hyderabad has had since has been measured against that line, including on this page's masthead.

Verified sources for the claims above: the IMERG paper (Ponukumati, Mohammed & Regonda, *J. Hydrometeorology* 24, 977–996, 2023), the synoptic-patterns paper (Mohammed & Regonda, *Int. J. Climatology*, 2023), the high-resolution rainfall climatology (Mohammed, Regonda & Kopparthi, *Urban Climate* 42, 2022), the agency list (Deccan Chronicle, 6 Oct 2023), the DST-SPLICE origin (SnapFlood Play Store listing). Counts render from the sheet.

---

## 3. Design direction

### CHOSEN: **"Bulletin"** ▲ *(renamed from "Gauge"; the idea got stronger and more specific)*

**Mood.** An operational river forecast, printed. A National Weather Service AHPS river page and a CWC flood bulletin have a shape: an issue stamp, a stage plot with a threshold line drawn across it, a category word, a table of numbers in a fixed column, and no persuasion anywhere. That is the register, and it happens to be the register of the twelve years of his career that nobody in India can copy.

**The single organising idea, in one sentence:** **this site is a serial hydrologic bulletin about one person's work — its palette is taken from his discipline's published colormaps, its structure from operational forecast products, and its one recurring object is a real discharge record he owns.**

Every non-generic decision descends from that sentence:

- **▲ The hydrograph is content, not wallpaper.** A 74rem × 140px strip sits directly under the masthead rule on the home page at **full ink weight**, with a real axis, a mono caption naming gauge, dates and peak, and — the move nobody expects — **the 1908 Musi flood peak drawn as a dashed datum line above the 2020 trace, labelled, with 2020 visibly failing to reach it.** That single line carries the city's hydrological history and gives the masthead an argument. (Revision 1 put this at 8% opacity behind the hero, which is wallpaper. Cut.)
- **▲ The flood-stage threshold line is the site's rule system.** It exits the chart at its y-position and continues as the first section hairline. Every section rule below it is the same 1px `--ink` line. The ornament and the grid are one object.
- **▲ Named water bodies are hydrography.** On a USGS topographic sheet, hydrography is labelled in blue italic. On this site, every named water body in body prose — Musi, Godavari, Narmada, Brahmaputra, Krishna, Serayu, Hussain Sagar, Osman Sagar, Himayat Sagar — renders in **italic `--accent`, no underline**, from a build-time term list (§4.2). It is automatic, it is sitewide in prose, and no template can have it because no template knows which nouns are rivers.
- **The accent's provenance is citable.** `--accent #166157` is a stop on the IPCC AR6 sequential precipitation ramp (`#FFFFE5 → #003C30`). `--mark #8C5A24` is the dry pole of the AR6 brown-to-teal divergent ramp. The interface and the figures share one palette.
- **▲ And the dry pole now means something.** `--mark` is the colour of **absence**: an alumnus whose placement we do not have, a paper with no open copy, a project with no public data, a gap in a record. His whole argument is that the gap is in the observations. On this site the gaps have a colour, and they are the same colour the AR6 ramp uses for *drier*. That turns the palette from a swatch into a position, and it costs one token.
- **▲ The ink is in the family.** `--ink #0F2621` is the ramp's dark pole pulled toward neutral, so the whole site is written in the wet pole and a link reads as a lighter member of the same family rather than as grey text plus a brand colour.
- **Every quantity — years, discharge, DOIs, basin areas, phone numbers — is set in tabular mono.**
- **▲ The site is a serial.** A masthead stamp reads `SATISHREGONDA.IN · ISSUE {n} · {date}`, incremented per deploy, because it is true and because no template does it.

### Reference points — **▲ with a "what we refuse" column, which revision 1 lacked**

| Source | What we take | **What we refuse** |
|---|---|---|
| **NWS AHPS river forecast pages** (`water.weather.gov`) | The issue stamp (`ISSUED 0630 IST`), the stage-category word as the primary signal, the threshold line drawn across the plot, EVENT-mode ordering | Their colour-only encoding, their tables, their density; we never imply we are issuing an official forecast |
| **USGS 7.5′ topographic sheets** | Hydrography set in italic and coloured; the marginal collar of provenance data at the foot of the sheet (→ the footer, §6.2) | The contour texture, the sheet grid, any map-as-decoration |
| **A printed hydrographic chart / tide table** | The datum line as a governing horizontal; numbers in fixed columns; the legend printed once | The blue-on-buff palette, the ornamental compass rose |
| **IPCC WG1 colormaps** (`github.com/IPCC-WG1/colormaps`) | Accent, secondary and every chart ramp; AR6 calibrated-uncertainty language on the four claims | AR6's own figure typography and layout |
| Asterisk Magazine | Hairlines at **full text colour**, not 8%-alpha grey; zero `box-shadow` | The cream ground, the display italic, the essay-magazine masthead |
| Jeff Heer | The right-aligned year gutter as a principle | The three-column academic-homepage shell, the pixel values |
| Reed Maxwell's group | The trainee-marking legend printed once above the publication list | The card grid, the lab-brand lockup |
| Bayani Cardenas | The one-line alumni format with a destination | The people-page photo wall |

Revision 1 listed eight references of which five (Asterisk, Works in Progress, gwern, Heer, Tufte CSS) sat in one genre and each contributed one CSS detail. Three are cut. Two remain, contributing one principle each rather than a rule.

### **▲ Three choices that are matters of taste and are not defended**

Stated here so that nobody has to argue them, and so that the document contains something other than justified defaults. They are settled by the **printed A3 specimen** (Phase 2, §10), not by argument.

1. **His name is set at 13px in mono caps in the masthead, and the `h1` on every interior page is 64px.** The page's subject is large; the man's name is a document header. This is objectively the wrong way round and it is correct.
2. **The ground is tinted `#E7EDE8` and the figure plates are the white.** Every academic site is white with grey cards. This is the reverse, it is one token, and it is legible from across a room.
3. **The footer is an 11px mono block running the full 74rem, denser than anything above it, and it is the last thing you read.**

### RUNNER-UP: **"Deccan"** — Indian Type Foundry serifs (Recia/Boska) on an ochre-and-cream ground

Three lines on why it lost:

1. **The ITF Free Font License v2.0 (17 Aug 2026) §02 forbids "subsetting, format conversion"** — which every modern build toolchain does automatically. A site meant to outlive its developer cannot depend on a font we must remember never to optimise.
2. **Cream + warm accent + serif is the 2026 AI house style**, on the record from Kyle Chayka's reporting and from designer Celine Nguyen. It executes the brief's literal words straight into the attractor basin.
3. Only Boska has true small caps, and the "Indian" signal belongs in the content, the accent's provenance, the 1908 datum line and the hydronym rule rather than in a decorative typeface.

---

## 4. The design system, concretely

### 4.1 Typography — **▲ two families, not three**

Revision 1 shipped Source Serif 4 + Public Sans + IBM Plex Mono: three OFL, GitHub-hosted, US-institution faces, which is the safe triad of exactly this genre, and one of them (Source Serif 4) was chosen by citing gwern and then described as a fingerprint. The sans is **cut entirely**: metadata, nav, captions and status lines go to the mono; photo credits go to serif italic.

| Role | Typeface | Foundry | Licence | Source | Ships |
|---|---|---|---|---|---|
| Text + display | **Piazzolla** (variable `wght 100–900`, `opsz`) | Huerta Tipográfica (Buenos Aires) | SIL OFL 1.1 | `github.com/huertatipografica/Piazzolla` | Roman + Italic, Latin subset |
| Small caps | **Piazzolla SC** (same superfamily, same metrics) | Huerta Tipográfica | SIL OFL 1.1 | same repo | Roman only |
| Metadata, nav, rail, data, code, status | **Martian Mono** (variable `wght`, **`wdth` 75–112.5**) | Evil Martians | SIL OFL 1.1 | `github.com/evilmartians/mars-mono` | Two instances: `wdth 100` and `wdth 75` |

**Why these.** Piazzolla is Palatino-adjacent with humanist details that stay slightly awkward at text size — it reads as engineered rather than as tasteful, it is not from a US institution or a tech company, and it is the only face in the shortlist with a matched SC binary in the same superfamily rather than a bolted-on feature. Martian Mono's width axis is not a novelty here: a condensed instance is what makes a 2.75rem year rail survive on a 390px phone (§4.3), and a normal instance carries nav and status. Two families, four files, one of which is a width variant of another.

**▲ Phase 2 gate, before any component is built** (a checkbox in §10, not an assumption):

```bash
# must print smcp (or the SC binary must exist), onum, lnum, tnum, pnum for the serif
hb-shape --list-features Piazzolla[opsz,wght].ttf
hb-shape --list-features PiazzollaSC[wght].ttf
hb-shape --list-features MartianMono[wdth,wght].ttf
```

**If the gate fails** — no real small caps in the superfamily, or the `wdth` axis does not survive subsetting — **the fallback is stated now and shipped without a meeting: Source Serif 4 (upstream 4.004R, not Google Fonts) + IBM Plex Mono.** That pair is verified to carry `smcp c2sc onum lnum zero tnum` upstream, and Google's own subset strips all five. The design does not change; the specimen is reprinted.

**Build once, commit the output, delete the script.** ▲ Font subsetting leaves CI entirely (revision 1 ran `fontTools` in the pipeline, which is a bespoke step that breaks silently on handover). It is run once, by hand, on a developer machine; the four `.woff2` files are committed; the exact command and the binary feature diff live in `docs/typography.md`. Payload budget: **≤160 KB across four files**, measured and recorded in Phase 2. One preload (the serif roman), `font-display: swap`, a metric-matched `local()` fallback stack.

**▲ Measure and x-height are derived, not asserted.** Revision 1 quoted a measured 0.4562 em average advance for Source Serif 4 and an OS/2 `sxHeight` table. Those numbers do not transfer to Piazzolla and Martian Mono. Phase 2 runs `scripts/measure-face.py`, which reports the average advance of the shipped subset and the `sxHeight`/`unitsPerEm` ratio for each face, and writes `--w-text` and the mono's optical size into `tokens.css`. **Targets:** body measure **62–68 characters** (provisional `--w-text: 34rem`, confirmed on the specimen); mono set at whatever nominal size makes its x-height match the serif's at 18px, **not** at the same nominal size — setting them equal is the commonest pairing error and makes metadata shout over the prose it annotates.

#### Type scale — **▲ seven steps, down from thirteen**

Thirteen sizes derived to a quarter-pixel is a system, not a voice. Seven steps, each with a job, no quarter-pixels.

| Token | Face | Size | Line-height | Weight | Tracking | Used for |
|---|---|---|---|---|---|---|
| `--t-display` | Piazzolla | **4rem / 64px** (≥900px) → 2.25rem / 36px below | 1.04 | 400 | −0.022em | `h1` on every interior page, at a 26rem measure |
| `--t-h2` | Piazzolla | 1.5rem / 24px | 1.25 | 600 | −0.010em | `h2` section heads |
| `--t-lead` | Piazzolla | 1.3125rem / 21px | 1.50 | 400 | 0 | Home lead, the four claims, theme standfirsts |
| `--t-body` | Piazzolla | **1.125rem / 18px** | **1.62** | 400 | 0 | All prose. `h3` = this size, weight 600, small caps |
| `--t-small` | Piazzolla | 1rem / 16px | 1.55 | 400 | 0 | Captions, photo credits (italic), abstract on paper pages |
| `--t-meta` | Martian Mono `wdth 100` | 0.8125rem / 13px | 1.40 | 500 | +0.030em | Masthead name, nav, status lines, venue metadata, rail years ≥1100px |
| `--t-micro` | Martian Mono `wdth 75` | 0.6875rem / 11px | 1.35 | 500 | +0.060em | Footer bulletin block, rail years <1100px, axis labels, legends |

Tracking **inverts with size** — negative on the 64px display, positive on the two mono steps. The inversion is retained from revision 1 because it is the one typographic habit generated CSS never has.

Figure-style rules:

```css
p, li, blockquote   { font-variant-numeric: oldstyle-nums; }
a                   { font-variant-numeric: lining-nums; }   /* oldstyle 3/4/5/7/9 collide with the underline */
.rail-year, td, .metric,
.cv-date, .stage-axis { font-variant-numeric: tabular-nums; }
.venue, .eyebrow    { font-family: "Piazzolla SC"; letter-spacing: .04em; }
h1, h2, h3          { text-wrap: balance; }
p                   { text-wrap: pretty; }
:root               { font-optical-sizing: auto; }
.hydronym           { font-style: italic; color: var(--accent); }
```

### 4.2 Colour — **▲ light only, and the dry pole has a job**

**▲ Decision: this site has no dark mode, and says so.** Revision 1 shipped forty tokens, twenty-six computed contrast rows, a shadow-policy exemption and a permanent light figure plate, and never wrote one sentence about what dark mode was for. Its media query was also empty — the dark values existed only under `[data-theme="dark"]`, and the `data-theme` toggle it implied appeared in no layout, had no persistence spec and no no-JS behaviour. All of that is cut. The colophon carries one line:

> *This site is a paper object. It does not have a dark mode. It has a print stylesheet that was printed and read.*

The NWS stage-category colours that a dark mode would have used are **repurposed to EVENT mode** (§5.4), where they carry information rather than atmosphere.

```css
:root {
  color-scheme: light;

  /* ground and plate — inverted from the academic default */
  --paper:       #E7EDE8;  /* tinted cool grey-green: the page */
  --plate:       #FCFDFC;  /* figures and paper-detail pages: the white */

  /* two inks, not three */
  --ink:         #0F2621;  /* AR6 dark pole pulled toward neutral */
  --ink-mute:    #586A65;

  /* rules — two weights, both real colours, never rgba shadows */
  --rule:        #B3BDB8;  /* list separation, decorative */
  --rule-strong: #778681;  /* form control borders, must clear 3:1 */
  /* structural section rules use var(--ink) at 1px */

  --accent:      #166157;  /* IPCC AR6 precipitation ramp */
  --accent-hover:#0E4A42;
  --mark:        #8C5A24;  /* AR6 divergent dry pole = ABSENCE */

  /* EVENT mode only — NWS stage categories, darkened to text legibility */
  --stage-action:   #6A6B14;
  --stage-minor:    #A34B00;
  --stage-moderate: #D2132C;
  --stage-major:    #7B1FA2;
}
```

**Computed contrast** (WCAG relative luminance, computed for this document, not asserted):

| Token | Hex | vs `--paper` | vs `--plate` | Verdict |
|---|---|---|---|---|
| `--ink` | `#0F2621` | **13.40:1** | 15.61:1 | AAA |
| `--ink-mute` | `#586A65` | **4.82:1** | 5.62:1 | AA |
| `--accent` (links, hydronyms) | `#166157` | **6.13:1** | 7.15:1 | AA |
| `--accent-hover` | `#0E4A42` | 8.51:1 | 9.92:1 | AAA |
| `--mark` (absence) | `#8C5A24` | **4.91:1** | 5.72:1 | AA |
| `--rule-strong` (controls) | `#778681` | **3.21:1** | 3.74:1 | ✓ SC 1.4.11 |
| `--rule` (decorative only) | `#B3BDB8` | 1.62:1 | 1.89:1 | n/a — no minimum |
| `--stage-action` | `#6A6B14` | 4.74:1 | — | AA |
| `--stage-minor` | `#A34B00` | 4.96:1 | — | AA |
| `--stage-moderate` | `#D2132C` | 4.57:1 | — | AA |
| `--stage-major` | `#7B1FA2` | 6.91:1 | — | AA |

Every stage colour clears 4.5:1 on paper, which means **the category word itself is set in the colour** and the colour is redundant with the word — the correct construction, and it removes the deuteranopia problem that a coloured band would have created.

**▲ `--visited` is deleted as a token.** A visited link keeps its underline and drops to `--ink-mute`: read links go quiet, in family, with one fewer hue and one fewer token.

**Chart palette** (figures sit on `--plate`):

- Sequential (depth, rainfall, discharge): AR6 precipitation — `#FFFFE5 #C6E2CD #8EC5B5 #56A89D #2C877F #166157 #003C30`
- Divergent (anomaly, bias): AR6 — `#543005 #BF812C #E5D1B4 #F8F8F7 #B7D8D5 #35978F #003C30`
- Categorical (≤6 series): IPCC `gree-blue_cat` = Paul Tol's colourblind-safe set — `#332288 #117733 #88CCEE #999933 #44AA99 #6699CC`

#### **▲ Accent budget — countable, and in the grep script**

Revision 1 said "~2% of painted pixels", which no one can measure and no one would. Replaced by five rules that `scripts/grep-check.mjs` and one Playwright assertion actually enforce:

1. `--accent` appears on exactly five things: prose links; the active nav item's 2px underline; the focus ring; hydronyms in prose (italic, **no underline**); the 2px left rule marking a selected publication.
2. **Zero filled accent areas.** `background` may never reference `--accent`. Grep-enforced.
3. At most **12 accent-coloured elements per 1440×900 viewport**, at most **6 above the fold on `/`**. Asserted in a Playwright count.
4. `--mark` is **text only**, never a fill, never a border, and **never appears without words**. "Placement not recorded", "no open copy", "no public data" — the colour repeats the words, it never replaces them.
5. Never `#FFFFFF` on `#000000`. Never Tailwind indigo/violet — `#6366F1 #4F46E5 #818CF8 #8B5CF6 #A855F7` are grep-banned.

#### The hydronym term list

`config/hydronyms.json` holds the named water bodies. The build wraps exact, case-sensitive, whole-word matches in `<i class="hydronym">` **inside body prose and captions only**. It is refused inside `h1`–`h3`, publication titles, author strings, venue names, `code`, `pre`, the nav, the footer and any citation — a source's own typography is never restyled. A hydronym that is also a link renders as a link and is not double-marked.

### 4.3 Spacing, grid, radius, borders, links, focus, motion

**Spacing** — 4px base, non-linear at the top so major sections breathe:

```
--s-0:0  --s-1:.25rem  --s-2:.5rem  --s-3:.75rem  --s-4:1rem
--s-5:1.5rem  --s-6:2rem  --s-7:3rem  --s-8:4rem  --s-9:6rem  --s-10:8rem
```
`--s-4` paragraph rhythm · `--s-6` between subsections · `--s-8` major sections (mobile) · `--s-9` major sections (desktop).

**Widths, and the site's two rhythms** ▲

Revision 1 had one width for everything below the masthead, which made the home page a stack of equal bands. The page now visibly widens and narrows as its content changes register:

```css
--w-text:    34rem;  /* prose — provisional, set from the measured face in Phase 2 */
--w-content: 46rem;  /* publication rows, news rail, alumni table, people grid */
--w-wide:    74rem;  /* masthead, footer, research claims */
--rail:       7rem;  /* the gauge rail, ≥1100px */
--rail-sm: 2.75rem;  /* the gauge rail, 390–1099px — it does NOT collapse */
/* full-bleed (100vw): the hydrograph strip and the group photograph only */
```

**▲ The rail survives to 390px.** This is the correction that matters most, because audience 1 is the largest and arrives on a phone, and revision 1's single signature layout move was absent for it. Below 1100px the rail narrows to `--rail-sm` and carries **stage ticks**: a 1px mark at each year with the year set in Martian Mono `wdth 75` at 11px, right-aligned. The left edge of every dated list still reads as a gauge axis at phone width. Sidenotes move inline below their paragraph as `<details>`; nothing else changes.

```css
.bulletin-grid {                    /* ≥1100px */
  display: grid;
  grid-template-columns: var(--rail) minmax(0, var(--w-text)) 1fr;
  column-gap: var(--s-5);
}
@media (max-width: 1099px) {
  .bulletin-grid { grid-template-columns: var(--rail-sm) minmax(0, 1fr); }
}
```

`repeat(3, 1fr)` on a content section is grep-banned, and at least one uneven `fr` ratio must be present.

**Radius policy: `0`. Everywhere.** ▲ Revision 1 had 0 / 2px / 3px — two radii no human can distinguish, existing because "forms need a little radius". A 0-radius text input on a 1px `--rule-strong` border is more distinctive than a 3px one and matches the concept exactly. **Photographs are square-cropped, never circles.**

**Borders — two weights, both real colours.** `1px solid var(--rule)` between list items and around figures; `1px solid var(--ink)` for structural section rules and the masthead. Full-strength rules are the cheapest thing that reads as print-trained.

**Shadow policy: none, with no exception.** ▲ Revision 1 carved out a mobile nav drawer. There is no drawer: six mono nav items at 13px wrap to two rows of three at 390px, costing zero JavaScript and removing the exemption.

**Links**

```css
a {
  color: var(--accent);
  text-decoration: underline;
  text-decoration-thickness: .06em;
  text-underline-offset: .16em;
  text-decoration-color: color-mix(in oklab, var(--accent) 40%, transparent);
  text-decoration-skip-ink: auto;
  font-variant-numeric: lining-nums;
  transition: text-decoration-color 140ms ease, text-decoration-thickness 140ms ease;
}
a:hover   { text-decoration-color: var(--accent); text-decoration-thickness: .09em; color: var(--accent-hover); }
a:visited { color: var(--ink-mute); }
a[href^="http"]:not([href*="satishregonda.in"])::after {
  content: "\2197"; color: var(--ink-mute); font-size: .75em;
  margin-inline-start: .15em; vertical-align: .15em; text-decoration: none;
}
```

▲ The outbound arrow moves from `--mark` to `--ink-mute`, because `--mark` now means absence and cannot also mean "elsewhere". The arrow is `aria-hidden` via `content` on a pseudo-element (screen readers do not announce it), and outbound links whose destination is not obvious from the link text carry a visually-hidden " (external link)".

Underlines are removed in exactly two places, each with a replacement affordance: the nav (active = 2px accent underline at 0.4em offset) and publication titles (hover-only underline; sixty underlined lines in a row is unreadable). Everywhere else in prose: underline, always.

**Focus ring**

```css
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
:focus:not(:focus-visible) { outline: none; }
html { scroll-padding-top: 5rem; }         /* WCAG 2.2 SC 2.4.11 */
.skip-link { /* first focusable element on every page → #main */ }
```

Outset, so 2px satisfies SC 2.4.13's area rule; 6.13:1 against paper, 7.15:1 against plate. ▲ A skip-to-content link is the first focusable element on every page (missing from revision 1).

**Motion — a budget of two effects, total** ▲

1. Link underline colour and thickness, 140ms.
2. **The datum line.** Hovering or focusing any year in the gauge rail draws a 1px `--rule` hairline across the full viewport width at that baseline, 120ms. Pure CSS, on-concept (it is the chart's threshold line, reused as a reading aid), and it is the kind of thing a visitor mentions to someone else.

That is the whole budget. No scroll reveals, no stagger, no counters, no parallax, no page-transition router. `prefers-reduced-motion: reduce` neutralises both, and `scroll-behavior: smooth` lives inside a `no-preference` guard.

### 4.4 Signature details — **▲ audited honestly, then rebuilt**

Revision 1 called eight things a fingerprint. Audited, five were genre competencies: the year rail is Heer's `.margin` with the pixel value changed; Tufte sidenotes are the most-copied academic-web move of the decade; small-caps venues are in every well-made CV since 1990; light figure plates are correct engineering with no visual signature; a colophon is itself now a convention. Those five stay, because they are right — they are just not a fingerprint, and the document no longer claims they are. What follows is the list of things that **only this site can have**.

1. **The stage mark, at full ink, as content.** A 74rem × 140px hydrograph strip under the masthead rule on `/`: a real 1px trace from a discharge record his group holds, a mono axis, a caption reading `MUSI AT CHADERGHAT · 13–15 OCT 2020 · PEAK {value} m³/s · SOURCE {agency}`, the flood-stage threshold as a horizontal `--ink` rule that exits the chart and becomes the page's first section hairline, and **the 1908 Musi peak as a dashed datum line above the 2020 trace, labelled `1908`.** Reduced crops: a 7rem divider between major sections, a 2rem glyph in the footer. One geometry, three uses, and the largest one is an argument. *(Fallback if he cannot supply a CSV — §12.7.)*

2. **Trainee marks in author lists, derived.** `*` PhD · `†` M.Tech · `‡` B.Tech/intern · `#` postdoc, superscript after the surname in `--accent` at 0.7em, with a small-caps legend printed once above the list. His own name at weight 600 in `--ink`; co-authors at `--ink-mute`. ▲ The marks are **computed from the `People` tab by alias matching** (§7.6), never hand-typed, and the role is chosen by the paper's year against the person's `start_year`/`end_year` window — so a 2019 paper marks them a PhD student and a 2027 paper does not.

3. **The issue stamp.** `SATISHREGONDA.IN · ISSUE {n} · {date} · BUILD {sha7}` in `--t-micro` above the masthead rule, incremented per successful deploy from a counter in the committed build metadata. The site is a serial publication, which is true.

4. **Hydronyms as hydrography.** §4.2. Automatic, sitewide in prose, unGoogleable by a template.

5. **The absence colour.** `--mark` on every gap the site has: alumni without a recorded destination, papers without an open copy, projects without public data. The site displays its own holes in the colour its discipline uses for *drier*.

6. **Calibrated claims.** Each of the four research claims carries a mono metadata line: `CLAIM 01 · HIGH CONFIDENCE · {n} PAPERS · REVISED {date}`, using AR6 calibrated-uncertainty vocabulary. Putting a confidence level on his own claims is on-thesis and impossible to template.

7. **The datum-line hover.** §4.3.

8. **The marginal collar.** The footer as a topographic sheet's collar: issuing office, next scheduled update, issue number, build hash, in 11px mono across 74rem. §6.2.

9. **Square photo crops, one grade, monsoon overcast.** 4:5, no circles. ▲ Grade specified in §10 Phase 1b, and **golden hour is banned in writing.** Where a photo is missing: a typographic tile with initials in Piazzolla on `--plate` with a 1px `--rule` border — never a grey silhouette.

10. **Sidenotes as `<details>`.** ▲ Changed from the Tufte `<label>`+checkbox pattern, which gives a control with no accessible name, no `aria-expanded` and a jumping reading order — the one signature element in revision 1 with a real accessibility cost. `<details><summary>` is positioned into the right rail with grid at ≥1100px and sits inline below 1100px: same visual result, native semantics, keyboard and screen-reader support for free, one fewer responsive mode to test.

11. **Figures on a permanent light plate.** No image ever inverts. `--plate` card, 16px padding, 1px `--rule` border, exactly how a journal figure looks on a page.

12. **The colophon** at `/colophon/`: ~250 words naming the typefaces and why, the derivation of `--ink` from `#003C30`, the AR6 provenance of `--accent` and the semantics of `--mark`, the gauge and dates behind the masthead hydrograph and the source of the 1908 peak, the hydronym list, every photographer credit, the build stack, the "no dark mode" line, and a `#privacy` block (§7.6).

---

## 5. Information architecture

### 5.1 Navigation and masthead

**Top navigation — six items, mono, index-numbered, plain text, no dropdowns:**

`01 RESEARCH · 02 PUBLICATIONS · 03 TOOLS · 04 RAFT · 05 TEACHING · 06 WRITING`

▲ Two changes from revision 1: the index numbers (bulletin register, and the first thing a visitor reads stops sounding like a CMS) and **Group → RAFT** (it is the group's actual name, and it is what a collaborator would search). `/tools/`'s own `h1` is **"Things you can use"**, which does the audience-routing work that a four-word nav item would have done at the cost of the nav's rhythm at 390px.

Identity lives in the masthead, not the nav: name at `--t-meta` in mono caps, role, email and a small square photograph, above a `1px solid var(--ink)` rule, on every page, with the issue stamp above it.

**▲ The footer carries the routes the nav does not** — revision 1 said About/Contact/CV/Join lived "in the footer" and then specified a footer containing none of them, leaving `/about/` and `/press/` reachable only by guessing. §6.2 specifies three labelled columns including **About · Join · Press kit · News · CV · RSS · Colophon**.

### 5.2 Full sitemap — every route, no unspecified pages

| Route | Kind | Purpose | Audience | Spec |
|---|---|---|---|---|
| `/` | Page | Identity + routing in one screen; EVENT-aware | All | §6.1–6.2 |
| `/research/` | Page | Four numbered claims; funded and past projects | 2, 3 | §6.6 |
| `/research/urban-flooding-hyderabad/` | Page | The flagship theme | 2, 3, 4 | §6.6 |
| `/research/streamflow-forecasting/` | Page | Godavari, Narmada, Brahmaputra, HEFS lineage | 2, 3 | §6.6 |
| `/research/monsoon-hydroclimatology/` | Page | Rainfall attributes, extremes, synoptic patterns | 2 | §6.6 |
| `/research/hydrologic-data-for-india/` | Page | The observation gap; drones, GEE, radar | 2, 3 | §6.6 |
| `/publications/` | Page | The complete, corrected record; filters as real URLs | 2, 3 | §6.3 |
| `/publications/?theme={slug}` | Page ×5 | Server-rendered filtered views (Scholar-legal) | 2 | §6.3 |
| `/publications/<id>/` | Page ×{n} | One paper, one URL — required by Google Scholar | 2 | §6.4 |
| `/tools/` | Page | "Things you can use" | 3, 4, 5 | §6.7 |
| `/tools/snapflood/` | Page | The flagship, for journalists and agencies | 4, 3 | §6.8 |
| `/group/` | Page | RAFT as one rich scroll | 1, 2, 5 | §6.5 |
| `/teaching/` | Page | Courses with real codes and semesters | 5, 1 | §6.9 |
| `/teaching/<code>/` | Page ×n | Only courses with `page` ticked **and** an outline filled | 5 | §6.9 |
| `/writing/` | Page | Blog index; **not emitted at zero posts** | 1, 2, 4 | §6.10 |
| `/writing/<slug>/` | Page ×n | One post | varies | §6.10 |
| `/join/` | Page | The highest-value page on the site | 1 | §6.11 |
| `/about/` | Page | Long bio, education, appointments, service, talks, awards, contact | 2, 3 | §6.12 |
| `/about/cv/` | Page | Generated CV, HTML, with a print stylesheet | 2, 3 | §6.12 |
| `/news/` | Page | Archive of dated one-liners, continuous reverse-chron | 2, 5 | §6.13 |
| `/press/` | Page | One-click press kit with **sourced prior quotes** | 4 | §6.13 |
| `/colophon/` | Page | Typefaces, colour provenance, credits, build, `#privacy` | — | §6.13 |
| `/404` | Page | ▲ **Specified**, not "generated" | — | §6.14 |
| `/feed.xml` `/sitemap.xml` `/robots.txt` | Generated | RSS (omitted at zero posts), sitemap, allow-all | — | §8.6 |

**Sections of the home page, not pages:** masthead identity, the hydrograph strip, the status line, "Currently", the news rail, the four claims, the selected-publications strip, the tools strip, the RAFT teaser. Every one links to a real page.

**▲ Cut from revision 1:** `/research/krishna-serayu-climate-extremes/` (a completed 2020 project given a full page, a body Doc, a required figure and a slug, with no entry point in the IA — rescued from orphanhood into new orphanhood). It becomes a row in `/research/#past-projects` with the January 2020 FGD workshop date named and the workshop report PDF linked. The archival value is preserved; the orphan disappears; the redirect points at the anchor.

### 5.3 Themes — one canonical list ▲

Revision 1's filter chips (Urban flooding, Forecasting, Monsoon & climate, **Water management**, **Methods & tools**) did not match the `Research.slug` values they were validated against. One list now governs slugs, chips, claims and theme pages:

| slug | Claim (the chip label is the short form) |
|---|---|
| `urban-flooding-hyderabad` | Hyderabad's floods are a forecasting problem as much as a drainage problem |
| `streamflow-forecasting` | Ensemble forecasts for the Godavari and Narmada, 7–15 days out |
| `monsoon-hydroclimatology` | Monsoon rainfall is changing shape over Indian cities |
| `hydrologic-data-for-india` | India's hydrologic record has a hole in it |

▲ **`Publications.theme` is optional.** The NOAA/HEFS-era papers and the Routledge book chapter belong to none of the four and were going to be force-fitted. Papers with no theme appear under a sixth chip, **Other**, whose count derives. Chips: `All ({n}) · Urban flooding ({n}) · Forecasting ({n}) · Monsoon & climate ({n}) · Hydrologic data ({n}) · Other ({n})`.

### 5.4 **▲ EVENT MODE** — new, and the largest correction in this revision

Audience 4 is time-critical, traffic spikes during floods, and the site as designed was identical on a dry Tuesday and during a Musi flood. Three site states, one cell, no new page.

| State | Set by | Home page changes | Reverts |
|---|---|---|---|
| `normal` | default | — | — |
| `watch` | `Settings.site_state` | A single mono line under the masthead rule: `WATCH · {date} · {one sentence} · IMD forecast ↗` | Auto at `site_state_until` |
| `event` | `Settings.site_state` | The status strip goes to the top in the relevant `--stage-*` colour with the **category word set in the colour**; `/tools/snapflood/` and the press contact rise above "Currently"; the recruiting line drops below the four claims; the news rail shows only items from the last 14 days | Auto at `site_state_until` |

**Rules that keep this honest and safe:**

- **The site never issues a forecast.** EVENT mode reorders content, prints a dated sentence he wrote, and links to IMD, TSDPS, GHMC and CWC. It never displays a live number, a predicted stage or a warning of its own. The strip carries a permanent line: `This page is not an official warning. Official advisories: IMD ↗ · TSDPS ↗ · GHMC ↗`.
- **It cannot get stuck on.** `site_state_until` (ISO datetime) is required whenever `site_state ≠ normal`; the build reverts to `normal` past that time whether or not he remembers. Maximum 96 hours per setting; longer needs a second edit.
- **It refreshes fast enough to matter.** While `site_state ≠ normal`, a Cloudflare scheduled trigger rebuilds hourly. In `normal` the cron runs twice daily.
- **It is one cell for him.** `Settings` rows `site_state`, `site_state_line`, `site_state_until` sit in the top five rows of the key/value tab (§7.1), reachable on a phone.
- The colours are the NWS stage categories, each darkened to ≥4.5:1 on paper so the *word* carries the signal and colour is redundant.

### 5.5 The RAFT page and raftwaters.in

`raftwaters.in` is NXDOMAIN. Therefore:

- `/group/` is a **complete, self-sufficient account** of the group, not a stub that funnels somewhere.
- The outbound link is a single build-time constant, `RAFT_SITE_URL`, which renders **nothing** when empty. We ship empty. When the domain goes live, one sheet cell turns on a modest text link at the foot of the page.
- `raftwaters.com` is an unrelated GoDaddy placeholder. **Do not link it.**
- **Canonical expansion, decided: "Rainfall-runoff Analysis and Forecasting Tools."** His own page and Deccan Chronicle say "Rainfall-runoff Analysis *modelling* and Forecasting Tools"; the Play Store and his SnapFlood page say the shorter form. The shorter wins on three grounds: it is the only version that spells R-A-F-T; it is already public on an app listing with 100+ installs; and "Analysis modelling" is not English. One expansion, enforced everywhere, plus a request to update the Play Store copy. ▲ This has moved out of Open Questions into "Decisions we made for you" (§12).

### 5.6 Migration from the Google Site — **▲ the premise was wrong in revision 1**

Revision 1 shipped a `_redirects` table mapping `/home`, `/students`, `/raft` and so on, as if that solved migration. **Those are paths on `sites.google.com`. A redirect file on `satishregonda.in` never sees that traffic.** The document even said, correctly, that Google Sites permits neither a 301 nor a custom canonical, and then shipped the map anyway. Two separate problems, two separate levers:

**(a) Vanity paths on the new domain** — kept, relabelled, and useful for anyone who typed an old path from memory or has it in a slide. `_redirects` (Cloudflare Pages, 301):

```
/home                                   /                                        301
/education-employment                   /about/                                  301
/products-publications                  /publications/                           301
/research/urban-flood                   /research/urban-flooding-hyderabad/      301
/research/snapflood                     /tools/snapflood/                        301
/research/guidelines-for-sixer-twitter  /tools/#sixer-tweet                      301
/research/climate-extremes-*            /research/#krishna-serayu                301
/students                               /group/#people                           301
/raft                                   /group/                                  301
/opportunities                          /join/                                   301
/cv.pdf                                 /about/cv/                               301
/snapflood                              /tools/snapflood/                        301
```

The Phase 1 Takeout capture produces the verbatim list of source pages; the table is **regenerated from that capture**, so the "13 pages / 12 rows" discrepancy in revision 1 cannot recur — one wildcard rule covers both orphan URLs, and the generated table states its own row count.

**(b) The actual migration lever.** The old Google Site is stripped to a single page carrying: one sentence, "This site has moved to satishregonda.in"; a visible link per retained topic to its new URL; and a `<meta http-equiv="refresh" content="0; url=…">` on each retained sub-page before deletion. All other sub-pages are deleted, so the old site stops competing with the new one for his own name. Because Google Sites supports no change-of-address, Search Console gets a note and the recovery path is inbound-link updates (Phase 6): Google Scholar homepage field, ORCID, ResearchGate, LinkedIn, the IITH faculty CMS, the CE department listing, the Climate Change department listing, the SnapFlood Play Store listing and the three 2023 news articles' bylines where the outlet will amend.

---

## 6. Page-by-page layout specs

**▲ Every layout below is drawn twice — 1440px and 390px — for the four pages that matter most, and specified in full for the rest.** Revision 1 drew desktop and appended a collapse sentence, on a site whose priority audience arrives on a phone from a WhatsApp forward.

### 6.1 Home — above the fold, 1440px

```
ISSUE 47 · 04 SEP 2026 · BUILD a3f91c                    11px mono, --ink-mute
┌─ 74rem ───────────────────────────────────────────────────────────────────┐
│ [■]  SATISH REGONDA · ASSOC PROF · CIVIL ENG & CLIMATE CHANGE · IIT HYDERABAD│
│ 40px  satishr@ce.iith.ac.in       01 RESEARCH 02 PUBLICATIONS 03 TOOLS      │
│                                   04 RAFT 05 TEACHING 06 WRITING           │
│      ↑ 13px Martian Mono, +0.03em                                          │
│═══════════════════════════ 1px solid var(--ink) ══════════════════════════ │
└────────────────────────────────────────────────────────────────────────────┘
╔══ FULL BLEED, 140px ══════════════════════════════════════════════════════╗
║ m³/s ┊                                                                    ║
║ 1908 ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄  ║
║      ┊                        ╱╲                                          ║
║ FLOOD┊───────────────────────╱──╲─────────────────────────────────────────╫──→ becomes
║ STAGE┊              ╱╲     ╱     ╲___                                     ║   the first
║      ┊___________╱─╯  ╲__╱           ╲______________________              ║   section rule
║      └──────────────────────────────────────────────────────────          ║
║       13 OCT            14 OCT             15 OCT                         ║
║ MUSI AT CHADERGHAT · 13–15 OCT 2020 · PEAK {value} m³/s · SOURCE {agency}  ║
║ Dashed line: peak of the September 1908 flood.          11px mono          ║
╚═══════════════════════════════════════════════════════════════════════════╝
──── the flood-stage line continues, full width ────────────────────────────
┌── 7 cols (43rem) ──────────────────┐  ┌── 5 cols (28rem) ───────────────┐
│ ↕ 40px optical top padding         │  │ ┌───────────────────────────┐   │
│                                    │  │ │  4:5 SQUARE CROP          │   │
│ For seven years I forecast rivers  │  │ │  HIM AT A GAUGE, MONSOON  │   │
│ across the continental United      │  │ │  OVERCAST, NOT A DESK     │   │
│ States. Since February 2017 I have │  │ └───────────────────────────┘   │
│ done it for one city, Hyderabad,   │  │ Musi at Chaderghat, Hyderabad,  │
│ and for the Godavari and the       │  │ 14 August 2026. Photo: {name}   │
│ Narmada.                           │  │ 16px Piazzolla italic           │
│ 21px lead, measure 32rem           │  └─────────────────────────────────┘
│                                    │
│ ┌── TRAJECTORY, 1px timeline ────────────────────────────────────────┐   │
│ │ 2006 ──────────────────────────── 2013                            │   │
│ │ NOAA/NWS OHD ████████████████████                                 │   │
│ │ WORLD BANK              2014 ████████ 2016                        │   │
│ │ JOHNS HOPKINS             2015 ████ 2016   ← the overlap is drawn │   │
│ │ IIT HYDERABAD                    2017 ██████████████████████████→ │   │
│ └───────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
──────────────────────────────── hairline ──────────────────────────────────
STATUS · 04 SEP 2026 · ACCEPTING PhD APPLICANTS FOR JAN 2027 · CLOSES 15 NOV
· → HOW TO APPLY                    13px mono caps, rules top and bottom,
                                    NO FILL, full 74rem width
──────────────────────────────── hairline ──────────────────────────────────
                    ↓ fold on a 1440×900 laptop ↓
```

**▲ What changed and why.**

1. **The hydrograph is the hero, and his name is a document header.** Revision 1 set the name at 52px, which is the timid middle: too big to be quiet, too small to be a statement, and nobody's name is set at 52px on a bulletin. The strip at full ink is the largest object on the page, the first line of prose at 21px is the largest type, and the page says *the data is the subject*. That is true of him and no portfolio template would ever do it.
2. **The status line is a wire-service line, not a callout box.** Revision 1 rendered the most important element for the most important audience as an `--accent-tint` filled rounded box with an arrow — the most generic component available, and a direct violation of its own rule that accent may never be a filled area. Rules top and bottom, mono caps, no fill, no radius. It survives unchanged at 390px, it obeys the accent budget, and it reads as urgent because it looks like a product rather than a promotion.
3. **The trajectory is drawn, not listed.** `NOAA/NWS 2006–13 · World Bank 2014–16 · Johns Hopkins 2015–16` in tabular mono reads as a typo, because the overlap looks like an error. As four stacked 1px bars on a shared axis the overlap is visible and is the interesting part — a small piece of data graphics consistent with the hydrograph. Rendered from the `Positions` tab.
4. **No CTAs.** "View Publications" and "Contact Me" are nav items dressed as commerce.
5. **A field photograph with a place-and-date credit** says *this person does fieldwork* in one image. Virtually no academic site does it.

### 6.1b Home — 390px ▲ *(drawn, not implied)*

```
┌ 390px ──────────────────────────────┐
│ ISSUE 47 · 04 SEP 26 · a3f91c  11px │
│ SATISH REGONDA                      │
│ ASSOC PROF · CIVIL ENG & CLIMATE    │
│ CHANGE · IIT HYDERABAD              │
│ satishr@ce.iith.ac.in               │
│ 01 RESEARCH  02 PUBLICATIONS 03 TOOLS│
│ 04 RAFT  05 TEACHING  06 WRITING    │
│  ↑ two rows of three, no drawer,    │
│    no JS                            │
│═════════ 1px solid var(--ink) ══════│
│╔═ hydrograph, full bleed, 96px ════╗│
│║1908┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄║│
│║FLOOD──────────╱╲──────────────────║│ ← still the first thing.
│║STAGE ______╱─╯  ╲____             ║│   Axis labels drop to
│║MUSI · 13–15 OCT 2020 · PEAK {v}   ║│   two ticks; caption
│╚═══════════════════════════════════╝│   wraps to two lines.
│─── flood-stage line continues ──────│
│ STATUS · 04 SEP 2026                │
│ ACCEPTING PhD APPLICANTS FOR        │
│ JAN 2027 · CLOSES 15 NOV            │
│ → HOW TO APPLY                      │
│─────────────────────────────────────│  ← reachable in ZERO scrolls
│ [ 4:5 field photograph, full width ]│
│ Musi at Chaderghat, 14 Aug 2026.    │
│                                     │
│ For seven years I forecast rivers   │
│ across the continental United       │
│ States. Since February 2017…        │
│ 19px lead                           │
│ ┌ trajectory, 4 stacked bars ─────┐ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

▲ **The status line is above the photograph on mobile and below it on desktop.** On a phone it must be visible without a scroll; on a laptop the photograph and the lead do identity work in the same screen. This is the one place where the mobile order deliberately differs, and it is the correct trade for audience 1.

### 6.2 Home — below the fold

```
──────────────────────────── ~~ hydrograph divider, 7rem ~~ ────────────────
CURRENTLY                                          eyebrow, Piazzolla SC
Three sentences he can edit weekly.                measure 34rem
──────────────────────────────── hairline ──────────────────────────────────
NEWS                                                        All news →
2026-08 │ Vaishnavi B defended her thesis on UAV seepage detection.
2026-07 │ SnapFlood 2.0 ships: live community flood map, off-app alerts.
2026-06 │ New in Water Resources Research: consequence-specific urban flood
        │ risk mapping (Ponukumati*, Cheruvu† & Regonda).
  ↑ rail: 13px mono, tabular, right-aligned, --ink-mute. Rendered at 46rem.
──────────────────────────────── hairline ──────────────────────────────────
RESEARCH                                        ← 74rem, four numbered claims
                                                  NOT a 2×2 card grid
CLAIM 01 · HIGH CONFIDENCE · {n} PAPERS · REVISED 2026-03      [ figure  ]
Hyderabad's floods are a forecasting problem as much as a      [ thumb,   ]
drainage problem.                            21px lead         [ right    ]
                                                               [ rail     ]
──────────────────────────────── hairline ──────────────────────────────────
CLAIM 02 · HIGH CONFIDENCE · {n} PAPERS · REVISED 2026-01      [ figure ]
Ensemble forecasts for the Godavari and Narmada, 7–15 days out.
──────────────────────────────── hairline ──────────────────────────────────
CLAIM 03 · MEDIUM CONFIDENCE · {n} PAPERS · REVISED 2025-11    [ figure ]
Monsoon rainfall is changing shape over Indian cities.
──────────────────────────────── hairline ──────────────────────────────────
CLAIM 04 · HIGH CONFIDENCE · {n} PAPERS · REVISED 2026-05      [ figure ]
India's hydrologic record has a hole in it.
──────────────────────────────── hairline ──────────────────────────────────
SELECTED PUBLICATIONS                              All {n} publications →
  six entries in the rail format, at 46rem
──────────────────────────────── hairline ──────────────────────────────────
TOOLS                                              Things you can use →
┌── SnapFlood ────────────────┐  Hydro-EMOS · Extreme Climate Analysis
│ [phone screenshot]          │  (Serayu & Krishna) · Poverty Visualisation
│ Citizen flood reporting.    │  → three R/Shiny apps. First load is slow;
│ Google Play ↗               │    they sleep between visits.
└─────────────────────────────┘
──────────────────────────────── hairline ──────────────────────────────────
THE RAFT GROUP                                          Meet the group →
╔═ GROUP PHOTOGRAPH, FULL BLEED, UNCROPPED ════════════════════════════════╗
║  corridor, fluorescent tubes, everyone included                          ║
╚══════════════════════════════════════════════════════════════════════════╝
"RAFT, IIT Hyderabad, {date}. Back row, left to right: …"
One paragraph. {n_current} current students, {n_alumni} graduated.
╔═ FOOTER — the marginal collar, 74rem, 11px Martian Mono wdth 75 ═════════╗
║ ISSUING OFFICE  Room B-212, Dept of Civil Engineering, IIT Hyderabad,    ║
║                 Kandi 502284, Sangareddy, Telangana, India              ║
║ CONTACT         satishr@ce.iith.ac.in · +91 40 {confirmed}              ║
║ ELSEWHERE       Google Scholar ↗ · ORCID ↗ · ResearchGate ↗ ·           ║
║                 LinkedIn ↗ · IITH faculty page ↗                        ║
║ THIS SITE       About · Join · Press kit · News · CV · RSS · Colophon    ║
║ NEXT SCHEDULED UPDATE  0130 AND 1330 IST DAILY                          ║
║ ISSUE 47 · BUILD a3f91c · SET IN PIAZZOLLA AND MARTIAN MONO   ~glyph~    ║
╚══════════════════════════════════════════════════════════════════════════╝
```

**▲ Two rhythms, and one broken grid.** Prose runs at 34rem; publication rows, the news rail and the alumni table run at 46rem; the four claims run at 74rem; the hydrograph strip and the group photograph bleed to the viewport edge. The page visibly widens and narrows as its content changes register, instead of being a stack of equal bands separated by identical hairlines.

**▲ The 2×2 research grid is gone.** Revision 1 grep-banned `repeat(3, 1fr)` and then specified a four-cell feature grid, which is the same component with one more cell. Four numbered claims at lead size, each on its own hairline, each carrying a calibrated-confidence metadata line, with the figure thumbnail in the right rail.

### 6.3 `/publications/`

```
PUBLICATIONS                                              h1, 64px, 26rem measure

* PhD student  † M.Tech  ‡ B.Tech / intern  # postdoc — supervised in my
group. My name is set in bold.                  ← Piazzolla SC legend, once

All ({n}) · Urban flooding ({n}) · Forecasting ({n}) · Monsoon & climate ({n})
· Hydrologic data ({n}) · Other ({n})
  ↑ REAL LINKS to /publications/?theme=slug — server-rendered pages, not JS
    filters. Active chip carries a 2px accent underline. NOT pill buttons.
    Scholar's inclusion guidelines forbid JS/form-based navigation.
──────────────────────────────── hairline ──────────────────────────────────
 2026 │ ▌Web-messaging-based dissemination of urban rainfall and flood
      │  information: a Telegram bot framework          ▌= 2px accent rule
      │  Ponukumati, P.*, and **Regonda, S. K.**          (selected paper)
      │  npj Natural Hazards                           ← Piazzolla SC
      │  doi · pdf · code
      ├──────────────────────────────────────────────────────────────────
      │  Space-time variability of rainfall attributes across urban
      │  agglomerations of Peninsular India
      │  Saipriya, S. R.*, **Regonda, S. K.**, and Rajagopalan, B.
      │  Urban Climate 67, 102950
      │  doi · no open copy                            ← --mark, with words
──────────────────────────────── hairline ──────────────────────────────────
 2025 │ …
```

Year appears once per group in the rail, mono tabular, never repeated inside an entry. Links lowercase, middot-separated, 16px, `--ink-mute`, never buttons. Zero cards, zero shadows, zero thumbnails. A missing open copy prints **"no open copy"** in `--mark` — the absence is shown, not hidden.

**390px:** the rail narrows to 2.75rem and carries a tick plus the year in Martian Mono `wdth 75` at 11px. Entries stack at full width. The gauge axis survives.

**Ordering:** by `year` descending, then by `selected_order` where set, then by sheet row order. Stated in the README tab, because "presumably sheet order" is not a spec.

### 6.4 `/publications/<id>/` — a Scholar-legal paper page

```
← Publications
JOURNAL ARTICLE                                        11px mono, caps
Insights on Satellite-Based IMERG Precipitation Estimates at Multiple
Space and Time Scales for a Developing Urban Region in India
                                                       h1, 64px, 26rem
Ponukumati, P.*, Mohammed, A.*, and **Regonda, S. K.**
Journal of Hydrometeorology 24, 977–996 · 2023         ← Piazzolla SC venue
doi:10.1175/JHM-D-22-0160.1  ·  PDF  ·  Data
──────────────────────────────── hairline ──────────────────────────────────
ABSTRACT
Full author-written abstract, visible in the initial HTML. NEVER an
accordion, never a "read more", never JS-dependent.        measure 34rem
──────────────────────────────── hairline ──────────────────────────────────
▸ Cite this paper                          ← <details>, plain text + BibTeX
```

▲ **The figure block is cut.** Revision 1 ended this page with "[figure on a light plate]" while `Publications` had no `figure` field, and reproducing a published journal figure {n} times is a rights problem the document never raised.

**Non-negotiable constraints, from Google Scholar's inclusion guidelines:**

- **The PDF is a sibling file in the same directory**: `/publications/2023-imerg-hyderabad/paper.pdf`. Scholar requires `citation_pdf_url` to *"refer to a file in the same subdirectory as the HTML abstract."* A central `/pdfs/` folder silently breaks indexing.
- **The abstract is fully visible with no interaction.** ▲ Therefore `abstract` is **required for every non-excluded row** (revision 1 made it required only *if a PDF was set*, which is backwards). Phase 1 sources abstracts from OpenAlex `abstract_inverted_index` and Crossref, flags any whose licence is unclear, and asks him for blanket approval to reuse **his own submitted abstracts** — he is an author on all of them, which resolves most of it.
- **Fallback render for a paper with no abstract:** title, authors, venue, DOI, and a one-line `takeaway`, with a `--mark` line reading "abstract not reproduced here — read it at the publisher ↗". No empty ABSTRACT heading, no `noindex`.
- **Navigation is server-rendered HTML links.** This alone forces the sheets pipeline to be build-time.

**▲ Highwire meta for all six `type` values** (revision 1 specified only the journal case):

| `type` | Tags emitted, in addition to `citation_title`, `citation_author`, `citation_publication_date`, `citation_doi`, `citation_pdf_url` |
|---|---|
| `journal` | `citation_journal_title`, `citation_volume`, `citation_issue`, `citation_firstpage`, `citation_lastpage` |
| `chapter` | `citation_inbook_title`, `citation_publisher`, `citation_isbn`, `citation_firstpage`, `citation_lastpage` |
| `conference` | `citation_conference_title`, `citation_firstpage`, `citation_lastpage` |
| `preprint` | `citation_journal_title` = the server name (e.g. EarthArXiv), plus `citation_technical_report_number` if present |
| `report` | `citation_technical_report_institution`, `citation_technical_report_number` |
| `seminar` | **No Highwire tags at all**, and no `/publications/<id>/` page — seminars live in `Talks` |

```html
<meta name="citation_title" content="Insights on Satellite-Based IMERG…">
<meta name="citation_author" content="Ponukumati, Padmini">
<meta name="citation_author" content="Mohammed, Azharuddin">
<meta name="citation_author" content="Regonda, Satish Kumar">
<meta name="citation_publication_date" content="2023/6/1">
<meta name="citation_journal_title" content="Journal of Hydrometeorology">
<meta name="citation_volume" content="24">
<meta name="citation_firstpage" content="977">
<meta name="citation_lastpage" content="996">
<meta name="citation_doi" content="10.1175/JHM-D-22-0160.1">
<meta name="citation_pdf_url"
      content="https://satishregonda.in/publications/2023-imerg-hyderabad/paper.pdf">
```

Minimum three fields or Scholar ignores the block entirely; the build asserts it.

### 6.5 `/group/` — RAFT, one scroll

```
┌── sticky in-page rail (≥1100px, 7rem, ONE-WORD labels) ──┐
│ WHAT   THEMES   TOOLS   PEOPLE   ALUMNI   FUNDING   JOIN │
└──────────────────────────────────────────────────────────┘
   ▲ Revision 1 put "Projects & funding" and "SnapFlood & tools" in a 7rem
     rail at 16.5px, where they wrap to three lines and break the one
     geometry the site repeats. One rail width, one-word labels, 11px mono.

╔═ FIELD PHOTOGRAPH, FULL BLEED ═══════════════════════════════════════════╗
╚══════════════════════════════════════════════════════════════════════════╝
How much water will Indian cities and rivers see, and how soon can we tell
anyone?                                          ← a question, not a mission

We collect, model and forecast rainfall and runoff for Indian cities and
river basins, and turn it into information people can act on.

RAFT — Rainfall-runoff Analysis and Forecasting Tools.

──── group photograph, full bleed, dated caption ───────────────────────────
"RAFT, IIT Hyderabad, {date}. Back row, left to right: …"

PEOPLE                                              ← three densities
┌────┐ ┌────┐ ┌────┐ ┌────┐   PhD scholars: 4:5 square photo, name, cohort
│    │ │    │ │    │ │    │   year, one-line topic, co-supervisor (its own
└────┘ └────┘ └────┘ └────┘   column, not a parenthetical), Scholar link
{rendered from People where role=phd, status=current, ordered by `order`}

M.Tech   {name} · {start_year} · {topic}      ← compact text lines, no photos

ALUMNI — {n} theses since {min_year}. {placement_sentence}
 2026 │ Guniganti Surya Kiran · PhD, Civil Engineering
      │ A prototype ensemble hydrologic modeling and forecasting system for
      │ the Narmada River Basin
      │ → Now: Scientist-SD, NRSC Hyderabad                        [Govt]
 2026 │ Vaishnavi B · PhD (co-supervised) · UAV seepage detection
      │ placement not recorded            ← --mark, with the words
 2025 │ …                                   TABLE, no photos, gauge rail
```

**People are rendered from one collection, three views** — the people grid, the alumni table, and the trainee marks on `/publications/`. One row per person. This is the structural fix for the site's worst content bug: the RAFT page currently headlines two graduated PhDs as current scholars and omits seven current students.

**▲ Empty and partial states, specified** (§6.15): with fewer than five recorded placements the summary sentence is suppressed entirely; an alumnus with no `first_position` ends at the thesis title followed by `placement not recorded` in `--mark`, with no sector tag and no dangling "Now:".

### 6.6 `/research/` and the four theme pages

**`/research/`** (74rem): `h1` → 60-word framing → the four claims in the home-page format, each linking to its theme page → **Funded projects** table (title, funder, role, period, partners, status; from `Projects`) → **Past projects** table, including the `#krishna-serayu` row with the January 2020 FGD workshop date and the workshop report PDF → a `--mark` line for any project with no public output.

**Each theme page** (`bulletin-grid`): claim as `h1` at 64px with its calibrated-confidence line → own figure on a `--plate` → 3–4 paragraphs from `body_doc_url` with `<details>` sidenotes in the right rail → SnapFlood/UFIS callout where relevant → **related publications** (auto: all rows with this `theme`, in the rail format) → **people on it** (auto: `people_ids`) → **funders** (auto: `Projects` rows with this `theme`). Every block derives; nothing is retyped.

### 6.7 `/tools/` — "Things you can use" ▲ *(unspecified in revision 1)*

```
THINGS YOU CAN USE                                        h1, 64px
One standfirst sentence from Settings.tools_standfirst.   21px lead

──────────────────────────────── hairline ──────────────────────────────────
SNAPFLOOD                                   APP · LIVE · 100+ INSTALLS
[ phone screenshot, 4:5, on --plate ]   {blurb, 2 sentences}
                                        Google Play ↗ · Read more →
──────────────────────────────── hairline ──────────────────────────────────
UFIS · URBAN FLOOD INFORMATION SYSTEM       DASHBOARD · WITH GHMC
{blurb}                                     {live_url or --mark "not public"}
──────────────────────────────── hairline ──────────────────────────────────
SIXER TWEET                                 GUIDE · LIVE          #sixer-tweet
{blurb}  ▲ The guidelines, transcribed in Phase 1 from the image on the old
site, are reproduced here as real text. They exist nowhere else.
──────────────────────────────── hairline ──────────────────────────────────
HYDRO-EMOS · EXTREME CLIMATE ANALYSIS (SERAYU & KRISHNA) ·
POVERTY VISUALISATION                       R/SHINY · SLOW
Three apps on shinyapps.io. First load takes up to a minute; they sleep
between visits.                     ← honest status, from Tools.status
```

Every card: `name`, `kind`, `status`, `audience`, `blurb`, `live_url`, `code_url`, `paper_id` (links to the paper page), `funders`. Never iframed. A `status: archived` tool keeps its card with the word ARCHIVED and no live link.

### 6.8 `/tools/snapflood/` ▲ *(unspecified in revision 1; the flagship for audience 4)*

```
← Things you can use
SNAPFLOOD                                                 h1, 64px
Citizen flood reporting for any city.                     21px lead
Google Play ↗ · {n} installs · Free · Telugu and English
FOR JOURNALISTS: press kit →           ← 13px mono, directly under the
                                          masthead contact line
──────────────────────────────── hairline ──────────────────────────────────
WHAT IT DOES        {body_doc_url}, 3–4 paragraphs, sidenotes in the rail
──────────────────────────────── hairline ──────────────────────────────────
HOW IT FITS TOGETHER
[ UFIS system diagram, on --plate, 46rem ]
Numbered text description of the same pipeline, immediately below the
diagram: 1. a citizen photographs a flooded street … 5. GHMC sees it on the
UFIS dashboard.   ← the diagram is never the only carrier of the content
──────────────────────────────── hairline ──────────────────────────────────
HOW TO CONTRIBUTE   {contribute_doc}, plus the Play Store badge again
──────────────────────────────── hairline ──────────────────────────────────
╔═ THE ARCHIVE, FULL BLEED ════════════════════════════════════════════════╗
║ [tile][tile][tile][tile][tile][tile][tile][tile][tile][tile][tile][tile] ║
║ Real citizen submissions, used with permission, each stamped beneath in  ║
║ 11px mono: 2020-10-14 18:22 · 17.3850, 78.4867                           ║
╚══════════════════════════════════════════════════════════════════════════╝
Ugly phone photographs of flooded streets are the visual language of this
work, and the archive whose absence is the argument on /research/.
──────────────────────────────── hairline ──────────────────────────────────
FUNDERS   DST-SPLICE Climate Change Programme · National Network Programme
on Urban Climate (NUC) under NMSKCC · GoI AI CoE for Sustainable Cities
PRESS     three 2023 articles from the Press tab
CONTACT   satishr@ce.iith.ac.in
```

**▲ The UFIS diagram has an owner.** It exists nowhere: not in `Tools`, not in `Photos`, not in the shot list, not on the "from him" list. **Decision:** we draw it, in Phase 2, as inline SVG in the site's own type and palette, from his published system description; the source figure and a factual check are on his Phase 1 list; **0.5 day is added to Phase 2**. If he cannot supply the source description in time, the page ships with the numbered text description and the screenshot, and the diagram lands in a later publish. Fields added to `Tools`: `diagram`, `diagram_alt`, `body_doc_url`, `contribute_doc`.

### 6.9 `/teaching/` and `/teaching/<code>/`

`/teaching/`: `h1` → teaching statement (150 words, from a Doc) → **Currently teaching** (code, title, level, semester, enrolment) → **Previously taught** (compact rail list by year) → supervision philosophy. Course codes are mandatory; a bare title with no CE-prefixed code, no UG/PG label and no year reads as a placeholder and is useless to the student it exists for.

`/teaching/<code>/` is built **only when `page` is ticked and `outline` is non-empty** — revision 1 specified four blocks against a tab that held one of them. Blocks: syllabus PDF → topic outline (`outline`) → reading list (`readings`) → public notebooks (`notebooks_url`). Fields added in §7.7.

### 6.10 `/writing/` and `/writing/<slug>/`

`/writing/`: standfirst → the four kind-labels explained (Explainer / Comment / Field note / For students) → entries in the rail format (`kind · title · dek · date`) → "Elsewhere" links (his writing on other sites, from the `Press` tab with `kind: byline`).

`/writing/<slug>/`: kind label → title at 64px → dek → `Satish Regonda · 14 March 2026 · {n} words` in mono → body with `<details>` sidenotes → references → related posts.

**▲ At zero published posts the route does not exist.** `BLOG_ENABLED` derives from the post count: nav item 06 is not emitted, `/writing/` is not built, `/feed.xml` is not built, and the sitemap omits both. This is the honest answer to Open Q11 and it needs no decision from him — if he writes, the section appears.

**▲ Withdrawn posts:** setting `Status: retired` removes the post from the index, the feed and the sitemap, and the URL serves **410 Gone** with one sentence and a link to `/writing/`. Feed readers and inbound links get a truthful answer instead of a 404 or a silent disappearance.

### 6.11 `/join/`

```
PROSPECTIVE STUDENTS AND POSTDOCS                                   h1, 64px

STATUS · 04 SEP 2026 · ACCEPTING PhD STUDENTS FOR THE JANUARY 2027 INTAKE ·
APPLY THROUGH THE IIT HYDERABAD ADMISSIONS PORTAL BY 15 NOVEMBER 2026
  ↑ same wire-service component as the home page. Rules top and bottom.
    NO FILL. Carries "Status as of {date}" from day one.

WHO FITS · quantitative background, comfort with data, one of: hydrology /
meteorology / statistics / scientific computing.

BEFORE YOU WRITE
Read one of my papers. Name it in your email, and tell me one question it
raised for you. This is the whole filter.

YOUR EMAIL
   To:      satishr@ce.iith.ac.in
   Subject: Looking for an Opportunity
   ↑ rendered as a mailto: link with ?subject= pre-filled, plus the plain
     text in a <code> block. NO copy button — zero JS on this site.
Include: your research interests · your background and skills · why this
group · what you hope to learn and contribute.       ← HIS OWN WORDS, kept

FUNDING ROUTES  PMRF · CSIR/UGC-NET JRF · DST INSPIRE · SERB N-PDF ·
institute TA-ships · Fulbright-Nehru · Newton-Bhabha    (one line each)

WHAT I CAN'T DO  Review CVs for programmes I'm not involved in; write
letters for people I haven't taught or supervised.
```

**▲ The status block self-degrades.** A nag email is the weakest possible mechanism, and a dated notice still reading "apply by 15 November" in March tells the largest audience that nobody maintains this site. Past `recruiting_deadline`, the build **automatically** swaps to a permanently-true line: `ADMISSIONS RUN THROUGH THE IIT HYDERABAD PORTAL · WRITE TO ME IF YOU ARE INTERESTED → HOW TO APPLY`. The reminder email (§8.5) is a secondary prompt. The page can never state something false through inaction.

### 6.12 `/about/` and `/about/cv/`

`/about/`: long bio (`bio_full` Doc) → **Education** (`Positions` where `kind=education`) → **Appointments** (`kind=appointment`, rendered as the trajectory timeline plus a dated list) → **Service** (`Service` tab; suppressed at zero rows) → **Selected talks** (last five from `Talks`, with "all talks on the CV") → **Awards** (`Awards`; suppressed at zero rows) → profile links → contact block.

▲ `Talks` and `Awards` were edited and displayed nowhere in revision 1 — he would have typed into two tabs and seen nothing change, which is exactly the failure §9 is designed to prevent. They now have a surface. The `Manual` tab is **cut**; its four categories duplicated `Talks`, `Tools` and `Publications`.

`/about/cv/`: full CV in HTML, generated from `Settings`, `Positions`, `Service`, `Publications`, `Projects`, `People`, `Teaching`, `Talks`, `Awards`. **▲ No PDF generator.** WeasyPrint (a Python toolchain inside a JS build) is cut; the page carries a print stylesheet that is a Phase 2 deliverable and is **printed on A4 and read** before launch, with one line at the top: `Print this page (⌘P / Ctrl+P) for a dated A4 PDF.` `/cv.pdf` 301s here. Two hand-maintained CVs always drift; one source, two renderings, one fewer bespoke build step.

### 6.13 `/news/`, `/press/`, `/colophon/`

`/news/`: continuous reverse-chronological rail, no year headers, `pinned` items first.

`/press/`: 25-word bio → 60-word bio → three portraits with download links and photographer credits → contact → **▲ three things he has actually said, quoted verbatim from the 2023 NewsMeter / Hans India / Deccan Chronicle pieces, each with outlet and date** → past coverage table. Revision 1 offered "3 quotable lines" pre-written for journalists, which is the most press-release element in a document whose §2 forbids sounding like a press release. A journalist wants a sourced prior quote more than a fresh canned one, and it costs no writing. Field: `Press.quote` + `Press.quote_context`.

`/colophon/`: §4.4 item 12, plus the `#privacy` block (§7.6).

### 6.14 `/404` ▲ *(listed as "generated" in revision 1, with no content at all)*

```
ISSUE 47 · 04 SEP 2026
════════════════════════ 1px solid var(--ink) ══════════════════════════════
NO PAGE ISSUED AT THIS LOCATION                        h1, 64px

The address you followed does not exist on this site. It may have moved
when this site replaced the old Google Site in {month year}.
──────────────────────────────── hairline ──────────────────────────────────
01 RESEARCH  →  the four claims and the projects behind them
02 PUBLICATIONS  →  all {n}, with DOIs
03 TOOLS  →  SnapFlood, UFIS, and three R/Shiny apps
04 RAFT  →  the group, the students, the alumni
05 TEACHING · 06 WRITING · JOIN · PRESS KIT · ABOUT
```

### 6.15 **▲ Empty and partial states** — new section, specified per case

| Case | Render |
|---|---|
| Blog with 0 published posts | Nav item 06 not emitted; `/writing/` not built; `/feed.xml` not built; sitemap omits both; footer RSS link hidden |
| Alumnus with no `first_position` | Row ends at the thesis title, followed by `placement not recorded` in `--mark`. No "Now:" fragment, no sector tag |
| Fewer than 5 recorded placements | The alumni summary sentence is suppressed entirely. At ≥5 it renders as "{n} of {total} are at {orgs}" |
| `recruiting_deadline` blank | The status line renders the status sentence alone, with no "closes" clause |
| `recruiting_deadline` past | Auto-swap to the permanently-true admissions line (§6.11) |
| Person with no `sector` | No sector tag; nothing else changes |
| Person with no `photo` | Typographic initials tile on `--plate` with a 1px `--rule` border. Never a grey silhouette |
| Paper with no `abstract` | §6.4 fallback: metadata, `takeaway`, and a `--mark` line pointing at the publisher |
| Paper with no self-hostable PDF | `no open copy` in `--mark` in the links row |
| Tool with `status: archived` | Card retained, word ARCHIVED in mono, no live link |
| Tool that is down (Shiny sleeping) | `status: slow` prints the honest note; we never health-check at build |
| `Awards` or `Service` with 0 rows | The whole section, including its heading, is not emitted |
| Project with no public output | `no public data` in `--mark` in the project row |
| `Photos` row missing `alt` or `credit` | The row is skipped with a warning; the photograph does not publish. On purpose |
| `RAFT_SITE_URL` empty | Nothing renders. No placeholder, no "coming soon" |

---

## 7. Content model

**One Google Workbook**, `satishregonda.in — Content`, shared **read-only** with a service account. **One Drive tree** for images and prose Docs, **owned by his IITH account**. Row 1 frozen and protected warning-only (never locked — he must be able to fix his own sheet if we vanish), a `README` tab first, and a filled example row 2 skipped by a leading `#` **in the first column only**.

**▲ The canonical tab list, which is also the `batchGet` range list — eighteen tabs.** Revision 1 said "14 tabs" against a §7 describing roughly sixteen.

*He edits (15):* `Settings` · `Positions` · `Service` · `Research` · `Publications` · `Projects` · `People` · `Teaching` · `News` · `Talks` · `Awards` · `Press` · `Tools` · `Photos` · `Inbox`
*Reference and machine (3):* `README` · `_Publish Log` · `_Alumni Replies`

### 7.1 `Settings` — **▲ a two-column key/value tab**, not one horizontal row

Revision 1 stored the most frequently edited values as one row under a header row: the layout most vulnerable to exactly what a non-technical user does (insert a row above, sort, add a column), any of which shifts every value one cell and silently publishes the department name into the email field. Key/value is immune to row order, column insertion and sorting, and it reads on a phone without scrolling right past twenty columns.

**The first six rows, deliberately, are the ones he edits most:**

| key | value | Req | Validation |
|---|---|---|---|
| `recruiting_status` | `Accepting PhD students for the January 2027 intake.` | ✓ | ≤160 chars |
| `recruiting_deadline` | `2026-11-15` | — | ISO date |
| `recruiting_review_by` | `2026-12-01` | ✓ | ISO; warns when past |
| `currently` | three sentences | ✓ | ≤600 chars |
| `site_state` | `normal` | ✓ | enum `normal / watch / event` |
| `site_state_line` | one sentence | ✓ if state ≠ normal | ≤200 chars |
| `site_state_until` | `2026-10-15T18:00` | ✓ if state ≠ normal | ISO datetime, ≤96h ahead |
| `publish_now` | ☐ | — | checkbox; the mobile publish trigger (§8.2) |

**The rest:**

`name` · `name_full` · `name_citation_forms` (`;`-separated: `Regonda, S. K.; Regonda, S.; S. K. Regonda`) · `title` · `departments` · `institution` · `office` · `address` · `email` · `phone` (**§12.3**) · `scholar_url` · `orcid_url` · `researchgate_url` · `linkedin_url` · `iith_url` · `bio_short_25` · `bio_short_60` · `tools_standfirst` · `raft_site_url` (blank = link hidden) · `hydrograph_caption` · `hydrograph_source`

**▲ Deleted:** `scholar_citations` / `scholar_h` / `scholar_i10`. They were defined here while §12 recommended never displaying them — a field that exists to be unused is a field someone will fill in.

### 7.2 Prose — Google Docs, not sheet cells

| Key | Doc | Rendered at |
|---|---|---|
| `bio_home` | `Drive/Website/Docs/bio-home` | `/` positioning paragraphs |
| `bio_full` | `Drive/Website/Docs/bio-full` | `/about/` |
| `join_page` | `Drive/Website/Docs/join` | `/join/` |
| `teaching_statement` | `Drive/Website/Docs/teaching` | `/teaching/` |
| `raft_mission` | `Drive/Website/Docs/raft-mission` | `/group/` |
| `colophon` | `Drive/Website/Docs/colophon` | `/colophon/` |
| `snapflood_body` / `snapflood_contribute` | `Drive/Website/Docs/…` | `/tools/snapflood/` |
| per-theme bodies | `Drive/Website/Docs/theme-<slug>` | the four theme pages |

**Rule:** under ~500 characters → a `Settings` cell. Above → a Doc. Sheet cells carry no headings, no links and no paragraph structure.

**▲ The allowed Doc vocabulary is defined and enforced** (§8.5): headings, bold, italic, links, lists, blockquote, images with an italic caption line and an italic `Alt:` line, and — for blog posts — the settings table. Anything else (tables, columns, footnotes, drawings, smart chips) causes the build to **refuse that one document with a named, friendly message** rather than parse and hope. Under skip-and-warn, that costs him one page, never the site.

### 7.3 `Positions` and `Service` ▲ *(both missing entirely from revision 1)*

The home trajectory strip, `/about/`'s education/appointments/service blocks and the generated CV all rendered records that no tab held. The editorial spine of the whole site had no place it was edited.

**`Positions`** — `kind`✓ (enum `appointment / education / visiting`) · `org`✓ · `role`✓ · `city` · `start`✓ (year or ISO) · `end` (blank = current) · `note` · `order`✓
Renders three ways: the home trajectory timeline (`kind=appointment`, top 4 by `order`), `/about/` education + appointments, and the CV.

**`Service`** — `kind`✓ (enum `editorial / review / committee / membership`) · `body`✓ · `role`✓ · `start`✓ · `end` · `note`
Renders on `/about/` and the CV. Suppressed at zero rows.

### 7.4 `Research`

| Field | Type | Req | Validation | Example |
|---|---|---|---|---|
| `slug` | slug | ✓ | `^[a-z0-9-]{3,50}$`, unique, frozen | `urban-flooding-hyderabad` |
| `claim` | text | ✓ | ≤90 chars, must contain a verb | `Hyderabad's floods are a forecasting problem as much as a drainage problem` |
| `confidence` | enum | ✓ | AR6: `virtually certain / very likely / likely / high confidence / medium confidence / low confidence` | `high confidence` |
| `revised` | date | ✓ | ISO | `2026-03-01` |
| `summary` | text | ✓ | ≤240 chars | two sentences |
| `body_doc_url` | url | ✓ | Drive Doc | … |
| `figure` | drive | ✓ | file in `/Website/Images/` | … |
| `figure_alt` | text | ✓ | ≤125 chars | `Map of Hyderabad showing modelled inundation depth for the October 2020 event.` |
| `figure_caption` | text | ✓ | — | the finding, in a sentence |
| `people_ids` | list | — | must resolve in `People` — ✅/❌ formula | `saipriya-sr; lagnajeet` |
| `order` | int | ✓ | 1–99 | `1` |

### 7.5 `Publications` (seeded from OpenAlex, curated by hand)

| Field | Type | Req | Validation | Example |
|---|---|---|---|---|
| `id` | slug | ✓ | unique, **frozen** (§8.5 tombstone rule) | `2023-imerg-hyderabad` |
| `type` | enum | ✓ | `journal / chapter / conference / preprint / report / seminar` | `journal` |
| `year` | int | ✓ | 1990–2100 | `2023` |
| `date` | date | — | ISO | `2023-06-01` |
| `title` | text | ✓ | non-empty | `Insights on Satellite-Based IMERG…` |
| `authors` | text | ✓ | `;`-separated, in citation order | `Ponukumati, P.; Mohammed, A.; Regonda, S. K.` |
| `venue` | text | ✓ | — | `Journal of Hydrometeorology` |
| `volume` / `issue` / `pages` | text | — | — | `24` / `` / `977–996` |
| `doi` | text | — | `^10\.\d{4,9}/\S+$`, **no trailing period** | `10.1175/JHM-D-22-0160.1` |
| `url` | url | — | https:// | — |
| `pdf` | drive | — | licence-checked (§12.6) | — |
| `data_url` / `code_url` | url | — | prefer a Zenodo DOI over a bare GitHub URL | — |
| `abstract` | long text | **✓** | required unless `exclude` (§6.4) | — |
| `theme` | enum | — | ▲ optional; must match a `Research.slug` when set | `urban-flooding-hyderabad` |
| `selected` | bool | ✓ | checkbox, **max 6** | ☑ |
| `selected_order` | int | — | 1–6; blank falls back to year | `2` |
| `takeaway` | text | — | required when `selected` | one plain-English line |
| `note` | text | — | — | — |
| `exclude` | bool | — | checkbox — **use this, never delete a row** | ☐ |

**▲ `author_marks` is deleted.** Revision 1 defined it as hand-typed positional pairs (`0:phd; 1:phd`) while §9 promised marking was automatic — the two sections contradicted each other, and positional indices silently reattach to the wrong person whenever an author is added, removed or reordered, including by an import. Marking a senior co-PI as a PhD student is a professional insult, invisible in a diff, and the exact defect that gets a feature abandoned. Replaced by **alias matching** (§7.6), which is deterministic and makes §9's promise true.

**`selected` at 7+**: the build **fails that row** with a named error and publishes the rest — it never silently truncates. A live count in the header cell (`Selected: 6 / 6`) turns red past six, so it fails in the sheet first.

**Corrections to apply during migration — do not port the errors forward:**

| Current | Fix |
|---|---|
| `https://doi.org/10.1175/JHM-D-22-0160.1.` | drop the trailing period (404 → 200) |
| `https://authors.elsevier.com/c/1ebIn7s~EVp4te` (HTTP 400, expired) | replace with `10.1016/j.uclim.2022.101118` |
| `10.1061/(ASCE).WR.1943-5452.0001406` | `10.1061/(ASCE)WR.1943-5452.0001406` |
| Brown et al. 2014 Parts 1 and 2 share `…05.030` | Part 1 = `10.1016/j.jhydrol.2014.05.028`, Part 2 = `…05.030`. *Two agents disagreed; page numbers (2869–2889 vs 2847–2868) and OpenAlex citation counts support this assignment.* **Verify against Crossref before publishing — a Phase 1 checkbox, not a footnote.** |
| `Demargne et al.` (hides his own position) | full author list |
| Missing DOIs on pre-2011 papers | add from Crossref |
| "In Referred Journals" | "Refereed journal articles" |

### 7.6 `People` — one tab, three views, and the source of every trainee mark

| Field | Type | Req | Validation | Example |
|---|---|---|---|---|
| `id` | slug | ✓ | unique, frozen | `saipriya-sr` |
| `name` | text | ✓ | display form | `Saipriya S. R.` |
| **`aliases`** ▲ | text | ✓ | `;`-separated **citation forms** | `Saipriya, S. R.; S. R. Saipriya; Saipriya SR` |
| `role` | enum | ✓ | `phd / mtech / btech / postdoc / staff / intern / visitor` | `phd` |
| `status` | enum | ✓ | `current / alumni` | `current` |
| `programme` | text | — | — | `PhD, Civil Engineering` |
| `start_year` | int | ✓ | — | `2021` |
| `end_year` | int | req if alumni | — | — |
| `viva_date` | date | — | ISO | `2026-02-14` |
| `topic` | text | ✓ if current | ≤140 chars | `Urban hydroclimatology and flood modelling for Hyderabad` |
| `thesis_title` | text | req if alumni | — | — |
| `co_supervisor` | text | — | **its own column, not a parenthetical** | `Dr. Aalok Khandekar` |
| `department` | text | — | — | `Climate Change` |
| `first_position` | text | — | **never goes stale** | `Scientist-SD, NRSC Hyderabad` |
| `first_position_year` | int | — | — | `2024` |
| `sector` | enum | — | `academia / government / industry / other` | `government` |
| `photo` | drive | — | **chosen from a picker, not pasted** (§8.5) | — |
| **`consent`** ▲ | bool | ✓ if `photo` or `email_public` | checkbox | ☑ |
| `interest` | text | — | two words, non-research | `Carnatic music` |
| `email` · `email_public`☑ · `scholar` · `website` | — | — | ▲ email renders **only** if `email_public` | — |
| `order` | int | ✓ | — | `10` |

**▲ `current_position` is deleted.** Keeping both `first_position` and `current_position` is exactly the two-sources-that-drift problem the brief argues against for CVs, and it obliges him to re-survey alumni forever.

**▲ How trainee marks are derived** (replacing `author_marks`):

1. Normalise every author string and every `name`/`aliases` entry: NFKD, strip diacritics, collapse whitespace and punctuation, lowercase.
2. **Exact match only.** A publication author matching a `People` alias is marked with that person's `role`, chosen by the paper's `year` against `[start_year, end_year or ∞]`. A paper published after `end_year` gets **no mark** — they were alumni by then.
3. His own name is matched against `Settings.name_citation_forms` and set at weight 600 in `--ink`.
4. **Nothing is ever guessed.** An unmatched author string within Levenshtein distance 2 of a `People` alias prints a warning in the publish log: `⚠️ 'Mohammed, A.' looks like a group member but is not in People — add it to that person's aliases if so.` The mapping self-corrects, and adding a student retroactively marks every paper they co-authored, which is what §9 promises.

**Add immediately:** Akansha Maity — PhD, Dept. of Climate Change, 2023 cohort, co-supervisor Dr. Shruti Upadhyaya, "Bias correction of rainfall forecasts using AI/ML" (verified on `cc.iith.ac.in/students.html`, absent from his own site).

**▲ Consent and privacy** (absent from revision 1, which carefully flagged two unlicensed press photographs while publishing named students with photographs and email addresses):

- A photograph renders only when `consent` is ticked. A student's email renders only when `email_public` is ticked; the default contact is a Scholar or website link.
- **Removal on request:** clear that row's `photo` and `email`, press Publish now. Alumni keep their thesis line. One sentence in the runbook and one in the README tab.
- `/colophon/#privacy`, ~120 words: no cookies, no analytics beacon, no forms, no personal data collected from visitors, what is published about group members and how to have it removed. True under the fixes above, and it discharges the DPDP notice obligation in one paragraph — which matters, because revision 1 cited DPDP three times as a reason to reject other tools while shipping no notice of its own.

**Cross-tab integrity**, since Sheets has none:

```
=IF(ISBLANK(F3),,IF(ISNA(FILTER(People!$A:$A,People!$A:$A=F3)),"❌ no such person","✅"))
=IF(COUNTIF($A:$A,$A3)>1,"❌ duplicate id","")           ← on every id/slug column
=IF(OR(ISBLANK($D3),ISBLANK($G3)),"⚠️ incomplete","")    ← the Status column, §8.3
```

A red ❌ appears the instant he mistypes a student's name or duplicates an id — in the sheet, before any build runs. Client-side validation beats build-time validation for a non-technical editor every time.

### 7.7 `Projects`, `Teaching`, `News`, `Talks`, `Awards`, `Press`, `Tools`, `Photos`, `Inbox`, Blog

| Collection | Fields |
|---|---|
| **Projects** | `slug`✓ · `title`✓ · `funder`✓ · `role`✓ (`PI/Co-PI/Collaborator`) · `start_year`✓ · `end_year` (blank = ongoing) · `status`✓ (`ongoing/completed`) · `partners` · `summary`✓ · `theme` · `url` · `report_pdf` · `public_output`☑ (unticked → `no public data` in `--mark`) |
| **Teaching** | `code`✓ · `title`✓ · `level`✓ (`btech/mtech/phd`) · `semesters`✓ (`Aug 2024; Jan 2023`) · `enrolment` · `description`✓ · `tools` · `syllabus_url` · ▲`outline` (long text) · ▲`readings` (long text) · ▲`notebooks_url` · `page`☑ · `status`✓ (`current/past`) |
| **News** | `date`✓ (ISO) · `text`✓ (≤200 chars) · `link_url` · `link_label` · `pinned`☑ |
| **Talks** | `date`✓ · `title`✓ · `kind`✓ (`invited/keynote/plenary/conference/training`) · `host`✓ · `city`✓ · `slides_url` · `video_url` — renders on `/about/` (last 5) and the CV (all) |
| **Awards** | `year`✓ · `award`✓ · `body`✓ · `note` — renders on `/about/` and the CV; **section suppressed at zero rows** |
| **Press** | `date`✓ · `outlet`✓ · `headline`✓ · `url`✓ · `lang` (`en/te/hi`) · `kind`✓ (`coverage/byline`) · ▲`quote` · ▲`quote_context` |
| **Tools** | `slug`✓ · `name`✓ · `kind`✓ (`app/dashboard/guide/dataset/code`) · `audience`✓ · `blurb`✓ · `live_url` · `code_url` · `status`✓ (`live/slow/archived`) · `screenshot` · ▲`body_doc_url` · ▲`contribute_doc` · ▲`diagram` · ▲`diagram_alt` · `paper_id` · `funders` |
| **Photos** | `file`✓ (chosen from the picker) · `alt`✓ **required** · `caption` · `credit`✓ (`Photo: Name / RAFT, IIT Hyderabad`) · `place` · `date` · `usage` (`hero/group/field/portrait/archive`) · `consent`☑ (required for `archive` — SnapFlood submissions) |
| ▲ **Inbox** | Written by the weekly OpenAlex job, read by nobody but him: `found_on` · `doi` · `year` · `title` · `source_url` · `done`☑ |
| **Blog** | `Drive/Website/Blog/` — one Doc per post, with a 2-column settings table as the first element: `Title`✓ · `Dek`✓ · `Kind`✓ · **`Slug`✓ (frozen after publishing)** · `Date` · `Tags` · ▲**`Status`✓ (`draft/published/retired`)** |
| **CV** | Generated. No separate source, no separate PDF pipeline (§6.12) |

**▲ Blog publishing is a cell, not a folder.** Revision 1 made publishing "drag the Doc into `Published/`", which does not work well in the Drive mobile app, breaks if a Doc lives in two folders or is reached via a shortcut, and left "how do I fix a typo in a published post" undefined. `Status` lives in the settings table inside the document he is already editing — one place, visible, any device, no dragging.

**▲ Blog image alt text has a source.** The Docs export carries no alt attribute. Each image must be followed by two italic lines: the caption, and a line beginning `Alt:`. The build validates both and refuses the post by name if either is missing, exactly as a missing `Photos.alt` is refused.

**▲ Cut:** the `Manual` tab (four categories duplicating `Talks`, `Tools` and `Publications`, rendering nowhere).

---

## 8. Technical architecture

### 8.1 The stack — **▲ nine parts, down from about thirty**

Revision 1 named roughly thirty components, six of them bespoke code with no upstream maintainer: a custom Sheets loader, a Docs markdown unescape pass, a zip/HTML sanitiser behind a flag, WeasyPrint inside a JS build, Satori/resvg OG generation, and fontTools subsetting in CI. Every one breaks silently and can be fixed by nobody but its author, and the parts that get cut when a schedule slips are always the robustness parts.

**The v1 stack, in full:** Cloudflare Pages + Cloudflare DNS · one **public** GitHub repo · one Google Sheet · one Drive Docs/Images tree · one read-only service account · one Apps Script trigger · Astro · content committed as Markdown-with-frontmatter · three static OG images.

| Layer | **Decision** | Runner-up | Why the runner-up lost |
|---|---|---|---|
| Framework | **Astro 7.x** (pin 7.3.x) | Eleventy 3.1.6 | Astro's Content Layer custom loader gives Zod-validated typed collections in ~60 lines plus build-time `<Picture>` with sharp; Eleventy needs both hand-rolled. Next.js is disqualified: `output:'export'` forbids `redirects` and `headers`, and forces a paid image CDN |
| Hosting | ▲ **Cloudflare Pages** (`wrangler pages deploy dist`) | Workers static assets | Revision 1 said "Workers, static assets" and then gave the Pages deploy command, and named no mechanism for `_headers` or `_redirects`. Pages reads both files natively, has the same 22 Indian PoPs including **Hyderabad**, unlimited static requests, and 500 free builds/month. Workers assets is the documented migration path if Pages is ever deprecated. **Vercel Hobby is legally out** — its terms define commercial usage as *"financial gain of anyone involved in any part of the production… including a paid employee or consultant writing the code."* |
| DNS | **Cloudflare nameservers** | External DNS | Free Universal SSL, free apex CNAME flattening, free Email Routing, free Redirect Rules. Registration stays where it is — moving NS ≠ moving the registrar |
| CMS | **Google Sheets + Docs + Drive, build-time** | Sveltia CMS | He is fluent in Sheets and Docs. Every alternative asks a professor to learn a new tool for a task he does twice a month — the exact frequency at which unfamiliar tools get abandoned. Notion is out: image URLs are signed S3 links that expire in **one hour** |
| Fallback CMS | ▲ **None — one runbook page** | Sveltia at `/admin` | Sveltia needs him to hold a GitHub fine-grained PAT in his password manager, which he will not. The committed Markdown already delivers the longevity guarantee: *"if Google is gone, clone the repo and edit the Markdown in GitHub's web editor."* Same capability, zero config, zero PAT, one fewer part |
| Search | ▲ **None** | Pagefind | {n} publications with real filter URLs plus Ctrl-F covers it. Pagefind had no route, no UI and no budget line in revision 1, and its runtime plus wasm exceeds the entire JS budget before an index chunk loads |
| Analytics | ▲ **Cloudflare zone analytics only, no page code** | CF Web Analytics beacon | The beacon loads from `static.cloudflareinsights.com`, which the site's own CSP blocks and its own zero-third-party budget forbids. Three parts of revision 1 contradicted each other. Zone analytics needs no script, no cookie, no consent notice |
| Publication sync | ▲ **OpenAlex → the `Inbox` tab** | A GitHub PR | OpenAlex returns 55 works for one ORCID call for $0.0001, but its ORCID filter resolves to its own author *entity*, so it inherits its disambiguation errors. A professor with no GitHub habit will not review an author-string diff in two years — he will merge it or ignore it. The bot writes only `doi`, `year`, `title`, `source_url` into a sheet tab; **he types the author list himself, once, in the form he wants it cited** |
| Math | ▲ **None** | MathML / KaTeX | Nothing in the sitemap has math. A formula in a blog post is an image with alt text |
| Contact | **`mailto:` to `satishr@ce.iith.ac.in`** | A form; an Email Routing alias | His address is already public on the IITH directory, so a form protects nothing while adding a spam vector and a DPDP obligation. ▲ And **forwarded** mail regularly fails SPF/DKIM alignment: if a vanity alias were the address on the press page and IITH quarantined it, journalist enquiries during a flood would vanish with no bounce. The IITH address is published directly; Email Routing is optional vanity only, with a Phase 6 delivery test |
| JavaScript | ▲ **Zero bytes, site-wide** | — | Sidenotes are `<details>`; filters are URLs; the nav wraps; there is no theme toggle, no drawer, no copy button, no search. `script-src 'none'` in the CSP, and it is a rubric item |

### 8.2 Data flow

```
┌─ EDITING SURFACE (his) ────────────────────────────────────────────────┐
│  Google Sheet  "satishregonda.in — Content"   (18 tabs)                │
│  Google Docs   /Website/Docs/*  and  /Website/Blog/*                   │
│  Google Drive  /Website/Images/                                        │
│  ALL OWNED BY HIS IITH ACCOUNT                                         │
└───────────────┬────────────────────────────────────────────────────────┘
                │ ① TRIGGER
                │   (a) ▲ tick Settings!publish_now — an INSTALLABLE onEdit
                │       trigger, which DOES fire from the Sheets mobile app.
                │       It unticks the box, pre-flights Drive refs, dispatches.
                │   (b) desktop menu 🌐 Website → 🚀 Publish now (same function)
                │   (c) cron 0130 + 1330 IST (hourly while site_state ≠ normal)
                │   (d) workflow_dispatch
                │   ▲ LockService + a 3-minute check on _Publish Log: a second
                │     press inside 3 min toasts "A publish is already running —
                │     your changes are included in it" and does NOT dispatch.
                ▼
┌─ BUILD (GitHub Actions, public repo, unlimited minutes) ───────────────┐
│  ② FETCH  sheets.spreadsheets.values.batchGet — ONE call, 18 ranges    │
│           auth: SERVICE ACCOUNT (JWT), scope spreadsheets.readonly     │
│           valueRenderOption=UNFORMATTED_VALUE                          │
│           dateTimeRenderOption=FORMATTED_STRING                        │
│           + drive.files.export per Doc (text/markdown, unescape pass)  │
│                                                                        │
│  ③ VALIDATE ▲ TWO CLASSES, not all-or-nothing:                        │
│     FATAL  → build stops, site unchanged: a missing tab, a missing     │
│              header column, an unreadable Settings tab                 │
│     SKIP   → warn and publish the rest: any bad ROW in Publications,   │
│              People, News, Photos, Tools, Talks, Awards, Press,        │
│              Projects, Teaching, Positions, Service; any bad Doc       │
│     assertHeaders() runs FIRST. All failures collected in one pass.    │
│     ▲ Row numbers: filter AFTER indexing; every record carries         │
│       _row = index + 2, and a unit test asserts that a bad value in    │
│       sheet row 12 reports "row 12" with the example row present.      │
│                                                                        │
│  ④ IMAGES drive.files.get(fields=modifiedTime,md5Checksum)             │
│           cache key = sha256(fileId + modifiedTime)                    │
│           ▲ ORIGINALS are committed (one file each, the record).       │
│             Derivatives (AVIF/WebP/JPEG at 400/800/1600, content-      │
│             hashed) are BUILD OUTPUT, cached, never committed — so     │
│             the repo cannot grow monotonically with orphaned crops.    │
│                                                                        │
│  ⑤ COMMIT ▲ Markdown-with-frontmatter (not JSON) + originals, back     │
│           into the repo. THE SINGLE MOST IMPORTANT LONGEVITY DECISION. │
│           Bot author + [skip ci]; the workflow ignores that author;    │
│           no-op when the payload hash is unchanged; git pull --rebase  │
│           before push, failing loudly on conflict;                     │
│           concurrency: {group: publish, cancel-in-progress: false}     │
│                                                                        │
│  ⑥ astro build → three static OG cards → lychee link check            │
└───────────────┬────────────────────────────────────────────────────────┘
                │ ⑦ DEPLOY (only if the build passed)
                ▼
┌─ CLOUDFLARE PAGES ─────────────────────────────────────────────────────┐
│  wrangler pages deploy dist · _headers · _redirects                    │
│  348 cities · 22 in India · Hyderabad on-net · Universal SSL           │
└───────────────┬────────────────────────────────────────────────────────┘
                │ ⑧ REPORT BACK — always, success, partial or failure
                ▼
   ▲ The Apps Script (running as HIM, every 15 min) reads the build's
     status file, writes the _Publish Log row, and MailApp-sends a
     plain-English email to him AND the named second owner.
     Sent from his own account: it cannot be filtered as spoofed and it
     does not depend on anyone's GitHub subscription surviving.
     Plus a noindex /_status/ page he can bookmark.

  2026-09-14 14:03 | ✅ Published | {n} publications, {n} people, {n} news
  2026-09-14 13:58 | ⚠️ Published with 1 item skipped |
                     Publications row 12: "year" says "forthcoming"
  2026-09-14 13:51 | ❌ Not published | Tab "Publications" is missing a
                     column: "venue". Nothing on the website has changed.
```

**▲ Why the log is written by Apps Script, not the build.** Revision 1 said the service account was a file-level **Viewer** with `spreadsheets.readonly` and *also* had "Editor on this ONE protected tab". Both cannot be true: Sheets range protections restrict editors, they never elevate a Viewer, and `spreadsheets.readonly` cannot write any range. The publish-log loop — the thing §9 teaches him to check after every publish — could not have run. Apps Script already runs as him and already fires the dispatch; it writes the log, and the security posture stays read-only.

**Weekly, separately:** a scheduled job queries OpenAlex `filter=author.orcid:https://orcid.org/0000-0003-3188-9415&per-page=200`, diffs against the committed content **DOI-first, full-title-second, never by prefix**, and appends new items to the **`Inbox`** tab with a note: *"New paper found. Check it, fill in the authors and venue the way you want them cited, then move the row into Publications."* No GitHub, no PR, no merge, no account he does not use. If even that is friction, it is cut — three new papers a year is a ten-minute annual task.

### 8.3 Secrets, caching, headers, the rest

- **Auth: one read-only service account.** Not OAuth — `spreadsheets.readonly` is a *Sensitive* scope requiring Google app verification and `drive.readonly` is *Restricted*, requiring a third-party security assessment; a service account needs neither. Share each Sheet/Doc/folder to it as **Viewer**. Key stored base64-encoded in one CI secret (`GOOGLE_SA_KEY_B64`) to avoid `\n`-mangling.
- ▲ **The annual key rotation is deleted from the maintenance list.** It is a ritual assigned to someone who will not be there, and it creates a real failure mode (the rotation that breaks the build) against an essentially nonexistent threat: a read-only credential scoped to one spreadsheet whose contents are a public website. Rotate on handover or compromise only; the build warns 30 days before `valid_before` if one is set; the runbook documents where the key lives and how to make a new one.
- ▲ **The GCP project is created under an account HE owns**, with the developer added as an owner — never the reverse. Some Workspace tenancies block service-account key creation by policy; the Phase 0 checklist tests this with IITH IT before anything is built, and the documented alternative is an Apps Script Web App source (a one-file change).
- ▲ **Dead-Google mode.** An environment variable `SHEETS_DISABLED=1` in the Cloudflare dashboard makes the build skip the fetch, use the committed content and deploy anyway. One toggle, flippable by any competent person over a phone call — which turns the repo-commit decision from a claim into something reachable under pressure.
- **Caching.** `/export?format=csv` and `/gviz/tq` return `no-cache, no-store` (verified). The 2PACX "Publish to web" URL **is cached by Google** and goes stale — never a build source. Hashed image filenames get `public, max-age=31536000, immutable`.
- **Never hot-link Drive images.** All 22 `lh3.googleusercontent.com/sitesv/` URLs on the current site return 403 to non-browser clients, and `drive.google.com/uc?export=view` broke globally in January 2024. Download once at build, self-host. Migration of existing images is via **Google Takeout**, not scraping.
- **RSS:** `@astrojs/rss` at `/feed.xml`, full post HTML sanitised, `<link rel="alternate">` in head, footer link. Not emitted at zero posts.
- **Sitemap:** `<loc>` + content-hash `<lastmod>`. No `priority`, no `changefreq`.
- **OG images:** three static 1200×630 cards (site, research, writing) by route type.
- **robots.txt blocks nothing.** Scholar requires it.
- **Security headers** (`_headers`):

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'none'; img-src 'self'; font-src 'self';
  style-src 'self'; script-src 'none'; connect-src 'none'; form-action 'none';
  frame-ancestors 'none'; base-uri 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
```

▲ `script-src 'none'` (not `'self'`) because the site ships no JavaScript, and `style-src 'self'` with **no `'unsafe-inline'`** because the CSS is one external stylesheet rather than inlined per page — which also means 14 KB is downloaded once for the whole site instead of on every page. `default-src 'none'` is achievable precisely because everything is self-hosted.

### 8.4 Performance budget (CI-enforced, `budget.json`) ▲ *arithmetic corrected*

Revision 1's rows summed to 297 KB against a stated 250 KB cap on the home page, and 342 KB against 300 KB on a paper page.

| Resource | Home | Publication page |
|---|---|---|
| HTML (gz) | ≤ 15 KB | ≤ 20 KB |
| CSS (gz, one external file, cached site-wide) | ≤ 14 KB | ≤ 14 KB |
| **JS** | **0 KB** | **0 KB** |
| Fonts (four files, cached after first view) | ≤ 160 KB | ≤ 160 KB |
| Images (first view) | ≤ 100 KB | 0 KB |
| Third-party requests | **0** | **0** |
| **Total, first view** | **≤ 289 KB** | **≤ 194 KB** |
| **Total, warm cache** | **≤ 115 KB** | **≤ 20 KB** |

Targets on Lighthouse Slow 4G: LCP ≤ 1.5 s, INP ≤ 100 ms (trivially, with no JS), CLS ≤ 0.02. For context: the current Google Site ships **135 KB of HTML shell** before any CSS, JS or images; the HTTP Archive mobile median is 1,938 KB.

### 8.5 Failure-mode table

| What breaks | What he sees | Fallback / fix |
|---|---|---|
| ▲ **He half-types a row** (`year: "forthcoming"`) | Everything else publishes. `⚠️ Published with 1 item skipped — Publications row 12`. Email says the same. A `⚠️` already sat in that row's Status column in the sheet | Fix the cell, press Publish now. **A bad row can never freeze an unrelated edit** — the 11pm-before-a-deadline case where he needs to change one recruiting sentence and cannot |
| He deletes a column | Site unchanged. *"Tab 'Publications' is missing a column: 'venue'. Columns currently there: title, authors, year… Check row 1."* | Undo. Header check runs before row parsing, so one deleted column produces one sentence rather than forty |
| He renames a tab | Hard build failure naming the bad range | Rename it back. **This is why we use the official Sheets API, not gviz** — gviz returns HTTP 200 with `"status":"ok"` and silently serves the *first* sheet, publishing the wrong data on a green build |
| A student's name is misspelled | A red ❌ in the sheet, next to the cell, immediately, before any build | Fix the typo |
| ▲ **He changes an `id`/`slug`** | Published. The build diffs against the previous commit, emits `old → new 301` into `_redirects`, records `slug_history`, and logs it | Nothing. Citation links keep working. Forgive, do not block |
| ▲ **He deletes a row without ticking `exclude`** | The old page **stays live** with a `noindex` tombstone. *"Publication 2023-imerg-hyderabad was removed from the sheet. Its page is still live so citation links keep working. Tick 'exclude' instead of deleting rows."* | Tick `exclude`. Also in the row-1 cell note and the README |
| ▲ **A photo is outside `/Website/Images/`** | The Apps Script pre-flight (running as **him**, with full Drive access) **moves it there automatically** and carries on. If the file does not exist, it refuses to dispatch and names the cell in a dialog, before any build | Nothing, or fix the named cell. Client-side beats build-time for a non-technical editor |
| ▲ **A Doc is deleted, moved or un-shared** | That page is skipped with a named message; the rest publishes; the last good rendered Markdown stays committed, so the page shows stale-but-correct prose | Restore or re-share the Doc |
| ▲ **A Doc contains a table, footnote or smart chip** | *"Your post 'Musi notes' contains a table on page 2. Tables are not supported; the post was not published and the rest of the site updated normally."* | Remove it. Constrain and reject, never parse and hope |
| ▲ **Two rows share an `id`** | ❌ in the sheet from the duplicate-detector formula; the build also fails that row by name | Change one id |
| ▲ **A `theme` no longer matches any `Research.slug`** | That paper moves to the "Other" chip and a warning is logged | Set a valid theme or leave it blank |
| Drive `downloadQuotaExceeded` (403) | Build fails; site unchanged | Cache keyed on `fileId + modifiedTime` means unchanged images are never re-fetched. Wait and re-publish |
| ▲ **Two publishes at once** | *"A publish is already running — your changes are included in it."* | Nothing. LockService + a 3-minute log check + `concurrency` on the job |
| The deploy is broken or blank | Live site is wrong | **Cloudflare → Pages → Deployments → previous → Rollback.** ~60 seconds, no code |
| Sheets API changes / the Sheet is deleted / the account is lost | Site keeps serving the last good build indefinitely | The repo contains Markdown-with-frontmatter and the original images. Set `SHEETS_DISABLED=1` and it rebuilds with no network at all |
| ▲ **Free-tier minutes or quotas run out** | Spend/quota alerts fire on Cloudflare and GCP before an outage | Public repo = unlimited Actions minutes; GitHub Pages is a free hosting fallback |
| The developer is unreachable | — | `RUNBOOK` as a Google Doc in `/Website/`, a printed copy in his desk drawer, and a copy in the repo; a **named second owner** on Cloudflare, GitHub and GCP; the 10-minute screen recording as an MP4 **in Drive**, not a hosted link |
| Total Google failure | — | Clone the repo, edit the committed Markdown in GitHub's web editor. One runbook page, no PAT, no second CMS |
| A shinyapps.io tool is down | The `/tools/` card shows its honest status | The page ships the "first load is slow; they sleep between visits" note. Never iframed |
| `raftwaters.in` goes live | — | Fill `raft_site_url`. One cell |
| ▲ **A flood happens** | He sets `site_state = event`, one line, and an end time. The home page reorders within the hour | Auto-reverts at `site_state_until` |

### 8.6 SEO, canonicals, titles ▲ *(absent from revision 1, which specified Scholar indexing exhaustively and ordinary page SEO not at all)*

- **`<title>` templates:** `{page} — Satish Regonda` · papers `{title} — Satish Regonda` · home `Satish Regonda — flood forecasting, IIT Hyderabad`.
- **Meta description source, per collection:** themes → `summary`; papers → `takeaway`, falling back to the first 155 characters of `abstract`; posts → `Dek`; tools → `blurb`; everything else → a per-route string in `config/meta.json`. No route ships without one.
- **`<link rel="canonical">` self-referential on every page**, including filtered publication views, which canonicalise to themselves (they are distinct, indexable, server-rendered lists).
- **Trailing slash: required.** Every route ends in `/`; the non-slash form 301s to it, in one direction only, via `_redirects`.
- **JSON-LD `@graph`:** `ProfilePage` + `Person` + `CollegeOrUniversity` on `/`; `ScholarlyArticle` on paper pages; `Organization` on `/group/`; `BlogPosting` on posts.

---

## 9. The professor's workflow

*Written for you, Dr. Regonda. Nothing here needs a developer.*

**Everything lives in your Google Drive.** One spreadsheet called **"satishregonda.in — Content"**, one folder of documents, one folder of photographs. There is no other system to learn, no password beyond your IITH Google account, and no way to break the website.

**Two rules that make all of this safe:**

1. **If you make a mistake, the website does not break.** It keeps showing the last good version and you get an email in plain English naming the row to fix.
2. **▲ If one row is wrong, everything else still publishes.** A half-finished paper entry will not stop you changing your recruiting notice.

### To publish anything

▲ **Tick the `publish_now` box** in the first block of the `Settings` tab. It unticks itself, and **the website updates in about three minutes**. This works on your phone, in the Google Sheets app, which is the point — the recruiting notice and the flood status line are exactly the things you will want to change from an airport or a field site.

On a laptop you can also use the menu: **🌐 Website → 🚀 Publish now**. Same thing.

You can also do nothing. The site republishes itself at 01:30 and 13:30 every day.

**How you know it worked:** the **`_Publish Log`** tab.

```
14 Sep 2026 14:03  ✅ Published   {n} publications, {n} people, {n} news items
14 Sep 2026 13:58  ⚠️ Published   with 1 item skipped — Publications row 12:
                                  "year" says "forthcoming"
14 Sep 2026 13:51  ❌ Not published — Tab "Publications" is missing a column:
                                  "venue". Nothing on the website changed.
```

---

**Change your bio — 5 minutes.** Open **Drive → Website → Docs → `bio-home`** (or `bio-full`). Edit it like any document. Use the Format menu for headings; type links normally. Tick `publish_now`.

**Add a publication — 3 minutes.** `Publications` tab → new row at the bottom. Fill in `id`, `type`, `year`, `title`, `authors` (semicolons, in the order they appear on the paper), `venue`, `doi`, `abstract`. **▲ You never type anything about students** — if a co-author's name matches someone in the `People` tab, the site adds their `*` or `†` mark and the legend for you. Tick `selected` if you want it on the front page (maximum six; the header cell counts them for you).

*Most weeks you won't do this at all — every Monday the site checks the international publication databases and drops anything new into the **`Inbox`** tab with its DOI and title. You check it is really yours, type the authors and the journal the way you want them cited, and move the row into `Publications`.*

**Add a student — 4 minutes.** Photograph: **🌐 Website → Insert a photo** picks it from your Images folder — ▲ you never paste a link. Then `People` tab → new row: `id`, `name`, **`aliases`** (the ways their name appears on papers, separated by semicolons — this is what makes the automatic marking work), `role`, `status` = `current`, `start_year`, `topic`, and tick `consent` if their photograph and email may be published. Optionally two words in `interest`. Publish. They appear on the group page, and every paper they have co-authored is marked automatically, including old ones.

**Move a student to alumni — 3 minutes, and the most valuable three minutes on this site.** Same row. Change `status` to `alumni`. Fill in `end_year`, `viva_date`, `thesis_title`, and — the important one — **`first_position`**: where they went, e.g. `Scientist-SD, National Remote Sensing Centre, Hyderabad`. Pick a `sector`. Publish. They move from the roster to the alumni table automatically. Nothing is deleted, nothing is retyped, and the two lists can never disagree, which is the bug your current site has today.

**Post a blog entry — as long as the writing takes, then 15 seconds.** Open **Drive → Website → Blog** and create a Google Doc. At the very top, insert a 2-column table with these rows: `Title`, `Dek`, `Kind`, `Slug`, `Status`, and optionally `Date`. Write below it. Use Format → Headings. Under each image put one italic caption line and one italic line beginning `Alt:` describing what the picture shows.

▲ **To publish, set `Status` to `published` in that table.** To take it down later, set it to `retired`. To fix a typo in something already published, edit the Doc, then tick `publish_now` — or wait for the next scheduled update. **Never change `Slug` after publishing**; that is the post's web address.

*One setting to change once, today: Tools → Preferences → turn off "Use smart quotes."*

**Add a photograph — 2 minutes.** **🌐 Website → Insert a photo**, then in the `Photos` tab add the `alt` (one line saying what the picture shows), the `credit`, the `place` and the `date`. The `alt` and `credit` are required — the site will refuse to publish a photograph without them, on purpose.

**Update the recruiting notice — 1 minute.** `Settings` → `recruiting_status`, first block, top of the tab. Set `recruiting_deadline`. Publish. ▲ **After that deadline passes the site changes the line for you** to a permanently-true one, so the front page can never claim an intake that closed.

**▲ Put the site into flood mode — 1 minute, from your phone.** `Settings` → `site_state` = `event`, write one sentence in `site_state_line`, set `site_state_until` to when you expect it to be over (up to four days). Publish. The home page reorders: the status strip goes to the top in the flood-category colour, SnapFlood and the press contact rise above everything, and the recruiting line drops down. **It reverts by itself** at the time you set. The site never publishes a forecast of its own — it links to IMD, TSDPS, GHMC and CWC.

**Update your CV — 0 minutes.** Nothing to do. Your CV page is generated from the same spreadsheet. `satishregonda.in/about/cv/` is always current; press ⌘P to get a dated A4 PDF.

### What you cannot do yourself

| | Ask |
|---|---|
| Change the design, layout, colours or typefaces | Developer |
| Add a new *kind* of content (a new section or page type) | Developer |
| Add or change a spreadsheet **column** (adding *rows* is always fine) | Developer |
| Rename a spreadsheet **tab** | Developer — this one will stop a publish |
| Change the domain, DNS or hosting | Developer |
| Fix a build that fails for a reason not named in the email | Developer |
| Publish a PDF whose journal doesn't allow it | Check the publisher, then the developer |

**▲ "Developer" is not a person who may not exist.** Before launch, a **named second owner** — an IITH colleague or a senior PhD student — holds access to Cloudflare, GitHub and the Google Cloud project, receives every failure email you receive, and has the printed runbook. Their name goes in the runbook and in the colophon's build note.

Everything else — every word, every photograph, every student, every paper, every post — is yours.

---

## 10. Build plan

**▲ Two structural corrections to revision 1's plan.** The photography the home LCP and rubric item 17 depend on was scheduled *after* the pages were built, and the alumni placement round — described as the single highest-value content on the site, and requiring replies from fifteen to eighteen people over WhatsApp — sat inside a two-day content phase. Both move to the front.

### Phase 0 — Unblock and own (½ day of ours, ~1 hour of his)

Nothing is built until these are true.

- [ ] **RDAP lookup on `satishregonda.in` and `raftwaters.in`** — this answers "is it registered and where", which DoH cannot
- [ ] Registrar identified; **auto-renew ON**; a card that does not expire before 2030; **the registrar account owned by him or IITH**, developer added as secondary
- [ ] Nameservers pointed at Cloudflare; zone created; Universal SSL verified
- [ ] Fix the `snapflood.in` → `snapflood.civil.iith.ac.in` broken redirect chain
- [ ] **Google Cloud project created under an account HE owns**; Sheets + Drive APIs enabled; read-only service account created (test that IITH's Workspace policy permits service-account keys and external sharing; if not, swap to an Apps Script Web App source — a one-file change)
- [ ] **Drive `/Website/` tree owned by his IITH account**, not the developer's
- [ ] **Public** GitHub repo; Cloudflare Pages project; **the second owner named and added to all three, plus GCP**
- [ ] **`ACCOUNTS.md`** — repo, Google Doc and printed: every account, its owner, its recovery path, its renewal date (registrar, Cloudflare, GitHub, GCP, Drive, Play Store listing)
- [ ] **Calendar reminders in HIS calendar**, 60 days before the domain renewal and any card expiry
- [ ] Spend and quota alerts on Cloudflare and GCP
- [ ] **Alumni round launched, day one**: a pre-written WhatsApp message and a Google Form (name, where you went, sector) writing into `_Alumni Replies`, with an Apps Script menu item "Import alumni replies" that merges matched values into `People` and reports conflicts. A named owner and a hard cutoff date. The page ships at any completion level (§6.15)
- [ ] Photography briefed (Phase 1b), group photo booked for a date the group is assembled

**From him:** registrar login or the person who has it; a decision on `raftwaters.in`; the second owner's name; his ~20-minute recorded interview slot.

### Phase 1 — Content rescue (2 days)  ·  *before the Google Site is touched*

- [ ] **Google Takeout export** of the entire Google Site (all 22 images 403 to scripts; this is the only way), producing the verbatim page list that generates the `_redirects` table
- [ ] **Transcribe the Sixer Twitter guidelines**, which exist *only* as pixels inside one un-alt-texted image. If nobody does this before the old site is retired, the content is gone permanently
- [ ] **The interview**: 20 minutes recorded, transcribed, both sample rewrites rebuilt from his clauses, two non-idiomatic constructions preserved per page, a style-guide note attached
- [ ] Build the workbook: 18 tabs, headers, dropdowns, checkboxes, protections, the ✅/❌ foreign-key and duplicate formulas, the ⚠️ Status columns, the README tab, one example row per tab
- [ ] Seed `Publications` from OpenAlex (55 works → filter → the curated set), **applying all six DOI corrections, with the Brown 2014 Part 1/Part 2 assignment verified against Crossref**
- [ ] **Source every abstract** from OpenAlex `abstract_inverted_index` and Crossref; flag unclear licences; get blanket approval for his own submitted abstracts
- [ ] Seed `People` from the Students page **plus Akansha Maity**, with `aliases` filled for everyone
- [ ] Seed `Positions` and `Service` from the CV
- [ ] Seed `News` with 15–20 backdated real items so the feed never launches empty
- [ ] Seed `Press` with the three verified 2023 articles, the UFIS video, and **three verbatim quotes with outlet and date**
- [ ] **Count reconciliation**, once: alumni, current students, publications, projects. Recorded in the sheet; nothing retyped into copy again
- [ ] Flag for removal: the two unlicensed press photographs on the SnapFlood page

**From him:** the phone number and PIN code (§12.3); course codes, levels and semesters for all ten courses; which papers he may legally self-host; the discharge CSV for the hydrograph; the UFIS system description.

### Phase 1b — Photography (his time, ~2 half-days, **scheduled before the page build**)

Six to eight images, no more, graded together.

1. Wide landscape of a Deccan river or reservoir — **under monsoon overcast, 1–3pm. Golden hour is banned on this site, in writing.**
2. Hands on an instrument — staff gauge, rain gauge, drone controller, notebook
3. Students working mid-task, from behind or in profile, not lined up smiling
4. A wet, unglamorous flooded Hyderabad street *(monsoon-dependent; archive fallback from the group's existing field photographs)*
5. A drone oblique of a basin or a flooded area
6. **A portrait of him outdoors with equipment, not at a desk** — there is currently no photograph of him anywhere on his own site
7. A dated group photograph, with names by row, **shot full and uncropped: corridor, fluorescent tubes, everyone in it**
8. A SnapFlood phone screenshot, plus permission to use ~12 real citizen submissions for the archive grid

**Grade:** flat, slightly green, the cast of a survey photograph. No lifted blacks, no warm editorial preset. One night frame with direct phone flash on wet asphalt.
Every image needs a place, a date and a photographer credit. While photographs are outstanding, Phase 4 builds against a labelled grey plate at the exact 4:5 ratio so the swap causes no reflow.

### Phase 2 — Design system (3.5 days)

- [ ] **The font feature gate** (§4.1). If it fails, ship the stated fallback pair without a meeting
- [ ] Subset once by hand, commit four `.woff2` files, **delete the script from CI**; record the measured payload
- [ ] `scripts/measure-face.py` → the real average advance and x-height ratio → `--w-text` and the mono's optical size
- [ ] **Print an A3 specimen at 100%**: the masthead, one publication entry, one news line, one alumni row, one full prose paragraph, the status strip. **Kill it and reset it three times. Pin the survivor to a wall and choose by eye.** No brief that has never been printed may claim print-trained typography
- [ ] `tokens.css` — palette, spacing, the seven-step scale, the two rails
- [ ] Components: bulletin grid, gauge rail (both widths), publication row, people card, alumni row, news item, figure-on-plate, `<details>` sidenote, filter chip, status strip, stage strip, focus ring, skip link
- [ ] **Trace the stage-mark hydrograph** from his discharge series; source the 1908 peak; export at three scales
- [ ] **Draw the UFIS system diagram** as inline SVG (+0.5 day, §6.8)
- [ ] Print stylesheet (A4, `break-inside: avoid`) — **printed on paper and read**
- [ ] The grep script: zero `box-shadow`, zero gradients, zero `repeat(3, 1fr)`, zero indigo, zero non-zero `border-radius`, **zero `background` referencing `--accent`**, exactly two font families, ≥3 letter-spacing values with the inversion present, **zero bytes of JS**

### Phase 3 — Pipeline (3.5 days)

- [ ] Astro Content Layer loaders: Sheets (`batchGet`, 18 ranges, one call) and Docs (`text/markdown` + the unescape pass, with the allowed-vocabulary rejector)
- [ ] Zod schemas; `assertHeaders()`; **fatal-vs-skip classification**; the all-errors-in-one-pass reporter with a unit test asserting real row numbers
- [ ] Alias-matching author marker with the near-miss warning
- [ ] Drive image pipeline: `modifiedTime` cache key → sharp; **originals committed, derivatives cached**
- [ ] Commit-back as Markdown-with-frontmatter, bot author, `[skip ci]`, hash no-op, rebase, `concurrency`
- [ ] Apps Script: installable `onEdit` on `publish_now`, the desktop menu, the Drive pre-flight and auto-move, the photo picker, the 15-minute status poll, the `_Publish Log` writer, the `MailApp` failure email, the "Import alumni replies" merge
- [ ] `id`/`slug` diff → auto-301 + tombstone + `slug_history`
- [ ] **Two CI jobs**: `content-publish` (headers, Zod, images, build, deploy; style violations are warnings only, never a failure) and `code-pr` (the full anti-generic rubric, grep script, `budget.json`, lychee, gitleaks as hard gates)

### Phase 4 — Pages (4.5 days)

- [ ] Home (1440 and 390), `/research/` + 4 theme pages, `/publications/` + 5 filtered views + {n} paper pages, `/tools/` + `/tools/snapflood/`, `/group/`, `/teaching/` + course pages, `/writing/`, `/join/`, `/about/` + `/about/cv/`, `/press/`, `/colophon/`, `/news/`, **`/404`**, and **every empty state in §6.15**
- [ ] Highwire meta for all six types; PDFs as sibling files
- [ ] JSON-LD; titles, descriptions, canonicals, trailing-slash rule
- [ ] EVENT/WATCH rendering and the auto-revert
- [ ] RSS, sitemap, three static OG cards, `_redirects`, the stripped Google Site with per-page meta-refresh

### Phase 5 — Review, sign-off and seeding (2.5 days, mostly his)

- [ ] Bio and theme-prose sign-off, including the `[PLACEHOLDER]` on "seven years" (1 day)
- [ ] Proofread of every citation, with him (0.5 day)
- [ ] Three seeded blog posts drawn from material he already has (1 day) — *only if Open Q11 comes back yes*

### Phase 6 — Quality gate and launch (2 days)

- [ ] The 22-point anti-generic rubric (§11), every answer yes
- [ ] Lighthouse budget passing on all page types; **zero JS asserted**
- [ ] Keyboard-only pass; one page through the VoiceOver rotor; the skip link tested
- [ ] Greyscale print test; deuteranopia simulation of the stage colours
- [ ] **Restore test:** a second person clones the repo on a clean machine **with no Google credentials**, sets `SHEETS_DISABLED=1`, and rebuilds the site successfully. Until this has happened, "it rebuilds with no network" is a claim
- [ ] **Handover acceptance test:** he performs all nine workflows unaided while someone watches and takes notes, **including one publish from his phone**. Any task he cannot complete alone is a design defect, not a training gap
- [ ] Email Routing delivery test (if an alias is used at all): send from outside, confirm it lands in his inbox, not spam
- [ ] Google Search Console; sitemap submitted
- [ ] `satishregonda.in` added to Google Scholar, ORCID, ResearchGate, LinkedIn, the IITH faculty CMS, both department listings and the Play Store listing
- [ ] The old Google Site stripped; sub-pages deleted
- [ ] `RUNBOOK` (repo + Google Doc + **printed**), `ACCOUNTS.md`, the one-page "what to do when something is wrong" card whose first line is *"The website is still showing the last good version. Nothing is broken for visitors."*
- [ ] **Dependency policy written into the runbook:** Node pinned in `.node-version`; Dependabot disabled except for security advisories on the toolchain. A frozen build that keeps working is the goal, not a current one

**Total: 0.5 + 2 + 3.5 + 3.5 + 4.5 + 2.5 + 2 = 18.5 working days**, plus his photography half-days, spread over 6–7 calendar weeks around his availability. *(Revision 1 stated 17 days against phases summing to 14.5, with no line for sign-off, revision or seeding.)*

**Annual cost of ownership:** the domain renewal only — approximately **₹900–1,500/year** depending on registrar. Cloudflare Pages, Cloudflare DNS and analytics, GitHub (public repo), Google Cloud (Sheets/Drive reads well inside free quota) and OpenAlex are **₹0** on the tiers used. If any free tier changes: Pages → GitHub Pages (already free, public repo); Actions → Cloudflare build triggers; OpenAlex → delete the weekly job and type three rows a year.

---

## 11. Anti-generic rubric

Every answer must be **yes**. Any **no** is a launch blocker. Items 1–14 are machine-checkable and run in `code-pr` — **never in his content publish**.

**Automated**

1. Does `box-shadow` appear **zero** times in the stylesheet?
2. Is `border-radius` **`0` everywhere**, with zero circular photographs?
3. Zero `linear-gradient` / `radial-gradient` on any text or full-width background?
4. Zero occurrences of `#6366F1 #4F46E5 #818CF8 #8B5CF6 #A855F7`, `indigo`, `violet`?
5. Exactly **two** typeface families (plus the SC and width variants of those two), with `Inter`, `Roboto`, `Lato`, `Montserrat`, `Poppins`, `Open Sans`, `Playfair Display`, `Space Grotesk`, `Instrument Serif` and `Source Sans` all absent?
6. Zero `repeat(3, 1fr)` in section layout, and at least one uneven `fr` ratio present?
7. At least three distinct `letter-spacing` values, **negative on display and positive on the two mono steps**?
8. `text-wrap: balance` on headings and `text-wrap: pretty` on body both present?
9. `font-variant-caps` and `font-variant-numeric` present, with `lining-nums` scoped to `a` and `tabular-nums` on the rail?
10. **Zero bytes of JavaScript shipped on every route**, and zero third-party requests?
11. **Zero `background` declarations referencing `--accent`**, at most 12 accent-coloured elements at 1440×900 and at most 6 above the fold on `/`?
12. Does `--mark` appear only on text, and never without accompanying words?
13. Zero emoji in any heading, nav item or button label?
14. Does the **gauge rail exist at 390px** (`--rail-sm` present, with year ticks), and does `/publications/` render its filters as real `href`s with no JS?

**Visual**

15. Is body text 18px at the measured 62–68 character measure, line-height 1.62?
16. Is the palette two inks plus one accent plus one absence colour, and can you say in one sentence, with a citable source, where `#166157` came from and what `#8C5A24` means?
17. Are separations drawn as hairlines in a real text colour, never as `rgba(0,0,0,.06)`?
18. Does the page carry **two width rhythms** and **one deliberate full-bleed break**, with the rail doing real work at both breakpoints?
19. **Blur the homepage screenshot to 20px — at 390px AND at 1440px.** Is it identifiable as *this* site? A full-bleed dark trace under a thin header, a hard-ruled status line, and text at two visibly different widths should survive the blur. If it blurs to a centred blob over equal rectangles — fail.
20. Is every image a real photograph of a real place or person, under overcast light, with a caption naming place and date, and **zero stock, zero golden hour, zero AI imagery**?
21. Do **at least three details appear that could not exist on another site** — the 1908 datum line, the derived trainee marks, the hydronyms, the absence colour, the issue stamp?

**Copy**

22. Does `config/banned-words.json` return **zero** hits for words and **zero** for patterns (reversal, not-just, fragment closer, dash pile, triad) across every page, with at most **one** exclamation point site-wide? Read the home bio aloud: does it sound like **him**, and are the two preserved non-idiomatic constructions still in it?
23. Is there a colophon naming the typefaces, the colour provenance and semantics, the gauge and the 1908 source, the hydronym list, the photo credits, the no-dark-mode line and the privacy block — and does reading it make it obvious a person made deliberate choices?

**The 24th, and the sharpest:** show the home page to someone who has looked at a lot of 2026 web design and ask, *"does this look AI-made?"* If they hesitate before saying no, something above is still failing.

---

## 12. Open questions for the client

**▲ Decisions we made for you — say no if you disagree** (moved out of Open Questions, because they were not questions):

- **RAFT expands to "Rainfall-runoff Analysis and Forecasting Tools."** It is the only version that spells RAFT, it is already public on the Play Store, and "Analysis modelling" is not English. We will also ask you to fix the Play Store developer name, which currently reads **"Suresh Regonda."**
- **No citation counts on the site.** OpenAlex, Semantic Scholar, Crossref and Scholar report four different numbers for the same paper. Any figure we hard-code is wrong within a month and contradicts what you say in talks. A quiet link to your Scholar profile instead.
- **No dark mode.** The site is a paper object and the colophon says so in one line.
- **No blog until you want one.** At zero posts the section does not exist; write one and it appears.
- **The self-hosting question is already half-answered:** nine of your works are CC-BY and safe to mirror; four are "bronze" open access with *no licence at all* — free to read at the publisher, not re-hostable. We only need Q6 below for the rest.

**The questions that genuinely change the build:**

1. **Registrar credentials for `satishregonda.in`.** We will have run RDAP before we speak, so we will know whether it is registered and by whom. What we need from you is the login, or the name of the person who has it. *(Blocks everything.)*
2. **What is `raftwaters.in` supposed to be?** It does not exist in DNS. Three options, each a different build: (a) never register it, `/group/` is the RAFT home; (b) register it and point it at `/group/`; (c) register it and build a separate site later. We ship assuming (a), with a one-cell switch. Note `raftwaters.com` is an unrelated GoDaddy placeholder — do not let anyone link it.
3. **Which phone number reaches you, and which PIN code is correct?** `iith.ac.in` says `(040) 2359-6315` and `Kandi-502284`; the CE department listing and your own site say `+91-40-2301 6315` and `502285`. We publish one set, and this site becomes the canonical record.
4. **Alumni destinations.** Eighteen graduates are listed with thesis titles and no placement information. This exists nowhere public and has to come from you. The WhatsApp message and the form are ready on day one. **We will not invent any of it**, and the section ships partial rather than fabricated — an alumnus with no reply shows "placement not recorded" in the colour this site uses for missing data.
5. **The ten course codes, levels and semesters.** Bare titles with no CE-prefixed code, no UG/PG label and no year read as a placeholder and are useless to the student they exist for. Also: which two or three courses deserve a page of their own, and can you supply a topic outline and a reading list for those?
6. **Which of the remaining papers may you legally self-host?** We need to know whether you hold accepted manuscripts and whether the embargo has passed. The list is attached, narrowed to the ones whose status we could not establish.
7. **The hydrograph.** The site's signature object should be traced from a real discharge record you hold. Which gauge, which event, which years? **Musi at Chaderghat during October 2020 would be the strongest choice** — it is the event the whole urban-flooding programme is about. We also need a source for the September 1908 peak we intend to draw as a dashed datum line above it. **▲ If you cannot supply a CSV:** the fallback is a published Musi hydrograph digitised from a CWC or GHMC report with the source printed in the caption; failing that, the masthead ships as a plain `--ink` rule and the site loses its best object, which is why this is on the Phase 0 list.
8. **Awards, editorial roles, reviewer service, memberships.** Nothing is findable in any public source. If they exist they need rows; if they do not, the sections are not emitted at all — an empty Awards heading looks worse than no heading.
9. **ORCID.** Your record (`0000-0003-3188-9415`) is real, public and nearly empty: no biography, no keywords, no education, one undated employment entry, 14 works. A one-hour fix that gives you a free, permanent, machine-readable publication feed. Do you want us to do it, or would you rather we not touch it?
10. **A Telugu-language page** for the urban-flooding and water-awareness work. ▲ It is now a **costed option**, not a free idea: it needs a third typeface (Noto Serif Telugu, roughly +80 KB), a translator, and a commitment to keep it current. Locally it is exactly right — Hyderabad flooding is a Telangana public-interest issue. It is out unless you can commit to all three.
11. **Do you want a blog, honestly?** We will seed three posts from material you already have. A blog whose newest post is eighteen months old is worse than none. Three or four pieces a year? If the honest answer is no, we ship the news feed and the section simply does not exist until you write something.
12. **Who is the second owner?** ▲ This is now a **Phase 0 blocker**, not a closing concern. A named IITH colleague or senior PhD student needs access to Cloudflare, GitHub and the Google Cloud project before launch, receives every failure email you receive, and holds a printed runbook. A site whose bus factor is one is not delivered.
13. **What happens if you move institution, retire, or the group winds down?** Who owns the domain and the content then, and do you want the site archived (a static copy handed to IITH, or deposited with the Internet Archive) rather than expiring? One paragraph in the runbook, decided now while it costs nothing.
14. **Permission for the SnapFlood archive grid.** We want to run roughly a dozen real citizen submissions, with timestamps and coordinates, full-bleed on `/tools/snapflood/`. Do the app's terms already cover this, and are you comfortable publishing the coordinates at the precision the submissions carry?

---

## Rejected critiques

Ten fixes I did not take, and why.

1. **Hand-typed `author_marks` as the trainee-marking mechanism** *(completeness review)* — rejected: positional indices silently reattach to the wrong person whenever an author is added or reordered, and alias matching becomes deterministic once `People.aliases` exists and near-misses are warned rather than guessed.
2. **A third ink tier at ~3.2:1 for the rail years** *(art direction)* — rejected: I took the two-ink half of the fix, because 3.2:1 fails AA for the 11–13px text it was proposed for; the rail is separated by family, size and tracking instead.
3. **Dark mode as "the forecast desk at night"** *(art direction, option b)* — rejected in favour of the same critique's option (a): the site commits to being a paper object, and the NWS stage colours go to EVENT mode, where they carry information rather than atmosphere.
4. **Renaming the nav item to "What you can use"** *(art direction)* — rejected as a nav label: a four-word item breaks the mono index rhythm at 390px, so the phrase becomes the `h1` of `/tools/`, where it does the same routing work.
5. **Build-time page numbers in the footer ("p. 14 of 61")** *(art direction)* — rejected: the sitemap has no reading order, so the number would be arbitrary, and the issue stamp already carries the serial signal truthfully.
6. **Setting all of `/publications/` in monospace as one of the undefendable choices** *(art direction)* — rejected: {n} entries of mono costs legibility for the audience that reads that page hardest; the three taste choices in §3 spend the budget better.
7. **Fraunces at high `opsz` with `WONK=1` for display** *(art direction)* — rejected: it has no true small caps, and once the masthead name is set at 13px mono there is no display slot for it to occupy.
8. **Cutting the `Talks` and `Awards` tabs** *(maintainability)* — rejected: the real defect was that they rendered nowhere, so they get a surface on `/about/` and the CV, and the suppress-at-zero-rows rule already prevents the empty-section failure.
9. **A Google Form writing "straight into the `People` tab"** *(completeness)* — rejected as specified, because Forms can only write to their own response sheet; replies land in `_Alumni Replies` and an Apps Script menu item merges them into `People` with a conflict report.
10. **Running the SnapFlood submission grid as the `/group/` header** *(art direction)* — rejected there: `/group/`'s header is the dated group photograph, which is the page's subject; the grid runs full-bleed on `/tools/snapflood/`, where the archive *is* the subject.

**Partially taken, with the scope stated so nobody re-litigates it:** hydronyms render in italic accent automatically in body prose and captions, and are refused inside headings, publication titles, author strings, venue names and code, where restyling a source's own typography would misrepresent it.