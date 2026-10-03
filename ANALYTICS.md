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
| `hub/drill-night-start` · `hub/drill-night-end` · `hub/drill-night-csv` | A Drill Night session was started, ended, or exported (counts only; never who was there) |
| `error/<module>/<message>` | A bug someone hit. **Check these weekly** |

Module codes: `ctl` Charge the Line · `pc` Patient Contact · `bc` Bleed Control · `bls` BLS Ready · `uw` Upwind · `hub` home page.
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
