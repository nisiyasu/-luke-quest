(() => {
'use strict';

/* REQ-113 — conservative playable continuation north from Cloudbreak Saddle. */
const FROM='cloudbreakSaddle';
const RIDGE='windStairRidge';
const ENTRY_GRACE=5;
const RETURN_GRACE=4;
if(!MAPS[FROM])return;

MAPS[RIDGE]={
 name:'北尾根・風鳴りの石段',w:22,h:20,
 tiles:[
  '##########^^##########','#....^^..........^^..#','#...^^^^........^^^^.#','#....................#','#....####....####....#','#....................#','#..^^............^^..#','#.^^^^..........^^^^.#','#..^^............^^..#','#....................#','#....####....####....#','#....................#','#..^^^^........^^^^..#','#...^^..........^^...#','#....................#','#....^^........^^....#','#....................#','#....................#','#....................#','######################'
 ],
 npcs:[
  {x:10,y:18,e:'↩️',name:'雲上の鞍部へ戻る踏み段',kind:'lqWindStairReturn',text:'南へ下れば、さっきの雲上の鞍部へ戻れる。'},
  {x:11,y:16,e:'👣',name:'石段に残る新しい靴跡',kind:'lqWindStairBoot',text:'風に砂を払われた石段のくぼみに、新しい靴底の泥だけが残っている。跡は北へ続いている。\nルーク「少なくとも、ここを通ったのは間違いなさそうです。」'},
  {x:6,y:12,e:'🪨',name:'風鳴りの古い石柱',kind:'lqWindStairPillar',text:'崩れかけた石柱の穴を風が抜け、低い笛のような音を鳴らしている。古い山道の目印だったらしい。'},
  {x:16,y:7,e:'☁️',name:'雲海を望む張り出し',kind:'lqWindStairView',text:'雲海の切れ目から、北側の尾根がさらに続いているのが見える。途中には人が通ったような細い色の違いがある。'},
  {x:10,y:1,e:'⬆️',name:'北へ続く削れた踏み段',kind:'lqWindStairBoundary',text:'岩肌に刻まれた踏み段が、さらに北の稜線へ上がっている。縁の苔だけが新しく削れている。\nルーク「まだ先ですね。……レオン、足速すぎません？」'}
 ]
};

let guidePhase='clue';
function aheadNpc(mapId){if(s.screen!=='world'||s.map!==mapId)return null;const p=front();return MAPS[mapId]?.npcs?.find(n=>n.x===p.x&&n.y===p.y)||null;}
function enterRidge(boundary){stopMoving();encounterGrace=ENTRY_GRACE;s.map=RIDGE;s.x=11;s.y=18;s.dir='up';guidePhase='clue';s.dialog={kind:boundary?.kind||'lqCloudbreakBoundary',name:'北尾根・風鳴りの石段',text:'雲上の鞍部から踏み段を登ると、風が石柱の穴を鳴らす古い山道へ出た。砂の薄い場所に、新しい靴跡が残っている。\nルーク「道があるだけ、さっきよりだいぶ親切ですね。」'};render();}
function returnToSaddle(){stopMoving();encounterGrace=RETURN_GRACE;s.map=FROM;s.x=10;s.y=2;s.dir='down';guidePhase='clue';s.dialog={name:'北尾根・雲上の鞍部',text:'風鳴りの石段を下り、雲上の鞍部へ戻った。岩壁に入ると横風が急に弱くなる。'};render();}
const actionBase=action;
action=function(){
 if(!s.dialog&&s.screen==='world'){
  if(s.map===FROM){const n=aheadNpc(FROM);if(n?.kind==='lqCloudbreakBoundary'){enterRidge(n);return;}}
  if(s.map===RIDGE){const n=aheadNpc(RIDGE);if(n){if(n.kind==='lqWindStairReturn'){returnToSaddle();return;}stopMoving();if(n.kind==='lqWindStairBoot')guidePhase='north';s.dialog=n;render();return;}}
 }
 return actionBase();
};

/* Do not wrap checkGate(), encounterMap() or enemyPool(). REQ-082 is a
   protected authority chain. This route uses canonical Action for both entry
   and safe return and remains a combat-free pursuit interval for now. */
window.LQ_WIND_STAIR_RIDGE_STATUS={version:'1.5',requirement:'REQ-113',map:RIDGE,displayName:'北尾根・風鳴りの石段',entryFrom:FROM,entrySpawn:[11,18],returnSpawn:[10,2],interactionCount:5,firstClue:{kind:'lqWindStairBoot',x:11,y:16},southReturn:{kind:'lqWindStairReturn',x:10,y:18},northBoundary:{kind:'lqWindStairBoundary',x:10,y:1},guidance:'visible canonical interactables: 👣 south clue -> ⬆️ north boundary; ↩️ safe return',newRequiredStoryFlags:0,protectedCanonChanged:false,encounterEnabled:false,encounterIntegrationDeferred:'protected REQ-082 authority chain',entryEncounterGrace:ENTRY_GRACE,returnEncounterGrace:RETURN_GRACE,canonicalAction:true,canonicalCheckGateUnchanged:true,saveSchemaChanged:false,pointerAuthority:false,iosPhysicalVerification:'PENDING',guidePhase:()=>guidePhase};
})();
