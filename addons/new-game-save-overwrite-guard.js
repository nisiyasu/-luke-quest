(() => {
'use strict';

/* REQ-069: guard canonical newGame() from accidental destruction of resumable local progress. */
const SAVE_KEY='lukeQuestV2';
const CONFIRM_MS=10000;
const RESUMABLE_SCREENS=new Set(['intro','world','battle']);
let armedUntil=0;
let resetTimer=null;
const canonicalNewGame=newGame;

function fallbackHasResumableStoredSave(){
 const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;
 try{
  const parsed=JSON.parse(raw);
  return !!parsed&&typeof parsed==='object'&&!Array.isArray(parsed)&&RESUMABLE_SCREENS.has(parsed.screen);
 }catch{return false;}
}
function hasResumableStoredSave(){
 const authority=window.LQ_TITLE_CONTINUE_STATUS?.hasResumableStoredSave;
 return typeof authority==='function'?authority():fallbackHasResumableStoredSave();
}
function titleButton(){return app.querySelector('button[onclick="newGame()"]');}
function warningNode(){return app.querySelector('.lqNewGameOverwriteWarning');}
function isArmed(now=Date.now()){return armedUntil>0&&now<=armedUntil;}
function clearTimer(){if(resetTimer!==null){clearTimeout(resetTimer);resetTimer=null;}}
function disarm(){
 armedUntil=0;clearTimer();
 const button=titleButton();if(button)button.textContent='冒険をはじめる';
 warningNode()?.remove();
}
function arm(){
 disarm();armedUntil=Date.now()+CONFIRM_MS;
 const button=titleButton();
 if(button){
  button.textContent='もう一度押して新しく始める';
  const warning=document.createElement('div');warning.className='lqNewGameOverwriteWarning';warning.setAttribute('role','status');warning.setAttribute('aria-live','polite');warning.textContent='今の冒険データがあります。新しく始めると、このブラウザの進行を置き換えます。もう一度押すと開始します。';
  button.insertAdjacentElement('afterend',warning);
 }
 resetTimer=setTimeout(()=>disarm(),CONFIRM_MS+50);
}
newGame=function(){
 if(!hasResumableStoredSave()){disarm();return canonicalNewGame();}
 if(isArmed()){disarm();return canonicalNewGame();}
 arm();return false;
};

const renderBase=render;
render=function(){
 if(s.screen!=='title')disarm();
 return renderBase();
};

const style=document.createElement('style');style.textContent=`
.lqNewGameOverwriteWarning{margin:6px 0 8px;padding:8px 9px;border-radius:9px;border:1px solid #ffb35d55;background:#2b1b10;color:#ffd6a2;font-size:8px;font-weight:850;line-height:1.45}
`;document.head.appendChild(style);
window.LQ_NEW_GAME_OVERWRITE_GUARD_STATUS={enabled:true,saveKey:SAVE_KEY,confirmMs:CONFIRM_MS,hasResumableStoredSave,isArmed,arm,disarm,canonicalNewGame};
})();
