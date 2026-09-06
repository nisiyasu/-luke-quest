(() => {
'use strict';

/* REQ-032 — persistent weapon/armor foundation.
   Equipment bonuses are reconciled into the existing canonical s.atk / s.mh
   instead of replacing combat formulas, so attack/skill/level-up wrappers remain intact. */

const ITEMS={
  travelerKnife:{id:'travelerKnife',name:'旅人の短剣',slot:'weapon',atk:0,hp:0},
  trainingIronSword:{id:'trainingIronSword',name:'訓練用鉄剣',slot:'weapon',atk:3,hp:0},
  travelGarb:{id:'travelGarb',name:'旅装',slot:'armor',atk:0,hp:0},
  leatherBreastplate:{id:'leatherBreastplate',name:'革の胸当て',slot:'armor',atk:0,hp:6}
};
const DEFAULT_EQUIPMENT={weapon:'travelerKnife',armor:'travelGarb'};
const LOCKER_FLAG='lqGatehouseEquipmentClaimed';
const LOCKER_KIND='lqEquipmentLocker';
const GATEHOUSE='aldiaCastleGatehouse';
const LOCKER_X=6,LOCKER_Y=6;

DEFAULT.equipment=Object.assign({},DEFAULT_EQUIPMENT);
DEFAULT.equipmentOwned={travelerKnife:true,travelGarb:true};
DEFAULT.equipmentApplied={weaponBonus:0,armorHpBonus:0};

function validForSlot(id,slot){return !!ITEMS[id]&&ITEMS[id].slot===slot;}
function ensureEquipmentState(){
  if(!s.equipment||typeof s.equipment!=='object')s.equipment=Object.assign({},DEFAULT_EQUIPMENT);
  if(!validForSlot(s.equipment.weapon,'weapon'))s.equipment.weapon=DEFAULT_EQUIPMENT.weapon;
  if(!validForSlot(s.equipment.armor,'armor'))s.equipment.armor=DEFAULT_EQUIPMENT.armor;
  if(!s.equipmentOwned||typeof s.equipmentOwned!=='object')s.equipmentOwned={};
  s.equipmentOwned.travelerKnife=true;
  s.equipmentOwned.travelGarb=true;
  if(!s.equipmentApplied||typeof s.equipmentApplied!=='object')s.equipmentApplied={weaponBonus:0,armorHpBonus:0};
  if(!Number.isFinite(s.equipmentApplied.weaponBonus))s.equipmentApplied.weaponBonus=0;
  if(!Number.isFinite(s.equipmentApplied.armorHpBonus))s.equipmentApplied.armorHpBonus=0;
  if(!Number.isFinite(s.atk))s.atk=7;
  if(!Number.isFinite(s.mh)||s.mh<1)s.mh=42;
  if(!Number.isFinite(s.hp))s.hp=s.mh;
}
function reconcileEquipment(){
  ensureEquipmentState();
  const weapon=ITEMS[s.equipment.weapon];
  const armor=ITEMS[s.equipment.armor];
  const oldWeapon=Number(s.equipmentApplied.weaponBonus)||0;
  const oldArmor=Number(s.equipmentApplied.armorHpBonus)||0;
  const newWeapon=weapon.atk||0;
  const newArmor=armor.hp||0;
  if(newWeapon!==oldWeapon)s.atk=Math.max(1,s.atk-oldWeapon+newWeapon);
  if(newArmor!==oldArmor){
    s.mh=Math.max(1,s.mh-oldArmor+newArmor);
    s.hp=Math.max(0,Math.min(s.mh,s.hp));
  }
  s.equipmentApplied.weaponBonus=newWeapon;
  s.equipmentApplied.armorHpBonus=newArmor;
  return {weapon,armor};
}
function own(id){ensureEquipmentState();return !!s.equipmentOwned[id];}
function addOwned(id){ensureEquipmentState();if(ITEMS[id])s.equipmentOwned[id]=true;}
function equipmentSummary(){
  const {weapon,armor}=reconcileEquipment();
  return `武器：${weapon.name} / 防具：${armor.name}\nATK：${s.atk} / 最大HP：${s.mh}`;
}

function equip(id){
  ensureEquipmentState();
  const item=ITEMS[id];
  if(!item||!own(id))return false;
  s.equipment[item.slot]=id;
  reconcileEquipment();
  save();
  return true;
}

function showEquipment(){
  stopMoving();
  reconcileEquipment();
  s.dialog={name:'装備',text:equipmentSummary()};
  render();
}
window.lqOpenEquipment=showEquipment;
window.lqEquipItem=function(id){if(equip(id)){s.dialog={name:'装備',text:equipmentSummary()};render();return true;}return false;};

function equipmentButton(item){
  const btn=document.createElement('button');
  btn.className='btn gray lqExplicitControl lqEquipmentChoice';
  btn.dataset.equipId=item.id;
  const equipped=s.equipment[item.slot]===item.id;
  const effect=item.slot==='weapon'?`ATK +${item.atk}`:`最大HP +${item.hp}`;
  btn.textContent=`${item.slot==='weapon'?'⚔':'🛡'} ${item.name}　${effect}${equipped?'　[装備中]':''}`;
  btn.disabled=equipped;
  btn.onclick=e=>{e.preventDefault();e.stopPropagation();window.lqEquipItem(item.id);};
  return btn;
}
function injectEquipmentUi(){
  if(s.screen!=='world'||!s.dialog)return;
  const box=app.querySelector('.dialogBox');
  if(!box)return;
  if(s.dialog.name==='冒険メモ'&&!box.querySelector('.lqEquipmentMenuButton')){
    const btn=document.createElement('button');
    btn.className='btn gray lqExplicitControl lqEquipmentMenuButton';
    btn.textContent='⚔ 装備';
    btn.onclick=e=>{e.preventDefault();e.stopPropagation();showEquipment();};
    box.appendChild(btn);
  }
  if(s.dialog.name==='装備'&&!box.querySelector('.lqEquipmentChoices')){
    const wrap=document.createElement('div');wrap.className='lqEquipmentChoices';
    const owned=Object.keys(ITEMS).map(id=>ITEMS[id]).filter(item=>own(item.id));
    owned.filter(i=>i.slot==='weapon').forEach(i=>wrap.appendChild(equipmentButton(i)));
    owned.filter(i=>i.slot==='armor').forEach(i=>wrap.appendChild(equipmentButton(i)));
    box.appendChild(wrap);
  }
}

function installLocker(){
  const map=MAPS[GATEHOUSE];
  if(!map||!Array.isArray(map.npcs)||map.npcs.some(n=>n.kind===LOCKER_KIND))return;
  if(map.npcs.some(n=>n.x===LOCKER_X&&n.y===LOCKER_Y))return;
  map.npcs.push({x:LOCKER_X,y:LOCKER_Y,e:'',name:'門衛予備装備箱',kind:LOCKER_KIND,text:'門衛訓練用の予備装備が整理されている。'});
}

const baseNpcClass=npcClass;
npcClass=function(n){if(n?.kind===LOCKER_KIND)return'npc lqEquipmentLocker';return baseNpcClass(n);};
const style=document.createElement('style');
style.textContent=`
.lqEquipmentLocker{width:42px;height:36px;font-size:0;border:3px solid #b09a70;border-radius:5px;background:linear-gradient(#7a5a39,#4b3525);box-shadow:inset 0 0 0 2px #2d2119,0 5px 9px #0009}.lqEquipmentLocker:before{content:'⚔';position:absolute;left:5px;top:1px;font-size:20px;color:#e8edf2;text-shadow:18px 9px 0 #d6bd82,0 2px 3px #000}.lqEquipmentLocker:after{content:'';position:absolute;left:17px;top:15px;width:8px;height:7px;border-radius:2px;background:#e5c66e;box-shadow:0 0 5px #ffd96d}.lqEquipmentChoices{display:grid;grid-template-columns:1fr;gap:4px;margin-top:8px}.lqEquipmentChoice{margin:2px 0;padding:10px;text-align:left}.lqEquipmentChoice:disabled{opacity:.72;border:1px solid #7ec8ff;background:#254566}
`;
document.head.appendChild(style);

const baseAction=action;
action=function(){
  installLocker();
  if(!s.dialog&&s.screen==='world'&&s.map===GATEHOUSE){
    const p=front();
    const n=(MAPS[GATEHOUSE].npcs||[]).find(q=>q.x===p.x&&q.y===p.y);
    if(n?.kind===LOCKER_KIND){
      stopMoving();ensureEquipmentState();if(!s.flags||typeof s.flags!=='object')s.flags={};
      if(!s.flags[LOCKER_FLAG]){
        addOwned('trainingIronSword');addOwned('leatherBreastplate');s.flags[LOCKER_FLAG]=true;
        s.dialog={name:'門衛予備装備箱',text:'訓練用鉄剣と革の胸当てを借りた。\nMENUの「装備」から付け替えられる。\nルーク「借り物なら、勇者でも壊さない方向で頑張ります。」'};
      }else{
        s.dialog={name:'門衛予備装備箱',text:'予備装備はすでに借りている。返却札にはルークの名前が書かれている。'};
      }
      save();render();return;
    }
  }
  return baseAction();
};

const baseRender=render;
render=function(){
  reconcileEquipment();installLocker();
  const result=baseRender();
  injectEquipmentUi();
  return result;
};

const baseNewGame=newGame;
newGame=function(){const result=baseNewGame();reconcileEquipment();save();return result;};
const baseContinueGame=continueGame;
continueGame=function(){reconcileEquipment();const result=baseContinueGame();reconcileEquipment();save();return result;};

reconcileEquipment();installLocker();save();
window.LQ_EQUIPMENT_ITEMS=ITEMS;
window.LQ_EQUIPMENT_STATUS={version:'1.0',weaponSlot:true,armorSlot:true,persistent:true,oldSaveMigration:true,deltaReconciliation:true,canonicalAtkIntegration:true,armorMaxHpIntegration:true,gatehouseAcquisition:true,menuUi:true,locker:{map:GATEHOUSE,x:LOCKER_X,y:LOCKER_Y,flag:LOCKER_FLAG},iosPhysicalVerification:'PENDING'};
window.LQ_EQUIPMENT_TEST_API={normalize:reconcileEquipment,equip,own,installLocker,summary:equipmentSummary};
})();
