(() => {
'use strict';

/* REQ-032 — assembled-browser acceptance for the pre-existing canonical
   equipment chain (ux-v31 + ux-v40 + advanced-equipment.js). */
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
const snapshot=structuredClone(s);
const savedBefore=localStorage.getItem('lukeQuestV2');
function fail(reason){
  const el=document.createElement('i');
  el.id=`lqRuntimeSmokeFailure_REQ032_${String(reason).replace(/[^a-zA-Z0-9_-]+/g,'_').slice(0,120)}`;
  el.dataset.reason=String(reason);el.style.display='none';document.body.appendChild(el);
  const suppress=()=>{const core=document.getElementById('lqRuntimeSmokeMarker');if(core)core.id='lqCoreSmokeMarkerSuppressedByREQ032Failure';};
  suppress();setTimeout(suppress,4500);
}
function pass(data){const el=document.createElement('i');el.id='lqExistingEquipmentRuntimeSmokeMarker';el.style.display='none';for(const [k,v] of Object.entries(data))el.dataset[k]=String(v);document.body.appendChild(el);}
try{
  if(!window.LQ_EQUIPMENT_STATUS)throw new Error('equipment status missing');
  if(typeof window.lqEquipGear!=='function')throw new Error('equipment switch API missing');
  if(typeof window.lqBuyGood!=='function')throw new Error('shop purchase API missing');
  if(typeof window.lqBuyTier2!=='function')throw new Error('tier2 purchase API missing');

  s.screen='world';s.map='town';s.dialog=null;s.pauseOpen=true;s.shopOpen=false;
  s.atk=7;s.def=0;s.gold=999;
  s.weapon='旅人の短剣';s.armor='旅人服';
  s.equipmentOwned=['旅人の短剣','旅人服','青銅の剣','革の旅装','鉄の剣','補強革鎧'];

  const stateOk=s.weapon==='旅人の短剣'&&s.armor==='旅人服'&&Number.isFinite(s.def)&&Array.isArray(s.equipmentOwned);
  if(!stateOk)throw new Error('canonical equipment state invalid');

  window.lqEquipGear('weapon','青銅の剣');
  const bronzeOk=s.weapon==='青銅の剣'&&s.atk===10;
  if(!bronzeOk)throw new Error('tier1 weapon bonus incorrect');
  s.pauseOpen=true;window.lqEquipGear('weapon','旅人の短剣');
  const bronzeRevert=s.weapon==='旅人の短剣'&&s.atk===7;
  if(!bronzeRevert)throw new Error('tier1 weapon revert incorrect');

  s.pauseOpen=true;window.lqEquipGear('weapon','鉄の剣');
  const ironOk=s.weapon==='鉄の剣'&&s.atk===13;
  if(!ironOk)throw new Error('tier2 weapon bonus incorrect');
  s.pauseOpen=true;window.lqEquipGear('weapon','旅人の短剣');
  if(s.atk!==7)throw new Error('tier2 weapon revert incorrect');

  s.pauseOpen=true;window.lqEquipGear('armor','革の旅装');
  const leatherOk=s.armor==='革の旅装'&&s.def===2;
  if(!leatherOk)throw new Error('tier1 armor bonus incorrect');
  s.pauseOpen=true;window.lqEquipGear('armor','旅人服');
  if(s.def!==0)throw new Error('tier1 armor revert incorrect');

  s.pauseOpen=true;window.lqEquipGear('armor','補強革鎧');
  const reinforcedOk=s.armor==='補強革鎧'&&s.def===4;
  if(!reinforcedOk)throw new Error('tier2 armor bonus incorrect');
  s.pauseOpen=true;window.lqEquipGear('armor','旅人服');
  const armorRevert=s.armor==='旅人服'&&s.def===0;
  if(!armorRevert)throw new Error('tier2 armor revert incorrect');

  /* repeat switching must stay delta-based instead of accumulating stats */
  for(let i=0;i<3;i++){
    s.pauseOpen=true;window.lqEquipGear('weapon','青銅の剣');
    s.pauseOpen=true;window.lqEquipGear('weapon','旅人の短剣');
    s.pauseOpen=true;window.lqEquipGear('armor','革の旅装');
    s.pauseOpen=true;window.lqEquipGear('armor','旅人服');
  }
  const noDouble=s.atk===7&&s.def===0;
  if(!noDouble)throw new Error('equipment bonus accumulated across switches');

  s.pauseOpen=true;window.lqEquipGear('weapon','鉄の剣');
  s.pauseOpen=true;window.lqEquipGear('armor','補強革鎧');
  save();
  const persisted=JSON.parse(localStorage.getItem('lukeQuestV2')||'{}');
  const saveOk=persisted.weapon==='鉄の剣'&&persisted.armor==='補強革鎧'&&persisted.atk===13&&persisted.def===4&&Array.isArray(persisted.equipmentOwned)&&persisted.equipmentOwned.includes('鉄の剣')&&persisted.equipmentOwned.includes('補強革鎧');
  if(!saveOk)throw new Error('equipment persistence incorrect');

  const statusOk=!!window.LQ_EQUIPMENT_STATUS.weapon&&!!window.LQ_EQUIPMENT_STATUS.armor&&!!window.LQ_EQUIPMENT_STATUS.defenseStat&&!!window.LQ_EQUIPMENT_STATUS.shopPanel&&!!window.LQ_EQUIPMENT_STATUS.reEquipFromMenu&&Array.isArray(window.LQ_EQUIPMENT_STATUS.tier2);
  if(!statusOk)throw new Error('equipment capability status incomplete');

  pass({stateOk,bronzeOk,bronzeRevert,ironOk,leatherOk,reinforcedOk,armorRevert,noDouble,saveOk,statusOk});
}catch(err){fail(err&&err.message||String(err));}
finally{
  stopMoving();s=structuredClone(snapshot);
  if(savedBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',savedBefore);
  render();
}
})();
