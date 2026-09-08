(() => {
'use strict';
if(window.LQ_REQ138_BATTLE_LEVEL_UP_SUMMARY?.installed)return;
const previousWin=typeof win==='function'?win:null;
const api=window.LQ_REQ138_BATTLE_LEVEL_UP_SUMMARY={installed:false,canonicalWinPreserved:true,progressionMutation:false,pointerHandlerAdded:false,clickHandlerAdded:false,touchHandlerAdded:false};
if(!previousWin)return;
function appendLevelSummary(before,after){
 if(!Number.isFinite(before)||!Number.isFinite(after)||after<=before)return;
 if(!s?.dialog||typeof s.dialog!=='object'||typeof s.dialog.text!=='string')return;
 const line=`レベルアップ！ LV${before} → LV${after}`;
 if(s.dialog.text.includes(line))return;
 s.dialog.text=`${s.dialog.text}\n${line}`;
}
win=function(...args){
 const before=Number(s?.lv);
 const result=previousWin.apply(this,args);
 const after=Number(s?.lv);
 appendLevelSummary(before,after);
 if(typeof render==='function')render();
 return result;
};
api.installed=true;
api.previousWin=previousWin;
})();
