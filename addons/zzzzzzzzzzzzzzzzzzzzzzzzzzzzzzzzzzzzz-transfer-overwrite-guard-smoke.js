(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqSmoke'))return;
setTimeout(()=>{
 const guard=window.LQ_TRANSFER_OVERWRITE_GUARD_STATUS,transfer=window.LQ_SAVE_TRANSFER_STATUS;
 let marker=document.getElementById('lqTransferOverwriteGuardSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqTransferOverwriteGuardSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const data={},original=structuredClone(s),saved=localStorage.getItem('lukeQuestV2');
 const click=el=>el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
 const input=el=>el.dispatchEvent(new Event('input',{bubbles:true}));
 const setupExistingBox=(code)=>{
  s=Object.assign({},DEFAULT,{screen:'world',map:'town',x:9,y:12,lv:3,hp:38,mh:45,gold:44,pauseOpen:true,dialog:null,flags:Object.assign({},DEFAULT.flags,{leonSeen:true})});
  save();render();
  const box=app.querySelector('.lqSaveTransferSection .lqTransfer');
  if(!box)throw new Error('pause transfer box missing');
  box.querySelector('.lqTransferCode').value=code;
  return box;
 };
 try{
  data.status=!!guard&&guard.confirmMs>=5000&&!!transfer&&typeof guard.comparisonMessage==='function';
  s=Object.assign({},DEFAULT,{screen:'world',map:'mistTrail',x:8,y:15,lv:8,hp:36,mh:52,gold:123,dialog:null,flags:Object.assign({},DEFAULT.flags,{glennTraceSeen:true})});
  const incoming=transfer.exportCode();

  let box=setupExistingBox(incoming),button=box.querySelector('.import');
  const beforeS=JSON.stringify(s),beforeStorage=localStorage.getItem('lukeQuestV2');
  click(button);
  data.firstIntercept=JSON.stringify(s)===beforeS&&localStorage.getItem('lukeQuestV2')===beforeStorage&&!!box.dataset.lqTransferGuardHash;
  const warning=box.querySelector('.lqTransferFeedback')?.textContent||'';
  data.warning=/もう一度IMPORT/.test(warning);
  data.comparison=/CURRENT LV3/.test(warning)&&/王都アルディア/.test(warning)&&/44G/.test(warning)&&/IMPORT LV8/.test(warning)&&/霧の追跡路/.test(warning)&&/123G/.test(warning);
  data.comparisonReadOnly=JSON.stringify(s)===beforeS&&localStorage.getItem('lukeQuestV2')===beforeStorage;
  const prepared=transfer.prepareImportedState(incoming);
  data.preparationAuthority=guard.comparisonMessage(incoming).includes(`IMPORT LV${prepared.lv}`);
  click(button);
  data.secondImports=s.map==='mistTrail'&&s.lv===8&&s.gold===123&&JSON.parse(localStorage.getItem('lukeQuestV2')||'{}').map==='mistTrail';

  box=setupExistingBox(incoming);button=box.querySelector('.import');click(button);
  const field=box.querySelector('.lqTransferCode');field.value=incoming+'x';input(field);
  data.inputDisarms=!box.dataset.lqTransferGuardHash&&!box.dataset.lqTransferGuardUntil;

  box=setupExistingBox(incoming);button=box.querySelector('.import');click(button);
  box.dataset.lqTransferGuardUntil=String(Date.now()-1);
  data.expiryDisarmsLogic=guard.shouldGuard(box).guard===true;
  guard.disarm(box);

  box=setupExistingBox('%%%bad%%%');button=box.querySelector('.import');
  const badBefore=JSON.stringify(s),badStore=localStorage.getItem('lukeQuestV2');click(button);
  data.malformedStillClosed=JSON.stringify(s)===badBefore&&localStorage.getItem('lukeQuestV2')===badStore&&!box.dataset.lqTransferGuardHash&&/SAVE CODE/.test(box.querySelector('.lqTransferFeedback')?.textContent||'');

  localStorage.removeItem('lukeQuestV2');s=structuredClone(DEFAULT);s.screen='title';render();
  const titleBox=app.querySelector('.lqTitleTransfer');
  data.titleUi=!!titleBox?.querySelector('.import');
  titleBox.querySelector('.lqTransferCode').value=incoming;click(titleBox.querySelector('.import'));
  data.freshSingleAction=s.map==='mistTrail'&&s.lv===8&&!titleBox.dataset.lqTransferGuardHash;

  s=Object.assign({},DEFAULT,{screen:'world',map:'town',pauseOpen:true});render();
  data.pauseUi=!!app.querySelector('.lqSaveTransferSection .import');
  data.manualPreserved=window.LQ_MANUAL_SAVE_STATUS?.slots===2&&window.LQ_MANUAL_SAVE_STATUS?.autosavePreserved===true;
 }catch(e){data.runtime=false;data.error=String(e?.message||e);}
 finally{
  s=structuredClone(original);if(saved===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',saved);try{render();}catch(_e){}
 }
 Object.entries(data).filter(([k])=>k!=='error').forEach(([k,v])=>marker.dataset[k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())]=String(v===true));
 const failed=Object.entries(data).find(([k,v])=>k!=='error'&&v!==true);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ080_TRANSFER_OVERWRITE_COMPARISON_FAIL_${key}()`);},0);}
 window.LQ_REQ080_SMOKE_PASS=!failed;
},4800);
})();
