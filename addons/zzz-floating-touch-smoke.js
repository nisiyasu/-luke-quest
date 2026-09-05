(() => {
'use strict';

/* REQ-001 dedicated browser probe. It is inert in normal play and runs only under ?lqTouchSmoke=1. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

function pointer(type,target,id,x,y){
  const ev=new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:true,clientX:x,clientY:y,buttons:type==='pointerup'?0:1});
  target.dispatchEvent(ev);
}
function marker(data){
  const m=document.createElement('i');
  m.id='lqFloatingTouchRuntimeSmokeMarker';
  Object.entries(data).forEach(([k,v])=>m.dataset[k]=String(v));
  m.hidden=true;
  document.body.appendChild(m);
}

setTimeout(()=>{
  const snapshot=structuredClone(s);
  const id=701;
  let visible=false,deadZone=false,rightActive=false,movedRight=false,upActive=false,releasedHidden=false,stoppedAfterRelease=false,fallbackCleared=false;
  try{
    stopMoving();
    s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;
    render();
    s.dialog=null;
    const shell=document.querySelector('.gameShell');
    const pad=document.getElementById('lq-floating-touch-controller');
    if(!shell||!pad)throw new Error('floating touch shell/pad missing');
    const r=shell.getBoundingClientRect();
    const ox=r.left+Math.min(Math.max(r.width*.5,90),Math.max(90,r.width-90));
    const oy=r.top+Math.min(Math.max(r.height*.58,90),Math.max(90,r.height-90));
    const startX=s.x,startY=s.y;

    pointer('pointerdown',shell,id,ox,oy);
    visible=pad.classList.contains('visible');
    pointer('pointermove',window,id,ox+7,oy+5);
    deadZone=!pad.querySelector('.lqFloatArrow.active')&&s.x===startX&&s.y===startY;

    pointer('pointermove',window,id,ox+62,oy+2);
    setTimeout(()=>{
      rightActive=!!pad.querySelector('.lqFloatArrow.right.active');
      movedRight=s.x>startX;
      pointer('pointermove',window,id,ox+2,oy-70);
      setTimeout(()=>{
        upActive=!!pad.querySelector('.lqFloatArrow.up.active');
        pointer('pointerup',window,id,ox+2,oy-70);
        releasedHidden=!pad.classList.contains('visible')&&!pad.querySelector('.lqFloatArrow.active');
        const releaseX=s.x,releaseY=s.y;
        setTimeout(()=>{
          stoppedAfterRelease=s.x===releaseX&&s.y===releaseY;
          fallbackCleared=!window.__lqFloatFallbackTimer;
          Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
          marker({visible,deadZone,rightActive,movedRight,upActive,releasedHidden,stoppedAfterRelease,fallbackCleared});
        },280);
      },170);
    },300);
  }catch(err){
    console.error('lqFloatingTouchSmokeFailure',err);
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
    marker({visible,deadZone,rightActive,movedRight,upActive,releasedHidden,stoppedAfterRelease,fallbackCleared,error:true});
  }
},350);
})();