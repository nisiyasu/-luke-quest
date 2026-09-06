(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_AUTOSAVE_FEEDBACK_STATUS;
 let marker=document.getElementById('lqAutosavePulseProgressCoverageSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqAutosavePulseProgressCoverageSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const statuses={
  LQ_TREASURE_CHEST_STATUS:{saveFlags:['newChest','sharedFlag']},
  LQ_HIDDEN_FIND_STATUS:{flags:['newHidden','sharedFlag']},
  LQ_ITEM_TREASURE_CACHE_STATUS:{flags:['newCache','sharedFlag']}
 };
 const list=typeof status?.dynamicProgressFlags==='function'?status.dynamicProgressFlags(statuses):[];
 const sig=typeof status?.progressSignature==='function'?status.progressSignature:null;
 const base={flags:{newChest:false,newHidden:false,newCache:false,lqHerbSampleQuestDone:false}};
 const later={flags:{newChest:true,newHidden:false,newCache:false,lqHerbSampleQuestDone:false}};
 const herb={flags:{newChest:false,newHidden:false,newCache:false,lqHerbSampleQuestDone:true}};
 const data={
  status:!!status,
  canonicalSaveOwner:status?.canonicalSaveOwner==='index.html save()',
  presentationOnly:status?.presentationOnly===true&&status?.noProgressMutation===true,
  pointerSafe:status?.pointerSafe===true,
  dynamicCoverage:status?.dynamicProgressCoverage===true,
  chestIncluded:list.includes('newChest'),
  hiddenIncluded:list.includes('newHidden'),
  cacheIncluded:list.includes('newCache'),
  deduped:list.filter(v=>v==='sharedFlag').length===1,
  herbIncluded:list.includes('lqHerbSampleQuestDone'),
  unchangedStable:typeof sig==='function'&&sig(base,statuses)===sig({flags:{...base.flags}},statuses),
  laterFlagChanges:typeof sig==='function'&&sig(base,statuses)!==sig(later,statuses),
  herbChanges:typeof sig==='function'&&sig(base,statuses)!==sig(herb,statuses)
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ048_AUTOSAVE_PULSE_COVERAGE_FAIL_${key}()`);},0);}
},410);
})();
