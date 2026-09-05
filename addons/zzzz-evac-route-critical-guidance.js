(() => {
'use strict';

/* REQ-023 — real-play navigation fix for the north evacuation route.
   Guidance-only. The canonical withdrawProofSeen flag, NPC action semantics,
   collision, gates, coordinates and story text are untouched. */

const STYLE_ID='lq-evac-critical-guidance-style';
const REQUIRED_X=6,REQUIRED_Y=17;
const NORTH_X=14,NORTH_Y=0;

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
.lqCriticalClueMark,.lqNextExitMark{position:absolute;z-index:18;pointer-events:none;display:flex;align-items:center;justify-content:center;transform:translate(-1px,-9px)}
.lqCriticalClueMark{width:50px;height:50px;border:2px solid #ffe66d;border-radius:50%;box-shadow:0 0 0 3px #ffe66d28,0 0 18px #ffe66db5;animation:lqCriticalGuidePulse .85s ease-in-out infinite alternate}
.lqCriticalClueMark:before{content:'!';position:absolute;right:-5px;top:-12px;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#ffe66d;color:#2a1d00;font-size:15px;font-weight:1000;border:2px solid #fff7bd;box-shadow:0 3px 8px #0008}
.lqNextExitMark{width:70px;height:34px;border-radius:10px;background:#07111fd9;border:2px solid #ffe66d;color:#ffe66d;font-size:11px;font-weight:950;box-shadow:0 0 16px #ffe66d8c;animation:lqCriticalGuidePulse 1s ease-in-out infinite alternate}
.lqEvacObjective strong{color:#fff3a6}
@keyframes lqCriticalGuidePulse{from{filter:brightness(.9);transform:translate(-1px,-9px) scale(.96)}to{filter:brightness(1.2);transform:translate(-1px,-9px) scale(1.06)}}
@media(prefers-reduced-motion:reduce){.lqCriticalClueMark,.lqNextExitMark{animation:none}}
`;
  document.head.appendChild(style);
}

function objectiveText(){
  return s.flags.withdrawProofSeen
    ? '撤収命令を確認した。<strong>北端へ戻り、崖道へ進む</strong>'
    : '<strong>左下側</strong>に残された「撤収命令の切れ端」を探して調べる';
}

function addWorldMarker(){
  if(typeof s==='undefined'||s.screen!=='world'||s.map!=='evacRoute')return;
  const shell=document.querySelector('.gameShell');
  const worldEl=shell&&shell.querySelector('.world');
  if(!shell||!worldEl)return;

  const guide=shell.querySelector('.questGuide');
  if(guide){
    guide.classList.add('lqEvacObjective');
    guide.innerHTML='<b>目的：</b>'+objectiveText();
  }

  worldEl.querySelectorAll('.lqCriticalClueMark,.lqNextExitMark').forEach(el=>el.remove());
  const marker=document.createElement('div');
  if(!s.flags.withdrawProofSeen){
    marker.className='lqCriticalClueMark';
    marker.setAttribute('aria-hidden','true');
    marker.style.left=(REQUIRED_X*TS+1)+'px';
    marker.style.top=(REQUIRED_Y*TS+1)+'px';
    marker.dataset.target='withdrawProof';
  }else{
    marker.className='lqNextExitMark';
    marker.setAttribute('aria-hidden','true');
    marker.textContent='北端へ ↑';
    marker.style.left=(NORTH_X*TS-10)+'px';
    marker.style.top=(NORTH_Y*TS+7)+'px';
    marker.dataset.target='northExit';
  }
  worldEl.appendChild(marker);

  if(typeof location!=='undefined'&&new URLSearchParams(location.search).has('lqTouchSmoke')){
    let probe=document.getElementById('lqEvacGuidanceRuntimeMarker');
    if(!probe){probe=document.createElement('i');probe.id='lqEvacGuidanceRuntimeMarker';probe.hidden=true;document.body.appendChild(probe);}
    probe.dataset.map=s.map;
    probe.dataset.phase=s.flags.withdrawProofSeen?'northExit':'withdrawProof';
    probe.dataset.objectiveConcrete=String(guide?guide.textContent.includes(s.flags.withdrawProofSeen?'北端':'撤収命令'):false);
    probe.dataset.markerVisible=String(!!worldEl.querySelector(s.flags.withdrawProofSeen?'.lqNextExitMark':'.lqCriticalClueMark'));
  }
}

injectStyle();
if(typeof world==='function'){
  const beforeEvacGuidanceWorld=world;
  world=function(){
    const result=beforeEvacGuidanceWorld();
    addWorldMarker();
    return result;
  };
}

window.LQ_EVAC_ROUTE_GUIDANCE_STATUS={version:'1.0',requiredFlag:'withdrawProofSeen',requiredTarget:{x:REQUIRED_X,y:REQUIRED_Y},northExit:{x:NORTH_X,y:NORTH_Y},gameplayLogicChanged:false};
})();
