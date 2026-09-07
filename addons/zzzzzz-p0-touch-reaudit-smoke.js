(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;
const FAILURE_ID='lqFloatingTouchSmokeFailure';
const MARKER_ID='lqP0TouchReauditSmokeMarker';
let started=false,scheduled=false;
function pointer(type,target,id,x,y,isPrimary=true){const ev=new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary,clientX:x,clientY:y,buttons:type==='pointerup'||type==='pointercancel'?0:1});target.dispatchEvent(ev);}
function fail(reason,data={}){
  const text='P0 touch re-audit: '+String(reason||'unknown');
  const old=document.getElementById(FAILURE_ID);if(old)old.remove();
  const f=document.createElement('i');f.id=FAILURE_ID;f.dataset.reason=text;Object.entries(data).forEach(([k,v])=>f.dataset['p0'+k.charAt(0).toUpperCase()+k.slice(1)]=String(v));f.hidden=true;document.body.appendChild(f);
  // Force the existing workflow into its verbose "missing marker" branch so the
  // hidden data-reason / assertion booleans are printed without editing workflow YAML.
  const base=document.getElementById('lqFloatingTouchRuntimeSmokeMarker');if(base)base.remove();
}
function mark(data){const old=document.getElementById(MARKER_ID);if(old)old.remove();const m=document.createElement('i');m.id=MARKER_ID;m.hidden=true;Object.entries(data).forEach(([k,v])=>m.dataset[k]=String(v));document.body.appendChild(m);}
function pointInShell(shell){const r=shell.getBoundingClientRect();return{x:r.left+Math.max(90,Math.min(r.width-90,r.width*.5)),y:r.top+Math.max(90,Math.min(r.height-90,r.height*.58))};}
function restore(snapshot,originalAction){action=originalAction;Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();}
function run(){
  if(started)return;started=true;
  if(typeof s==='undefined'||typeof render!=='function'||typeof action!=='function'){fail('canonical state/render/action authority missing');return;}
  const snapshot=structuredClone(s),originalAction=action;let actionCalls=0;
  let primaryVisible=false,secondaryIgnored=false,secondaryReleasePreserved=false,longPressNoAction=false,longPressNoMove=false,releasedClean=false;
  action=function(){actionCalls++;return originalAction.apply(this,arguments);};
  try{
    if(typeof stopMoving==='function')stopMoving();s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;render();
    const shell=document.querySelector('.gameShell'),pad=document.getElementById('lq-floating-touch-controller');if(!shell||!pad)throw new Error('world shell or floating pad missing');
    const p=pointInShell(shell),startX=s.x,startY=s.y;
    pointer('pointerdown',shell,920,p.x,p.y,true);primaryVisible=pad.classList.contains('visible');
    pointer('pointerdown',shell,921,p.x+20,p.y+20,false);pointer('pointermove',window,921,p.x+100,p.y+20,false);
    secondaryIgnored=!pad.querySelector('.lqFloatArrow.active')&&s.x===startX&&s.y===startY;
    pointer('pointerup',window,921,p.x+100,p.y+20,false);secondaryReleasePreserved=pad.classList.contains('visible')&&!pad.querySelector('.lqFloatArrow.active');
    setTimeout(()=>{
      try{
        pointer('pointerup',window,920,p.x,p.y,true);longPressNoAction=actionCalls===0&&!s.dialog;longPressNoMove=s.x===startX&&s.y===startY;releasedClean=!pad.classList.contains('visible')&&!pad.querySelector('.lqFloatArrow.active')&&!window.__lqFloatFallbackTimer;
        const data={primaryVisible,secondaryIgnored,secondaryReleasePreserved,longPressNoAction,longPressNoMove,releasedClean,actionCalls};
        if(!Object.entries(data).filter(([k])=>k!=='actionCalls').every(([,v])=>v===true))fail('stationary long-press or multitouch ownership assertion false',data);
        restore(snapshot,originalAction);mark(data);
      }catch(err){restore(snapshot,originalAction);fail(err&&err.message||err,{primaryVisible,secondaryIgnored,secondaryReleasePreserved,longPressNoAction,longPressNoMove,releasedClean,actionCalls});}
    },500);
  }catch(err){restore(snapshot,originalAction);fail(err&&err.message||err,{primaryVisible,secondaryIgnored,secondaryReleasePreserved,longPressNoAction,longPressNoMove,releasedClean,actionCalls});}
}
const poll=setInterval(()=>{if(document.getElementById('lqFloatingTouchRuntimeSmokeMarker')){clearInterval(poll);if(!scheduled){scheduled=true;setTimeout(run,260);}}},40);
setTimeout(()=>{if(!started&&!scheduled){clearInterval(poll);fail('base floating-touch smoke did not complete before re-audit timeout');}},2100);
})();
