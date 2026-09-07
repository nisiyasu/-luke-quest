(() => {
'use strict';

/* REQ-001 P0 re-audit probe. Inert in normal play. It verifies that a held
   Dynamic Touch gesture survives visualViewport scroll, the pad re-clamps using
   current visual-viewport offsets, and pagehide clears held movement ownership. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

function pointer(type,target,id,x,y){
  target.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:true,clientX:x,clientY:y,buttons:type==='pointerup'||type==='pointercancel'?0:1}));
}
function fail(reason){
  if(document.getElementById('lqFloatingTouchSmokeFailure'))return;
  const f=document.createElement('i');
  f.id='lqFloatingTouchSmokeFailure';
  f.dataset.reason=String(reason||'REQ-001 viewport/lifecycle assertion false');
  f.hidden=true;
  document.body.appendChild(f);
}
function marker(data){
  const m=document.createElement('i');
  m.id='lqReq001VisualViewportOffsetSmokeMarker';
  Object.entries(data).forEach(([k,v])=>m.dataset[k]=String(v));
  m.hidden=true;
  document.body.appendChild(m);
}

setTimeout(()=>{
  const vv=window.visualViewport;
  const status=window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS;
  if(!vv){marker({supported:false,offsetAware:!!status?.visualViewportOffsetAware,scrollReclamp:!!status?.visualViewportScrollReclamp,pagehideStops:!!status?.pagehideStops});return;}
  const snapshot=structuredClone(s);
  let scrollReclamped=false,holdPreserved=false,releaseClean=false,pagehideClean=false;
  try{
    stopMoving();
    s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;
    render();
    const shell=document.querySelector('.gameShell');
    const pad=document.getElementById('lq-floating-touch-controller');
    if(!shell||!pad)throw new Error('REQ-001 viewport probe missing shell/pad');
    const r=shell.getBoundingClientRect();
    const x=r.left+Math.max(96,Math.min(r.width-96,r.width*.5));
    const y=r.top+Math.max(96,Math.min(r.height-96,r.height*.55));

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

    pointer('pointerdown',shell,791,x,y);
    pointer('pointermove',window,791,x+66,y);
    const pagehideEvent=typeof PageTransitionEvent==='function'?new PageTransitionEvent('pagehide',{persisted:true}):new Event('pagehide');
    window.dispatchEvent(pagehideEvent);
    pagehideClean=!pad.classList.contains('visible')&&!pad.querySelector('.lqFloatArrow.active')&&!window.__lqFloatFallbackTimer;
    pointer('pointerup',window,791,x+66,y);

    const contract=!!status?.visualViewportOffsetAware&&!!status?.visualViewportScrollReclamp&&!!status?.pagehideStops;
    if(!(contract&&scrollReclamped&&holdPreserved&&releaseClean&&pagehideClean))fail('REQ-001 visualViewport/pagehide safety assertion false');
    marker({supported:true,contract,scrollReclamped,holdPreserved,releaseClean,pagehideClean});
  }catch(err){
    console.error('lqReq001VisualViewportOffsetSmokeFailure',err);
    fail(err&&err.message);
    marker({supported:true,scrollReclamped,holdPreserved,releaseClean,pagehideClean,error:true});
  }finally{
    try{stopMoving();Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();}catch{}
  }
},1850);
})();