(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqSmoke'))return;
setTimeout(async()=>{
 let marker=document.getElementById('lqReq064FileTransferSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqReq064FileTransferSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const data={};
 const status=window.LQ_SAVE_TRANSFER_STATUS;
 const original=structuredClone(s),saved=localStorage.getItem('lukeQuestV2');
 const makeFile=(text,size=new TextEncoder().encode(text).length)=>({size,text:async()=>text});
 const box=()=>{const root=document.createElement('div');root.className='lqTransfer';root.innerHTML='<textarea class=lqTransferCode></textarea><button class=import type=button>IMPORT</button><div class=lqTransferFeedback></div>';document.body.appendChild(root);return root;};
 try{
  data.status=!!status&&status.fileTransfer===true&&status.maxTransferFileBytes>=64*1024;
  s=Object.assign({},DEFAULT,{screen:'world',map:'mistTrail',x:8,y:15,lv:7,hp:31,mh:52,gold:123,dialog:null,flags:Object.assign({},DEFAULT.flags,{glennTraceSeen:true,lqUnicodeProbe:'勇者ルーク'})});
  const payload=status.exportFilePayload(),code=payload.trim(),round=status.prepareImportedState(code);
  data.exportPayload=payload.endsWith('\n')&&round.map==='mistTrail'&&round.x===8&&round.flags.lqUnicodeProbe==='勇者ルーク';
  data.fileName=/^luke-quest-save-.*\.lqsave\.txt$/.test(status.transferFileName(new Date('2026-09-06T00:00:00Z')));

  const freshBox=box();let freshClicks=0;freshBox.querySelector('.import').addEventListener('click',()=>{freshClicks++;});
  localStorage.removeItem('lukeQuestV2');
  const fresh=await status.loadTransferFile(freshBox,makeFile(code),{triggerImport:true});
  data.freshRoutesThroughImport=fresh.ok===true&&freshBox.querySelector('.lqTransferCode').value===code&&freshClicks===1&&!freshBox.dataset.lqTransferGuardHash;
  freshBox.remove();

  const guardedBox=box();let guardedClicks=0;guardedBox.querySelector('.import').addEventListener('click',()=>{guardedClicks++;});
  localStorage.setItem('lukeQuestV2',JSON.stringify({screen:'world',map:'town',x:9,y:12,flags:{introDone:true}}));
  const guarded=await status.loadTransferFile(guardedBox,makeFile(code),{triggerImport:true});
  data.overwriteGuard=guarded.ok===true&&!!guardedBox.dataset.lqTransferGuardHash&&guardedClicks===0;
  window.LQ_TRANSFER_OVERWRITE_GUARD_STATUS?.disarm?.(guardedBox);guardedBox.remove();

  const badBox=box();badBox.querySelector('.lqTransferCode').value='KEEP';const beforeBad=localStorage.getItem('lukeQuestV2');
  const malformed=await status.loadTransferFile(badBox,makeFile('%%%not-save%%%'),{triggerImport:false});
  const empty=await status.loadTransferFile(badBox,makeFile('',0),{triggerImport:false});
  const huge=await status.loadTransferFile(badBox,makeFile(code,status.maxTransferFileBytes+1),{triggerImport:false});
  data.failClosed=malformed.ok===false&&empty.ok===false&&huge.ok===false&&badBox.querySelector('.lqTransferCode').value==='KEEP'&&localStorage.getItem('lukeQuestV2')===beforeBad;
  badBox.remove();

  s=structuredClone(DEFAULT);s.screen='title';localStorage.removeItem('lukeQuestV2');render();
  const titleBox=app.querySelector('.lqTitleTransfer');
  data.titleUi=!!titleBox&&!!titleBox.querySelector('.load-file')&&!!titleBox.querySelector('.lqTransferFile')&&getComputedStyle(titleBox.querySelector('.download-file')).display==='none';
  data.req060=window.LQ_SAVE_TRANSFER_STATUS?.crossBrowserCode===true;
  data.req061=!!window.LQ_TITLE_CONTINUE_STATUS?.hasResumableStoredSave;
  data.req062=window.LQ_TRANSFER_OVERWRITE_GUARD_STATUS?.confirmMs===12000;
 }catch(e){data.runtime=false;data.error=String(e?.message||e);}
 finally{
  s=structuredClone(original);if(saved===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',saved);try{render();}catch(_e){}
 }
 Object.entries(data).filter(([k])=>k!=='error').forEach(([k,v])=>marker.dataset[k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())]=String(v===true));
 const failed=Object.entries(data).find(([k,v])=>k!=='error'&&v!==true);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ064_FILE_TRANSFER_FAIL_${key}()`);},0);}
},4000);
})();
