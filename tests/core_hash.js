#!/usr/bin/env node
/* Re-stamp preconnect-core.js's header hash after editing it, then copy the file to every repo.
   Usage: node tests/core_hash.js [path/to/preconnect-core.js]   (default: ../preconnect-core.js) */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const p=process.argv[2]||path.join(__dirname,'..','preconnect-core.js');const t=fs.readFileSync(p,'utf8');const first=t.split('\n')[0];const body=t.slice(first.length+1);
const ver=(first.match(/preconnect-core (\S+)/)||[])[1]||'0.0.0';const h=crypto.createHash('sha256').update(body,'utf8').digest('hex');
fs.writeFileSync(p,`/* preconnect-core ${ver} sha256:${h} */\n`+body);console.log('stamped',p,ver,h.slice(0,12));
