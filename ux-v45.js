(() => {
'use strict';

/* LUKE QUEST v0.45 field movement feel.
   Adds a real two-step cadence and grounded shadow to the existing interim Luke CSS sprite.
   This remains interim presentation and is NOT formal four-direction artwork. */

window.LQ_LUKE_STEP_PHASE=0;

const style=document.createElement('style');
style.textContent=`
.lukeFieldSprite:after{content:"";position:absolute;left:5px;bottom:-1px;width:24px;height:6px;border-radius:50%;background:#08101866;filter:blur(1px);z-index:0}
.lukeFieldSprite .body,.lukeFieldSprite .head,.lukeFieldSprite .hair,.lukeFieldSprite .cape{transition:transform .07s linear}
.lukeFieldSprite.step-a .body,.lukeFieldSprite.step-a .head,.lukeFieldSprite.step-a .hair{transform:translateY(-2px)}
.lukeFieldSprite.step-b .body,.lukeFieldSprite.step-b .head,.lukeFieldSprite.step-b .hair{transform:translateY(-1px)}
.lukeFieldSprite.step-a .legs{transform:skewX(-17deg) translateX(-1px)}
.lukeFieldSprite.step-b .legs{transform:skewX(17deg) translateX(1px)}
.lukeFieldSprite.step-a.dir-left .cape{transform:skewY(10deg) translateX(2px)}
.lukeFieldSprite.step-b.dir-left .cape{transform:skewY(10deg) translateX(-1px)}
.lukeFieldSprite.step-a.dir-right .cape{transform:skewY(-10deg) translateX(-2px)}
.lukeFieldSprite.step-b.dir-right .cape{transform:skewY(-10deg) translateX(1px)}
.lukeFieldSprite.step-a.dir-up .cape,.lukeFieldSprite.step-a.dir-down .cape{transform:translateY(1px) scaleX(.96)}
.lukeFieldSprite.step-b.dir-up .cape,.lukeFieldSprite.step-b.dir-down .cape{transform:translateY(-1px) scaleX(1.02)}
`;
document.head.appendChild(style);

function applyLukeStep(){
 const sprite=app.querySelector('.lukeFieldSprite');if(!sprite)return;
 sprite.classList.remove('step-a','step-b');
 if(window.LQ_LUKE_STEP_PHASE===1)sprite.classList.add('step-a');
 if(window.LQ_LUKE_STEP_PHASE===2)sprite.classList.add('step-b');
}

const moveV44=move;
move=function(d){
 window.LQ_LUKE_STEP_PHASE=window.LQ_LUKE_STEP_PHASE===1?2:1;
 const result=moveV44(d);
 requestAnimationFrame(applyLukeStep);
 return result;
};

const stopMovingV44=stopMoving;
stopMoving=function(){
 const result=stopMovingV44();
 window.LQ_LUKE_STEP_PHASE=0;
 requestAnimationFrame(applyLukeStep);
 return result;
};

window.LQ_FIELD_MOVEMENT_STATUS={interimLukeStepCadence:true,formalDirectionalArt:false};
if(s.screen==='world')requestAnimationFrame(applyLukeStep);
})();
