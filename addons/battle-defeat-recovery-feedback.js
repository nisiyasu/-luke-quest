(() => {
'use strict';

/* REQ-038: presentation-only defeat/recovery cue.
   Canonical enemyTurn() remains the sole owner of defeat state and town recovery. */
const ID='lq-defeat-recovery-feedback';
const CLEANUP_MS=1400;
let presentations=0;

const style=document.createElement('style');
style.textContent=`
#${ID}{position:fixed;inset:0;z-index:95;display:grid;place-items:center;pointer-events:none;background:rgba(5,8,14,.78);opacity:0;animation:lqDefeatRecovery ${CLEANUP_MS}ms ease both}
#${ID} .lqDefeatRecoveryCard{text-align:center;padding:18px 22px;border-radius:16px;background:rgba(13,20,31,.9);border:1px solid rgba(255,255,255,.16);box-shadow:0 18px 50px rgba(0,0,0,.55);color:#fff7dd;font-weight:950;letter-spacing:.08em;text-shadow:0 2px 8px #000}
#${ID} .lqDefeatRecoveryTitle{font-size:24px;margin-bottom:7px}
#${ID} .lqDefeatRecoverySub{font-size:12px;color:#c8d4df;letter-spacing:.04em}
@keyframes lqDefeatRecovery{0%{opacity:0}12%{opacity:1}64%{opacity:1}100%{opacity:0}}
@media(prefers-reduced-motion:reduce){#${ID}{animation-duration:650ms}#${ID} .lqDefeatRecoveryCard{transform:none}}
`;
document.head.appendChild(style);

function cleanup(){document.getElementById(ID)?.remove();}
function show(label='戦闘不能',sub='王都へ搬送されました'){
 cleanup();
 const layer=document.createElement('div');
 layer.id=ID;
 layer.setAttribute('aria-hidden','true');
 layer.innerHTML=`<div class="lqDefeatRecoveryCard"><div class="lqDefeatRecoveryTitle">${label}</div><div class="lqDefeatRecoverySub">${sub}</div></div>`;
 document.body.appendChild(layer);
 presentations++;
 const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const ttl=reduced?700:CLEANUP_MS+80;
 layer.addEventListener('animationend',()=>{if(layer.isConnected)layer.remove();},{once:true});
 setTimeout(()=>{if(layer.isConnected)layer.remove();},ttl);
 return layer;
}

const enemyTurnDefeatBase=enemyTurn;
enemyTurn=function(...args){
 const beforeScreen=s.screen;
 const beforeEnemy=s.enemy?.n||null;
 const r=enemyTurnDefeatBase.apply(this,args);
 const recovered=beforeScreen==='battle'&&s.screen==='world'&&s.map==='town'&&s.hp===s.mh&&s.dialog?.name==='宿屋の主人';
 if(recovered){
   requestAnimationFrame(()=>show('戦闘不能',`${beforeEnemy||'魔物'}との戦いから王都へ搬送`));
 }
 return r;
};

window.LQ_DEFEAT_RECOVERY_FEEDBACK_STATUS={
 presentationOnly:true,
 canonicalRecoveryOwner:'index.html enemyTurn()',
 canonicalRecovery:{hp:'max',screen:'world',map:'town',x:9,y:12,encounterGrace:3},
 pointerSafe:true,
 reducedMotion:true,
 cleanupFallbackMs:CLEANUP_MS+80,
 get activeLayers(){return document.querySelectorAll(`#${ID}`).length;},
 get presentations(){return presentations;},
 smokePreview(){return show('戦闘不能','王都へ搬送されました');},
 smokeCleanup:cleanup
};
})();