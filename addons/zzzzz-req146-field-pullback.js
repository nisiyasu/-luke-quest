(() => {
'use strict';

/* REQ-146 — Owner-directed one-step field pullback.
   Presentation only. Logical map/tile/input coordinates remain unchanged.
   This late presentation layer deliberately replaces the older .88 portrait
   framing result while preserving the same canonical world DOM and controls. */
const PORTRAIT_SCALE=.78;
let raf=0;

function isPortrait(shell){
  const w=shell.clientWidth||innerWidth;
  const h=shell.clientHeight||innerHeight;
  return w<=430&&h>=w;
}

function apply(){
  if(typeof s==='undefined'||!s||s.screen!=='world'||typeof MAPS==='undefined'||typeof TS==='undefined')return;
  const shell=document.querySelector('.gameShell');
  const world=shell&&shell.querySelector('.world');
  const m=MAPS[s.map];
  if(!shell||!world||!m||!isPortrait(shell))return;
  const vw=shell.clientWidth||innerWidth;
  const vh=shell.clientHeight||innerHeight;
  const scale=PORTRAIT_SCALE;
  const mapW=m.w*TS*scale;
  const mapH=m.h*TS*scale;
  const px=(s.x*TS+5)*scale;
  const py=(s.y*TS+3)*scale;
  const minY=Math.min(132,Math.max(112,Math.round(vh*.16)));
  let x=vw/2-px-19*scale;
  let y=vh/2-py-21*scale;
  x=mapW<=vw?Math.round((vw-mapW)/2):Math.min(0,Math.max(vw-mapW,x));
  if(mapH<=vh){
    y=Math.round((vh-mapH)/2);
    const sy=py+y;
    if(sy<minY)y=Math.min(vh-mapH,y+(minY-sy));
  }else{
    y=Math.min(0,Math.max(vh-mapH,y));
    const sy=py+y;
    if(sy<minY)y=Math.min(minY,y+(minY-sy));
  }
  world.style.transformOrigin='0 0';
  world.dataset.lqCameraScale=String(scale);
  world.dataset.lqReq146='true';
  world.style.transform=`translate(${Math.round(x)}px,${Math.round(y)}px) scale(${scale})`;
}

function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(apply);
}

if(typeof render==='function'){
  const previous=render;
  render=function(){
    const result=previous();
    apply();
    return result;
  };
}
window.addEventListener('resize',schedule,{passive:true});
window.addEventListener('orientationchange',schedule,{passive:true});
if(window.visualViewport)window.visualViewport.addEventListener('resize',schedule,{passive:true});
apply();

window.LQ_REQ146_STATUS={version:'1.0.0',portraitScale:PORTRAIT_SCALE,referenceDrivenPullback:true,gameplayCoordinatesUnchanged:true,iosPhysicalVerification:'PENDING'};
})();