PRECONNECT — HOME PAGE (the ROOT repository: charge-the-line.github.io, served at https://preconnect.org/)
This folder is the whole home page:
  index.html, privacy.html, feedback.html, testers.html, preconnect-core.js, manifest.json, sw.js, icon-192.png, icon-512.png, og-card.png, CNAME, fonts/
(plus tests/, TESTING.md, ANALYTICS.md and CLAUDE.md, which do not affect the page).
Every one of those files must be uploaded together: the page loads preconnect-core.js first, and the type comes from fonts/.
Each module (charge-the-line, patient-contact, bleed-control, bls-ready, upwind, purchase-point) is its own repository and its own folder under the same address.

GitHub Pages serves the main branch root of this repository. Committing to main deploys within a minute or two.
Releasing an update: change APP_VERSION in index.html AND the CACHE name in sw.js together, and keep the "Current version" line in CLAUDE.md in step (the tests check all three).
Tests: node tests/run_all.js   (uses tests/fixture.json and tests/fixtures/ — saved data from every module)

FEEDBACK ADDRESS: open feedback.html and set FEEDBACK_TO = 'your-address@example.org' (near the bottom).
While it's blank, "Send" uses the phone's share sheet instead.
CUSTOM DOMAIN: preconnect.org, set on this repository only. GitHub keeps it in the CNAME file at the root (it holds preconnect.org): never delete or overwrite it, or the site falls back to the github.io address. The tests fail if it is missing or changed.
The modules get no custom domain and no CNAME file: they are served automatically at https://preconnect.org/<module>/.
SOCIAL CARD: the two og: URLs at the top of index.html point at https://preconnect.org/.
