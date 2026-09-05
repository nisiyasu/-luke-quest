(() => {
'use strict';

/* LUKE QUEST v0.89 second consumable: 煙玉.
   Adds shop purchase + guaranteed random-battle escape, expanding items beyond herbs. */

s.smokeBombs=Number.isFinite(Number(s.smokeBombs))?Math.max(0,Math.floor(Number(s.smokeBombs))):0;
const SMOKE_PRICE=18;
let smokeNotice='';

const style=document.createElement('style');
style.textContent=`
.lqSmokeGood{border-color:#8e98a744!important}.lqSmokeBuy{background:#4d5664!important}.lqSmokeCmd{background:linear-gradient(135deg,#555d67,#323a46)!important;border-color:#a9b5c255!important}.lqSmokeGlyph:before{content:"";position:absolute;left:5px;top:8px;width:16px;height:10px;border-radius:50%;background:#b8c0c6aa;box-shadow:7px -5px 0 -2px #d1d6d988,-3px -6px 0 -3px #eef0f177;filter:blur(.4px)}.lqSmokeGlyph:after{content:"";position:absolute;left:10px;top:16px;width:8px;height:5px;border-radius:50%;background:#7f8992}
`;
document.head.appendChild(style);

function addSmokeShop(){
 if(!s.shopOpen||s.map!=='shopInterior')return;const goods=app.querySelector('.lqGoods');if(!goods||goods.querySelector('.lqSmokeGood'))return;
 const row=document.createElement('div');row.className='lqGood lqSmokeGood';const disabled=s.gold<SMOKE_PRICE?'disabled':'';
 row.innerHTML=`<div><div class=lqGoodName>煙玉 <span class=lqGoodPrice>${SMOKE_PRICE}G</span></div><div class=lqGoodDetail>戦闘から確実に離脱する。所持 ${s.smokeBombs}個。</div>${smokeNotice?`<div class=lqOwned>${smokeNotice}</div>`:''}</div><button class="lqBuyBtn lqSmokeBuy" ${disabled} onclick=lqBuySmokeBomb()>${disabled?'G不足':'購入'}</button>`;goods.appendChild(row);
}
window.lqBuySmokeBomb=function(){if(s.gold<SMOKE_PRICE)return;s.gold-=SMOKE_PRICE;s.smokeBombs++;smokeNotice=`煙玉を購入。所持 ${s.smokeBombs}個。`;save();window.LQ_sfx?.('menu');render();};

function addSmokeBattleCommand(){
 if(s.screen!=='battle')return;const grid=app.querySelector('.commandGrid');if(!grid||grid.querySelector('.lqSmokeCmd'))return;
 const b=document.createElement('button');b.className='commandBtn lqSmokeCmd';b.disabled=s.smokeBombs<=0;b.innerHTML=`<i class="lqCmdGlyph lqSmokeGlyph"></i><span class=lqCmdCopy><b>煙玉 ×${s.smokeBombs}</b><small>GUARANTEED ESCAPE</small></span>`;b.onclick=()=>window.lqUseSmokeBomb();grid.appendChild(b);
}
window.lqUseSmokeBomb=function(){if(s.screen!=='battle'||s.smokeBombs<=0)return;s.smokeBombs--;window.LQ_sfx?.('escape');s.screen='world';s.enemy=null;encounterGrace=5;s.dialog={name:'ルーク',text:'煙玉！ ……よし、今回は堂々と戦略的撤退です。'};save();render();};

function addSmokeMenu(){
 if(!s.pauseOpen)return;const row=app.querySelector('.lqInventoryRow');if(!row||row.querySelector('.lqSmokeItemChip'))return;const c=document.createElement('div');c.className='lqItemChip lqSmokeItemChip';c.innerHTML=`煙玉 <strong>×${s.smokeBombs}</strong>`;row.appendChild(c);
}
const worldV88=world;world=function(){worldV88();addSmokeShop();addSmokeMenu();};
const battleV88=battle;battle=function(){const r=battleV88();addSmokeBattleCommand();return r;};
const renderV88=render;render=function(){const r=renderV88();addSmokeShop();addSmokeBattleCommand();addSmokeMenu();return r;};
save();window.LQ_CONSUMABLE_STATUS={herb:true,smokeBomb:{price:SMOKE_PRICE,guaranteedEscape:true}};
addSmokeShop();addSmokeBattleCommand();addSmokeMenu();
})();
