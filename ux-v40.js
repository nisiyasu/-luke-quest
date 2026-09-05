(() => {
'use strict';

/* LUKE QUEST v0.40 explicit equipment switching from the adventure menu. */

const WEAPON_BONUS={'旅人の短剣':0,'青銅の剣':3};
const ARMOR_BONUS={'旅人服':0,'革の旅装':2};

const style=document.createElement('style');
style.textContent=`
.lqEquipManage{margin-top:8px;display:grid;gap:7px}.lqEquipManageRow{display:grid;grid-template-columns:52px 1fr;gap:7px;align-items:center}.lqEquipManageLabel{color:#8fa4b8;font-size:9px;font-weight:900}.lqGearButtons{display:flex;gap:6px;flex-wrap:wrap}.lqGearButton{min-height:38px;padding:6px 9px;border-radius:8px;border:1px solid #ffffff20;background:#263b4d;color:#e8f0f5;font-size:10px;font-weight:900}.lqGearButton.active{background:#725e2d;border-color:#f0d16d88;color:#fff0b5}.lqGearButton:active{transform:translateY(1px)}
`;
document.head.appendChild(style);

function addEquipManager(){
 if(!s.pauseOpen||s.screen!=='world')return;
 const sections=Array.from(app.querySelectorAll('.lqPauseSection'));const equip=sections.find(x=>x.querySelector('h3')?.textContent.includes('EQUIPMENT'));
 if(!equip||equip.querySelector('.lqEquipManage'))return;
 const owned=Array.isArray(s.equipmentOwned)?s.equipmentOwned:[];
 const weapons=['旅人の短剣','青銅の剣'].filter(x=>owned.includes(x));
 const armors=['旅人服','革の旅装'].filter(x=>owned.includes(x));
 const wrap=document.createElement('div');wrap.className='lqEquipManage';
 const row=(label,items,type,current)=>`<div class=lqEquipManageRow><div class=lqEquipManageLabel>${label}</div><div class=lqGearButtons>${items.map(name=>`<button class="lqGearButton ${name===current?'active':''}" onclick="lqEquipGear('${type}','${name}')">${name}</button>`).join('')}</div></div>`;
 wrap.innerHTML=row('武器',weapons,'weapon',s.weapon)+row('防具',armors,'armor',s.armor);
 equip.appendChild(wrap);
}
window.lqEquipGear=function(type,name){
 if(!s.pauseOpen||!s.equipmentOwned?.includes(name))return;
 if(type==='weapon'&&name in WEAPON_BONUS){
   const old=WEAPON_BONUS[s.weapon]||0;const next=WEAPON_BONUS[name]||0;s.atk=Math.max(1,s.atk-old+next);s.weapon=name;
 }else if(type==='armor'&&name in ARMOR_BONUS){
   const old=ARMOR_BONUS[s.armor]||0;const next=ARMOR_BONUS[name]||0;s.def=Math.max(0,(s.def||0)-old+next);s.armor=name;
 }else return;
 save();render();
};
const worldV39=world;world=function(){worldV39();addEquipManager();};
const renderV39=render;render=function(){const r=renderV39();if(s.pauseOpen)addEquipManager();return r;};
window.LQ_EQUIPMENT_STATUS=Object.assign({},window.LQ_EQUIPMENT_STATUS,{reEquipFromMenu:true});
if(s.pauseOpen)addEquipManager();
})();
