(() => {
'use strict';

/* REQ-025 — walkable Aldia castle gatehouse checkpoint.
   This is intentionally a small gatehouse, not a claim that the full castle is complete. */

const GATEHOUSE_MAP='aldiaCastleGatehouse';
const ENTRY_X=8,ENTRY_Y=1;

MAPS[GATEHOUSE_MAP]={
  name:'王都アルディア・王城門衛詰所',w:12,h:10,
  tiles:[
    '############',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#####GG#####'
  ],
  npcs:[
    {x:6,y:3,e:'',name:'王城門衛ベルク',kind:'lqCastleGuard',text:'レオン様が姿を消してから、王城も神殿も朝から落ち着かん。君が新しい勇者だって？\nルーク「できれば、その呼び方だけ城門で止めてもらえません？」'},
    {x:2,y:2,e:'',name:'整列した槍掛け',kind:'lqGatehouseProp',text:'磨かれた槍が寸分違わず並んでいる。\nルーク「一本だけ斜めにしたら怒られそうですね。やりませんけど。」'},
    {x:9,y:2,e:'',name:'門衛交代表',kind:'lqGatehouseProp',text:'夜明け、昼、夕刻、深夜。細かい交代時刻が記されている。王都の門は一日中誰かが守っている。'},
    {x:2,y:6,e:'',name:'王国の青旗',kind:'lqGatehouseProp',text:'青地に銀の紋章。王城へ続く門衛詰所らしく、布地まできっちり手入れされている。'},
    {x:9,y:6,e:'',name:'門衛の休憩机',kind:'lqGatehouseProp',text:'冷めた茶と、半分だけ残ったパン。\nルーク「勇者より門衛さんの方がちゃんと働いてる気がしてきました。」'}
  ]
};

if(MAPS.town&&!MAPS.town.npcs.some(n=>n.kind==='lqCastleGatehouseDoor')){
  MAPS.town.npcs.push({x:ENTRY_X,y:ENTRY_Y,e:'',name:'王城門衛詰所の扉',kind:'lqCastleGatehouseDoor',text:'王都北側、王城へ続く門衛詰所の重い扉。'});
}

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===GATEHOUSE_MAP){
    if(c==='#')return'wall lqGatehouseWall';
    if(c==='G')return'gate lqGatehouseExit';
    return'lqGatehouseFloor';
  }
  return baseTileClass(c);
};

const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===GATEHOUSE_MAP)return'';return baseTileEmoji(c);};

const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqCastleGatehouseDoor')return'npc lqCastleGatehouseDoor';
  if(n?.kind==='lqCastleGuard')return'npc lqCastleGuard';
  if(n?.kind==='lqGatehouseProp')return'npc lqGatehouseProp';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqGatehouseFloor{background:linear-gradient(135deg,#77766f 0 47%,#60615e 48% 52%,#85837b 53%);box-shadow:inset 0 1px #d6d1bf20}.tile.lqGatehouseWall{background:linear-gradient(#65676b,#46484d 68%,#303238);box-shadow:inset 0 -8px #202127aa}.tile.lqGatehouseExit{background:linear-gradient(#9c7950,#62472f);box-shadow:inset 0 0 0 3px #e8c47766}
.lqCastleGatehouseDoor{width:40px;height:45px;font-size:0;background:linear-gradient(90deg,#3f4650,#6a737e 48%,#343b43 49%);border:3px solid #c8b279;border-radius:4px;box-shadow:inset 0 0 0 2px #1d2228,0 5px 9px #0008}.lqCastleGatehouseDoor:before{content:'♜';position:absolute;left:8px;top:5px;color:#e4d39e;font-size:23px;text-shadow:0 2px 3px #000}.lqCastleGatehouseDoor:after{content:'';position:absolute;right:5px;top:20px;width:5px;height:5px;border-radius:50%;background:#ffe27f;box-shadow:0 0 9px #ffd95f}
.lqCastleGuard{width:40px;height:44px;font-size:0;border-radius:11px 11px 6px 6px;background:linear-gradient(#303f58 0 24%,#d7b18b 25% 45%,#69737d 46% 100%);border:2px solid #bfc7cf;box-shadow:0 5px 8px #0008}.lqCastleGuard:before{content:'';position:absolute;left:7px;top:2px;width:24px;height:15px;border-radius:50% 50% 25% 25%;background:#8b939d;border:2px solid #d4d8dc}.lqCastleGuard:after{content:'…';position:absolute;right:-7px;top:-11px;color:#fff5c8;font-size:15px;text-shadow:0 2px 4px #000}
.lqGatehouseProp{width:40px;height:38px;font-size:0;border:2px solid #a99b7f;border-radius:6px;background:linear-gradient(145deg,#6d665a,#3e4248);box-shadow:0 4px 7px #0007}.lqGatehouseProp:after{content:'✦';position:absolute;right:3px;top:1px;color:#f1d68e;font-size:9px}
.lqGatehouseRack{position:absolute;z-index:3;width:84px;height:72px;border:4px solid #493727;border-radius:4px;background:repeating-linear-gradient(90deg,#565d65 0 5px,#b0b6ba 5px 8px,#3a2c22 8px 18px);box-shadow:0 7px 10px #0008;pointer-events:none}.lqGatehouseDesk{position:absolute;z-index:3;width:92px;height:56px;border-radius:5px;background:linear-gradient(#8c6746,#5c402d);border:4px solid #3c2a1f;box-shadow:0 8px 10px #0008;pointer-events:none}.lqGatehouseBanner{position:absolute;z-index:2;width:52px;height:82px;background:linear-gradient(90deg,#123c76,#2360a0,#123c76);clip-path:polygon(0 0,100% 0,100% 80%,50% 100%,0 80%);border-top:4px solid #d2c38e;box-shadow:0 6px 10px #0007;pointer-events:none}.lqGatehouseBanner:after{content:'✦';position:absolute;left:14px;top:22px;color:#e7e5df;font-size:25px;text-shadow:0 2px 3px #07111f}
`;
document.head.appendChild(style);

function gatehouseNpcAhead(){
  if(s.screen!=='world'||s.map!==GATEHOUSE_MAP)return null;
  const p=front();
  return MAPS[GATEHOUSE_MAP].npcs.find(n=>n.x===p.x&&n.y===p.y)||null;
}

function enterGatehouse(){
  stopMoving();
  s.map=GATEHOUSE_MAP;s.x=5;s.y=7;s.dir='up';
  s.dialog={name:'王城門衛詰所',text:'石造りの詰所へ入ると、磨かれた武具と紙の匂いがした。\nルーク「王城って、入った瞬間から背筋を伸ばせって空気がありますね……。」'};
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'&&s.map==='town'){
    const p=front();
    if(p.x===ENTRY_X&&p.y===ENTRY_Y)return enterGatehouse();
  }
  if(!s.dialog&&s.screen==='world'&&s.map===GATEHOUSE_MAP){
    const n=gatehouseNpcAhead();
    if(n){stopMoving();s.dialog=n;render();return;}
  }
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.map===GATEHOUSE_MAP&&(MAPS[GATEHOUSE_MAP].tiles[s.y]||'')[s.x]==='G'){
    stopMoving();
    s.map='town';s.x=8;s.y=2;s.dir='down';
    s.dialog={name:'王都アルディア',text:'門衛詰所を出て、王都北側の通りへ戻った。'};
    return;
  }
  return baseCheckGate();
};

function decorateGatehouse(){
  if(s.screen!=='world'||s.map!==GATEHOUSE_MAP)return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqGatehouseRack'))return;
  const rack=document.createElement('div');rack.className='lqGatehouseRack';rack.style.left=`${1.1*TS}px`;rack.style.top=`${1.1*TS}px`;w.appendChild(rack);
  const desk=document.createElement('div');desk.className='lqGatehouseDesk';desk.style.left=`${7.15*TS}px`;desk.style.top=`${4.65*TS}px`;w.appendChild(desk);
  const banner=document.createElement('div');banner.className='lqGatehouseBanner';banner.style.left=`${4.45*TS}px`;banner.style.top=`${1.0*TS}px`;w.appendChild(banner);
}

const baseWorld=world;
world=function(){const r=baseWorld();decorateGatehouse();return r;};
const baseRender=render;
render=function(){const r=baseRender();decorateGatehouse();return r;};

window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{aldiaCastleGatehouse:{entryMap:'town',map:GATEHOUSE_MAP,exitMap:'town',type:'castle-gatehouse'}});
window.LQ_CASTLE_GATEHOUSE_STATUS={version:'1.0',map:GATEHOUSE_MAP,entry:{map:'town',x:ENTRY_X,y:ENTRY_Y},guardCount:1,propCount:4,rewardsAdded:false,protectedCanonChanged:false,walkable:true,fullCastleComplete:false};
if(s.screen==='world')decorateGatehouse();
})();
