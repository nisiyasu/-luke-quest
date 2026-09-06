(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_CRITICAL_STATUS;
 let marker=document.getElementById('lqCriticalFinalBlowFeedbackSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqCriticalFinalBlowFeedbackSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const p=status?.presentation||{};
 const preview=status?.smokePreview;
 const cleanup=status?.smokeCleanup;
 cleanup?.();
 const beforeScreen=s.screen;
 const first=typeof preview==='function'?preview():null;
 const firstCount=status?.activeFlashLayers;
 const pointerSafe=!!first&&getComputedStyle(first).pointerEvents==='none';
 const second=typeof preview==='function'?preview():null;
 const secondCount=status?.activeFlashLayers;
 const data={
  status:!!status,
  rate:status?.normalAttackRate===0.1,
  bonus:status?.temporaryAtkBonus===5,
  saveSafe:status?.saveSafe===true,
  preservesDelta:status?.preservesCanonicalAtkDelta===true,
  finalBlowSafe:p.finalBlowSafe===true,
  battleDomIndependent:p.battleDomIndependent===true,
  pointerSafe:p.pointerSafe===true&&pointerSafe,
  nonStacking:p.nonStacking===true&&firstCount===1&&secondCount===1,
  reducedMotion:p.reducedMotion===true,
  screenIndependent:!!first&&!!second&&s.screen===beforeScreen
 };
 cleanup?.();
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ047_CRITICAL_FINAL_BLOW_FEEDBACK_FAIL_${key}()`);},0);}
},390);
})();
