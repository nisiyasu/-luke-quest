(() => {
'use strict';

/* LUKE QUEST v0.17 second building-interior patch.
   Moves Mina's herb service into a walkable item-shop interior and adds physical entry/exit. */

MAPS.shopInterior={
  name:'ミナの道具屋',w:14,h:11,
  tiles:[
    '##############',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '######GG######'
  ],
  npcs:[
    {x:7,y:3,e:'👩',name:'道具屋のミナ',kind:'lqShopInteriorKeeper',text:'薬草は8Gです。今日はちゃんと店内で売っています。'},
    {x:3,y:3,e:'🧪',name:'薬草棚',kind:'lqShopProp',text:'乾燥した薬草と小瓶が整然と並ぶ。値札は全部きっちり同じ向きだ。'},
    {x:10,y:3,e:'🧴',name:'旅用品の棚',kind:'lqShopProp',text:'包帯、油、火打石。冒険で必要そうな物ほど地味な棚に並んでいる。'},
    {x:3,y:7,e:'📦',name:'仕入れ箱',kind:'lqShopProp',text:'「割れ物・薬草・勇気以外」と書かれている。\nルーク「勇気はやっぱり仕入れてないんだ……。」'},
    {x:10,y:7,e:'⚖️',name:'商人の天秤',kind:'lqShopProp',text:'小さな真鍮の天秤。ミナは薬草の束をかなり几帳面に量っているらしい。'}
  ]
};

const minaOutside=MAPS.town?.npcs?.find(n=>n.kind==='lqShop');
if(minaOutside){
  minaOutside.kind='lqShopDoor';
  minaOutside.e='🚪';
  minaOutside.name='ミナの道具屋';
  minaOutside.text='扉を開けて道具屋へ入る。';
}

function shopNpcAhead(){
  if(s.screen!=='world')return null;
  const p=front();
  return currentNpcs().find(n=>n.x===p.x&&n.y===p.y)||null;
}

function enterShop(){
  stopMoving();
  s.map='shopInterior';
  s.x=6;s.y=8;s.dir='up';
  s.dialog={name:'ミナの道具屋',text:'棚いっぱいの薬草と旅用品が並ぶ小さな店だ。\nミナ「いらっしゃいませ。勇者さまでも値札は普通です。」'};
  render();
}

function buyHerbInside(){
  stopMoving();
  if(s.gold<8){
    s.dialog={name:'道具屋のミナ',text:`薬草は8Gです。\n所持金：${s.gold}G\nミナ「あと${8-s.gold}Gです。勇者の肩書きは換金できません。」`};
    return render();
  }
  s.gold-=8;
  s.potions+=1;
  s.dialog={name:'道具屋のミナ',text:`薬草を1個買った！\n所持：${s.potions}個　残金：${s.gold}G\nミナ「ありがとうございます。袋の底で潰さないでくださいね。」`};
  render();
}

const tileClassV16=tileClass;
tileClass=function(c){
  if(s.map==='shopInterior'){
    if(c==='#')return'wall lqShopWall';
    if(c==='G')return'gate lqShopDoorTile';
    return'lqShopFloor';
  }
  return tileClassV16(c);
};

const tileEmojiV16=tileEmoji;
tileEmoji=function(c){
  if(s.map==='shopInterior'&&c==='G')return'🚪';
  return tileEmojiV16(c);
};

const checkGateV16=checkGate;
checkGate=function(){
  if(s.map==='shopInterior'){
    const c=(MAPS.shopInterior.tiles[s.y]||'')[s.x];
    if(c==='G'){
      stopMoving();
      s.map='town';
      s.x=13;s.y=12;s.dir='down';
      s.dialog={name:'ミナの道具屋',text:'道具屋を出て王都へ戻った。'};
      return;
    }
  }
  return checkGateV16();
};

const actionV16=action;
action=function(){
  if(s.dialog)return actionV16();
  const n=shopNpcAhead();
  if(s.map==='town'&&n?.kind==='lqShopDoor')return enterShop();
  if(s.map==='shopInterior'&&n?.kind==='lqShopInteriorKeeper')return buyHerbInside();
  return actionV16();
};

const style=document.createElement('style');
style.textContent=`
.tile.lqShopFloor{background:linear-gradient(135deg,#c7ad7a 0 24%,#b49768 24% 50%,#cdb584 50% 74%,#b99a6c 74%);box-shadow:inset 0 0 0 1px #f7e7b62b}
.tile.lqShopWall{background:linear-gradient(#6b5a45,#403528);box-shadow:inset 0 -7px #241e18aa}
.tile.lqShopDoorTile{background:linear-gradient(#d5b66f,#826037);font-size:24px;box-shadow:inset 0 0 0 3px #f1d38a55}
.lqShopCounter{position:absolute;z-index:4;background:linear-gradient(#80603c,#4f3926);border:3px solid #b8955c;border-radius:7px;box-shadow:0 5px 10px #0007;pointer-events:none}
.lqShopMat{position:absolute;z-index:2;background:repeating-linear-gradient(45deg,#274d5b 0 12px,#356979 12px 24px);border:3px solid #d8bd72;border-radius:10px;opacity:.9;pointer-events:none}
.lqShopPrice{position:absolute;z-index:6;transform:translate(-50%,-100%);background:#182a2fe8;color:#fff0b8;border:1px solid #d9bd72;border-radius:8px;padding:4px 7px;font-size:10px;font-weight:900;white-space:nowrap;pointer-events:none}
`;
document.head.appendChild(style);

function decorateShop(){
  if(s.screen!=='world'||s.map!=='shopInterior')return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqShopCounter'))return;
  const counter=document.createElement('div');
  counter.className='lqShopCounter';counter.style.left=`${5*TS}px`;counter.style.top=`${2*TS+20}px`;counter.style.width=`${5*TS}px`;counter.style.height='20px';w.appendChild(counter);
  const mat=document.createElement('div');
  mat.className='lqShopMat';mat.style.left=`${5*TS}px`;mat.style.top=`${5*TS}px`;mat.style.width=`${4*TS}px`;mat.style.height=`${3*TS}px`;w.appendChild(mat);
  const price=document.createElement('div');
  price.className='lqShopPrice';price.textContent='薬草 8G';price.style.left=`${7*TS+TS/2}px`;price.style.top=`${3*TS}px`;w.appendChild(price);
}

const worldV16=world;
world=function(){worldV16();decorateShop();};
const renderV16=render;
render=function(){const r=renderV16();if(s.screen==='world'&&s.map==='shopInterior')decorateShop();return r;};

window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{shopInterior:{entryMap:'town',exitMap:'town',service:'shop',item:'薬草',price:8}});

if(s.screen==='world')render();
})();
