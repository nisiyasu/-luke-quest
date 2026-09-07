(() => {
'use strict';

/* REQ-117 Checkpoint A — presentation only.
   Adds separate foot-shadow nodes, composable visual idle motion, and easing for
   existing interaction affordance surfaces. Never mutates s/player coordinates,
   collision, save data, or canonical input handlers. */
const SHADOW_CLASS='lqEntityFootShadow';
const IDLE_CLASS='lqRichIdle';
const PROMPT_SELECTORS=[
  '.lqInteractionPrompt','.lqInteractPrompt','.lqActionPrompt','.interactionPrompt',
  '.lqWorldActionHint','.lqNearbyAction','.lqInteractHint','[data-lq-interaction-prompt]'
].join(',');
let refreshQueued=false;

const style=document.createElement('style');
style.textContent=`
.${SHADOW_CLASS}{position:absolute;width:24px;height:8px;margin-left:7px;margin-top:34px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(0,0,0,.42) 0 28%,rgba(0,0,0,.24) 50%,rgba(0,0,0,0) 76%);filter:blur(.35px);pointer-events:none!important;z-index:5;transform-origin:center;opacity:.78}
.player.${IDLE_CLASS},.npc.${IDLE_CLASS}{animation:lqRichIdleFloat 2.8s ease-in-out infinite alternate;animation-delay:var(--lq-idle-delay,0ms)}
@keyframes lqRichIdleFloat{0%,22%{translate:0 0}100%{translate:0 -1.25px}}
${PROMPT_SELECTORS}{animation:lqRichPromptIn .16s ease-out both;transform-origin:50% 100%}
@keyframes lqRichPromptIn{from{opacity:.35;scale:.94;translate:0 2px}to{opacity:1;scale:1;translate:0 0}}
@media(prefers-reduced-motion:reduce){.player.${IDLE_CLASS},.npc.${IDLE_CLASS}{animation:none!important;translate:0 0!important}${PROMPT_SELECTORS}{animation:none!important;translate:0 0!important;scale:1!important}}
`;
document.head.appendChild(style);

function worldNode(){return document.querySelector('.gameShell>.world,.gameShell .world');}
function visibleEntity(el){
 if(!el||!el.isConnected)return false;
 const cs=getComputedStyle(el);
 return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0;
}
function phaseFor(el,index){
 const key=(el.className||'')+':'+(el.style.left||'')+':'+(el.style.top||'')+':'+index;
 let h=0;for(let i=0;i<key.length;i++)h=(h*31+key.charCodeAt(i))>>>0;
 return -((h%1800)+120);
}
function sync(){
 refreshQueued=false;
 if(typeof s==='undefined'||!s||s.screen!=='world')return;
 const world=worldNode();if(!world)return;
 const entities=[...world.querySelectorAll('.player,.npc')].filter(visibleEntity);
 const wanted=new Set();
 entities.forEach((el,index)=>{
   el.classList.add(IDLE_CLASS);
   el.style.setProperty('--lq-idle-delay',`${phaseFor(el,index)}ms`);
   let id=el.dataset.lqRichShadowId;
   if(!id){id=`lqShadow-${Date.now().toString(36)}-${index}-${Math.random().toString(36).slice(2,7)}`;el.dataset.lqRichShadowId=id;}
   wanted.add(id);
   let shadow=world.querySelector(`.${SHADOW_CLASS}[data-owner="${CSS.escape(id)}"]`);
   if(!shadow){shadow=document.createElement('div');shadow.className=SHADOW_CLASS;shadow.dataset.owner=id;shadow.setAttribute('aria-hidden','true');world.insertBefore(shadow,el);}
   shadow.style.left=el.style.left||`${el.offsetLeft}px`;
   shadow.style.top=el.style.top||`${el.offsetTop}px`;
 });
 world.querySelectorAll(`.${SHADOW_CLASS}`).forEach(sh=>{if(!wanted.has(sh.dataset.owner))sh.remove();});
}
function schedule(){if(refreshQueued)return;refreshQueued=true;requestAnimationFrame(sync);}

const renderBase=typeof render==='function'?render:null;
if(renderBase){render=function(){const out=renderBase.apply(this,arguments);schedule();return out;};}
window.addEventListener('pageshow',schedule);
window.addEventListener('resize',schedule,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});
setTimeout(schedule,0);

window.LQ_WORLD_CHARACTER_RICHNESS_STATUS={
 version:'0.1-A',checkpoint:'A',presentationOnly:true,footShadows:true,separateShadowNodes:true,
 idleMotion:true,idleCoordinateMutation:false,phaseDesync:true,reducedMotionSafe:true,
 interactionPromptEasing:true,promptWordingChanged:false,inputAuthorityChanged:false,
 collisionChanged:false,saveSchemaChanged:false,storyChanged:false,pointerSafe:true,
 refresh:sync,shadowClass:SHADOW_CLASS,idleClass:IDLE_CLASS,iosPhysicalVerification:'PENDING'
};
})();
