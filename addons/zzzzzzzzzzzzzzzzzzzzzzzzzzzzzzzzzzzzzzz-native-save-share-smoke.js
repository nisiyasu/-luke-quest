(() => {
'use strict';
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
queueMicrotask(async()=>{
 const api=window.LQ_SAVE_TRANSFER_NATIVE_SHARE_STATUS,transfer=window.LQ_SAVE_TRANSFER_STATUS;
 const assert=(ok,msg)=>{if(!ok)throw new Error(`REQ-067 ${msg}`);};
 assert(api?.enabled===true,'status missing');
 assert(typeof api.supportsNativeFileShare==='function','capability detector missing');
 assert(typeof api.transferFile==='function','file builder missing');
 assert(typeof api.shareSaveFile==='function','share authority missing');
 assert(typeof transfer?.exportFilePayload==='function','REQ-064 payload authority missing');
 assert(typeof transfer?.downloadTransferFile==='function','REQ-064 fallback authority missing');

 const snapshot=JSON.parse(JSON.stringify(s));
 const originalShare=navigator.share,originalCanShare=navigator.canShare,originalDownload=transfer.downloadTransferFile;
 try{
  s.screen='world';s.pauseOpen=false;s.shopOpen=false;s.dialog=null;s.enemy=null;s.ehp=0;
  const expected=transfer.exportFilePayload(),file=api.transferFile();
  assert(file instanceof File,'native payload is not File');
  assert(file.name.endsWith('.lqsave.txt'),'filename contract broken');
  assert(await file.text()===expected,'file payload diverged from REQ-064');

  let shared=null;
  Object.defineProperty(navigator,'canShare',{configurable:true,value:({files})=>Array.isArray(files)&&files[0] instanceof File});
  Object.defineProperty(navigator,'share',{configurable:true,value:async payload=>{shared=payload;}});
  const fakeRoot=document.createElement('div');fakeRoot.innerHTML='<div class="lqTransferFeedback"></div>';
  const before=JSON.stringify(s),result=await api.shareSaveFile(fakeRoot);
  assert(result.ok===true&&result.shared===true,'supported native share did not run');
  assert(shared?.files?.[0] instanceof File,'shared payload missing file');
  assert(await shared.files[0].text()===expected,'shared file payload changed');
  assert(JSON.stringify(s)===before,'share mutated canonical state');

  Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false});
  Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new Error('must not call');}});
  let fallbackCount=0;transfer.downloadTransferFile=()=>{fallbackCount++;return true;};
  const fallback=await api.shareSaveFile(fakeRoot);
  assert(fallback.ok===true&&fallback.fallback==='download'&&fallbackCount===1,'unsupported share did not fallback');

  api.enhanceAll();api.enhanceAll();
  document.querySelectorAll('.lqTransfer:not(.lqTitleTransfer)').forEach(box=>assert(box.querySelectorAll('.share-file').length<=1,'duplicate share button'));
  document.querySelectorAll('.lqTitleTransfer').forEach(box=>assert(!box.querySelector('.share-file'),'title exposes invalid share export'));
  window.LQ_REQ067_SMOKE_PASS=true;
 }finally{
  Object.keys(s).forEach(key=>delete s[key]);Object.assign(s,snapshot);
  transfer.downloadTransferFile=originalDownload;
  try{Object.defineProperty(navigator,'share',{configurable:true,value:originalShare});}catch{}
  try{Object.defineProperty(navigator,'canShare',{configurable:true,value:originalCanShare});}catch{}
 }
});
})();
