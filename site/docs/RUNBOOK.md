# Runbook

**The website is still showing the last good version. Nothing is broken for
visitors.**

That sentence is true of every situation in this document. If a publish fails,
if the sheet is wrong, if Google is down, if the build breaks, if nobody has
touched the site for a year: satishregonda.in carries on serving the last
version that worked. Nothing you can do in the spreadsheet can take the site
down. That is the one thing worth knowing before anything else.

This runbook is written for whoever is holding the site, whether or not they
write software. It covers publishing, reading the log, every failure message and
what to do about it, rolling back, and what to do when the developer cannot be
reached.

---

## Who to contact

| Role | Who | Reach them at |
|---|---|---|
| Owner | Dr. Satish Kumar Regonda | satishr@ce.iith.ac.in |
| Second owner | **NOT YET NAMED — fill this in** | |
| Developer | *(fill in name)* | *(fill in email)* |

The second owner is not a formality. They need access to the Google workbook, to
Cloudflare, and to GitHub, they receive every failure email, and they should hold
a printed copy of this page. Until that line is filled in, one person on a field
trip is the difference between a small problem and a stuck website. Filling it in
takes ten minutes: share the workbook, add them to the Cloudflare account, add
them to the GitHub repository, and put their address in `SECOND_OWNER_EMAIL` in
the sheet's Apps Script properties.

---

## Publishing

The website is built from a Google workbook. Edit the sheet, publish, and two to
three minutes later the site has changed.

**To publish:**

1. Open the workbook.
2. Go to the **Settings** tab and tick the **publish_now** box.
   It unticks itself straight away. That is correct: it is a button, not a
   setting.
3. A message appears at the bottom right: *Publishing. The website updates in two
   to three minutes.*
4. Wait, then reload the site.

The **Website** menu at the top of the sheet does the same thing. **Website,
Publish now** is identical to ticking the box. **Website, Check publish status**
says what the last build did.

**You do not have to publish.** The site also rebuilds itself twice a day, at
01:30 and 13:30 India time. An edit made at four in the afternoon is live by half
past one in the morning at the latest, whether or not anyone remembers to tick
anything.

**Ticking it twice does nothing bad.** If a publish is already running you are
told *A publish is already running. Your changes are included in it.* That is not
an error. The build reads the sheet at the moment it runs, so a second build
would publish exactly the same thing.

### What cannot be changed from the sheet

Text, dates, people, publications, projects, courses, news, press and every link
are all in the sheet. Photographs, figures, page layout and anything with a
picture in it need a developer. If you are unsure which side of the line
something falls on, look for it in `docs/SHEET-SCHEMA.md`: if it is a column
there, you can change it yourself.

**The moving diagram on the RAFT page** is the group's own UFIS slide redrawn as
a catchment: the same pictures and the same words, with water drawn between
them instead of boxes and arrows. The pictures live in `site/public/ufis/` (cut
from the slide by `research/ufis/gen-assets.mjs`); the layout is one file,
`site/src/lib/ufis-layout.mjs`, and `node scripts/ufis-coords.mjs` turns it into
`site/src/styles/ufis-coords.css`, so no position is ever edited by hand. Any
tile can play a short looping video: a developer puts
`<tile>.mp4` (for example `weather.mp4`, `hydro.mp4`, `geospatial.mp4`) into
`site/public/ufis/video/` and rebuilds. Keep clips small (a few seconds, a few
megabytes, no sound); visitors who ask their device for reduced motion see the
still instead.

---

## Reading the _Publish Log

The `_Publish Log` tab is the history of every publish. A row is added when a
publish is requested, and another when it finishes. It can take up to fifteen
minutes for the finishing row to appear, because the sheet checks on the build
every quarter of an hour.

| What happened | What it means |
|---|---|
| `Publish requested` | The sheet asked for a build. It is running now. |
| `Published` | Everything on the sheet is live on the website. |
| `Published, partly` | The site published, but one or more rows were left out. The `Detail` column names each one. |
| `Not published` | Nothing changed on the website. The `Detail` column says why. |

Read the **Detail** column. It is written in plain English and names the tab and
the row. You are also emailed whenever a publish fails or goes out partly, and
so is the second owner.

Do not sort or reorder this tab. The script reads its last few rows to work out
whether a publish is already running.

---

## What the failure messages mean

Every message below is one you may see in the log, in an email, or in the toast
at the bottom of the sheet. Each one ends the same way: nothing on the website
has changed.

### "Tab 'Publications' is missing a column: 'venue'. Columns currently there: … Check row 1."

A column heading in row 1 has been renamed, deleted, or a whole column has been
removed. Row 1 is the only row the website matches by name.

**Do:** open that tab, look at row 1, and put the heading back exactly as
`docs/SHEET-SCHEMA.md` lists it. Capital letters do not matter and a space works
where the document has an underscore. Then publish again.

**A common cause:** somebody deleted a column that looked empty. The column being
empty is fine. The heading going missing is not.

### "The workbook is missing a tab: 'Publications'. The tabs in it right now are: …"

A tab has been renamed, deleted, or moved to another workbook.

**Do:** check the row of tabs along the bottom. If one has been renamed, rename
it back. If one has been deleted, get it back: **File, Version history, See
version history**, pick a version from before it went, and restore. Then publish
again.

### "Tab 'Settings' has no row for 'email'. Add a row with email in the key column…"

The Settings tab is a list of settings, one per row, with the name in the left
column and the value in the right. A row has been deleted.

**Do:** add a row back with that exact name in the left column and the value in
the right. Row order on this tab does not matter.

### "Published with 1 item skipped — Publications row 12: 'year' says 'forthcoming'."

The site published. One row could not be read, so it was left off, and everything
else went live.

**Do:** go to the row named, fix that one cell, and publish again. In this
example the `year` column expects a four-digit year and somebody typed a word. A
paper that is not out yet is best kept in the sheet with the `exclude` box
ticked, so it is ready when it is.

### "Not published — GitHub refused the access token."

The password the sheet uses to reach the build service has expired or been
revoked. Nothing is wrong with the sheet or the site.

**Do:** this one needs the developer. It is a five-minute job: a new token, one
value replaced in the sheet's script properties. Until it is done, the site keeps
publishing on its own twice a day, so this is not urgent unless something needs
to go out immediately.

### "This build is not allowed to open the sheet. Open the workbook, press Share, and add … as a Viewer."

The sheet was shared with the build and no longer is, or it was moved into a
folder that reset its sharing.

**Do:** the message names the address to add. Open the workbook, press **Share**,
paste that address, choose **Viewer**, and send. Viewer is the correct level and
is deliberate. The build can read the sheet and can never write to it, so no
software failure can damage the content.

### "No workbook was found with that id."

The build is pointed at a workbook that has been deleted, or the wrong one.
Needs the developer.

### "The sheet could not be read." followed by a network or timeout message

Google was briefly unavailable. This fixes itself.

**Do:** wait ten minutes and publish again. If it happens twice in a row, tell
the developer.

### "The website was built but could not be uploaded."

Cloudflare, the service that serves the site, had a problem. The website is
unaffected and is still serving its last version.

**Do:** wait ten minutes and publish again.

### "Not published. This sheet is not connected to the website yet."

The setup was never finished, or a script property has been cleared. Needs the
developer, and the message names which value is missing.

---

## Rolling back a bad deploy

This is for the case where a publish worked perfectly and the result is wrong:
something was deleted from the sheet by accident, a paragraph went out
half-written, a name was published that should not have been.

**About sixty seconds:**

1. Sign in to **Cloudflare**, at dash.cloudflare.com.
2. **Workers & Pages**, then the **satishregonda-in** project.
3. Open the **Deployments** tab. It is a list of every version, newest first.
4. Find the last one that was right — the timestamps and the commit messages will
   tell you which.
5. Press the three dots on that row, then **Rollback to this deployment**, and
   confirm.

The site is back to that version within about a minute. Visitors see the old
version again; nobody sees an error at any point.

**Then fix the cause.** A rollback changes what is being served, not what is in
the sheet. The next publish — including the automatic one at 01:30 — will build
from the sheet again and put the problem straight back. So: roll back, correct
the sheet, and publish. In that order.

---

## The dead Google switch

The site does not depend on Google to keep working. Every word of content is also
stored in the website's own repository, as ordinary files, and the build uses
those files. The sheet is how the files get edited, not where the site reads
from.

If the Google account is lost, the workbook is deleted, the API changes, or
somebody simply wants Google out of the loop:

1. In GitHub, go to **Settings, Secrets and variables, Actions**, then the
   **Variables** tab.
2. Add a variable named `SHEETS_DISABLED` with the value `1`.

That is the whole procedure. From the next build on, the site is compiled from
the committed files with no network calls to Google at all. Nothing is missing:
the committed files are a complete copy, updated on every publish since the day
the site went up. Every page still builds, every page still deploys, and the log
records what happened.

What stops working is editing from the sheet. Content changes then need a
developer to edit the files directly, which is the situation almost every other
academic site is in permanently.

To go back, remove the variable.

---

## If the developer is unreachable

Nothing here is urgent, which is the point of the design. In order of how likely
you are to need it:

**Nothing is broken.** The site is static. It has no database, no login, no forms
that can fail visibly, and no server that can crash. It is a folder of files on a
content network. Left completely alone it keeps serving until the domain
registration lapses, which is paid to 2029.

**You can still publish.** The twice-daily automatic build does not depend on the
sheet's script, on anyone's laptop, or on anyone remembering. If the publish
button stops working, edit the sheet and wait; the site catches up by 01:30.

**You can still roll back.** The Cloudflare rollback above needs no developer.

**You can still take Google out.** The `SHEETS_DISABLED` variable above is two
fields in a form.

**Someone else can pick the site up.** The whole thing is one repository:
`README.md` explains the stack in a page, this runbook explains the operations,
and `docs/SHEET-SCHEMA.md` explains the content. It is a plain Astro site with no
unusual dependencies, which any web developer can run with `npm install` and
`npm run dev`. There is nothing bespoke to reverse-engineer.

**The things only a developer can do:** replace an expired GitHub token, change
the Cloudflare project, add a page, add a photograph, change the design. None of
those stops the site from serving.

---

## Why a failed build cannot break the live site

Worth understanding once, because it is the reason none of the above is an
emergency.

The site is not generated when somebody visits it. It is generated in advance, as
a folder of finished pages, and that folder is uploaded to Cloudflare in one go.
A visit is a request for a file that already exists.

A publish either produces a complete folder or it stops. If the sheet is missing
a column, the build stops before writing anything. If a row is unreadable, that
row is dropped, the build finishes, and the log names it. If the build itself
fails, no upload happens at all. Nothing partial is ever uploaded, and the upload
is the only step that changes what a visitor sees.

So the worst outcome of any failure is that the site is briefly out of date. The
sentence at the top of this page is not reassurance. It is a description of how
the system is built.
