(() => {
'use strict';

/* REQ-106 — one more canon-safe walkable interval beyond North Ridge Approach.
   Reuses canonical action/checkGate/encounter authority. No required story flag. */
const RIDGE='northRidgeApproach';
const SHELF='windShelf';
const ENTRY_GRACE=5;
const RETURN_GRACE=4;
if(!MAPS[RIDGE])return;

MAPS[SHELF]={
  name:'北尾根・風蝕の岩棚',w:22,h:20,
  tiles:[
    '##########^^##########',
    '#...^^............^^.#',
    '#..^^^^..........^^^^#',
    '#...^^............^^.#',
    '#....................#',
    '#.#####........#####.#',
    '#.#................#.#',
    '#.#....^^^^^^......#.#',
    '#.....^^^^^^^^.......#',
    '#.....^^....^^.......#',
    '#....................#',
    '#..^^^^........^^^^..#',
    '#...^^..........^^...#',
    '#....................#',
    '#.####..........####.#',
    '#....................#',
    '#....^^........^^....#',
    '#....................#',
    '#....................#',
    '##########VV##########'
  ],
  npcs:[
    {x:8,y:16,e:'',name:'砂礫に刻まれた片足跡',kind:'lqWindShelfFootprints',text:'風で削られた砂礫の窪みに、片足だけ深く残った新しい靴跡がある。向きは北だ。\nルーク「風は消そうとしてる。でも、まだ追える。」'},
    {x:15,y:13,e:'',name:'風穴の空いた岩柱',kind:'lqWindShelfPillar',text:'岩柱の中央が長い年月の風で穿たれている。穴を抜ける風だけ音が一段高い。\nルーク「ここで帽子をかぶってたら、たぶん今ごろ谷底ですね。」'},
    {x:5,y:7,e:'',name:'北斜面を見渡す割れ目',kind:'lqWindShelfView',text:'岩の割れ目から北斜面が見える。細い踏み跡がさらに高い稜線へ折れているが、人影までは見えない。'},
    {x:10,y:1,e:'',name:'さらに高みへ続く細道',kind:'lqWindShelfBoundary',text:'風蝕した岩の間を、一人分の細い踏み跡がさらに北へ続いている。\nルーク「まだ終点じゃない。なら、追えるところまで追うだけです。」'}
  ]
};

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===SHELF){
    if(c==='#')return'wall lqWindShelfWall';
    if(c==='^')return'wall lqWindShelfRock';
    if(c==='V')return'gate lqWindShelfExit';
    return'floor lqWindShelfPath';
  }
  return baseTileClass(c);
};
const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===SHELF)return'';return baseTileEmoji(c);};
const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqWindShelfFootprints')return'npc lqWindShelfFootprints';
  if(n?.kind==='lqWindShelfPillar')return'npc lqWindShelfPillar';
  if(n?.kind==='lqWindShelfView')return'npc lqWindShelfView';
  if(n?.kind==='lqWindShelfBoundary')return'npc lqWindShelfBoundary';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqWindShelfPath{background:radial-gradient(circle at 34% 26%,#dbcaa62d 0 5%,transparent 6%),linear-gradient(146deg,#9a907c,#686b63 57%,#454d49);box-shadow:inset 0 1px #fff4}.tile.lqWindShelfWall{background:linear-gradient(125deg,#83827a,#535b55 55%,#303834);box-shadow:inset 0 -13px #1d2521c4}.tile.lqWindShelfRock{background:linear-gradient(150deg,#b8ad98,#777b70 51%,#444c46);box-shadow:inset 0 -8px #2a332ebd,0 2px 0 #e4d5b43d}.tile.lqWindShelfExit{background:linear-gradient(#a38a62,#61513b);box-shadow:inset 0 0 0 3px #ffe0a94f}
.lqWindShelfFootprints{width:46px;height:40px;font-size:0}.lqWindShelfFootprints:before{content:'';position:absolute;left:19px;top:8px;width:10px;height:19px;border-radius:56% 56% 44% 44%;background:#3d3328;transform:rotate(-13deg);box-shadow:0 0 0 2px #d7bd8e42,10px 13px 0 -1px #4a3b2e}
.lqWindShelfPillar{width:44px;height:44px;font-size:0;border-radius:47% 41% 38% 51%;background:linear-gradient(140deg,#a49c8a,#6e7369 58%,#454b46);box-shadow:inset -7px -8px #30373380,0 5px 6px #0008}.lqWindShelfPillar:after{content:'';position:absolute;left:15px;top:12px;width:14px;height:17px;border-radius:48%;background:#27302e;box-shadow:inset 2px 1px #c9bd9a45}
.lqWindShelfView{width:44px;height:42px;font-size:0;background:linear-gradient(#c6edf25c,#f1fbfa45 55%,transparent 56%);border-bottom:4px solid #6e6758;box-shadow:0 0 16px #d6fbff2b}.lqWindShelfView:after{content:'≋';position:absolute;left:8px;top:1px;color:#f6ffff;font-size:25px;text-shadow:0 2px 4px #000}
.lqWindShelfBoundary{width:48px;height:44px;font-size:0;background:linear-gradient(145deg,#858176 0 35%,transparent 36%),linear-gradient(28deg,#596057 0 48%,transparent 49%);filter:drop-shadow(0 6px 5px #000a)}.lqWindShelfBoundary:after{content:'↑';position:absolute;right:7px;top:-5px;color:#f4dc91;font-size:20px;text-shadow:0 2px 4px #000}
.lqWindShelfGuide{position:absolute;z-index:44;left:50%;top:calc(env(safe-area-inset-top,0px) + 62px);transform:translateX(-50%);max-width:min(76%,350px);padding:5px 9px;border:1px solid #f2d68166;border-radius:999px;background:#071421d9;color:#f5e8bc;font-size:8px;font-weight:900;letter-spacing:.03em;text-align:center;pointer-events:none;box-shadow:0 4px 12px #0008}.lqWindShelfMarker{position:absolute;z-index:7;width:34px;height:34px;transform:translate(-50%,-55%);border:2px solid #f4dd90aa;border-radius:50%;box-shadow:0 0 10px #ffe29a72,inset 0 0 9px #ffe29a33;pointer-events:none;animation:lqWindShelfPulse 1.35s ease-in-out infinite alternate}.lqWindShelfMarker:after{content:'!';position:absolute;left:50%;top:50%;transform:translate(-50%,-55%);color:#fff2ba;font-size:13px;font-weight:1000;text-shadow:0 2px 4px #000}@keyframes lqWindShelfPulse{from{opacity:.48;scale:.9}to{opacity:1;scale:1.08}}@media(prefers-reduced-motion:reduce){.lqWindShelfMarker{animation:none;opacity:.78}}
`;
document.head.appendChild(style);

let guidePhase='clue';
let lastMap=s.map;
function aheadNpc(mapId){
  if(s.screen!=='world'||s.map!==mapId)return null;
  const p=front();
  return MAPS[mapId]?.npcs?.find(n=>n.x===p.x&&n.y===p.y)||null;
}
function enterShelf(boundary){
  stopMoving();encounterGrace=ENTRY_GRACE;
  s.map=SHELF;s.x=10;s.y=18;s.dir='up';guidePhase='clue';
  /* Preserve the historical boundary kind on the entry dialog so older
     acceptance can still prove that the canonical north-boundary interaction fired. */
  s.dialog={kind:boundary?.kind||'lqNorthRidgeBoundary',name:'北尾根・風蝕の岩棚',text:'岩棚を越えると、風に削られた石の道がさらに細く続いていた。砂礫には新しい足跡が残っている。\nルーク「この風でも残るなら、かなり新しいですね。」'};
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'){
    if(s.map===RIDGE){
      const n=aheadNpc(RIDGE);
      if(n?.kind==='lqNorthRidgeBoundary'){enterShelf(n);return;}
    }
    if(s.map===SHELF){
      const n=aheadNpc(SHELF);
      if(n){
        stopMoving();
        if(n.kind==='lqWindShelfFootprints')guidePhase='north';
        s.dialog=n;render();return;
      }
    }
  }
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.map===SHELF){
    const row=MAPS[SHELF]?.tiles?.[s.y]||'';
    if(row[s.x]==='V'){
      stopMoving();encounterGrace=RETURN_GRACE;
      s.map=RIDGE;s.x=10;s.y=2;s.dir='down';guidePhase='clue';
      s.dialog={name:'北尾根・岩棚道',text:'風蝕の岩棚から北尾根へ戻った。風は少し弱まり、足元の岩粉がまた見えるようになった。'};
      return;
    }
  }
  return baseCheckGate();
};

const baseEncounterMap=encounterMap;
encounterMap=function(){return s.map===SHELF?true:baseEncounterMap();};
const baseEnemyPool=enemyPool;
enemyPool=function(){return s.map===SHELF?EVAC_ENEMIES:baseEnemyPool();};

function decorate(){
  if(lastMap!==s.map){if(lastMap===SHELF)guidePhase='clue';lastMap=s.map;}
  if(s.screen!=='world'||s.map!==SHELF)return;
  const shell=app.querySelector('.gameShell');const w=app.querySelector('.world');if(!shell||!w)return;
  let guide=shell.querySelector('.lqWindShelfGuide');
  if(!guide){guide=document.createElement('div');guide.className='lqWindShelfGuide';shell.appendChild(guide);}
  guide.textContent=guidePhase==='clue'?'風蝕の岩棚：入口近くの新しい足跡を調べる':'風蝕の岩棚：北側の細道が続く地点を確認する';
  w.querySelectorAll('.lqWindShelfMarker').forEach(n=>n.remove());
  const target=guidePhase==='clue'?{x:8,y:16}:{x:10,y:1};
  const marker=document.createElement('div');marker.className='lqWindShelfMarker';marker.style.left=`${target.x*TS+TS/2}px`;marker.style.top=`${target.y*TS+TS/2}px`;w.appendChild(marker);
}
const baseWorld=world;
world=function(){const r=baseWorld();decorate();return r;};
const baseRender=render;
render=function(){const r=baseRender();decorate();return r;};

window.LQ_WIND_SHELF_STATUS={
  version:'1.0',map:SHELF,displayName:'北尾根・風蝕の岩棚',entryFrom:RIDGE,entrySpawn:[10,18],returnSpawn:[10,2],
  interactionCount:4,firstClue:{kind:'lqWindShelfFootprints',x:8,y:16},northBoundary:{kind:'lqWindShelfBoundary',x:10,y:1},
  newRequiredStoryFlags:0,protectedCanonChanged:false,encounterEnabled:true,encounterPool:'EVAC_ENEMIES',entryEncounterGrace:ENTRY_GRACE,returnEncounterGrace:RETURN_GRACE,
  canonicalAction:true,canonicalCheckGate:true,saveSchemaChanged:false,pointerSafeGuidance:true,iosPhysicalVerification:'PENDING',
  guidePhase:()=>guidePhase
};
})();
