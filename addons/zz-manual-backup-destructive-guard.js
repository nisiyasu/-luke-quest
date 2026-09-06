(() => {
'use strict';

/* REQ-070: confirmation-only wrapper over the canonical manual backup actions. */
if(typeof window.lqManualSave!=='function'||typeof window.lqManualDelete!=='function')return;
const SLOT_KEYS=['lukeQuestManualSlot1','lukeQuestManualSlot2'];
const CONFIRM_MS=10000;
const canonicalSave=window.lqManualSave;
const canonicalDelete=window.lqManualDelete;
let armed=null;
let timer=null;

function rawSlot(i){return i>=0&&i<SLOT_KEYS.length?localStorage.getItem(SLOT_KEYS[i]):null;}
function validIndex(i){return Number.isInteger(i)&&i>=0&&i<SLOT_KEYS.length;}
function isArmed(action,i,now=Date.now()){return !!armed&&armed.action===action&&armed.slot===i&&now<=armed.until;}
function clearTimer(){if(timer!==null){clearTimeout(timer);timer=null;}}
function disarm({rerender=false}={}){armed=null;clearTimer();if(rerender&&s.screen==='world'&&s.pauseOpen)render();}
function arm(action,i){
 clearTimer();armed={action,slot:i,until:Date.now()+CONFIRM_MS};
 timer=setTimeout(()=>disarm({rerender:true}),CONFIRM_MS+50);
 if(s.screen==='world'&&s.pauseOpen)render();
 return false;
}
function guardSave(i){
 if(!validIndex(i)||s.screen!=='world')return;
 if(rawSlot(i)===null){disarm();return canonicalSave(i);}
 if(isArmed('overwrite',i)){disarm();return canonicalSave(i);}
 return arm('overwrite',i);
}
function guardDelete(i){
 if(!validIndex(i)||rawSlot(i)===null)return;
 if(isArmed('delete',i)){disarm();return canonicalDelete(i);}
 return arm('delete',i);
}
window.lqManualSave=guardSave;
window.lqManualDelete=guardDelete;

function decorate(){
 if(s.screen!=='world'||!s.pauseOpen||!armed)return;
 const sec=app.querySelector('.lqSaveSlotSection');if(!sec)return;
 const slots=sec.querySelectorAll('.lqSaveSlot'),slot=slots[armed.slot];if(!slot)return;
 const saveBtn=slot.querySelector('.lqSaveSlotBtns button:not(.load):not(.del)');
 const delBtn=slot.querySelector('.lqSaveSlotBtns .del');
 const note=document.createElement('div');note.className='lqManualDestructiveWarning';note.setAttribute('role','status');note.setAttribute('aria-live','polite');
 if(armed.action==='overwrite'){
  if(saveBtn)saveBtn.textContent='もう一度 SAVE';
  note.textContent=`SLOT ${armed.slot+1} の現在のバックアップを上書きします。もう一度SAVEで確定。`;
 }else{
  if(delBtn)delBtn.textContent='確認';
  note.textContent=`SLOT ${armed.slot+1} のバックアップを削除します。もう一度確認で確定。`;
 }
 slot.appendChild(note);
}
const renderBase=render;
render=function(){const out=renderBase();decorate();return out;};
const style=document.createElement('style');style.textContent=`
.lqManualDestructiveWarning{margin-top:5px;padding:6px 7px;border-radius:7px;border:1px solid #ffb35d55;background:#2b1b10;color:#ffd6a2;font-size:7px;font-weight:850;line-height:1.4}
`;document.head.appendChild(style);
window.LQ_MANUAL_BACKUP_DESTRUCTIVE_GUARD_STATUS={enabled:true,confirmMs:CONFIRM_MS,slotKeys:[...SLOT_KEYS],rawSlot,isArmed,arm,disarm,guardSave,guardDelete,canonicalSave,canonicalDelete};
})();
