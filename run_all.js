#!/usr/bin/env node
/* Preconnect home page — test suite.   node tests/run_all.js   (exit code 0 = all passed) */
const fs=require('fs'),path=require('path'),vm=require('vm');const {boot}=require('./hub_mock.js');
let failed=0,n=0;function report(name,ok,detail=''){n++;if(!ok)failed++;console.log(`${ok?'PASS':'FAIL'}  ${name}${detail?'  — '+detail:''}`);}
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'),sw=fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8');
const FIX=JSON.parse(fs.readFileSync(path.join(__dirname,'fixture.json'),'utf8'));
try{new vm.Script(html.split('<script>')[1].split('</script>')[0]);report('script compiles',true);}catch(e){report('script compiles',false,e.message);}
{const ver=(html.match(/APP_VERSION='([^']+)'/)||[])[1],cache=(sw.match(/CACHE = '([^']+)'/)||[])[1];report('offline cache matches app version',cache===`preconnect-v${ver}`,`${ver} / ${cache}`);}
{const m=sw.match(/const ownFile = (.+);/);const own=new Function('url','return '+m[1]+';');const T=p=>own({pathname:p});
 report('offline helper handles only its own root files',T('/')&&T('/index.html')&&T('/icon-192.png')&&['/charge-the-line/','/patient-contact/index.html','/bleed-control/','/bls-ready/sw.js','/next-module/'].every(p=>!T(p)));
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
report('trademark notices for both certifying organizations',/STOP THE BLEED® is a registered trademark/.test(html)&&/trademarks of the American Heart Association/.test(html));
console.log(`\n${n-failed}/${n} checks passed`);process.exit(failed?1:0);
