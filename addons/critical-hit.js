(() => {
'use strict';

/* Collision-safe add-on: classic critical-hit chance for normal ATTACK only. */
const CRIT_RATE=.1,CRIT_ATK_BONUS=5,FLASH_ID='lq-critical-flash';
let criticalActive=false,flashPresentations=0;
const style=document.createElement('style');style.textContent=`
#${FLASH_ID}{position:fixed;z-index:96;left:50%;top:34%;transform:translate(-50%,-50%);color:#fff0a0;font-family:Georgia,serif;font-weight:1000;font-size:22px;letter-spacing:.06em;text-shadow:0 3px #402713,0 0 16px #ffd86e;pointer-events:none;animation:lqCrit .72s ease-out both}@keyframes lqCrit{0%{opacity:0;transform:translate(-50%,-50%) scale(.55) rotate(-4deg)}20%{opacity:1;transform:translate(-50%,-50%) scale(1.15) rotate(2deg)}100%{opacity:0;transform:translate(-50%,-80%) scale(.95)}}@media(prefers-reduced-motion:reduce){#${FLASH_ID}{animation-duration:.28s}}
`;document.head.appendChild(style);
function cleanupFlash(){document.getElementById(FLASH_ID)?.remove();}
function flash(){
 cleanupFlash();
 const e=document.createElement('div');e.id=FLASH_ID;e.className='lqCriticalFlash';e.textContent='CRITICAL!';e.setAttribute('aria-hidden','true');document.body.appendChild(e);flashPresentations++;
 const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const ttl=reduced?340:760;e.addEventListener('animationend',()=>{if(e.isConnected)e.remove();},{once:true});setTimeout(()=>{if(e.isConnected)e.remove();},ttl);return e;
}
function canonicalAtkFromBoosted(atk){return Number(atk)-CRIT_ATK_BONUS;}
const saveCritBase=save;save=function(...args){
 if(!criticalActive)return saveCritBase.apply(this,args);
 const boostedAtk=s.atk;s.atk=canonicalAtkFromBoosted(boostedAtk);
 try{return saveCritBase.apply(this,args);}finally{s.atk=boostedAtk;}
};
const attackCritBase=attack;attack=function(){
 if(s.screen!=='battle'||Math.random()>=CRIT_RATE)return attackCritBase();
 criticalActive=true;s.atk+=CRIT_ATK_BONUS;s.log.push('ルークの会心の踏み込み！');
 try{const r=attackCritBase();requestAnimationFrame(flash);return r;}finally{s.atk=canonicalAtkFromBoosted(s.atk);criticalActive=false;}
};
window.LQ_CRITICAL_STATUS={
 normalAttackRate:CRIT_RATE,temporaryAtkBonus:CRIT_ATK_BONUS,saveSafe:true,preservesCanonicalAtkDelta:true,canonicalAtkFromBoosted,
 presentation:{finalBlowSafe:true,battleDomIndependent:true,pointerSafe:true,nonStacking:true,reducedMotion:true,cleanupFallbackMs:760},
 get activeFlashLayers(){return document.querySelectorAll(`#${FLASH_ID}`).length;},
 get flashPresentations(){return flashPresentations;},
 smokePreview:flash,smokeCleanup:cleanupFlash
};
})();
