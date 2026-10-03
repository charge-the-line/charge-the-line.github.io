# Preconnect home page — testing guide

`node tests/run_all.js` runs 19 checks against `tests/fixture.json`, which holds real saved data produced by actually playing all four modules. The checks cover: reading every module's records, readable activity names, exact record counts, the combined CSV (including crediting every crew member on a drill-night call), older Charge the Line summary-only data, backup → restore on a fresh device, rejecting bad or damaged backups without a half-restore, and the offline helper leaving every module folder alone.

**When a module changes how it saves data, regenerate the fixture** by playing that module's bots and re-saving its storage key into `fixture.json`. Then rerun this suite. The hub has its own copy of each module's activity-name table (`L` in index.html), so a new scenario or drill needs a line there too, or the `readable name` check will fail.

**Shared-domain rules every module must follow:**
1. Each app lives in its own folder and registers its own `sw.js`.
2. Each offline helper clears **only its own** old caches (`k.startsWith('<slug>-v')`). Clearing everything wipes the other apps' offline copies.
3. Only the home page's helper handles root files, and it leaves every folder alone.
4. Each module keeps its own storage key: `e102-pump-trainer`, `patient-contact`, `bleed-control`, `bls-ready`. Plus `preconnect` for the hub.
