(() => {
'use strict';

/* REQ-139 — presentation-only consistency with REQ-021 Tap Anywhere Action.
   No input handler is added here. canonical action()/touch arbitration remain
   owned by the existing gameplay and floating-touch-controller implementation. */

const HINT_TEXT='タップ / Aで閉じる';

function applyWorldDialogueTapHint(){
  if(typeof s==='undefined'||s.screen!=='world'||!s.dialog)return;
  const box=document.querySelector('.gameShell .dialogBox');
  if(!box)return;
  const hint=box.querySelector('.sub');
  if(!hint)return;
  hint.textContent=HINT_TEXT;
  hint.dataset.req139TapHint='true';
}

if(typeof world==='function'){
  const beforeReq139World=world;
  world=function(){
    const result=beforeReq139World();
    applyWorldDialogueTapHint();
    return result;
  };
}

window.LQ_REQ139_WORLD_DIALOGUE_TAP_HINT_STATUS={
  version:'1.0',
  hint:HINT_TEXT,
  presentationOnly:true,
  inputHandlersAdded:false,
  canonicalActionChanged:false
};
})();
