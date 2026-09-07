(() => {
'use strict';

/* P0 touch re-audit probe. Inert in normal play. It verifies visualViewport
   offset/scroll re-clamp, pagehide cleanup, hard-stop viewport boundaries, and
   dialogue tap-vs-native-pan arbitration without adding any production input path.
   It runs only after the primary floating-touch smoke has finished so two probes
   never compete for the same pointer/controller/state ownership. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

function pointer(type,target,id,x,y){
  const ev=new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:true,clientX:x,clientY:y,buttons:type==='pointerup'||type==='pointercancel'?0:1});
  target.dispatchEvent(ev);
  return ev;
}
function fail(reason){
  if(document.getElementById('lqFloatingTouchSmokeFailure'))return;
  const f=document.createElement('i');
  f.id='lqFloatingTouchSmokeFailure';
  f.dataset.reason=String(reason||'P0 touch assertion false');
  f.hidden=true;
  document.body.appendChild(f);
}
function marker(data){
  const existing=document.getElementById('lqReq001VisualViewportOffsetSmokeMarker');
  if(existing)existing.remove();
  const m=document.createElement('i');
  m.id='lqReq001VisualViewportOffsetSmokeMarker';
  Object.entries(data).forEach(([k,v])=>m.dataset[k]=String(v));
  m.hidden=true;
  document.body.appendChild(m);
}

function runProbe(){
  const vv=window.visualViewport;
  const status=window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS;
  const snapshot=structuredClone(s);
  let scrollReclamped=true,holdPreserved=true,releaseClean=true,pagehideClean=true,windowResizeStops=false,orientationStops=false;
  let dialoguePanContract=false,dialoguePointerDownNative=false,dialoguePointerMoveNative=false,dialogueSwipeNoMove=false,dialogueSwipeNoAction=true;
  try{
    stopMoving();
    s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;
    render();
    let shell=document.querySelector('.gameShell');
    const pad=document.getElementById('lq-floating-touch-controller');
    if(!shell||!pad)throw new Error('P0 touch probe missing shell/pad');
    let r=shell.getBoundingClientRect();
    let x=r.left+Math.max(96,Math.min(r.width-96,r.width*.5));
    let y=r.top+Math.max(96,Math.min(r.height-96,r.height*.55));

    if(vv){
      pointer('pointerdown',shell,790,x,y);
      pointer('pointermove',window,790,x+66,y);
      pad.dataset.lqViewportOffsetLeft='stale';
      pad.dataset.lqViewportOffsetTop='stale';
      vv.dispatchEvent(new Event('scroll'));
      const expectedLeft=String(Number.isFinite(vv.offsetLeft)?vv.offsetLeft:0);
      const expectedTop=String(Number.isFinite(vv.offsetTop)?vv.offsetTop:0);
      scrollReclamped=pad.dataset.lqViewportOffsetLeft===expectedLeft&&pad.dataset.lqViewportOffsetTop===expectedTop;
      holdPreserved=pad.classList.contains('visible')&&!!pad.querySelector('.lqFloatArrow.right.active');
      pointer('pointerup',window,790,x+66,y);
      releaseClean=!pad.classList.contains('visible')&&!pad.querySelector('.lqFloatArrow.active')&&!window.__lqFloatFallbackTimer;
    }

    pointer('pointerdown',shell,791,x,y);
    pointer('pointermove',window,791,x+66,y);
    const pagehideEvent=typeof PageTransitionEvent==='function'?new PageTransitionEvent('pagehide',{persisted:true}):new Event('pagehide');
    window.dispatchEvent(pagehideEvent);
    pagehideClean=!pad.classList.contains('visible')&&!pad.querySelector('.lqFloatArrow.active')&&!window.__lqFloatFallbackTimer;
    pointer('pointerup',window,791,x+66,y);

    // Hard viewport changes are explicit release-safety boundaries. Unlike
    // visualViewport resize/scroll (browser chrome), window resize and orientation
    // changes must revoke the owned drag so movement cannot survive a layout reset.
    s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;render();
    shell=document.querySelector('.gameShell');r=shell.getBoundingClientRect();
    x=r.left+Math.max(96,Math.min(r.width-96,r.width*.5));
    y=r.top+Math.max(96,Math.min(r.height-96,r.height*.55));
    pointer('pointerdown',shell,793,x,y);
    pointer('pointermove',window,793,x+66,y);
    window.dispatchEvent(new Event('resize'));
    windowResizeStops=!pad.classList.contains('visible')&&!pad.querySelector('.lqFloatArrow.active')&&!window.__lqFloatFallbackTimer;
    pointer('pointerup',window,793,x+66,y);

    s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;render();
    shell=document.querySelector('.gameShell');r=shell.getBoundingClientRect();
    x=r.left+Math.max(96,Math.min(r.width-96,r.width*.5));
    y=r.top+Math.max(96,Math.min(r.height-96,r.height*.55));
    pointer('pointerdown',shell,794,x,y);
    pointer('pointermove',window,794,x+66,y);
    window.dispatchEvent(new Event('orientationchange'));
    orientationStops=!pad.classList.contains('visible')&&!pad.querySelector('.lqFloatArrow.active')&&!window.__lqFloatFallbackTimer;
    pointer('pointerup',window,794,x+66,y);

    // REQ-021 + REQ-022 integration: a dialogue that is already open must keep
    // short taps available to canonical Action, but a swipe belongs to native
    // pan-y scrolling. Synthetic events cannot scroll the browser, so assert the
    // two contracts that make it possible: touch-action: pan-y and no JS default
    // prevention. Also prove swipe distance suppresses Action/world movement.
    s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';
    s.dialog={name:'SYSTEM',text:'scroll probe\n'.repeat(60)};
    render();
    shell=document.querySelector('.gameShell');
    const dialog=document.querySelector('.dialogBox');
    if(!shell||!dialog)throw new Error('dialogue scroll probe missing shell/dialog');
    r=dialog.getBoundingClientRect();
    x=r.left+Math.min(Math.max(r.width*.5,24),Math.max(24,r.width-24));
    y=r.top+Math.min(Math.max(r.height*.65,24),Math.max(24,r.height-24));
    const beforeX=s.x,beforeY=s.y,beforeDialog=s.dialog;
    dialoguePanContract=getComputedStyle(shell).touchAction.includes('pan-y')&&getComputedStyle(dialog).touchAction.includes('pan-y')&&!!status?.dialoguePanYScroll;
    const down=pointer('pointerdown',dialog,792,x,y);
    const moveEv=pointer('pointermove',window,792,x,y-70);
    dialoguePointerDownNative=!down.defaultPrevented;
    dialoguePointerMoveNative=!moveEv.defaultPrevented;
    pointer('pointerup',window,792,x,y-70);
    dialogueSwipeNoMove=s.x===beforeX&&s.y===beforeY;
    dialogueSwipeNoAction=s.dialog===beforeDialog;

    const contract=!!status?.visualViewportOffsetAware&&!!status?.visualViewportScrollReclamp&&!!status?.pagehideStops&&!!status?.viewportChangeStops&&!!status?.dialoguePanYScroll;
    const pass=contract&&scrollReclamped&&holdPreserved&&releaseClean&&pagehideClean&&windowResizeStops&&orientationStops&&dialoguePanContract&&dialoguePointerDownNative&&dialoguePointerMoveNative&&dialogueSwipeNoMove&&dialogueSwipeNoAction;
    marker({supported:!!vv,contract,scrollReclamped,holdPreserved,releaseClean,pagehideClean,windowResizeStops,orientationStops,dialoguePanContract,dialoguePointerDownNative,dialoguePointerMoveNative,dialogueSwipeNoMove,dialogueSwipeNoAction,pass});
    if(!pass)fail(`P0 extended assertion false resize=${windowResizeStops} orientation=${orientationStops} dialoguePan=${dialoguePanContract}`);
  }catch(err){
    console.error('lqP0TouchExtendedSmokeFailure',err);
    marker({supported:!!vv,scrollReclamped,holdPreserved,releaseClean,pagehideClean,windowResizeStops,orientationStops,dialoguePanContract,dialoguePointerDownNative,dialoguePointerMoveNative,dialogueSwipeNoMove,dialogueSwipeNoAction,error:true,pass:false});
    fail(err&&err.message);
  }finally{
    try{stopMoving();Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();}catch{}
  }
}

const waitStarted=performance.now();
function waitForPrimarySmoke(){
  // The primary smoke mutates the same global game state and owns the same pad.
  // Serializing the probes makes a failure describe production behavior rather
  // than two test harnesses cancelling one another's synthetic pointers.
  if(document.getElementById('lqFloatingTouchRuntimeSmokeMarker')){runProbe();return;}
  if(performance.now()-waitStarted>2100){
    marker({primarySmokeReady:false,error:true,pass:false});
    fail('P0 extended smoke timed out waiting for primary touch smoke');
    return;
  }
  setTimeout(waitForPrimarySmoke,40);
}
setTimeout(waitForPrimarySmoke,250);
})();