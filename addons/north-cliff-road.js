(() => {
'use strict';

/* REQ-081/082 + REQ-093 — continue the first-chapter pursuit beyond evacRoute,
   through northCliffRoad and one further walkable Windcut Pass checkpoint.
   Reuses withdrawProofSeen and EVAC_ENEMIES; no protected reveal, new required
   story flag, duplicate battle loop, or placeholder enemy is added. */
const EVAC='evacRoute';
const CLIFF='northCliffRoad';
const WIND='windcutPass';
const ENTRY_GRACE=5;
const RETURN_GRACE=4;
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
    {x:10,y:1,e:'',name:'北へ曲がる崖道',kind:'lqNorthCliffBoundary',text:'新しい足跡は岩壁の向こうへ曲がり、その先へ続いている。'}
  ]
};

MAPS[WIND]={
  name:'風切り峠',w:22,h:20,
  tiles:[
    '##########^^##########',
    '#...^^............^^.#',
    '#..^^^^..........^^^^#',
    '#...^^............^^.#',
    '#....................#',
    '#.####..........####.#',
    '#.#................#.#',
    '#.#....^^^^^^......#.#',
    '#.....^^^^^^^^.......#',
    '#.....^^....^^.......#',
    '#....................#',
    '#..^^............^^..#',
    '#..^^^^........^^^^..#',
    '#....................#',
    '#.#####........#####.#',
    '#....................#',
    '#....^^........^^....#',
    '#....................#',
    '#....................#',
    '##########VV##########'
  ],
  npcs:[
    {x:7,y:16,e:'',name:'岩陰に残る靴跡',kind:'lqWindcutFootprints',text:'風の当たらない岩陰だけ、靴底の跡がくっきり残っている。北へ向かう一人分だ。\nルーク「風まで証拠を消しに来てる。自然界まで追跡妨害ですか。」'},
    {x:15,y:13,e:'',name:'風で傾いた古い道標',kind:'lqWindcutSign',text:'古い道標は半分ほど谷側へ傾いている。読める文字は「北尾根」だけだ。\nルーク「“安全”とか“宿”とか、そういう優しい単語はないんですね。」'},
    {x:5,y:7,e:'',name:'谷を渡る遠い物音',kind:'lqWindcutEcho',text:'風の切れ間に、ずっと北から小石を踏むような音が一度だけ響いた。魔物の咆哮ではない。\nルーク「聞こえましたよね？　今の。……聞こえなかったことにして帰る案は？」'},
    {x:10,y:1,e:'',name:'北へ続く尾根道',kind:'lqWindcutBoundary',text:'擦れた靴跡は尾根の向こうへ続いている。ここから先は岩壁がせり出し、まだ姿までは見えない。\nルーク「近づいてる……はず。たぶん。追うしかないですよね。」'}
  ]
};

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===CLIFF||s.map===WIND){
    if(c==='#')return s.map===WIND?'wall lqWindcutWall':'wall lqNorthCliffWall';
    if(c==='^')return s.map===WIND?'wall lqWindcutRock':'wall lqNorthCliffRock';
    if(c==='V')return s.map===WIND?'gate lqWindcutExit':'gate lqNorthCliffExit';
    return s.map===WIND?'floor lqWindcutPath':'floor lqNorthCliffPath';
  }
  return baseTileClass(c);
};
const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===CLIFF||s.map===WIND)return'';return baseTileEmoji(c);};
const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqNorthCliffFootprints')return'npc lqNorthCliffFootprints';
  if(n?.kind==='lqNorthCliffStake')return'npc lqNorthCliffStake';
  if(n?.kind==='lqNorthCliffView')return'npc lqNorthCliffView';
  if(n?.kind==='lqNorthCliffBoundary')return'npc lqNorthCliffBoundary';
  if(n?.kind==='lqWindcutFootprints')return'npc lqWindcutFootprints';
  if(n?.kind==='lqWindcutSign')return'npc lqWindcutSign';
  if(n?.kind==='lqWindcutEcho')return'npc lqWindcutEcho';
  if(n?.kind==='lqWindcutBoundary')return'npc lqWindcutBoundary';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqNorthCliffPath{background:radial-gradient(circle at 30% 28%,#8f8774 0 5%,transparent 6%),linear-gradient(145deg,#77705e,#59564b 60%,#48483f);box-shadow:inset 0 1px #fff2}.tile.lqNorthCliffWall{background:linear-gradient(135deg,#67675f,#434640 58%,#292d2a);box-shadow:inset 0 -12px #171a18c7}.tile.lqNorthCliffRock{background:linear-gradient(150deg,#858277,#5c5e56 55%,#373b37);box-shadow:inset 0 -7px #232724aa,0 2px 0 #aaa6943d}.tile.lqNorthCliffExit{background:linear-gradient(#917752,#5b4b35);box-shadow:inset 0 0 0 3px #f1d49b44}
.tile.lqWindcutPath{background:radial-gradient(circle at 70% 35%,#c2b58c24 0 7%,transparent 8%),linear-gradient(155deg,#807967,#5f625b 57%,#454b49);box-shadow:inset 0 1px #fff3}.tile.lqWindcutWall{background:linear-gradient(120deg,#77776f,#4f5551 55%,#303634);box-shadow:inset 0 -13px #1b211fba}.tile.lqWindcutRock{background:linear-gradient(145deg,#9a9485,#686b63 52%,#3e4541);box-shadow:inset 0 -8px #282f2bbb,0 2px 0 #cec6a33b}.tile.lqWindcutExit{background:linear-gradient(#8d7959,#594d3c);box-shadow:inset 0 0 0 3px #f4daa946}
.lqNorthCliffFootprints,.lqWindcutFootprints{width:46px;height:40px;font-size:0}.lqNorthCliffFootprints:before,.lqNorthCliffFootprints:after,.lqWindcutFootprints:before,.lqWindcutFootprints:after{content:'';position:absolute;width:9px;height:17px;border-radius:55% 55% 45% 45%;background:#342d26;box-shadow:0 0 0 2px #a78d6640}.lqNorthCliffFootprints:before,.lqWindcutFootprints:before{left:10px;top:17px;transform:rotate(-20deg)}.lqNorthCliffFootprints:after,.lqWindcutFootprints:after{left:27px;top:3px;transform:rotate(17deg)}
.lqNorthCliffStake,.lqWindcutSign{width:44px;height:44px;font-size:0}.lqNorthCliffStake:before,.lqWindcutSign:before{content:'';position:absolute;left:19px;top:5px;width:6px;height:36px;background:linear-gradient(#c0a06b,#655036);transform:rotate(25deg);box-shadow:2px 3px 4px #0008}.lqNorthCliffStake:after,.lqWindcutSign:after{content:'';position:absolute;left:4px;top:24px;width:36px;height:4px;background:repeating-linear-gradient(90deg,#c7ad78 0 6px,#735d3e 6px 10px);transform:rotate(-13deg)}
.lqNorthCliffView,.lqWindcutEcho{width:44px;height:42px;font-size:0;background:linear-gradient(#a8d5df55,#d7e8e75c 58%,transparent 59%);border-bottom:4px solid #625d4e;box-shadow:0 0 14px #bfefff2b}.lqNorthCliffView:after{content:'⌄';position:absolute;left:12px;top:4px;color:#eef9fb;font-size:23px;text-shadow:0 2px 4px #000}.lqWindcutEcho:after{content:')))';position:absolute;left:5px;top:6px;color:#eef9fb;font-size:17px;letter-spacing:-2px;text-shadow:0 2px 4px #000;transform:rotate(-8deg)}
.lqNorthCliffBoundary,.lqWindcutBoundary{width:48px;height:44px;font-size:0;background:linear-gradient(145deg,#6a6b63 0 35%,transparent 36%),linear-gradient(28deg,#4c514b 0 48%,transparent 49%);filter:drop-shadow(0 6px 5px #000a)}.lqNorthCliffBoundary:after,.lqWindcutBoundary:after{content:'↗';position:absolute;right:2px;top:-5px;color:#e5cf83;font-size:20px;text-shadow:0 2px 4px #000}
.lqNorthCliffMist,.lqWindcutMist{position:absolute;z-index:2;width:180px;height:54px;border-radius:50%;background:radial-gradient(ellipse,#e4eef09b 0 25%,#c7d6d857 46%,transparent 72%);filter:blur(2px);pointer-events:none;animation:lqNorthMist 8s infinite alternate ease-in-out}@keyframes lqNorthMist{from{transform:translateX(-18px);opacity:.4}to{transform:translateX(25px);opacity:.75}}
.lqNorthCliffWind,.lqWindcutWind{position:absolute;z-index:4;width:108px;height:18px;border-top:2px solid #e3f2f470;border-radius:50%;pointer-events:none;animation:lqNorthWind 2.5s infinite ease-in-out}.lqWindcutWind{width:145px;border-top-color:#edfaff8c;animation-duration:1.85s}@keyframes lqNorthWind{0%{opacity:0;transform:translateX(-30px)}45%{opacity:.85}100%{opacity:0;transform:translateX(42px)}}
`;
document.head.appendChild(style);

function aheadNpc(mapId){
  if(s.screen!=='world'||s.map!==mapId)return null;
  const p=front();
  return MAPS[mapId].npcs.find(n=>n.x===p.x&&n.y===p.y)||null;
}
function enterCliff(){
  stopMoving();
  encounterGrace=ENTRY_GRACE;
  s.map=CLIFF;s.x=10;s.y=16;s.dir='up';
  s.dialog={name:'北の崖道',text:'退避路の北端を越えると、道は急に細くなった。岩壁に沿って新しい足跡が続いている。\nルーク「“北へ行け”は分かりやすいんですけど、崖までセットとは聞いてません。」'};
}
function enterWindcut(){
  stopMoving();
  encounterGrace=ENTRY_GRACE;
  s.map=WIND;s.x=10;s.y=18;s.dir='up';
  s.dialog={name:'風切り峠',text:'岩壁の曲がり角を抜けると、風が一段強くなった。削られた尾根道に靴跡が点々と残っている。\nルーク「崖の次が峠。逃げる人のコース選びじゃないですよ、これ。」'};
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'&&(s.map===CLIFF||s.map===WIND)){
    const n=aheadNpc(s.map);
    if(n){
      stopMoving();
      if(s.map===CLIFF&&n.kind==='lqNorthCliffBoundary'){enterWindcut();return;}
      s.dialog=n;render();return;
    }
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
    stopMoving();
    encounterGrace=RETURN_GRACE;
    s.map=EVAC;s.x=14;s.y=1;s.dir='down';
    s.dialog={name:'北の退避路',text:'崖道から退避路へ戻った。北へ続く足跡は、まだ岩壁の向こうに残っている。'};
    return;
  }
  if(s.map===WIND&&c==='V'){
    stopMoving();
    encounterGrace=RETURN_GRACE;
    s.map=CLIFF;s.x=10;s.y=2;s.dir='down';
    s.dialog={name:'北の崖道',text:'強風の峠から、少し風の弱い崖道へ戻った。尾根の先へ続く足跡はまだ消えていない。'};
    return;
  }
  return baseCheckGate();
};

const baseEncounterMap=encounterMap;
encounterMap=function(){return s.map===CLIFF||s.map===WIND?true:baseEncounterMap();};
const baseEnemyPool=enemyPool;
enemyPool=function(){return s.map===CLIFF||s.map===WIND?EVAC_ENEMIES:baseEnemyPool();};

function decorate(){
  if(s.screen!=='world'||(s.map!==CLIFF&&s.map!==WIND))return;
  const w=app.querySelector('.world');
  if(!w)return;
  const mistClass=s.map===WIND?'lqWindcutMist':'lqNorthCliffMist';
  const windClass=s.map===WIND?'lqWindcutWind':'lqNorthCliffWind';
  if(w.querySelector('.'+mistClass))return;
  const mistPoints=s.map===WIND?[[1.0,3.0],[14.8,10.2]]:[[1.2,2.0],[14.5,7.2]];
  for(const [x,y] of mistPoints){const m=document.createElement('div');m.className=mistClass;m.style.left=`${x*TS}px`;m.style.top=`${y*TS}px`;w.appendChild(m);}
  const windPoints=s.map===WIND?[[2.0,4.0,'0s'],[10.5,8.2,'.45s'],[5.0,12.8,'.9s'],[12.8,16.0,'1.2s']]:[[4.0,4.0,'0s'],[11.0,9.5,'.8s'],[6.2,13.2,'1.5s']];
  for(const [x,y,d] of windPoints){const wind=document.createElement('div');wind.className=windClass;wind.style.left=`${x*TS}px`;wind.style.top=`${y*TS}px`;wind.style.animationDelay=d;w.appendChild(wind);}
}
const baseWorld=world;
world=function(){const r=baseWorld();decorate();return r;};
const baseRender=render;
render=function(){const r=baseRender();decorate();return r;};

window.LQ_NORTH_CLIFF_ROAD_STATUS={version:'1.2',map:CLIFF,continuationMap:WIND,entryAuthority:'withdrawProofSeen',entrySpawn:[10,16],returnSpawn:[14,1],interactionCount:4,newRequiredStoryFlags:0,protectedCanonChanged:false,encounterEnabled:true,encounterPool:'EVAC_ENEMIES',entryEncounterGrace:ENTRY_GRACE,returnEncounterGrace:RETURN_GRACE,newEnemyIdentities:0,iosPhysicalVerification:'PENDING'};
window.LQ_WINDCUT_PASS_STATUS={version:'1.0',map:WIND,entryFrom:CLIFF,entrySpawn:[10,18],returnSpawn:[10,2],interactionCount:4,newRequiredStoryFlags:0,protectedCanonChanged:false,encounterEnabled:true,encounterPool:'EVAC_ENEMIES',entryEncounterGrace:ENTRY_GRACE,returnEncounterGrace:RETURN_GRACE,iosPhysicalVerification:'PENDING'};
})();
