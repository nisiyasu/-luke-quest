(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_STATUS_AILMENT_STATUS?.poison;
 let marker=document.getElementById('lqPoisonSaveSanitizationSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqPoisonSaveSanitizationSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const should=status?.shouldSanitizePoison;
 const cleanup=status?.cleanup||{};
 const data={
  status:!!status,
  battleOnly:status?.battleOnly===true,
  defeatCleanup:cleanup.defeat===true,
  nonBattleSaveCleanup:cleanup.nonBattleSave===true,
  nonBattleLoadCleanup:cleanup.nonBattleLoad===true,
  worldSanitized:typeof should==='function'&&should('world')===true,
  titleSanitized:typeof should==='function'&&should('title')===true,
  battlePreserved:typeof should==='function'&&should('battle')===false
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ044_POISON_SAVE_SANITIZATION_FAIL_${key}()`);},0);}
},320);
})();
