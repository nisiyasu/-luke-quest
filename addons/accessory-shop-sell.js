(() => {
'use strict';

/* REQ-072: additive sell lifecycle over REQ-058 accessory authority. */
const accessory=window.LQ_ACCESSORY_STATUS;
if(!accessory?.owned||!accessory?.equipped||!accessory?.items)return;
const SELL_VALUES=Object.freeze({'旅人の護符':30});
function canShop(){return !!(s.screen==='world'&&s.map==='shopInterior'&&s.shopOpen);}
function sellAccessory(name){
 const value=SELL_VALUES[name];
 if(!Number.isFinite(value)||!canShop()||!accessory.owned().includes(name)||accessory.equipped()===name)return false;
 const before=s.flags.lqAccessoryOwned;
 s.flags.lqAccessoryOwned=before.filter(n=>n!==name);
 s.gold=(Number.isFinite(s.gold)?s.gold:0)+value;
 save();window.LQ_sfx?.('menu');render();return true;
}
window.lqSellAccessory=sellAccessory;
function addSell(){
 if(!canShop())return;
 const sell=app.querySelector('.lqSellSection');if(!sell||sell.querySelector('.lqAccessorySellRows'))return;
 const owned=accessory.owned().filter(name=>name in SELL_VALUES);if(!owned.length)return;
 const rows=document.createElement('div');rows.className='lqSellRows lqAccessorySellRows';
 rows.innerHTML=owned.map(name=>{const equipped=accessory.equipped()===name;return`<div class=lqSellRow data-accessory-sell="${name}"><div><div class=lqSellName>${name} <span class=lqAccessoryTag>ACCESSORY</span></div><div class=lqSellMeta>買取 ${SELL_VALUES[name]}G${equipped?'・装備中':''}</div></div><button class=lqTier2Sell ${equipped?'disabled':''} onclick="lqSellAccessory('${name}')">売る</button></div>`}).join('');
 sell.querySelector('.lqSellRows')?.after(rows);
}
const worldBase=world;world=function(){worldBase();addSell();};
const renderBase=render;render=function(){const out=renderBase();addSell();return out;};
window.LQ_ACCESSORY_SELL_STATUS={enabled:true,sellValues:SELL_VALUES,sellAccessory,addSell};
addSell();
})();
