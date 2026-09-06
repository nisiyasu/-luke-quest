(() => {
'use strict';

/* P0 REQ-001 / REQ-021 regression hardening.
   Inert in normal play. Under ?lqTouchSmoke=1, explicitly proves that a
   visibilitychange-to-hidden transition revokes an active world gesture,
   stops movement, clears fallback timers, hides the floating controller,
   and cannot emit a stale Action on the old pointer release. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

function fail(reason){
  if(document.getElementById('lqFloatingTouchSmokeFailure'))return;
  const f=document.createElement('i');
  f.id='lqFloatingTouchSmokeFailure';
  f.dataset.reason=String(reason||'visibilitychange regression failed');
  f.hidden=true;
  document.body.appendChild(f);
}

function dispatchPointer(type,target,id,x,y){
  const ev=new PointerEvent(type,{
    bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:true,
    clientX:x,clientY:y,buttons:type==='pointerup'||type==='pointercancel'?0:1
  });
  target.dispatchEvent(ev);
}

function shellPoint(shell){
  const r=shell.getBoundingClientRect();
  return {x:r.left+Math.max(96,Math.min(r.width*.56,r.width-96)),y:r.top+Math.max(150,Math.min(r.height*.58,r.height-150))};
}

setTimeout(()=>{
  const snapshot=structuredClone(s);
  const originalAction=action;
  let actionCalls=0;
  let hiddenOverrideInstalled=false;
  const ownHidden=Object.getOwnPropertyDescriptor(document,'hidden');
  const ownVisibility=Object.getOwnPropertyDescriptor(document,'visibilityState');
  try{
    stopMoving();
    action=function(){actionCalls++;return originalAction.apply(this,arguments);};
    s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;
    render();

    const shell=document.querySelector('.gameShell');
    const pad=document.getElementById('lq-floating-touch-controller');
    if(!shell||!pad)throw new Error('visibilitychange smoke shell/pad missing');
    const p=shellPoint(shell);
    const startX=s.x,startY=s.y;

    dispatchPointer('pointerdown',shell,780,p.x,p.y);
    dispatchPointer('pointermove',window,780,p.x+72,p.y+2);
    const activeBefore=pad.classList.contains('visible')&&!!pad.querySelector('.lqFloatArrow.right.active');
    const movedBefore=s.x>startX||s.y!==startY;

    Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
    Object.defineProperty(document,'visibilityState',{configurable:true,get:()=> 'hidden'});
    hiddenOverrideInstalled=true;
    document.dispatchEvent(new Event('visibilitychange'));

    const hiddenAfter=!pad.classList.contains('visible');
    const directionCleared=!pad.querySelector('.lqFloatArrow.active');
    const timerCleared=!window.__lqFloatFallbackTimer;
    const stoppedAtX=s.x,stoppedAtY=s.y;

    dispatchPointer('pointerup',window,780,p.x+72,p.y+2);
    const staleReleaseNoAction=actionCalls===0;

    setTimeout(()=>{
      try{
        const stayedStopped=s.x===stoppedAtX&&s.y===stoppedAtY;
        const pass=activeBefore&&movedBefore&&hiddenAfter&&directionCleared&&timerCleared&&staleReleaseNoAction&&stayedStopped;
        const marker=document.createElement('i');
        marker.id='lqVisibilityTouchSmokeMarker';
        marker.dataset.activeBefore=String(activeBefore);
        marker.dataset.movedBefore=String(movedBefore);
        marker.dataset.hiddenAfter=String(hiddenAfter);
        marker.dataset.directionCleared=String(directionCleared);
        marker.dataset.timerCleared=String(timerCleared);
        marker.dataset.staleReleaseNoAction=String(staleReleaseNoAction);
        marker.dataset.stayedStopped=String(stayedStopped);
        marker.dataset.pass=String(pass);
        marker.hidden=true;
        document.body.appendChild(marker);
        if(!pass)fail('visibilitychange assertion false');
      } finally {
        action=originalAction;
        if(hiddenOverrideInstalled){
          if(ownHidden)Object.defineProperty(document,'hidden',ownHidden);else delete document.hidden;
          if(ownVisibility)Object.defineProperty(document,'visibilityState',ownVisibility);else delete document.visibilityState;
        }
        Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
      }
    },180);
  }catch(err){
    console.error('lqVisibilityTouchSmokeFailure',err);
    fail(err&&err.message);
    action=originalAction;
    try{
      if(hiddenOverrideInstalled){
        if(ownHidden)Object.defineProperty(document,'hidden',ownHidden);else delete document.hidden;
        if(ownVisibility)Object.defineProperty(document,'visibilityState',ownVisibility);else delete document.visibilityState;
      }
    }catch(_){ }
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
  }
},1650);
})();
