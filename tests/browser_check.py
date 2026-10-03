#!/usr/bin/env python3
"""Real-browser check for the home page (optional). Needs:  pip install playwright && playwright install chromium
Opens the home page and the Settings sheet at phone sizes; fails on any JavaScript error, anything off-screen, or a button under 44 px.
Usage:  python3 tests/browser_check.py"""
import pathlib, sys
from playwright.sync_api import sync_playwright
URL = (pathlib.Path(__file__).resolve().parent.parent / 'index.html').as_uri()
OVER = "(()=>{let m=0;document.querySelectorAll('body *').forEach(e=>{if(e.offsetParent===null)return;const r=e.getBoundingClientRect();m=Math.max(m,r.right-window.innerWidth);});return Math.round(m);})()"
SMALL = "(()=>{let n=0;document.querySelectorAll('button').forEach(e=>{if(e.offsetParent===null)return;const r=e.getBoundingClientRect();if(r.width<2||r.height<2||r.bottom<0||r.top>innerHeight)return;if(r.height<44)n++;});return n;})()"
errs, rows = [], []
with sync_playwright() as p:
    b = p.chromium.launch()
    for w in (320, 390):
        pg = b.new_page(viewport={'width': w, 'height': 800}, device_scale_factor=2, is_mobile=True, has_touch=True)
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(URL); pg.wait_for_timeout(300); rows.append((w, 'home', pg.evaluate(OVER), pg.evaluate(SMALL)))
        pg.click('#h-set'); pg.wait_for_timeout(200); rows.append((w, 'settings', pg.evaluate(OVER), pg.evaluate(SMALL)))
        pg.click('[data-set="text"] [data-val="large"]'); pg.wait_for_timeout(200); rows.append((w, 'large text', pg.evaluate(OVER), pg.evaluate(SMALL)))
        pg.click('#set-close'); pg.wait_for_timeout(200); rows.append((w, 'home, large text', pg.evaluate(OVER), pg.evaluate(SMALL)))
        pg.close()
    b.close()
bad = [r for r in rows if r[2] > 1 or r[3] > 0]
for r in rows: print(f"{'PASS' if r[2] <= 1 and r[3] == 0 else 'FAIL'}  {r[0]}px  {r[1]:<18} overflow {r[2]}px · buttons under 44px: {r[3]}")
print('JavaScript errors:', errs or 'none')
sys.exit(1 if bad or errs else 0)
