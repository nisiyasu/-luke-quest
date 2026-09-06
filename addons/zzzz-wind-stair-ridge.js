(() => {
'use strict';

/* REQ-113 — canon-safe playable continuation north from Cloudbreak Saddle. */
const FROM='cloudbreakSaddle';
const RIDGE='windStairRidge';
const ENTRY_GRACE=5;
const RETURN_GRACE=4;
if(!MAPS[FROM])return;

MAPS[RIDGE]={
 name:'北尾根・風鳴りの石段',w:22,h:20,
 tiles:[
  '##########^^##########','#....^^..........^^..#','#...^^^^........^^^^.#','#....................#','#....####....####....#','#....................#','#..^^............^^..#','#.^^^^..........^^^^.#','#..^^............^^..#','#....................#','#....####....####....#','#....................#','#..^^^^........^^^^..#','#...^^..........^^...#','#....................#','#....^^........^^....#','#....................#','#....................#','#....................#','##########VV##########'
 ],
 npcs:[
  {x:11,y:16,e:'',name:'石段に残る新しい靴跡',kind:'lqWindStairBoot',text:'風に砂を払われた石段のくぼみに、新しい靴底の泥だけが残っている。跡は北へ続いている。\nルーク「少なくとも、ここを通ったのは間違いなさそうです。」'},
  {x:6,y:12,e:'',name:'風鳴りの古い石柱',kind:'lqWindStairPillar',text:'崩れかけた石柱の穴を風が抜け、低い笛のような音を鳴らしている。古い山道の目印だったらしい。'},
  {x:16,y:7,e:'',name:'雲海を望む張り出し',kind:'lqWindStairView',text:'雲海の切れ目から、北側の尾根がさらに続いているのが見える。途中には人が通ったような細い色の違いがある。'},
  {x:10,y:1,e:'',name:'北へ続く削れた踏み段',kind:'lqWindStairBoundary',text:'岩肌に刻まれた踏み段が、さらに北の稜線へ上がっている。縁の苔だけが新しく削れている。\nルーク「まだ先ですね。……レオン、足速すぎません？」'}
 ]
};

const tileClassBase=tileClass;
tileClass=function(c){if(s.map===RIDGE){if(c==='#')return'wall lqWindStairWall';if(c==='^')return'wall lqWindStairRock';if(c==='V')return'gate lqWindStairExit';return'floor lqWindStairPath';}return tileClassBase(c);};
const tileEmojiBase=tileEmoji;
tileEmoji=function(c){if(s.map===RIDGE)return'';return tileEmojiBase(c);};
const npcClassBase=npcClass;
npcClass=function(n){if(n?.kind==='lqWindStairBoot')return'npc lqWindStairBoot';if(n?.kind==='lqWindStairPillar')return'npc lqWindStairPillar';if(n?.kind==='lqWindStairView')return'npc lqWindStairView';if(n?.kind==='lqWindStairBoundary')return'npc lqWindStairBoundary';return npcClassBase(n);};

const style=document.createElement('style');
style.textContent=`
.tile.lqWindStairPath{background:linear-gradient(145deg,#918979,#6e726b 54%,#4a5550);box-shadow:inset 0 1px #fff3}.tile.lqWindStairWall{background:linear-gradient(125deg,#767870,#505a55 56%,#303b36);box-shadow:inset 0 -13px #202a26cc}.tile.lqWindStairRock{background:linear-gradient(149deg,#aaa28f,#73786e 50%,#46514b);box-shadow:inset 0 -8px #29332ebd,0 2px 0 #eee0b635}.tile.lqWindStairExit{background:linear-gradient(#9a8969,#5e5545);box-shadow:inset 0 0 0 3px #f5dfa15c}
.lqWindStairBoot{width:46px;height:40px;font-size:0}.lqWindStairBoot:before{content:'';position:absolute;left:12px;top:14px;width:22px;height:12px;border-radius:55% 45% 50% 50%;background:#44372f;transform:rotate(-8deg);box-shadow:8px 7px 0 #4e4035,-1px -1px 0 #d3b98b44}.lqWindStairPillar{width:34px;height:48px;font-size:0;background:linear-gradient(90deg,#555e58,#899087 45%,#4a514d);clip-path:polygon(15% 0,85% 4%,100% 100%,0 100%);box-shadow:0 5px 8px #0008}.lqWindStairPillar:after{content:'';position:absolute;left:11px;top:13px;width:11px;height:15px;border-radius:50%;background:#28332f}.lqWindStairView{width:46px;height:42px;font-size:0;background:linear-gradient(#e8fbff5e,#a7c7c93b 52%,transparent 53%);border-bottom:4px solid #666d67}.lqWindStairView:after{content:'≋';position:absolute;left:10px;top:-2px;color:#fff;font-size:27px}.lqWindStairBoundary{width:48px;height:44px;font-size:0;background:repeating-linear-gradient(to top,#7f7664 0 6px,#595f59 7px 12px,transparent 13px 16px)}.lqWindStairBoundary:after{content:'↑';position:absolute;right:4px;top:-8px;color:#fff0a3;font-size:22px}.lqWindStairGuide{position:absolute;z-index:44;left:50%;top:calc(env(safe-area-inset-top,0px) + 62px);transform:translateX(-50%);max-width:min(78%,360px);padding:5px 9px;border:1px solid #eff0b55c;border-radius:999px;background:#071521dc;color:#f7efc8;font-size:8px;font-weight:900;text-align:center;pointer-events:none}.lqWindStairMarker{position:absolute;z-index:7;width:34px;height:34px;transform:translate(-50%,-55%);border:2px solid #f6e89ea8;border-radius:50%;box-shadow:0 0 11px #ffed9d70;pointer-events:none}.lqWindStairMarker:after{content:'!';position:absolute;left:50%;top:50%;transform:translate(-50%,-55%);color:#fff7c8;font-size:13px;font-weight:1000}
`;
document.head.appendChild(style);

let guidePhase='clue';let lastMap=s.map;
function aheadNpc(mapId){if(s.screen!=='world'||s.map!==mapId)return null;const p=front();return MAPS[mapId]?.npcs?.find(n=>n.x===p.x&&n.y===p.y)||null;}
function enterRidge(boundary){stopMoving();encounterGrace=ENTRY_GRACE;s.map=RIDGE;s.x=10;s.y=18;s.dir='up';guidePhase='clue';s.dialog={kind:boundary?.kind||'lqCloudbreakBoundary',name:'北尾根・風鳴りの石段',text:'雲上の鞍部から踏み段を登ると、風が石柱の穴を鳴らす古い山道へ出た。砂の薄い場所に、新しい靴跡が残っている。\nルーク「道があるだけ、さっきよりだいぶ親切ですね。」'};render();}
const actionBase=action;
action=function(){if(!s.dialog&&s.screen==='world'){if(s.map===FROM){const n=aheadNpc(FROM);if(n?.kind==='lqCloudbreakBoundary'){enterRidge(n);return;}}if(s.map===RIDGE){const n=aheadNpc(RIDGE);if(n){stopMoving();if(n.kind==='lqWindStairBoot')guidePhase='north';s.dialog=n;render();return;}}}return actionBase();};
const checkGateBase=checkGate;
checkGate=function(){if(s.map===RIDGE){const row=MAPS[RIDGE]?.tiles?.[s.y]||'';if(row[s.x]==='V'){stopMoving();encounterGrace=RETURN_GRACE;s.map=FROM;s.x=10;s.y=2;s.dir='down';guidePhase='clue';s.dialog={name:'北尾根・雲上の鞍部',text:'風鳴りの石段を下り、雲上の鞍部へ戻った。岩壁に入ると横風が急に弱くなる。'};return;}}return checkGateBase();};
const encounterMapBase=encounterMap;
encounterMap=function(){return s.map===RIDGE?true:encounterMapBase();};
const enemyPoolBase=enemyPool;
enemyPool=function(){return s.map===RIDGE?EVAC_ENEMIES:enemyPoolBase();};

function decorate(){if(lastMap!==s.map){if(lastMap===RIDGE)guidePhase='clue';lastMap=s.map;}if(s.screen!=='world'||s.map!==RIDGE)return;const shell=app.querySelector('.gameShell');const w=app.querySelector('.world');if(!shell||!w)return;let guide=shell.querySelector('.lqWindStairGuide');if(!guide){guide=document.createElement('div');guide.className='lqWindStairGuide';shell.appendChild(guide);}guide.textContent=guidePhase==='clue'?'風鳴りの石段：新しい靴跡を調べる':'風鳴りの石段：北へ続く削れた踏み段を確認する';w.querySelectorAll('.lqWindStairMarker').forEach(n=>n.remove());const target=guidePhase==='clue'?{x:11,y:16}:{x:10,y:1};const marker=document.createElement('div');marker.className='lqWindStairMarker';marker.style.left=`${target.x*TS+TS/2}px`;marker.style.top=`${target.y*TS+TS/2}px`;w.appendChild(marker);}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};
const renderBase=render;render=function(){const r=renderBase();decorate();return r;};

window.LQ_WIND_STAIR_RIDGE_STATUS={version:'1.1',requirement:'REQ-113',map:RIDGE,displayName:'北尾根・風鳴りの石段',entryFrom:FROM,entrySpawn:[10,18],returnSpawn:[10,2],interactionCount:4,firstClue:{kind:'lqWindStairBoot',x:11,y:16},northBoundary:{kind:'lqWindStairBoundary',x:10,y:1},newRequiredStoryFlags:0,protectedCanonChanged:false,encounterEnabled:true,encounterPool:'EVAC_ENEMIES',entryEncounterGrace:ENTRY_GRACE,returnEncounterGrace:RETURN_GRACE,canonicalAction:true,canonicalCheckGate:true,saveSchemaChanged:false,pointerAuthority:false,iosPhysicalVerification:'PENDING',guidePhase:()=>guidePhase};
})();
