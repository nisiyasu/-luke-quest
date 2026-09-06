(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_MANUAL_SAVE_STATUS;
 let marker=document.getElementById('lqManualBackupNumericTypeSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqManualBackupNumericTypeSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const normalize=status?.normalizeNumericStateFields;
 const source={lv:'4',gold:12,hp:null,addonNumeric:{bad:true},unknownExtension:'keep'};
 const defaults={lv:1,gold:0,hp:42,addonNumeric:10,unknownNumericAbsent:7,label:'x'};
 const cleaned=typeof normalize==='function'?normalize(source,defaults):null;
 const data={
  status:!!status,
  req049Preserved:status?.validatesSlotShape===true&&status?.rejectsMalformedSlots===true,
  req050Preserved:status?.sanitizesDangerousKeys===true,
  numericContract:status?.normalizesCanonicalNumericTypes===true,
  helper:typeof normalize==='function',
  finitePreserved:cleaned?.gold===12,
  numericStringRejected:cleaned?.lv===1&&typeof cleaned?.lv==='number',
  nullRejected:cleaned?.hp===42,
  objectRejected:cleaned?.addonNumeric===10,
  unknownPreserved:cleaned?.unknownExtension==='keep',
  absentDefaultNotInjected:cleaned&&!Object.prototype.hasOwnProperty.call(cleaned,'unknownNumericAbsent'),
  sourceUnchanged:source.lv==='4'&&source.hp===null&&typeof source.addonNumeric==='object'
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ051_MANUAL_BACKUP_NUMERIC_TYPE_FAIL_${key}()`);},0);}
},400);
})();
