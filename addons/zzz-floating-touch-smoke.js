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
  let visible=false,visualContract=false,deadZone=false,rightActive=false,movedRight=false,upActive=false,releasedHidden=false,stoppedAfterRelease=false,fallbackCleared=false;
  let tapAction=false,dialogClose=false,dialogPadHidden=false,dialogDragBlocked=false,dialogDragNoAction=false,dragNoAction=false,cancelNoAction=false,singleFire=false;
  let uiExcluded=false,blurStops=false,rerenderHoldSafe=false,mapTransitionStops=false;
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

    // Dialogue accepts a stationary Action tap but never movement.
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

    shell=document.querySelector('.gameShell');
    p=pointInShell(shell);
    pointer('pointerdown',shell,704,p.x,p.y);
    pointer('pointerup',window,704,p.x,p.y);
    dialogClose=actionCalls===2&&!s.dialog;

    // Dead zone, hold, live direction switch, release, and visible UI contract.
    s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;
    render();
    shell=document.querySelector('.gameShell');
    p=pointInShell(shell);
    const ox=p.x,oy=p.y;
    const startX=s.x,startY=s.y;

    pointer('pointerdown',shell,702,ox,oy);
    visible=pad.classList.contains('visible');
    const padStyle=getComputedStyle(pad);
    const arrowStyle=getComputedStyle(pad.querySelector('.lqFloatArrow.right'));
    visualContract=pad.dataset.lqControllerVersion==='1.5'&&parseFloat(padStyle.width)>=160&&parseFloat(padStyle.height)>=160&&parseFloat(arrowStyle.width)>=50&&parseFloat(arrowStyle.borderWidth)>=2&&window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.visualContrastHardened===true;
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

          // pointercancel cleans up and never Actions.
          shell=document.querySelector('.gameShell');p=pointInShell(shell);
          pointer('pointerdown',shell,703,p.x,p.y);
          pointer('pointercancel',window,703,p.x,p.y);
          cancelNoAction=actionCalls===2&&!pad.classList.contains('visible');

          // Explicit A/MENU controls must not start the world controller.
          const explicit=document.querySelector('.actionPad button');
          if(!explicit)throw new Error('explicit control missing');
          const er=explicit.getBoundingClientRect();
          pointer('pointerdown',explicit,705,er.left+5,er.top+5);
          uiExcluded=!pad.classList.contains('visible');
          pointer('pointerup',window,705,er.left+5,er.top+5);

          // Ordinary render during a held direction must not orphan the pointer/timer.
          s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;render();
          shell=document.querySelector('.gameShell');p=pointInShell(shell);
          pointer('pointerdown',shell,706,p.x,p.y);
          pointer('pointermove',window,706,p.x+65,p.y);
          render();
          rerenderHoldSafe=pad.classList.contains('visible')&&!!pad.querySelector('.lqFloatArrow.right.active');
          pointer('pointerup',window,706,p.x+65,p.y);

          // blur must stop movement and clear visual/timer state.
          shell=document.querySelector('.gameShell');p=pointInShell(shell);
          pointer('pointerdown',shell,707,p.x,p.y);
          pointer('pointermove',window,707,p.x+65,p.y);
          window.dispatchEvent(new Event('blur'));
          blurStops=!pad.classList.contains('visible')&&!window.__lqFloatFallbackTimer&&!pad.querySelector('.lqFloatArrow.active');

          // A map transition during hold must stop before the new map can inherit movement.
          s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='right';s.dialog=null;render();
          shell=document.querySelector('.gameShell');p=pointInShell(shell);
          pointer('pointerdown',shell,708,p.x,p.y);
          pointer('pointermove',window,708,p.x+65,p.y);
          s.map='field';s.x=10;s.y=10;s.dir='up';
          render();
          mapTransitionStops=!pad.classList.contains('visible')&&!window.__lqFloatFallbackTimer&&!pad.querySelector('.lqFloatArrow.active');
          pointer('pointerup',window,708,p.x+65,p.y);

          singleFire=tapAction&&dialogPadHidden&&dialogDragBlocked&&dialogDragNoAction&&dialogClose&&dragNoAction&&cancelNoAction&&actionCalls===2;
          const allPass=visible&&visualContract&&deadZone&&rightActive&&movedRight&&upActive&&releasedHidden&&stoppedAfterRelease&&fallbackCleared&&singleFire&&uiExcluded&&blurStops&&rerenderHoldSafe&&mapTransitionStops;
          if(!allPass)failure('REQ-001/021 assertion false');

          action=originalAction;
          Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
          marker({visible,visualContract,deadZone,rightActive,movedRight,upActive,releasedHidden,stoppedAfterRelease,fallbackCleared,tapAction,dialogPadHidden,dialogDragBlocked,dialogDragNoAction,dialogClose,dragNoAction,cancelNoAction,singleFire,uiExcluded,blurStops,rerenderHoldSafe,mapTransitionStops});
        },280);
      },170);
    },300);
  }catch(err){
    console.error('lqFloatingTouchSmokeFailure',err);
    failure(err&&err.message);
    action=originalAction;
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
    marker({visible,visualContract,deadZone,rightActive,movedRight,upActive,releasedHidden,stoppedAfterRelease,fallbackCleared,tapAction,dialogPadHidden,dialogDragBlocked,dialogDragNoAction,dialogClose,dragNoAction,cancelNoAction,singleFire,uiExcluded,blurStops,rerenderHoldSafe,mapTransitionStops,error:true});
  }
},350);
})();
