PRECONNECT — HOME PAGE (the ROOT repository: charge-the-line.github.io, served at https://charge-the-line.github.io/)
This folder is the whole home page:
  index.html, privacy.html, feedback.html, preconnect-core.js, manifest.json, sw.js, icon-192.png, icon-512.png, og-card.png, fonts/
(plus tests/, TESTING.md, ANALYTICS.md and CLAUDE.md, which do not affect the page).
Every one of those files must be uploaded together: the page loads preconnect-core.js first, and the type comes from fonts/.
Each module (charge-the-line, patient-contact, bleed-control, bls-ready, upwind) is its own repository and its own folder under the same address.

GitHub Pages serves the main branch root of this repository. Committing to main deploys within a minute or two.
Releasing an update: change APP_VERSION in index.html AND the CACHE name in sw.js together, and keep the "Current version" line in CLAUDE.md in step (the tests check all three).
Tests: node tests/run_all.js   (uses tests/fixture.json and tests/fixtures/ — saved data from every module)

FEEDBACK ADDRESS: open feedback.html and set FEEDBACK_TO = 'your-address@example.org' (near the bottom).
While it's blank, "Send" uses the phone's share sheet instead.
SOCIAL CARD: after the custom domain goes live, update the two og: URLs at the top of index.html to the new address.
