/**
 * satishregonda.in — the /join/ form's email receiver.
 *
 * The site ships zero JavaScript, so /join/ is a plain HTML form that posts
 * straight here; the browser navigates to the response and the applicant reads
 * a confirmation page. No fetch, no CORS, no widget.
 *
 * Every submission:
 *   1. is dropped silently if the hidden `website` field was filled in. Bots
 *      fill every field they find; a person never sees this one.
 *   2. is refused, with the missing answers named, if anything required is
 *      blank.
 *   3. is dropped silently if the same person sent the same answers in the last
 *      ten minutes. A double-click is not two applications.
 *   4. is emailed to Dr. Regonda with every answer, under the subject line his
 *      own invitation asks applicants to use, and with Reply-To set to the
 *      applicant, so answering is one click.
 *   5. is added as a row to the Applicants sheet, so nothing lives only in an
 *      inbox.
 *
 * DEPLOYMENT, ONCE — about five minutes, nothing to fill in
 * ---------------------------------------------------------
 * Do this signed in to the Google account that should keep the applications.
 * The sheet is created in that account's Drive and the notification emails are
 * sent from it, so use an account that will outlast this project's handover.
 *
 *   1. script.google.com, New project. Replace everything in Code.gs with this
 *      file, and name the project "satishregonda.in join form".
 *   2. Pick testSetup in the function menu at the top and press Run. Google
 *      asks for permission to send email and to create a spreadsheet; allow
 *      it. A sample application arrives in Dr. Regonda's inbox and the sheet
 *      appears in Drive. Delete the sample row. If either does not happen,
 *      stop: the execution log says why.
 *   3. Deploy, New deployment, type Web app.
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      "Execute as Me" is what lets an anonymous applicant's post send the
 *      email. The applicant gets no access to anything.
 *   4. Copy the /exec address into PUBLIC_JOIN_FORM_URL — in Cloudflare Pages
 *      for the live site, in site/.env for local work — and rebuild. While it
 *      is empty, /join/ shows his email address and his four points instead.
 *   5. Send one real application from satishregonda.in/join/ and check that
 *      the email arrives and the row lands.
 *
 * Optional Script Properties (Project Settings). None is needed to start.
 *   OWNER_EMAIL     where applications go. Default: satishr@ce.iith.ac.in
 *   CC_EMAIL        a second address that gets a copy of each one
 *   SPREADSHEET_ID  write to an existing workbook instead. Filled in by the
 *                   script itself the first time it creates the sheet.
 *
 * Redeploying after an edit: Deploy, Manage deployments, edit the existing
 * deployment, New version. A second "New deployment" makes a different /exec
 * address, and the site would carry on posting to the old one.
 */

/* ================================================================== *
 * Configuration
 * ================================================================== */

var APPLICANTS_TAB = 'Applicants';
var WORKBOOK_NAME = 'satishregonda.in — join form applications';
var JOIN_PAGE = 'https://satishregonda.in/join/';
var DEFAULT_OWNER = 'satishr@ce.iith.ac.in';
var SITE_NAME = 'Dr. Satish K. Regonda';

/** The subject his own invitation asks for, so the form's emails sort with the
 *  ones people write by hand. */
var SUBJECT = 'Looking for an Opportunity';

/** Whom his invitation welcomes. Must match the radio values on /join/. */
var ROLES = ['PhD', 'Postdoctoral research', 'Internship'];

/** Every field the form sends, in the order they appear on the page. */
var FIELDS = [
  { name: 'name',       label: 'Name',                          required: true },
  { name: 'email',      label: 'Email',                         required: true },
  { name: 'role',       label: 'Applying for',                  required: true },
  { name: 'interests',  label: 'Research interests',            required: true },
  { name: 'background', label: 'Background and skills',         required: true },
  { name: 'why',        label: 'Why this group',                required: true },
  { name: 'hopes',      label: 'Hopes to learn and contribute', required: true },
  { name: 'cv_url',     label: 'CV or profile',                 required: false }
];

var HEADERS = ['Received']
  .concat(FIELDS.map(function (field) { return field.label; }))
  .concat(['Replied']);

/** One cell holds a lot, but not a novel pasted in by accident. */
var MAX_FIELD = 4000;
var REPEAT_WINDOW_SECONDS = 600;
var EMAIL_RE = /^[^@\s]+@[^@\s.]+(\.[^@\s.]+)+$/;

/** Joins the answers for the repeat check. The ASCII unit separator, which no
 *  one can type into a form field. */
var SEPARATOR = String.fromCharCode(31);

var INK = '#0F2621', MUTE = '#586A65', ACCENT = '#166157', RULE = '#B3BDB8', PAPER = '#E7EDE8';

function prop_(name) {
  return (PropertiesService.getScriptProperties().getProperty(name) || '').trim();
}

function ownerAddress_() {
  return prop_('OWNER_EMAIL') || DEFAULT_OWNER;
}

/* ================================================================== *
 * POST — the form
 * ================================================================== */

function doPost(e) {
  var params = (e && e.parameter) || {};

  // 1. The honeypot. A bot gets the same page a person gets and learns nothing.
  if (clean_(params.website)) return confirmationPage_();

  // 2. Required answers.
  var values = {};
  var missing = [];
  for (var i = 0; i < FIELDS.length; i++) {
    var field = FIELDS[i];
    var value = clean_(params[field.name]).slice(0, MAX_FIELD);
    if (field.required && !value) missing.push(field.label);
    values[field.name] = value;
  }
  if (values.email && !EMAIL_RE.test(values.email)) missing.push('A working email address');
  if (values.role && ROLES.indexOf(values.role) === -1) missing.push('Applying for');
  if (missing.length) return problemPage_(missing);

  // 3. The same answers twice in ten minutes is one application.
  var cache = CacheService.getScriptCache();
  var key = fingerprint_(values);
  if (cache.get(key)) return confirmationPage_();

  // 5, done first so the email can say which row it is. The lock keeps two
  // simultaneous first submissions from creating two workbooks.
  var where = { stored: false, row: 0, url: '' };
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    where = store_(values);
  } catch (err) {
    console.error('Could not store the application: ' + err);
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }

  // 4. The email.
  var sent = false;
  try {
    notifyOwner_(values, where);
    sent = true;
  } catch (err) {
    console.error('Could not email the application: ' + err);
  }

  if (!sent && !where.stored) return failurePage_();
  cache.put(key, '1', REPEAT_WINDOW_SECONDS);
  return confirmationPage_();
}

/* ================================================================== *
 * GET — someone opened the address in a browser
 * ================================================================== */

function doGet() {
  return page_(
    'This address only takes the join form',
    '<p>This is the receiving end of the form on ' + SITE_NAME + '\'s website, and it ' +
    'only accepts an application sent from that page.</p>' +
    '<p><a href="' + JOIN_PAGE + '">Go to the form on satishregonda.in</a></p>'
  );
}

/* ================================================================== *
 * Setup check — run once from the editor before deploying
 * ================================================================== */

/** Asks for the two permissions this script needs, creates the Applicants
 *  sheet, and emails a clearly marked sample to the owner. */
function testSetup() {
  var sample = {
    name: 'Test applicant (sent by testSetup)',
    email: ownerAddress_(),
    role: 'PhD',
    interests: 'A test of the join form. Nobody applied; delete this row.',
    background: 'Sent from the Apps Script editor to check that email and the sheet both work.',
    why: 'To confirm the form is ready before it goes live.',
    hopes: 'That every real application arrives like this one.',
    cv_url: ''
  };
  var where = store_(sample);
  notifyOwner_(sample, where);
  Logger.log('Sample emailed to ' + ownerAddress_() + '. Applications sheet: ' + where.url +
    ' (row ' + where.row + ' is the sample; delete it).');
}

/* ================================================================== *
 * The sheet
 * ================================================================== */

function store_(values) {
  var book = book_();
  var sheet = applicantsSheet_(book);
  var row = [new Date()];
  for (var j = 0; j < FIELDS.length; j++) row.push(values[FIELDS[j].name]);
  row.push(''); // Replied — his own column, filled in by hand
  sheet.appendRow(row);
  return {
    stored: true,
    row: sheet.getLastRow(),
    url: book.getUrl() + '#gid=' + sheet.getSheetId()
  };
}

/** The configured workbook, the one this script is bound to, or — the first
 *  time, with neither — a new one, remembered for every later submission. */
function book_() {
  var id = prop_('SPREADSHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  var bound = SpreadsheetApp.getActiveSpreadsheet();
  if (bound) return bound;
  var made = SpreadsheetApp.create(WORKBOOK_NAME);
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', made.getId());
  return made;
}

function applicantsSheet_(book) {
  var sheet = book.getSheetByName(APPLICANTS_TAB);
  if (sheet) return sheet;

  var sheets = book.getSheets();
  if (sheets.length === 1 && sheets[0].getLastRow() === 0) {
    sheet = sheets[0].setName(APPLICANTS_TAB); // a new workbook's empty Sheet1
  } else {
    sheet = book.insertSheet(APPLICANTS_TAB);
  }
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 150);
  for (var c = 5; c <= 8; c++) sheet.setColumnWidth(c, 320); // the four answers
  sheet.getRange(2, 5, sheet.getMaxRows() - 1, 4).setWrap(true);
  return sheet;
}

/* ================================================================== *
 * The email
 * ================================================================== */

function notifyOwner_(values, where) {
  var cc = prop_('CC_EMAIL');
  var subject = SUBJECT + ': ' + values.name + ' (' + values.role + ')';

  var text = [values.name + ' applied for ' + values.role + ' through satishregonda.in.', ''];
  var blocks = [];
  for (var i = 0; i < FIELDS.length; i++) {
    var field = FIELDS[i];
    var value = values[field.name];
    text.push(field.label + ':', value || 'not given', '');
    blocks.push(
      '<p style="margin:0 0 4px;font:600 12px/1.4 Menlo,Consolas,monospace;letter-spacing:.03em;color:' + MUTE + '">' +
        escape_(field.label) + '</p>' +
      '<p style="margin:0 0 20px;white-space:pre-wrap">' + fieldHtml_(field.name, value) + '</p>'
    );
  }

  var footerText = where.stored
    ? 'This is row ' + where.row + ' of the Applicants sheet: ' + where.url
    : 'The sheet could not be written to just now, so this email is the only copy. Keep it.';
  var footerHtml = where.stored
    ? 'This is row ' + where.row + ' of the <a href="' + escape_(where.url) + '" style="color:' + ACCENT + '">Applicants sheet</a>.'
    : 'The sheet could not be written to just now, so this email is the only copy. Keep it.';
  text.push(footerText, 'Reply to this email to answer ' + values.name + ' directly.');

  var html =
    '<div style="max-width:640px;font:16px/1.55 Georgia,\'Palatino Linotype\',Palatino,serif;color:' + INK + '">' +
      '<p style="margin:0 0 24px;font-size:20px;line-height:1.35"><strong>' + escape_(values.name) +
        '</strong> applied for <strong>' + escape_(values.role) + '</strong> through satishregonda.in.</p>' +
      blocks.join('') +
      '<hr style="border:0;border-top:1px solid ' + RULE + ';margin:4px 0 16px">' +
      '<p style="margin:0 0 6px;font-size:14px;color:' + MUTE + '">' + footerHtml + '</p>' +
      '<p style="margin:0;font-size:14px;color:' + MUTE + '">Reply to this email to answer ' +
        escape_(values.name) + ' directly.</p>' +
    '</div>';

  MailApp.sendEmail({
    to: ownerAddress_(),
    cc: cc || undefined,
    replyTo: values.email,
    name: 'satishregonda.in join form',
    subject: subject,
    body: text.join('\n'),
    htmlBody: html
  });
}

function fieldHtml_(name, value) {
  if (!value) return '<span style="color:' + MUTE + '">not given</span>';
  var safe = escape_(value);
  if (name === 'email') {
    return '<a href="mailto:' + safe + '" style="color:' + ACCENT + '">' + safe + '</a>';
  }
  if (name === 'cv_url' && /^https?:\/\//i.test(value)) {
    return '<a href="' + safe + '" style="color:' + ACCENT + '">' + safe + '</a>';
  }
  return safe;
}

/* ================================================================== *
 * Pages
 *
 * The site's own paper, ink and serif, so the applicant does not feel handed
 * off to a form service. Piazzolla is self-hosted on the site and cannot load
 * here, so this uses the same Palatino fallback chain. Square corners, no
 * shadows, the accent only as a link colour.
 *
 * Apps Script serves these inside a frame on script.google.com, so every link
 * targets the top window: without it, "back to the site" would try to open the
 * site inside Google's frame, and the site's own headers forbid being framed.
 * ================================================================== */

function page_(heading, bodyHtml) {
  var html =
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<base target="_top">' +
    '<title>' + escape_(heading) + ' — ' + SITE_NAME + '</title><style>' +
    'html,body{background:' + PAPER + ';}' +
    'body{margin:0;padding:12vh 1.5rem 6rem;color:' + INK + ';' +
    'font-family:"Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif;' +
    'font-size:1.125rem;line-height:1.6;}' +
    'main{max-width:34rem;margin:0 auto;}' +
    'h1{font-size:1.75rem;line-height:1.2;font-weight:600;margin:0 0 1.5rem;}' +
    'p{margin:0 0 1rem;}' +
    'a{color:' + ACCENT + ';text-decoration:underline;text-underline-offset:2px;}' +
    'a:hover{color:#0E4A42;}' +
    'ul{margin:0 0 1rem;padding-left:1.1rem;}' +
    'li{margin-bottom:.35rem;}' +
    '.rule{border:0;border-top:1px solid ' + RULE + ';margin:2rem 0 1rem;}' +
    '.meta{font-family:Menlo,Consolas,monospace;font-size:.8125rem;letter-spacing:.02em;color:' + MUTE + ';}' +
    '</style></head><body><main>' +
    '<p class="meta">satishregonda.in</p>' +
    '<h1>' + escape_(heading) + '</h1>' +
    bodyHtml +
    '<hr class="rule">' +
    '<p class="meta"><a href="' + JOIN_PAGE + '">Back to satishregonda.in</a></p>' +
    '</main></body></html>';

  return HtmlService.createHtmlOutput(html).setTitle(heading + ' — ' + SITE_NAME);
}

function confirmationPage_() {
  var owner = escape_(ownerAddress_());
  return page_(
    'Your application has been sent',
    '<p>Everything you entered has been emailed to Dr. Regonda. There is no need to ' +
    'send it again.</p>' +
    '<p>If you want to add something later, write to ' +
    '<a href="mailto:' + owner + '">' + owner + '</a>.</p>'
  );
}

function problemPage_(missing) {
  var items = missing.map(function (label) { return '<li>' + escape_(label) + '</li>'; }).join('');
  return page_(
    'A few answers are still needed',
    '<p>Nothing has been sent yet. The form still needs:</p>' +
    '<ul>' + items + '</ul>' +
    '<p>Use your browser\'s back button to return to the form. What you typed is still there.</p>'
  );
}

function failurePage_() {
  var owner = escape_(ownerAddress_());
  return page_(
    'That did not go through',
    '<p>Nothing was sent: the form could not reach Dr. Regonda\'s inbox just now.</p>' +
    '<p>Go back and try again in a few minutes — what you typed is still in the form — or ' +
    'email the same answers to <a href="mailto:' + owner + '">' + owner + '</a> with the ' +
    'subject "' + SUBJECT + '".</p>'
  );
}

/* ================================================================== *
 * Small helpers
 * ================================================================== */

function clean_(value) {
  return String(value === undefined || value === null ? '' : value).trim();
}

function fingerprint_(values) {
  var raw = [values.email.toLowerCase(), values.role, values.interests,
    values.background, values.why, values.hopes].join(SEPARATOR);
  var digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw, Utilities.Charset.UTF_8);
  return 'sent:' + Utilities.base64EncodeWebSafe(digest);
}

function escape_(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
