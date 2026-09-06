(() => {
'use strict';

/* REQ-062: protect an existing resumable browser-local adventure from one-tap replacement. */
const CONFIRM_MS=12000;
const timers=new WeakMap();

function codeHash(text){
 let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return `${text.length}:${h>>>0}`;
}
function hasResumableLocalSave(){
 if(window.LQ_TITLE_CONTINUE_STATUS?.hasResumableStoredSave)return window.LQ_TITLE_CONTINUE_STATUS.hasResumableStoredSave();
 try{
  const parsed=JSON.parse(localStorage.getItem('lukeQuestV2')||'null');
  return !!parsed&&typeof parsed==='object'&&!Array.isArray(parsed)&&['intro','world','battle'].includes(parsed.screen);
 }catch{return false;}
}
function feedback(box,message,ok=false){
 const el=box?.querySelector('.lqTransferFeedback');if(!el)return;
 el.textContent=message;el.classList.toggle('ok',!!ok);
}
function disarm(box,{expired=false}={}){
 if(!box)return;
 delete box.dataset.lqTransferGuardHash;delete box.dataset.lqTransferGuardUntil;
 const timer=timers.get(box);if(timer)clearTimeout(timer);timers.delete(box);
 if(expired)feedback(box,'上書き確認の時間が切れました。必要ならもう一度IMPORTしてください。');
}
function arm(box,hash){
 disarm(box);
 const until=Date.now()+CONFIRM_MS;
 box.dataset.lqTransferGuardHash=hash;box.dataset.lqTransferGuardUntil=String(until);
 feedback(box,'現在の冒険を別のSAVE CODEで上書きします。もう一度IMPORTを押すと実行します。');
 timers.set(box,setTimeout(()=>{
  if(box.dataset.lqTransferGuardHash===hash)disarm(box,{expired:true});
 },CONFIRM_MS+30));
}
function validTransferCode(code){
 try{window.LQ_SAVE_TRANSFER_STATUS?.prepareImportedState(code);return !!window.LQ_SAVE_TRANSFER_STATUS;}catch{return false;}
}
function shouldGuard(box){
 const code=String(box?.querySelector('.lqTransferCode')?.value||'').trim();
 if(!code||!hasResumableLocalSave()||!validTransferCode(code))return{guard:false,code,hash:codeHash(code)};
 const hash=codeHash(code),until=Number(box.dataset.lqTransferGuardUntil||0),armed=box.dataset.lqTransferGuardHash===hash&&Date.now()<=until;
 return{guard:!armed,armed,code,hash};
}

document.addEventListener('click',event=>{
 const button=event.target.closest?.('.lqTransfer .import');if(!button)return;
 const box=button.closest('.lqTransfer');if(!box)return;
 const state=shouldGuard(box);
 if(state.guard){
  event.preventDefault();event.stopImmediatePropagation();arm(box,state.hash);return;
 }
 if(state.armed)disarm(box);
},true);

document.addEventListener('input',event=>{
 if(!event.target.matches?.('.lqTransferCode'))return;
 const box=event.target.closest('.lqTransfer');if(box?.dataset.lqTransferGuardHash)disarm(box);
});

window.LQ_TRANSFER_OVERWRITE_GUARD_STATUS={
 confirmMs:CONFIRM_MS,
 hasResumableLocalSave,
 validTransferCode,
 shouldGuard,
 codeHash,
 disarm
};
})();
