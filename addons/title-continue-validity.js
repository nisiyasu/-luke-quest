(() => {
'use strict';

/* REQ-061: storage-key existence is not proof of a resumable adventure. */
const SAVE_KEY='lukeQuestV2';
const RESUMABLE_SCREENS=new Set(['intro','world','battle']);

function isPlainObject(value){
 return !!value&&typeof value==='object'&&!Array.isArray(value);
}
function parseStoredSave(raw=localStorage.getItem(SAVE_KEY)){
 if(!raw)return null;
 try{
  const parsed=JSON.parse(raw);
  return isPlainObject(parsed)?parsed:null;
 }catch{return null;}
}
function hasResumableStoredSave(raw=localStorage.getItem(SAVE_KEY)){
 const stored=parseStoredSave(raw);
 if(!stored)return false;
 /* The untouched bootstrap snapshot is screen:title. No legitimate runtime flow
    currently returns a progressed adventure to title, so title is not resumable. */
 return RESUMABLE_SCREENS.has(stored.screen);
}
function reconcileContinueButton(){
 if(s.screen!=='title')return;
 const continueButton=app.querySelector('button[onclick="continueGame()"]');
 if(continueButton&&!hasResumableStoredSave())continueButton.remove();
}

const previousTitle=title;
title=function(){
 const out=previousTitle();
 reconcileContinueButton();
 return out;
};
const previousRender=render;
render=function(){
 const out=previousRender();
 reconcileContinueButton();
 return out;
};

window.LQ_TITLE_CONTINUE_STATUS={
 saveKey:SAVE_KEY,
 resumableScreens:[...RESUMABLE_SCREENS],
 parseStoredSave,
 hasResumableStoredSave,
 reconcileContinueButton,
 bootstrapTitleIsResumable:false
};

reconcileContinueButton();
})();
