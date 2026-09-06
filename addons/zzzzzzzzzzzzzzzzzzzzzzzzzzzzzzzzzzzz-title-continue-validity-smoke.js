(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqSmoke'))return;
setTimeout(()=>{
 const status=window.LQ_TITLE_CONTINUE_STATUS;
 let marker=document.getElementById('lqTitleContinueSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqTitleContinueSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const data={};
 const original=structuredClone(s),saved=localStorage.getItem('lukeQuestV2');
 const hasButton=()=>!!app.querySelector('button[onclick="continueGame()"]');
 try{
  data.status=!!status&&status.bootstrapTitleIsResumable===false&&status.hasResumableStoredSave('{}')===false;

  localStorage.removeItem('lukeQuestV2');s=structuredClone(DEFAULT);s.screen='title';render();
  data.freshBootstrap=!!localStorage.getItem('lukeQuestV2')&&!hasButton()&&status.hasResumableStoredSave()===false;
  data.transferStillVisible=!!app.querySelector('.lqTitleTransfer .import');

  localStorage.setItem('lukeQuestV2',JSON.stringify(Object.assign({},DEFAULT,{screen:'title'})));title();
  data.untouchedTitleHidden=!hasButton()&&status.hasResumableStoredSave()===false;

  localStorage.setItem('lukeQuestV2',JSON.stringify(Object.assign({},DEFAULT,{screen:'intro',step:4})));title();
  data.introContinue=hasButton()&&status.hasResumableStoredSave()===true;

  localStorage.setItem('lukeQuestV2',JSON.stringify(Object.assign({},DEFAULT,{screen:'world',map:'mistTrail',x:8,y:15,lv:7,flags:Object.assign({},DEFAULT.flags,{glennTraceSeen:true})})));title();
  data.worldContinue=hasButton()&&status.hasResumableStoredSave()===true;
  data.legacyProgress= status.hasResumableStoredSave(JSON.stringify({screen:'world',map:'town',lv:3,hp:30,flags:{leonSeen:true}}))===true;

  localStorage.setItem('lukeQuestV2','{broken');title();
  data.malformedHidden=!hasButton()&&status.hasResumableStoredSave()===false;
  localStorage.setItem('lukeQuestV2','[]');title();
  data.arrayHidden=!hasButton()&&status.hasResumableStoredSave()===false;
  localStorage.setItem('lukeQuestV2','42');title();
  data.primitiveHidden=!hasButton()&&status.hasResumableStoredSave()===false;

  if(window.LQ_SAVE_TRANSFER_STATUS){
   s=Object.assign({},DEFAULT,{screen:'world',map:'town',x:6,y:10,lv:5,hp:35,mh:48,gold:91,flags:Object.assign({},DEFAULT.flags,{leonSeen:true})});
   const code=window.LQ_SAVE_TRANSFER_STATUS.exportCode();
   localStorage.removeItem('lukeQuestV2');
   const imported=window.LQ_SAVE_TRANSFER_STATUS.importCode(code,{renderAfter:false});
   s.screen='title';title();
   data.transferImportContinue=imported.ok===true&&hasButton()&&status.hasResumableStoredSave()===true;
  }else data.transferImportContinue=false;

  data.manualPreserved=window.LQ_MANUAL_SAVE_STATUS?.slots===2&&window.LQ_MANUAL_SAVE_STATUS?.autosavePreserved===true;
 }catch(e){data.runtime=false;data.error=String(e?.message||e);}
 finally{
  s=structuredClone(original);if(saved===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',saved);try{render();}catch(_e){}
 }
 Object.entries(data).filter(([k])=>k!=='error').forEach(([k,v])=>marker.dataset[k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())]=String(v===true));
 const failed=Object.entries(data).find(([k,v])=>k!=='error'&&v!==true);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ061_CONTINUE_VALIDITY_FAIL_${key}()`);},0);}
},4300);
})();
