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
  action=function(){actionCalls++;return originalAction.apply(this,arguments);};
  move=function(){moveCalls++;return originalMove.apply(this,arguments);};
  win();
  await settle(120);
  const expected='REQ-137 TESTを倒した！ EXP17 / 9G';
  const dialog=s.dialog||null;
  const dialogText=dialog?.text||'';
  const rewardCount=occurrences(dialogText,expected);
  const lukeCommentKept=dialog?.name==='ルーク'||dialogText.includes('ルーク');
  const canonicalDialogueKept=rewardCount===1&&dialogText.replace(expected,'').trim().length>0;
  const battleFrame=document.getElementById('lqVictoryBattleFrame');
  const backdrop=document.getElementById('lqVictoryBattleBackdrop');
  const canonicalDialog=!!battleFrame?.querySelector('.dialogBox');
  const victoryVisible=battleFrame?.querySelector('.lqReq148VictoryBanner')?.textContent?.trim()==='VICTORY';
  const battleStillVisible=!!backdrop&&backdrop.textContent.includes('REQ-137 TEST');
  const backdropStyle=backdrop?getComputedStyle(backdrop):null;
  const dimmed=!!backdropStyle&&backdropStyle.filter.includes('brightness');
  const blurred=!!backdropStyle&&backdropStyle.filter.includes('blur');
  const xpOnce=Number(s.xp)===startXp+17;
  const goldOnce=Number(s.gold)===startGold+9;
  const winOnce=Number(s.wins)===1;
  const worldState=s.screen==='world';
  const api=window.LQ_REQ137_BATTLE_VICTORY_REWARD_SUMMARY;
  const beforeDismissNoAction=actionCalls===0&&moveCalls===0;
  battleFrame?.querySelector('.dialogBox')?.click();
  await settle(100);
  const dialogueConsumed=s.dialog==null;
  const oneDismissAction=actionCalls===1;
  const stillWorld=s.screen==='world';
  const battleFrameGone=!document.getElementById('lqVictoryBattleFrame');
  const pass=!!api&&api.canonicalWinPreserved===true&&api.canonicalDialogPreserved===true&&api.victoryLabelVisible===true&&api.battleBackdropDimmed===true&&api.battleBackdropBlurred===true&&api.battleFrameHeldUntilDismiss===true&&api.rewardMutation===false&&xpOnce&&goldOnce&&winOnce&&worldState&&canonicalDialogueKept&&lukeCommentKept&&rewardCount===1&&canonicalDialog&&victoryVisible&&battleStillVisible&&dimmed&&blurred&&beforeDismissNoAction&&dialogueConsumed&&oneDismissAction&&stillWorld&&battleFrameGone;
  marker({pass,xpOnce,goldOnce,winOnce,worldState,canonicalDialogueKept,lukeCommentKept,rewardCount,canonicalDialog,victoryVisible,battleStillVisible,dimmed,blurred,beforeDismissNoAction,dialogueConsumed,oneDismissAction,stillWorld,battleFrameGone});
  if(!pass)console.error('REQ-148 acceptance details',document.getElementById('lqReq137VictoryRewardSmokeMarker')?.dataset,s.dialog);
 }catch(error){console.error('REQ-148 smoke FAIL',error);marker({pass:false,reason:error?.message||String(error)});}
 finally{action=originalAction;move=originalMove;document.getElementById('lqVictoryBattleFrame')?.remove();Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();}
}
if(document.readyState==='complete')setTimeout(run,900);else addEventListener('load',()=>setTimeout(run,900),{once:true});
})();
