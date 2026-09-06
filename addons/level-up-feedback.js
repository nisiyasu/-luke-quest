(() => {
'use strict';

/* REQ-039: presentation-only level-up feedback.
   Canonical win() remains the sole owner of EXP, level and stat mutation. */
const ID='lq-level-up-feedback';
const CLEANUP_MS=1650;
let presentations=0;

const style=document.createElement('style');
style.textContent=`
#${ID}{position:fixed;inset:0;z-index:94;display:grid;place-items:center;pointer-events:none;background:rgba(4,10,18,.36);opacity:0;animation:lqLevelUpCue ${CLEANUP_MS}ms ease both}
#${ID} .lqLevelUpCard{min-width:min(78vw,300px);text-align:center;padding:18px 20px;border-radius:18px;background:linear-gradient(160deg,rgba(24,42,62,.97),rgba(9,18,30,.96));border:1px solid rgba(126,203,255,.55);box-shadow:0 18px 55px rgba(0,0,0,.52),0 0 28px rgba(75,179,255,.18);color:#f4fbff;font-weight:900;text-shadow:0 2px 7px #000}
#${ID} .lqLevelUpTitle{font-size:13px;letter-spacing:.24em;color:#8ed7ff;margin-bottom:5px}
#${ID} .lqLevelUpLv{font-size:31px;line-height:1.1;margin-bottom:10px}
#${ID} .lqLevelUpStats{display:flex;justify-content:center;gap:15px;font-size:13px;color:#d7eaff}
#${ID} .lqLevelUpGain{color:#9ff2b2;font-weight:950}
@keyframes lqLevelUpCue{0%{opacity:0}12%{opacity:1}70%{opacity:1}100%{opacity:0}}
@media(prefers-reduced-motion:reduce){#${ID}{animation-duration:720ms}}
`;
document.head.appendChild(style);

function cleanup(){document.getElementById(ID)?.remove();}
function show(before,after){
 cleanup();
 const hpDelta=(after.mh||0)-(before.mh||0);
 const atkDelta=(after.atk||0)-(before.atk||0);
 const layer=document.createElement('div');
 layer.id=ID;
 layer.setAttribute('aria-hidden','true');
 layer.innerHTML=`<div class="lqLevelUpCard"><div class="lqLevelUpTitle">LEVEL UP</div><div class="lqLevelUpLv">LV ${after.lv}</div><div class="lqLevelUpStats"><span>最大HP <b class="lqLevelUpGain">+${Math.max(0,hpDelta)}</b></span><span>ATK <b class="lqLevelUpGain">+${Math.max(0,atkDelta)}</b></span></div></div>`;
 document.body.appendChild(layer);
 presentations++;
 const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const ttl=reduced?780:CLEANUP_MS+90;
 layer.addEventListener('animationend',()=>{if(layer.isConnected)layer.remove();},{once:true});
 setTimeout(()=>{if(layer.isConnected)layer.remove();},ttl);
 return layer;
}

const winLevelFeedbackBase=win;
win=function(...args){
 const before={lv:Number(s.lv)||0,mh:Number(s.mh)||0,atk:Number(s.atk)||0};
 const r=winLevelFeedbackBase.apply(this,args);
 const after={lv:Number(s.lv)||0,mh:Number(s.mh)||0,atk:Number(s.atk)||0};
 if(after.lv>before.lv){requestAnimationFrame(()=>show(before,after));}
 return r;
};

window.LQ_LEVEL_UP_FEEDBACK_STATUS={
 presentationOnly:true,
 canonicalProgressionOwner:'index.html win()',
 actualDeltaRendering:true,
 pointerSafe:true,
 reducedMotion:true,
 cleanupFallbackMs:CLEANUP_MS+90,
 get activeLayers(){return document.querySelectorAll(`#${ID}`).length;},
 get presentations(){return presentations;},
 smokePreview(){return show({lv:1,mh:42,atk:7},{lv:2,mh:51,atk:10});},
 smokeCleanup:cleanup
};
})();