(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_ADVENTURE_RECORD_STATUS;
 let marker=document.getElementById('lqAdventureRecordAccuracySmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqAdventureRecordAccuracySmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const fakeSource={
  LQ_TREASURE_CHEST_STATUS:{saveFlags:['a','dup']},
  LQ_HIDDEN_FIND_STATUS:{flags:['b','dup']},
  LQ_ITEM_TREASURE_CACHE_STATUS:{flags:['c']}
 };
 const dynamic=status?.treasureFlagList?.(fakeSource)||[];
 const syntheticFlags={};
 [status?.legacyTreasureFlags?.[0],'a','b','c','dup'].filter(Boolean).forEach(k=>syntheticFlags[k]=true);
 const liveFlags=status?.treasureFlagList?.(window)||[];
 const data={
  status:!!status,
  presentationOnly:status?.presentationOnly===true,
  noProgressMutation:status?.noProgressMutation===true,
  legacyFive:Array.isArray(status?.legacyTreasureFlags)&&status.legacyTreasureFlags.length===5,
  optionalThree:Array.isArray(status?.optionalFlags)&&status.optionalFlags.length===3&&status.optionalTotal===3&&status.optionalFlags.includes('lqHerbSampleQuestDone'),
  dynamicDedupe:dynamic.length===9&&new Set(dynamic).size===dynamic.length&&dynamic.includes('a')&&dynamic.includes('b')&&dynamic.includes('c')&&dynamic.includes('dup'),
  countSynthetic:status?.openedTreasureCount?.(syntheticFlags,fakeSource)===5,
  optionalAll:status?.optionalDone?.({elderCharmComplete:true,forestBountyComplete:true,lqHerbSampleQuestDone:true})===3,
  optionalOne:status?.optionalDone?.({lqHerbSampleQuestDone:true})===1,
  liveDynamicSystems:liveFlags.includes('lqChestTownSupply')&&liveFlags.includes('lqFindTownFountainCoin')&&liveFlags.includes('lqItemCacheDeepHerbs'),
  liveUnique:new Set(liveFlags).size===liveFlags.length,
  categories:status?.battleWins===true&&status?.defeats===true&&status?.areas===true&&status?.treasures===true&&status?.optional===true
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ042_ADVENTURE_RECORD_FAIL_${key}()`);},0);}
},280);
})();
