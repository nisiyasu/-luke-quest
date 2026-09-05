(() => {
'use strict';

/* Collision-safe add-on: x3 purchase controls for stackable consumables. */
const style=document.createElement('style');style.textContent=`
.lqStackBuy{display:flex;gap:5px;margin-top:6px}.lqStackBuy button{min-height:34px;padding:5px 8px;border-radius:7px;border:1px solid #ffffff18;background:#173047;color:#c8d7e1;font-size:8px;font-weight:900}.lqStackBuy button:disabled{opacity:.35}.lqStackBuy .x3{border-color:#d6b65b44;background:#3b3420;color:#f0d98a}
`;document.head.appendChild(style);
function buyStack(type,count,price){const afford=Math.min(count,Math.floor(s.gold/price));if(afford<=0)return;if(type==='herb')s.potions=(s.potions||0)+afford;else if(type==='smoke')s.smokeBombs=(s.smokeBombs||0)+afford;else return;s.gold-=afford*price;save();window.LQ_sfx?.('menu');render();}
window.lqBuyStack=buyStack;
function addStackButtons(){
 if(!s.shopOpen||s.screen!=='world'||s.map!=='shopInterior')return;for(const g of app.querySelectorAll('.lqGood')){if(g.querySelector('.lqStackBuy'))continue;const text=g.querySelector('.lqGoodName')?.textContent||'';let type=null,price=0;if(text.includes('薬草')){type='herb';price=8;}else if(text.includes('煙玉')){type='smoke';price=18;}if(!type)continue;const box=document.createElement('div');box.className='lqStackBuy';box.innerHTML=`<button onclick="lqBuyStack('${type}',1,${price})" ${s.gold<price?'disabled':''}>×1</button><button class=x3 onclick="lqBuyStack('${type}',3,${price})" ${s.gold<price?'disabled':''}>×3 最大 ${price*3}G</button>`;const detail=g.querySelector('.lqGoodDetail');(detail||g.firstElementChild)?.appendChild(box);}}
const worldQ=world;world=function(){worldQ();addStackButtons();};const renderQ=render;render=function(){const r=renderQ();addStackButtons();return r;};window.LQ_STACK_PURCHASE_STATUS={herb:true,smokeBomb:true,maxButtonCount:3};addStackButtons();
})();
