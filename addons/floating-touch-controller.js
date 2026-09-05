(() => {
'use strict';

/* LUKE QUEST floating touch controller.
   Touch/pen anywhere in the walkable game viewport to summon a translucent
   four-way pad at the contact point. Slide into a direction and hold to walk.
   Release/cancel/blur/hidden always stops movement. Mouse is intentionally
   excluded so desktop click interaction is unchanged. */

const STYLE_ID='lq-floating-touch-controller-style';
const PAD_ID='lq-floating-touch-controller';
const DEAD_ZONE=18;
const SWITCH_ZONE=25;
let pointerId=null;
let originX=0,originY=0;
let activeDir=null;
let pad=null;

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
#${PAD_ID}{position:fixed;width:150px;height:150px;z-index:120;pointer-events:none;transform:translate(-50%,-50%);opacity:0;transition:opacity .08s ease;filter:drop-shadow(0 5px 12px #0007)}
#${PAD_ID}.visible{opacity:1}
#${PAD_ID} .lqFloatRing{position:absolute;inset:19px;border:1px solid #ffffff42;border-radius:50%;background:#07111f35;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}
#${PAD_ID} .lqFloatArrow{position:absolute;width:48px;height:48px;border-radius:15px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:27px;font-weight:950;background:#183a5f70;border:1px solid #ffffff4a;text-shadow:0 2px 5px #000;box-shadow:inset 0 1px #ffffff24}
#${PAD_ID} .lqFloatArrow.up{left:51px;top:0}#${PAD_ID} .lqFloatArrow.down{left:51px;bottom:0}#${PAD_ID} .lqFloatArrow.left{left:0;top:51px}#${PAD_ID} .lqFloatArrow.right{right:0;top:51px}
#${PAD_ID} .lqFloatArrow.active{background:#4b83c9c9;border-color:#d8edff;transform:scale(1.08);box-shadow:0 0 18px #72adff88,inset 0 1px #fff6}
#${PAD_ID} .lqFloatCore{position:absolute;left:61px;top:61px;width:28px;height:28px;border-radius:50%;background:#ffffff2b;border:1px solid #ffffff42}
.gameShell.lqTouchSurface{touch-action:none!important;-webkit-user-select:none;user-select:none}
@media(pointer:coarse){.controls .dpad{opacity:.42}.controls .dpad:before{content:'画面タッチでも移動';position:absolute;font-size:9px;color:#cfe3ff;transform:translateY(-12px);white-space:nowrap}}
@media(prefers-reduced-motion:reduce){#${PAD_ID}{transition:none}}
`;
  document.head.appendChild(style);
}

function ensurePad(){
  if(pad&&pad.isConnected)return pad;
  pad=document.createElement('div');
  pad.id=PAD_ID;
  pad.setAttribute('aria-hidden','true');
  pad.innerHTML='<div class="lqFloatRing"></div><div class="lqFloatArrow up" data-dir="up">↑</div><div class="lqFloatArrow left" data-dir="left">←</div><div class="lqFloatCore"></div><div class="lqFloatArrow right" data-dir="right">→</div><div class="lqFloatArrow down" data-dir="down">↓</div>';
  document.body.appendChild(pad);
  return pad;
}

function allowedTarget(target){
  if(typeof s==='undefined'||s.screen!=='world'||s.dialog)return false;
  if(!target||!target.closest)return false;
  const shell=target.closest('.gameShell');
  if(!shell)return false;
  if(target.closest('button,a,input,select,textarea,.dialogBox'))return false;
  return true;
}

function setVisual(dir){
  if(!pad)return;
  pad.querySelectorAll('.lqFloatArrow').forEach(el=>el.classList.toggle('active',el.dataset.dir===dir));
}

function clearFallback(){
  if(window.__lqFloatFallbackTimer){clearInterval(window.__lqFloatFallbackTimer);window.__lqFloatFallbackTimer=null;}
}

function stop(){
  clearFallback();
  if(typeof stopMoving==='function')stopMoving();
  activeDir=null;
  pointerId=null;
  setVisual(null);
  if(pad)pad.classList.remove('visible');
}

function beginDirection(dir){
  if(!dir||dir===activeDir)return;
  clearFallback();
  if(typeof stopMoving==='function')stopMoving();
  activeDir=dir;
  setVisual(dir);
  if(typeof startMoving==='function')startMoving(dir);
  else if(typeof move==='function'){
    move(dir);
    window.__lqFloatFallbackTimer=setInterval(()=>move(dir),115);
  }
}

function directionFromDelta(dx,dy){
  const distance=Math.hypot(dx,dy);
  if(distance<DEAD_ZONE)return null;
  if(Math.abs(dx)>Math.abs(dy))return dx<0?'left':'right';
  return dy<0?'up':'down';
}

function onPointerDown(event){
  if(event.pointerType==='mouse'||pointerId!==null||!allowedTarget(event.target))return;
  pointerId=event.pointerId;
  originX=event.clientX;originY=event.clientY;
  const p=ensurePad();
  const half=75,margin=8;
  const x=Math.max(half+margin,Math.min(innerWidth-half-margin,originX));
  const y=Math.max(half+margin,Math.min(innerHeight-half-margin,originY));
  p.style.left=x+'px';p.style.top=y+'px';p.classList.add('visible');
  setVisual(null);
  event.preventDefault();
}

function onPointerMove(event){
  if(event.pointerId!==pointerId)return;
  event.preventDefault();
  const dx=event.clientX-originX,dy=event.clientY-originY;
  const dir=directionFromDelta(dx,dy);
  if(!dir){
    if(activeDir&&Math.hypot(dx,dy)<SWITCH_ZONE){clearFallback();if(typeof stopMoving==='function')stopMoving();activeDir=null;setVisual(null);}
    return;
  }
  beginDirection(dir);
}

function onPointerEnd(event){
  if(pointerId!==null&&event.pointerId!==undefined&&event.pointerId!==pointerId)return;
  stop();
}

function armShell(){
  const shell=document.querySelector('.gameShell');
  if(shell)shell.classList.add('lqTouchSurface');
}

injectStyle();ensurePad();
window.addEventListener('pointerdown',onPointerDown,{capture:true,passive:false});
window.addEventListener('pointermove',onPointerMove,{capture:true,passive:false});
window.addEventListener('pointerup',onPointerEnd,{capture:true,passive:true});
window.addEventListener('pointercancel',onPointerEnd,{capture:true,passive:true});
window.addEventListener('blur',onPointerEnd);
document.addEventListener('visibilitychange',()=>{if(document.hidden)onPointerEnd({});});

if(typeof render==='function'){
  const renderBeforeFloatingTouch=render;
  render=function(){
    stop();
    const result=renderBeforeFloatingTouch();
    armShell();
    return result;
  };
}
armShell();
window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS={version:'1.1',anywhereOnGameShell:true,slideAndHold:true,mouseExcluded:true,releaseSafety:true,directionSwitchTimerCleanup:true};
})();
