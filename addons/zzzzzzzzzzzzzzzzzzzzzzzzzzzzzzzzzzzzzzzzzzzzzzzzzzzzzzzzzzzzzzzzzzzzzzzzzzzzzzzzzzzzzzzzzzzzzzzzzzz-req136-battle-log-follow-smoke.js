(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqReq136Smoke'))return;

function marker(data){
 let el=document.getElementById('lqReq136BattleLogFollowSmokeMarker');
 if(!el){el=document.createElement('i');el.id='lqReq136BattleLogFollowSmokeMarker';el.hidden=true;document.documentElement.appendChild(el);}
 Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));
 return el;
}
function settle(ms=100){return new Promise(resolve=>setTimeout(resolve,ms));}
function atBottom(log){return Math.abs((log.scrollHeight-log.clientHeight)-log.scrollTop)<=3;}

async function run(){
 const snapshot=structuredClone(s);
 const originalAction=action,originalMove=move;
 let worldActionCalls=0,worldMoveCalls=0;
 try{
  s.screen='battle';
  s.enemy={n:'REQ-136 TEST',e:'◈',hp:100,a:[1,1],xp:0,g:0};
  s.ehp=100;
  s.hp=Math.max(1,s.hp||42);
  const long='最新の戦闘結果をiPhoneで確実に読めることを確認するための長い診断メッセージ。'.repeat(3);
  s.log=Array.from({length:5},(_,i)=>`LOG-${i+1} ${long}`);
  battle();
  await settle(180);

  const api=window.LQ_REQ136_BATTLE_LOG_LATEST_FOLLOW;
  let log=api?.resolveLog?.();
  const resolved=!!log;
  const bounded=!!log&&getComputedStyle(log).overflowY==='auto'&&log.scrollHeight>log.clientHeight;
  const semantic=!!log&&log.getAttribute('role')==='log'&&log.getAttribute('aria-live')==='polite';
  const initialLatest=!!log&&atBottom(log);

  action=function(){worldActionCalls++;};
  move=function(){worldMoveCalls++;};
  s.log.push(`LOG-6 ${long}`);
  battle();
  await settle(180);
  log=api?.resolveLog?.();
  const rerenderResolved=!!log;
  const rerenderBounded=!!log&&getComputedStyle(log).overflowY==='auto'&&log.scrollHeight>log.clientHeight;
  const rerenderLatest=!!log&&atBottom(log);
  const semanticAfter=!!log&&log.getAttribute('role')==='log'&&log.getAttribute('aria-live')==='polite';
  const worldExcluded=worldActionCalls===0&&worldMoveCalls===0;

  const pass=!!api&&api.presentationOnly===true&&api.battleStateMutation===false&&api.pointerHandlerAdded===false&&api.clickHandlerAdded===false&&
   resolved&&bounded&&semantic&&initialLatest&&rerenderResolved&&rerenderBounded&&rerenderLatest&&semanticAfter&&worldExcluded;
  marker({pass,resolved,bounded,semantic,initialLatest,rerenderResolved,rerenderBounded,rerenderLatest,semanticAfter,worldExcluded,scrollTop:log?.scrollTop||0,scrollHeight:log?.scrollHeight||0,clientHeight:log?.clientHeight||0});
  if(!pass)console.error('REQ-136 acceptance details',document.getElementById('lqReq136BattleLogFollowSmokeMarker')?.dataset);
 }catch(error){
  console.error('REQ-136 smoke FAIL',error);
  marker({pass:false,reason:error?.message||String(error)});
 }finally{
  action=originalAction;move=originalMove;
  Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);
  render();
 }
}
if(document.readyState==='complete')setTimeout(run,900);
else addEventListener('load',()=>setTimeout(run,900),{once:true});
})();
