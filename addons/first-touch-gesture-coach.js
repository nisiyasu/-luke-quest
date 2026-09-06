(() => {
'use strict';

/* REQ-112 — presentation-only first-touch gesture coaching.
   Canonical touch input remains fully owned by floating-touch-controller.js. */

const STYLE_ID='lq-first-touch-gesture-coach-style';
const COACH_CLASS='lqFirstTouchGestureCoach';
const SHOW_MS=4800;
let sessionShown=false;
let hideTimer=null;

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
.${COACH_CLASS}{position:absolute;left:50%;bottom:max(78px,calc(env(safe-area-inset-bottom) + 68px));transform:translateX(-50%);z-index:24;display:flex;gap:7px;align-items:center;justify-content:center;max-width:calc(100% - 32px);padding:7px 10px;border:1px solid #d8edff42;border-radius:999px;background:#07111fd9;color:#edf7ff;box-shadow:0 5px 16px #0008;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);font-size:10px;font-weight:850;line-height:1.2;letter-spacing:.01em;white-space:nowrap;pointer-events:none;user-select:none;-webkit-user-select:none;animation:lqCoachIn .18s ease-out}
.${COACH_CLASS} b{color:#ffe58a;font-size:10px}.${COACH_CLASS} .lqCoachSep{color:#8da5b8}
@keyframes lqCoachIn{from{opacity:0;transform:translate(-50%,5px)}to{opacity:1;transform:translate(-50%,0)}}
@media(max-width:380px){.${COACH_CLASS}{font-size:9px;gap:5px;padding:6px 8px}.${COACH_CLASS} b{font-size:9px}}
@media(prefers-reduced-motion:reduce){.${COACH_CLASS}{animation:none}}
`;
  document.head.appendChild(style);
}

function clearTimer(){
  if(hideTimer!==null){clearTimeout(hideTimer);hideTimer=null;}
}

function removeCoach(){
  clearTimer();
  document.querySelectorAll('.'+COACH_CLASS).forEach(el=>el.remove());
}

function isCoarsePointer(){
  try{return !!window.matchMedia&&window.matchMedia('(pointer: coarse)').matches;}catch(_){return false;}
}

function blockedWorldState(){
  return typeof s==='undefined'||!s||s.screen!=='world'||!!s.dialog||!!s.pauseOpen||!!s.shopOpen||!!s.battle;
}

function createCoach(force=false){
  injectStyle();
  if(!force&&(!isCoarsePointer()||sessionShown||blockedWorldState()))return null;
  if(blockedWorldState())return null;
  const shell=document.querySelector('.gameShell');
  if(!shell)return null;
  let coach=shell.querySelector('.'+COACH_CLASS);
  if(coach)return coach;
  coach=document.createElement('div');
  coach.className=COACH_CLASS;
  coach.setAttribute('aria-hidden','true');
  coach.dataset.req112='true';
  coach.dataset.pointerAuthority='false';
  coach.innerHTML='<span><b>短くタップ</b>：調べる</span><span class="lqCoachSep">•</span><span><b>スライド</b>：歩く</span>';
  shell.appendChild(coach);
  sessionShown=true;
  if(!force){
    clearTimer();
    hideTimer=setTimeout(removeCoach,SHOW_MS);
  }
  return coach;
}

function sync(force=false){
  if(blockedWorldState()){removeCoach();return null;}
  const existing=document.querySelector('.'+COACH_CLASS);
  if(existing)return existing;
  return createCoach(force);
}

injectStyle();
if(typeof world==='function'){
  const beforeReq112World=world;
  world=function(){const result=beforeReq112World.apply(this,arguments);sync(false);return result;};
}
if(typeof render==='function'){
  const beforeReq112Render=render;
  render=function(){const result=beforeReq112Render.apply(this,arguments);sync(false);return result;};
}
if(typeof s!=='undefined'&&s?.screen==='world')sync(false);

function fail(reason){
  removeCoach();
  const old=document.querySelector('.lqFirstTouchGestureCoachSmokeFailure');if(old)old.remove();
  const el=document.createElement('div');el.className='lqFirstTouchGestureCoachSmokeFailure';el.hidden=true;el.dataset.reason=String(reason);document.body.appendChild(el);
  throw new TypeError(`REQ-112 gesture coach smoke failed: ${reason}`);
}
function assert(ok,reason){if(!ok)fail(reason);}
function smoke(){
  const snapshot={screen:s.screen,map:s.map,x:s.x,y:s.y,dialog:s.dialog?{...s.dialog}:s.dialog,pauseOpen:s.pauseOpen,shopOpen:s.shopOpen,battle:s.battle,flags:{...(s.flags||{})}};
  const flagsBefore=JSON.stringify(s.flags||{});
  const shownBefore=sessionShown;
  try{
    removeCoach();sessionShown=false;
    s.screen='world';s.map='town';s.x=8;s.y=13;s.dialog=null;s.pauseOpen=false;s.shopOpen=false;s.battle=null;
    render();
    removeCoach();
    const coach=createCoach(true);
    assert(coach,'coach created in world');
    assert(coach.textContent.includes('短くタップ')&&coach.textContent.includes('調べる'),'tap instruction');
    assert(coach.textContent.includes('スライド')&&coach.textContent.includes('歩く'),'slide instruction');
    assert(getComputedStyle(coach).pointerEvents==='none','pointer-events none');
    sync(true);assert(document.querySelectorAll('.'+COACH_CLASS).length===1,'idempotent single node');
    s.dialog={name:'監査',text:'会話中'};sync(true);assert(!document.querySelector('.'+COACH_CLASS),'dialogue suppresses coach');
    s.dialog=null;s.screen='battle';sync(true);assert(!document.querySelector('.'+COACH_CLASS),'non-world suppresses coach');
    assert(JSON.stringify(s.flags||{})===flagsBefore,'story flags unchanged');
    assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'canonical Tap Anywhere present');
    assert(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true,'canonical fullscreen present');
    const marker=document.createElement('div');marker.className='lqFirstTouchGestureCoachSmokeMarker';marker.hidden=true;
    marker.dataset.req112='true';marker.dataset.tap='true';marker.dataset.drag='true';marker.dataset.single='true';marker.dataset.dialogSuppressed='true';marker.dataset.pointerAuthority='false';document.body.appendChild(marker);
  } finally {
    removeCoach();sessionShown=shownBefore;
    s.screen=snapshot.screen;s.map=snapshot.map;s.x=snapshot.x;s.y=snapshot.y;s.dialog=snapshot.dialog;s.pauseOpen=snapshot.pauseOpen;s.shopOpen=snapshot.shopOpen;s.battle=snapshot.battle;s.flags=snapshot.flags;
    render();
  }
}

window.LQ_FIRST_TOUCH_GESTURE_COACH_STATUS={requirement:'REQ-112',presentationOnly:true,pointerAuthority:false,actionAuthority:false,movementAuthority:false,saveSchemaChange:false,sessionOnly:true,showMs:SHOW_MS,iosPhysicalVerification:'PENDING'};
window.LQ_FIRST_TOUCH_GESTURE_COACH_TEST={sync,createCoach,removeCoach,smoke};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
