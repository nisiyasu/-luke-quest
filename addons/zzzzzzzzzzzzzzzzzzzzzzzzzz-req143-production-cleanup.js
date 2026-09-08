(() => {
'use strict';

/* REQ-143 production cleanup.
   The Gold Standard implementation may expose internal beat metadata for tests/accessibility,
   but developer-facing quality labels must never appear in the player-visible scene. */
const STYLE_ID='lq-req143-production-cleanup-style';
function install(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');
  st.id=STYLE_ID;
  st.textContent='.lq143QualityMark,.lq143Beat{display:none!important}';
  document.head.appendChild(st);
}
function clean(){
  install();
  document.querySelectorAll('.lq143QualityMark,.lq143Beat').forEach(n=>n.setAttribute('aria-hidden','true'));
  if(typeof s!=='undefined'&&s?.screen==='req128Chapter1Climax'){
    const scene=document.querySelector('.lq128Scene');
    if(scene)scene.dataset.lq143ProductionClean='true';
  }
}
install();
if(typeof render==='function'){
  const baseRender=render;
  render=function(){const out=baseRender.apply(this,arguments);clean();return out;};
}
queueMicrotask(clean);
window.LQ_REQ143_PRODUCTION_CLEANUP_STATUS={
  requirement:'REQ-143',
  developerLabelsHidden:true,
  canonicalLogicChanged:false,
  inputAuthorityChanged:false,
  ownerExperiencePass:'PENDING'
};
})();
