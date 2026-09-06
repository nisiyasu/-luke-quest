(() => {
'use strict';

/* REQ-055: collision-safe one-unit selling for canonical stackable consumables. */
const SELL_META={
 herb:{label:'薬草',stateKey:'potions',sellPrice:4},
 smoke:{label:'煙玉',stateKey:'smokeBombs',sellPrice:9}
};

const style=document.createElement('style');
style.textContent=`
.lqSellControls{display:flex;gap:6px;margin-top:6px}.lqSellControls button{min-height:44px;padding:7px 10px;border-radius:7px;border:1px solid #76b7d744;background:#102839;color:#bfe5f5;font-size:8px;font-weight:950;letter-spacing:.04em}.lqSellControls button:disabled{opacity:.32;filter:saturate(.35)}
`;
document.head.appendChild(style);

function canSellNow(){return !!(s&&s.screen==='world'&&s.map==='shopInterior'&&s.shopOpen);}
function finiteCount(v){return Number.isFinite(v)&&v>0?Math.floor(v):0;}
function currentGold(){return Number.isFinite(s?.gold)?s.gold:0;}
function sellConsumable(type){
 const meta=SELL_META[type];
 if(!meta||!canSellNow())return false;
 const owned=finiteCount(s[meta.stateKey]);
 if(owned<=0)return false;
 s[meta.stateKey]=owned-1;
 s.gold=currentGold()+meta.sellPrice;
 save();
 window.LQ_sfx?.('menu');
 render();
 return true;
}
window.lqSellConsumable=sellConsumable;

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
  box.innerHTML=`<button type="button" onclick="lqSellConsumable('${type}')" ${owned<=0?'disabled':''}>SELL ×1 +${meta.sellPrice}G</button>`;
  const anchor=card.querySelector('.lqGoodDetail')||card.lastElementChild||card;
  anchor.appendChild(box);
 }
}

const worldBase=world;world=function(){worldBase();decorateSell();};
const renderBase=render;render=function(){const out=renderBase();decorateSell();return out;};
window.LQ_SHOP_SELL_STATUS={
 types:Object.freeze({herb:Object.freeze({...SELL_META.herb}),smoke:Object.freeze({...SELL_META.smoke})}),
 oneUnitOnly:true,
 equipmentSelling:false,
 shopGuard:true,
 canSellNow,
 sellConsumable
};
decorateSell();
})();
