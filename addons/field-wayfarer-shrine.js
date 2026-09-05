(() => {
'use strict';

/* Collision-safe world expansion: a small walkable roadside shrine on the Royal Capital approach. */
MAPS.wayfarerShrine={
 name:'街道の旅人祠',w:9,h:8,
 tiles:['#########','#.......#','#.......#','#.......#','#.......#','#.......#','#.......#','####G####'],
 npcs:[
  {x:4,y:1,e:'',name:'旅人守りの石像',kind:'lqShrineStatue',text:'街道を行く旅人の無事を願う、小さな石像だ。長い年月で鼻先だけ丸く削れている。\nルーク「撫でる場所、そこなんですね……。」'},
  {x:2,y:3,e:'',name:'旅人の書き置き',kind:'lqShrineNote',text:'「森へ向かうなら、水と薬草を忘れるな。日暮れ前には街道へ戻れ」\nルーク「ものすごく普通の忠告が、ものすごくありがたいです。」'},
  {x:6,y:3,e:'',name:'古い献花台',kind:'lqShrineFlowers',text:'乾いた花と新しい野花が一緒に供えられている。今も街道の人たちが立ち寄っているらしい。'},
  {x:4,y:5,e:'',name:'旅人の水鉢',kind:'lqShrineBasin',text:'澄んだ水をたたえた小さな石鉢。手を入れると驚くほど冷たい。'}
 ]
};

if(MAPS.field&&!MAPS.field.npcs.some(n=>n.kind==='lqWayfarerShrineDoor')){
 MAPS.field.npcs.push({x:4,y:5,e:'',name:'街道の小さな祠',kind:'lqWayfarerShrineDoor',text:'街道脇の石造りの小さな祠。中には灯りが見える。'});
}

const tileClassBase=tileClass;
tileClass=function(c){
 if(s.map==='wayfarerShrine'){
  if(c==='#')return'wall lqShrineWall';
  if(c==='G')return'gate lqShrineDoorTile';
  return'lqShrineFloor';
 }
 return tileClassBase(c);
};
const tileEmojiBase=tileEmoji;
tileEmoji=function(c){if(s.map==='wayfarerShrine')return'';return tileEmojiBase(c);};
const npcClassBase=npcClass;
npcClass=function(n){
 if(n?.kind==='lqWayfarerShrineDoor')return'npc lqWayfarerShrineDoor';
 if(n?.kind==='lqShrineStatue')return'npc lqShrineStatue';
 if(n?.kind==='lqShrineNote')return'npc lqShrineNote';
 if(n?.kind==='lqShrineFlowers')return'npc lqShrineFlowers';
 if(n?.kind==='lqShrineBasin')return'npc lqShrineBasin';
 return npcClassBase(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqShrineFloor{background:linear-gradient(135deg,#b8aa88 0 48%,#9b8d70 49% 52%,#c5b693 53%);box-shadow:inset 0 1px #eee0bd44}.tile.lqShrineWall{background:linear-gradient(#7d786e,#54524d);box-shadow:inset 0 -9px #2b292777,inset 0 2px #aaa39744}.tile.lqShrineDoorTile{background:linear-gradient(#8d633d,#573a28);box-shadow:inset 0 0 0 3px #c89c6055}
.lqWayfarerShrineDoor{width:44px;height:46px;font-size:0;border:3px solid #8e8a80;border-radius:4px 4px 2px 2px;background:linear-gradient(90deg,#504f4b 0 12%,#746046 13% 87%,#504f4b 88%);box-shadow:0 5px 8px #0007,inset 0 0 0 2px #d5bd8655}.lqWayfarerShrineDoor:before{content:'';position:absolute;left:7px;right:7px;top:-9px;height:12px;background:linear-gradient(135deg,transparent 0 47%,#716b60 48% 52%,transparent 53%),linear-gradient(#928b7d,#5e5a53);clip-path:polygon(50% 0,100% 100%,0 100%)}.lqWayfarerShrineDoor:after{content:'祠';position:absolute;left:50%;top:15px;transform:translateX(-50%);font-size:11px;font-weight:900;color:#e9d8a3}
.lqShrineStatue,.lqShrineNote,.lqShrineFlowers,.lqShrineBasin{width:40px;height:40px;font-size:0;filter:drop-shadow(0 4px 4px #0006)}.lqShrineStatue{border-radius:45% 45% 35% 35%;background:linear-gradient(135deg,#b7b4a7,#77766f 70%);border:2px solid #d0cab5}.lqShrineStatue:after{content:'';position:absolute;left:11px;top:8px;width:14px;height:14px;border:2px solid #65645f;border-radius:50%;box-shadow:0 15px 0 -3px #85837a}.lqShrineNote{background:linear-gradient(100deg,#d6c58f,#a99565);border:2px solid #655442;border-radius:3px;transform:rotate(-2deg)}.lqShrineNote:after{content:'三';position:absolute;left:13px;top:7px;color:#5d4b36;font-size:18px;font-weight:800}.lqShrineFlowers{border-radius:50% 50% 30% 30%;background:radial-gradient(circle at 28% 25%,#d89db2 0 5px,transparent 6px),radial-gradient(circle at 65% 20%,#f0d17a 0 5px,transparent 6px),linear-gradient(#6f7b4d 0 45%,#6d6558 46%)}.lqShrineBasin{border:5px solid #7d7b71;border-radius:50%;background:radial-gradient(circle,#bde6e5 0 32%,#5d9da2 34% 58%,#8e8b80 60%);box-shadow:0 4px 7px #0006,inset 0 0 8px #efffff66}
.lqShrineWindow{position:absolute;z-index:2;width:58px;height:74px;border:5px solid #666158;border-radius:28px 28px 4px 4px;background:linear-gradient(145deg,#426d81 0 28%,#d6b95f 29% 51%,#7f4564 52% 74%,#4d7381 75%);box-shadow:0 0 18px #d6c06b55,inset 0 0 0 2px #e9d69155;pointer-events:none}.lqShrineRug{position:absolute;z-index:1;width:3px;height:190px;background:linear-gradient(#7c4e48,#4e3032);box-shadow:14px 0 #c0a46a,-14px 0 #c0a46a;opacity:.78;pointer-events:none}
`;
document.head.appendChild(style);

function frontNpc(){if(s.screen!=='world')return null;const p=front();return currentNpcs().find(n=>n.x===p.x&&n.y===p.y)||null;}
function enterShrine(){stopMoving();s.map='wayfarerShrine';s.x=4;s.y=6;s.dir='up';s.dialog={name:'街道の旅人祠',text:'重い木戸を押すと、小さな祠の中に柔らかな灯りが満ちていた。\nルーク「静か……。こういう場所、勇者にも休憩申請できますか？」'};render();}
const actionBase=action;
action=function(){if(!s.dialog&&s.map==='field'&&frontNpc()?.kind==='lqWayfarerShrineDoor')return enterShrine();return actionBase();};
const checkGateBase=checkGate;
checkGate=function(){
 if(s.map==='wayfarerShrine'&&(MAPS.wayfarerShrine.tiles[s.y]||'')[s.x]==='G'){
  stopMoving();s.map='field';s.x=4;s.y=4;s.dir='down';s.dialog={name:'王都近郊',text:'小さな祠を出ると、街道の風が頬をなでた。'};return;
 }
 return checkGateBase();
};

function decorateShrine(){
 if(s.screen!=='world'||s.map!=='wayfarerShrine')return;const w=app.querySelector('.world');if(!w)return;
 if(!w.querySelector('.lqShrineWindow')){const a=document.createElement('div');a.className='lqShrineWindow';a.style.left=`${4*TS+TS/2-29}px`;a.style.top=`${.55*TS}px`;w.appendChild(a);}
 if(!w.querySelector('.lqShrineRug')){const r=document.createElement('div');r.className='lqShrineRug';r.style.left=`${4*TS+TS/2}px`;r.style.top=`${2*TS}px`;w.appendChild(r);}
}
const worldBase=world;world=function(){const r=worldBase();decorateShrine();return r;};
const renderBase=render;render=function(){const r=renderBase();decorateShrine();return r;};
window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{wayfarerShrine:{entryMap:'field',exitMap:'field',type:'roadside-shrine'}});
if(s.screen==='world')decorateShrine();
})();