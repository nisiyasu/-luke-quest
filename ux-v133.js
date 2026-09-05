(() => {
'use strict';

/* LUKE QUEST v0.133 three-pose interim Luke walk cycle.
   Adds neutral/left-step/right-step pose changes across all four existing directions.
   Explicitly INTERIM CSS animation, not formal approved sprite-sheet art. */
const style=document.createElement('style');style.textContent=`
.lukeFieldSprite{transform-origin:50% 100%}.lukeFieldSprite.lqStep1 .legs{transform:skewX(-11deg) translateX(-1px)}.lukeFieldSprite.lqStep2 .legs{transform:skewX(11deg) translateX(1px)}.lukeFieldSprite.lqStep1 .body{transform:translateY(-1px)}.lukeFieldSprite.lqStep2 .body{transform:translateY(-1px)}.lukeFieldSprite.lqStep1 .cape{transform:skewY(4deg)}.lukeFieldSprite.lqStep2 .cape{transform:skewY(-4deg)}.lukeFieldSprite.dir-left.lqStep1 .cape{transform:skewY(14deg) translateX(1px)}.lukeFieldSprite.dir-left.lqStep2 .cape{transform:skewY(6deg) translateX(-1px)}.lukeFieldSprite.dir-right.lqStep1 .cape{transform:skewY(-6deg) translateX(1px)}.lukeFieldSprite.dir-right.lqStep2 .cape{transform:skewY(-14deg) translateX(-1px)}.lukeFieldSprite.lqWalking{animation:lqLukeWalkBob .17s ease-out}@keyframes lqLukeWalkBob{50%{translate:0 -2px}}@media(prefers-reduced-motion:reduce){.lukeFieldSprite.lqWalking{animation:none}}
`;document.head.appendChild(style);
let prevMap=s.map,prevX=s.x,prevY=s.y,phase=0;
function applyWalkPose(moved){const sprite=app.querySelector('.lukeFieldSprite');if(!sprite)return;sprite.classList.remove('lqStep0','lqStep1','lqStep2','lqWalking');if(moved){phase=(phase+1)%3;sprite.classList.add(`lqStep${phase}`,'lqWalking');}else{phase=0;sprite.classList.add('lqStep0');}}
const renderV132=render;render=function(){const moved=s.screen==='world'&&s.map===prevMap&&(s.x!==prevX||s.y!==prevY);const r=renderV132();applyWalkPose(moved);prevMap=s.map;prevX=s.x;prevY=s.y;return r;};queueMicrotask(()=>applyWalkPose(false));
window.LQ_LUKE_WALK_CYCLE_STATUS={directions:4,posesPerDirection:3,art:'INTERIM_CSS',formalSpriteSheet:false};
})();