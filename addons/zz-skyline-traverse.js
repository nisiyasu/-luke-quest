(() => {
'use strict';

/* REQ-107 — one canon-safe walkable interval beyond Wind Shelf.
   Loads after wind-shelf.js and reuses final canonical action/checkGate/encounter
   authority. No required story flag or save-schema change. */
const SHELF='windShelf';
const SKY='skylineTraverse';
const ENTRY_GRACE=5;
const RETURN_GRACE=4;
if(!MAPS[SHELF])return;

MAPS[SKY]={
  name:'北尾根・雲裂きの稜線',w:22,h:20,
  tiles:[
    '##########^^##########',
    '#....^^..........^^..#',
    '#...^^^^........^^^^.#',
    '#....^^..........^^..#',
    '#....................#',
    '#..####........####..#',
    '#..#............#....#',
    '#......^^^^^^........#',
    '#.....^^^^^^^^.......#',
    '#......^^..^^........#',
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
    {x:9,y:16,e:'',name:'風に削られた片足跡',kind:'lqSkylineFootprints',text:'薄い砂の上に、片足だけ深く踏み込んだ新しい靴跡が残っている。風で縁が崩れかけているが、爪先は北を向いている。\nルーク「ここまで来ても、ちゃんと前へ進んでる。」'},
    {x:15,y:12,e:'',name:'崩れた風除けの石積み',kind:'lqSkylineWindbreak',text:'稜線を横切る風を避けるための低い石積みが半分崩れている。北側だけ、最近誰かが踏み越えたように石が落ちている。'},
    {x:5,y:7,e:'',name:'雲間を望む張り出し',kind:'lqSkylineView',text:'雲が割れた一瞬、さらに北へ折れながら続く細い尾根が見える。人影は見えないが、道そのものは途切れていない。'},
    {x:10,y:1,e:'',name:'高みへ折れる踏み跡',kind:'lqSkylineBoundary',text:'風の弱い岩陰を選ぶように、一人分の踏み跡がさらに高い稜線へ折れている。\nルーク「まだ追える。ここで引き返す理由はないですね。」'}
  ]
};

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===SKY){
    if(c==='#')return'wall lqSkylineWall';
    if(c==='^')return'wall lqSkylineRock';
    if(c==='V')return'gate lqSkylineExit';
    return'floor lqSkylinePath';
  }
  return baseTileClass(c);
};
const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===SKY)return'';return baseTileEmoji(c);};
const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqSkylineFootprints')return'npc lqSkylineFootprints';
  if(n?.kind==='lqSkylineWindbreak')return'npc lqSkylineWindbreak';
  if(n?.kind==='lqSkylineView')return'npc lqSkylineView';
  if(n?.kind==='lqSkylineBoundary')return'npc lqSkylineBoundary';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqSkylinePath{background:radial-gradient(circle at 64% 34%,#efe1bb26 0 4%,transparent 5%),linear-gradient(151deg,#a8a28f,#747c75 58%,#4b5651);box-shadow:inset 0 1px #fff5}.tile.lqSkylineWall{background:linear-gradient(126deg,#95958d,#606a63 57%,#35413b);box-shadow:inset 0 -13px #222d28c9}.tile.lqSkylineRock{background:linear-gradient(148deg,#c6bca5,#838a7e 50%,#4d5952);box-shadow:inset 0 -8px #303c35bd,0 2px 0 #f0ddae3d}.tile.lqSkylineExit{background:linear-gradient(#aa946d,#665741);box-shadow:inset 0 0 0 3px #ffe3aa55}
.lqSkylineFootprints{width:46px;height:40px;font-size:0}.lqSkylineFootprints:before{content:'';position:absolute;left:18px;top:8px;width:10px;height:19px;border-radius:58% 58% 43% 43%;background:#42362b;transform:rotate(-9deg);box-shadow:0 0 0 2px #e5cc9b42,9px 13px 0 -1px #514134}
.lqSkylineWindbreak{width:48px;height:42px;font-size:0;background:linear-gradient(18deg,#5b625c 0 22%,transparent 23%),linear-gradient(162deg,#8c897d 0 28%,transparent 29%);filter:drop-shadow(0 5px 4px #0009)}.lqSkylineWindbreak:after{content:'';position:absolute;left:5px;right:4px;bottom:6px;height:12px;border-bottom:7px dotted #8d8879;transform:skewX(-13deg)}
.lqSkylineView{width:46px;height:42px;font-size:0;background:linear-gradient(#e8fbff66,#b9d9dc35 52%,transparent 53%);border-bottom:4px solid #77705f;box-shadow:0 0 17px #ddfbff32}.lqSkylineView:after{content:'≋';position:absolute;left:9px;top:0;color:#fff;font-size:27px;text-shadow:0 2px 4px #000}
.lqSkylineBoundary{width:48px;height:44px;font-size:0;background:linear-gradient(146deg,#949083 0 34%,transparent 35%),linear-gradient(27deg,#626c64 0 50%,transparent 51%);filter:drop-shadow(0 6px 5px #000a)}.lqSkylineBoundary:after{content:'↑';position:absolute;right:7px;top:-6px;color:#fff0ac;font-size:21px;text-shadow:0 2px 4px #000}
.lqSkylineGuide{position:absolute;z-index:44;left:50%;top:calc(env(safe-area-inset-top,0px) + 62px);transform:translateX(-50%);max-width:min(78%,360px);padding:5px 9px;border:1px solid #eef0b566;border-radius:999px;background:#071521d9;color:#f7efc8;font-size:8px;font-weight:900;letter-spacing:.03em;text-align:center;pointer-events:none;box-shadow:0 4px 12px #0008}.lqSkylineMarker{position:absolute;z-index:7;width:34px;height:34px;transform:translate(-50%,-55%);border:2px solid #f7eaa7ad;border-radius:50%;box-shadow:0 0 11px #fff0a978,inset 0 0 9px #fff0a936;pointer-events:none;animation:lqSkylinePulse 1.3s ease-in-out infinite alternate}.lqSkylineMarker:after{content:'!';position:absolute;left:50%;top:50%;transform:translate(-50%,-55%);color:#fff8cf;font-size:13px;font-weight:1000;text-shadow:0 2px 4px #000}@keyframes lqSkylinePulse{from{opacity:.48;scale:.9}to{opacity:1;scale:1.08}}@media(prefers-reduced-motion:reduce){.lqSkylineMarker{animation:none;opacity:.8}}
`;
document.head.appendChild(style);

let guidePhase='clue';
let lastMap=s.map;
function aheadNpc(mapId){
  if(s.screen!=='world'||s.map!==mapId)return null;
  const p=front();
  return MAPS[mapId]?.npcs?.find(n=>n.x===p.x&&n.y===p.y)||null;
}
function enterSkyline(boundary){
  stopMoving();encounterGrace=ENTRY_GRACE;
  s.map=SKY;s.x=10;s.y=18;s.dir='up';guidePhase='clue';
  s.dialog={kind:boundary?.kind||'lqWindShelfBoundary',name:'北尾根・雲裂きの稜線',text:'岩棚の先で道はさらに細くなり、雲が目線の高さを横切っていた。風の合間に、新しい足跡がひとつ残っている。\nルーク「空に近づいてる感じはしますけど、足跡はまだ地面です。」'};
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'){
    if(s.map===SHELF){
      const n=aheadNpc(SHELF);
      if(n?.kind==='lqWindShelfBoundary'){enterSkyline(n);return;}
    }
    if(s.map===SKY){
      const n=aheadNpc(SKY);
      if(n){
        stopMoving();
        if(n.kind==='lqSkylineFootprints')guidePhase='north';
        s.dialog=n;render();return;
      }
    }
  }
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.map===SKY){
    const row=MAPS[SKY]?.tiles?.[s.y]||'';
    if(row[s.x]==='V'){
      stopMoving();encounterGrace=RETURN_GRACE;
      s.map=SHELF;s.x=10;s.y=2;s.dir='down';guidePhase='clue';
      s.dialog={name:'北尾根・風蝕の岩棚',text:'雲裂きの稜線から風蝕の岩棚へ戻った。低い岩壁が、さっきまでより頼もしい風除けに見える。'};
      return;
    }
  }
  return baseCheckGate();
};

const baseEncounterMap=encounterMap;
encounterMap=function(){return s.map===SKY?true:baseEncounterMap();};
const baseEnemyPool=enemyPool;
enemyPool=function(){return s.map===SKY?EVAC_ENEMIES:baseEnemyPool();};

function decorate(){
  if(lastMap!==s.map){if(lastMap===SKY)guidePhase='clue';lastMap=s.map;}
  if(s.screen!=='world'||s.map!==SKY)return;
  const shell=app.querySelector('.gameShell');const w=app.querySelector('.world');if(!shell||!w)return;
  let guide=shell.querySelector('.lqSkylineGuide');
  if(!guide){guide=document.createElement('div');guide.className='lqSkylineGuide';shell.appendChild(guide);}
  guide.textContent=guidePhase==='clue'?'雲裂きの稜線：入口近くの新しい足跡を調べる':'雲裂きの稜線：北側へ続く踏み跡を確認する';
  w.querySelectorAll('.lqSkylineMarker').forEach(n=>n.remove());
  const target=guidePhase==='clue'?{x:9,y:16}:{x:10,y:1};
  const marker=document.createElement('div');marker.className='lqSkylineMarker';marker.style.left=`${target.x*TS+TS/2}px`;marker.style.top=`${target.y*TS+TS/2}px`;w.appendChild(marker);
}
const baseWorld=world;
world=function(){const r=baseWorld();decorate();return r;};
const baseRender=render;
render=function(){const r=baseRender();decorate();return r;};

window.LQ_SKYLINE_TRAVERSE_STATUS={
  version:'1.0',map:SKY,displayName:'北尾根・雲裂きの稜線',entryFrom:SHELF,entrySpawn:[10,18],returnSpawn:[10,2],
  interactionCount:4,firstClue:{kind:'lqSkylineFootprints',x:9,y:16},northBoundary:{kind:'lqSkylineBoundary',x:10,y:1},
  newRequiredStoryFlags:0,protectedCanonChanged:false,encounterEnabled:true,encounterPool:'EVAC_ENEMIES',entryEncounterGrace:ENTRY_GRACE,returnEncounterGrace:RETURN_GRACE,
  canonicalAction:true,canonicalCheckGate:true,saveSchemaChanged:false,pointerSafeGuidance:true,iosPhysicalVerification:'PENDING',
  guidePhase:()=>guidePhase
};
})();
