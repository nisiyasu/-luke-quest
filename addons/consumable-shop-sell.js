(() => {
'use strict';

/* REQ-055 + REQ-057: collision-safe stackable selling for canonical consumables. */
const SELL_META={
 herb:{label:'薬草',stateKey:'potions',sellPrice:4},
 smoke:{label:'煙玉',stateKey:'smokeBombs',sellPrice:9}
};

const style=document.createElement('style');
style.textContent=`
.lqSellControls{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}.lqSellControls button{min-height:44px;padding:7px 10px;border-radius:7px;border:1px solid #76b7d744;background:#102839;color:#bfe5f5;font-size:8px;font-weight:950;letter-spacing:.04em}.lqSellControls button:disabled{opacity:.32;filter:saturate(.35)}
`;
document.head.appendChild(style);

function canSellNow(){return !!(s&&s.screen==='world'&&s.map==='shopInterior'&&s.shopOpen);}
function finiteCount(v){return Number.isFinite(v)&&v>0?Math.floor(v):0;}
function currentGold(){return Number.isFinite(s?.gold)?s.gold:0;}
function sellConsumableQty(type,qty){
 const meta=SELL_META[type];
 if(!meta||!canSellNow()||!(qty===1||qty===3))return false;
 const owned=finiteCount(s[meta.stateKey]);
 if(owned<qty)return false;
 s[meta.stateKey]=owned-qty;
 s.gold=currentGold()+(meta.sellPrice*qty);
 save();
 window.LQ_sfx?.('menu');
 render();
 return true;
}
function sellConsumable(type){return sellConsumableQty(type,1);}
window.lqSellConsumable=sellConsumable;
window.lqSellConsumableQty=sellConsumableQty;

function cleanName(t){return String(t||'').replace(/\s*\d+G.*$/,'').replace(/\s*\(.*$/,'').trim();}
function typeForCard(card){
 const name=cleanName(card.querySelector('.lqGoodName')?.textContent||'');
 if(name.includes('薬草'))return 'herb';
 if(name.includes('煙玉'))return 'smoke';
 return null;
}
function decorateSell(){
 if(!canSellNow())return;
 for(const card of app.querySelectorAll('.lqGood')){
  if(card.querySelector('.lqSellControls'))continue;
  const type=typeForCard(card);const meta=SELL_META[type];if(!meta)continue;
  const owned=finiteCount(s[meta.stateKey]);
  const box=document.createElement('div');box.className='lqSellControls';
  box.innerHTML=`<button type="button" onclick="lqSellConsumable('${type}')" ${owned<1?'disabled':''}>SELL ×1 +${meta.sellPrice}G</button><button type="button" onclick="lqSellConsumableQty('${type}',3)" ${owned<3?'disabled':''}>SELL ×3 +${meta.sellPrice*3}G</button>`;
  const anchor=card.querySelector('.lqGoodDetail')||card.lastElementChild||card;
  anchor.appendChild(box);
 }
}

const worldBase=world;world=function(){worldBase();decorateSell();};
const renderBase=render;render=function(){const out=renderBase();decorateSell();return out;};
window.LQ_SHOP_SELL_STATUS={
 types:Object.freeze({herb:Object.freeze({...SELL_META.herb}),smoke:Object.freeze({...SELL_META.smoke})}),
 oneUnitOnly:true,
 quantityOptions:Object.freeze([1,3]),
 equipmentSelling:false,
 shopGuard:true,
 canSellNow,
 sellConsumable,
 sellConsumableQty
};
decorateSell();
})();
