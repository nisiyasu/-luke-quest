(() => {
'use strict';

/* REQ-118 Checkpoint A+B
   Owner-approved playable opening foundation.
   Integration rules:
   - wraps the final composed newGame() authority, so REQ-069 overwrite guard stays authoritative;
   - never intercepts Continue/load;
   - uses existing town/world/action/save/render authorities;
   - adds only opening-scoped flags and presentation;
   - no filters/backdrop/isolation/will-change on the iPhone world path. */

const REQ='REQ-118';
const PHASE_KEY='req118OpeningPhase';
const DONE_KEY='req118OpeningComplete';
const GUARDIAN_KEY='req118GuardianSpoken';
const STYLE_ID='lq-req118-opening-ab-style';
const COLD='cold_open';
const MORNING='aldia_morning';
const B_DONE='aldia_morning_complete';

function flags(){
  if(typeof s==='undefined'||!s)return null;
  if(!s.flags||typeof s.flags!=='object'||Array.isArray(s.flags))s.flags={};
  return s.flags;
}
function phase(){return flags()?.[PHASE_KEY]||null;}
function isOpening(){return !flags()?.[DONE_KEY]&&[COLD,MORNING,B_DONE].includes(phase());}
function safeSave(){try{if(typeof save==='function')save();}catch(e){console.error('REQ-118 save failed',e);}}
function installStyle(){
 if(document.getElementById(STYLE_ID))return;
 const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
.lqReq118Cold{min-height:calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom));display:flex;align-items:center;justify-content:center;padding:18px;background:#07111f;color:#fff7dd}
.lqReq118ColdCard{width:min(100%,560px);padding:22px 18px 18px;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:#101d31;box-shadow:0 14px 34px rgba(0,0,0,.34)}
.lqReq118Eyebrow{font-size:12px;letter-spacing:.18em;color:#d5bd72;font-weight:800;margin-bottom:10px}.lqReq118Cold h1{font-size:clamp(26px,8vw,40px);line-height:1.12;margin:0 0 12px}.lqReq118Cold p{line-height:1.72;margin:8px 0;color:#d9e0e8}.lqReq118Cold .lqReq118Lead{font-size:17px;color:#fff7dd}.lqReq118Cold button{width:100%;margin-top:18px;padding:14px;border:0;border-radius:13px;background:#347cff;color:white;font:inherit;font-weight:900}
.lqReq118MorningHud{position:absolute;left:max(10px,env(safe-area-inset-left));right:max(10px,env(safe-area-inset-right));top:max(64px,calc(env(safe-area-inset-top) + 54px));z-index:66;pointer-events:none;display:flex;justify-content:center}.lqReq118MorningHud>div{max-width:min(92%,470px);padding:7px 11px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(7,17,31,.78);font-size:12px;font-weight:850;line-height:1.25;text-align:center}.lqReq118MorningCue{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:65;pointer-events:none;padding:6px 9px;border-radius:999px;background:rgba(246,211,91,.92);color:#241900;font-size:11px;font-weight:950;animation:lqReq118Cue 1.1s ease-in-out infinite alternate}@keyframes lqReq118Cue{from{opacity:.64;transform:translate(-50%,-50%) scale(.98)}to{opacity:1;transform:translate(-50%,-50%) scale(1.03)}}
@media(prefers-reduced-motion:reduce){.lqReq118MorningCue{animation:none!important}}
`;
 document.head.appendChild(st);
}
function coldMarkup(){
 return `<main class="lqReq118Cold" data-req118-phase="${COLD}"><section class="lqReq118ColdCard"><div class="lqReq118Eyebrow">王都アルディア / 勇者選定の朝</div><h1>今日、勇者が選ばれる。</h1><p class="lqReq118Lead">王都は、祭りの日のように早く目を覚ましていた。</p><p>神殿へ続く通りには旗が並び、人々は「次の勇者」の名前を好き勝手に予想している。</p><p>そのざわめきの少し外で、まだ何者でもない少年ルークも朝を迎える。</p><button id="lqReq118Wake" type="button">ルークの朝を始める</button></section></main>`;
}
function showCold(){
 installStyle();
 app.innerHTML=coldMarkup();
 document.getElementById('lqReq118Wake')?.addEventListener('click',beginMorning,{once:true});
 document.body.classList.remove('lqWorldFullscreen');
}
function beginMorning(){
 const f=flags();if(!f)return;
 f[PHASE_KEY]=MORNING;f[GUARDIAN_KEY]=false;
 s.screen='world';s.map='town';s.x=8;s.y=13;s.dir='up';s.dialog=null;
 safeSave();render();
}
function guardianDialogue(){
 const f=flags();if(!f)return false;
 if(phase()!==MORNING||s.screen!=='world'||s.map!=='town')return false;
 if(!(s.x===8&&s.y===13&&s.dir==='up'))return false;
 if(s.dialog)return false;
 const first=!f[GUARDIAN_KEY];
 f[GUARDIAN_KEY]=true;
 s.dialog={name:'ルークの保護者',text:first?'「忘れ物は？　……まあ、あなたなら忘れてても走って戻ってきそうね。」\nルーク「勇者選定の日に遅刻したら、伝説にはなれそうですね。」\n「変な伝説を作らないで。神殿前へ行ってらっしゃい。」':'「神殿前はもう人でいっぱいよ。気をつけて行ってらっしゃい。」'};
 safeSave();render();return true;
}
function maybeCompleteMorning(){
 const f=flags();if(!f||phase()!==MORNING||!f[GUARDIAN_KEY]||s.screen!=='world'||s.map!=='town')return;
 if(s.y<=6&&s.x>=6&&s.x<=10){
   f[PHASE_KEY]=B_DONE;
   s.dialog={name:'ルーク',text:'神殿前は、朝とは思えないほどの人だ。\n「勇者選定って、もっと静かに水晶を見る行事だと思ってました……。」'};
   safeSave();
 }
}
function syncWorldPresentation(){
 installStyle();
 document.querySelectorAll('.lqReq118MorningHud,.lqReq118MorningCue').forEach(n=>n.remove());
 if(typeof s==='undefined'||s.screen!=='world'||s.map!=='town'||![MORNING,B_DONE].includes(phase()))return;
 const shell=document.querySelector('.gameShell');if(!shell)return;
 const f=flags();
 const hud=document.createElement('div');hud.className='lqReq118MorningHud';
 const objective=phase()===B_DONE?'勇者選定会場に到着した。周囲を見てみよう。':(!f?.[GUARDIAN_KEY]?'家を出る前に、保護者へ声をかける。':'北の神殿前へ向かう。');
 hud.innerHTML=`<div>OPENING · ${objective}</div>`;shell.appendChild(hud);
 if(phase()===MORNING&&!f?.[GUARDIAN_KEY]&&s.x===8&&s.y===13){const cue=document.createElement('div');cue.className='lqReq118MorningCue';cue.textContent='短くタップして話す';shell.appendChild(cue);}
}
function advancedProgress(raw){
 if(!raw||typeof raw!=='object')return false;
 const f=raw.flags&&typeof raw.flags==='object'?raw.flags:{};
 return raw.screen==='world'||raw.screen==='battle'||raw.screen==='menu'||raw.screen==='shop'||raw.screen==='end'||Boolean(f.forestGate||f.leonMet||f.leonFound||f.glennMet||f.withdrew||f.withdrawProofSeen||f.returned);
}
function normalizeLoadedProgress(){
 const f=flags();if(!f)return;
 if(f[DONE_KEY])return;
 if(!f[PHASE_KEY]&&advancedProgress(s)){f[DONE_KEY]=true;f[PHASE_KEY]='legacy_bypass';}
}

installStyle();
normalizeLoadedProgress();

if(typeof newGame==='function'){
 const composedNewGame=newGame;
 newGame=function(){
   const screenBefore=s?.screen;
   const out=composedNewGame.apply(this,arguments);
   // REQ-069 first click with an existing resumable save leaves the current
   // state in place. Only enter the opening after the composed authority has
   // actually reset into the canonical intro screen.
   if(typeof s!=='undefined'&&s.screen==='intro'&&screenBefore!==undefined){
     const f=flags();f[PHASE_KEY]=COLD;f[DONE_KEY]=false;f[GUARDIAN_KEY]=false;s.screen='intro';safeSave();showCold();
   }
   return out;
 };
}
if(typeof intro==='function'){
 const baseIntro=intro;
 intro=function(){if(phase()===COLD&&!flags()?.[DONE_KEY])return showCold();return baseIntro.apply(this,arguments);};
}
if(typeof action==='function'){
 const baseAction=action;
 action=function(){if(guardianDialogue())return;return baseAction.apply(this,arguments);};
}
if(typeof move==='function'){
 const baseMove=move;
 move=function(){const out=baseMove.apply(this,arguments);queueMicrotask(()=>{maybeCompleteMorning();syncWorldPresentation();});return out;};
}
if(typeof render==='function'){
 const baseRender=render;
 render=function(){const out=baseRender.apply(this,arguments);syncWorldPresentation();return out;};
}
if(typeof world==='function'){
 const baseWorld=world;
 world=function(){const out=baseWorld.apply(this,arguments);syncWorldPresentation();return out;};
}

window.LQ_REQ118_OPENING_STATUS={requirement:REQ,checkpoint:'A+B',status:'IN_PROGRESS',coldOpen:true,playableAldiaMorning:true,canonicalTown:true,canonicalAction:true,newGameGuardComposed:true,continueIntercept:false,advancedSaveBypass:true,saveSchemaAdditiveFlagsOnly:true,req021Protected:true,req022Protected:true,req001Protected:true,iosPhysicalVerification:'PENDING'};
window.LQ_REQ118_OPENING_TEST={showCold,beginMorning,guardianDialogue,maybeCompleteMorning,syncWorldPresentation,advancedProgress,phase};

function smokeFail(reason){const n=document.createElement('i');n.id='lqReq118ABMarker';n.hidden=true;n.dataset.status='FAIL';n.dataset.error=String(reason);document.body.appendChild(n);throw new Error(`REQ-118 AB smoke: ${reason}`);}
function assert(ok,msg){if(!ok)smokeFail(msg);}
function smoke(){
 const snap=structuredClone(s);let stored=null;try{stored=localStorage.getItem('lukeQuestV2');}catch{}
 try{
   Object.assign(s,structuredClone(DEFAULT));
   const f=flags();f[PHASE_KEY]=COLD;f[DONE_KEY]=false;f[GUARDIAN_KEY]=false;s.screen='intro';render();
   assert(document.querySelector('[data-req118-phase="cold_open"]'),'cold open rendered');
   beginMorning();
   assert(s.screen==='world'&&s.map==='town'&&s.x===8&&s.y===13,'playable morning spawn');
   assert(phase()===MORNING,'morning phase');
   assert(document.querySelector('.lqReq118MorningHud'),'morning objective overlay');
   assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'REQ-021 tap authority');
   assert(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true,'REQ-022 fullscreen authority');
   s.dir='up';s.dialog=null;guardianDialogue();
   assert(Boolean(flags()[GUARDIAN_KEY])&&Boolean(s.dialog),'guardian canonical dialogue');
   s.dialog=null;s.x=8;s.y=6;maybeCompleteMorning();render();
   assert(phase()===B_DONE,'morning completion trigger');
   assert(Boolean(s.dialog),'arrival dialogue');
   const advanced=structuredClone(DEFAULT);advanced.screen='world';advanced.map='forest';advanced.flags={...advanced.flags,leonMet:true};
   assert(advancedProgress(advanced)===true,'advanced save bypass detection');
   const marker=document.createElement('i');marker.id='lqReq118ABMarker';marker.hidden=true;marker.dataset.status='PASS';marker.dataset.coldOpen='true';marker.dataset.playable='true';marker.dataset.guardian='true';marker.dataset.canonicalAction='true';marker.dataset.advancedBypass='true';marker.dataset.tapAuthority='true';marker.dataset.fullscreenAuthority='true';document.body.appendChild(marker);
 }finally{
   Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snap);render();
   try{if(stored===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',stored);}catch{}
 }
}
if(new URLSearchParams(location.search).get('lqReq118ABSmoke')==='1')setTimeout(smoke,5000);
})();