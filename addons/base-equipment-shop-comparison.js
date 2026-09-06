(() => {
'use strict';

/* REQ-056: UI-only comparison for canonical Tier-I equipment cards. */
const WEAPON_BONUS={'旅人の短剣':0,'青銅の剣':3,'鉄の剣':6};
const ARMOR_BONUS={'旅人服':0,'革の旅装':2,'補強革鎧':4};
const CANDIDATES={
 '青銅の剣':{type:'weapon',label:'ATK',bonus:3},
 '革の旅装':{type:'armor',label:'DEF',bonus:2}
};
const style=document.createElement('style');
style.textContent=`
.lqBaseCompare{margin-top:5px;font-size:8px;color:#9eb2c1}.lqBaseCompare b{color:#aee9bc}.lqBaseCompare .down{color:#f0b4a7}.lqBaseCompare .same{color:#b8c1c9}
`;
document.head.appendChild(style);

function bonusFor(type,name){
 const table=type==='weapon'?WEAPON_BONUS:ARMOR_BONUS;
 return Object.prototype.hasOwnProperty.call(table,name)?table[name]:0;
}
function projection(name){
 const meta=CANDIDATES[name];if(!meta)return null;
 const current=meta.type==='weapon'?(Number.isFinite(s.atk)?s.atk:0):(Number.isFinite(s.def)?s.def:0);
 const equipped=meta.type==='weapon'?s.weapon:s.armor;
 const base=current-bonusFor(meta.type,equipped);
 const next=base+meta.bonus;
 return {name,...meta,current,next,delta:next-current,equipped};
}
function cleanName(t){return String(t||'').replace(/\s*\d+G.*$/,'').replace(/\s*\(.*$/,'').trim();}
function deltaText(delta){return delta>0?`+${delta}`:String(delta);}
function decorate(){
 if(!(s&&s.screen==='world'&&s.map==='shopInterior'&&s.shopOpen))return;
 for(const card of app.querySelectorAll('.lqGood')){
  if(card.querySelector('.lqBaseCompare'))continue;
  const name=cleanName(card.querySelector('.lqGoodName')?.textContent||'');
  const p=projection(name);if(!p)continue;
  const line=document.createElement('div');line.className='lqBaseCompare';
  const cls=p.delta<0?'down':p.delta===0?'same':'';
  line.innerHTML=`${p.label} ${p.current} → <b class="${cls}">${p.next} (${deltaText(p.delta)})</b>`;
  const detail=card.querySelector('.lqGoodDetail')||card.querySelector('.lqGoodName');
  detail?.after(line);
 }
}
const worldBase=world;world=function(){worldBase();decorate();};
const renderBase=render;render=function(){const out=renderBase();decorate();return out;};
window.LQ_BASE_EQUIPMENT_COMPARE_STATUS={uiOnly:true,projection,bonuses:{weapon:{...WEAPON_BONUS},armor:{...ARMOR_BONUS}}};
decorate();
})();
