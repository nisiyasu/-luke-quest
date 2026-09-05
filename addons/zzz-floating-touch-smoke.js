(() => {
'use strict';

/* REQ-001 + REQ-021 dedicated browser probe. It is inert in normal play and runs only under ?lqTouchSmoke=1. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

function pointer(type,target,id,x,y){
  const ev=new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:true,clientX:x,clientY:y,buttons:type==='pointerup'||type==='pointercancel'?0:1});
  target.dispatchEvent(ev);
}
function marker(data){
  const m=document.createElement('i');
  m.id='lqFloatingTouchRuntimeSmokeMarker';
  Object.entries(data).forEach(([k,v])=>m.dataset[k]=String(v));
  m.hidden=true;
  document.body.appendChild(m);
}
function failure(reason){
  const f=document.createElement('i');
  f.id='lqFloatingTouchSmokeFailure';
  f.dataset.reason=String(reason||'unknown');
  f.hidden=true;
  document.body.appendChild(f);
}
function pointInShell(shell){
  const r=shell.getBoundingClientRect();
  return {x:r.left+Math.min(Math.max(r.width*.5,90),Math.max(90,r.width-90)),y:r.top+Math.min(Math.max(r.height*.58,90),Math.max(90,r.height-90))};
}

setTimeout(()=>{
  const snapshot=structuredClone(s);
  const originalAction=action;
  let actionCalls=0;
  let visible=false,deadZone=false,rightActive=false,movedRight=false,upActive=false,releasedHidden=false,stoppedAfterRelease=false,fallbackCleared=false;
  let tapAction=false,dialogClose=false,dialogPadHidden=false,dialogDragBlocked=false,dialogDragNoAction=false,dragNoAction=false,cancelNoAction=false,singleFire=false;
  action=function(){actionCalls++;return originalAction.apply(this,arguments);};
  try{
    stopMoving();

    // REQ-021: stationary short tap anywhere on world shell calls final canonical action exactly once.
    s.screen='world';s.map='town';s.x=4;s.y=7;s.dir='up';s.dialog=null;
    render();
    let shell=document.querySelector('.gameShell');
    let p=pointInShell(shell);
    pointer('pointerdown',shell,700,p.x,p.y);
    pointer('pointerup',window,700,p.x,p.y);
    tapAction=actionCalls===1&&!!s.dialog&&s.dialog.name==='旅好きの老人';

    // REQ-001 dialogue exclusion + REQ-021 dialogue Action compatibility:
    // movement pad remains hidden and a drag neither moves nor closes dialogue.
    shell=document.querySelector('.gameShell');
    const pad=document.getElementById('lq-floating-touch-controller');
    if(!shell||!pad)throw new Error('floating touch shell/pad missing');
    p=pointInShell(shell);
    const dialogX=s.x,dialogY=s.y;
    pointer('pointerdown',shell,701,p.x,p.y);
    dialogPadHidden=!pad.classList.contains('visible');
    pointer('pointermove',window,701,p.x+70,p.y);
    pointer('pointerup',window,701,p.x+70,p.y);
    dialogDragBlocked=s.x===dialogX&&s.y===dialogY;
    dialogDragNoAction=actionCalls===1&&!!s.dialog;

    // A clean stationary dialogue tap still closes like A.
    shell=document.querySelector('.gameShell');
    p=pointInShell(shell);
    pointer('pointerdown',shell,704,p.x,p.y);
    pointer('pointerup',window,704,p.x,p.y);
    dialogClose=actionCalls===2&&!s.dialog;

    // REQ-001: dead zone then drag/hold/direction-switch. Drag release must not also fire Action.
    s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;
    render();
    shell=document.querySelector('.gameShell');
    p=pointInShell(shell);
    const ox=p.x,oy=p.y;
    const startX=s.x,startY=s.y;

    pointer('pointerdown',shell,702,ox,oy);
    visible=pad.classList.contains('visible');
    pointer('pointermove',window,702,ox+7,oy+5);
    deadZone=!pad.querySelector('.lqFloatArrow.active')&&s.x===startX&&s.y===startY;

    pointer('pointermove',window,702,ox+62,oy+2);
    setTimeout(()=>{
      rightActive=!!pad.querySelector('.lqFloatArrow.right.active');
      movedRight=s.x>startX;
      pointer('pointermove',window,702,ox+2,oy-70);
      setTimeout(()=>{
        upActive=!!pad.querySelector('.lqFloatArrow.up.active');
        pointer('pointerup',window,702,ox+2,oy-70);
        releasedHidden=!pad.classList.contains('visible')&&!pad.querySelector('.lqFloatArrow.active');
        dragNoAction=actionCalls===2;
        const releaseX=s.x,releaseY=s.y;
        setTimeout(()=>{
          stoppedAfterRelease=s.x===releaseX&&s.y===releaseY;
          fallbackCleared=!window.__lqFloatFallbackTimer;

          // pointercancel must clean up but never produce an Action.
          shell=document.querySelector('.gameShell');
          p=pointInShell(shell);
          pointer('pointerdown',shell,703,p.x,p.y);
          pointer('pointercancel',window,703,p.x,p.y);
          cancelNoAction=actionCalls===2&&!pad.classList.contains('visible');
          singleFire=tapAction&&dialogPadHidden&&dialogDragBlocked&&dialogDragNoAction&&dialogClose&&dragNoAction&&cancelNoAction&&actionCalls===2;
          const allPass=visible&&deadZone&&rightActive&&movedRight&&upActive&&releasedHidden&&stoppedAfterRelease&&fallbackCleared&&singleFire;
          if(!allPass)failure('REQ-001/021 assertion false');

          action=originalAction;
          Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
          marker({visible,deadZone,rightActive,movedRight,upActive,releasedHidden,stoppedAfterRelease,fallbackCleared,tapAction,dialogPadHidden,dialogDragBlocked,dialogDragNoAction,dialogClose,dragNoAction,cancelNoAction,singleFire});
        },280);
      },170);
    },300);
  }catch(err){
    console.error('lqFloatingTouchSmokeFailure',err);
    failure(err&&err.message);
    action=originalAction;
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
    marker({visible,deadZone,rightActive,movedRight,upActive,releasedHidden,stoppedAfterRelease,fallbackCleared,tapAction,dialogPadHidden,dialogDragBlocked,dialogDragNoAction,dialogClose,dragNoAction,cancelNoAction,singleFire,error:true});
  }
},350);
})();
