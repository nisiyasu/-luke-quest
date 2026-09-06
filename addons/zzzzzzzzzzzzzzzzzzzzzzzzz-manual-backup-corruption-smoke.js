(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_MANUAL_SAVE_STATUS;
 let marker=document.getElementById('lqManualBackupCorruptionSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqManualBackupCorruptionSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const classify=status?.classifyPayload;
 const plain=status?.isPlainStateObject;
 const data={
  status:!!status,
  slots:status?.slots===2,
  autosavePreserved:status?.autosavePreserved===true,
  validatesSlotShape:status?.validatesSlotShape===true,
  rejectsMalformedSlots:status?.rejectsMalformedSlots===true,
  classifier:typeof classify==='function',
  objectAccepted:typeof classify==='function'&&classify({map:'town',lv:1})==='valid',
  emptyObjectAccepted:typeof classify==='function'&&classify({})==='valid',
  nullRejected:typeof classify==='function'&&classify(null)==='invalid',
  primitiveRejected:typeof classify==='function'&&classify('legacy')==='invalid'&&classify(3)==='invalid'&&classify(true)==='invalid',
  arrayRejected:typeof classify==='function'&&classify([])==='invalid',
  plainHelper:typeof plain==='function'&&plain({})===true&&plain([])===false&&plain(null)===false
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ049_MANUAL_BACKUP_CORRUPTION_FAIL_${key}()`);},0);}
},360);
})();
