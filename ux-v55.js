(() => {
'use strict';

/* LUKE QUEST v0.55 battle enemy motion.
   Adds lightweight entrance, idle breathing and grounded presence to existing original enemy art. */

const style=document.createElement('style');
style.textContent=`
.enemySpriteStage{animation:lqEnemyArrive .36s cubic-bezier(.2,.9,.25,1) both}@keyframes lqEnemyArrive{from{opacity:0;transform:translateY(-14px) scale(.88);filter:brightness(1.6) blur(2px)}to{opacity:1;transform:none;filter:none}}
.enemySpriteStage .enemy{transform-origin:50% 82%;animation:lqEnemyBreathe 1.85s ease-in-out .4s infinite alternate}@keyframes lqEnemyBreathe{from{transform:translateY(0) scale(1)}to{transform:translateY(-3px) scale(1.018,.992)}}
.enemySpriteStage:before{content:"";position:absolute;left:23%;right:23%;bottom:6px;height:11px;border-radius:50%;background:#0008;filter:blur(3px);transform:scaleX(.92);animation:lqEnemyShadow 1.85s ease-in-out .4s infinite alternate}@keyframes lqEnemyShadow{to{transform:scaleX(.78);opacity:.62}}
.enemySpriteStage.lqEnemyPulse .enemy{animation:none}.enemySpriteStage.lqEnemyPulse:before{animation:none}
@media(prefers-reduced-motion:reduce){.enemySpriteStage,.enemySpriteStage .enemy,.enemySpriteStage:before{animation:none!important}}
`;
document.head.appendChild(style);
window.LQ_ENEMY_MOTION_STATUS={entrance:true,idleBreathing:true,reducedMotionSafe:true};
})();
