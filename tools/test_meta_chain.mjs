import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const code=fs.readFileSync(new URL('../meta-chain.js',import.meta.url),'utf8');
const sandbox={window:{},location:{hash:'#/chains'},document:{querySelectorAll(){return[]},getElementById(){return null}},URLSearchParams,FormData:class{},Blob:class{},crypto:crypto.webcrypto,CSS:{escape:s=>s},TextEncoder,console};
vm.createContext(sandbox);vm.runInContext(code,sandbox);
const m=sandbox.window.TXMetaChain;
if(!m) throw new Error('TXMetaChain was not exported');
if(m.templates.length!==13) throw new Error(`Expected 13 bundled templates, got ${m.templates.length}`);
const edible=m.templates.find(x=>x.id==='edible-infrastructure');
if(!edible||edible.stages.length!==16) throw new Error('Edible Infrastructure chain must contain 16 stages');
const empower=m.templates.find(x=>x.id==='empowerment-ai');
if(!empower||empower.stages.length!==5) throw new Error('Empowerment source-derived chain must contain 5 stages');
for(const t of m.templates){
  const ids=new Set();
  for(const s of t.stages){
    if(ids.has(s.id)) throw new Error(`Duplicate stage id ${s.id} in ${t.id}`);
    ids.add(s.id);
    for(const d of s.deps||[]) if(!t.stages.some(x=>x.id===d)) throw new Error(`Missing dependency ${d} in ${t.id}/${s.id}`);
  }
}
const state={records:{chains:[],chainRuns:[],chainArtifacts:[]},settings:{userMode:'community'}};
const domains=['food','water','energy','housing','resilience','health','insurance','mobility','learning','connectivity'].map(id=>({id,label:id,icon:'•'}));
const html=m.render({state,domains});
if(!html.includes('Meta-Chain Studio')||!html.includes('Start executable chain')) throw new Error('Meta-Chain hub did not render expected controls');
console.log(`PASS meta-chain runtime registry: ${m.templates.length} templates, ${m.templates.reduce((n,t)=>n+t.stages.length,0)} total stages, edible=${edible.stages.length}, empowerment=${empower.stages.length}`);
