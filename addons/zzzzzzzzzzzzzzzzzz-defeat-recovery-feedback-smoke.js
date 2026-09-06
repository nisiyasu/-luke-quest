(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_DEFEAT_RECOVERY_FEEDBACK_STATUS;
 let marker=document.getElementById('lqDefeatRecoveryRuntimeSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqDefeatRecoveryRuntimeSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const before=status?.presentations||0;
 status?.smokePreview?.();
 status?.smokePreview?.();
 const layer=document.getElementById('lq-defeat-recovery-feedback');
 const cs=layer&&getComputedStyle(layer);
 const canonical=status?.canonicalRecovery||{};
 const data={
   status:!!status,
   presentationOnly:status?.presentationOnly===true,
   canonicalOwner:status?.canonicalRecoveryOwner==='index.html enemyTurn()',
   canonicalRecovery:canonical.hp==='max'&&canonical.screen==='world'&&canonical.map==='town'&&canonical.x===9&&canonical.y===12&&canonical.encounterGrace===3,
   twoPresentations:(status?.presentations||0)===before+2,
   oneLayer:status?.activeLayers===1,
   pointerSafe:!!layer&&cs?.pointerEvents==='none',
   fixedViewport:!!layer&&cs?.position==='fixed'&&cs?.top==='0px'&&cs?.left==='0px',
   reducedMotion:status?.reducedMotion===true,
   cleanupFallback:status?.cleanupFallbackMs===1480
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 status?.smokeCleanup?.();
 marker.dataset.cleaned=String(status?.activeLayers===0);
 const failed=Object.entries({...data,cleaned:status?.activeLayers===0}).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ038_DEFEAT_FEEDBACK_FAIL_${key}()`);},0);}
},150);
})();