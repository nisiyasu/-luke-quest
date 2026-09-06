(() => {
'use strict';

/* REQ-094 — presentation-only local guidance for REQ-093 windcutPass.
   No story/save/encounter/collision authority is changed. */
const WIND='windcutPass';
const FOOT_KIND='lqWindcutFootprints';
const BOUNDARY_KIND='lqWindcutBoundary';
const FOOT={x:7,y:16};
const BOUNDARY={x:10,y:1};
const STYLE_ID='lq-windcut-guidance-style';
let footprintsObserved=false;

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
.lqWindcutGuideFallback{position:absolute;left:10px;right:10px;top:48px;z-index:22;pointer-events:none;background:#07111fdd;border:1px solid #bfe8ff88;border-radius:10px;padding:7px 9px;font-size:12px;font-weight:900;box-shadow:0 5px 14px #0008}.lqWindcutGuideFallback strong,.lqWindcutObjective strong{color:#d8f3ff}
.lqWindcutQuestMark{position:absolute;z-index:18;pointer-events:none;display:flex;align-items:center;justify-content:center;color:#dcf6ff;border:2px solid #bfeaff;background:#07111fba;box-shadow:0 0 15px #9bdfff66;animation:lqWindcutGuidePulse 1s ease-in-out infinite alternate}
.lqWindcutQuestMark[data-target="footprints"]{width:48px;height:48px;border-radius:50%;transform:translate(0,-5px)}
.lqWindcutQuestMark[data-target="footprints"]:after{content:'!';font-size:19px;font-weight:1000}
.lqWindcutQuestMark[data-target="northBoundary"]{width:78px;height:30px;border-radius:9px;transform:translate(-15px,4px);font-size:11px;font-weight:950}
@keyframes lqWindcutGuidePulse{from{filter:brightness(.9);opacity:.62}to{filter:brightness(1.2);opacity:.92}}
@media(prefers-reduced-motion:reduce){.lqWindcutQuestMark{animation:none}}
`;
  document.head.appendChild(style);
}

function objectiveText(){
  return footprintsObserved
    ? '靴跡はさらに北へ続く。<strong>北側の「北へ続く尾根道」</strong>を確認する'
    : '<strong>岩陰に残る靴跡</strong>を調べ、追跡方向を確かめる';
}

function cleanupOutsideWindcut(){
  document.querySelectorAll('.lqWindcutGuideFallback,.lqWindcutQuestMark').forEach(el=>el.remove());
}

function decorateGuidance(){
  if(typeof s==='undefined'||s.screen!=='world'||s.map!==WIND){cleanupOutsideWindcut();return;}
  const shell=document.querySelector('.gameShell');
  const worldEl=shell&&shell.querySelector('.world');
  if(!shell||!worldEl)return;

  let guide=shell.querySelector('.questGuide');
  if(guide){
    guide.classList.add('lqWindcutObjective');
    guide.innerHTML='<b>目的：</b>'+objectiveText();
    shell.querySelectorAll('.lqWindcutGuideFallback').forEach(el=>el.remove());
  }else{
    guide=shell.querySelector('.lqWindcutGuideFallback');
    if(!guide){guide=document.createElement('div');guide.className='lqWindcutGuideFallback';shell.appendChild(guide);}
    guide.innerHTML='<b>目的：</b>'+objectiveText();
  }

  worldEl.querySelectorAll('.lqWindcutQuestMark').forEach(el=>el.remove());
  const marker=document.createElement('div');
  marker.className='lqWindcutQuestMark';
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
  if(typeof s==='undefined'||s.screen!=='world'||s.map!==WIND||s.dialog)return false;
  const p=front();
  return !!MAPS[WIND]?.npcs?.find(n=>n.x===p.x&&n.y===p.y&&n.kind===kind);
}

injectStyle();

const beforeWindcutGuidanceAction=action;
action=function(){
  const observedFootprints=facingKind(FOOT_KIND);
  const result=beforeWindcutGuidanceAction();
  if(observedFootprints){footprintsObserved=true;decorateGuidance();}
  return result;
};

const beforeWindcutGuidanceWorld=world;
world=function(){const result=beforeWindcutGuidanceWorld();decorateGuidance();return result;};
const beforeWindcutGuidanceRender=render;
render=function(){const result=beforeWindcutGuidanceRender();decorateGuidance();return result;};

window.LQ_WINDCUT_GUIDANCE_STATUS={
  version:'1.0',map:WIND,footprints:{kind:FOOT_KIND,...FOOT},boundary:{kind:BOUNDARY_KIND,...BOUNDARY},
  phase:()=>footprintsObserved?'northBoundary':'footprints',runtimeOnly:true,saveSemanticsChanged:false,gameplayLogicChanged:false,iosPhysicalVerification:'PENDING'
};
})();
