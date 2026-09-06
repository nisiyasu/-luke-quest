(() => {
'use strict';

/* REQ-037 — presentation-only visual feedback for successful world map changes. */
const ID='lq-map-transition-fade';
const STYLE='lq-map-transition-fade-style';
let cleanupTimer=0;
let transitionCount=0;

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

window.addEventListener('pagehide',removeLayer,{passive:true});
window.LQ_MAP_TRANSITION_FADE_STATUS={
  version:'1.0.0',
  presentationOnly:true,
  pointerEvents:'none',
  reducedMotion:true,
  cleanupFallbackMs:700,
  existingTransitionSfxOwnership:'ux-v139.js',
  get activeLayers(){return document.querySelectorAll(`#${ID}`).length;},
  get transitions(){return transitionCount;}
};
})();