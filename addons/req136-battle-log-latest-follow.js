(() => {
'use strict';
if(window.LQ_REQ136_BATTLE_LOG_LATEST_FOLLOW)return;

const SELECTOR='.lqBattleScrollableLog,.battleLogV10,.log';
let queued=false;

function isBattle(){
 return typeof s!=='undefined'&&s&&s.screen==='battle';
}

function resolveLog(){
 if(!isBattle())return null;
 return document.querySelector(`#app ${SELECTOR.split(',').join(',#app ')}`);
}

function followLatest(){
 const log=resolveLog();
 if(!log)return false;
 log.setAttribute('role','log');
 log.setAttribute('aria-live','polite');
 log.setAttribute('aria-relevant','additions text');
 log.scrollTop=log.scrollHeight;
 return true;
}

function scheduleFollow(){
 if(queued)return;
 queued=true;
 requestAnimationFrame(()=>{
  queued=false;
  followLatest();
 });
}

const app=document.getElementById('app');
if(app){
 new MutationObserver(()=>{
  if(isBattle())scheduleFollow();
 }).observe(app,{childList:true,subtree:true,characterData:true});
}

addEventListener('resize',()=>{if(isBattle())scheduleFollow()},{passive:true});
queueMicrotask(scheduleFollow);

window.LQ_REQ136_BATTLE_LOG_LATEST_FOLLOW={
 version:'1.0.0',
 requirement:'REQ-136',
 presentationOnly:true,
 battleStateMutation:false,
 saveSchemaChange:false,
 storyMutation:false,
 pointerHandlerAdded:false,
 clickHandlerAdded:false,
 selector:SELECTOR,
 semanticLog:true,
 autoFollowLatest:true,
 iosPhysicalVerification:'PENDING',
 resolveLog,
 followLatest
};
})();
