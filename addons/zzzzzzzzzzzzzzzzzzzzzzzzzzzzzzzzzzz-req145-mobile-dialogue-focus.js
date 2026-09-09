(() => {
'use strict';

/* REQ-145 mobile dialogue focus.
   Presentation-only Gold challenger. It does not own input, action(), save,
   story, battle, movement, progression, or dialogue advancement authority. */

const STYLE_ID='lq-req145-mobile-dialogue-focus-style';

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
@media (max-width:430px) and (orientation:portrait){
  body.lqReq145GoldSlice.lqWorldFullscreen .dialogBox{
    left:calc(env(safe-area-inset-left,0px) + 8px)!important;
    right:calc(env(safe-area-inset-right,0px) + 8px)!important;
    bottom:calc(env(safe-area-inset-bottom,0px) + 8px)!important;
    max-height:min(34dvh,268px)!important;
    overflow-x:hidden!important;
    overflow-y:auto!important;
    overscroll-behavior:contain;
    -webkit-overflow-scrolling:touch;
    padding:10px 12px 9px!important;
    scrollbar-width:thin;
  }
  body.lqReq145GoldSlice.lqWorldFullscreen .dialogBox .speaker{
    margin-bottom:5px!important;
    font-size:12px!important;
  }
  body.lqReq145GoldSlice.lqWorldFullscreen .dialogBox .dialog{
    font-size:14px!important;
    line-height:1.52!important;
    letter-spacing:.005em;
  }
  body.lqReq145GoldSlice.lqWorldFullscreen .dialogBox .sub{
    margin-top:4px!important;
    font-size:9px!important;
    line-height:1.35!important;
  }
  body.lqReq145GoldSlice.lqWorldDialogueOpen .lqWorldStatusOverlay,
  body.lqReq145GoldSlice.lqWorldDialogueOpen .hud,
  body.lqReq145GoldSlice.lqWorldDialogueOpen .questGuide{
    opacity:.20!important;
  }
}
@supports not (height:1dvh){
  @media (max-width:430px) and (orientation:portrait){
    body.lqReq145GoldSlice.lqWorldFullscreen .dialogBox{max-height:min(34vh,268px)!important;}
  }
}
`;
  document.head.appendChild(style);
}

function smoke(){
  const body=document.body;
  const classes=['lqReq145GoldSlice','lqWorldFullscreen','lqWorldDialogueOpen'];
  const previous=classes.map(name=>body.classList.contains(name));
  classes.forEach(name=>body.classList.add(name));

  let shell=document.querySelector('.gameShell');
  let syntheticShell=false;
  if(!shell){
    shell=document.createElement('div');
    shell.className='gameShell';
    shell.style.cssText='position:relative;width:100%;height:100dvh;min-height:100dvh;overflow:hidden;';
    body.appendChild(shell);
    syntheticShell=true;
  }

  const probe=document.createElement('div');
  probe.className='dialogBox';
  probe.style.position='absolute';
  const speaker=document.createElement('div');
  speaker.className='speaker';
  speaker.textContent='PROBE';
  const dialog=document.createElement('div');
  dialog.className='dialog';
  dialog.textContent='Gold mobile dialogue focus probe. '.repeat(18);
  const sub=document.createElement('div');
  sub.className='sub';
  sub.textContent='tap';
  probe.append(speaker,dialog,sub);
  shell.appendChild(probe);

  requestAnimationFrame(()=>{
    const cs=getComputedStyle(probe);
    const rect=probe.getBoundingClientRect();
    const shellRect=shell.getBoundingClientRect();
    const marker=document.createElement('i');
    marker.id='lqReq145MobileDialogueFocusSmokeMarker';
    marker.hidden=true;
    marker.dataset.dialogPresent='true';
    marker.dataset.bottomAnchored=String(rect.bottom<=shellRect.bottom+2&&rect.bottom>=shellRect.bottom-90);
    marker.dataset.compactHeight=String(rect.height<=Math.min(innerHeight*.36,285));
    marker.dataset.scrollable=String(cs.overflowY==='auto'||cs.overflowY==='scroll');
    marker.dataset.worldViewportPreserved=String(rect.height<innerHeight*.40);
    marker.dataset.inputAuthority='false';
    marker.dataset.saveAuthority='false';
    marker.dataset.storyAuthority='false';
    marker.dataset.battleAuthority='false';
    marker.dataset.syntheticShell=String(syntheticShell);
    document.body.appendChild(marker);
    probe.remove();
    if(syntheticShell)shell.remove();
    classes.forEach((name,index)=>body.classList.toggle(name,previous[index]));
  });
}

installStyle();
window.LQ_REQ145_MOBILE_DIALOGUE_FOCUS_TEST={installStyle};
if(new URLSearchParams(location.search).has('lqReq145MobileDialogueFocusSmoke'))setTimeout(smoke,0);
})();
