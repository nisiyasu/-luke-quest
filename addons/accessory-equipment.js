(() => {
'use strict';

/* REQ-058: independent accessory slot layered onto canonical DEF arithmetic. */
const ACCESSORIES={
 '旅人の護符':{price:60,def:1,desc:'旅の安全を願う小さな護符。装備中 DEF +1。'}
};
s.flags=s.flags&&typeof s.flags==='object'?s.flags:{};
s.flags.lqAccessoryOwned=Array.isArray(s.flags.lqAccessoryOwned)?s.flags.lqAccessoryOwned.filter(n=>n in ACCESSORIES):[];
s.flags.lqAccessoryEquipped=(typeof s.flags.lqAccessoryEquipped==='string'&&s.flags.lqAccessoryEquipped in ACCESSORIES&&s.flags.lqAccessoryOwned.includes(s.flags.lqAccessoryEquipped))?s.flags.lqAccessoryEquipped:'';

const style=document.createElement('style');
style.textContent=`
.lqAccessoryGood{border-color:#a88ed955!important;background:linear-gradient(135deg,#171a31,#101d31)!important}.lqAccessoryTag{display:inline-block;margin-left:5px;padding:2px 5px;border-radius:999px;background:#352d57;color:#d9ccff;border:1px solid #b9a8ff55;font-size:6px;font-weight:950;letter-spacing:.1em}.lqAccessoryCompare{margin-top:5px;color:#aeb2c8;font-size:8px}.lqAccessoryCompare b{color:#cbbcff}.lqAccessoryManage{margin-top:7px;padding-top:7px;border-top:1px solid #ffffff12}.lqAccessoryManageTitle{font-size:8px;color:#a89abd;margin-bottom:5px;letter-spacing:.08em}
`;
document.head.appendChild(style);

function owned(){return s.flags.lqAccessoryOwned;}
function equipped(){return s.flags.lqAccessoryEquipped||'';}
function bonus(name){return ACCESSORIES[name]?.def||0;}
function canShop(){return !!(s.screen==='world'&&s.map==='shopInterior'&&s.shopOpen);}
function equipAccessory(name=''){
 const old=equipped();
 if(name===old)return false;
 if(name&&!owned().includes(name))return false;
 const nextBonus=bonus(name),oldBonus=bonus(old);
 s.def=Math.max(0,(Number.isFinite(s.def)?s.def:0)-oldBonus+nextBonus);
 s.flags.lqAccessoryEquipped=name;
 save();render();return true;
}
function buyAccessory(name){
 const item=ACCESSORIES[name];
 if(!item||!canShop()||owned().includes(name)||!Number.isFinite(s.gold)||s.gold<item.price)return false;
 s.gold-=item.price;
 s.flags.lqAccessoryOwned=[...owned(),name];
 if(!equipped()){
  s.flags.lqAccessoryEquipped=name;
  s.def=Math.max(0,Number.isFinite(s.def)?s.def:0)+item.def;
 }
 save();window.LQ_sfx?.('menu');render();return true;
}
window.lqEquipAccessory=equipAccessory;
window.lqBuyAccessory=buyAccessory;

function addShop(){
 if(!canShop())return;
 const goods=app.querySelector('.lqGoods');if(!goods)return;
 for(const [name,item] of Object.entries(ACCESSORIES)){
  if(goods.querySelector(`[data-accessory="${name}"]`))continue;
  const has=owned().includes(name),active=equipped()===name;
  const row=document.createElement('div');row.className='lqGood lqAccessoryGood';row.dataset.accessory=name;
  const current=Number.isFinite(s.def)?s.def:0;
  const projected=active?current:current+item.def;
  row.innerHTML=`<div><div class=lqGoodName>${name} <span class=lqGoodPrice>${item.price}G</span><span class=lqAccessoryTag>ACCESSORY</span></div><div class=lqGoodDetail>${item.desc}</div><div class=lqAccessoryCompare>DEF ${current} → <b>${projected}${active?' (装備中)':` (+${item.def})`}</b></div>${has?`<div class=lqOwned>${active?'装備中':'所持済み'}</div>`:''}</div><button class=lqBuyBtn ${has||s.gold<item.price?'disabled':''} onclick="lqBuyAccessory('${name}')">${has?'所持済':s.gold<item.price?'G不足':'購入'}</button>`;
  goods.appendChild(row);
 }
}
function addMenu(){
 if(!s.pauseOpen||s.screen!=='world')return;
 const sec=[...app.querySelectorAll('.lqPauseSection')].find(el=>el.querySelector('h3')?.textContent.includes('EQUIPMENT'));
 if(!sec||sec.querySelector('.lqAccessoryManage'))return;
 const box=document.createElement('div');box.className='lqAccessoryManage';
 const buttons=owned().map(name=>`<button class="lqGearButton ${equipped()===name?'active':''}" onclick="lqEquipAccessory('${name}')">${name}</button>`).join('');
 const remove=equipped()?`<button class=lqGearButton onclick="lqEquipAccessory('')">はずす</button>`:'';
 box.innerHTML=`<div class=lqAccessoryManageTitle>ACCESSORY</div><div class=lqGearButtons>${buttons||'<span class=lqGoodDetail>未所持</span>'}${remove}</div>`;
 sec.appendChild(box);
}
const worldBase=world;world=function(){worldBase();addShop();addMenu();};
const renderBase=render;render=function(){const out=renderBase();addShop();addMenu();return out;};
window.LQ_ACCESSORY_STATUS={foundation:true,items:Object.freeze(Object.fromEntries(Object.entries(ACCESSORIES).map(([k,v])=>[k,Object.freeze({...v})]))),owned,equipped,bonus,buyAccessory,equipAccessory};
addShop();addMenu();
})();
