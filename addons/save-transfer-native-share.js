(() => {
'use strict';

/* REQ-067: native share is presentation/transport only; REQ-060/064 remain the save-transfer authority. */
const transfer=window.LQ_SAVE_TRANSFER_STATUS;
if(!transfer?.exportFilePayload||!transfer?.transferFileName||!transfer?.downloadTransferFile)return;

function supportsNativeFileShare(file){
 try{
  return !!navigator.share&&!!navigator.canShare&&navigator.canShare({files:[file]})===true;
 }catch{return false;}
}
function transferFile(){
 const payload=transfer.exportFilePayload();
 return new File([payload],transfer.transferFileName(),{type:'text/plain;charset=utf-8'});
}
function feedback(root,message,ok=false){
 const el=root?.querySelector('.lqTransferFeedback');
 if(!el)return;
 el.textContent=message;
 el.classList.toggle('ok',!!ok);
}
async function shareSaveFile(root){
 let file;
 try{file=transferFile();}catch(err){feedback(root,String(err?.message||err));return{ok:false,error:'export-failed'};}
 if(!supportsNativeFileShare(file)){
  const ok=transfer.downloadTransferFile(root);
  if(ok)feedback(root,'共有に未対応のためSAVE FILEを作成しました。共有先へ送ってください。',true);
  return{ok:!!ok,fallback:'download'};
 }
 try{
  await navigator.share({files:[file],title:'LUKE QUEST SAVE',text:'LUKE QUESTの冒険データ'});
  feedback(root,'SAVE FILEを共有しました。',true);
  return{ok:true,shared:true,file};
 }catch(err){
  if(err?.name==='AbortError'){
   feedback(root,'共有をキャンセルしました。');
   return{ok:false,cancelled:true};
  }
  const ok=transfer.downloadTransferFile(root);
  if(ok)feedback(root,'共有できなかったためSAVE FILEを作成しました。',true);
  return{ok:!!ok,fallback:'download',error:String(err?.message||err)};
 }
}
function enhanceBox(box){
 if(!box||box.classList.contains('lqTitleTransfer')||box.dataset.nativeShareBound==='1')return;
 box.dataset.nativeShareBound='1';
 const buttons=box.querySelector('.lqTransferBtns');
 if(!buttons||buttons.querySelector('.share-file'))return;
 const button=document.createElement('button');
 button.type='button';button.className='share-file';button.textContent='SHARE SAVE FILE';
 button.addEventListener('click',()=>shareSaveFile(box));
 const download=buttons.querySelector('.download-file');
 buttons.insertBefore(button,download||null);
}
function enhanceAll(){document.querySelectorAll('.lqTransfer').forEach(enhanceBox);}
const renderBase=render;
render=function(){const out=renderBase();enhanceAll();return out;};
window.LQ_SAVE_TRANSFER_NATIVE_SHARE_STATUS={enabled:true,supportsNativeFileShare,transferFile,shareSaveFile,enhanceAll};
enhanceAll();
})();
