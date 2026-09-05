(() => {
'use strict';

/* Guarantees that every Luke-authored dialogue surface prefers the approved
   repository WebP once ux-v12 transport has hydrated it. This does not create
   or promote fallback SVG art. */

function isLukeDialog(){
  if(typeof s==='undefined'||!s.dialog)return false;
  return s.dialog.portraitKey==='luke'||s.dialog.name==='ルーク';
}

function formalLukeUrl(){
  return window.LQ_PORTRAITS&&window.LQ_PORTRAITS.luke&&window.LQ_PORTRAITS.luke.neutral;
}

function apply(){
  if(!isLukeDialog())return false;
  const src=formalLukeUrl();
  if(!src||!String(src).startsWith('blob:'))return false;
  const img=document.querySelector('.dialogBox .dialogPortrait img');
  if(!img)return false;
  if(img.src!==src)img.src=src;
  img.dataset.formalLuke='true';
  img.alt='ルーク 正式会話立ち絵';
  const box=img.closest('.dialogBox');
  if(box)box.dataset.lukeFormalPortrait='true';
  return true;
}

async function hydrateAndApply(){
  if(typeof window.LQ_hydrateFormalDialogueAsset==='function'){
    try{await window.LQ_hydrateFormalDialogueAsset('luke','neutral');}catch(_error){}
  }
  if(typeof render==='function'&&isLukeDialog())render();
  requestAnimationFrame(apply);
}

if(typeof render==='function'){
  const beforeLukeFormalGuard=render;
  render=function(){const result=beforeLukeFormalGuard();requestAnimationFrame(apply);return result;};
}

void hydrateAndApply();
window.LQ_LUKE_DIALOGUE_FORMAL_GUARD={approvedRasterOnly:true,dialogueOverride:true};
})();
