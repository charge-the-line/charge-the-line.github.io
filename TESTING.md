# Preconnect home page — testing guide

`node tests/run_all.js` runs 19 checks against `tests/fixture.json`, which holds real saved data produced by actually playing all four modules. The checks cover: reading every module's records, readable activity names, exact record counts, the combined CSV (including crediting every crew member on a drill-night call), older Charge the Line summary-only data, backup → restore on a fresh device, rejecting bad or damaged backups without a half-restore, and the offline helper leaving every module folder alone.

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
- `tests/browser_check.py`: home and Settings at 320/390 px, normal and large text, no overflow, no button under 44 px.

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
