// Headless harness: loads ../index.html into a fake DOM with a fake localStorage.
const fs=require('fs'),path=require('path');
function boot(store){const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');const js=html.split('<script>')[1].split('</script>')[0];const els={};
 const mk=id=>({id,_cls:new Set(),style:{},value:'',textContent:'',innerHTML:'',classList:{add(){},remove(){},toggle(){},contains:()=>false},click(){}});
 for(const m of html.matchAll(/id="([^"]+)"/g))els[m[1]]=mk(m[1]);const S=Object.assign({},store||{});
 global.localStorage={getItem:k=>k in S?S[k]:null,setItem:(k,v)=>{S[k]=String(v);}};
 global.document={getElementById:i=>els[i]||(els[i]=mk(i)),createElement:()=>({click(){}}),activeElement:null};
 global.addEventListener=()=>{};global.navigator={};global.location={protocol:'file:'};
 global.Blob=function(p){this.parts=p;};global.URL={createObjectURL:b=>{global.__dl=b.parts.join('');return 'x';}};
 const api=new Function(js+';return {records,csvRows,toCSV,backup,restore,profile,render,MODS};')();return {api,els,S};}
module.exports={boot};
