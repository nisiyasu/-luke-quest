import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('prelude/autosave-bootstrap-guard.js','utf8');
const SAVE='lukeQuestV2';

function run(initial){
  const store=new Map(Object.entries(initial));
  const localStorage={
    getItem:key=>store.has(key)?store.get(key):null,
    setItem:(key,value)=>store.set(key,String(value)),
    removeItem:key=>store.delete(key)
  };
  const context={localStorage,console,Date,JSON,Object,Array,Set};
  vm.createContext(context);
  vm.runInContext(source,context,{filename:'prelude/autosave-bootstrap-guard.js'});
  return store.get(SAVE)??null;
}

const valid=JSON.parse(run({[SAVE]:JSON.stringify({screen:'world',keyItems:['森王の角','王城の通行証']})}));
if(JSON.stringify(valid.keyItems)!==JSON.stringify(['森王の角','王城の通行証']))throw new Error('valid keyItems changed');

const mixed=JSON.parse(run({[SAVE]:JSON.stringify({screen:'world',keyItems:['森王の角',42,'森王の角','王城の通行証',null]})}));
if(JSON.stringify(mixed.keyItems)!==JSON.stringify(['森王の角','王城の通行証']))throw new Error('mixed/duplicate keyItems not normalized');

for(const malformed of ['corrupt',{bad:true},7,null]){
  const out=JSON.parse(run({[SAVE]:JSON.stringify({screen:'world',keyItems:malformed})}));
  if(!Array.isArray(out.keyItems)||out.keyItems.length!==0)throw new Error(`malformed keyItems not normalized: ${JSON.stringify(malformed)}`);
}

const legacyRaw=JSON.stringify({screen:'world',gold:40});
const legacyOut=run({[SAVE]:legacyRaw});
if(legacyOut!==legacyRaw)throw new Error('legacy save without keyItems should remain byte-preserved');

console.log('REQ-078 autosave bootstrap keyItems smoke PASS');
