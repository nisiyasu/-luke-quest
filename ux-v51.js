(() => {
'use strict';

/* LUKE QUEST v0.51 shop equipment comparison.
   Shows projected ATK/DEF before purchase without changing v0.31 purchase mechanics. */

const V51_WEAPON_BONUS={'旅人の短剣':0,'青銅の剣':3};
const V51_ARMOR_BONUS={'旅人服':0,'革の旅装':2};

const style=document.createElement('style');
style.textContent=`
.lqCompare{display:flex;align-items:center;gap:5px;margin-top:5px;font-size:9px;font-weight:900}.lqCompareStat{color:#91a8bb}.lqCompareNow{color:#d7e1e7}.lqCompareArrow{color:#788c9d}.lqCompareNext{color:#a9efb8}.lqCompareUp{padding:2px 5px;border-radius:999px;background:#153725;border:1px solid #65c48344;color:#8ee7a7;font-size:8px}.lqCompareOwned{color:#7f93a4;font-size:8px}
`;
document.head.appendChild(style);

function projectedWeapon(name){
 const old=V51_WEAPON_BONUS[s.weapon]||0;const next=V51_WEAPON_BONUS[name]||0;
 return Math.max(1,s.atk-old+next);
}
function projectedArmor(name){
 const old=V51_ARMOR_BONUS[s.armor]||0;const next=V51_ARMOR_BONUS[name]||0;
 return Math.max(0,(s.def||0)-old+next);
}
function decorateShopComparisons(){
 if(!s.shopOpen||s.screen!=='world'||s.map!=='shopInterior')return;
 for(const good of app.querySelectorAll('.lqGood')){
   if(good.querySelector('.lqCompare'))continue;
   const name=good.querySelector('.lqGoodName')?.textContent||'';
   const detail=good.querySelector('.lqGoodDetail');if(!detail)continue;
   let stat=null,now=0,next=0;
   if(name.includes('青銅の剣')){stat='ATK';now=s.atk;next=projectedWeapon('青銅の剣');}
   else if(name.includes('革の旅装')){stat='DEF';now=s.def||0;next=projectedArmor('革の旅装');}
   if(!stat)continue;
   const delta=next-now;
   const box=document.createElement('div');box.className='lqCompare';
   if(delta>0)box.innerHTML=`<span class=lqCompareStat>${stat}</span><span class=lqCompareNow>${now}</span><span class=lqCompareArrow>→</span><span class=lqCompareNext>${next}</span><span class=lqCompareUp>+${delta}</span>`;
   else box.innerHTML=`<span class=lqCompareOwned>${stat} ${now}・現在と同等以下</span>`;
   detail.after(box);
 }
}

const worldV50=world;world=function(){worldV50();decorateShopComparisons();};
const renderV50=render;render=function(){const r=renderV50();decorateShopComparisons();return r;};
window.LQ_SHOP_COMPARISON_STATUS={projectedAtk:true,projectedDef:true};
if(s.shopOpen)decorateShopComparisons();
})();
