(() => {
'use strict';

/* REQ-145 Iteration 11 — world step feedback.
   Presentation-only. Observes canonical world position after render and adds a
   short-lived footfall cue. It does not own input, movement, collision, save,
   story, encounter, battle, or progression state. */

if(window.LQ_REQ145_WORLD_STEP_FEEDBACK)return;

const STYLE_ID='lq-req145-world-step-feedback-style';
const CUE_CLASS='lq145StepCue';
const MAX_LIFETIME_MS=360;
const MIN_INTERVAL_MS=90;
let lastKey=null;
let lastEmitAt=0;
let presentations=0;

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
body.lqReq145GoldSlice .world .${CUE_CLASS}{position:absolute;z-index:11;width:30px;height:12px;transform:translate(-50%,-50%);pointer-events:none;contain:layout paint;opacity:0}
body.lqReq145GoldSlice .world .${CUE_CLASS}::before,body.lqReq145GoldSlice .world .${CUE_CLASS}::after{content:"";position:absolute;bottom:1px;width:8px;height:4px;border:1px solid rgba(221,231,226,.42);border-radius:50%;background:rgba(205,218,211,.12);box-shadow:0 0 5px rgba(255,255,255,.10)}
body.lqReq145GoldSlice .world .${CUE_CLASS}::before{left:3px;animation:lq145StepPuff ${MAX_LIFETIME_MS}ms ease-out both}
body.lqReq145GoldSlice .world .${CUE_CLASS}::after{right:3px;animation:lq145StepPuff ${MAX_LIFETIME_MS}ms 35ms ease-out both}
@keyframes lq145StepPuff{0%{opacity:0;transform:translateY(3px) scale(.55)}24%{opacity:.58}100%{opacity:0;transform:translateY(-4px) scale(1.35)}}
@media(prefers-reduced-motion:reduce){body.lqReq145GoldSlice .world .${CUE_CLASS}::before,body.lqReq145GoldSlice .world .${CUE_CLASS}::after{animation:none!important;opacity:.22!important}}
`;
  document.head.appendChild(style);
}

function eligible(){
  return typeof s!=='undefined'&&s&&s.screen==='world'&&!s.dialog&&Number.isFinite(Number(s.x))&&Number.isFinite(Number(s.y));
}

function emit(){
  if(!eligible())return false;
  const world=document.querySelector('.gameShell .world');
  const player=document.querySelector('.gameShell .world .player');
  if(!world||!player)return false;
  const now=performance.now();
  if(now-lastEmitAt<MIN_INTERVAL_MS)return false;
  lastEmitAt=now;

  const cue=document.createElement('i');
  cue.className=CUE_CLASS;
  cue.setAttribute('aria-hidden','true');
  const left=parseFloat(player.style.left);
  const top=parseFloat(player.style.top);
  if(Number.isFinite(left)&&Number.isFinite(top)){
    cue.style.left=`${left+24}px`;
    cue.style.top=`${top+46}px`;
  }else if(typeof TS!=='undefined'){
    cue.style.left=`${Number(s.x)*TS+24}px`;
    cue.style.top=`${Number(s.y)*TS+46}px`;
  }else return false;
  world.appendChild(cue);
  presentations++;
  setTimeout(()=>cue.remove(),MAX_LIFETIME_MS+80);
  return true;
}

function observe(){
  if(!eligible()){lastKey=null;return;}
  const key=`${s.map}:${s.x}:${s.y}`;
  if(lastKey!==null&&key!==lastKey)emit();
  lastKey=key;
}

installStyle();
const root=document.getElementById('app')||document.body;
const observer=new MutationObserver(observe);
observer.observe(root,{childList:true,subtree:true});
observe();

window.LQ_REQ145_WORLD_STEP_FEEDBACK={
  version:'1.0.0',
  requirement:'REQ-145',
  iteration:11,
  presentationOnly:true,
  inputAuthority:false,
  movementAuthority:false,
  collisionAuthority:false,
  saveAuthority:false,
  storyAuthority:false,
  battleAuthority:false,
  maxLifetimeMs:MAX_LIFETIME_MS,
  presentations:()=>presentations,
  observe,
  emit,
  iosPhysicalVerification:'PENDING'
};
})();
