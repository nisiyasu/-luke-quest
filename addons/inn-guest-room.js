(() => {
'use strict';

/* Collision-safe content add-on: expands the existing inn into a second walkable interior room. */
MAPS.innGuestRoom={
 name:'南門宿・客室',w:10,h:8,
 tiles:['##########','#........#','#........#','#........#','#........#','#........#','#........#','####GG####'],
 npcs:[
  {x:2,y:2,e:'',name:'窓辺のベッド',kind:'lqGuestRoomProp',text:'白いシーツがきっちり張られている。窓から王都の屋根が少し見える。\nルーク「ベッドを見るたびに冒険をやめたくなるの、勇者としてどうなんでしょう。」'},
  {x:7,y:2,e:'',name:'旅人の荷物台',kind:'lqGuestRoomProp',text:'空の荷物台だ。小さな傷が無数についていて、何人もの旅人がここを使ったことが分かる。'},
  {x:2,y:5,e:'',name:'洗面台',kind:'lqGuestRoomProp',text:'冷たい水を張った陶器の洗面器。横には小さな石鹸が置かれている。'},
  {x:7,y:5,e:'',name:'街道案内の額',kind:'lqGuestRoomProp',text:'「南門から街道へ。森へ向かう旅人は日没前に戻ること」と書かれている。'}
 ]
};
if(MAPS.innInterior&&!MAPS.innInterior.npcs.some(n=>n.kind==='lqGuestRoomDoor')){
 MAPS.innInterior.npcs.push({x:11,y:6,e:'',name:'客室の扉',kind:'lqGuestRoomDoor',text:'宿の奥にある客室。'});
}

const tileClassBase=tileClass;
tileClass=function(c){
 if(s.map==='innGuestRoom'){
  if(c==='#')return'wall lqGuestWall';
  if(c==='G')return'gate lqGuestDoorTile';
  return'lqGuestFloor';
 }
 return tileClassBase(c);
};
const tileEmojiBase=tileEmoji;
tileEmoji=function(c){if(s.map==='innGuestRoom')return'';return tileEmojiBase(c);};
const npcClassBase=npcClass;
npcClass=function(n){
 if(n?.kind==='lqGuestRoomDoor')return'npc lqGuestRoomDoor';
 if(n?.kind==='lqGuestRoomProp')return'npc lqGuestRoomProp';
 return npcClassBase(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqGuestFloor{background:repeating-linear-gradient(90deg,#9d764d 0 23px,#855f3d 23px 25px);box-shadow:inset 0 1px #d9b38638}.tile.lqGuestWall{background:linear-gradient(#665443,#46382d);box-shadow:inset 0 -8px #292119aa}.tile.lqGuestDoorTile{background:linear-gradient(#b98750,#704a2f);box-shadow:inset 0 0 0 3px #e3b97655}
.lqGuestRoomDoor{width:40px;height:45px;font-size:0;background:linear-gradient(#71462d,#4b2d20);border:3px solid #be8d54;border-radius:4px;box-shadow:inset 0 0 0 2px #2c1a14,0 5px 7px #0007}.lqGuestRoomDoor:after{content:'';position:absolute;right:6px;top:21px;width:5px;height:5px;border-radius:50%;background:#e2c06d}
.lqGuestRoomProp{width:40px;height:40px;font-size:0;background:linear-gradient(145deg,#886548,#503b2d);border:2px solid #b89062;border-radius:7px;box-shadow:0 4px 6px #0006}.lqGuestRoomProp:after{content:'✦';position:absolute;right:3px;top:2px;color:#ead59a;font-size:9px}
.lqGuestBedVisual{position:absolute;z-index:3;width:112px;height:70px;border:4px solid #765139;border-radius:8px;background:linear-gradient(#f0e4c9 0 27%,#5f7a91 28% 100%);box-shadow:0 7px 10px #0006;pointer-events:none}.lqGuestBedVisual:before{content:'';position:absolute;left:8px;top:7px;width:44px;height:18px;border-radius:8px;background:#fff8e8;box-shadow:inset 0 -3px #d9cbb3}
.lqGuestWindow{position:absolute;z-index:2;width:72px;height:48px;border:5px solid #6c4d36;background:linear-gradient(160deg,#8ec5db,#d2e5df 52%,#709bb2 53%);box-shadow:inset 0 0 0 2px #e1c686,0 4px 8px #0005;pointer-events:none}.lqGuestWindow:before{content:'';position:absolute;left:50%;top:0;bottom:0;width:3px;background:#65472f}.lqGuestWindow:after{content:'';position:absolute;left:0;right:0;top:50%;height:3px;background:#65472f}
`;
document.head.appendChild(style);
function frontNpc(){if(s.screen!=='world')return null;const p=front();return currentNpcs().find(n=>n.x===p.x&&n.y===p.y)||null;}
function enterGuestRoom(){stopMoving();s.map='innGuestRoom';s.x=4;s.y=5;s.dir='up';s.dialog={name:'南門宿・客室',text:'廊下の奥の扉を開けると、小さく静かな客室があった。\nルーク「ここに立てこもれば冒険終了……いや、連れ戻されますよね。」'};render();}
const actionBase=action;
action=function(){if(!s.dialog&&s.map==='innInterior'&&frontNpc()?.kind==='lqGuestRoomDoor')return enterGuestRoom();return actionBase();};
const checkGateBase=checkGate;
checkGate=function(){
 if(s.map==='innGuestRoom'&&(MAPS.innGuestRoom.tiles[s.y]||'')[s.x]==='G'){
  stopMoving();s.map='innInterior';s.x=10;s.y=6;s.dir='left';s.dialog={name:'南門宿',text:'客室を出て宿の一階へ戻った。'};return;
 }
 return checkGateBase();
};
function decorateGuest(){
 if(s.screen!=='world'||s.map!=='innGuestRoom')return;const w=app.querySelector('.world');if(!w||w.querySelector('.lqGuestBedVisual'))return;
 const bed=document.createElement('div');bed.className='lqGuestBedVisual';bed.style.left=`${1.25*TS}px`;bed.style.top=`${1.2*TS}px`;w.appendChild(bed);
 const win=document.createElement('div');win.className='lqGuestWindow';win.style.left=`${5.9*TS}px`;win.style.top=`${1.05*TS}px`;w.appendChild(win);
}
const worldBase=world;world=function(){const r=worldBase();decorateGuest();return r;};
const renderBase=render;render=function(){const r=renderBase();decorateGuest();return r;};
window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{innGuestRoom:{entryMap:'innInterior',exitMap:'innInterior',type:'guest-room'}});
if(s.screen==='world')decorateGuest();
})();
