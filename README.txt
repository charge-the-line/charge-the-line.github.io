PRECONNECT — HOME PAGE (goes in the ROOT repository: charge-the-line.github.io)
Upload: index.html, privacy.html, feedback.html, og-card.png, manifest.json, sw.js, icon-192.png, icon-512.png, ANALYTICS.md (+ tests folder, TESTING.md — optional)
This REPLACES the old Charge the Line files in that repo. Charge the Line itself moves to its own repo
named "charge-the-line" so it lives at /charge-the-line/ like the other modules. Do that move FIRST.

Releasing an update: change APP_VERSION in index.html AND the CACHE name in sw.js together.
Tests: node tests/run_all.js   (uses tests/fixture.json — real saved data from all four modules)

FEEDBACK ADDRESS: open feedback.html and set FEEDBACK_TO = 'your-address@example.org' (near the bottom).
While it's blank, "Send" uses the phone's share sheet instead.
SOCIAL CARD: after the custom domain goes live, update the two og: URLs at the top of index.html to the new address.
