(() => {
'use strict';

/* Collision-safe add-on: second equipment tier for early-game progression. */
const WEAPONS={'旅人の短剣':0,'青銅の剣':3,'鉄の剣':6};
const ARMORS={'旅人服':0,'革の旅装':2,'補強革鎧':4};
const GOODS={
 '鉄の剣':{type:'weapon',price:110,sell:55,bonus:6,label:'ATK',desc:'鍛冶場仕上げの実戦剣。重いが刃がぶれにくい。'},
 '補強革鎧':{type:'armor',price:90,sell:45,bonus:4,label:'DEF',desc:'革の旅装へ金属板を縫い込んだ軽装鎧。'}
};
s.equipmentOwned=Array.isArray(s.equipmentOwned)?s.equipmentOwned:[];

const style=document.createElement('style');style.textContent=`
.lqTier2Good{border-color:#7f9cba55!important;background:linear-gradient(135deg,#0c1c2a,#10283a)!important}.lqTier2Tag{display:inline-block;margin-left:5px;padding:2px 5px;border-radius:999px;background:#243f59;color:#b8d3e8;border:1px solid #88aeca44;font-size:6px;font-weight:950;letter-spacing:.1em}.lqTier2Compare{margin-top:5px;color:#9eb2c1;font-size:8px}.lqTier2Compare b{color:#aee9bc}.lqTier2Equip{margin-top:7px;padding-top:7px;border-top:1px solid #ffffff12}.lqTier2EquipTitle{font-size:8px;color:#8fa6bb;margin-bottom:5px;letter-spacing:.08em}.lqTier2Sell{min-height:35px;padding:5px 8px;border-radius:7px;border:1px solid #b6945d44;background:#3a3021;color:#e8ce86;font-size:8px;font-weight:900}.lqTier2Sell:disabled{opacity:.35}
`;document.head.appendChild(style);

function bonusFor(type,name){return type==='weapon'?(WEAPONS[name]||0):(ARMORS[name]||0);}
function equip(type,name){
 if(!s.equipmentOwned.includes(name)||!GOODS[name])return false;
 if(type==='weapon'){const base=s.atk-bonusFor('weapon',s.weapon);s.atk=Math.max(1,base+WEAPONS[name]);s.weapon=name;}
 else{const base=(s.def||0)-bonusFor('armor',s.armor);s.def=Math.max(0,base+ARMORS[name]);s.armor=name;}
 save();render();return true;
}
const equipBase=window.lqEquipGear;window.lqEquipGear=function(type,name){if(GOODS[name])return equip(type,name);return equipBase?.(type,name);};
window.lqBuyTier2=function(name){const g=GOODS[name];if(!g||s.equipmentOwned.includes(name)||s.gold<g.price)return;s.gold-=g.price;s.equipmentOwned.push(name);if(g.type==='weapon'){const base=s.atk-bonusFor('weapon',s.weapon);s.weapon=name;s.atk=base+g.bonus;}else{const base=(s.def||0)-bonusFor('armor',s.armor);s.armor=name;s.def=base+g.bonus;}save();window.LQ_sfx?.('menu');render();};
window.lqSellTier2=function(name){const g=GOODS[name];if(!g||!s.equipmentOwned.includes(name)||s.weapon===name||s.armor===name)return;s.equipmentOwned=s.equipmentOwned.filter(x=>x!==name);s.gold+=g.sell;save();render();};

function addShop(){
 if(!s.shopOpen||s.screen!=='world'||s.map!=='shopInterior')return;const goods=app.querySelector('.lqGoods');if(!goods)return;
 for(const [name,g] of Object.entries(GOODS)){if(goods.querySelector(`[data-tier2="${name}"]`))continue;const owned=s.equipmentOwned.includes(name),current=g.type==='weapon'?s.atk:(s.def||0),base=current-bonusFor(g.type,g.type==='weapon'?s.weapon:s.armor),next=base+g.bonus,delta=next-current;const row=document.createElement('div');row.className='lqGood lqTier2Good';row.dataset.tier2=name;row.innerHTML=`<div><div class=lqGoodName>${name} <span class=lqGoodPrice>${g.price}G</span><span class=lqTier2Tag>TIER II</span></div><div class=lqGoodDetail>${g.desc}</div><div class=lqTier2Compare>${g.label} ${current} → <b>${next}${delta>0?` (+${delta})`:''}</b></div></div><button class=lqBuyBtn ${owned||s.gold<g.price?'disabled':''} onclick="lqBuyTier2('${name}')">${owned?'所持済':s.gold<g.price?'G不足':'購入'}</button>`;goods.appendChild(row);}
}
function addEquip(){
 if(!s.pauseOpen)return;const sec=Array.from(app.querySelectorAll('.lqPauseSection')).find(x=>x.querySelector('h3')?.textContent.includes('EQUIPMENT'));if(!sec||sec.querySelector('.lqTier2Equip'))return;const owned=Object.keys(GOODS).filter(n=>s.equipmentOwned.includes(n));if(!owned.length)return;const box=document.createElement('div');box.className='lqTier2Equip';box.innerHTML=`<div class=lqTier2EquipTitle>TIER II EQUIPMENT</div><div class=lqGearButtons>${owned.map(n=>`<button class="lqGearButton ${(s.weapon===n||s.armor===n)?'active':''}" onclick="lqEquipGear('${GOODS[n].type}','${n}')">${n}</button>`).join('')}</div>`;sec.appendChild(box);
}
function addSell(){
 if(!s.shopOpen)return;const sell=app.querySelector('.lqSellSection');if(!sell||sell.querySelector('.lqTier2SellRows'))return;const owned=Object.keys(GOODS).filter(n=>s.equipmentOwned.includes(n));if(!owned.length)return;const rows=document.createElement('div');rows.className='lqSellRows lqTier2SellRows';rows.innerHTML=owned.map(n=>{const g=GOODS[n],equipped=s.weapon===n||s.armor===n;return`<div class=lqSellRow><div><div class=lqSellName>${n}</div><div class=lqSellMeta>買取 ${g.sell}G${equipped?'・装備中':''}</div></div><button class=lqTier2Sell ${equipped?'disabled':''} onclick="lqSellTier2('${n}')">売る</button></div>`}).join('');sell.querySelector('.lqSellRows')?.after(rows);
}
const worldE=world;world=function(){worldE();addShop();addEquip();addSell();};const renderE=render;render=function(){const r=renderE();addShop();addEquip();addSell();return r;};window.LQ_EQUIPMENT_STATUS=Object.assign({},window.LQ_EQUIPMENT_STATUS,{tier2:['鉄の剣','補強革鎧'],tier2Sell:true});addShop();addEquip();addSell();
})();
