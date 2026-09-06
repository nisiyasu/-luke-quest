(() => {
'use strict';

/* REQ-119 Checkpoint C — canonical lightweight regional ambient authority.
   Presentation-only, pointer-transparent, map-aware, reduced-motion safe and
   visibility-aware. No second ambient authority is created. */

const STYLE_ID='lq-world-ambient-style';
let style=document.getElementById(STYLE_ID);
if(!style){
  style=document.createElement('style');style.id=STYLE_ID;style.textContent=`
.lqAmbientLayer{position:absolute;inset:0;z-index:6;overflow:hidden;pointer-events:none;border-radius:inherit;contain:paint}.lqAmbientLayer span{position:absolute;display:block;opacity:.30;will-change:transform,opacity;pointer-events:none}.lqAmbientLayer.motes span{width:3px;height:3px;border-radius:50%;background:#fff4b0;box-shadow:0 0 6px #ffe88b;animation:lqMote 6.6s linear infinite}.lqAmbientLayer.leaves span{width:6px;height:3px;border-radius:80% 15% 80% 15%;background:#90ad5e;animation:lqLeaf 7.4s linear infinite}.lqAmbientLayer.fog span{width:42%;height:18px;border-radius:50%;background:linear-gradient(90deg,transparent,#d9eef32b,transparent);filter:blur(3px);animation:lqFog 9s ease-in-out infinite}.lqAmbientLayer.embers span{width:3px;height:5px;border-radius:50% 50% 30% 30%;background:#ffb05c;box-shadow:0 0 5px #ff7733;animation:lqEmber 5.2s ease-out infinite}
@keyframes lqMote{0%{transform:translate3d(0,10px,0);opacity:0}22%{opacity:.30}100%{transform:translate3d(16px,-88px,0);opacity:0}}@keyframes lqLeaf{0%{transform:translate3d(-12px,-18px,0) rotate(0);opacity:0}15%{opacity:.34}100%{transform:translate3d(104px,135px,0) rotate(340deg);opacity:0}}@keyframes lqFog{0%,100%{transform:translateX(-10%);opacity:.11}50%{transform:translateX(85%);opacity:.23}}@keyframes lqEmber{0%{transform:translateY(10px) scale(.8);opacity:0}20%{opacity:.36}100%{transform:translateY(-104px) translateX(10px) scale(.3);opacity:0}}
body.lqAmbientPaused .lqAmbientLayer span{animation-play-state:paused!important;will-change:auto!important}
body.lqAmbientDialogue .lqAmbientLayer{opacity:.62;transition:opacity .16s ease}
@media (prefers-reduced-motion:reduce){.lqAmbientLayer span{animation:none!important;opacity:.09!important;will-change:auto!important}}
@media (max-width:430px),(pointer:coarse){.lqAmbientLayer span:nth-child(n+6){display:none}.lqAmbientLayer.fog span:nth-child(n+4){display:none}}
`;document.head.appendChild(style);
}

const TYPE={town:'motes',openingAldia:'motes',field:'motes',forest:'leaves',deepForest:'leaves',mistTrail:'fog',observation:'embers',evacRoute:'fog',cliffRoad:'fog',northCliffRoad:'fog',windcutPass:'fog',northRidgeApproach:'fog',windShelf:'fog',skylineTraverse:'fog',cloudbreakSaddle:'fog',windStairRidge:'fog'};
let lastMap=null;
let lastKind=null;

function removeLayer(){
  const layer=document.querySelector('.gameShell .lqAmbientLayer');
  if(layer)layer.remove();
  lastMap=null;lastKind=null;
}
function setPaused(force){
  document.body.classList.toggle('lqAmbientPaused',Boolean(force));
}
function syncVisibility(){setPaused(document.hidden);}
function syncDialogue(){document.body.classList.toggle('lqAmbientDialogue',Boolean(s?.screen==='world'&&s?.dialog));}

function build(){
  syncDialogue();
  if(typeof s==='undefined'||s.screen!=='world'){removeLayer();return;}
  const shell=app.querySelector('.gameShell');if(!shell){removeLayer();return;}
  const kind=TYPE[s.map];
  let layer=shell.querySelector('.lqAmbientLayer');
  if(!kind){if(layer)layer.remove();lastMap=s.map;lastKind=null;return;}
  if(layer&&lastMap===s.map&&lastKind===kind)return;
  if(layer)layer.remove();
  layer=document.createElement('div');layer.className=`lqAmbientLayer ${kind}`;layer.setAttribute('aria-hidden','true');
  const coarse=matchMedia?.('(pointer:coarse)')?.matches===true;
  const count=kind==='fog'?(coarse?3:4):(coarse?5:7);
  for(let i=0;i<count;i++){
    const p=document.createElement('span');p.style.left=`${8+(i*13)%82}%`;p.style.top=`${12+(i*17)%74}%`;p.style.animationDelay=`-${(i*0.73).toFixed(2)}s`;p.style.animationDuration=`${(5.4+(i%3)*1.15).toFixed(1)}s`;layer.appendChild(p);
  }
  shell.appendChild(layer);lastMap=s.map;lastKind=kind;syncVisibility();syncDialogue();
}

const renderBase=render;render=function(){const r=renderBase.apply(this,arguments);build();return r;};
document.addEventListener('visibilitychange',syncVisibility,{passive:true});
window.addEventListener('pagehide',()=>setPaused(true),{passive:true});
window.addEventListener('pageshow',()=>{syncVisibility();build();},{passive:true});

window.LQ_WORLD_AMBIENT_STATUS={regional:true,nonInteractive:true,reducedMotion:true,visibilityAware:true,dialogueDimming:true,mobileParticleCap:true,canonicalAuthority:true,hasMap:(map)=>Object.prototype.hasOwnProperty.call(TYPE,map),typeFor:(map)=>TYPE[map]||null,windStairRidgeIntegrated:true,openingAldiaIntegrated:true};
window.LQ_REQ119_CHECKPOINT_C_STATUS={requirement:'REQ-119',checkpoint:'C',canonicalAmbientReused:true,mapAware:true,pointerTransparent:true,reducedMotion:true,visibilityPause:true,mobileCapped:true,saveMutation:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ119_CHECKPOINT_C_TEST={build,setPaused,removeLayer};
build();

function fail(reason){
  const el=document.createElement('i');el.className='lqReq119CheckpointCSmokeFailure';el.hidden=true;el.dataset.reason=String(reason);document.body.appendChild(el);
  throw new TypeError(`REQ-119 checkpoint C smoke failed: ${reason}`);
}
function assert(ok,reason){if(!ok)fail(reason);}
function smoke(){
  if(typeof s==='undefined'||typeof render!=='function')return;
  const before={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,dialog:s.dialog?{...s.dialog}:s.dialog,flags:{...(s.flags||{})}};
  try{
    const checks=[['town','motes'],['forest','leaves'],['mistTrail','fog']];
    for(const [map,kind] of checks){
      s.screen='world';s.map=map;s.dialog=null;s.x=9;s.y=12;s.dir='up';render();build();
      const layer=document.querySelector(`.gameShell .lqAmbientLayer.${kind}`);
      assert(layer,`${map} ${kind} layer`);
      assert(getComputedStyle(layer).pointerEvents==='none',`${map} pointer transparency`);
      assert(layer.children.length>=3&&layer.children.length<=7,`${map} restrained particle count`);
    }
    setPaused(true);assert(document.body.classList.contains('lqAmbientPaused'),'visibility pause class');setPaused(false);
    s.dialog={name:'TEST',text:'TEST'};render();assert(document.body.classList.contains('lqAmbientDialogue'),'dialogue attenuation');
    s.screen='title';s.dialog=null;render();assert(!document.querySelector('.gameShell .lqAmbientLayer'),'non-world cleanup');
    assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'Tap Anywhere authority preserved');
    const marker=document.createElement('i');marker.className='lqReq119CheckpointCSmokeMarker';marker.hidden=true;marker.dataset.town='motes';marker.dataset.forest='leaves';marker.dataset.mist='fog';marker.dataset.visibilityPause='true';marker.dataset.cleanup='true';marker.dataset.mobileCap='true';document.body.appendChild(marker);
  }finally{
    s.screen=before.screen;s.map=before.map;s.x=before.x;s.y=before.y;s.dir=before.dir;s.dialog=before.dialog;s.flags=before.flags;setPaused(false);render();
  }
}
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},3000);
})();
