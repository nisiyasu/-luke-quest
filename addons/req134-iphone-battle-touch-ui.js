(() => {
'use strict';
if(window.LQ_REQ134_BATTLE_TOUCH_UI)return;

const ROOT_CLASS='lqBattleTouchMode';
const CARD_CLASS='lqBattleCommandCard';
const BUTTON_CLASS='lqBattleCommandButton';
const MIN_TARGET=48;

const style=document.createElement('style');
style.id='lq-req134-battle-touch-style';
style.textContent=`
body.${ROOT_CLASS}{min-height:100vh;min-height:100dvh;padding-bottom:max(env(safe-area-inset-bottom),8px)}
body.${ROOT_CLASS} #app{min-height:100vh;min-height:100dvh;padding-bottom:max(calc(env(safe-area-inset-bottom) + 10px),16px)}
body.${ROOT_CLASS} .${CARD_CLASS}{display:flex;flex-direction:column;gap:6px;margin-bottom:max(env(safe-area-inset-bottom),10px)}
body.${ROOT_CLASS} .${CARD_CLASS} .row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;width:100%;margin:0}
body.${ROOT_CLASS} .${BUTTON_CLASS}{min-width:0;min-height:${MIN_TARGET}px;margin:0;padding:11px 8px;line-height:1.2;touch-action:manipulation;white-space:normal;overflow-wrap:anywhere}
body.${ROOT_CLASS} .${CARD_CLASS} .log{max-height:min(22dvh,170px);overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-gutter:stable;line-height:1.45;margin-top:2px}
@media(max-width:430px){
 body.${ROOT_CLASS} #app{width:100%;max-width:none;padding-left:max(8px,env(safe-area-inset-left));padding-right:max(8px,env(safe-area-inset-right))}
 body.${ROOT_CLASS} .card{margin-bottom:7px;padding:11px;border-radius:13px}
 body.${ROOT_CLASS} .enemyName{font-size:20px}
 body.${ROOT_CLASS} .bar{margin:5px 0}
 body.${ROOT_CLASS} .${CARD_CLASS}{padding-bottom:max(11px,env(safe-area-inset-bottom))}
}
@media(max-height:700px){
 body.${ROOT_CLASS} .${CARD_CLASS} .log{max-height:112px}
 body.${ROOT_CLASS} .${BUTTON_CLASS}{min-height:${MIN_TARGET}px;padding:9px 7px}
}
@media(prefers-reduced-motion:reduce){body.${ROOT_CLASS} .${BUTTON_CLASS}{transition:none!important}}
`;
document.head.appendChild(style);

function leaveBattleMode(){
 document.body.classList.remove(ROOT_CLASS);
 document.documentElement.classList.remove(ROOT_CLASS);
}

function decorateBattle(){
 if(typeof s==='undefined'||!s||s.screen!=='battle'){
  leaveBattleMode();
  return false;
 }
 const log=document.querySelector('#app .log');
 const card=log?.closest('.card');
 if(!card)return false;
 document.body.classList.add(ROOT_CLASS);
 document.documentElement.classList.add(ROOT_CLASS);
 card.classList.add(CARD_CLASS);
 card.querySelectorAll('button').forEach(button=>button.classList.add(BUTTON_CLASS));
 const active=document.activeElement;
 if(active&&active instanceof HTMLElement&&card.contains(active))active.scrollIntoView({block:'nearest',inline:'nearest'});
 return true;
}

const battleBase=battle;
battle=function(){
 const result=battleBase.apply(this,arguments);
 decorateBattle();
 return result;
};

const renderBase=render;
render=function(){
 const result=renderBase.apply(this,arguments);
 if(typeof s!=='undefined'&&s&&s.screen==='battle')decorateBattle();
 else leaveBattleMode();
 return result;
};

// A late add-on may append a skill or item row after the wrapped battle() returns.
// Observe only while battle mode is active and decorate newly inserted canonical buttons.
const observer=new MutationObserver(()=>{
 if(typeof s==='undefined'||!s||s.screen!=='battle')return;
 decorateBattle();
});
observer.observe(document.getElementById('app'),{childList:true,subtree:true});

decorateBattle();
window.LQ_REQ134_BATTLE_TOUCH_UI={
 version:'1.0.0',
 requirement:'REQ-134',
 presentationOnly:true,
 battleSemanticsMutation:false,
 saveSchemaChange:false,
 minTargetPx:MIN_TARGET,
 safeAreaBottom:true,
 boundedScrollableLog:true,
 lateAddonDecoration:true,
 worldTouchAuthorityMutation:false,
 iosPhysicalVerification:'PENDING',
 decorate:decorateBattle
};
})();
