# Preconnect home page — testing guide

`node tests/run_all.js` runs the suite against `tests/fixture.json` and `tests/fixtures/`, which hold real saved data produced by playing every module. The checks cover: reading every module's records, readable activity names, exact record counts, the combined CSV (including crediting every crew member on a drill-night call), older Charge the Line summary-only data, backup → restore on a fresh device, rejecting bad or damaged backups without a half-restore, and the offline helper leaving every module folder alone.

**When a module changes how it saves data, regenerate the fixture** by playing that module's bots and re-saving its storage key into `fixture.json`. Then rerun this suite. The hub has its own copy of each module's activity-name table (`L` in index.html), so a new scenario or drill needs a line there too, or the `readable name` check will fail.

**Shared-domain rules every module must follow:**
1. Each app lives in its own folder and registers its own `sw.js`.
2. Each offline helper clears **only its own** old caches (`k.startsWith('<slug>-v')`). Clearing everything wipes the other apps' offline copies.
3. Only the home page's helper handles root files, and it leaves every folder alone.
4. Each module keeps its own storage key: `e102-pump-trainer`, `patient-contact`, `bleed-control`, `bls-ready`. Plus `preconnect` for the hub.

## Milestone 1 checks (added October 2026)

Foundation fixes: fonts served from this site, screen wake lock, finger-sized buttons. The `syntax` section (the hub: the plain list) now also proves:
- Fonts: every root page (`index.html`, `privacy.html`, `feedback.html`) serves its type from `fonts/`, references nothing on Google, and each font file is in the service worker's `CORE` list. `ownFile` also covers `/fonts/`.
- Install hint: shown to an iPhone browser, hidden for good once dismissed, never shown when installed or in a browser that can't install.
- Privacy page says nothing loads from Google.

## Milestone 2 checks (added October 2026)

- Today view: picks up where you left off (module, activity, score, Continue link), counts this week, and shows a lesson prompt on an empty phone.
- Module progress counts distinct activities and never exceeds the total taken from the `L` name table.
- Settings: saved under `preconnect-settings`, applied to `<html>` as `data-text` / `data-contrast` / `data-motion`; the statistics switch is the Privacy page's key.
- Score count-up lands on the exact value when animation frames are unavailable.
- Reduce Motion and Motion = Off rules exist in the CSS.
- `tests/browser_check.py`: home and Settings at 320/390 px, normal and large text, no overflow (fixed elements included), no button under 44 px tall or wide, no text under the floor (15 px for a sentence, 13 px for a caption).

## Milestone 3 checks (added October 2026)

- Shared core: `preconnect-core.js` is loaded before the app script, listed in the service worker's cache, and its header hash matches its body (edit it, re-stamp with the hub's `node tests/core_hash.js`, copy to every repo).
- Spacing: 1, 3, 7, 14, 30 days after each clear at 70+; a miss resets; overdue reads as due.
- Debrief body: compare line (best, last time, new best), metrics table, what cost points, lesson chips, steps table.
- Due for review cards on the Today view, most overdue first; a miss reads "try again". Sibling repos' core copies must be identical when checked out side by side.

## Milestone 4 checks (added October 2026)

- The motion rules are checked in the shared core now (the hub no longer carries its own copy of the look CSS).

## Milestone 5 part one checks (added October 2026)

- Charge the Line lesson and drill runs (`extra[]`) appear in the record with readable names from `L.ctlX`, and count toward the module's tile total (15 activities).

## Milestone 5 part two checks (added October 2026)

- A Charge the Line run with a layout letter shows "Layout B" in the Patient column, and an instructor-injected run reads "Recall · instructor" in Mode; plain runs are unchanged.

## Milestone 7 checks (added October 2026)

- Drill Night session (core): names trimmed and deduplicated, `pcDrillStamp` adds who, instructor and night, a new name joins the roster, ending keeps the roster, no session means no stamping.
- The board: `tonight()` is only the runs stamped with this night; the card counts runs and people; the board lists the roster with bests and tonight's runs; tonight's CSV has one row per person with the instructor; the picker escapes names (a quote or a tag in a name cannot break the button); switching who; ending takes two taps and leaves the set-up card and the roster.
- Set-up form: instructor and roster from the form, the picker opens at once, the card becomes the live card.
- Browser check: set-up form, picker, live card and board at 320 and 390 px.

## BLS depth pack (October 2026)

- `L.bls` names the new station, scenarios and drill (child2, pool, crib, special); the Today-view check expects 19 BLS activities.

## Milestone 6 checks (added October 2026)

- Core sound and haptics with a fake AudioContext (records every tone) and a fake vibrate (records every pattern): silent with sound off, haptics follow their switch, turning sound on previews 660/990 Hz, the bad cue is 220 Hz with a 30/40/30 buzz, the metronome schedules 880 Hz ticks at 110 and stops.

## Patient Contact lesson (October 2026)

- `L.pcDrill.lesson` names it and a `drillRuns` row with `drill:'lesson'` shows as type Lesson; Patient Contact's tile total is 16.

## Milestone 9 checks (added October 2026)

- Daily drill: twenty consecutive day numbers give twenty different drills across all five modules, each with a readable name and a deep link under its module path; day 17 repeats day 1. Done-today is true only for that module's drill with that name recorded today.
- Progression: streak counts consecutive days ending today or yesterday; level is one per eight activities (17 done = level 3, one into it); the Today view shows the daily card and the level card, and an empty phone reads level 1.

## Milestone 10 checks (added October 2026)

- Core: Daylight tokens, focus outlines and the landscape rule are in the look CSS; Daylight applies to the page; a stubbed `prefers-contrast: more` turns Off into High but never overrides Daylight; `pcA11y` sets `aria-live` on a feedback line; the settings sheet has the Daylight button.
- Browser check: a landscape page (844 by 390) for the home list, the same in Daylight, and the settings sheet in landscape; fails on overflow, buttons under 44 px tall or wide, or text under the floor.

## Platform privacy check (October 3, 2026)

- `tests/platform_check.py` now opens the settings sheet before typing the name (the field moved there in Milestone 2). Run against the assembled site on October 3, 2026 after Milestone 10: every module sends start, quit and error events, no name or organization appears in any event, and the opt-out stops everything.

## Instructor mode in every module (added October 3, 2026)

- `records`: a Bleed Control or BLS Ready run with `inst:1` shows "· instructor" in Mode and leaves the Instructor column empty; a run stamped with an instructor's name on a drill night fills the column instead.

## Upwind U0 (added October 3, 2026)

- `links to all five module folders`; `ownFile` leaves `/upwind/` alone; a boot with an `upwind` key shows the tile with 16 planned activities, reads a drill and an incident with readable names, `Chaos · instructor` and `Layout B`, and includes the key in a backup. The fixture progress check now tolerates a module with no records yet.

## Upwind U1 (added October 3, 2026)

- The fixture gains an `upwind` key with a lesson run and three drill runs produced by Upwind's own harness; `reads records from all five modules`, exact counts, backup → restore (five modules). `DAILY` has twenty entries across five modules; the daily test checks twenty distinct picks and the cycle. `platform_check.py` opens Upwind's placard drill and quits it, and requires `uw/start/` and `uw/quit/` events.

## Offline helper (final sweep milestone 1, October 10, 2026)
- Page and core network-first with a short wait, only 2xx saved, `cache:'reload'` installs, index cached once, module tile icons cached on first load (`moduleIcon` rule tested with module paths that must not match). Proven in a browser (scratch): first launch after a deploy runs the new page with the new core; a hanging network shows the saved page in under 4 s; a 404 serves the saved page; the hub's tile icons load offline.

## Saved data (final sweep milestone 1, October 10, 2026)
- CSV cells starting with `= + - @` or a tab get a leading apostrophe (training record and Drill Night CSV; `toCSV` → core `pcCsv`).
- `restore()` refuses wrong-shape values (a list, a number, a list where an object belongs, a bad statistics value) and accepts the right shapes including settings and the statistics switch; a backup carries both.
- `tests/fixtures/`: 21 older saved-data files from every module read into the record and the Today view; a hub 1.0.0 backup restores. Proven to fail (scratch): removing the CSV defusing or the shape check fails its check.

## Rule 15 (final sweep milestone 2, October 10, 2026)
- The core's pause hook: subscribers hear one hide and one show with the seconds away; repeats are ignored; `pcPauseBind` is wired from `settingsBind` and listens for `visibilitychange`.

## Truth and counts (final sweep milestone 3, October 10, 2026)
- A Charge the Line `extra` entry `{kind:'drill',id:'math'}` reads as "Pump math", type Drill, and the tile total is 21 (`L.ctl.length + L.ctlX` keys, nothing subtracted).
- The docs are tested: `CLAUDE.md`'s "Current version" must equal `APP_VERSION`, and `README.txt` must name `preconnect-core.js` and `fonts/`. Every module's suite has the same check. Check counts are no longer stated in prose anywhere; name the section instead.
- The legal line names the four bodies whose courses and documents the platform models (ACS via the DoD trademark, the AHA, PHMSA, the NFPA) and the words "either organization" are gone.

## One voice (final sweep milestone 5, October 10, 2026)

- The core's shared pieces: `pcTierHelp` is one base sentence per tier plus the module clause; `pcTag` has its fixed texts and is a 13 px caption; `pcResultRow` is Again · Home · Next with Next primary when there is one and Home otherwise; `pcLinks` and `pcAboutFoot` link back to Preconnect and to Feedback for the module as 44 px tap targets and carry the version line; `pcBandClass` tints a result's big number by band; the lesson and quiz engines say "Stop and go back"; `pcProfile`/`pcProfileSet` read and write the hub's own profile key; `pcGearShould` shows the floating Settings button over an overlay with no Settings of its own and never over the home, the sheet itself, the instructor sheet or the Drill Night picker; `#setov` sits above every overlay. The hub's sheet says Vibration.
