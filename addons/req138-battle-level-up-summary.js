(() => {
'use strict';
if(window.LQ_REQ138_BATTLE_LEVEL_UP_SUMMARY?.installed)return;
const previousWin=typeof win==='function'?win:null;
const api=window.LQ_REQ138_BATTLE_LEVEL_UP_SUMMARY={installed:false,canonicalWinPreserved:true,progressionMutation:false,pointerHandlerAdded:false,clickHandlerAdded:false,touchHandlerAdded:false,victoryPresentationOwnershipPreserved:true};
if(!previousWin)return;
function appendLevelSummary(before,after){
 if(!Number.isFinite(before)||!Number.isFinite(after)||after<=before)return false;
 if(!s?.dialog||typeof s.dialog!=='object'||typeof s.dialog.text!=='string')return false;
 const line=`レベルアップ！ LV${before} → LV${after}`;
 if(s.dialog.text.includes(line))return false;
 s.dialog.text=`${s.dialog.text}\n${line}`;
 return true;
}
function syncVisibleDialogue(){
 const visible=document.querySelector('#lqVictoryBattleFrame .dialogBox .dialog, #app .dialogBox .dialog');
 if(visible&&s?.dialog&&typeof s.dialog.text==='string')visible.textContent=s.dialog.text;
}
win=function(...args){
 const before=Number(s?.lv);
 const result=previousWin.apply(this,args);
 const after=Number(s?.lv);
 if(appendLevelSummary(before,after)){
  if(typeof save==='function')save();
  syncVisibleDialogue();
 }
 return result;
};
api.installed=true;
api.previousWin=previousWin;
})();
