(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqReq147Smoke'))return;
function marker(data){let el=document.getElementById('lqReq147SmokeMarker');if(!el){el=document.createElement('i');el.id='lqReq147SmokeMarker';el.hidden=true;document.documentElement.appendChild(el);}Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));return el;}
function fail(reason){console.error('REQ-147 smoke FAIL',reason);marker({pass:false,reason});}
function settle(ms=80){return new Promise(r=>setTimeout(r,ms));}
async function run(){
 const snapshot=structuredClone(s);
 try{
  s.screen='battle';
  s.enemy={n:'REQ-147 TEST',e:'◈',hp:1,a:[0,0],xp:0,g:0};
  s.ehp=0;
  s.log=['REQ-147 victory acceptance'];
  s.hp=Math.max(1,s.hp||42);
  battle();
  await settle();
  const commandRows=[...document.querySelectorAll('#app .lqReq147BattleCommandGrid')];
  const rowColumns=commandRows.map(row=>getComputedStyle(row).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length);
  const twoColumnCommands=commandRows.length>=2&&commandRows.every((row,i)=>rowColumns[i]===2&&[...row.children].filter(el=>el.matches('button,.btn')).length===2);
  win();
  await settle(120);
  const victoryDialog=document.querySelector('#lqVictoryBattleFrame .dialogBox[aria-label="戦闘勝利"]');
  const battleFrame=document.getElementById('lqVictoryBattleFrame');
  const noSeparateOverlay=!document.getElementById('lqReq147VictoryOverlay');
  const battleContext=!!battleFrame&&battleFrame.textContent.includes('REQ-147 TEST');
  const lukeComment=!!victoryDialog&&(victoryDialog.textContent||'').includes('ルーク');
  const victoryState=s.dialog;
  const dialogBeforeDismiss=!!victoryState&&!!victoryDialog;
  victoryDialog?.click();
  await settle(100);
  const victoryGone=!document.querySelector('.dialogBox[aria-label="戦闘勝利"]');
  const battleFrameGone=!document.getElementById('lqVictoryBattleFrame');
  const victoryStateGone=s.dialog!==victoryState;
  const oneDismissClean=victoryGone&&battleFrameGone&&victoryStateGone&&s.screen==='world';
  const pass=twoColumnCommands&&noSeparateOverlay&&battleContext&&lukeComment&&dialogBeforeDismiss&&oneDismissClean;
  marker({pass,twoColumnCommands,commandRows:commandRows.length,rowColumns:rowColumns.join(','),noSeparateOverlay,battleContext,lukeComment,dialogBeforeDismiss,victoryGone,battleFrameGone,victoryStateGone,oneDismissClean,screenAfterDismiss:s.screen||''});
 }catch(error){fail(error?.message||String(error));}
 finally{document.getElementById('lqVictoryBattleFrame')?.remove();Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();}
}
if(document.readyState==='complete')setTimeout(run,900);else addEventListener('load',()=>setTimeout(run,900),{once:true});
})();
