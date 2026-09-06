(() => {
'use strict';
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
queueMicrotask(()=>{
 const api=window.LQ_NEW_GAME_OVERWRITE_GUARD_STATUS;
 const assert=(ok,msg)=>{if(!ok)throw new Error(`REQ-069 ${msg}`);};
 assert(api?.enabled===true,'status missing');
 const originalRaw=localStorage.getItem(api.saveKey),snapshot=JSON.stringify(s);
 try{
  const resumable={...JSON.parse(JSON.stringify(s)),screen:'world',map:'town',x:9,y:12,lv:9,hp:35,mh:50};
  localStorage.setItem(api.saveKey,JSON.stringify(resumable));
  Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,resumable,{screen:'title'});
  app.innerHTML='<button class="btn gold" onclick="newGame()">冒険をはじめる</button><button class="btn gray" onclick="continueGame()">つづきから</button><div class="lqTitleTransfer">TRANSFER</div>';
  const beforeRaw=localStorage.getItem(api.saveKey);
  newGame();
  assert(localStorage.getItem(api.saveKey)===beforeRaw,'first tap mutated raw save');
  assert(api.isArmed()===true,'first tap did not arm confirmation');
  assert(!!app.querySelector('.lqNewGameOverwriteWarning'),'warning missing');
  assert(!!app.querySelector('button[onclick="continueGame()"]'),'continue removed while armed');
  assert(!!app.querySelector('.lqTitleTransfer'),'transfer removed while armed');

  newGame();
  assert(s.screen==='intro','second tap did not use canonical new game path');
  assert(api.isArmed()===false,'confirmation stayed armed after new game');
  const after=JSON.parse(localStorage.getItem(api.saveKey)||'null');
  assert(after?.screen==='intro','canonical new game did not persist intro state');

  const bootstrap={...resumable,screen:'title'};
  localStorage.setItem(api.saveKey,JSON.stringify(bootstrap));
  Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,bootstrap);
  app.innerHTML='<button class="btn gold" onclick="newGame()">冒険をはじめる</button>';
  newGame();
  assert(s.screen==='intro','non-resumable title did not remain one-tap');
  assert(api.isArmed()===false,'non-resumable title falsely armed');
  window.LQ_REQ069_SMOKE_PASS=true;
 }finally{
  api.disarm();
  try{const old=JSON.parse(snapshot);Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,old);render();}catch{}
  if(originalRaw===null)localStorage.removeItem(api.saveKey);else localStorage.setItem(api.saveKey,originalRaw);
 }
});
})();
