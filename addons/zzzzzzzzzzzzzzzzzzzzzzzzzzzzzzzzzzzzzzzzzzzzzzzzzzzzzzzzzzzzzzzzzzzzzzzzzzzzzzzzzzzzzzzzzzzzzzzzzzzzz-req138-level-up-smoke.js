(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqReq138Smoke'))return;
function marker(data){let el=document.getElementById('lqReq138LevelUpSmokeMarker');if(!el){el=document.createElement('i');el.id='lqReq138LevelUpSmokeMarker';el.hidden=true;document.documentElement.appendChild(el);}Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));return el;}
function count(text,needle){return String(text||'').split(needle).length-1;}
function settle(ms=90){return new Promise(r=>setTimeout(r,ms));}
async function run(){
 const snapshot=structuredClone(s); const originalAction=action,originalMove=move; let actionCalls=0,moveCalls=0;
 try{
  action=function(){actionCalls++;};move=function(){moveCalls++;};
  s.lv=1;s.xp=0;s.nx=10;s.gold=0;s.wins=0;
  s.screen='battle';s.enemy={n:'REQ-138 TEST',e:'◈',hp:1,a:[1,1],xp:12,g:4};s.ehp=0;s.log=[];
  win(); await settle(160);
  const levelLine='レベルアップ！ LV1 → LV2';
  const rewardLine='REQ-138 TESTを倒した！ EXP12 / 4G';
  const levelOnce=Number(s.lv)===2;
  const xpCarry=Number(s.xp)===2;
  const goldOnce=Number(s.gold)===4;
  const winOnce=Number(s.wins)===1;
  const levelSummaryOnce=count(s.dialog?.text,levelLine)===1;
  const rewardSummaryOnce=count(s.dialog?.text,rewardLine)===1;
  const canonicalDialogueKept=String(s.dialog?.text||'').replace(levelLine,'').replace(rewardLine,'').trim().length>0;
  const visible=document.getElementById('app')?.textContent?.includes(levelLine)===true;
  render();await settle(80);
  const rerenderStillOne=count(s.dialog?.text,levelLine)===1;

  const firstDialog=String(s.dialog?.text||'');
  s.screen='battle';s.enemy={n:'REQ-138 NOLEVEL',e:'◈',hp:1,a:[1,1],xp:1,g:1};s.ehp=0;s.log=[];
  const beforeSecondLv=Number(s.lv);win();await settle(120);
  const noLevel=Number(s.lv)===beforeSecondLv;
  const noFalseSummary=!String(s.dialog?.text||'').includes(`レベルアップ！ LV${beforeSecondLv} →`);
  const api=window.LQ_REQ138_BATTLE_LEVEL_UP_SUMMARY;
  const safe=actionCalls===0&&moveCalls===0&&api?.canonicalWinPreserved===true&&api?.progressionMutation===false&&api?.pointerHandlerAdded===false&&api?.clickHandlerAdded===false&&api?.touchHandlerAdded===false;
  const pass=!!api?.installed&&levelOnce&&xpCarry&&goldOnce&&winOnce&&levelSummaryOnce&&rewardSummaryOnce&&canonicalDialogueKept&&visible&&rerenderStillOne&&firstDialog.includes(levelLine)&&noLevel&&noFalseSummary&&safe;
  marker({pass,levelOnce,xpCarry,goldOnce,winOnce,levelSummaryOnce,rewardSummaryOnce,canonicalDialogueKept,visible,rerenderStillOne,noLevel,noFalseSummary,safe});
 }catch(error){console.error('REQ-138 smoke FAIL',error);marker({pass:false,reason:error?.message||String(error)});}
 finally{action=originalAction;move=originalMove;Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();}
}
if(document.readyState==='complete')setTimeout(run,900);else addEventListener('load',()=>setTimeout(run,900),{once:true});
})();
