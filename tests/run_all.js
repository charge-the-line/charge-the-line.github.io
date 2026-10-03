#!/usr/bin/env node
/* Preconnect home page — test suite.   node tests/run_all.js   (exit code 0 = all passed) */
const fs=require('fs'),path=require('path'),vm=require('vm');const {boot}=require('./hub_mock.js');
let failed=0,n=0;function report(name,ok,detail=''){n++;if(!ok)failed++;console.log(`${ok?'PASS':'FAIL'}  ${name}${detail?'  — '+detail:''}`);}
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'),sw=fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8');
const FIX=JSON.parse(fs.readFileSync(path.join(__dirname,'fixture.json'),'utf8'));
try{new vm.Script(html.split('<script>')[1].split('</script>')[0]);report('script compiles',true);}catch(e){report('script compiles',false,e.message);}
{const ver=(html.match(/APP_VERSION='([^']+)'/)||[])[1],cache=(sw.match(/CACHE = '([^']+)'/)||[])[1];report('offline cache matches app version',cache===`preconnect-v${ver}`,`${ver} / ${cache}`);}
{const m=sw.match(/const ownFile = (.+);/);const own=new Function('url','return '+m[1]+';');const T=p=>own({pathname:p});
 report('offline helper handles only its own root files (and its fonts folder)',T('/')&&T('/index.html')&&T('/icon-192.png')&&T('/fonts/atkinson-hyperlegible-latin-400-normal.woff2')&&['/charge-the-line/','/patient-contact/index.html','/bleed-control/','/bls-ready/sw.js','/next-module/'].every(p=>!T(p)));
 report('offline helper only clears its own old caches',/k\.startsWith\('preconnect-v'\)/.test(sw));}
{const {api}=boot();report('links to all four module folders (relative paths)',['charge-the-line/','patient-contact/','bleed-control/','bls-ready/'].every(p=>api.MODS.some(m=>m.path===p)));}
{const {api}=boot();report('empty device: no records, no crash',api.records().length===0&&api.csvRows().length===1);}
{const {api}=boot(FIX);const R=api.records();const mods=new Set(R.map(r=>r.mod));
 report('reads records from all four modules',mods.size===4,[...mods].join(', '));
 report('every activity has a readable name (no raw ids, no blanks)',R.every(r=>r.act&&!/undefined|^[a-z]+[A-Z]?$|^tq-|^\d+$/.test(r.act)),R.map(r=>r.act).join(' | ').slice(0,160));
 const counts={};R.forEach(r=>counts[r.mod]=(counts[r.mod]||0)+1);const exp={'Charge the Line':JSON.parse(FIX['e102-pump-trainer']).log.length,'Patient Contact':JSON.parse(FIX['patient-contact']).runs.length+JSON.parse(FIX['patient-contact']).drillRuns.length,'Bleed Control':JSON.parse(FIX['bleed-control']).runs.length,'BLS Ready':JSON.parse(FIX['bls-ready']).runs.length};
 report('record counts match each module exactly',Object.keys(exp).every(k=>counts[k]===exp[k]),JSON.stringify(counts));
 const rows=api.csvRows();const hdr=rows[0].join('|');report('CSV header',hdr==='Name|Organization|Module|Type|Activity|Patient|Date|Mode|Score|Instructor');
 const crew=rows.filter(r=>r[8]!==undefined&&r[9]==='Capt. Lee');report('drill-night call credits every crew member, with the instructor',crew.length===3&&new Set(crew.map(r=>r[0])).size===3,crew.map(r=>r[0]).join(', '));
 report('name and organization picked up from the modules',api.profile().name==='Max'&&api.profile().org==='Monitor Twp FD');
 report('CSV is valid (quoted, every row 10 columns)',api.toCSV(rows).split('\n').every(l=>(l.match(/","/g)||[]).length===9));
 report('rows sorted newest first',rows.slice(1).every((r,i,a)=>i===0||a[i-1][6]>=r[6]));}
{// Charge the Line data saved before the per-run log existed still shows up (best score per scenario)
 const {api}=boot({'e102-pump-trainer':JSON.stringify({name:'',scen:{'0':{level:1,best:88,runs:3,last:'2026-09-30T10:00:00Z',tier:1}},math:{}})});const R=api.records();
 report('older Charge the Line data (summary only) still appears',R.length===1&&/best of 3/.test(R[0].type)&&R[0].score===88&&R[0].act==='Residential structure fire');}
{// backup → restore on a fresh device reproduces everything
 const a=boot(FIX);const file=JSON.stringify(a.api.backup());const b=boot();const nmods=b.api.restore(JSON.parse(file));
 report('backup → restore on a new device brings back every module',nmods===4&&b.api.csvRows().length===a.api.csvRows().length,`${nmods} modules, ${b.api.csvRows().length-1} rows`);
 let threw=false;try{b.api.restore({hello:'world'});}catch(e){threw=true;}report('restore refuses a file that is not a Preconnect backup',threw);
 let threw2=false;const c=boot(FIX);try{c.api.restore({app:'preconnect',data:{'bls-ready':'{"runs":[]}','patient-contact':'{not json'}});}catch(e){threw2=true;}report('a damaged backup changes nothing at all (no half-restore)',threw2&&c.S['patient-contact']===FIX['patient-contact']&&c.S['bls-ready']===FIX['bls-ready']);}
{const P=fs.readFileSync(path.join(__dirname,'..','privacy.html'),'utf8'),F=fs.readFileSync(path.join(__dirname,'..','feedback.html'),'utf8');
 report('privacy page and feedback page exist and are linked',/href="privacy\.html"/.test(html)&&/href="feedback\.html"/.test(html)&&/never see them/.test(P)&&/preconnect-stats/.test(P)&&/Report a problem/.test(F));
 report('social preview card is set up',/og:image" content="https:\/\/[^"]+og-card\.png"/.test(html)&&fs.existsSync(path.join(__dirname,'..','og-card.png')));
 const snip=html.split('<script data-pca>')[1];report('analytics snippet present and pointed at preconnect.goatcounter.com',!!snip&&/https:\/\/preconnect\.goatcounter\.com\/count/.test(snip));
 // run the snippet in isolation: names and typed text can't survive into an event path; buckets are coarse
 const W={addEventListener(){}},sent=[];global.window=W;global.localStorage={getItem:()=>null};global.document={createElement:()=>({setAttribute(){}}),head:{appendChild(){}}};
 new Function(snip.split('</script>')[0])();W.goatcounter={count:o=>sent.push(o.path)};W.PCA.ev('bls/finish/adult/Max Tester said "hi" <b>');W.PCA.flush();
 report('event paths are cleaned to safe characters (no spaces, quotes, or tags)',/^[a-z0-9\/\-]+$/.test(sent[0]||'x '),sent[0]);
 report('scores are reported only as coarse bands',W.PCA.bkt(97)==='score-90-100'&&W.PCA.bkt(83)==='score-80s'&&W.PCA.bkt(12)==='score-under-60');}
{// Milestone 1: fonts served from this site on every root page; nothing loads from Google; every font file exists and is in the offline cache list
 const pages=['index.html','privacy.html','feedback.html'].map(f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8'));const urls=[...new Set(pages.flatMap(h=>[...h.matchAll(/url\((fonts\/[^)]+)\)/g)].map(m=>m[1])))];
 report('fonts served from this site on every page, cached offline, no request to Google',pages.every(h=>!/fonts\.googleapis|gstatic\.com/.test(h)&&/@font-face/.test(h))&&urls.length>=5&&urls.every(u=>fs.existsSync(path.join(__dirname,'..',u))&&sw.includes(`'${u}'`)),`${urls.length} font files`);
 report('privacy page says nothing loads from Google',/Nothing loads from Google/.test(fs.readFileSync(path.join(__dirname,'..','privacy.html'),'utf8')));}
{// Milestone 1: install coaching. Shown to an iPhone browser, hidden once dismissed, never shown when already installed.
 const a=boot();global.navigator={userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1'};a.api.installHint();const shown=a.els.install.hidden===false&&a.els['install-ios'].hidden===false;
 a.els['install-later'].onclick();const dismissed=a.els.install.hidden===true&&a.S['preconnect-install']==='no';a.api.installHint();const stays=a.els.install.hidden===true;
 const b=boot();global.navigator={userAgent:'iPhone',standalone:true};b.api.installHint();const installed=b.els.install.hidden===true;
 const c=boot();global.navigator={userAgent:'Mozilla/5.0 (X11; Linux) Firefox'};c.api.installHint();const other=c.els.install.hidden===true;
 report('install hint: iPhone browser sees it, dismissing hides it for good, installed or unsupported browsers never see it',shown&&dismissed&&stays&&installed&&other,`shown ${shown} dismissed ${dismissed} stays ${stays} installed ${installed} other ${other}`);}
{// Milestone 2: the Today view and module progress
 const a=boot({'bls-ready':JSON.stringify({runs:[{kind:'station',id:'adult',score:95,d:new Date().toISOString(),tier:1}]})});const T=a.api.today();a.api.render();
 report('Today view: picks up where you left off and counts this week',!!T.last&&T.last.mod==='BLS Ready'&&T.last.act==='Adult CPR and AED'&&T.last.score===95&&T.week===1&&T.mods.find(m=>m.id==='bls').done===1&&T.mods.find(m=>m.id==='bls').total===15&&/Pick up where you left off/.test(a.els.today.innerHTML)&&/bls-ready\//.test(a.els.today.innerHTML),`${T.last&&T.last.act} · week ${T.week}`);
 const b=boot(FIX);const Tb=b.api.today();report('module progress counts distinct activities, never above the total',Tb.mods.every(m=>m.done<=m.total&&m.done>0),Tb.mods.map(m=>`${m.id} ${m.done}/${m.total}`).join(', '));
 const c=boot();c.api.render();report('empty device: Today view points new people at a lesson',/Start with a ten-minute lesson/.test(c.els.today.innerHTML)&&c.api.today().last===null);}
{// Milestone 2: one settings sheet, one key, applied to the page
 const a=boot();a.api.setSetting('text','large');a.api.setSetting('contrast','high');const s=a.api.settings();const de=global.document.documentElement.dataset;
 report('settings: saved under preconnect-settings and applied to the page',s.text==='large'&&s.contrast==='high'&&de.text==='large'&&de.contrast==='high'&&JSON.parse(a.S['preconnect-settings']).text==='large'&&s.haptics==='on'&&s.sound==='off',JSON.stringify(s));
 a.api.setSetting('stats','off');const off=a.S['preconnect-stats']==='off'&&a.api.settings().stats==='off';a.api.setSetting('stats','on');report('statistics switch in Settings is the same switch as the Privacy page',off&&a.api.settings().stats==='on'&&a.S['preconnect-stats']===undefined);
 const el={textContent:''};a.api.countUp(el,87);report('score count-up lands on the exact score when motion is unavailable',el.textContent==='87');
 {const core=fs.readFileSync(path.join(__dirname,'..','preconnect-core.js'),'utf8');report('motion is honored: Reduce Motion and the Motion = Off setting stop every animation (rules live in the shared core)',/prefers-reduced-motion:reduce\)\{\*\{animation:none!important/.test(core)&&/html\[data-motion="off"\] \*\{animation:none!important/.test(core));}}
{// Milestone 3: shared core (same checks every suite runs) plus the hub's Due for review cards and the cross-repo identity check
 const cp=path.join(__dirname,'..','preconnect-core.js');const ct=fs.readFileSync(cp,'utf8');const first=ct.split('\n')[0];const body=ct.slice(first.length+1);const want=(first.match(/sha256:([0-9a-f]{64})/)||[])[1];const got=require('crypto').createHash('sha256').update(body,'utf8').digest('hex');
 report('shared core loaded first, cached offline, header hash matches body',want===got&&sw.includes("'preconnect-core.js'")&&html.indexOf('<script src="preconnect-core.js"></script>')<html.indexOf('\n<script>\n'),want===got?'hash ok':`expected ${got.slice(0,12)}`);
 const sib=['charge-the-line','patient-contact','bleed-control','bls-ready'].map(r=>[r,path.join(__dirname,'..','..',r,'preconnect-core.js')]).filter(([r,f])=>fs.existsSync(f));
 if(sib.length){const drift=sib.filter(([r,f])=>fs.readFileSync(f,'utf8')!==ct).map(([r])=>r);report('shared core is byte-identical in every sibling repo checked out next to this one',drift.length===0,drift.length?'drifted: '+drift.join(', '):`${sib.length} siblings match`);}
 else report('shared core identity across repos (skipped: no sibling repos checked out)',true);
 const {boot}=require('./hub_mock.js');const {api}=boot();const d=n=>new Date(Date.now()-n*864e5).toISOString();
 const one=api.pcSpacing([{d:d(0),score:90}]),two=api.pcSpacing([{d:d(5),score:90},{d:d(4),score:90}]),miss=api.pcSpacing([{d:d(5),score:90},{d:d(1),score:40}]);
 report('spacing: 1, 3, 7, 14, 30 days after each clear at 70+; a miss resets',api.pcSpacing([]).status==='never'&&one.level===1&&one.dueIn===1&&two.level===2&&two.status==='due'&&miss.status==='missed');
 const a=boot({'bls-ready':JSON.stringify({runs:[{kind:'station',id:'adult',score:95,d:d(10),tier:1},{kind:'station',id:'tempo',score:40,d:d(2),tier:0}]})});a.api.render();const D=a.api.due();
 report('Today view: Due for review cards, most overdue first, a miss reads "try again"',D.length===2&&D[0].act==='Adult CPR and AED'&&D[0].sp.status==='due'&&D[1].sp.status==='missed'&&/Due for review/.test(a.els.today.innerHTML)&&/try again/.test(a.els.today.innerHTML),D.map(g=>g.act+' '+g.sp.status).join(', '));
 const h=a.api.pcDebriefBody({score:90,compare:a.api.pcBestPrev([{d:d(3),score:80}]),metrics:[['Rate','110']],steps:[{name:'Shock',ok:false,missed:true}]});report('debrief body renders compare line, metrics and steps tables',/Best 80 · last time 80 · new best/.test(h)&&/pc-metrics/.test(h)&&/pc-steps/.test(h));}
report('trademark notices for both certifying organizations',/STOP THE BLEED® is a registered trademark/.test(html)&&/trademarks of the American Heart Association/.test(html));
console.log(`\n${n-failed}/${n} checks passed`);process.exit(failed?1:0);
