(() => {
'use strict';

/* REQ-113 — reduced-interference playable continuation north from Cloudbreak Saddle. */
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
  {x:11,y:16,e:'👣',name:'石段に残る新しい靴跡',kind:'lqWindStairBoot',text:'風に砂を払われた石段のくぼみに、新しい靴底の泥だけが残っている。跡は北へ続いている。\nルーク「少なくとも、ここを通ったのは間違いなさそうです。」'},
  {x:6,y:12,e:'🪨',name:'風鳴りの古い石柱',kind:'lqWindStairPillar',text:'崩れかけた石柱の穴を風が抜け、低い笛のような音を鳴らしている。古い山道の目印だったらしい。'},
  {x:16,y:7,e:'☁️',name:'雲海を望む張り出し',kind:'lqWindStairView',text:'雲海の切れ目から、北側の尾根がさらに続いているのが見える。途中には人が通ったような細い色の違いがある。'},
  {x:10,y:1,e:'⬆️',name:'北へ続く削れた踏み段',kind:'lqWindStairBoundary',text:'岩肌に刻まれた踏み段が、さらに北の稜線へ上がっている。縁の苔だけが新しく削れている。\nルーク「まだ先ですね。……レオン、足速すぎません？」'}
 ]
};

let guidePhase='clue';
function aheadNpc(mapId){if(s.screen!=='world'||s.map!==mapId)return null;const p=front();return MAPS[mapId]?.npcs?.find(n=>n.x===p.x&&n.y===p.y)||null;}
function enterRidge(boundary){
 stopMoving();encounterGrace=ENTRY_GRACE;s.map=RIDGE;s.x=10;s.y=18;s.dir='up';guidePhase='clue';
 s.dialog={kind:boundary?.kind||'lqCloudbreakBoundary',name:'北尾根・風鳴りの石段',text:'雲上の鞍部から踏み段を登ると、風が石柱の穴を鳴らす古い山道へ出た。砂の薄い場所に、新しい靴跡が残っている。\nルーク「道があるだけ、さっきよりだいぶ親切ですね。」'};
 render();
}
const actionBase=action;
action=function(){
 if(!s.dialog&&s.screen==='world'){
  if(s.map===FROM){const n=aheadNpc(FROM);if(n?.kind==='lqCloudbreakBoundary'){enterRidge(n);return;}}
  if(s.map===RIDGE){const n=aheadNpc(RIDGE);if(n){stopMoving();if(n.kind==='lqWindStairBoot')guidePhase='north';s.dialog=n;render();return;}}
 }
 return actionBase();
};
const checkGateBase=checkGate;
checkGate=function(){
 if(s.map===RIDGE){const row=MAPS[RIDGE]?.tiles?.[s.y]||'';if(row[s.x]==='V'){
  stopMoving();encounterGrace=RETURN_GRACE;s.map=FROM;s.x=10;s.y=2;s.dir='down';guidePhase='clue';
  s.dialog={name:'北尾根・雲上の鞍部',text:'風鳴りの石段を下り、雲上の鞍部へ戻った。岩壁に入ると横風が急に弱くなる。'};return;
 }}
 return checkGateBase();
};
const encounterMapBase=encounterMap;
encounterMap=function(){return s.map===RIDGE?true:encounterMapBase();};
const enemyPoolBase=enemyPool;
enemyPool=function(){return s.map===RIDGE?EVAC_ENEMIES:enemyPoolBase();};

window.LQ_WIND_STAIR_RIDGE_STATUS={version:'1.2',requirement:'REQ-113',map:RIDGE,displayName:'北尾根・風鳴りの石段',entryFrom:FROM,entrySpawn:[10,18],returnSpawn:[10,2],interactionCount:4,firstClue:{kind:'lqWindStairBoot',x:11,y:16},northBoundary:{kind:'lqWindStairBoundary',x:10,y:1},guidance:'visible canonical interactables: 👣 south clue -> ⬆️ north boundary',newRequiredStoryFlags:0,protectedCanonChanged:false,encounterEnabled:true,encounterPool:'EVAC_ENEMIES',entryEncounterGrace:ENTRY_GRACE,returnEncounterGrace:RETURN_GRACE,canonicalAction:true,canonicalCheckGate:true,saveSchemaChanged:false,pointerAuthority:false,iosPhysicalVerification:'PENDING',guidePhase:()=>guidePhase};
})();
