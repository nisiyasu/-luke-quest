(() => {
'use strict';

/* Collision-safe add-on: classic critical-hit chance for normal ATTACK only. */
const CRIT_RATE=.1,CRIT_ATK_BONUS=5;
const style=document.createElement('style');style.textContent=`
.lqCriticalFlash{position:absolute;z-index:45;left:50%;top:34%;transform:translate(-50%,-50%);color:#fff0a0;font-family:Georgia,serif;font-weight:1000;font-size:22px;letter-spacing:.06em;text-shadow:0 3px #402713,0 0 16px #ffd86e;pointer-events:none;animation:lqCrit .72s ease-out both}@keyframes lqCrit{0%{opacity:0;transform:translate(-50%,-50%) scale(.55) rotate(-4deg)}20%{opacity:1;transform:translate(-50%,-50%) scale(1.15) rotate(2deg)}100%{opacity:0;transform:translate(-50%,-80%) scale(.95)}}
`;document.head.appendChild(style);
function flash(){if(s.screen!=='battle')return;const scene=app.querySelector('.battleScene');if(!scene)return;const e=document.createElement('div');e.className='lqCriticalFlash';e.textContent='CRITICAL!';scene.appendChild(e);setTimeout(()=>e.remove(),760);}
const attackCritBase=attack;attack=function(){
 if(s.screen!=='battle'||Math.random()>=CRIT_RATE)return attackCritBase();
 const original=s.atk;s.atk=original+CRIT_ATK_BONUS;s.log.push('ルークの会心の踏み込み！');
 try{const r=attackCritBase();requestAnimationFrame(flash);return r;}finally{s.atk=original;}
};
window.LQ_CRITICAL_STATUS={normalAttackRate:CRIT_RATE,temporaryAtkBonus:CRIT_ATK_BONUS};
})();
