(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
  const status=window.LQ_MAP_TRANSITION_FADE_STATUS;
  let marker=document.getElementById('lqMapTransitionFadeRuntimeSmokeMarker');
  if(!marker){marker=document.createElement('i');marker.id='lqMapTransitionFadeRuntimeSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
  const firstCount=status?.transitions||0;
  const firstLifecycleCount=status?.lifecycleCleanups||0;
  status?.smokePreview?.('town','field');
  status?.smokePreview?.('field','forestEntrance');
  const layer=document.getElementById('lq-map-transition-fade');
  const cs=layer&&getComputedStyle(layer);
  const beforeLifecycleLayers=status?.activeLayers||0;
  status?.smokeLifecycleCleanup?.();
  const lifecycleCleared=beforeLifecycleLayers===1&&status?.activeLayers===0&&(status?.lifecycleCleanups||0)===firstLifecycleCount+1;
  status?.smokePreview?.('forestEntrance','town');
  window.dispatchEvent(new Event('pageshow'));
  const pageshowCleared=status?.activeLayers===0;
  const data={
    status:!!status,
    version:status?.version==='1.1.0',
    presentationOnly:status?.presentationOnly===true,
    reducedMotion:status?.reducedMotion===true,
    sfxOwnershipPreserved:status?.existingTransitionSfxOwnership==='ux-v139.js',
    lifecycleCleanup:status?.lifecycleCleanup===true,
    lifecycleEvents:Array.isArray(status?.lifecycleEvents)&&['pagehide','pageshow','visibilitychange','freeze'].every(v=>status.lifecycleEvents.includes(v)),
    oneLayer:beforeLifecycleLayers===1,
    transitionsAdvanced:(status?.transitions||0)===firstCount+3,
    pointerSafe:!!layer&&cs?.pointerEvents==='none',
    fixedViewport:!!layer&&cs?.position==='fixed'&&cs?.top==='0px'&&cs?.left==='0px',
    cleanupFallback:status?.cleanupFallbackMs===700,
    lifecycleCleared,
    pageshowCleared
  };
  Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
  status?.smokeCleanup?.();
  marker.dataset.cleaned=String(status?.activeLayers===0);
  const failed=Object.entries({...data,cleaned:status?.activeLayers===0}).find(([,v])=>!v);
  if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ037_TRANSITION_FAIL_${key}()`);},0);}
},120);
})();