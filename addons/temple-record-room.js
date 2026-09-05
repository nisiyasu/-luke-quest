(() => {
'use strict';

/* Collision-safe content add-on: a public-facing temple record room with story-safe world texture only. */
MAPS.templeRecordRoom={
 name:'王国神殿・記録室',w:10,h:9,
 tiles:['##########','#........#','#........#','#........#','#........#','#........#','#........#','#........#','####GG####'],
 npcs:[
  {x:2,y:2,e:'',name:'歴代巡礼者名簿',kind:'lqTempleRecordProp',text:'王都を訪れた巡礼者の名が年代順に並んでいる。何十年分もあるので、読むだけで旅が終わりそうだ。\nルーク「勇者の任務より先に目が負けます。」'},
  {x:7,y:2,e:'',name:'街道保全記録',kind:'lqTempleRecordProp',text:'王都近郊の橋、井戸、街道標識の修繕記録だ。最近は森側の巡回回数が増えている。'},
  {x:2,y:6,e:'',name:'寄付品台帳',kind:'lqTempleRecordProp',text:'毛布、保存食、薬草。神殿が旅人や避難者へ渡した物資が細かく記録されている。'},
  {x:7,y:6,e:'',name:'古い王都地図',kind:'lqTempleRecordProp',text:'今より城壁が小さかった頃の王都地図だ。南門だけは昔からほぼ同じ場所に描かれている。'}
 ]
};
if(MAPS.templeInterior&&!MAPS.templeInterior.npcs.some(n=>n.kind==='lqTempleRecordDoor')){
 MAPS.templeInterior.npcs.push({x:13,y:8,e:'',name:'記録室の扉',kind:'lqTempleRecordDoor',text:'一般閲覧用の記録室へ続く扉。'});
}
const tileClassBase=tileClass;
tileClass=function(c){if(s.map==='templeRecordRoom'){if(c==='#')return'wall lqRecordWall';if(c==='G')return'gate lqRecordDoorTile';return'lqRecordFloor';}return tileClassBase(c);};
const tileEmojiBase=tileEmoji;tileEmoji=function(c){if(s.map==='templeRecordRoom')return'';return tileEmojiBase(c);};
const npcClassBase=npcClass;npcClass=function(n){if(n?.kind==='lqTempleRecordDoor')return'npc lqTempleRecordDoor';if(n?.kind==='lqTempleRecordProp')return'npc lqTempleRecordProp';return npcClassBase(n);};
const style=document.createElement('style');
style.textContent=`
.tile.lqRecordFloor{background:linear-gradient(135deg,#a9b0b2 0 48%,#7f898d 49% 52%,#b8bfc0 53%);box-shadow:inset 0 0 0 1px #eff7f52a}.tile.lqRecordWall{background:linear-gradient(#5e6a70,#384349);box-shadow:inset 0 -8px #20292eaa}.tile.lqRecordDoorTile{background:linear-gradient(#89969a,#515e63);box-shadow:inset 0 0 0 3px #c7d3d255}
.lqTempleRecordDoor{width:40px;height:46px;font-size:0;background:linear-gradient(#586b75,#33444e);border:3px solid #9aabb0;border-radius:11px 11px 3px 3px;box-shadow:inset 0 0 0 2px #26343c,0 5px 7px #0008}.lqTempleRecordDoor:before{content:'';position:absolute;left:8px;right:8px;top:7px;height:12px;border:1px solid #c8ab5c66;background:#49606a}.lqTempleRecordDoor:after{content:'';position:absolute;right:6px;top:23px;width:5px;height:5px;border-radius:50%;background:#d8bd68}
.lqTempleRecordProp{width:42px;height:42px;font-size:0;border-radius:4px;background:linear-gradient(#7a654d,#4c3b2c);border:2px solid #a38964;box-shadow:0 5px 7px #0007}.lqTempleRecordProp:before{content:'';position:absolute;left:7px;right:7px;top:6px;bottom:6px;background:repeating-linear-gradient(0deg,#d5caa4 0 4px,#9f9372 4px 5px);transform:rotate(-3deg);box-shadow:0 1px 3px #0006}.lqTempleRecordProp:after{content:'✦';position:absolute;right:3px;top:1px;color:#e4cf83;font-size:8px}
.lqRecordShelf{position:absolute;z-index:2;width:165px;height:54px;border:4px solid #4a3728;border-radius:4px;background:linear-gradient(#694e39,#3b2d23);box-shadow:0 7px 9px #0007;pointer-events:none}.lqRecordShelf:after{content:'';position:absolute;inset:7px;background:repeating-linear-gradient(90deg,#8e5f4e 0 5px,#c0a261 5px 9px,#546f7c 9px 14px,#7a7951 14px 19px)}
.lqRecordDesk{position:absolute;z-index:2;width:120px;height:42px;border:4px solid #5b422d;border-radius:6px;background:linear-gradient(#98704d,#64452f);box-shadow:0 6px 8px #0006;pointer-events:none}.lqRecordDesk:after{content:'';position:absolute;left:35px;top:6px;width:46px;height:28px;background:#d9cda6;transform:rotate(2deg);box-shadow:0 2px 3px #0005}
`;
document.head.appendChild(style);
function ahead(){if(s.screen!=='world')return null;const p=front();return currentNpcs().find(n=>n.x===p.x&&n.y===p.y)||null;}
function enter(){stopMoving();s.map='templeRecordRoom';s.x=4;s.y=6;s.dir='up';s.dialog={name:'王国神殿・記録室',text:'石壁の小部屋には、王都と旅人に関する記録が整然と保管されている。\nルーク「秘密の書庫っぽい……と思ったら『一般閲覧』って書いてあります。」'};render();}
const actionBase=action;action=function(){if(!s.dialog&&s.map==='templeInterior'&&ahead()?.kind==='lqTempleRecordDoor')return enter();return actionBase();};
const checkGateBase=checkGate;checkGate=function(){if(s.map==='templeRecordRoom'&&(MAPS.templeRecordRoom.tiles[s.y]||'')[s.x]==='G'){stopMoving();s.map='templeInterior';s.x=12;s.y=8;s.dir='left';s.dialog={name:'王国神殿・礼拝堂',text:'記録室を出て礼拝堂へ戻った。'};return;}return checkGateBase();};
function decorate(){if(s.screen!=='world'||s.map!=='templeRecordRoom')return;const w=app.querySelector('.world');if(!w||w.querySelector('.lqRecordShelf'))return;const shelf=document.createElement('div');shelf.className='lqRecordShelf';shelf.style.left=`${2.15*TS}px`;shelf.style.top=`${1.15*TS}px`;w.appendChild(shelf);const desk=document.createElement('div');desk.className='lqRecordDesk';desk.style.left=`${3.45*TS}px`;desk.style.top=`${3.65*TS}px`;w.appendChild(desk);}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};const renderBase=render;render=function(){const r=renderBase();decorate();return r;};
window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{templeRecordRoom:{entryMap:'templeInterior',exitMap:'templeInterior',type:'public-record-room',hiddenCanonRevealed:false}});
if(s.screen==='world')decorate();
})();
