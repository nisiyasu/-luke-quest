(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqReq137Smoke'))return;
function marker(data){
 let el=document.getElementById('lqReq137VictoryRewardSmokeMarker');
 if(!el){el=document.createElement('i');el.id='lqReq137VictoryRewardSmokeMarker';el.hidden=true;document.documentElement.appendChild(el);}
 Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));
 return el;
}
function settle(ms=80){return new Promise(r=>setTimeout(r,ms));}
function occurrences(text,needle){return String(text||'').split(needle).length-1;}
async function run(){
 const snapshot=structuredClone(s);
 const originalAction=action,originalMove=move;
 let actionCalls=0,moveCalls=0;
 try{
  s.xp=0;s.gold=0;s.wins=0;s.nx=9999;
  const startXp=s.xp,startGold=s.gold;
  const enemy={n:'REQ-137 TEST',e:'◈',hp:1,a:[1,1],xp:17,g:9};
  s.screen='battle';s.enemy=enemy;s.ehp=0;s.log=[];
  render();await settle(80);
  action=function(){actionCalls++;};move=function(){moveCalls++;};
  win();
  await settle(160);
  const expected='REQ-137 TESTを倒した！ EXP17 / 9G';
  const dialogText=s.dialog?.text||'';
  const rewardCount=occurrences(dialogText,expected);
  const canonicalDialogueText=dialogText.replace(expected,'').trim();
  const canonicalDialogueKeptBeforeDismiss=rewardCount===1&&canonicalDialogueText.length>0;
  const overlay=document.getElementById('lqReq147VictoryOverlay');
  const battleSnapshotVisible=!!overlay?.querySelector('.lqReq147BattleSnapshot');
  const rewardVisible=overlay?.textContent?.includes('VICTORY')===true;
  const xpOnce=Number(s.xp)===startXp+17;
  const goldOnce=Number(s.gold)===startGold+9;
  const winOnce=Number(s.wins)===1;
  const world=s.screen==='world';
  const api=window.LQ_REQ137_BATTLE_VICTORY_REWARD_SUMMARY;
  const worldExcludedBeforeDismiss=actionCalls===0&&moveCalls===0;
  api?.dismissVictory?.();
  await settle(80);
  const overlayGone=!document.getElementById('lqReq147VictoryOverlay');
  const dialogueConsumed=s.dialog==null;
  const noSecondAction=actionCalls===0;
  const stillWorld=s.screen==='world';
  const pass=!!api&&api.canonicalWinPreserved===true&&api.rewardMutation===false&&api.postBattleDialogueConsumedAtomically===true&&xpOnce&&goldOnce&&winOnce&&world&&canonicalDialogueKeptBeforeDismiss&&rewardCount===1&&rewardVisible&&battleSnapshotVisible&&worldExcludedBeforeDismiss&&overlayGone&&dialogueConsumed&&noSecondAction&&stillWorld;
  marker({pass,xpOnce,goldOnce,winOnce,world,canonicalDialogueKeptBeforeDismiss,rewardCount,rewardVisible,battleSnapshotVisible,worldExcludedBeforeDismiss,overlayGone,dialogueConsumed,noSecondAction,stillWorld});
  if(!pass)console.error('REQ-137/147 acceptance details',document.getElementById('lqReq137VictoryRewardSmokeMarker')?.dataset,s.dialog);
 }catch(error){console.error('REQ-137 smoke FAIL',error);marker({pass:false,reason:error?.message||String(error)});}
 finally{action=originalAction;move=originalMove;document.getElementById('lqReq147VictoryOverlay')?.remove();Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();}
}
if(document.readyState==='complete')setTimeout(run,900);else addEventListener('load',()=>setTimeout(run,900),{once:true});
})();
