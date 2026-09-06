(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqSmoke'))return;
setTimeout(()=>{
 const api=window.LQ_ACCESSORY_SELL_STATUS,accessory=window.LQ_ACCESSORY_STATUS;
 const assert=(ok,msg)=>{if(!ok)throw new Error(`REQ-072 ${msg}`);};
 assert(api?.enabled===true,'status missing');
 assert(typeof window.lqSellAccessory==='function','sell authority missing');
 const snapshot=structuredClone(s),savedBefore=localStorage.getItem('lukeQuestV2');
 const saveBase=save,renderBase=render,sfxBase=window.LQ_sfx;
 let saveCalls=0;
 try{
  save=()=>{saveCalls++;};render=()=>{};window.LQ_sfx=()=>{};
  s.screen='world';s.map='shopInterior';s.shopOpen=true;s.gold=100;s.def=5;
  s.weapon='鉄の剣';s.armor='補強革鎧';s.inventory={herb:2,smoke:1};
  s.flags.lqAccessoryOwned=[];s.flags.lqAccessoryEquipped='';
  const protectedState={weapon:s.weapon,armor:s.armor,inventory:JSON.stringify(s.inventory)};

  let before=saveCalls,ok=window.lqSellAccessory('旅人の護符');
  assert(ok===false&&s.gold===100&&saveCalls===before,'unowned sell not rejected');

  s.flags.lqAccessoryOwned=['旅人の護符'];s.flags.lqAccessoryEquipped='旅人の護符';s.def=5;
  before=saveCalls;ok=window.lqSellAccessory('旅人の護符');
  assert(ok===false&&s.gold===100&&s.def===5&&accessory.owned().includes('旅人の護符')&&saveCalls===before,'equipped accessory sell mutated state');

  ok=window.lqEquipAccessory('');
  assert(ok===true&&s.def===4&&accessory.equipped()==='','unequip prerequisite failed');
  before=saveCalls;const goldBefore=s.gold;ok=window.lqSellAccessory('旅人の護符');
  assert(ok===true&&s.gold===goldBefore+30&&!accessory.owned().includes('旅人の護符')&&s.def===4&&saveCalls===before+1,'unequipped accessory sell contract failed');
  assert(s.weapon===protectedState.weapon&&s.armor===protectedState.armor&&JSON.stringify(s.inventory)===protectedState.inventory,'sale mutated unrelated equipment/inventory');

  s.gold=100;before=saveCalls;ok=window.lqBuyAccessory('旅人の護符');
  assert(ok===true&&accessory.owned().includes('旅人の護符')&&accessory.equipped()==='旅人の護符'&&s.gold===40&&s.def===5&&saveCalls===before+1,'sold accessory could not be re-bought via REQ-058');
 }finally{
  save=saveBase;render=renderBase;window.LQ_sfx=sfxBase;s=structuredClone(snapshot);
  if(savedBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',savedBefore);
  try{render();}catch{}
 }
 try{
  s.screen='world';s.map='shopInterior';s.shopOpen=true;s.pauseOpen=false;s.gold=100;s.flags.lqAccessoryOwned=['旅人の護符'];s.flags.lqAccessoryEquipped='';render();api.addSell();api.addSell();
  const rows=app.querySelectorAll('[data-accessory-sell="旅人の護符"]');
  assert(rows.length===1,'duplicate accessory sell rows');
  assert(rows[0].textContent.includes('30G')&&rows[0].textContent.includes('ACCESSORY'),'sell UI missing value/tag');
  s.flags.lqAccessoryEquipped='旅人の護符';render();
  const button=app.querySelector('[data-accessory-sell="旅人の護符"] button');
  assert(!!button&&button.disabled===true,'equipped accessory sell button not disabled');
  window.LQ_REQ072_SMOKE_PASS=true;
 }finally{s=structuredClone(snapshot);try{render();}catch{}}
},3600);
})();
