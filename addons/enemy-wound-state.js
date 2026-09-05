(() => {
'use strict';

/* Collision-safe add-on: communicates enemy condition through presentation only. */
const style=document.createElement('style');
style.textContent=`
.enemy.lqEnemyWorn{filter:saturate(.9) brightness(.96) drop-shadow(0 5px 5px #0009)}
.enemy.lqEnemyCritical{filter:saturate(.72) brightness(.9) drop-shadow(0 5px 6px #000b);animation:lqEnemyCriticalBreath 1.25s ease-in-out infinite}
.lqEnemyCondition{display:inline-flex;align-items:center;gap:5px;margin:4px auto 2px;padding:3px 8px;border-radius:999px;border:1px solid #ffffff24;background:#0a111dcc;color:#dce8ee;font-size:9px;font-weight:900;letter-spacing:.08em}
.lqEnemyCondition.worn{border-color:#e5b56d55;color:#f1d5a2}.lqEnemyCondition.critical{border-color:#ec806a66;color:#ffc2b5;box-shadow:0 0 10px #c54b3730}
.lqEnemyCondition i{width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 6px currentColor}
@keyframes lqEnemyCriticalBreath{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(1px) scale(.985)}}
@media(prefers-reduced-motion:reduce){.enemy.lqEnemyCritical{animation:none}}
`;
document.head.appendChild(style);
function refreshCondition(){
 if(s.screen!=='battle'||!s.enemy)return;
 const enemy=app.querySelector('.enemy');if(!enemy)return;
 enemy.classList.remove('lqEnemyWorn','lqEnemyCritical');
 app.querySelectorAll('.lqEnemyCondition').forEach(n=>n.remove());
 const max=Math.max(1,Number(s.enemy.hp)||1),ratio=Math.max(0,Number(s.ehp)||0)/max;
 if(ratio>.6)return;
 const critical=ratio<=.28;
 enemy.classList.add(critical?'lqEnemyCritical':'lqEnemyWorn');
 const name=app.querySelector('.enemyName');if(!name)return;
 const tag=document.createElement('div');tag.className=`lqEnemyCondition ${critical?'critical':'worn'}`;tag.innerHTML=`<i></i>${critical?'WEAKENED':'WOUNDED'}`;name.insertAdjacentElement('afterend',tag);
}
const battleBase=battle;battle=function(){const r=battleBase();refreshCondition();return r;};
const renderBase=render;render=function(){const r=renderBase();refreshCondition();return r;};
refreshCondition();
window.LQ_ENEMY_WOUND_STATUS={thresholds:{wounded:.6,weakened:.28},presentationOnly:true,reducedMotion:true};
})();
