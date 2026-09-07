(() => {
'use strict';

/* REQ-021 P0 re-audit hardening.
   Inert in normal play. Under ?lqTouchSmoke=1 it proves that a stationary hold
   beyond the tap window does not become canonical Action on release.
   It waits for the existing visibilitychange regression marker instead of
   relying on a fixed start time, preventing shared global-pointer interference. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

function pointer(type,target,id,x,y){
  const ev=new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:true,clientX:x,clientY:y,buttons:type==='pointerup'||type==='pointercancel'?0:1});
  target.dispatchEvent(ev);
}
function fail(reason){
  if(document.getElementById('lqFloatingTouchSmokeFailure'))return;
  const f=document.createElement('i');
  f.id='lqFloatingTouchSmokeFailure';
  f.dataset.reason=String(reason||'REQ-021 long press assertion false');
  f.hidden=true;
  document.body.appendChild(f);
}
function mark(data){
  let m=document.getElementById('lqReq021LongPressSmokeMarker');
  if(!m){m=document.createElement('i');m.id='lqReq021LongPressSmokeMarker';m.hidden=true;document.body.appendChild(m);}
  Object.entries(data).forEach(([k,v])=>m.dataset[k]=String(v));
}
function run(){
  if(document.getElementById('lqReq021LongPressSmokeMarker'))return;
  if(typeof s==='undefined'||typeof action!=='function')return fail('REQ-021 runtime authority missing');
  const snapshot=structuredClone(s);
  const originalAction=action;
  let calls=0;
  action=function(){calls++;return originalAction.apply(this,arguments);};
  try{
    if(typeof stopMoving==='function')stopMoving();
    s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;
    render();
    const shell=document.querySelector('.gameShell');
    if(!shell)throw new Error('REQ-021 long press shell missing');
    const r=shell.getBoundingClientRect();
    const x=r.left+Math.max(100,Math.min(r.width*.52,r.width-100));
    const y=r.top+Math.max(140,Math.min(r.height*.55,r.height-140));
    const before={x:s.x,y:s.y};
    pointer('pointerdown',shell,921,x,y);
    setTimeout(()=>{
      pointer('pointerup',window,921,x,y);
      const pad=document.getElementById('lq-floating-touch-controller');
      const noAction=calls===0&&!s.dialog;
      const noMove=s.x===before.x&&s.y===before.y;
      const cleaned=!pad||(!pad.classList.contains('visible')&&!pad.querySelector('.lqFloatArrow.active')&&!window.__lqFloatFallbackTimer);
      if(!(noAction&&noMove&&cleaned))fail('REQ-021 stationary long press leaked Action/movement');
      mark({noAction,noMove,cleaned});
      action=originalAction;
      Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
    },520);
  }catch(err){
    action=originalAction;
    try{Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();}catch(_){ }
    fail(err&&err.message);
    mark({noAction:false,noMove:false,cleaned:false,error:true});
  }
}
function waitForVisibility(){
  const v=document.getElementById('lqVisibilityTouchSmokeMarker');
  if(v&&v.dataset.pass==='true')return run();
  if(document.getElementById('lqFloatingTouchSmokeFailure'))return;
  setTimeout(waitForVisibility,20);
}
setTimeout(waitForVisibility,1650);
})();
