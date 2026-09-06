(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
  const status=window.LQ_MAP_TRANSITION_FADE_STATUS;
  let marker=document.getElementById('lqMapTransitionFadeRuntimeSmokeMarker');
  if(!marker){marker=document.createElement('i');marker.id='lqMapTransitionFadeRuntimeSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
  const firstCount=status?.transitions||0;
  status?.smokePreview?.('town','field');
  status?.smokePreview?.('field','forestEntrance');
  const layer=document.getElementById('lq-map-transition-fade');
  const cs=layer&&getComputedStyle(layer);
  const data={
    status:!!status,
    presentationOnly:status?.presentationOnly===true,
    reducedMotion:status?.reducedMotion===true,
    sfxOwnershipPreserved:status?.existingTransitionSfxOwnership==='ux-v139.js',
    oneLayer:status?.activeLayers===1,
    twoTransitions:(status?.transitions||0)===firstCount+2,
    pointerSafe:!!layer&&cs?.pointerEvents==='none',
    fixedViewport:!!layer&&cs?.position==='fixed'&&cs?.top==='0px'&&cs?.left==='0px',
    cleanupFallback:status?.cleanupFallbackMs===700
  };
  Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
  status?.smokeCleanup?.();
  marker.dataset.cleaned=String(status?.activeLayers===0);
  const failed=Object.entries({...data,cleaned:status?.activeLayers===0}).find(([,v])=>!v);
  if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ037_TRANSITION_FAIL_${key}()`);},0);}
},120);
})();