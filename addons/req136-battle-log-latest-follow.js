(() => {
'use strict';
if(window.LQ_REQ136_BATTLE_LOG_LATEST_FOLLOW)return;

const SELECTOR='.lqBattleScrollableLog,.battleLogV10,.log';
let queued=false;
let settleTimers=[];

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

function clearSettleTimers(){
 settleTimers.forEach(clearTimeout);
 settleTimers=[];
}

function scheduleFollow(){
 if(!isBattle()){
  clearSettleTimers();
  return;
 }
 if(!queued){
  queued=true;
  requestAnimationFrame(()=>{
   queued=false;
   followLatest();
  });
 }
 clearSettleTimers();
 // The assembled runtime has several presentation add-ons that can replace or
 // decorate the battle DOM shortly after the base battle() render. Re-follow
 // during that bounded settle window so the final live log, not an intermediate
 // node, receives semantics and the latest-message scroll position.
 for(const delay of [40,120,240]){
  settleTimers.push(setTimeout(()=>{
   if(isBattle())followLatest();
  },delay));
 }
}

const app=document.getElementById('app');
if(app){
 new MutationObserver(()=>{
  if(isBattle())scheduleFollow();
  else clearSettleTimers();
 }).observe(app,{childList:true,subtree:true,characterData:true});
}

addEventListener('resize',()=>{if(isBattle())scheduleFollow()},{passive:true});
queueMicrotask(scheduleFollow);

window.LQ_REQ136_BATTLE_LOG_LATEST_FOLLOW={
 version:'1.0.1',
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
 assembledSettleFollow:true,
 iosPhysicalVerification:'PENDING',
 resolveLog,
 followLatest
};
})();
