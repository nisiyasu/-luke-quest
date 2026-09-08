import fs from 'node:fs';
import vm from 'node:vm';

const prelude=fs.readFileSync('prelude/autosave-bootstrap-guard.js','utf8');
const late=fs.readFileSync('addons/zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz-req141-pre-leon-recovery.js','utf8');

function storage(seed={}){
  const m=new Map(Object.entries(seed));
  return {
    getItem:k=>m.has(String(k))?m.get(String(k)):null,
    setItem:(k,v)=>m.set(String(k),String(v)),
    removeItem:k=>m.delete(String(k)),
    keys:()=>[...m.keys()],
    raw:m
  };
}
function assert(v,msg){if(!v)throw new Error(msg)}

// Stage 1: explicit recovery request must back up, clear canonical save, set a
// one-shot session marker and navigate without constructing a replacement save.
{
  const original=JSON.stringify({screen:'world',map:'windStairRidge',customFutureField:{keep:true}});
  const localStorage=storage({lukeQuestV2:original});
  const sessionStorage=storage();
  let replaced='';
  const location={
    search:'?leon-recovery=1',
    href:'https://example.test/?leon-recovery=1',
    pathname:'/',
    hash:'',
    replace:v=>{replaced=String(v)}
  };
  const ctx={console,localStorage,sessionStorage,location,URL,URLSearchParams,Date};
  vm.createContext(ctx);vm.runInContext(prelude,ctx);
  assert(localStorage.getItem('lukeQuestV2')===null,'stage1 canonical save must be removed');
  const backup=localStorage.keys().find(k=>k.startsWith('lukeQuestV2_req141_before_pre_leon_recovery_'));
  assert(backup&&localStorage.getItem(backup)===original,'stage1 must preserve exact prior save');
  const marker=JSON.parse(sessionStorage.getItem('lqReq141PreLeonRecovery')||'null');
  assert(marker?.version===1,'stage1 session marker missing');
  assert(replaced.includes('recovery-stage=req141'),'stage1 must reload into req141 stage');
  assert(!replaced.includes('leon-recovery=1'),'stage1 must remove explicit recovery query');
}

// Stage 2: start from a runtime-shaped state and prove unknown/future schema
// fields survive while only the intended checkpoint/progression fields change.
{
  const localStorage=storage();
  const sessionStorage=storage({lqReq141PreLeonRecovery:JSON.stringify({version:1,requestedAt:1})});
  let saveCount=0,renderCount=0,stopCount=0;
  const s={
    screen:'title',lv:1,hp:42,mh:42,atk:7,xp:0,nx:20,gold:10,potions:2,
    map:'town',x:9,y:12,dir:'up',enemy:{n:'sentinel'},ehp:3,dialog:{name:'x'},
    flags:{futureFlag:'preserve-me'},discoveredMaps:['town'],log:[],
    pauseOpen:true,shopOpen:true,mp:7,mmp:7,
    customFutureField:{nested:['must','survive']}
  };
  const MAPS={cloudbreakSaddle:{name:'雲上の鞍部'}};
  const location={href:'https://example.test/?recovery-stage=req141',pathname:'/',search:'?recovery-stage=req141',hash:''};
  const history={replaceState:()=>{}};
  const save=()=>{saveCount++;localStorage.setItem('lukeQuestV2',JSON.stringify(s))};
  const render=()=>{renderCount++};
  const stopMoving=()=>{stopCount++};
  const ctx={console,localStorage,sessionStorage,s,MAPS,location,history,save,render,stopMoving,URL,URLSearchParams,setTimeout:fn=>{fn();return 1}};
  vm.createContext(ctx);vm.runInContext(late,ctx);
  assert(saveCount===1,'stage2 canonical save must run exactly once');
  assert(renderCount===1,'stage2 canonical render must run exactly once');
  assert(stopCount===1,'stage2 stopMoving must run exactly once');
  assert(sessionStorage.getItem('lqReq141PreLeonRecovery')===null,'stage2 marker must clear');
  assert(s.map==='cloudbreakSaddle'&&s.x===10&&s.y===2&&s.dir==='up','stage2 recovery checkpoint mismatch');
  assert(s.lv===11&&s.hp===132&&s.mh===132&&s.atk===34&&s.mp===30&&s.mmp===30,'stage2 LV11 combat values mismatch');
  assert(s.enemy===null&&s.dialog===null&&s.pauseOpen===false&&s.shopOpen===false,'stage2 transient state not cleared');
  assert(s.customFutureField?.nested?.join(',')==='must,survive','stage2 must preserve future schema fields');
  assert(s.flags.futureFlag==='preserve-me','stage2 must preserve unrelated flags');
  assert(s.flags.withdrawProofSeen===true&&s.flags.chapter1Complete===false,'stage2 pursuit/climax flags mismatch');
  assert(s.discoveredMaps.includes('cloudbreakSaddle'),'stage2 discovered map missing');
  const persisted=JSON.parse(localStorage.getItem('lukeQuestV2')||'null');
  assert(persisted?.customFutureField?.nested?.[1]==='survive','persisted schema sentinel lost');
}

console.log('REQ-141 schema-safe two-stage pre-Leon recovery smoke PASS');
