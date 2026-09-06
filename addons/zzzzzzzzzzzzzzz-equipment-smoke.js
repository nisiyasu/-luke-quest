(() => {
'use strict';

/* REQ-032 assembled browser acceptance. Runs synchronously before delayed
   world smoke probes, restores player state afterwards, and fails through the
   existing generic runtime-failure channel. */
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
const snapshot=structuredClone(s);
const savedBefore=localStorage.getItem('lukeQuestV2');
function mark(ok,data={}){
  const el=document.createElement('i');
  el.id=ok?'lqEquipmentRuntimeSmokeMarker':'lqRuntimeSmokeFailure_REQ032';
  el.style.display='none';
  for(const [k,v] of Object.entries(data))el.dataset[k]=String(v);
  document.body.appendChild(el);
  return el;
}
try{
  if(!window.LQ_EQUIPMENT_TEST_API||!window.LQ_EQUIPMENT_STATUS)throw new Error('equipment API missing');
  const api=window.LQ_EQUIPMENT_TEST_API;

  delete s.equipment;delete s.equipmentOwned;delete s.equipmentApplied;
  s.atk=7;s.mh=42;s.hp=42;s.flags=Object.assign({},s.flags||{});delete s.flags.lqGatehouseEquipmentClaimed;
  api.normalize();
  const oldSaveMigrated=!!s.equipment&&s.equipment.weapon==='travelerKnife'&&s.equipment.armor==='travelGarb'&&s.atk===7&&s.mh===42;
  if(!oldSaveMigrated)throw new Error('old save migration changed base stats');

  api.installLocker();
  const locker=(MAPS.aldiaCastleGatehouse?.npcs||[]).find(n=>n.kind==='lqEquipmentLocker');
  if(!locker||locker.x!==6||locker.y!==6)throw new Error('gatehouse equipment locker missing');
  s.screen='world';s.map='aldiaCastleGatehouse';s.x=6;s.y=7;s.dir='up';s.dialog=null;render();action();
  const acquired=api.own('trainingIronSword')&&api.own('leatherBreastplate')&&!!s.flags.lqGatehouseEquipmentClaimed;
  if(!acquired)throw new Error('canonical equipment acquisition failed');
  const ownedCountBefore=Object.keys(s.equipmentOwned).filter(k=>s.equipmentOwned[k]).length;
  s.dialog=null;action();
  const ownedCountAfter=Object.keys(s.equipmentOwned).filter(k=>s.equipmentOwned[k]).length;
  const noDuplicate=ownedCountAfter===ownedCountBefore;
  if(!noDuplicate)throw new Error('equipment duplicated on repeat action');

  s.dialog=null;openMenu();
  const menuButton=app.querySelector('.lqEquipmentMenuButton');
  if(!menuButton)throw new Error('equipment menu button missing');
  menuButton.click();
  const iron=app.querySelector('[data-equip-id="trainingIronSword"]');
  const leather=app.querySelector('[data-equip-id="leatherBreastplate"]');
  if(!iron||!leather)throw new Error('owned equipment choices missing');

  const baseAtk=s.atk;
  iron.click();
  const weaponApplied=s.equipment.weapon==='trainingIronSword'&&s.atk===baseAtk+3;
  if(!weaponApplied)throw new Error('weapon bonus not applied exactly once');
  window.lqEquipItem('travelerKnife');
  const weaponRemoved=s.atk===baseAtk;
  if(!weaponRemoved)throw new Error('weapon bonus did not reverse cleanly');
  window.lqEquipItem('trainingIronSword');

  const baseMh=s.mh;
  window.lqEquipItem('leatherBreastplate');
  const armorApplied=s.equipment.armor==='leatherBreastplate'&&s.mh===baseMh+6;
  if(!armorApplied)throw new Error('armor HP bonus not applied exactly once');
  window.lqEquipItem('travelGarb');
  const armorRemoved=s.mh===baseMh;
  if(!armorRemoved)throw new Error('armor HP bonus did not reverse cleanly');
  window.lqEquipItem('leatherBreastplate');

  const stableAtk=s.atk,stableMh=s.mh;
  api.normalize();api.normalize();render();
  const noDoubleApply=s.atk===stableAtk&&s.mh===stableMh;
  if(!noDoubleApply)throw new Error('equipment bonus doubled during normalize/render');

  save();
  const persisted=JSON.parse(localStorage.getItem('lukeQuestV2')||'{}');
  const saveOk=persisted.equipment?.weapon==='trainingIronSword'&&persisted.equipment?.armor==='leatherBreastplate'&&persisted.equipmentApplied?.weaponBonus===3&&persisted.equipmentApplied?.armorHpBonus===6;
  if(!saveOk)throw new Error('equipment state not persisted');

  mark(true,{oldSaveMigrated,acquired,noDuplicate,menuButton:true,weaponApplied,weaponRemoved,armorApplied,armorRemoved,noDoubleApply,saveOk});
}catch(err){
  const reason=err&&err.message||String(err);
  const slug=reason.replace(/[^a-zA-Z0-9_-]+/g,'_').slice(0,120)||'unknown';
  const fail=mark(false,{reason});fail.id=`lqRuntimeSmokeFailure_REQ032_${slug}`;
  const core=document.getElementById('lqRuntimeSmokeMarker');if(core)core.id='lqCoreSmokeMarkerSuppressedByREQ032Failure';
}finally{
  stopMoving();
  s=structuredClone(snapshot);
  if(savedBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',savedBefore);
  render();
}
})();
