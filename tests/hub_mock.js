// Headless harness: loads ../index.html into a fake DOM with a fake localStorage.
const fs=require('fs'),path=require('path');
function boot(store){const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');const js=html.split('<script>')[1].split('</script>')[0];const els={};
 const mk=id=>({id,_cls:new Set(),style:{},value:'',textContent:'',innerHTML:'',classList:{add(){},remove(){},toggle(){},contains:()=>false},click(){}});
 for(const m of html.matchAll(/id="([^"]+)"/g))els[m[1]]=mk(m[1]);const S=Object.assign({},store||{});
 global.localStorage={getItem:k=>k in S?S[k]:null,setItem:(k,v)=>{S[k]=String(v);},removeItem:k=>{delete S[k];}};
 global.document={getElementById:i=>els[i]||(els[i]=mk(i)),createElement:()=>({click(){}}),activeElement:null,documentElement:{dataset:{}}};
 global.addEventListener=()=>{};Object.defineProperty(globalThis,'navigator',{value:{},configurable:true,writable:true});global.location={protocol:'file:'};
 global.Blob=function(p){this.parts=p;};global.URL={createObjectURL:b=>{global.__dl=b.parts.join('');return 'x';}};
 const api=new Function(require('fs').readFileSync(require('path').join(__dirname,'..','preconnect-core.js'),'utf8')+'\n'+js+';return {pcCue,pcBuzz,pcFx,pcMetro,pcMetroState,pcEsc,pcDrill,pcDrillRaw,pcDrillStart,pcDrillEnd,pcDrillWho,pcDrillStamp,pcDrillBar,pcDrillPick,pcDrillAct,pcDrillBind,tonight,drillRender,drillSetup,drillOpen,records,csvRows,toCSV,backup,restore,profile,render,MODS,installHint,today,due,settings,setSetting,applySettings,countUp,haptic,motionOK,pcSpacing,pcBestPrev,pcDebriefBody};')();return {api,els,S};}
module.exports={boot};
