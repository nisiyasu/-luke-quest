(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_STATUS_AILMENT_STATUS?.poison;
 let marker=document.getElementById('lqPoisonDefeatCleanupSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqPoisonDefeatCleanupSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const ended=status?.battleEnded;
 const cleanup=status?.cleanup||{};
 const data={
  status:!!status,
  battleOnly:status?.battleOnly===true,
  victoryCleanup:cleanup.victory===true,
  escapeCleanup:cleanup.escape===true,
  smokeCleanup:cleanup.smokeEscape===true,
  defeatCleanup:cleanup.defeat===true,
  defeatTransition:typeof ended==='function'&&ended('battle','world')===true,
  battleContinues:typeof ended==='function'&&ended('battle','battle')===false,
  unrelatedTransition:typeof ended==='function'&&ended('world','world')===false
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ043_POISON_DEFEAT_CLEANUP_FAIL_${key}()`);},0);}
},300);
})();
