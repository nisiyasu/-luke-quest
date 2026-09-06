import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('addons/adventure-journal.js','utf8');
const head={appendChild(){}};
const document={
  head,
  createElement(){return {textContent:'',className:'',innerHTML:'',appendChild(){},querySelector(){return null}};}
};
const context={
  console,
  document,
  window:{},
  s:{flags:{},wins:0,map:'town',pauseOpen:false,screen:'world'},
  app:{querySelector(){return null}},
  world(){},
  render(){},
  queueMicrotask(){},
  Number,
  Math,
  String
};
vm.createContext(context);
vm.runInContext(source,context,{filename:'addons/adventure-journal.js'});
const api=context.window.LQ_ADVENTURE_JOURNAL_TEST;
if(!api||typeof api.sideQuests!=='function')throw new Error('REQ-074 journal diagnostic API missing');

const rows=()=>api.sideQuests().map(x=>({...x}));
const bossRows=list=>list.filter(x=>x.text==='巨大な蹄跡'||x.text==='苔角の森王');

context.s.flags={forestBountyComplete:true};
let out=rows();
if(bossRows(out).length!==0)throw new Error('pre-discovery boss spoiler leaked into journal');

context.s.flags={forestBountyComplete:true,forestMiniBossWarned:true};
out=rows();
let boss=bossRows(out);
if(boss.length!==1||boss[0].text!=='巨大な蹄跡'||boss[0].done)throw new Error('discovered optional boss objective missing or wrong');
if(!boss[0].detail.includes('もう一度調べる'))throw new Error('discovered objective does not tell player what to do next');

context.s.flags={forestBountyComplete:true,forestMiniBossWarned:true,forestMiniBossDefeated:true};
out=rows();
boss=bossRows(out);
if(boss.length!==1||boss[0].text!=='苔角の森王'||boss[0].done!==true)throw new Error('defeated optional boss completion row missing or duplicated');

context.s.flags={
  elderCharmComplete:true,
  forestBountyComplete:true,
  lqHerbSampleQuestDone:true,
  forestMiniBossWarned:true,
  forestMiniBossDefeated:true
};
out=rows();
for(const title of ['旅好きの老人の銀留め具','森の討伐依頼','森の薬草標本','苔角の森王']){
  if(out.filter(x=>x.text===title).length!==1)throw new Error(`completion family missing/duplicated: ${title}`);
}
if(out.length!==4)throw new Error(`expected exactly four completed side rows, got ${out.length}`);

const before=JSON.stringify(context.s.flags);
rows();
if(JSON.stringify(context.s.flags)!==before)throw new Error('journal projection mutated progress flags');

const status=context.window.LQ_ADVENTURE_JOURNAL_STATUS;
if(!status?.sideQuests?.includes('forestMiniBoss')||status.spoilerSafe!==true)throw new Error('journal status contract missing optional boss/spoiler-safe declaration');

console.log('REQ-074 optional boss adventure journal smoke PASS');
