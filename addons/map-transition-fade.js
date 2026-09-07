(() => {
'use strict';

/* REQ-037 — presentation-only visual feedback for successful world map changes.
 * REQ-127 hardening: a transient full-viewport fade must never survive an iOS PWA
 * lifecycle suspension/resume. iOS may freeze timers/animations while the page is
 * backgrounded, so cleanup cannot depend only on animationend/setTimeout.
 */
const ID='lq-map-transition-fade';
const STYLE='lq-map-transition-fade-style';
let cleanupTimer=0;
let transitionCount=0;
let lifecycleCleanupCount=0;

function injectStyle(){
  if(document.getElementById(STYLE))return;
  const st=document.createElement('style');
  st.id=STYLE;
  st.textContent=`
#${ID}{position:fixed;inset:0;z-index:105;pointer-events:none;background:#07111f;opacity:0;animation:lqMapTransitionFade .34s ease-out both;will-change:opacity}
@keyframes lqMapTransitionFade{0%{opacity:.82}36%{opacity:.48}100%{opacity:0}}
@media(prefers-reduced-motion:reduce){#${ID}{animation-duration:.08s!important;opacity:0!important}}
`;
  document.head.appendChild(st);
}

function removeLayer(){
  clearTimeout(cleanupTimer);cleanupTimer=0;
  document.getElementById(ID)?.remove();
}

function lifecycleCleanup(){
  const hadLayer=!!document.getElementById(ID);
  removeLayer();
  if(hadLayer)lifecycleCleanupCount++;
}

function flash(fromMap,toMap){
  injectStyle();
  removeLayer();
  const layer=document.createElement('div');
  layer.id=ID;
  layer.setAttribute('aria-hidden','true');
  layer.dataset.from=String(fromMap||'');
  layer.dataset.to=String(toMap||'');
  layer.dataset.transition=String(++transitionCount);
  document.body.appendChild(layer);
  const cleanup=()=>{if(layer.isConnected)layer.remove();};
  layer.addEventListener('animationend',cleanup,{once:true});
  cleanupTimer=setTimeout(cleanup,700);
}

if(typeof checkGate==='function'){
  const beforeTransitionFade=checkGate;
  checkGate=function(){
    const beforeMap=typeof s!=='undefined'&&s?s.map:undefined;
    const result=beforeTransitionFade.apply(this,arguments);
    const afterMap=typeof s!=='undefined'&&s?s.map:undefined;
    if(typeof s!=='undefined'&&s&&s.screen==='world'&&beforeMap!==undefined&&afterMap!==beforeMap)flash(beforeMap,afterMap);
    return result;
  };
}

// Do not rely on animationend/timers across iOS PWA suspension. A fade is purely
// decorative, so dropping it on every lifecycle boundary is always safer than
// allowing a stale opaque composited layer to cover a resumed world.
window.addEventListener('pagehide',lifecycleCleanup,{passive:true});
window.addEventListener('pageshow',lifecycleCleanup,{passive:true});
document.addEventListener('visibilitychange',lifecycleCleanup,{passive:true});
document.addEventListener('freeze',lifecycleCleanup,{passive:true});

const smokeMode=typeof location!=='undefined'&&new URLSearchParams(location.search).has('lqTouchSmoke');
window.LQ_MAP_TRANSITION_FADE_STATUS={
  version:'1.1.0',
  presentationOnly:true,
  pointerEvents:'none',
  reducedMotion:true,
  cleanupFallbackMs:700,
  lifecycleCleanup:true,
  lifecycleEvents:['pagehide','pageshow','visibilitychange','freeze'],
  existingTransitionSfxOwnership:'ux-v139.js',
  smokePreview:smokeMode?flash:undefined,
  smokeCleanup:smokeMode?removeLayer:undefined,
  smokeLifecycleCleanup:smokeMode?lifecycleCleanup:undefined,
  get activeLayers(){return document.querySelectorAll(`#${ID}`).length;},
  get transitions(){return transitionCount;},
  get lifecycleCleanups(){return lifecycleCleanupCount;}
};
})();