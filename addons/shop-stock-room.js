(() => {
'use strict';

/* Collision-safe content add-on: adds a small walkable stock room behind Mina's item shop. */
MAPS.shopStockRoom={
 name:'ミナの道具屋・倉庫',w:9,h:8,
 tiles:['#########','#.......#','#.......#','#.......#','#.......#','#.......#','#.......#','###GG####'],
 npcs:[
  {x:2,y:2,e:'',name:'薬草の乾燥棚',kind:'lqStockProp',text:'葉の色ごとに束が分けられている。札には採取日まで書いてある。\nルーク「僕の予定表より管理されています……。」'},
  {x:6,y:2,e:'',name:'旅用品の木箱',kind:'lqStockProp',text:'包帯、油、替え紐。派手さはないが、旅に欠かせない物ばかりだ。'},
  {x:2,y:5,e:'',name:'仕入れ台帳',kind:'lqStockProp',text:'街道側の仕入れ欄に小さな遅延印が増えている。森の魔物が増えた影響らしい。'},
  {x:6,y:5,e:'',name:'空き瓶の籠',kind:'lqStockProp',text:'洗って乾かした小瓶が逆さに並んでいる。ミナの几帳面さが倉庫まで侵食している。'}
 ]
};
if(MAPS.shopInterior&&!MAPS.shopInterior.npcs.some(n=>n.kind==='lqStockRoomDoor')){
 MAPS.shopInterior.npcs.push({x:11,y:6,e:'',name:'倉庫の扉',kind:'lqStockRoomDoor',text:'店の奥にある在庫倉庫。'});
}
const tileClassBase=tileClass;
tileClass=function(c){if(s.map==='shopStockRoom'){if(c==='#')return'wall lqStockWall';if(c==='G')return'gate lqStockDoorTile';return'lqStockFloor';}return tileClassBase(c);};
const tileEmojiBase=tileEmoji;tileEmoji=function(c){if(s.map==='shopStockRoom')return'';return tileEmojiBase(c);};
const npcClassBase=npcClass;npcClass=function(n){if(n?.kind==='lqStockRoomDoor')return'npc lqStockRoomDoor';if(n?.kind==='lqStockProp')return'npc lqStockProp';return npcClassBase(n);};
const style=document.createElement('style');
style.textContent=`
.tile.lqStockFloor{background:repeating-linear-gradient(90deg,#826448 0 22px,#6b5039 22px 24px);box-shadow:inset 0 1px #caa47b31}.tile.lqStockWall{background:linear-gradient(#5d5144,#39332c);box-shadow:inset 0 -8px #24201baa}.tile.lqStockDoorTile{background:linear-gradient(#a98257,#64472f);box-shadow:inset 0 0 0 3px #d4b17855}
.lqStockRoomDoor{width:40px;height:45px;font-size:0;background:linear-gradient(#6c472d,#432c20);border:3px solid #b48250;border-radius:4px;box-shadow:inset 0 0 0 2px #281a14,0 5px 7px #0007}.lqStockRoomDoor:after{content:'';position:absolute;right:6px;top:20px;width:5px;height:5px;border-radius:50%;background:#dfbd69}
.lqStockProp{width:42px;height:42px;font-size:0;border-radius:5px;background:linear-gradient(135deg,#8b6844,#5c432d);border:2px solid #ae8355;box-shadow:0 5px 7px #0007}.lqStockProp:before{content:'';position:absolute;inset:7px;border:2px solid #d2ac6b55;background:repeating-linear-gradient(0deg,#708153 0 4px,#4d5f3d 4px 7px);opacity:.88}.lqStockProp:after{content:'✦';position:absolute;right:3px;top:2px;color:#e9d39b;font-size:8px}
.lqStockCrates{position:absolute;z-index:2;width:92px;height:58px;background:linear-gradient(135deg,#946c43,#654629);border:4px solid #4f3422;box-shadow:inset 0 0 0 4px #ae8456,48px 13px 0 -6px #725033,48px 13px 0 -2px #4e3421;pointer-events:none}.lqStockShelf{position:absolute;z-index:2;width:130px;height:27px;border:4px solid #5a402d;background:repeating-linear-gradient(90deg,#7f965b 0 10px,#a8b477 10px 17px,#79543c 17px 24px);box-shadow:0 7px 8px #0006;pointer-events:none}
`;
document.head.appendChild(style);
function ahead(){if(s.screen!=='world')return null;const p=front();return currentNpcs().find(n=>n.x===p.x&&n.y===p.y)||null;}
function enter(){stopMoving();s.map='shopStockRoom';s.x=4;s.y=5;s.dir='up';s.dialog={name:'ミナの道具屋・倉庫',text:'店の奥は、薬草と旅用品がぎっしり詰まった倉庫だった。\nルーク「勝手に入ってる感じがすごいですが、扉に鍵はありませんでした。」'};render();}
const actionBase=action;action=function(){if(!s.dialog&&s.map==='shopInterior'&&ahead()?.kind==='lqStockRoomDoor')return enter();return actionBase();};
const checkGateBase=checkGate;checkGate=function(){if(s.map==='shopStockRoom'&&(MAPS.shopStockRoom.tiles[s.y]||'')[s.x]==='G'){stopMoving();s.map='shopInterior';s.x=10;s.y=6;s.dir='left';s.dialog={name:'ミナの道具屋',text:'倉庫から売り場へ戻った。'};return;}return checkGateBase();};
function decorate(){if(s.screen!=='world'||s.map!=='shopStockRoom')return;const w=app.querySelector('.world');if(!w||w.querySelector('.lqStockCrates'))return;const c=document.createElement('div');c.className='lqStockCrates';c.style.left=`${1.15*TS}px`;c.style.top=`${3.15*TS}px`;w.appendChild(c);const sh=document.createElement('div');sh.className='lqStockShelf';sh.style.left=`${4.2*TS}px`;sh.style.top=`${1.35*TS}px`;w.appendChild(sh);}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};const renderBase=render;render=function(){const r=renderBase();decorate();return r;};
window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{shopStockRoom:{entryMap:'shopInterior',exitMap:'shopInterior',type:'stock-room'}});
if(s.screen==='world')decorate();
})();
