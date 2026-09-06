(() => {
'use strict';

/* REQ-026 — walkable Aldia castle courtyard.
   Extends the safe castle exploration path without claiming the castle interior. */
const GATEHOUSE='aldiaCastleGatehouse';
const COURTYARD='aldiaCastleCourtyard';
if(!MAPS[GATEHOUSE])return;

// Add a north passage to the already-published gatehouse without changing its town exit.
MAPS[GATEHOUSE].tiles[0]='#####GG#####';

MAPS[COURTYARD]={
  name:'王都アルディア・王城前庭',w:16,h:12,
  tiles:[
    '#######K########',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#######GG#######'
  ],
  npcs:[
    {x:3,y:4,e:'',name:'前庭の案内板',kind:'lqCourtyardProp',text:'「王城本館　北／門衛詰所　南」\nルーク「これなら迷子になっても、勇者の威厳は最小限の被害で済みますね。」'},
    {x:12,y:4,e:'',name:'王国の銀紋旗',kind:'lqCourtyardProp',text:'風を受けた青い旗に銀の紋章が光っている。王都の通りより、ここでは空気まで少し張りつめて感じる。'},
    {x:8,y:6,e:'',name:'古い前庭噴水',kind:'lqCourtyardProp',text:'長く磨かれた石の噴水。水面には王城の高い壁が揺れて映っている。'},
    {x:7,y:1,e:'',name:'王城本館の大扉',kind:'lqCastleMainDoor',text:'重い大扉の前には衛兵の交代札が掛かっている。今は王都の警戒対応で、本館への一般立ち入りは止められている。\nルーク「勇者でも“ちょっと待ってて”はあるんですね。安心しました。」'}
  ]
};

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===COURTYARD){
    if(c==='#')return'wall lqCourtyardWall';
    if(c==='G')return'gate lqCourtyardExit';
    if(c==='K')return'wall lqCourtyardKeep';
    return'floor lqCourtyardFloor';
  }
  return baseTileClass(c);
};
const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===COURTYARD)return'';return baseTileEmoji(c);};
const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqCourtyardProp')return'npc lqCourtyardProp';
  if(n?.kind==='lqCastleMainDoor')return'npc lqCastleMainDoor';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqCourtyardFloor{background:linear-gradient(135deg,#777c78 0 46%,#626a68 47% 52%,#89908b 53%);box-shadow:inset 0 1px #e7efe31c}.tile.lqCourtyardWall{background:linear-gradient(#69727a,#434b54 65%,#2a3038);box-shadow:inset 0 -9px #1d2229aa}.tile.lqCourtyardExit{background:linear-gradient(#b18a58,#755738);box-shadow:inset 0 0 0 3px #f2d08d5c}.tile.lqCourtyardKeep{background:linear-gradient(#394452,#202a36);box-shadow:inset 0 -12px #111823,0 0 18px #b7d5ff18}
.lqCourtyardProp{width:40px;height:40px;font-size:0;border:2px solid #c8b987;border-radius:7px;background:linear-gradient(145deg,#5f6d75,#34424e);box-shadow:0 5px 9px #0008}.lqCourtyardProp:after{content:'✦';position:absolute;right:2px;top:0;color:#ffe28c;font-size:11px;text-shadow:0 0 6px #ffd45c}
.lqCastleMainDoor{width:42px;height:48px;font-size:0;border:3px solid #d2bf82;border-radius:5px 5px 2px 2px;background:linear-gradient(90deg,#27384e,#476184 48%,#24344a 52%);box-shadow:inset 0 0 0 2px #111b2a,0 7px 12px #0009}.lqCastleMainDoor:before{content:'♔';position:absolute;left:8px;top:6px;font-size:24px;color:#efe2b2;text-shadow:0 2px 4px #000}.lqCastleMainDoor:after{content:'';position:absolute;right:6px;top:23px;width:5px;height:5px;border-radius:50%;background:#ffe48c;box-shadow:0 0 8px #ffd85d}
.lqCourtyardFountain{position:absolute;width:106px;height:72px;border:6px solid #a9b7bf;border-radius:50%;background:radial-gradient(ellipse,#8dd8e6 0 38%,#397d91 40% 55%,#66737b 57%);box-shadow:0 7px 15px #0008,inset 0 0 16px #d9fbff77;z-index:3;pointer-events:none}.lqCourtyardHedge{position:absolute;width:150px;height:42px;border-radius:18px;background:linear-gradient(#3f774b,#244e31);border:3px solid #5f8d61;box-shadow:0 6px 10px #0007;z-index:2;pointer-events:none}.lqCourtyardBanner{position:absolute;width:48px;height:76px;background:linear-gradient(90deg,#123c76,#2869ac,#123c76);clip-path:polygon(0 0,100% 0,100% 82%,50% 100%,0 82%);box-shadow:0 6px 10px #0008;z-index:3;pointer-events:none}.lqCourtyardBanner:after{content:'✦';position:absolute;left:12px;top:20px;font-size:25px;color:#eef3f6}
`;
document.head.appendChild(style);

function courtyardAhead(){
  if(s.screen!=='world'||s.map!==COURTYARD)return null;
  const p=front();
  return MAPS[COURTYARD].npcs.find(n=>n.x===p.x&&n.y===p.y)||null;
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'&&s.map===COURTYARD){
    const n=courtyardAhead();
    if(n){stopMoving();s.dialog=n;render();return;}
  }
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.map===GATEHOUSE&&s.y===0&&((MAPS[GATEHOUSE].tiles[s.y]||'')[s.x]==='G')){
    stopMoving();s.map=COURTYARD;s.x=7;s.y=9;s.dir='up';
    s.dialog={name:'王城前庭',text:'門衛詰所の奥を抜けると、石畳の先に王城本館が姿を現した。\nルーク「近くで見ると、“帰りたい”って言いづらい大きさですね……。」'};
    return;
  }
  if(s.map===COURTYARD&&s.y===11&&((MAPS[COURTYARD].tiles[s.y]||'')[s.x]==='G')){
    stopMoving();s.map=GATEHOUSE;s.x=5;s.y=1;s.dir='down';
    s.dialog={name:'王城門衛詰所',text:'前庭から門衛詰所へ戻った。'};
    return;
  }
  return baseCheckGate();
};

function decorate(){
  if(s.screen!=='world'||s.map!==COURTYARD)return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqCourtyardFountain'))return;
  const f=document.createElement('div');f.className='lqCourtyardFountain';f.style.left=`${6.9*TS}px`;f.style.top=`${5.25*TS}px`;w.appendChild(f);
  const h1=document.createElement('div');h1.className='lqCourtyardHedge';h1.style.left=`${1.35*TS}px`;h1.style.top=`${7.7*TS}px`;w.appendChild(h1);
  const h2=document.createElement('div');h2.className='lqCourtyardHedge';h2.style.left=`${11.25*TS}px`;h2.style.top=`${7.7*TS}px`;w.appendChild(h2);
  for(const x of [4.2,10.8]){const b=document.createElement('div');b.className='lqCourtyardBanner';b.style.left=`${x*TS}px`;b.style.top=`${1.1*TS}px`;w.appendChild(b);}
}
const baseWorld=world;
world=function(){const r=baseWorld();decorate();return r;};
const baseRender=render;
render=function(){const r=baseRender();decorate();return r;};

window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{aldiaCastleCourtyard:{entryMap:GATEHOUSE,map:COURTYARD,exitMap:GATEHOUSE,type:'castle-courtyard'}});
window.LQ_CASTLE_COURTYARD_STATUS={version:'1.0',map:COURTYARD,from:GATEHOUSE,propCount:3,mainDoorBoundary:true,protectedCanonChanged:false,fullCastleComplete:false,iosPhysicalVerification:'PENDING'};
})();
