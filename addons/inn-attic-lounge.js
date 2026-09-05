(() => {
'use strict';

/* REQ-010 Checkpoint A/B: a real walkable attic lounge reached from the existing inn guest room. */
MAPS.innAtticLounge={
 name:'南門宿・屋根裏談話室',w:11,h:9,
 tiles:[
  '###########',
  '#.........#',
  '#.........#',
  '#.........#',
  '#.........#',
  '#.........#',
  '#.........#',
  '#.........#',
  '#####G#####'
 ],
 npcs:[
  {x:2,y:2,e:'',name:'旅人の本棚',kind:'lqAtticProp',text:'王都周辺の街道記録や、旅人が置いていった薄い本が並んでいる。\nルーク「勇者の心得……最初の項目が『無理をしない』なんですけど。」'},
  {x:8,y:2,e:'',name:'古い街道地図',kind:'lqAtticProp',text:'壁に古い街道地図が留められている。王都から北東の森へ伸びる線だけ、何度も指でなぞられた跡がある。'},
  {x:2,y:6,e:'',name:'旅人の置き手紙',kind:'lqAtticProp',text:'「森へ向かうなら朝に出ろ。夕方の霧は道を一つ増やす」と走り書きされている。\nルーク「道が増えるって、嫌な表現ですね……。」'},
  {x:8,y:6,e:'',name:'暖炉脇の椅子',kind:'lqAtticProp',text:'使い込まれた椅子。座面だけ妙に柔らかい。\nルーク「ここ、危険です。座ったら冒険が終わります。」'}
 ]
};

/* Add one unobtrusive door to a free east-side tile of the already-walkable guest room. */
if(MAPS.innGuestRoom&&!MAPS.innGuestRoom.npcs.some(n=>n.kind==='lqAtticDoor')){
 MAPS.innGuestRoom.npcs.push({x:8,y:4,e:'',name:'屋根裏への扉',kind:'lqAtticDoor',text:'細い階段が上へ続いている。'});
}

const tileClassBase=tileClass;
tileClass=function(c){
 if(s.map==='innAtticLounge'){
  if(c==='#')return'wall lqAtticWall';
  if(c==='G')return'gate lqAtticDoorTile';
  return'lqAtticFloor';
 }
 return tileClassBase(c);
};
const tileEmojiBase=tileEmoji;
tileEmoji=function(c){if(s.map==='innAtticLounge')return'';return tileEmojiBase(c);};
const npcClassBase=npcClass;
npcClass=function(n){
 if(n?.kind==='lqAtticDoor')return'npc lqAtticDoor';
 if(n?.kind==='lqAtticProp')return'npc lqAtticProp';
 return npcClassBase(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqAtticFloor{background:repeating-linear-gradient(90deg,#79593d 0 23px,#60432f 23px 25px);box-shadow:inset 0 1px #c8996935}.tile.lqAtticWall{background:linear-gradient(#4e4034,#302922);box-shadow:inset 0 -8px #191511aa}.tile.lqAtticDoorTile{background:linear-gradient(#a77748,#61442f);box-shadow:inset 0 0 0 3px #deb06e55}
.lqAtticDoor{width:38px;height:44px;font-size:0;background:linear-gradient(#59402f,#34261e);border:3px solid #a67b50;border-radius:4px;box-shadow:inset 0 0 0 2px #211913,0 5px 7px #0007}.lqAtticDoor:before{content:'↟';position:absolute;inset:0;display:grid;place-items:center;color:#e4c179;font-size:19px;font-weight:900}
.lqAtticProp{width:38px;height:38px;font-size:0;border:2px solid #aa865d;border-radius:6px;background:linear-gradient(145deg,#71553e,#403128);box-shadow:0 4px 6px #0006}.lqAtticProp:after{content:'✦';position:absolute;right:3px;top:2px;color:#e6cb86;font-size:9px}
.lqAtticBookcase{position:absolute;z-index:3;width:100px;height:72px;border:5px solid #5c402d;background:repeating-linear-gradient(0deg,#2f241d 0 18px,#6c4d34 19px 23px),repeating-linear-gradient(90deg,#8b6540 0 7px,#4d7290 8px 14px,#8f4f49 15px 21px,#baa06d 22px 28px);box-shadow:0 7px 8px #0007;pointer-events:none}
.lqAtticTable{position:absolute;z-index:3;width:92px;height:52px;border-radius:48%;background:radial-gradient(ellipse,#9c754d,#68482f 72%);border:4px solid #4b3527;box-shadow:0 8px 8px #0006;pointer-events:none}.lqAtticTable:after{content:'';position:absolute;left:13px;right:13px;top:15px;height:14px;background:linear-gradient(12deg,transparent 0 15%,#d9ca9f 16% 85%,transparent 86%);opacity:.8}
.lqAtticHearth{position:absolute;z-index:3;width:92px;height:76px;border:6px solid #665b50;border-radius:8px 8px 3px 3px;background:linear-gradient(#47433d 0 35%,#251c18 36%);box-shadow:0 8px 9px #0007;pointer-events:none}.lqAtticHearth:after{content:'';position:absolute;left:19px;right:19px;bottom:9px;height:32px;border-radius:50% 50% 25% 25%;background:radial-gradient(ellipse at 50% 80%,#fff0a0 0 15%,#e68e36 28%,#9e3f27 50%,transparent 70%);filter:drop-shadow(0 0 7px #ffb34f88)}
.lqAtticWindow{position:absolute;z-index:2;width:76px;height:48px;border:5px solid #594331;background:linear-gradient(165deg,#365d78,#7894a3 45%,#202f43 46%);box-shadow:inset 0 0 0 2px #d6b87488,0 4px 8px #0005;pointer-events:none}.lqAtticWindow:before{content:'';position:absolute;left:50%;top:0;bottom:0;width:3px;background:#594331}.lqAtticWindow:after{content:'';position:absolute;left:0;right:0;top:50%;height:3px;background:#594331}
.lqAtticRug{position:absolute;z-index:2;width:190px;height:92px;border-radius:50%;border:5px solid #c3a96b;background:radial-gradient(ellipse,#294e77 0 38%,#183756 39% 58%,#b48f45 59% 64%,#24476b 65%);box-shadow:0 5px 7px #0005;pointer-events:none;opacity:.9}
`;
document.head.appendChild(style);

function frontNpc(){if(s.screen!=='world')return null;const p=front();return currentNpcs().find(n=>n.x===p.x&&n.y===p.y)||null;}
function enterAttic(){stopMoving();s.map='innAtticLounge';s.x=5;s.y=7;s.dir='up';s.dialog={name:'南門宿・屋根裏談話室',text:'細い階段を上ると、旅人が静かに休むための小さな談話室があった。\nルーク「宿屋、冒険に出ない理由を増やしてきますね……。」'};render();}
const actionBase=action;
action=function(){if(!s.dialog&&s.map==='innGuestRoom'&&frontNpc()?.kind==='lqAtticDoor')return enterAttic();return actionBase();};

const checkGateBase=checkGate;
checkGate=function(){
 if(s.map==='innAtticLounge'&&(MAPS.innAtticLounge.tiles[s.y]||'')[s.x]==='G'){
  stopMoving();s.map='innGuestRoom';s.x=8;s.y=5;s.dir='up';s.dialog={name:'南門宿・客室',text:'屋根裏の階段を下り、客室へ戻った。'};return;
 }
 return checkGateBase();
};

function decorateAttic(){
 if(s.screen!=='world'||s.map!=='innAtticLounge')return;
 const w=app.querySelector('.world');if(!w||w.querySelector('.lqAtticDecorAnchor'))return;
 const a=document.createElement('i');a.className='lqAtticDecorAnchor';a.hidden=true;w.appendChild(a);
 const add=(cls,x,y)=>{const n=document.createElement('i');n.className=cls;n.style.left=`${x*TS}px`;n.style.top=`${y*TS}px`;w.appendChild(n);};
 add('lqAtticRug',2.6,3.15);add('lqAtticBookcase',1.15,1.05);add('lqAtticWindow',4.35,1.0);add('lqAtticHearth',7.0,1.05);add('lqAtticTable',4.0,4.15);
}
const worldBase=world;world=function(){const r=worldBase();decorateAttic();return r;};
const renderBase=render;render=function(){const r=renderBase();decorateAttic();return r;};
window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{innAtticLounge:{entryMap:'innGuestRoom',exitMap:'innGuestRoom',type:'attic-lounge'}});
window.LQ_INN_ATTIC_STATUS={checkpoint:'REQ-010-A-B',walkable:true,entry:'innGuestRoom',exit:'innGuestRoom',inspectablePoints:4};
if(s.screen==='world')decorateAttic();
})();