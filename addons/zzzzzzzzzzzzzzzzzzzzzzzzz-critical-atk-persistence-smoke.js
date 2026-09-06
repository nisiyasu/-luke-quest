(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_CRITICAL_STATUS;
 let marker=document.getElementById('lqCriticalAtkPersistenceSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqCriticalAtkPersistenceSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const normalize=status?.canonicalAtkFromBoosted;
 const data={
  status:!!status,
  rate:status?.normalAttackRate===0.1,
  bonus:status?.temporaryAtkBonus===5,
  saveSafe:status?.saveSafe===true,
  preservesDelta:status?.preservesCanonicalAtkDelta===true,
  removesTemporaryBonus:typeof normalize==='function'&&normalize(12)===7,
  preservesLevelGain:typeof normalize==='function'&&normalize(15)===10
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ045_CRITICAL_ATK_PERSISTENCE_FAIL_${key}()`);},0);}
},340);
})();
