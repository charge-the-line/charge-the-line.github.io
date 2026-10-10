# Preconnect statistics — how to read them

Dashboard: **https://preconnect.goatcounter.com** (sign in with the account you created).

## What gets counted

**Page views** come automatically from every page (home, privacy, feedback, each module).

**Events** are listed as paths. Each one is a single anonymous count:

| Event path | Means |
|---|---|
| `bls/start/adult` | Someone started BLS Ready's adult CPR station |
| `bls/finish/adult/recall/attempt-2/score-90-100` | …finished it on Recall, on their 2nd attempt on that device, scoring 90–100 |
| `bls/quit/adult/step-6-tap` | …left partway, at step 6 (a compression step) |
| `bc/finish/garage/chaos/attempt-1/patient-died` | Bleed Control: the patient died in that run |
| `bc/start/skill-tq-arm` · `bc/quit/skill-pack/phase-packing` | Skill stations, and where people stop |
| `pc/quit/arrest/mission-2` · `ctl/finish/scenario-6/guided/attempt-1/score-80s` | Patient Contact calls, Charge the Line scenarios |
| `*/lesson` · `*/exam` · `*/drill-…` | Lessons, exam practice, quick drills |
| `uw/start/drill-placard` · `uw/quit/lesson/slide-4` | Upwind drills and lesson, with the question or slide where someone stopped |
| `hub/training-record-csv` · `hub/backup` · `hub/restore` · `hub/feedback-sent` | Home-page actions |
| `hub/daily-drill` | Someone tapped the day's 60-second drill on the home page |
| `hub/install-tap` | Someone tapped Install on the home page's install card (Chrome and Android; iPhone has no such button) |
| `hub/drill-night-start` · `hub/drill-night-end` · `hub/drill-night-csv` | A Drill Night session was started, ended, or exported (counts only; never who was there) |
| `error/<module>/<message>` | A bug someone hit. **Check these weekly** |

Module codes: `ctl` Charge the Line · `pc` Patient Contact · `bc` Bleed Control · `bls` BLS Ready · `uw` Upwind · `hub` home page.

**Reading the ids.** Paths are lower-cased before they are sent, so BLS Ready's `chokeA` and `chokeI` arrive as `chokea` and `chokei`, and `child2` stays `child2`. Every id is listed by module in the key at the end of this file.

**When a start is counted.** Charge the Line, Patient Contact and Bleed Control count `start` when the briefing opens, so backing out of a briefing registers as `quit/…/mission-1` (or `step-1`). In Charge the Line and Patient Contact, **Menu is a pause**, not a quit: leaving a scenario through the menu and starting another sends the first scenario's `quit` at that moment, with the step it was paused at. Charge the Line's Pump math counts `drill-math` from the moment it opens; a set of five or more answers is a `finish` with a score band, fewer is a `quit/drill-math/problem-N`.
Score bands: `score-90-100`, `score-80s`, `score-70s`, `score-60s`, `score-under-60`. Attempts: `attempt-1` … `attempt-5plus`.

## Questions it answers

- **Where do people get stuck?** Compare `quit` counts by step against `start` counts. A step with many quits is a design problem to fix.
- **Completion rate:** `finish` ÷ `start` for each activity.
- **Is it teaching? (the grant number)** Compare score bands at `attempt-1` against `attempt-3` and `attempt-5plus` for the same activity. Rising bands mean practice is working. Export the data (**Settings → Export**) and pivot it in Excel or Power BI.
- **Reach:** visitors, locations (country and region only), and devices, all on the dashboard.

## Set up once in GoatCounter

1. **Settings → Ignore IPs:** add your own home and work IPs, so testing doesn't inflate the numbers.
2. **Settings → Sites:** when the custom domain goes live, nothing needs to change. Counts are sent to `preconnect.goatcounter.com` from any address.
3. Statistics are never sent from `localhost` or a file opened on your computer, so testing locally doesn't pollute the data.

## Privacy rules (enforced by tests)

- No names, organizations, or typed text in any event. `tests/platform_check.py` types a name into the app and fails if it ever appears.
- Paths are cleaned to letters, digits, `/` and `-` only.
- The Privacy page has a per-device off switch (`localStorage 'preconnect-stats' = 'off'`) that every module respects.
- Each module's offline helper passes analytics straight through to the network (never cached).

## Id key: what each event id means

Generated from the home page's name table (`L` in `index.html`), so a new activity shows up here when it gets its line there. Prefixes: Charge the Line scenarios are numbered in menu order; stations are `skill-…` in Bleed Control; drills are `drill-…` everywhere; Upwind incidents are `scenario-<id>`; the others use the bare id.

### Charge the Line (`ctl`)
| Event id | Activity |
|---|---|
| `scenario-1` | Residential structure fire |
| `scenario-2` | Commercial building — FDC |
| `scenario-3` | Vehicle fire — Class B foam |
| `scenario-4` | Rural barn fire — draft |
| `scenario-5` | Relay — supply Engine 10-1 |
| `scenario-6` | Breezy Point — Superstorm Sandy, 2012 |
| `scenario-7` | First Interstate Bank — Los Angeles, 1988 |
| `scenario-8` | Port Jervis, NY — tanker shuttle at 0°F, 2005 |
| `scenario-9` | Queens, NY — gasoline tanker fire, 1994 |
| `scenario-10` | Corvallis, OR — the Mayday nobody heard |
| `scenario-11` | EV fire on a county road |
| `scenario-12` | Defensive commercial fire — going big |
| `scenario-13` | Fill site at a dry hydrant |
| `scenario-14` | One Meridian Plaza — Philadelphia, 1991 |
| `lesson` | Pump operations lesson |
| `drill-friction` | Friction loss |
| `drill-pdp` | Pump discharge pressure |
| `drill-control` | Find the control |
| `drill-hydrant` | Hydrant math |
| `drill-tank` | Tank time |
| `drill-math` | Pump math |

### Patient Contact (`pc`)
| Event id | Activity |
|---|---|
| `arrest` | Cardiac arrest |
| `mva` | Car versus tree |
| `od` | Overdose |
| `ep` | Anaphylaxis |
| `st` | Stroke |
| `fl` | Elderly fall |
| `cb` | Childbirth |
| `dm` | Diabetic emergency |
| `pd` | Pediatric breathing |
| `cp` | Chest pain |
| `fr` | Fire victim |
| `lesson` | The lesson |
| `drill-cpr` | CPR tempo |
| `drill-leads` | Lead placement |
| `drill-rhythm` | Rhythm ID |
| `drill-med` | Med math |
| `drill-o2` | Oxygen math |
| `drill-apgar` | APGAR |
| `drill-lkw` | Last known well |
| `drill-startcpr` | Start CPR or not? |

### Bleed Control (`bc`)
| Event id | Activity |
|---|---|
| `kitchen` | "He cut his arm on the glass" |
| `garage` | Table saw in the garage |
| `glass` | Through the glass door |
| `crash` | Two-car crash |
| `bike` | Bike crash: a 9-year-old and his mom |
| `auger` | Farm auger: amputation |
| `hunt` | Hunting season: 40 minutes from help |
| `fwk` | Fireworks festival: many hurt, one kit |
| `vein` | "It's just a little cut on her leg" |
| `skill-tq-arm` | Tourniquet — arm |
| `skill-tq-leg` | Tourniquet — leg |
| `skill-pack` | Wound packing |
| `skill-press` | Direct pressure |
| `skill-self` | Tourniquet on yourself, one-handed |
| `skill-coach` | Talk a bystander through it |
| `drill-threat` | Life-threatening or not? |
| `drill-method` | Which technique? |
| `drill-place` | Tourniquet placement |
| `drill-kit` | Kit check |
| `lesson` | The lesson |

### BLS Ready (`bls`)
| Event id | Activity |
|---|---|
| `tempo` | Compressions and breaths |
| `adult` | Adult CPR and AED |
| `infant` | Infant CPR — two rescuers |
| `child2` | Child CPR — two rescuers |
| `pool` | Pulled from the pool |
| `crib` | Not breathing in the crib |
| `slow` | She has a pulse, but it's slow |
| `drill-special` | Special situations |
| `bvm` | Bag-mask breaths |
| `chokea` | Choking — adult or child |
| `chokei` | Choking — infant |
| `team` | Collapse in the hallway |
| `opioid` | Found in the restroom |
| `baby` | Infant at the daycare |
| `child` | Choking at the birthday party |
| `drill-numbers` | Numbers that matter |
| `drill-ages` | Adult vs. child vs. infant |
| `drill-choke` | Choking by age |
| `exam` | Exam practice |
| `lesson` | The lesson |

### Upwind (`uw`)
| Event id | Activity |
|---|---|
| `lesson` | The lesson |
| `drill-placard` | Placard ID |
| `drill-erg` | ERG lookup |
| `drill-container` | Container recognition |
| `drill-nfpa704` | NFPA 704 |
| `drill-zones` | Zone setup |
| `drill-meter` | Meter interpretation |
| `drill-shelter` | Shelter or evacuate |
| `drill-ppe` | PPE limits |
| `scenario-i75` | Tanker on its side, I-75 |
| `scenario-nurse` | Nurse tank on a gravel road |
| `scenario-propane` | Propane at the refill cage |
| `scenario-pool` | Chlorine at the swim club |
| `scenario-house` | Something in the house |
| `scenario-rail` | Rail car by the siding |
| `scenario-powder` | White powder in an envelope |
| `scenario-grani` | Real Call: Graniteville, 2005 |
| `scenario-king` | Real Call: Kingman, 1973 |
| `scenario-epal` | Real Call: East Palestine, 2023 |
| `scenario-liion` | Lithium-ion battery fire |
