(() => {
'use strict';

/* Collision-safe add-on: richer shop item cards and inventory clarity. */
const ITEM_META={
 '薬草':{tag:'RECOVERY',detail:'HPを18回復。戦闘中・フィールドで使用可能。'},
 '青銅の剣':{tag:'WEAPON',detail:'扱いやすい青銅製の剣。ATK +3。'},
 '革の旅装':{tag:'ARMOR',detail:'軽い革装備。DEF +2。'},
 '煙玉':{tag:'TACTICAL',detail:'戦闘から確実に離脱。危険な時の保険。'}
};
const style=document.createElement('style');style.textContent=`
.lqGood{position:relative;overflow:hidden}.lqGoodType{display:inline-block;margin-left:5px;padding:2px 5px;border-radius:999px;background:#172a38;color:#8db1c8;border:1px solid #ffffff16;font-size:6px;font-weight:950;letter-spacing:.1em;vertical-align:middle}.lqGoodFlavor{margin-top:4px;color:#7f96a8;font-size:8px;line-height:1.4}.lqGoodOwnedLine{display:flex;gap:7px;flex-wrap:wrap;margin-top:4px}.lqGoodOwnedLine span{padding:2px 5px;border-radius:6px;background:#07131f;color:#9db0bd;font-size:7px}.lqGoodEquipped{color:#9ee4ae!important;border:1px solid #67b97944}
`;document.head.appendChild(style);
function cleanName(t){return t.replace(/\s*\d+G.*$/,'').replace(/\s*\(.*$/,'').trim();}
function decorate(){
 if(!s.shopOpen||s.screen!=='world')return;for(const g of app.querySelectorAll('.lqGood')){if(g.dataset.lqCard==='1')continue;const name=cleanName(g.querySelector('.lqGoodName')?.textContent||'');const meta=ITEM_META[name];if(!meta)continue;g.dataset.lqCard='1';const title=g.querySelector('.lqGoodName');if(title){const tag=document.createElement('span');tag.className='lqGoodType';tag.textContent=meta.tag;title.appendChild(tag);}const detail=g.querySelector('.lqGoodDetail');if(detail){const f=document.createElement('div');f.className='lqGoodFlavor';f.textContent=meta.detail;detail.after(f);const owned=document.createElement('div');owned.className='lqGoodOwnedLine';let own='';if(name==='薬草')own=`所持 ${s.potions||0}`;if(name==='煙玉')own=`所持 ${s.smokeBombs||0}`;if(name==='青銅の剣'||name==='革の旅装')own=s.equipmentOwned?.includes(name)?'所持済み':'未所持';const equipped=s.weapon===name||s.armor===name;owned.innerHTML=`<span>${own}</span>${equipped?'<span class=lqGoodEquipped>EQUIPPED</span>':''}`;f.after(owned);}}
}
const worldA=world;world=function(){worldA();decorate();};const renderA=render;render=function(){const r=renderA();decorate();return r;};window.LQ_SHOP_CARD_STATUS={typedItems:true,ownedState:true,equippedState:true};decorate();
})();
