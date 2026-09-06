(() => {
'use strict';

/* REQ-111 — presentation-only reconciliation for the canonical Tap Anywhere Action.
   Input remains owned by floating-touch-controller.js. This add-on only updates
   legacy A-only copy after DOM reconstruction. */

const STYLE_ID='lq-tap-first-affordance-style';
const DIALOGUE_COPY='タップ / Aで閉じる';

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
.npc.lqFacingNpc.lqTapFirstNpc::after{content:'話す'!important;width:auto!important;min-width:28px!important;height:18px!important;padding:0 5px!important;border-radius:9px!important;font-size:7px!important;letter-spacing:.04em!important}
.lqLandmarkPrompt.lqTapFirstLandmark b{width:auto!important;min-width:34px!important;padding:0 5px!important;border-radius:9px!important;font-size:7px!important;letter-spacing:.03em!important}
.dialogBox .lqTapFirstDialogueHint{font-weight:800;color:#b8cad7!important}
`;
  document.head.appendChild(style);
}

function syncDialogue(){
  const box=app?.querySelector?.('.dialogBox');
  if(!box)return null;
  const candidates=[...box.querySelectorAll('.sub')];
  const footer=candidates.find(el=>/Aで閉じる|タップ\s*\/\s*Aで閉じる/.test(el.textContent||''));
  if(!footer)return null;
  footer.textContent=DIALOGUE_COPY;
  footer.classList.add('lqTapFirstDialogueHint');
  footer.dataset.lqTapFirst='true';
  return footer;
}

function syncNpc(){
  const markers=[...app.querySelectorAll('.npc.lqFacingNpc')];
  markers.forEach(el=>{
    el.classList.add('lqTapFirstNpc');
    el.dataset.lqInteractionCue='話す';
  });
  return markers;
}

function syncLandmark(){
  const prompts=[...app.querySelectorAll('.lqLandmarkPrompt')];
  prompts.forEach(el=>{
    el.classList.add('lqTapFirstLandmark');
    el.dataset.lqInteractionCue='調べる';
    const badge=el.querySelector('b');
    if(badge&&badge.textContent.trim()==='A')badge.textContent='調べる';
  });
  return prompts;
}

function sync(){
  if(typeof s==='undefined'||!s||s.screen!=='world')return;
  syncDialogue();syncNpc();syncLandmark();
}

injectStyle();
if(typeof world==='function'){
  const beforeTapFirstWorld=world;
  world=function(){const result=beforeTapFirstWorld.apply(this,arguments);sync();return result;};
}
if(typeof render==='function'){
  const beforeTapFirstRender=render;
  render=function(){const result=beforeTapFirstRender.apply(this,arguments);sync();return result;};
}
if(typeof s!=='undefined'&&s?.screen==='world')sync();

function fail(reason){
  const old=document.querySelector('.lqTapFirstAffordanceSmokeFailure');if(old)old.remove();
  const el=document.createElement('div');el.className='lqTapFirstAffordanceSmokeFailure';el.hidden=true;el.dataset.reason=String(reason);document.body.appendChild(el);
  throw new TypeError(`REQ-111 tap-first affordance smoke failed: ${reason}`);
}
function assert(ok,reason){if(!ok)fail(reason);}
function smoke(){
  const snapshot={
    screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,
    dialog:s.dialog?{...s.dialog}:s.dialog,
    flags:{...(s.flags||{})},pauseOpen:s.pauseOpen,shopOpen:s.shopOpen,
    victoryResult:s.victoryResult
  };
  const flagsBefore=JSON.stringify(s.flags||{});
  try{
    injectStyle();

    s.screen='world';s.map='town';s.x=4;s.y=7;s.dir='up';
    s.pauseOpen=false;s.shopOpen=false;s.victoryResult=null;
    s.dialog={name:'テスト',text:'Tap Anywhere 表示監査'};
    render();sync();
    const footer=app.querySelector('.dialogBox .lqTapFirstDialogueHint');
    assert(footer&&footer.textContent.trim()===DIALOGUE_COPY,'dialogue tap-first copy');
    assert(![...app.querySelectorAll('.dialogBox .sub')].some(el=>el.textContent.trim()==='Aで閉じる'),'A-only dialogue copy removed');
    assert(app.querySelector('.actionPad .a'),'fallback A remains');

    s.dialog=null;s.x=4;s.y=7;s.dir='up';render();sync();
    const npc=app.querySelector('.npc.lqFacingNpc.lqTapFirstNpc');
    assert(npc,'facing npc marker preserved');
    assert(npc.dataset.lqInteractionCue==='話す','npc semantic cue');
    const style=document.getElementById(STYLE_ID);
    assert(style&&style.textContent.includes("content:'話す'"),'npc A-only pseudo copy overridden');

    s.x=8;s.y=9;s.dir='up';render();sync();
    const prompt=app.querySelector('.lqLandmarkPrompt.lqTapFirstLandmark');
    assert(prompt,'landmark prompt preserved');
    const badge=prompt.querySelector('b');
    assert(badge&&badge.textContent.trim()==='調べる','landmark semantic cue');
    assert(prompt.dataset.lqInteractionCue==='調べる','landmark presentation authority');

    render();sync();
    assert(app.querySelectorAll('.lqTapFirstDialogueHint').length<=1,'no duplicate dialogue hints');
    assert(app.querySelectorAll('.lqLandmarkPrompt').length<=1,'no duplicate landmark prompts');
    assert(JSON.stringify(s.flags||{})===flagsBefore,'story flags unchanged');
    assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'Tap Anywhere canonical status');
    assert(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true,'fullscreen canonical status');

    const marker=document.createElement('div');
    marker.className='lqTapFirstAffordanceSmokeMarker';marker.hidden=true;
    marker.dataset.req111='true';marker.dataset.dialogue='true';marker.dataset.npc='true';marker.dataset.landmark='true';marker.dataset.fallbackA='true';marker.dataset.pointerAuthority='false';
    document.body.appendChild(marker);
  } finally {
    s.screen=snapshot.screen;s.map=snapshot.map;s.x=snapshot.x;s.y=snapshot.y;s.dir=snapshot.dir;
    s.dialog=snapshot.dialog;s.flags=snapshot.flags;s.pauseOpen=snapshot.pauseOpen;s.shopOpen=snapshot.shopOpen;s.victoryResult=snapshot.victoryResult;
    render();
  }
}

window.LQ_TAP_FIRST_AFFORDANCE_STATUS={
  requirement:'REQ-111',presentationOnly:true,pointerAuthority:false,
  actionAuthority:false,movementAuthority:false,saveSchemaChange:false,
  dialogueCopy:DIALOGUE_COPY,iosPhysicalVerification:'PENDING'
};
window.LQ_TAP_FIRST_AFFORDANCE_TEST={sync,smoke};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
