(() => {
'use strict';

/* LUKE QUEST v0.120 animated water surface tiles.
   Adds lightweight moving highlights to existing water terrain without changing collision. */

const style=document.createElement('style');
style.textContent=`
.tile.water{overflow:hidden;background:linear-gradient(180deg,#3e79a5,#356b98)!important;box-shadow:inset 0 4px #83c5dc25,inset 0 -5px #153c6650}
.tile.water:before,.tile.water:after{content:"";position:absolute;left:-35%;width:170%;height:7px;border-radius:50%;background:repeating-linear-gradient(90deg,transparent 0 9px,#a8e5f345 9px 18px,transparent 18px 28px);filter:blur(.2px);animation:lqWaterDrift 3.8s linear infinite}.tile.water:before{top:13px}.tile.water:after{top:29px;opacity:.48;animation-direction:reverse;animation-duration:4.7s}
@keyframes lqWaterDrift{from{transform:translateX(-12px)}to{transform:translateX(34px)}}
@media(prefers-reduced-motion:reduce){.tile.water:before,.tile.water:after{animation:none}}
`;
document.head.appendChild(style);
window.LQ_WATER_VISUAL_STATUS={animatedHighlights:true,collisionUntouched:true,reducedMotionAware:true};
})();