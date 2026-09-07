(() => {
'use strict';

/* REQ-001 P0 re-audit hardening.
   Inert in normal play. Under ?lqTouchSmoke=1 it proves that only the first
   active pointer owns movement and a second touch cannot steal direction.
   It waits for the REQ-021 long-press PASS marker so smoke cases never share
   the controller's single global pointer sequence. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

function pointer(type,target,id,x,y,isPrimary){
  const ev=new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:isPrimary!==false,clientX:x,clientY:y,buttons:type==='pointerup'||type==='pointercancel'?0:1});
  target.dispatchEvent(ev);
}
function fail(reason){
  if(document.getElementById('lqFloatingTouchSmokeFailure'))return;
  const f=document.createElement('i');
  f.id='lqFloatingTouchSmokeFailure';
  f.dataset.reason=String(reason||'REQ-001 multitouch assertion false');
  f.hidden=true;
  document.body.appendChild(f);
}
function mark(data){
  let m=document.getElementById('lqReq001MultitouchSmokeMarker');
  if(!m){m=document.createElement('i');m.id='lqReq001MultitouchSmokeMarker';m.hidden=true;document.body.appendChild(m);}
  Object.entries(data).forEach(([k,v])=>m.dataset[k]=String(v));
}
function run(){
  if(document.getElementById('lqReq001MultitouchSmokeMarker'))return;
  if(typeof s==='undefined'||typeof render!=='function')return fail('REQ-001 runtime authority missing');
  const snapshot=structuredClone(s);
  try{
    if(typeof stopMoving==='function')stopMoving();
    s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;
    render();
    const shell=document.querySelector('.gameShell');
    const pad=document.getElementById('lq-floating-touch-controller');
    if(!shell||!pad)throw new Error('REQ-001 multitouch shell/pad missing');
    const r=shell.getBoundingClientRect();
    const x=r.left+Math.max(100,Math.min(r.width*.52,r.width-100));
    const y=r.top+Math.max(140,Math.min(r.height*.55,r.height-140));
    const before={x:s.x,y:s.y};

    pointer('pointerdown',shell,930,x,y,true);
    pointer('pointerdown',shell,931,x+8,y+8,false);
    pointer('pointermove',window,931,x-90,y+2,false);
    const secondaryIgnored=s.x===before.x&&s.y===before.y&&!pad.querySelector('.lqFloatArrow.active');

    pointer('pointermove',window,930,x+70,y,true);
    setTimeout(()=>{
      const primaryOwns=!!pad.querySelector('.lqFloatArrow.right.active')&&s.x>=before.x;
      pointer('pointercancel',window,930,x+70,y,true);
      pointer('pointerup',window,931,x-90,y+2,false);
      const cleaned=!pad.classList.contains('visible')&&!pad.querySelector('.lqFloatArrow.active')&&!window.__lqFloatFallbackTimer;
      if(!(secondaryIgnored&&primaryOwns&&cleaned))fail('REQ-001 second pointer stole movement ownership or cleanup failed');
      mark({secondaryIgnored,primaryOwns,cleaned});
      Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
    },150);
  }catch(err){
    try{Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();}catch(_){ }
    fail(err&&err.message);
    mark({secondaryIgnored:false,primaryOwns:false,cleaned:false,error:true});
  }
}
function waitForLongPress(){
  const m=document.getElementById('lqReq021LongPressSmokeMarker');
  if(m&&m.dataset.noAction==='true'&&m.dataset.noMove==='true'&&m.dataset.cleaned==='true')return run();
  if(document.getElementById('lqFloatingTouchSmokeFailure'))return;
  setTimeout(waitForLongPress,20);
}
setTimeout(waitForLongPress,1700);
})();
