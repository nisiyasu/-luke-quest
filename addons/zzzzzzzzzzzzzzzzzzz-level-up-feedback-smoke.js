(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_LEVEL_UP_FEEDBACK_STATUS;
 let marker=document.getElementById('lqLevelUpFeedbackRuntimeSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqLevelUpFeedbackRuntimeSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const before=status?.presentations||0;
 status?.smokePreview?.();
 status?.smokePreview?.();
 const layer=document.getElementById('lq-level-up-feedback');
 const cs=layer&&getComputedStyle(layer);
 const text=layer?.textContent||'';
 const data={
   status:!!status,
   presentationOnly:status?.presentationOnly===true,
   canonicalOwner:status?.canonicalProgressionOwner==='index.html win() + canonical progression wrappers',
   actualDelta:status?.actualDeltaRendering===true,
   deferredIntegratedSnapshot:status?.deferredIntegratedSnapshot===true,
   includesMpDelta:status?.includesMpDeltaWhenPresent===true,
   twoPresentations:(status?.presentations||0)===before+2,
   oneLayer:status?.activeLayers===1,
   pointerSafe:!!layer&&cs?.pointerEvents==='none',
   fixedViewport:!!layer&&cs?.position==='fixed'&&cs?.top==='0px'&&cs?.left==='0px',
   visibleDelta:text.includes('LV 2')&&text.includes('最大HP')&&text.includes('+9')&&text.includes('ATK')&&text.includes('+3')&&text.includes('最大MP')&&text.includes('+2'),
   reducedMotion:status?.reducedMotion===true,
   cleanupFallback:status?.cleanupFallbackMs===1740
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 status?.smokeCleanup?.();
 marker.dataset.cleaned=String(status?.activeLayers===0);
 const failed=Object.entries({...data,cleaned:status?.activeLayers===0}).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ039_LEVEL_UP_FAIL_${key}()`);},0);}
},180);
})();