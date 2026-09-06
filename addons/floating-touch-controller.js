(() => {
'use strict';

/* LUKE QUEST unified floating touch controller + tap-anywhere action.
   Touch/pen anywhere in the world game viewport. A short stationary tap invokes
   the final canonical action() exactly once. Outside dialogue, sliding beyond
   the dead zone summons/uses the translucent four-way controller and enters
   movement mode. Dialogue taps remain valid Action taps, but movement can never
   start while dialogue is already active. Release/cancel/blur/hidden always
   stops movement. Mouse is intentionally excluded so desktop clicks are unchanged. */

const STYLE_ID='lq-floating-touch-controller-style';
const PAD_ID='lq-floating-touch-controller';
const DEAD_ZONE=18;
const SWITCH_ZONE=25;
const TAP_MAX_MS=420;
const INTERACTIVE_SELECTOR='button,a,input,select,textarea,[role="button"],[contenteditable="true"],[data-lq-no-global-action],.lqExplicitControl';
let pointerId=null;
let originX=0,originY=0;
let activeDir=null;
let pad=null;
let gestureMoved=false;
let pointerStartedAt=0;
let pointerStartMap=null;
let pointerStartScreen=null;
let pointerStartTarget=null;
let movementAllowedAtStart=false;
let lastRenderedMap=(typeof s!=='undefined'&&s)?s.map:null;

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
#${PAD_ID}{position:fixed;width:168px;height:168px;z-index:120;pointer-events:none;transform:translate(-50%,-50%);opacity:0;transition:opacity .08s ease;filter:drop-shadow(0 5px 12px #0006)}
#${PAD_ID}.visible{opacity:.52}
#${PAD_ID} .lqFloatRing{position:absolute;inset:18px;border:2px solid #d8edff70;border-radius:50%;background:radial-gradient(circle,#10243a3d 0 35%,#07111f55 70%);box-shadow:0 0 0 1px #4f8edb3d,0 0 18px #4f9dff35,inset 0 0 14px #d8edff12;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}
#${PAD_ID} .lqFloatArrow{position:absolute;width:54px;height:54px;border-radius:16px;display:flex;align-items:center;justify-content:center;color:#f7fbff;font-size:30px;font-weight:950;background:#173b6375;border:2px solid #d8edff78;text-shadow:0 2px 5px #000;box-shadow:0 2px 8px #0005,inset 0 1px #ffffff2e}
#${PAD_ID} .lqFloatArrow.up{left:57px;top:0}#${PAD_ID} .lqFloatArrow.down{left:57px;bottom:0}#${PAD_ID} .lqFloatArrow.left{left:0;top:57px}#${PAD_ID} .lqFloatArrow.right{right:0;top:57px}
#${PAD_ID} .lqFloatArrow.active{background:#5b9deed1;border-color:#fff;transform:scale(1.12);box-shadow:0 0 22px #72adffaa,0 4px 12px #0007,inset 0 1px #fff8}
#${PAD_ID} .lqFloatCore{position:absolute;left:65px;top:65px;width:38px;height:38px;border-radius:50%;background:#d8edff45;border:2px solid #ffffff78;box-shadow:0 0 12px #72adff66,inset 0 0 8px #fff4}
#${PAD_ID} .lqFloatCore:after{content:'';position:absolute;inset:10px;border-radius:50%;background:#ffffff78;box-shadow:0 0 6px #fff8}
.gameShell.lqTouchSurface{touch-action:none!important;-webkit-user-select:none;user-select:none}
@media(pointer:coarse){.controls .dpad{opacity:.18}.controls .dpad:active{opacity:.48}.controls .dpad:before{content:'どこでもドラッグで移動';position:absolute;font-size:9px;color:#d9edffb0;transform:translateY(-12px);white-space:nowrap;text-shadow:0 1px 3px #000}}
@media(prefers-reduced-motion:reduce){#${PAD_ID}{transition:none}}
`;
  document.head.appendChild(style);
}

function ensurePad(){
  if(pad&&pad.isConnected)return pad;
  pad=document.createElement('div');
  pad.id=PAD_ID;
  pad.dataset.lqControllerVersion='1.6';
  pad.setAttribute('aria-hidden','true');
  pad.innerHTML='<div class="lqFloatRing"></div><div class="lqFloatArrow up" data-dir="up">↑</div><div class="lqFloatArrow left" data-dir="left">←</div><div class="lqFloatCore"></div><div class="lqFloatArrow right" data-dir="right">→</div><div class="lqFloatArrow down" data-dir="down">↓</div>';
  document.body.appendChild(pad);
  return pad;
}

function isExplicitControl(target){
  return !!(target&&target.closest&&target.closest(INTERACTIVE_SELECTOR));
}

function allowedTarget(target){
  if(typeof s==='undefined'||s.screen!=='world')return false;
  if(!target||!target.closest)return false;
  const shell=target.closest('.gameShell');
  if(!shell)return false;
  if(isExplicitControl(target))return false;
  return true;
}

function setVisual(dir){
  if(!pad)return;
  pad.querySelectorAll('.lqFloatArrow').forEach(el=>el.classList.toggle('active',el.dataset.dir===dir));
}

function clearFallback(){
  if(window.__lqFloatFallbackTimer){clearInterval(window.__lqFloatFallbackTimer);window.__lqFloatFallbackTimer=null;}
}

function resetGesture(){
  activeDir=null;
  pointerId=null;
  gestureMoved=false;
  pointerStartedAt=0;
  pointerStartMap=null;
  pointerStartScreen=null;
  pointerStartTarget=null;
  movementAllowedAtStart=false;
  setVisual(null);
  if(pad)pad.classList.remove('visible');
}

function stop(){
  clearFallback();
  if(typeof stopMoving==='function')stopMoving();
  resetGesture();
}

function beginDirection(dir){
  if(!movementAllowedAtStart||!dir||dir===activeDir)return;
  clearFallback();
  if(typeof stopMoving==='function')stopMoving();
  activeDir=dir;
  gestureMoved=true;
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

function positionPad(){
  const p=ensurePad();
  const half=84,margin=8;
  const x=Math.max(half+margin,Math.min(innerWidth-half-margin,originX));
  const y=Math.max(half+margin,Math.min(innerHeight-half-margin,originY));
  p.style.left=x+'px';p.style.top=y+'px';
  return p;
}

function onPointerDown(event){
  if(event.pointerType==='mouse'||pointerId!==null||!allowedTarget(event.target))return;
  pointerId=event.pointerId;
  originX=event.clientX;originY=event.clientY;
  pointerStartedAt=performance.now();
  pointerStartMap=s.map;
  pointerStartScreen=s.screen;
  pointerStartTarget=event.target;
  movementAllowedAtStart=!s.dialog;
  gestureMoved=false;
  const p=positionPad();
  p.classList.toggle('visible',movementAllowedAtStart);
  setVisual(null);
  event.preventDefault();
}

function onPointerMove(event){
  if(event.pointerId!==pointerId)return;
  event.preventDefault();
  if(typeof s==='undefined'||!s||s.screen!=='world'||s.dialog||s.map!==pointerStartMap){stop();return;}
  const dx=event.clientX-originX,dy=event.clientY-originY;
  const distance=Math.hypot(dx,dy);
  if(distance>=DEAD_ZONE)gestureMoved=true;
  if(!movementAllowedAtStart)return;
  const dir=directionFromDelta(dx,dy);
  if(!dir){
    if(activeDir&&distance<SWITCH_ZONE){clearFallback();if(typeof stopMoving==='function')stopMoving();activeDir=null;setVisual(null);}
    return;
  }
  beginDirection(dir);
}

function shouldFireTap(event){
  if(pointerId===null||event.pointerId!==pointerId)return false;
  if(gestureMoved||activeDir)return false;
  if(performance.now()-pointerStartedAt>TAP_MAX_MS)return false;
  if(typeof s==='undefined'||s.screen!=='world'||pointerStartScreen!=='world')return false;
  if(s.map!==pointerStartMap)return false;
  if(isExplicitControl(pointerStartTarget))return false;
  return true;
}

function finishPointer(event,allowTap){
  if(pointerId!==null&&event.pointerId!==undefined&&event.pointerId!==pointerId)return;
  const fireTap=!!allowTap&&shouldFireTap(event);
  clearFallback();
  if(typeof stopMoving==='function')stopMoving();
  resetGesture();
  if(fireTap&&typeof action==='function')action();
}

function onPointerUp(event){finishPointer(event,true);}
function onPointerCancel(event){finishPointer(event,false);}

function armShell(){
  const shell=document.querySelector('.gameShell');
  if(shell)shell.classList.add('lqTouchSurface');
}

function mustStopForRender(){
  if(typeof s==='undefined'||!s)return false;
  if(s.screen!=='world')return true;
  if(s.dialog&&pointerId!==null)return true;
  return pointerId!==null&&lastRenderedMap!==null&&s.map!==lastRenderedMap;
}

injectStyle();ensurePad();
window.addEventListener('pointerdown',onPointerDown,{capture:true,passive:false});
window.addEventListener('pointermove',onPointerMove,{capture:true,passive:false});
window.addEventListener('pointerup',onPointerUp,{capture:true,passive:true});
window.addEventListener('pointercancel',onPointerCancel,{capture:true,passive:true});
window.addEventListener('blur',()=>onPointerCancel({}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)onPointerCancel({});});

if(typeof render==='function'){
  const renderBeforeFloatingTouch=render;
  render=function(){
    if(mustStopForRender())stop();
    const result=renderBeforeFloatingTouch();
    if(typeof s!=='undefined'&&s)lastRenderedMap=s.map;
    armShell();
    return result;
  };
}
armShell();
window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS={version:'1.6',anywhereOnGameShell:true,slideAndHold:true,tapAnywhereAction:true,tapMaxMs:TAP_MAX_MS,deadZone:DEAD_ZONE,visualDiameter:168,visualOpacityReduced:true,neutralOpacity:.52,fallbackDpadOpacity:.18,mouseExcluded:true,releaseSafety:true,cancelNeverActions:true,directionSwitchTimerCleanup:true,ordinaryRenderKeepsHold:true,transitionRenderStops:true,dialogueStartStopsPendingGesture:true,explicitControlExclusion:true,dialogueTapAllowed:true,dialogueMovementBlocked:true,dialoguePadHidden:true,iosPhysicalVerification:'PENDING'};
})();