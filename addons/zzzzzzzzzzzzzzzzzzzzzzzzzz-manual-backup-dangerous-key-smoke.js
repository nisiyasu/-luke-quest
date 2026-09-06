(() => {
'use strict';

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
 const status=window.LQ_MANUAL_SAVE_STATUS;
 let marker=document.getElementById('lqManualBackupDangerousKeySmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqManualBackupDangerousKeySmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const sanitize=status?.sanitizeStateObject;
 const source=JSON.parse('{"map":"field","lv":4,"__proto__":{"polluted":true},"constructor":"bad","prototype":"bad","flags":{"ok":true}}');
 const cleaned=typeof sanitize==='function'?sanitize(source):null;
 const nested=typeof sanitize==='function'?sanitize(source.flags):null;
 const data={
  status:!!status,
  req049Preserved:status?.validatesSlotShape===true&&status?.rejectsMalformedSlots===true,
  sanitizesDangerousKeys:status?.sanitizesDangerousKeys===true,
  helper:typeof sanitize==='function',
  ordinaryKeysPreserved:cleaned?.map==='field'&&cleaned?.lv===4,
  protoDropped:cleaned&&!Object.prototype.hasOwnProperty.call(cleaned,'__proto__'),
  constructorDropped:cleaned&&!Object.prototype.hasOwnProperty.call(cleaned,'constructor'),
  prototypeDropped:cleaned&&!Object.prototype.hasOwnProperty.call(cleaned,'prototype'),
  sourceUnchanged:Object.prototype.hasOwnProperty.call(source,'__proto__')&&Object.prototype.hasOwnProperty.call(source,'constructor')&&Object.prototype.hasOwnProperty.call(source,'prototype'),
  invalidInputSafe:typeof sanitize==='function'&&Object.keys(sanitize(null)).length===0&&Object.keys(sanitize([])).length===0&&Object.keys(sanitize('legacy')).length===0,
  nestedFlagsSafe:nested?.ok===true
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ050_MANUAL_BACKUP_DANGEROUS_KEY_FAIL_${key}()`);},0);}
},380);
})();
