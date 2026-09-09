(() => {
'use strict';
if(window.LQ_REQ137_BATTLE_VICTORY_REWARD_SUMMARY)return;
if(typeof win!=='function')return;

const canonicalWin=win;
const VICTORY_OVERLAY_ID='lqReq147VictoryOverlay';
let dismissing=false;

function rewardLine(enemy){
 return `${enemy.n}を倒した！ EXP${enemy.xp} / ${enemy.g}G`;
}

function captureBattleSnapshot(){
 if(typeof s==='undefined'||!s||s.screen!=='battle')return null;
 const app=document.getElementById('app');
 if(!app)return null;
 const snapshot=app.cloneNode(true);
 snapshot.removeAttribute('id');
 snapshot.classList.add('lqReq147BattleSnapshot');
 snapshot.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
 snapshot.querySelectorAll('button,a,input,select,textarea').forEach(node=>{
  node.removeAttribute('onclick');
  node.removeAttribute('onpointerdown');
  node.removeAttribute('onpointerup');
  node.setAttribute('tabindex','-1');
  node.setAttribute('aria-hidden','true');
 });
 snapshot.setAttribute('inert','');
 return snapshot;
}

function dismissVictory(){
 if(dismissing)return;
 dismissing=true;
 const overlay=document.getElementById(VICTORY_OVERLAY_ID);
 if(overlay)overlay.remove();
 try{
  // canonical win() has already completed all reward/progression mutations and
  // created the post-battle dialogue. The Owner wants that acknowledgement
  // consumed by this same result-dismiss gesture, so clear only that dialogue
  // atomically instead of routing through later action() wrappers that may add
  // their own post-action behavior.
  if(typeof s!=='undefined'&&s&&s.dialog)s.dialog=null;
  if(typeof render==='function')render();
 } finally {
  dismissing=false;
 }
}

function showVictory(snapshot){
 if(!snapshot||document.getElementById(VICTORY_OVERLAY_ID))return;
 const overlay=document.createElement('div');
 overlay.id=VICTORY_OVERLAY_ID;
 overlay.className='lqReq147VictoryOverlay';
 overlay.setAttribute('role','dialog');
 overlay.setAttribute('aria-modal','true');
 overlay.setAttribute('aria-label','戦闘勝利');

 const stage=document.createElement('div');
 stage.className='lqReq147VictoryStage';
 stage.appendChild(snapshot);

 const banner=document.createElement('button');
 banner.type='button';
 banner.className='lqReq147VictoryBanner';
 banner.textContent='VICTORY';
 banner.setAttribute('aria-label','VICTORY。タップして戦闘結果を閉じる');
 banner.addEventListener('click',dismissVictory,{once:true});

 overlay.append(stage,banner);
 document.body.appendChild(overlay);
 requestAnimationFrame(()=>banner.focus({preventScroll:true}));
}

const style=document.createElement('style');
style.id='lq-req147-victory-style';
style.textContent=`
.lqReq147VictoryOverlay{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:stretch;background:#071018;isolation:isolate}
.lqReq147VictoryStage{position:absolute;inset:0;overflow:hidden;pointer-events:none;opacity:.92}
.lqReq147BattleSnapshot{width:100%;height:100%;min-height:100dvh;overflow:hidden;filter:saturate(.86) brightness(.72)}
.lqReq147VictoryOverlay:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.34));pointer-events:none}
.lqReq147VictoryBanner{position:absolute;z-index:2;left:50%;top:48%;transform:translate(-50%,-50%);min-width:min(78vw,330px);min-height:72px;padding:18px 24px;border:2px solid rgba(255,255,255,.88);border-radius:16px;background:rgba(5,12,20,.82);color:#fff;font:900 clamp(30px,10vw,54px)/1 system-ui,sans-serif;letter-spacing:.12em;text-indent:.12em;box-shadow:0 14px 42px rgba(0,0,0,.45);touch-action:manipulation}
.lqReq147VictoryBanner:focus-visible{outline:3px solid #fff;outline-offset:4px}
@media(prefers-reduced-motion:reduce){.lqReq147VictoryBanner{transition:none}}
`;
document.head.appendChild(style);

win=function(){
 const defeated=(typeof s!=='undefined'&&s&&s.enemy)
  ? {n:s.enemy.n,xp:s.enemy.xp,g:s.enemy.g}
  : null;
 const snapshot=captureBattleSnapshot();
 const result=canonicalWin.apply(this,arguments);
 if(defeated&&typeof s!=='undefined'&&s&&s.dialog&&typeof s.dialog.text==='string'){
  const line=rewardLine(defeated);
  if(!s.dialog.text.includes(line)){
   s.dialog={...s.dialog,text:`${s.dialog.text}\n${line}`};
   if(typeof render==='function')render();
  }
 }
 if(defeated&&snapshot)showVictory(snapshot);
 return result;
};

window.LQ_REQ137_BATTLE_VICTORY_REWARD_SUMMARY={
 version:'1.1.1',
 requirement:'REQ-137/REQ-147',
 canonicalWinPreserved:true,
 rewardMutation:false,
 battleBalanceMutation:false,
 saveSchemaChange:false,
 storyMutation:false,
 postBattleDialogueConsumedAtomically:true,
 victoryPresentationBeforePostBattleAcknowledgement:true,
 duplicateBattleAuthority:false,
 rewardLine,
 dismissVictory,
 iosPhysicalVerification:'PENDING'
};
})();
