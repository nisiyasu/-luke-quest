(() => {
'use strict';

/* REQ-083 — presentation-only local guidance for REQ-081 northCliffRoad.
   No story/save/encounter/collision authority is changed. */
const CLIFF='northCliffRoad';
const FOOT_KIND='lqNorthCliffFootprints';
const BOUNDARY_KIND='lqNorthCliffBoundary';
const FOOT={x:7,y:14};
const BOUNDARY={x:10,y:1};
const STYLE_ID='lq-north-cliff-guidance-style';
let footprintsObserved=false;

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
.lqNorthCliffGuideFallback{position:absolute;left:10px;right:10px;top:48px;z-index:22;pointer-events:none;background:#07111fdd;border:1px solid #ffe18a88;border-radius:10px;padding:7px 9px;font-size:12px;font-weight:900;box-shadow:0 5px 14px #0008}.lqNorthCliffGuideFallback strong,.lqNorthCliffObjective strong{color:#ffe69a}
.lqNorthCliffQuestMark{position:absolute;z-index:18;pointer-events:none;display:flex;align-items:center;justify-content:center;color:#ffe58a;border:2px solid #ffe58a;background:#07111fd5;box-shadow:0 0 16px #ffe58a80;animation:lqNorthCliffGuidePulse 1s ease-in-out infinite alternate}
.lqNorthCliffQuestMark[data-target="footprints"]{width:48px;height:48px;border-radius:50%;transform:translate(0,-5px)}
.lqNorthCliffQuestMark[data-target="footprints"]:after{content:'!';font-size:19px;font-weight:1000}
.lqNorthCliffQuestMark[data-target="northBoundary"]{width:78px;height:30px;border-radius:9px;transform:translate(-15px,4px);font-size:11px;font-weight:950}
@keyframes lqNorthCliffGuidePulse{from{filter:brightness(.9);opacity:.72}to{filter:brightness(1.2);opacity:1}}
@media(prefers-reduced-motion:reduce){.lqNorthCliffQuestMark{animation:none}}
`;
  document.head.appendChild(style);
}

function objectiveText(){
  return footprintsObserved
    ? '足跡は北へ続く。<strong>北側の「北へ曲がる崖道」</strong>を確認する'
    : '<strong>新しい足跡</strong>を調べ、レオンが向かった方向を確かめる';
}

function cleanupOutsideCliff(){
  document.querySelectorAll('.lqNorthCliffGuideFallback,.lqNorthCliffQuestMark').forEach(el=>el.remove());
}

function decorateGuidance(){
  if(typeof s==='undefined'||s.screen!=='world'||s.map!==CLIFF){cleanupOutsideCliff();return;}
  const shell=document.querySelector('.gameShell');
  const worldEl=shell&&shell.querySelector('.world');
  if(!shell||!worldEl)return;

  let guide=shell.querySelector('.questGuide');
  if(guide){
    guide.classList.add('lqNorthCliffObjective');
    guide.innerHTML='<b>目的：</b>'+objectiveText();
    shell.querySelectorAll('.lqNorthCliffGuideFallback').forEach(el=>el.remove());
  }else{
    guide=shell.querySelector('.lqNorthCliffGuideFallback');
    if(!guide){guide=document.createElement('div');guide.className='lqNorthCliffGuideFallback';shell.appendChild(guide);}
    guide.innerHTML='<b>目的：</b>'+objectiveText();
  }

  worldEl.querySelectorAll('.lqNorthCliffQuestMark').forEach(el=>el.remove());
  const marker=document.createElement('div');
  marker.className='lqNorthCliffQuestMark';
  marker.setAttribute('aria-hidden','true');
  if(!footprintsObserved){
    marker.dataset.target='footprints';
    marker.style.left=(FOOT.x*TS+1)+'px';
    marker.style.top=(FOOT.y*TS+1)+'px';
  }else{
    marker.dataset.target='northBoundary';
    marker.textContent='北へ ↑';
    marker.style.left=(BOUNDARY.x*TS)+'px';
    marker.style.top=(BOUNDARY.y*TS)+'px';
  }
  worldEl.appendChild(marker);
}

function facingKind(kind){
  if(typeof s==='undefined'||s.screen!=='world'||s.map!==CLIFF||s.dialog)return false;
  const p=front();
  return !!MAPS[CLIFF]?.npcs?.find(n=>n.x===p.x&&n.y===p.y&&n.kind===kind);
}

injectStyle();

const beforeNorthCliffGuidanceAction=action;
action=function(){
  const observedFootprints=facingKind(FOOT_KIND);
  const result=beforeNorthCliffGuidanceAction();
  if(observedFootprints){footprintsObserved=true;decorateGuidance();}
  return result;
};

const beforeNorthCliffGuidanceWorld=world;
world=function(){const result=beforeNorthCliffGuidanceWorld();decorateGuidance();return result;};
const beforeNorthCliffGuidanceRender=render;
render=function(){const result=beforeNorthCliffGuidanceRender();decorateGuidance();return result;};

window.LQ_NORTH_CLIFF_GUIDANCE_STATUS={
  version:'1.0',map:CLIFF,footprints:{kind:FOOT_KIND,...FOOT},boundary:{kind:BOUNDARY_KIND,...BOUNDARY},
  phase:()=>footprintsObserved?'northBoundary':'footprints',runtimeOnly:true,saveSemanticsChanged:false,gameplayLogicChanged:false,iosPhysicalVerification:'PENDING'
};
})();
