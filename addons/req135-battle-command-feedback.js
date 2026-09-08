(() => {
'use strict';
if(window.LQ_REQ135_BATTLE_COMMAND_FEEDBACK)return;

const FEEDBACK_CLASS='lqBattleFeedbackButton';
const style=document.createElement('style');
style.id='lq-req135-battle-command-feedback-style';
style.textContent=`
body.lqBattleTouchMode #app .${FEEDBACK_CLASS}{
 position:relative;
 transition:transform .08s ease,filter .08s ease,box-shadow .08s ease,opacity .08s ease;
 box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),0 3px 8px rgba(0,0,0,.24);
}
body.lqBattleTouchMode #app .${FEEDBACK_CLASS}:active:not(:disabled):not([aria-disabled="true"]){
 transform:translateY(1px) scale(.975);
 filter:brightness(1.2) saturate(1.08);
 box-shadow:inset 0 0 0 2px rgba(255,255,255,.28),0 1px 3px rgba(0,0,0,.35);
}
body.lqBattleTouchMode #app .${FEEDBACK_CLASS}:focus-visible{
 outline:3px solid var(--gold,#f6d35b);
 outline-offset:2px;
 box-shadow:0 0 0 2px rgba(7,17,31,.92),0 0 0 5px rgba(246,211,91,.38);
}
body.lqBattleTouchMode #app .${FEEDBACK_CLASS}:disabled,
body.lqBattleTouchMode #app .${FEEDBACK_CLASS}[aria-disabled="true"]{
 opacity:.46;
 filter:saturate(.45);
 box-shadow:inset 0 0 0 1px rgba(255,255,255,.04);
}
@media(prefers-reduced-motion:reduce){
 body.lqBattleTouchMode #app .${FEEDBACK_CLASS}{transition:none!important}
 body.lqBattleTouchMode #app .${FEEDBACK_CLASS}:active:not(:disabled):not([aria-disabled="true"]){transform:none}
}
`;
document.head.appendChild(style);

function decorate(){
 if(typeof s==='undefined'||!s||s.screen!=='battle')return false;
 const buttons=[...document.querySelectorAll('#app .lqBattleCommandButton')];
 buttons.forEach(button=>button.classList.add(FEEDBACK_CLASS));
 return buttons.length>0;
}

const observer=new MutationObserver(()=>decorate());
const app=document.getElementById('app');
if(app)observer.observe(app,{childList:true,subtree:true});
queueMicrotask(decorate);

window.LQ_REQ135_BATTLE_COMMAND_FEEDBACK={
 version:'1.0.0',
 requirement:'REQ-135',
 presentationOnly:true,
 battleSemanticsMutation:false,
 pointerHandlerAdded:false,
 clickHandlerAdded:false,
 saveSchemaChange:false,
 storyMutation:false,
 feedbackClass:FEEDBACK_CLASS,
 reducedMotion:true,
 iosPhysicalVerification:'PENDING',
 decorate
};
})();
