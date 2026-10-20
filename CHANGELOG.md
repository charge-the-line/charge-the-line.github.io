# Preconnect home page — changelog

Plain-language history of the home page (the hub at https://preconnect.org/). Each module has its own CHANGELOG.md.
Newest first. "Core" is `preconnect-core.js`, the file every module shares.

## 1.17.0 — October 20, 2026 — the backup three ways, the six-module card
- Back up to a file now has two companions under Settings, More: Share the backup (the phone's share sheet, with the backup as a file; shown only where the phone can share a file) and Copy backup as text (the clipboard). A copied backup comes back through Restore from pasted text. For testers whose phones would not download the file.
- The link preview picture lists all six modules, Purchase Point included, and every page description names vehicle extrication.
- The For testers page says what happens when you tap a never-opened module on the old icon: its tile lands on the new site with nothing in it, so back up first.

## 1.16.1 — October 18, 2026 — preconnect.org
- Preconnect lives at https://preconnect.org. The link preview (og:url, og:image), the For testers page and the docs use the new address; every link between pages stays relative, and every manifest (start_url, scope, id) is relative, so nothing names a host.
- The For testers page tells anyone who installed before the move how to carry their progress over: back up from the old icon, restore at preconnect.org, add the new icon.
- The platform check (tests/platform_check.py) launches the preinstalled browser like the browser check.
- The suite fails if the CNAME file GitHub added (preconnect.org) is missing or changed, if any module repo checked out next to this one has a CNAME of its own, or if the old github.io address appears anywhere.

## 1.16.0 — October 18, 2026
- Every module counts 20 activities (120 in all): Charge the Line's Pump math is one quick drill (its old Tank time runs count toward it, best kept), and Purchase Point's eighth scenario, Pedestrian under a car, is on the tile and in the record. The For testers page says so.

## 1.15.4 — October 13, 2026
- The Purchase Point tile reads "Vehicle extrication, the engine crew's part" (no more "at the Operations level"), alongside Purchase Point 0.5.0, the call-sheet workbench.

## 1.15.3 — October 12, 2026

- Purchase Point E4: all seven scenarios are live, so the For testers page says the module is complete at 19 activities; the fixture holds real runs of the four new scenarios (the trailer on Guided and the loaded trailer on Recall, the EV's white smoke, the pole on Chaos, the two-car crash on Recall with the second-patient inject, played through the module's harness) and `tests/fixtures/pp-0.4.0-scenarios.json`.

## 1.15.2 — October 12, 2026

- Purchase Point E3: the For testers page names the three live scenarios (car versus tree, the ditch, the field) and the four still marked Soon; the fixture carries real scenario runs (the tree on Guided, the ditch on Recall, the field on Chaos with an instructor inject), so the Scenario rows with their tier, layout and instructor mark are read on every run; the statistics dictionary names `scn-<id>`.

## 1.15.1 — October 12, 2026

- Purchase Point E2: the For testers page names the five skill stations and the Where to cut drill as live; the fixture carries real station runs and a Where to cut run.

## 1.15.0 — October 12, 2026 — Purchase Point joins
- A sixth tile: Purchase Point, vehicle extrication at the Operations level, in glass cyan. It counts 19 activities; its lesson, four quick drills and exam practice are live, and its stations and scenarios are on the way.
- Its runs show in the training record, the CSV, Continue, Due for review and the Drill Night board; four of its drills join the daily rotation (24 drills); backup and restore carry it; the feedback page lists it.

## 1.14.0 — October 11, 2026 — tester release
- A "For testers" page: what Preconnect is, install first, what to try, how to report, known limitations, practice not certification. Linked under More on the home page.
- Every activity on the platform (100 of them) is now played to the end with real taps at 390 px by the browser checks before a release.
- CHANGELOG files in every repository; the post-pilot backlog recorded in CLAUDE.md.

## 1.13.1 — October 10, 2026
- Core 1.11.0: new buttons dim and ignore taps for about half a second after a step changes (the momentum-tap guard, used by Charge the Line and Bleed Control).

## 1.13.0 — October 10, 2026
- Continue on the Today view opens the activity you left (the scenario, call, station, run, exam, drill or lesson itself), not just the module.
- A line under the install card says why to install: progress and the offline copy are kept, and Safari can clear a website's saved progress after a week of not using it.

## 1.12.1 — October 10, 2026
- Core 1.10.0: "New version available — tap to reload" appears when a new offline copy takes over behind an open page.

## 1.12.0 — October 10, 2026 — one voice
- The same words everywhere: Start, Stop and go back, Again · Home · Next; ◂ Preconnect and Feedback under every result; one name store shared by every module; the settings sheet says Vibration.

## 1.11.25 to 1.11.29 — October 10, 2026 — final sweep
- The offline helper loads the page and the core network-first, then the saved copy; module tile icons stay offline.
- Safer CSV cells, backups carry settings, a damaged or wrong-shape backup changes nothing.
- The core learned to pause clocks when the screen goes dark.
- The text floor (15 px for sentences, 13 px for captions) and finger-sized links everywhere.

## 1.11.0 to 1.11.24 — October 3 to 10, 2026
- Upwind joined the platform; every new scenario, call, station, drill and Real Call was named in the hub's record as it shipped.
- Social preview card lists all five modules.

## 1.3.0 to 1.10.0 — October 3, 2026
- The Today view, the settings sheet, the shared core, Drill Night, the daily drill and levels, Daylight contrast, instructor modes.
