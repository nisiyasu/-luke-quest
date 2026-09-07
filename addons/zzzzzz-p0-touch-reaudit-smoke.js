(() => {
'use strict';

/* P0 REQ-021 / REQ-001 re-audit probe.
   Runs only after the canonical floating-touch smoke has completed so it cannot
   race its state/action wrapper. Existing Pages lqTouchSmoke gate already fails
   on #lqFloatingTouchSmokeFailure, so no workflow edit is required. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

const FAILURE_ID='lqFloatingTouchSmokeFailure';
const MARKER_ID='lqP0TouchReauditSmokeMarker';
let started=false;

function pointer(type,target,id,x,y,isPrimary=true){
  const ev=new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary,clientX:x,clientY:y,buttons:type==='pointerup'||type==='pointercancel'?0:1});
  target.dispatchEvent(ev);
}
function fail(reason){
  if(document.getElementById(FAILURE_ID))return;
  const f=document.createElement('i');
  f.id=FAILURE_ID;
  f.dataset.reason='P0 touch re-audit: '+String(reason||'unknown');
  f.hidden=true;
  document.body.appendChild(f);
}
function mark(data){
  const old=document.getElementById(MARKER_ID);if(old)old.remove();
  const m=document.createElement('i');m.id=MARKER_ID;m.hidden=true;
  Object.entries(data).forEach(([k,v])=>m.dataset[k]=String(v));
  document.body.appendChild(m);
}
function pointInShell(shell){
  const r=shell.getBoundingClientRect();
  return {x:r.left+Math.max(90,Math.min(r.width-90,r.width*.5)),y:r.top+Math.max(90,Math.min(r.height-90,r.height*.58))};
}

function run(){
  if(started)return;started=true;
  if(typeof s==='undefined'||typeof render!=='function'||typeof action!=='function'){
    fail('canonical state/render/action authority missing');return;
  }
  const snapshot=structuredClone(s);
  const originalAction=action;
  let actionCalls=0;
  let primaryVisible=false,secondaryIgnored=false,secondaryReleasePreserved=false,longPressNoAction=false,longPressNoMove=false,releasedClean=false;
  action=function(){actionCalls++;return originalAction.apply(this,arguments);};
  try{
    if(typeof stopMoving==='function')stopMoving();
    s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;
    render();
    const shell=document.querySelector('.gameShell');
    const pad=document.getElementById('lq-floating-touch-controller');
    if(!shell||!pad)throw new Error('world shell or floating pad missing');
    const p=pointInShell(shell);
    const startX=s.x,startY=s.y;

    // Primary stationary press owns the sequence and may show the pad, but it
    // must not become Action merely because it was held beyond TAP_MAX_MS.
    pointer('pointerdown',shell,920,p.x,p.y,true);
    primaryVisible=pad.classList.contains('visible');

    // A second touch must not steal/redirect/release the active primary pointer.
    pointer('pointerdown',shell,921,p.x+20,p.y+20,false);
    pointer('pointermove',window,921,p.x+100,p.y+20,false);
    secondaryIgnored=!pad.querySelector('.lqFloatArrow.active')&&s.x===startX&&s.y===startY;
    pointer('pointerup',window,921,p.x+100,p.y+20,false);
    secondaryReleasePreserved=pad.classList.contains('visible')&&!pad.querySelector('.lqFloatArrow.active');

    setTimeout(()=>{
      try{
        pointer('pointerup',window,920,p.x,p.y,true);
        longPressNoAction=actionCalls===0&&!s.dialog;
        longPressNoMove=s.x===startX&&s.y===startY;
        releasedClean=!pad.classList.contains('visible')&&!pad.querySelector('.lqFloatArrow.active')&&!window.__lqFloatFallbackTimer;
        if(!(primaryVisible&&secondaryIgnored&&secondaryReleasePreserved&&longPressNoAction&&longPressNoMove&&releasedClean)){
          fail('stationary long-press or multitouch ownership assertion false');
        }
        action=originalAction;
        Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
        mark({primaryVisible,secondaryIgnored,secondaryReleasePreserved,longPressNoAction,longPressNoMove,releasedClean});
      }catch(err){
        action=originalAction;
        Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
        fail(err&&err.message||err);
        mark({primaryVisible,secondaryIgnored,secondaryReleasePreserved,longPressNoAction,longPressNoMove,releasedClean,error:true});
      }
    },500);
  }catch(err){
    action=originalAction;
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
    fail(err&&err.message||err);
    mark({primaryVisible,secondaryIgnored,secondaryReleasePreserved,longPressNoAction,longPressNoMove,releasedClean,error:true});
  }
}

const poll=setInterval(()=>{
  if(document.getElementById('lqFloatingTouchRuntimeSmokeMarker')){
    clearInterval(poll);run();
  }
},40);
setTimeout(()=>{
  if(!started){clearInterval(poll);fail('base floating-touch smoke did not complete before re-audit timeout');}
},1900);
})();
