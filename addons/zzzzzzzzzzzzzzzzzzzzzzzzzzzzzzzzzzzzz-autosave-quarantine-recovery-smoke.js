(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqSmoke'))return;
setTimeout(()=>{
 let marker=document.getElementById('lqReq065QuarantineRecoverySmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqReq065QuarantineRecoverySmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const data={},api=window.LQ_AUTOSAVE_QUARANTINE_RECOVERY_STATUS;
 const qKey='lukeQuestAutosaveQuarantineV1',dKey='lukeQuestAutosaveQuarantineNoticeDismissedV1';
 const original=structuredClone(s),saved=localStorage.getItem('lukeQuestV2'),quarantine=localStorage.getItem(qKey),dismissed=localStorage.getItem(dKey);
 try{
  data.status=!!api&&api.key===qKey;
  s=structuredClone(DEFAULT);s.screen='title';
  localStorage.removeItem(qKey);localStorage.removeItem(dKey);render();
  data.noneHidden=!app.querySelector('.lqQuarantineNotice');

  const record={timestamp:'2026-09-06T06:00:00.000Z',reason:'malformed-json',raw:'{broken'};
  localStorage.setItem(qKey,JSON.stringify(record));localStorage.removeItem(dKey);render();
  const notice=app.querySelector('.lqQuarantineNotice');
  data.noticeVisible=!!notice&&notice.textContent.includes('malformed-json')&&notice.textContent.includes('元データは残っています');
  const pkg=JSON.parse(api.recoveryPackage(api.readQuarantine()));
  data.packagePreserves=pkg.format==='LUKE_QUEST_AUTOSAVE_QUARANTINE_RECOVERY'&&pkg.quarantine.raw==='{broken'&&pkg.quarantine.reason==='malformed-json'&&pkg.quarantine.timestamp===record.timestamp;
  const canonicalBefore=localStorage.getItem('lukeQuestV2');
  api.dismiss(api.readQuarantine());
  data.dismissPreserves=!app.querySelector('.lqQuarantineNotice')&&localStorage.getItem(qKey)===JSON.stringify(record)&&localStorage.getItem('lukeQuestV2')===canonicalBefore;

  localStorage.setItem(qKey,'not-json');localStorage.removeItem(dKey);render();
  data.malformedSafe=!app.querySelector('.lqQuarantineNotice')&&api.readQuarantine()===null;

  localStorage.setItem(qKey,JSON.stringify(record));localStorage.removeItem(dKey);render();
  data.transferStillPresent=!!app.querySelector('.lqTitleTransfer')&&!!app.querySelector('.lqTitleTransfer .import')&&!!app.querySelector('.lqTitleTransfer .load-file');
  data.continueContract=!!window.LQ_TITLE_CONTINUE_STATUS?.hasResumableStoredSave;
  data.bootstrapContract=api.key==='lukeQuestAutosaveQuarantineV1';
  data.noCanonicalWrite=localStorage.getItem('lukeQuestV2')===canonicalBefore;
 }catch(e){data.runtime=false;data.error=String(e?.message||e);}
 finally{
  s=structuredClone(original);
  if(saved===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',saved);
  if(quarantine===null)localStorage.removeItem(qKey);else localStorage.setItem(qKey,quarantine);
  if(dismissed===null)localStorage.removeItem(dKey);else localStorage.setItem(dKey,dismissed);
  try{render();}catch(_e){}
 }
 Object.entries(data).filter(([k])=>k!=='error').forEach(([k,v])=>marker.dataset[k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())]=String(v===true));
 const failed=Object.entries(data).find(([k,v])=>k!=='error'&&v!==true);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ065_QUARANTINE_RECOVERY_FAIL_${key}()`);},0);}
},4300);
})();
