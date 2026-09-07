(() => {
'use strict';

/* REQ-117/119 character grounding + field visual-body authority.
   Presentation-only: canonical entity left/top, collision, facing, input, save
   and story state remain untouched. */

const STYLE_ID='lq-world-character-grounding-style';
const BODY_CLASS='lqEntityVisualBody';
const SHADOW_CLASS='lqEntityFootShadow';

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
.player.lqGroundedEntity,.npc.lqGroundedEntity{overflow:visible!important;filter:none!important}
.player.lqGroundedEntity>.${SHADOW_CLASS},.npc.lqGroundedEntity>.${SHADOW_CLASS}{position:absolute;left:50%;bottom:1px;width:27px;height:8px;transform:translateX(-50%);border-radius:50%;background:rgba(3,8,15,.34);box-shadow:0 1px 1px rgba(0,0,0,.22);pointer-events:none;z-index:-1}
.npc.lqGroundedEntity>.${SHADOW_CLASS}{width:25px;height:7px;opacity:.88}
.glenn.lqGroundedEntity>.${SHADOW_CLASS}{width:29px;height:8px;background:rgba(8,4,18,.42)}
.player.lqGroundedEntity>.${BODY_CLASS},.npc.lqGroundedEntity>.${BODY_CLASS}{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;pointer-events:none;transform-origin:50% 88%;filter:none!important;will-change:auto}
.npc.lqGroundedEntity>.${BODY_CLASS}{text-shadow:-1px 0 rgba(4,8,14,.72),1px 0 rgba(4,8,14,.72),0 -1px rgba(4,8,14,.62),0 1px rgba(4,8,14,.78)}
.glenn.lqGroundedEntity>.${BODY_CLASS}{text-shadow:-1px 0 rgba(26,10,50,.9),1px 0 rgba(26,10,50,.9),0 -1px rgba(122,67,216,.78),0 1px rgba(3,4,10,.9)}
.player.lqGroundedEntity.lqIdleEntity>.${BODY_CLASS}{animation:lqPlayerIdleBreath 1.9s ease-in-out infinite}
.npc.lqGroundedEntity.lqIdleEntity>.${BODY_CLASS}{animation:lqNpcIdleBreath 2.25s ease-in-out infinite;animation-delay:var(--lq-idle-delay,0s)}
@keyframes lqPlayerIdleBreath{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(-1px) scaleY(1.012)}}
@keyframes lqNpcIdleBreath{0%,100%{transform:translateY(0) scaleY(1)}45%{transform:translateY(-1px) scaleY(1.01)}60%{transform:translateY(-1px) scaleY(1.006)}}
.npc.lqFacingNpc.lqTapFirstNpc::after{transform-origin:50% 100%;animation:lqInteractionCueIn 150ms cubic-bezier(.18,.82,.32,1) both}
.lqLandmarkPrompt.lqTapFirstLandmark{transform-origin:50% 100%;animation:lqInteractionCueIn 150ms cubic-bezier(.18,.82,.32,1) both}
.lqLandmarkPrompt.lqTapFirstLandmark b{animation:lqInteractionBadgeIn 140ms cubic-bezier(.18,.82,.32,1) both}
@keyframes lqInteractionCueIn{from{opacity:0;transform:translateY(5px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes lqInteractionBadgeIn{from{opacity:.25;transform:translateY(2px) scale(.94)}to{opacity:1;transform:translateY(0) scale(1)}}
@media(max-width:430px),(pointer:coarse){
 .player.lqGroundedEntity>.${BODY_CLASS},.npc.lqGroundedEntity>.${BODY_CLASS}{will-change:auto!important;filter:none!important}
}
@media(prefers-reduced-motion:reduce){
 .player.lqGroundedEntity.lqIdleEntity>.${BODY_CLASS},.npc.lqGroundedEntity.lqIdleEntity>.${BODY_CLASS},.npc.lqFacingNpc.lqTapFirstNpc::after,.lqLandmarkPrompt.lqTapFirstLandmark,.lqLandmarkPrompt.lqTapFirstLandmark b{animation:none!important;transform:none!important}
}
`;
  document.head.appendChild(style);
}

function isWorldIdle(){
  if(typeof s==='undefined'||!s||s.screen!=='world')return false;
  if(s.dialog)return false;
  if(typeof moveTimer!=='undefined'&&moveTimer!==null)return false;
  return true;
}

function ensureEntityVisual(entity,index){
  if(!entity)return entity;
  let shadow=entity.querySelector(`:scope > .${SHADOW_CLASS}`);
  let body=entity.querySelector(`:scope > .${BODY_CLASS}`);
  if(!shadow){shadow=document.createElement('span');shadow.className=SHADOW_CLASS;shadow.setAttribute('aria-hidden','true');}
  if(!body){
    body=document.createElement('span');body.className=BODY_CLASS;
    const movable=[...entity.childNodes].filter(n=>n!==shadow&&!(n.nodeType===1&&n.classList?.contains(BODY_CLASS)));
    for(const node of movable)body.appendChild(node);
  }
  if(shadow.parentNode!==entity||body.parentNode!==entity){entity.append(shadow,body);}
  entity.classList.add('lqGroundedEntity');
  entity.classList.toggle('lqIdleEntity',isWorldIdle());
  entity.style.setProperty('--lq-idle-delay',`${-((index%7)*.19).toFixed(2)}s`);
  entity.dataset.lqGrounded='true';
  return entity;
}

function sync(){
  if(typeof s==='undefined'||!s||s.screen!=='world')return;
  const entities=[...document.querySelectorAll('.gameShell .player,.gameShell .npc')];
  entities.forEach(ensureEntityVisual);
  const idle=isWorldIdle();
  entities.forEach(el=>el.classList.toggle('lqIdleEntity',idle));
}

injectStyle();
if(typeof render==='function'){
  const beforeGroundingRender=render;
  render=function(){const result=beforeGroundingRender.apply(this,arguments);sync();return result;};
}
if(typeof world==='function'){
  const beforeGroundingWorld=world;
  world=function(){const result=beforeGroundingWorld.apply(this,arguments);sync();return result;};
}
if(typeof s!=='undefined'&&s?.screen==='world')sync();

function fail(reason){const el=document.createElement('i');el.className='lqReq117CheckpointASmokeFailure';el.hidden=true;el.dataset.reason=String(reason);document.body.appendChild(el);throw new TypeError(`REQ-117 checkpoint A smoke failed: ${reason}`);}
function assert(ok,reason){if(!ok)fail(reason);}
function smoke(){
  if(typeof s==='undefined'||typeof render!=='function')return;
  const snapshot={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,dialog:s.dialog?{...s.dialog}:s.dialog,flags:{...(s.flags||{})}};
  const flagsBefore=JSON.stringify(s.flags||{});
  try{
    s.screen='world';s.map='town';s.x=4;s.y=7;s.dir='up';s.dialog=null;render();sync();
    const player=document.querySelector('.gameShell .player.lqGroundedEntity');
    const npc=document.querySelector('.gameShell .npc.lqGroundedEntity');
    assert(player&&player.querySelector(`.${SHADOW_CLASS}`)&&player.querySelector(`.${BODY_CLASS}`),'player grounded structure');
    assert(npc&&npc.querySelector(`.${SHADOW_CLASS}`)&&npc.querySelector(`.${BODY_CLASS}`),'npc grounded structure');
    assert(getComputedStyle(player.querySelector(`.${SHADOW_CLASS}`)).pointerEvents==='none','shadow pointer transparent');
    assert(getComputedStyle(player.querySelector(`.${BODY_CLASS}`)).filter==='none','player body compositor filter disabled');
    assert(getComputedStyle(npc.querySelector(`.${BODY_CLASS}`)).filter==='none','npc body compositor filter disabled');
    assert(player.classList.contains('lqIdleEntity'),'player idle class');assert(npc.classList.contains('lqIdleEntity'),'npc idle class');
    assert(document.getElementById(STYLE_ID)?.textContent.includes('lqInteractionCueIn'),'interaction easing style');
    assert(JSON.stringify(s.flags||{})===flagsBefore,'story flags unchanged');
    assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'tap authority preserved');
    assert(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true,'fullscreen authority preserved');
    const marker=document.createElement('i');marker.className='lqReq117CheckpointASmokeMarker';marker.hidden=true;marker.dataset.playerShadow='true';marker.dataset.npcShadow='true';marker.dataset.idle='true';marker.dataset.interactionEasing='true';marker.dataset.presentationOnly='true';marker.dataset.compositorSafe='true';document.body.appendChild(marker);
  }finally{s.screen=snapshot.screen;s.map=snapshot.map;s.x=snapshot.x;s.y=snapshot.y;s.dir=snapshot.dir;s.dialog=snapshot.dialog;s.flags=snapshot.flags;render();}
}

window.LQ_REQ117_CHECKPOINT_A_STATUS={requirement:'REQ-117',checkpoint:'A',presentationOnly:true,footShadows:true,idleMotion:true,interactionEaseIn:true,compositorSafe:true,inputAuthority:false,saveSchemaChange:false,storyChange:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ119_CHECKPOINT_A_STATUS=window.LQ_REQ117_CHECKPOINT_A_STATUS;
window.LQ_REQ117_CHECKPOINT_A_TEST={sync,smoke,ensureEntityVisual};
window.LQ_REQ119_CHECKPOINT_A_TEST=window.LQ_REQ117_CHECKPOINT_A_TEST;
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
