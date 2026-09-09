(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqReq147Smoke'))return;
function marker(data){let el=document.getElementById('lqReq147SmokeMarker');if(!el){el=document.createElement('i');el.id='lqReq147SmokeMarker';el.hidden=true;document.documentElement.appendChild(el);}Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));return el;}
function fail(reason){console.error('REQ-147 smoke FAIL',reason);marker({pass:false,reason});}
async function run(){
 const snapshot=structuredClone(s);
 try{
  s.screen='battle';
  s.enemy={n:'REQ-147 TEST',e:'◈',hp:1,a:[0,0],xp:0,g:0};
  s.ehp=0;
  s.log=['REQ-147 victory acceptance'];
  s.hp=Math.max(1,s.hp||42);
  battle();
  await new Promise(r=>requestAnimationFrame(()=>r()));
  const before=document.querySelector('#app')?.textContent||'';
  win();
  await new Promise(r=>requestAnimationFrame(()=>r()));
  const overlay=document.getElementById('lqReq147VictoryOverlay');
  const banner=overlay?.querySelector('.lqReq147VictoryBanner');
  const battleSnapshot=overlay?.querySelector('.lqReq147BattleSnapshot');
  const dialogBeforeDismiss=!!s.dialog;
  const overlayBattleContext=!!overlay&&!!battleSnapshot&&before.length>0&&(battleSnapshot.textContent||'').length>0;
  banner?.click();
  await new Promise(r=>requestAnimationFrame(()=>r()));
  const oneDismissClean=!document.getElementById('lqReq147VictoryOverlay')&&!s.dialog;
  const pass=window.LQ_REQ137_BATTLE_VICTORY_REWARD_SUMMARY?.victoryPresentationBeforePostBattleAcknowledgement===true&&overlayBattleContext&&dialogBeforeDismiss&&oneDismissClean;
  marker({pass,overlayBattleContext,dialogBeforeDismiss,oneDismissClean,screenAfterDismiss:s.screen||''});
 }catch(error){fail(error?.message||String(error));}
 finally{Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);document.getElementById('lqReq147VictoryOverlay')?.remove();render();}
}
if(document.readyState==='complete')setTimeout(run,900);else addEventListener('load',()=>setTimeout(run,900),{once:true});
})();
