(() => {
'use strict';

/* REQ-141 late-stage recovery.
   Runs after normal DEFAULT + migration/add-on initialization so the recovery
   keeps the current runtime schema instead of replacing it with a hand-built
   partial object. Only checkpoint/progression fields are changed. */
const STAGE_KEY='lqReq141PreLeonRecovery';
const TARGET_MAP='cloudbreakSaddle';

function staged(){
  try{
    const raw=sessionStorage.getItem(STAGE_KEY);
    if(!raw)return false;
    const v=JSON.parse(raw);
    return !!v&&v.version===1;
  }catch(_){return false;}
}
function clearStage(){try{sessionStorage.removeItem(STAGE_KEY)}catch(_){} }
function apply(){
  if(!staged())return false;
  if(typeof s==='undefined'||!s||typeof s!=='object'||!MAPS?.[TARGET_MAP]){
    console.warn('[LUKE QUEST] REQ-141 late recovery prerequisites unavailable');
    return false;
  }

  const flags=(s.flags&&typeof s.flags==='object'&&!Array.isArray(s.flags))?s.flags:(s.flags={});

  Object.assign(s,{
    screen:'world',
    lv:11,
    hp:132,
    mh:132,
    atk:34,
    xp:413,
    nx:1135,
    gold:Math.max(Number.isFinite(s.gold)?s.gold:0,900),
    potions:Math.max(Number.isFinite(s.potions)?s.potions:0,6),
    map:TARGET_MAP,
    x:10,
    y:2,
    dir:'up',
    enemy:null,
    ehp:0,
    dialog:null,
    pauseOpen:false,
    shopOpen:false,
    mp:30,
    mmp:30
  });

  Object.assign(flags,{
    leonSeen:true,
    mistEntered:true,
    glennTraceSeen:true,
    observationEntered:true,
    glennSeen:true,
    evacEntered:true,
    leonInjurySeen:true,
    escapeProofSeen:true,
    withdrawProofSeen:true,
    guidanceIntroSeen:true,
    req118OpeningComplete:true,
    req118OpeningPhase:'legacy_bypass',
    chapter1ClimaxStarted:false,
    chapter1HeroRevealedToLeon:false,
    chapter1LeonConfrontationResolved:false,
    chapter1SisterWounded:false,
    chapter1SisterInjuryNonfatal:false,
    chapter1Complete:false
  });

  if(Array.isArray(s.discoveredMaps)&&!s.discoveredMaps.includes(TARGET_MAP))s.discoveredMaps.push(TARGET_MAP);
  s.log=Array.isArray(s.log)?s.log:[];
  s.log.push('雲上の鞍部へ安全復旧した。北の石段の先にレオンの追跡路が続いている。');

  try{if(typeof stopMoving==='function')stopMoving()}catch(_){}
  try{if(typeof save==='function')save();else localStorage.setItem('lukeQuestV2',JSON.stringify(s))}catch(error){
    console.warn('[LUKE QUEST] REQ-141 canonical save failed',error);
    return false;
  }

  clearStage();
  try{
    const url=new URL(location.href);
    url.searchParams.delete('recovery-stage');
    url.searchParams.set('recovered','pre-leon-schema-safe-lv11');
    history.replaceState(null,'',url.pathname+'?'+url.searchParams.toString()+url.hash);
  }catch(_){}

  try{if(typeof render==='function')render()}catch(error){
    console.warn('[LUKE QUEST] REQ-141 render after recovery failed',error);
    return false;
  }
  console.info('[LUKE QUEST] REQ-141 schema-safe pre-Leon LV11 recovery applied');
  return true;
}

window.LQ_REQ141_STATUS={requirement:'REQ-141',targetMap:TARGET_MAP,level:11,schemaSafeTwoStage:true,iosPhysicalVerification:'PENDING'};
setTimeout(apply,0);
})();
