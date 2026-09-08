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
async function run(){
 const snapshot=structuredClone(s);
 const originalAction=action,originalMove=move;
 let actionCalls=0,moveCalls=0;
 try{
  const startXp=Number(s.xp||0),startG=Number(s.g||0);
  const enemy={n:'REQ-137 TEST',e:'◈',hp:1,a:[1,1],xp:17,g:9};
  s.screen='battle';s.enemy=enemy;s.ehp=0;s.log=[];
  action=function(){actionCalls++;};move=function(){moveCalls++;};
  winBase();
  await settle(160);
  const expected='REQ-137 TESTを倒した！ EXP17 / 9G';
  const rewardCount=Array.isArray(dialogue)?dialogue.filter(x=>x===expected).length:0;
  const victoryKept=Array.isArray(dialogue)&&dialogue.includes('戦闘勝利！');
  const rewardVisible=document.getElementById('app')?.textContent?.includes('戦闘勝利！')===true;
  const xpOnce=Number(s.xp)===startXp+17;
  const gOnce=Number(s.g)===startG+9;
  const world= s.screen==='world';
  render();await settle(80);
  const stillOne=Array.isArray(dialogue)&&dialogue.filter(x=>x===expected).length===1;
  const api=window.LQ_REQ137_BATTLE_VICTORY_REWARD_SUMMARY;
  const worldExcluded=actionCalls===0&&moveCalls===0;
  const pass=!!api&&api.canonicalWinBasePreserved===true&&api.rewardMutation===false&&api.pointerHandlerAdded===false&&api.clickHandlerAdded===false&&xpOnce&&gOnce&&world&&victoryKept&&rewardCount===1&&rewardVisible&&stillOne&&worldExcluded;
  marker({pass,xpOnce,gOnce,world,victoryKept,rewardCount,rewardVisible,stillOne,worldExcluded,dialogueLength:Array.isArray(dialogue)?dialogue.length:-1});
  if(!pass)console.error('REQ-137 acceptance details',document.getElementById('lqReq137VictoryRewardSmokeMarker')?.dataset,Array.isArray(dialogue)?dialogue:null);
 }catch(error){console.error('REQ-137 smoke FAIL',error);marker({pass:false,reason:error?.message||String(error)});}
 finally{action=originalAction;move=originalMove;Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();}
}
if(document.readyState==='complete')setTimeout(run,900);else addEventListener('load',()=>setTimeout(run,900),{once:true});
})();
