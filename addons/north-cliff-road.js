(() => {
'use strict';

/* REQ-081 — continue the existing first-chapter pursuit one walkable region
   beyond evacRoute. Reuses withdrawProofSeen as the only progression authority;
   no protected reveal or new required story flag is introduced. */
const EVAC='evacRoute';
const CLIFF='northCliffRoad';
if(!MAPS[EVAC])return;

MAPS[CLIFF]={
  name:'北の崖道',w:22,h:18,
  tiles:[
    '##########^^##########',
    '#....^^..........^^..#',
    '#...^^^^........^^^^.#',
    '#....^^..........^^..#',
    '#....................#',
    '#..#####......#####..#',
    '#..#..............#..#',
    '#..#...^^^^^^.....#..#',
    '#......^^^^^^^^......#',
    '#......^^....^^......#',
    '#..##............##..#',
    '#..##....^^^^....##..#',
    '#........^^^^........#',
    '#....................#',
    '#...^^^^......^^^^...#',
    '#....^^........^^....#',
    '#....................#',
    '##########VV##########'
  ],
  npcs:[
    {x:7,y:14,e:'',name:'新しい足跡',kind:'lqNorthCliffFootprints',text:'乾ききっていない土に、北へ急ぐ一人分の足跡が続いている。退避路の北端で見たものと同じ向きだ。\nルーク「追いつくならこっちですね。……追いついた後の話は、追いついてから考えましょう。」'},
    {x:15,y:12,e:'',name:'折れた安全杭',kind:'lqNorthCliffStake',text:'崖側の安全杭が一本だけ折れている。縄は谷へ落ちず、岩に巻き付いたままだ。\nルーク「ここで走った人、かなり急いでますね。僕なら絶対ゆっくり行きます。」'},
    {x:5,y:5,e:'',name:'谷を望む岩棚',kind:'lqNorthCliffView',text:'雲の切れ間から、さっき通った退避路が細く見える。魔王軍の追撃らしい動きは見当たらない。'},
    {x:10,y:1,e:'',name:'北へ曲がる崖道',kind:'lqNorthCliffBoundary',text:'新しい足跡は岩壁の向こうへ曲がり、その先へ続いている。風が強く、ここから先の道は見通せない。\nルーク「まだ先かぁ……。レオンさん、逃げ足だけは本当に本命勇者級ですね。」'}
  ]
};

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===CLIFF){
    if(c==='#')return'wall lqNorthCliffWall';
    if(c==='^')return'wall lqNorthCliffRock';
    if(c==='V')return'gate lqNorthCliffExit';
    return'floor lqNorthCliffPath';
  }
  return baseTileClass(c);
};
const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===CLIFF)return'';return baseTileEmoji(c);};
const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqNorthCliffFootprints')return'npc lqNorthCliffFootprints';
  if(n?.kind==='lqNorthCliffStake')return'npc lqNorthCliffStake';
  if(n?.kind==='lqNorthCliffView')return'npc lqNorthCliffView';
  if(n?.kind==='lqNorthCliffBoundary')return'npc lqNorthCliffBoundary';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqNorthCliffPath{background:radial-gradient(circle at 30% 28%,#8f8774 0 5%,transparent 6%),linear-gradient(145deg,#77705e,#59564b 60%,#48483f);box-shadow:inset 0 1px #fff2}.tile.lqNorthCliffWall{background:linear-gradient(135deg,#67675f,#434640 58%,#292d2a);box-shadow:inset 0 -12px #171a18c7}.tile.lqNorthCliffRock{background:linear-gradient(150deg,#858277,#5c5e56 55%,#373b37);box-shadow:inset 0 -7px #232724aa,0 2px 0 #aaa6943d}.tile.lqNorthCliffExit{background:linear-gradient(#917752,#5b4b35);box-shadow:inset 0 0 0 3px #f1d49b44}
.lqNorthCliffFootprints{width:46px;height:40px;font-size:0}.lqNorthCliffFootprints:before,.lqNorthCliffFootprints:after{content:'';position:absolute;width:9px;height:17px;border-radius:55% 55% 45% 45%;background:#342d26;box-shadow:0 0 0 2px #a78d6640}.lqNorthCliffFootprints:before{left:10px;top:17px;transform:rotate(-20deg)}.lqNorthCliffFootprints:after{left:27px;top:3px;transform:rotate(17deg)}
.lqNorthCliffStake{width:44px;height:44px;font-size:0}.lqNorthCliffStake:before{content:'';position:absolute;left:19px;top:5px;width:6px;height:36px;background:linear-gradient(#c0a06b,#655036);transform:rotate(25deg);box-shadow:2px 3px 4px #0008}.lqNorthCliffStake:after{content:'';position:absolute;left:4px;top:24px;width:36px;height:4px;background:repeating-linear-gradient(90deg,#c7ad78 0 6px,#735d3e 6px 10px);transform:rotate(-13deg)}
.lqNorthCliffView{width:44px;height:42px;font-size:0;background:linear-gradient(#a8d5df55,#d7e8e75c 58%,transparent 59%);border-bottom:4px solid #625d4e;box-shadow:0 0 14px #bfefff2b}.lqNorthCliffView:after{content:'⌄';position:absolute;left:12px;top:4px;color:#eef9fb;font-size:23px;text-shadow:0 2px 4px #000}
.lqNorthCliffBoundary{width:48px;height:44px;font-size:0;background:linear-gradient(145deg,#6a6b63 0 35%,transparent 36%),linear-gradient(28deg,#4c514b 0 48%,transparent 49%);filter:drop-shadow(0 6px 5px #000a)}.lqNorthCliffBoundary:after{content:'↗';position:absolute;right:2px;top:-5px;color:#e5cf83;font-size:20px;text-shadow:0 2px 4px #000}
.lqNorthCliffMist{position:absolute;z-index:2;width:180px;height:54px;border-radius:50%;background:radial-gradient(ellipse,#e4eef09b 0 25%,#c7d6d857 46%,transparent 72%);filter:blur(2px);pointer-events:none;animation:lqNorthMist 8s infinite alternate ease-in-out}@keyframes lqNorthMist{from{transform:translateX(-18px);opacity:.4}to{transform:translateX(25px);opacity:.75}}
.lqNorthCliffWind{position:absolute;z-index:4;width:108px;height:18px;border-top:2px solid #e3f2f470;border-radius:50%;pointer-events:none;animation:lqNorthWind 2.5s infinite ease-in-out}@keyframes lqNorthWind{0%{opacity:0;transform:translateX(-30px)}45%{opacity:.85}100%{opacity:0;transform:translateX(42px)}}
`;
document.head.appendChild(style);

function cliffAhead(){
  if(s.screen!=='world'||s.map!==CLIFF)return null;
  const p=front();
  return MAPS[CLIFF].npcs.find(n=>n.x===p.x&&n.y===p.y)||null;
}
function enterCliff(){
  stopMoving();
  s.map=CLIFF;s.x=10;s.y=16;s.dir='up';
  s.dialog={name:'北の崖道',text:'退避路の北端を越えると、道は急に細くなった。岩壁に沿って新しい足跡が続いている。\nルーク「“北へ行け”は分かりやすいんですけど、崖までセットとは聞いてません。」'};
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'&&s.map===CLIFF){
    const n=cliffAhead();
    if(n){stopMoving();s.dialog=n;render();return;}
  }
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  const row=MAPS[s.map]?.tiles?.[s.y]||'';
  const c=row[s.x];
  if(s.map===EVAC&&c==='N'&&s.flags?.withdrawProofSeen){
    enterCliff();
    return;
  }
  if(s.map===CLIFF&&c==='V'){
    stopMoving();s.map=EVAC;s.x=14;s.y=1;s.dir='down';
    s.dialog={name:'北の退避路',text:'崖道から退避路へ戻った。北へ続く足跡は、まだ岩壁の向こうに残っている。'};
    return;
  }
  return baseCheckGate();
};

function decorate(){
  if(s.screen!=='world'||s.map!==CLIFF)return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqNorthCliffMist'))return;
  for(const [x,y] of [[1.2,2.0],[14.5,7.2]]){const m=document.createElement('div');m.className='lqNorthCliffMist';m.style.left=`${x*TS}px`;m.style.top=`${y*TS}px`;w.appendChild(m);}
  for(const [x,y,d] of [[4.0,4.0,'0s'],[11.0,9.5,'.8s'],[6.2,13.2,'1.5s']]){const wind=document.createElement('div');wind.className='lqNorthCliffWind';wind.style.left=`${x*TS}px`;wind.style.top=`${y*TS}px`;wind.style.animationDelay=d;w.appendChild(wind);}
}
const baseWorld=world;
world=function(){const r=baseWorld();decorate();return r;};
const baseRender=render;
render=function(){const r=baseRender();decorate();return r;};

window.LQ_NORTH_CLIFF_ROAD_STATUS={version:'1.0',map:CLIFF,entryAuthority:'withdrawProofSeen',entrySpawn:[10,16],returnSpawn:[14,1],interactionCount:4,newRequiredStoryFlags:0,protectedCanonChanged:false,iosPhysicalVerification:'PENDING'};
})();
