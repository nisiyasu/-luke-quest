(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_DEFEAT_STATE_CLEANUP_STATUS;
 let marker=document.getElementById('lqDefeatEnemyStateCleanupSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqDefeatEnemyStateCleanupSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const isRecovery=status?.isCanonicalDefeatRecovery;
 const should=status?.shouldSanitizeEnemyState;
 const recovery={screen:'world',map:'town',hp:51,mh:51,dialog:{name:'宿屋の主人'}};
 const battle={screen:'battle',map:'forest',hp:30,mh:51,dialog:null};
 const fields=Array.isArray(status?.fields)?status.fields:[];
 const data={
  status:!!status,
  canonicalOwner:status?.canonicalRecoveryOwner==='index.html enemyTurn()',
  enemyField:fields.includes('enemy'),
  ehpField:fields.includes('ehp'),
  persisted:status?.persistsCleanState===true,
  battlePreserved:status?.ordinaryBattlePreserved===true,
  nonBattleSave:status?.nonBattleSaveSanitization===true,
  nonBattleLoad:status?.nonBattleLoadSanitization===true,
  worldSanitized:typeof should==='function'&&should('world')===true,
  titleSanitized:typeof should==='function'&&should('title')===true,
  battleNotSanitized:typeof should==='function'&&should('battle')===false,
  detectsRecovery:typeof isRecovery==='function'&&isRecovery('battle',recovery)===true,
  ignoresBattleContinuation:typeof isRecovery==='function'&&isRecovery('battle',battle)===false,
  ignoresWorldState:typeof isRecovery==='function'&&isRecovery('world',recovery)===false
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ046_DEFEAT_STATE_CLEANUP_FAIL_${key}()`);},0);}
},360);
})();
