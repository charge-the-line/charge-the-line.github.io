#!/usr/bin/env python3
"""Whole-platform analytics check (optional). Assemble the site the way it's deployed, then run:
     python3 tests/platform_check.py /path/to/assembled-site
   The folder must hold this home page plus charge-the-line/, patient-contact/, bleed-control/, bls-ready/.
   GoatCounter is replaced by a recorder. Verifies: start/finish/quit events in every module, errors reported once,
   names typed into the app never appear in any event, and the Privacy page's opt-out stops everything."""
import sys
from playwright.sync_api import sync_playwright
import json, threading, functools, http.server
ROOT=sys.argv[1] if len(sys.argv)>1 else '.'
H=functools.partial(http.server.SimpleHTTPRequestHandler,directory=ROOT);H.log_message=lambda *a:None
srv=http.server.ThreadingHTTPServer(('127.0.0.1',8766),functools.partial(http.server.SimpleHTTPRequestHandler,directory=ROOT))
http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
threading.Thread(target=srv.serve_forever,daemon=True).start()
EV=[];errs=[]
STUB="window.goatcounter={count:function(o){window.reportEv(o.path)}};"
with sync_playwright() as p:
    b=p.chromium.launch();ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
    ctx.route('**/gc.zgo.at/**',lambda r:r.abort());ctx.route('**goatcounter.com/**',lambda r:r.abort())
    ctx.expose_binding('reportEv',lambda src,path:EV.append(path));ctx.add_init_script(STUB)
    pg=ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
    B='http://localhost:8766'
    pg.goto(B+'/');pg.wait_for_timeout(300);pg.fill('#r-name','Max Tester');pg.fill('#r-org','Monitor Twp FD');pg.locator('#r-name').dispatch_event('change');pg.locator('#r-org').dispatch_event('change')
    with pg.expect_download():pg.click('#r-csv')
    pg.goto(B+'/bls-ready/');pg.wait_for_timeout(250);pg.evaluate("window.__t=1000;NOW=()=>window.__t;");pg.click('[data-run="tempo"]');pg.evaluate("__t+=1");pg.wait_for_timeout(200);pg.click('[data-r="next"]')
    for i in range(5):
        pg.evaluate("__t+=.6")
        if i==0: pg.wait_for_timeout(200)
        pg.click('[data-r="tap"]')
    pg.click('[data-r="quit"]')
    pg.click('[data-run="tempo"]');pg.evaluate("__t+=1");pg.wait_for_timeout(200);pg.click('[data-r="next"]')
    for st in range(5):
        k=pg.evaluate("RUN&&RUN.steps[RUN.i]?RUN.steps[RUN.i].k:null")
        if k=='tap':
            for i in range(30):
                pg.evaluate("__t+=.545")
                if i==0: pg.wait_for_timeout(200)
                pg.click('[data-r="tap"]')
        elif k=='breaths':
            for i in range(2):
                pg.evaluate("__t+=1.1")
                if i==0: pg.wait_for_timeout(200)
                pg.click('[data-r="breath"]')
    pg.wait_for_timeout(200)
    pg.goto(B+'/bleed-control/');pg.wait_for_timeout(250);pg.click('[data-sc="garage"]');pg.click('#brief-go');pg.click('[data-a="safe"]');pg.click('[data-a="call"]');pg.click('#g-menu')
    pg.click('[data-st="press"]');pg.wait_for_timeout(200);pg.click('#st-quit')
    pg.goto(B+'/patient-contact/');pg.wait_for_timeout(300)
    if pg.is_visible('#b-start'):pg.click('#b-start')
    pg.click('#b-call1');pg.wait_for_timeout(300)
    pg.goto(B+'/charge-the-line/');pg.wait_for_timeout(300)
    if pg.is_visible('#b-start'):pg.click('#b-start')
    pg.click('.scen[data-i="0"]');pg.wait_for_timeout(300)
    pg.goto(B+'/');pg.wait_for_timeout(300)
    pg.goto(B+'/bls-ready/');pg.wait_for_timeout(250);pg.evaluate("setTimeout(()=>{throw new Error('test failure in drill')},0);setTimeout(()=>{throw new Error('test failure in drill')},10)");pg.wait_for_timeout(300)
    before=len(EV)
    pg.goto(B+'/privacy.html');pg.wait_for_timeout(250);pg.click('#stats');optlabel=pg.inner_text('#stats')
    pg.goto(B+'/bls-ready/');pg.wait_for_timeout(250);pg.click('[data-run="tempo"]');pg.wait_for_timeout(600);pg.click('[data-r="quit"]')
    pg.goto(B+'/bleed-control/');pg.wait_for_timeout(250);pg.click('[data-sc="kitchen"]');pg.click('#brief-go');pg.click('#g-menu')
    after_opt=EV[before:]
    b.close()
res=dict({'page_errors':[e for e in errs if 'test failure' not in e],'events':EV[:before],'events_after_opt_out':after_opt,'opt_out_label':optlabel,
  'names_leaked':[e for e in EV if any(w in e for w in ['max','tester','monitor'])]})
ok=(not res['page_errors'] and not res['names_leaked'] and not res['events_after_opt_out']
    and all(any(e.startswith(m+'/start/') for e in res['events']) and any(e.startswith(m+'/quit/') for e in res['events']) for m in ['bls','bc','pc','ctl'])
    and any(e.startswith('bls/finish/') for e in res['events']) and sum(e.startswith('error/') for e in res['events'])==1)
print(json.dumps(res,indent=1));print('PASS' if ok else 'FAIL');sys.exit(0 if ok else 1)
