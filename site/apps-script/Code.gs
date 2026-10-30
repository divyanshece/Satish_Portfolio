/**
 * satishregonda.in — the publish button.
 *
 * This script is bound to the content workbook (Extensions, Apps Script). It
 * does three jobs and nothing else:
 *
 *   1. Watches the publish_now checkbox on the Settings tab. Tick it and the
 *      website rebuilds.
 *   2. Adds a Website menu, so publishing does not depend on remembering where
 *      the checkbox is.
 *   3. Every fifteen minutes, asks GitHub how the last build went, writes the
 *      answer into the _Publish Log tab, and emails a plain-English explanation
 *      when something did not publish.
 *
 * WHY THE LOG IS WRITTEN HERE AND NOT BY THE BUILD
 * ------------------------------------------------
 * The build reads the sheet with a service account whose only permission is
 * spreadsheets.readonly. That is deliberate and is the main safety property of
 * the whole pipeline: a broken build, a bad merge or a stolen CI secret can
 * never alter, reorder or delete his content, because the credential that
 * touches the sheet physically cannot write to it. A read-only credential also
 * cannot append a log row. So the log is written from this side instead, by a
 * script that already runs as him and already has the sheet open. The cost is
 * that the log lags by up to fifteen minutes; the benefit is that the content
 * is not writable by anything running in CI.
 *
 * SETUP, ONCE
 * -----------
 *   1. Extensions, Apps Script. Paste this file in as Code.gs.
 *   2. Project Settings, Script Properties. Add:
 *        GITHUB_TOKEN         a fine-grained personal access token with
 *                             Contents: read and Actions: read and write, on
 *                             this one repository only.        <-- FILL IN
 *        GITHUB_REPO          owner/repository, e.g. someone/satishregonda-in
 *                                                              <-- FILL IN
 *        OWNER_EMAIL          satishr@ce.iith.ac.in            <-- CONFIRM
 *        SECOND_OWNER_EMAIL   the named second owner           <-- FILL IN
 *        SITE_URL             https://satishregonda.in
 *      The token lives here and never in this file. Anyone who can read the
 *      code cannot read the token, and rotating it is editing one property.
 *   3. Run installTriggers() once, from the editor, and accept the permission
 *      prompt. It installs the two triggers this script needs.
 *   4. Reload the sheet. The Website menu appears next to Help.
 *
 * Everything a human reads from this script is written in plain English. If you
 * change a message, keep it a sentence someone can act on without opening a log.
 */

/* ================================================================== *
 * Configuration
 * ================================================================== */

var SETTINGS_TAB = 'Settings';
var LOG_TAB = '_Publish Log';
var PUBLISH_KEY = 'publish_now';
var WORKFLOW_FILE = 'publish.yml';
var EVENT_TYPE = 'publish';

/** Two clicks a minute apart are one publish, not two builds. */
var DEBOUNCE_MINUTES = 3;

var LOG_HEADERS = ['When', 'What happened', 'Detail', 'Who', 'Run'];

function prop_(name) {
  return (PropertiesService.getScriptProperties().getProperty(name) || '').trim();
}

function book_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

/* ================================================================== *
 * Menu
 * ================================================================== */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Website')
    .addItem('Publish now', 'publishNow')
    .addItem('Check publish status', 'checkPublishStatus')
    .addToUi();
}

/** Menu: Website, Publish now. */
function publishNow() {
  var result = requestPublish_('the Website menu');
  book_().toast(result.message, 'Website', 8);
}

/** Menu: Website, Check publish status. */
function checkPublishStatus() {
  var ui = SpreadsheetApp.getUi();
  var repo = prop_('GITHUB_REPO');
  if (!repo) {
    ui.alert('Website', 'This sheet is not connected to the website yet. ' +
      'GITHUB_REPO has not been filled in. Ask the developer.', ui.ButtonSet.OK);
    return;
  }
  var run = latestRun_();
  if (!run) {
    ui.alert('Website', 'No build has run yet, or GitHub could not be reached just now. ' +
      'The website is still showing its last good version either way.', ui.ButtonSet.OK);
    return;
  }
  ui.alert('Website', describeRun_(run) + '\n\n' + run.html_url, ui.ButtonSet.OK);
}

/* ================================================================== *
 * The checkbox
 *
 * Installed by installTriggers() as an installable onEdit trigger. A simple
 * onEdit function would not do: simple triggers may not call UrlFetchApp or
 * MailApp, which is exactly what this needs to do.
 * ================================================================== */

function onEditPublish(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== SETTINGS_TAB) return;

  // Settings is a key/value tab: column A holds the key, column B the value.
  if (e.range.getColumn() !== 2 || e.range.getNumRows() !== 1) return;
  var key = String(sheet.getRange(e.range.getRow(), 1).getValue()).trim();
  if (key !== PUBLISH_KEY) return;

  var ticked = e.range.getValue();
  if (ticked !== true && String(ticked).toUpperCase() !== 'TRUE') return;

  // Untick first, before anything that can fail or take time. The box is a
  // button, not a setting, and it must always come back up.
  e.range.setValue(false);
  SpreadsheetApp.flush();

  var result = requestPublish_('the publish_now checkbox');
  book_().toast(result.message, 'Website', 8);
}

/**
 * Ask GitHub to build the site.
 *
 * Returns { dispatched: boolean, message: string }. Never throws at the caller:
 * a failure here has to end as a sentence in a toast, not a red error dialog.
 */
function requestPublish_(who) {
  var lock = LockService.getDocumentLock();
  if (!lock.tryLock(10000)) {
    return {
      dispatched: false,
      message: 'A publish is already starting. Your changes are included in it.'
    };
  }

  try {
    if (recentEntry_(DEBOUNCE_MINUTES)) {
      // A build takes two or three minutes and always reads the sheet as it is
      // at that moment, so a second build started now would publish exactly the
      // same thing. Saying so is friendlier than starting it.
      return {
        dispatched: false,
        message: 'A publish is already running. Your changes are included in it.'
      };
    }

    var repo = prop_('GITHUB_REPO');
    var token = prop_('GITHUB_TOKEN');
    if (!repo || !token) {
      var missing = !repo && !token ? 'GITHUB_REPO and GITHUB_TOKEN are' :
        (!repo ? 'GITHUB_REPO is' : 'GITHUB_TOKEN is');
      appendLog_('Not published', 'This sheet is not connected to the website yet: ' +
        missing + ' not set in Script Properties.', who, '');
      return {
        dispatched: false,
        message: 'Not published. This sheet is not connected to the website yet. ' +
          'Ask the developer to finish the setup.'
      };
    }

    var response = UrlFetchApp.fetch('https://api.github.com/repos/' + repo + '/dispatches', {
      method: 'post',
      contentType: 'application/json',
      muteHttpExceptions: true,
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      payload: JSON.stringify({
        event_type: EVENT_TYPE,
        client_payload: { requested_by: who, requested_at: new Date().toISOString() }
      })
    });

    var code = response.getResponseCode();
    if (code === 204) {
      // Logged now, not in fifteen minutes: this row is what stops a second
      // click in the next three minutes from starting a second build.
      appendLog_('Publish requested', 'The website is rebuilding. It takes two to ' +
        'three minutes.', who, '');
      return {
        dispatched: true,
        message: 'Publishing. The website updates in two to three minutes.'
      };
    }

    var reason = code === 401 || code === 403
      ? 'GitHub refused the access token. It has probably expired and needs replacing.'
      : (code === 404
        ? 'GitHub could not find the repository ' + repo + '. Check GITHUB_REPO.'
        : 'GitHub replied with error ' + code + '.');
    appendLog_('Not published', reason, who, '');
    notify_('The website did not start publishing',
      'You ticked publish now, but the build never started.\n\n' + reason +
      '\n\nNothing on the website has changed. It is still showing the last good version.');
    return { dispatched: false, message: 'Not published. ' + reason };
  } catch (err) {
    appendLog_('Not published', 'Could not reach GitHub: ' + err.message, who, '');
    return {
      dispatched: false,
      message: 'Not published. The sheet could not reach GitHub just now. ' +
        'Try again in a few minutes; the website is unaffected.'
    };
  } finally {
    lock.releaseLock();
  }
}

/* ================================================================== *
 * The log
 * ================================================================== */

function logSheet_() {
  var book = book_();
  var sheet = book.getSheetByName(LOG_TAB);
  if (!sheet) {
    sheet = book.insertSheet(LOG_TAB);
    sheet.appendRow(LOG_HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, LOG_HEADERS.length).setFontWeight('bold');
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 150);
    sheet.setColumnWidth(3, 520);
  }
  return sheet;
}

function appendLog_(what, detail, who, runUrl) {
  var sheet = logSheet_();
  sheet.appendRow([new Date(), what, detail, who || '', runUrl || '']);
  // Old rows are history, not evidence. Keep a year of publishes and no more.
  var extra = sheet.getLastRow() - 1 - 500;
  if (extra > 0) sheet.deleteRows(2, extra);
}

/** True if anything was written to the log in the last `minutes` minutes. */
function recentEntry_(minutes) {
  var sheet = logSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var first = Math.max(2, last - 9);
  var rows = sheet.getRange(first, 1, last - first + 1, 2).getValues();
  var cutoff = Date.now() - minutes * 60 * 1000;
  for (var i = 0; i < rows.length; i++) {
    var when = rows[i][0];
    if (when instanceof Date && when.getTime() >= cutoff) return true;
  }
  return false;
}

/* ================================================================== *
 * Watching the build
 * ================================================================== */

function github_(path) {
  var repo = prop_('GITHUB_REPO');
  var token = prop_('GITHUB_TOKEN');
  if (!repo || !token) return null;
  var response = UrlFetchApp.fetch('https://api.github.com/repos/' + repo + path, {
    method: 'get',
    muteHttpExceptions: true,
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (response.getResponseCode() !== 200) return null;
  return JSON.parse(response.getContentText());
}

/**
 * The newest publish build.
 *
 * publish.yml also runs on pull requests, to gate code. Those runs are not
 * publishes and must never appear in his log, so they are filtered out here.
 */
function latestRun_() {
  var data = github_('/actions/workflows/' + WORKFLOW_FILE + '/runs?per_page=10');
  if (!data || !data.workflow_runs) return null;
  var publishing = ['repository_dispatch', 'schedule', 'workflow_dispatch'];
  for (var i = 0; i < data.workflow_runs.length; i++) {
    var run = data.workflow_runs[i];
    if (publishing.indexOf(run.event) !== -1) return run;
  }
  return null;
}

/**
 * Runs every fifteen minutes. Writes a log row when the state of the newest
 * build has changed, and emails when a publish did not fully happen. It logs
 * on change rather than on every poll, so the log stays a list of publishes
 * instead of ninety-six identical rows a day.
 */
function pollBuildStatus() {
  var run = latestRun_();
  if (!run) return;

  var key = run.id + ':' + run.status + ':' + (run.conclusion || '');
  var store = PropertiesService.getScriptProperties();
  if (store.getProperty('LAST_RUN_KEY') === key) return;
  store.setProperty('LAST_RUN_KEY', key);

  if (run.status !== 'completed') return; // still building; nothing to report yet

  var who = triggerWords_(run.event);

  if (run.conclusion === 'success') {
    var report = publishReport_();
    var skips = report.skipped;
    if (skips.length) {
      var detail = 'Published with ' + skips.length + ' item' +
        (skips.length === 1 ? '' : 's') + ' skipped — ' + skips.join(' ');
      appendLog_('Published, partly', detail, who, run.html_url);
      notify_('The website published, with ' + skips.length + ' item' +
        (skips.length === 1 ? '' : 's') + ' left out',
        detail + '\n\n' +
        'Everything else is live. Each line above names the tab and the row, so ' +
        'you can fix that one cell and tick publish now again.\n\n' + run.html_url);
      return;
    }
    appendLog_('Published', 'Everything on the sheet is now live on the website.',
      who, run.html_url);
    return;
  }

  if (run.conclusion === 'cancelled' || run.conclusion === 'skipped') {
    appendLog_('Not published', 'The build was ' + run.conclusion + '. Nothing on the ' +
      'website has changed.', who, run.html_url);
    return;
  }

  var why = failureReason_(run);
  appendLog_('Not published', why, who, run.html_url);
  notify_('The website did not publish',
    why + '\n\nNothing on the website has changed. It is still showing the last good ' +
    'version, so nobody visiting the site sees a problem.\n\n' +
    'Fix the sheet and tick publish now again. If the message above does not make ' +
    'sense, docs/RUNBOOK.md explains every one of them.\n\n' + run.html_url);
}

function triggerWords_(event) {
  if (event === 'schedule') return 'the twice-daily automatic publish';
  if (event === 'workflow_dispatch') return 'a manual build on GitHub';
  return 'the sheet';
}

function describeRun_(run) {
  if (run.status !== 'completed') {
    return 'A publish is running now. It started at ' +
      Utilities.formatDate(new Date(run.created_at), Session.getScriptTimeZone(),
        'd MMM yyyy, HH:mm') + ' and usually takes two to three minutes.';
  }
  if (run.conclusion === 'success') {
    var report = publishReport_();
    if (report.skipped.length) {
      return 'The last publish went out with ' + report.skipped.length +
        ' item(s) left out:\n\n' + report.skipped.join('\n');
    }
    return 'The last publish went out cleanly at ' +
      Utilities.formatDate(new Date(run.updated_at), Session.getScriptTimeZone(),
        'd MMM yyyy, HH:mm') + '. Everything on the sheet is live.';
  }
  return 'The last publish did not go out.\n\n' + failureReason_(run) +
    '\n\nNothing on the website has changed.';
}

/**
 * What the site itself says about the last successful publish.
 *
 * The build writes publish-status.json next to the pages it deploys, so this is
 * read from the website rather than from GitHub. It is one small public file
 * and needs no token.
 */
function publishReport_() {
  var site = prop_('SITE_URL') || 'https://satishregonda.in';
  try {
    var response = UrlFetchApp.fetch(site.replace(/\/$/, '') + '/publish-status.json', {
      muteHttpExceptions: true
    });
    if (response.getResponseCode() !== 200) return { skipped: [] };
    var data = JSON.parse(response.getContentText());
    var skipped = [].concat(data.attention || [], data.build_skipped || []);
    return { skipped: skipped, data: data };
  } catch (err) {
    return { skipped: [] };
  }
}

/**
 * The sentence that explains a failed build.
 *
 * The sync script prints its own explanation between two markers precisely so
 * this can quote it back to him. If the log cannot be fetched or unzipped, fall
 * back to naming the step that failed, which is still better than a run number.
 */
function failureReason_(run) {
  var fromLog = failureFromLog_(run.id);
  if (fromLog) return fromLog;

  var jobs = github_('/actions/runs/' + run.id + '/jobs');
  if (jobs && jobs.jobs) {
    for (var i = 0; i < jobs.jobs.length; i++) {
      var steps = jobs.jobs[i].steps || [];
      for (var j = 0; j < steps.length; j++) {
        if (steps[j].conclusion === 'failure') {
          if (steps[j].name.indexOf('sheet') !== -1 || steps[j].name.indexOf('sync') !== -1) {
            return 'The sheet could not be read, so nothing was published. Open the run ' +
              'linked in this row to see which tab or column is the problem.';
          }
          if (steps[j].name.indexOf('build') !== -1) {
            return 'The website could not be built from the sheet. This is usually one ' +
              'row with something missing in it. Open the run linked in this row.';
          }
          if (steps[j].name.indexOf('Deploy') !== -1 || steps[j].name.indexOf('deploy') !== -1) {
            return 'The website was built but could not be uploaded. This is a Cloudflare ' +
              'problem, not a sheet problem. Try publishing again in ten minutes.';
          }
          return 'The step "' + steps[j].name + '" failed.';
        }
      }
    }
  }
  return 'The build failed. Open the run linked in this row to see why.';
}

/** Pull the sync script's own explanation out of the run's log archive. */
function failureFromLog_(runId) {
  try {
    var repo = prop_('GITHUB_REPO');
    var token = prop_('GITHUB_TOKEN');
    if (!repo || !token) return '';
    var response = UrlFetchApp.fetch(
      'https://api.github.com/repos/' + repo + '/actions/runs/' + runId + '/logs',
      {
        method: 'get',
        muteHttpExceptions: true,
        followRedirects: true,
        headers: {
          Authorization: 'Bearer ' + token,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      }
    );
    if (response.getResponseCode() !== 200) return '';

    var blob = response.getBlob();
    if (blob.getBytes().length > 12 * 1024 * 1024) return ''; // do not chew a huge archive
    var files = Utilities.unzip(blob.setContentType('application/zip'));

    for (var i = 0; i < files.length; i++) {
      var text = files[i].getDataAsString();
      var start = text.indexOf('--- WHAT WENT WRONG ---');
      if (start === -1) continue;
      var end = text.indexOf('--- END ---', start);
      if (end === -1) end = Math.min(text.length, start + 4000);
      var body = text.substring(start + '--- WHAT WENT WRONG ---'.length, end);
      // Actions prefixes every log line with a timestamp. Strip it.
      var lines = body.split('\n').map(function (line) {
        return line.replace(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z\s?/, '').trim();
      }).filter(function (line) { return line.length > 0; });
      if (lines.length) return lines.join(' ');
    }
    return '';
  } catch (err) {
    return '';
  }
}

/* ================================================================== *
 * Email
 * ================================================================== */

function recipients_() {
  var list = [prop_('OWNER_EMAIL'), prop_('SECOND_OWNER_EMAIL')].filter(function (address) {
    return address.length > 0;
  });
  return list.join(',');
}

/**
 * Both owners are told, always. A site whose failure email reaches one person
 * is a site that stays broken while that person is on a field trip.
 */
function notify_(subject, body) {
  var to = recipients_();
  if (!to) return;
  var signature = '\n\n— \nSent by the website publishing script attached to the ' +
    'content sheet. The runbook is docs/RUNBOOK.md in the website repository.';
  MailApp.sendEmail({
    to: to,
    subject: 'Website: ' + subject,
    body: body + signature
  });
}

/* ================================================================== *
 * Setup. Run once, by hand, from the editor.
 * ================================================================== */

function installTriggers() {
  var book = book_();
  var existing = ScriptApp.getProjectTriggers();
  for (var i = 0; i < existing.length; i++) {
    var name = existing[i].getHandlerFunction();
    if (name === 'onEditPublish' || name === 'pollBuildStatus') {
      ScriptApp.deleteTrigger(existing[i]);
    }
  }

  ScriptApp.newTrigger('onEditPublish').forSpreadsheet(book).onEdit().create();
  ScriptApp.newTrigger('pollBuildStatus').timeBased().everyMinutes(15).create();

  logSheet_();
  book.toast('The publish button is connected. Tick publish_now on the Settings tab ' +
    'to try it.', 'Website', 10);
}

/** A one-off check that the setup is complete. Run it from the editor. */
function checkSetup() {
  var missing = ['GITHUB_TOKEN', 'GITHUB_REPO', 'OWNER_EMAIL', 'SECOND_OWNER_EMAIL']
    .filter(function (name) { return !prop_(name); });
  var lines = missing.length
    ? 'Still to fill in, in Project Settings, Script Properties: ' + missing.join(', ')
    : 'All script properties are set.';
  var run = latestRun_();
  Logger.log(lines + '\n' + (run ? describeRun_(run) : 'No build has run yet.'));
}
