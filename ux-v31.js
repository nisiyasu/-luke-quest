(() => {
'use strict';

/* LUKE QUEST v0.31 equipment/shop system.
   Upgrades Mina from one-click herb sales to a real item/equipment panel and introduces DEF. */

DEFAULT.def ??= 0;
DEFAULT.weapon ??= '旅人の短剣';
DEFAULT.armor ??= '旅人服';
DEFAULT.equipmentOwned ??= ['旅人の短剣','旅人服'];
s.def ??= 0;
s.weapon ??= '旅人の短剣';
s.armor ??= '旅人服';
s.equipmentOwned=Array.isArray(s.equipmentOwned)?s.equipmentOwned:['旅人の短剣','旅人服'];
s.shopOpen=false;

const SHOP_GOODS=[
 {id:'herb',name:'薬草',price:8,type:'consumable',detail:'HPを22回復。冒険の基本。'},
 {id:'bronzeSword',name:'青銅の剣',price:45,type:'weapon',atk:3,detail:'ATK +3。扱いやすい王都鍛冶の剣。'},
 {id:'leatherVest',name:'革の旅装',price:38,type:'armor',def:2,detail:'DEF +2。動きやすさ重視の軽装。'}
];

const style=document.createElement('style');
style.textContent=`
.lqShopOverlay{position:absolute;inset:0;z-index:45;background:linear-gradient(180deg,#08121cF2,#071019FA);display:flex;align-items:center;justify-content:center;padding:14px;backdrop-filter:blur(3px)}
.lqShopPanel{width:min(430px,96%);max-height:92%;overflow:auto;border:2px solid #d5b55c;border-radius:16px;background:linear-gradient(180deg,#142638,#0b1825);box-shadow:0 16px 42px #000c,inset 0 0 35px #457aa510;padding:13px}
.lqShopHeader{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:10px;padding-bottom:9px;border-bottom:1px solid #ffffff18}.lqShopTitle{font-family:Georgia,serif;color:#ffe7a0;font-size:20px;font-weight:900}.lqShopMoney{background:#07121d;border:1px solid #e3c66555;border-radius:999px;padding:5px 9px;color:#ffe8a5;font-weight:950;font-size:12px}
.lqShopGearNow{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:10px}.lqGearChip{background:#091522;border:1px solid #ffffff15;border-radius:9px;padding:7px;font-size:10px;color:#aebed0}.lqGearChip b{display:block;color:#f0f5fa;font-size:12px;margin-top:2px}
.lqGoods{display:grid;gap:8px}.lqGood{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;background:linear-gradient(135deg,#102437,#0a1826);border:1px solid #ffffff18;border-radius:11px;padding:9px}.lqGoodName{font-weight:950;color:#f3f6f8}.lqGoodDetail{font-size:10px;color:#95a8bb;line-height:1.45;margin-top:3px}.lqGoodPrice{font-size:11px;color:#f5d576;font-weight:900}.lqBuyBtn{min-width:82px;min-height:44px;border-radius:9px;border:1px solid #e4c76566;background:#315f86;color:white;font-weight:950}.lqBuyBtn:disabled{opacity:.45;background:#303c46}.lqOwned{color:#8de1a7;font-size:10px;font-weight:900}.lqShopClose{margin-top:10px;width:100%;min-height:46px;border-radius:10px;border:1px solid #ffffff24;background:#3b4654;color:#eef4f8;font-weight:900}
.lqShopNotice{min-height:31px;margin-top:9px;padding:7px 9px;border-radius:8px;background:#07121dcc;color:#b9cad7;font-size:11px;line-height:1.4}.lqShopNotice.good{color:#a8f2bb}.lqShopNotice.bad{color:#ffb1a5}
`;
document.head.appendChild(style);

let shopNotice='ミナ「必要なものだけどうぞ。勇者割引はありません。」';
let shopNoticeKind='';
function hasGear(name){return s.equipmentOwned.includes(name);}
function shopHtml(){
 const goods=SHOP_GOODS.map(g=>{
   const owned=g.type!=='consumable'&&hasGear(g.name);
   const equipped=(g.type==='weapon'&&s.weapon===g.name)||(g.type==='armor'&&s.armor===g.name);
   const disabled=(owned||s.gold<g.price)?'disabled':'';
   const state=equipped?'装備中':owned?'購入済み':'';
   return `<div class=lqGood><div><div class=lqGoodName>${g.name} <span class=lqGoodPrice>${g.price}G</span></div><div class=lqGoodDetail>${g.detail}</div>${state?`<div class=lqOwned>${state}</div>`:''}</div><button class=lqBuyBtn ${disabled} onclick="lqBuyGood('${g.id}')">${owned?'所持済':s.gold<g.price?'G不足':'購入'}</button></div>`;
 }).join('');
 return `<div class=lqShopOverlay><div class=lqShopPanel><div class=lqShopHeader><div><div class=lqShopTitle>ミナの道具屋</div><div class=lqGoodDetail>旅支度・装備品</div></div><div class=lqShopMoney>${s.gold} G</div></div><div class=lqShopGearNow><div class=lqGearChip>武器<b>${s.weapon}</b></div><div class=lqGearChip>防具<b>${s.armor}</b></div><div class=lqGearChip>ATK<b>${s.atk}</b></div><div class=lqGearChip>DEF<b>${s.def}</b></div></div><div class=lqGoods>${goods}</div><div class="lqShopNotice ${shopNoticeKind}">${shopNotice}</div><button class=lqShopClose onclick=lqCloseShop()>買い物を終える</button></div></div>`;
}
function decorateEquipmentShop(){
 if(!s.shopOpen||s.screen!=='world'||s.map!=='shopInterior')return;
 const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqShopOverlay'))return;
 shell.insertAdjacentHTML('beforeend',shopHtml());
}
window.lqCloseShop=function(){s.shopOpen=false;shopNoticeKind='';render();};
window.lqBuyGood=function(id){
 const g=SHOP_GOODS.find(x=>x.id===id);if(!g||s.gold<g.price)return;
 if(g.type==='consumable'){
   s.gold-=g.price;s.potions++;shopNotice=`薬草を1個購入。所持 ${s.potions}個。`;shopNoticeKind='good';
 }else if(g.type==='weapon'&&!hasGear(g.name)){
   s.gold-=g.price;s.equipmentOwned.push(g.name);s.weapon=g.name;s.atk+=g.atk;shopNotice=`${g.name}を装備した。ATK +${g.atk}！`;shopNoticeKind='good';
 }else if(g.type==='armor'&&!hasGear(g.name)){
   s.gold-=g.price;s.equipmentOwned.push(g.name);s.armor=g.name;s.def+=g.def;shopNotice=`${g.name}を装備した。DEF +${g.def}！`;shopNoticeKind='good';
 }
 save();render();
};

const moveV30=move;
move=function(dir){if(s.shopOpen){stopMoving();return}return moveV30(dir);};
const actionV30=action;
action=function(){
 if(s.shopOpen){stopMoving();return}
 if(!s.dialog&&s.map==='shopInterior'){
   const p=front();const n=currentNpcs().find(q=>q.x===p.x&&q.y===p.y);
   if(n?.kind==='lqShopInteriorKeeper'){stopMoving();s.shopOpen=true;shopNotice='ミナ「必要なものだけどうぞ。勇者割引はありません。」';shopNoticeKind='';return render();}
 }
 return actionV30();
};

/* DEF becomes a real battle stat. Same enemy rolls, then flat DEF reduction, then guard halves. */
enemyTurn=function(g=false){
 let raw=rnd(s.enemy.a[0],s.enemy.a[1]);let d=Math.max(1,raw-(s.def||0));if(g)d=Math.max(1,Math.floor(d/2));
 s.hp=Math.max(0,s.hp-d);s.log.push(`${s.enemy.n}の攻撃！ ${d}ダメージ！${s.def?`（DEF ${s.def}）`:''}`);
 if(!s.hp){s.hp=s.mh;s.screen='world';s.map='town';s.x=9;s.y=12;s.shopOpen=false;encounterGrace=3;s.dialog={name:'南門宿の主人',text:'また倒れて運ばれてきたぞ。勇者って大変だな。'};return render()}
 battle();
};

const battleV30=battle;
battle=function(){
 battleV30();
 const sub=app.querySelector('.battlePlayerSub');if(sub&&!sub.textContent.includes('DEF'))sub.textContent=`ATK ${s.atk}　DEF ${s.def||0}　薬草 ${s.potions}　EXP ${s.xp}/${s.nx}`;
};
const worldV30=world;
world=function(){worldV30();decorateEquipmentShop();};
const renderV30=render;
render=function(){const r=renderV30();if(s.shopOpen)decorateEquipmentShop();return r;};

window.LQ_EQUIPMENT_STATUS={weapon:true,armor:true,defenseStat:true,shopPanel:true,goods:SHOP_GOODS.map(g=>g.name)};
if(s.screen==='world')render();
})();
