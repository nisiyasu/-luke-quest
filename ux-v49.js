(() => {
'use strict';

/* LUKE QUEST v0.49 shop sell-back flow.
   Adds a safe sell loop for optional gear; starter gear and currently equipped gear remain protected. */

const SELL_VALUES={'青銅の剣':22,'革の旅装':19};
let sellNotice='装備を外してから売却できます。';

const style=document.createElement('style');
style.textContent=`
.lqSellSection{margin-top:9px;padding-top:9px;border-top:1px solid #ffffff18}.lqSellTitle{font-size:9px;color:#e5c96d;font-weight:950;letter-spacing:.12em;margin-bottom:6px}.lqSellRows{display:grid;gap:6px}.lqSellRow{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;background:#0a1825;border:1px solid #ffffff12;border-radius:8px;padding:7px}.lqSellName{font-size:11px;font-weight:900;color:#e8eff4}.lqSellMeta{font-size:8px;color:#8fa4b8;margin-top:2px}.lqSellBtn{min-width:76px;min-height:40px;border-radius:8px;border:1px solid #c8a85d55;background:#594824;color:#ffeba8;font-weight:900}.lqSellBtn:disabled{opacity:.36;background:#303942;color:#9aa7b0}.lqSellNotice{font-size:9px;color:#a8bdca;line-height:1.4;margin-top:6px;padding:5px 7px;background:#07121d88;border-radius:6px}
`;
document.head.appendChild(style);

function addSellPanel(){
 if(!s.shopOpen||s.screen!=='world'||s.map!=='shopInterior')return;
 const panel=app.querySelector('.lqShopPanel');if(!panel||panel.querySelector('.lqSellSection'))return;
 const owned=Array.isArray(s.equipmentOwned)?s.equipmentOwned:[];
 const rows=Object.entries(SELL_VALUES).filter(([name])=>owned.includes(name)).map(([name,value])=>{
   const equipped=s.weapon===name||s.armor===name;
   return `<div class=lqSellRow><div><div class=lqSellName>${name}</div><div class=lqSellMeta>買取 ${value}G${equipped?'・装備中':''}</div></div><button class=lqSellBtn ${equipped?'disabled':''} onclick="lqSellGear('${name}')">売る</button></div>`;
 }).join('');
 const block=document.createElement('div');block.className='lqSellSection';
 block.innerHTML=`<div class=lqSellTitle>SELL EQUIPMENT</div><div class=lqSellRows>${rows||'<div class=lqGoodDetail>売却できる装備はありません。</div>'}</div><div class=lqSellNotice>${sellNotice}</div>`;
 const notice=panel.querySelector('.lqShopNotice');panel.insertBefore(block,notice||panel.querySelector('.lqShopClose'));
}

window.lqSellGear=function(name){
 if(!s.shopOpen||!SELL_VALUES[name]||!s.equipmentOwned?.includes(name))return;
 if(s.weapon===name||s.armor===name){sellNotice='装備中の品は売れません。冒険メニューで別装備へ変更してください。';return render();}
 s.equipmentOwned=s.equipmentOwned.filter(x=>x!==name);s.gold+=SELL_VALUES[name];sellNotice=`${name}を ${SELL_VALUES[name]}G で売却しました。`;
 save();render();
};

const worldV48=world;world=function(){worldV48();addSellPanel();};
const renderV48=render;render=function(){const r=renderV48();if(s.shopOpen)addSellPanel();return r;};
window.LQ_SHOP_STATUS=Object.assign({},window.LQ_SHOP_STATUS,{sellBack:true,sellValues:SELL_VALUES});
if(s.shopOpen)addSellPanel();
})();
