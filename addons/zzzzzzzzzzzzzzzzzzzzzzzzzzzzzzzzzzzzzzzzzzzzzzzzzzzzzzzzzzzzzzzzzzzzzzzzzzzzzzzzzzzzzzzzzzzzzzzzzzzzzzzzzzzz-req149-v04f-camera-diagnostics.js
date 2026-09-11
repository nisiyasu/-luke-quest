(() => {
'use strict';
/* REQ-149 V04-F diagnostics only.
 * Records settled field camera/shell geometry into body data attributes so CI artifacts can
 * distinguish actual viewport coverage from screenshot assumptions. No camera/input/map mutation.
 */
let timer=0;
function record(){
  if(typeof s==='undefined'||s?.screen!=='world'||s?.map!=='field')return;
  const shell=document.querySelector('.gameShell');
  const world=shell&&shell.querySelector('.world');
  if(!shell||!world)return;
  const sr=shell.getBoundingClientRect(),wr=world.getBoundingClientRect();
  const vv=window.visualViewport;
  const d=document.body.dataset;
  d.req149CameraDiag='v04f';
  d.req149InnerWidth=String(Math.round(window.innerWidth||0));
  d.req149InnerHeight=String(Math.round(window.innerHeight||0));
  d.req149ClientWidth=String(Math.round(document.documentElement.clientWidth||0));
  d.req149ClientHeight=String(Math.round(document.documentElement.clientHeight||0));
  d.req149VisualWidth=String(Math.round(vv?.width||0));
  d.req149VisualHeight=String(Math.round(vv?.height||0));
  d.req149ShellWidth=String(Math.round(sr.width||0));
  d.req149ShellHeight=String(Math.round(sr.height||0));
  d.req149WorldWidth=String(Math.round(wr.width||0));
  d.req149WorldHeight=String(Math.round(wr.height||0));
  d.req149WorldTop=String(Math.round(wr.top||0));
  d.req149WorldBottom=String(Math.round(wr.bottom||0));
  d.req149WorldTransform=String(world.style.transform||'');
  d.req149CameraScale=String(world.dataset.lqCameraScale||'unset');
  d.req149CoverageBottomGap=String(Math.max(0,Math.round(sr.bottom-wr.bottom)));
  d.req149CoverageTopGap=String(Math.max(0,Math.round(wr.top-sr.top)));
  d.req149ShellComputedHeight=String(getComputedStyle(shell).height||'');
}
function schedule(){clearTimeout(timer);timer=setTimeout(record,80)}
if(typeof render==='function'){
  const before=render;
  render=function(){const out=before.apply(this,arguments);schedule();return out;};
}
window.addEventListener('resize',schedule,{passive:true});
if(window.visualViewport)window.visualViewport.addEventListener('resize',schedule,{passive:true});
schedule();
window.LQ_REQ149_V04F_CAMERA_DIAGNOSTICS={requirement:'REQ-149',stage:'FIELD-V04-DIAGNOSTICS',mutation:false,recordsSettledGeometry:true};
})();
