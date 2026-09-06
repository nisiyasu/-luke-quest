(() => {
'use strict';

/* REQ-113 — data-only map registration. Interaction authority is extended
   inside the existing Cloudbreak action wrapper to avoid adding another
   global action/checkGate/encounter wrapper. */
const FROM='cloudbreakSaddle';
const RIDGE='windStairRidge';
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

window.LQ_WIND_STAIR_RIDGE_STATUS={version:'1.6',requirement:'REQ-113',map:RIDGE,displayName:'北尾根・風鳴りの石段',entryFrom:FROM,entrySpawn:[11,18],returnSpawn:[10,2],interactionCount:5,firstClue:{kind:'lqWindStairBoot',x:11,y:16},southReturn:{kind:'lqWindStairReturn',x:10,y:18},northBoundary:{kind:'lqWindStairBoundary',x:10,y:1},guidance:'visible canonical interactables: 👣 south clue -> ⬆️ north boundary; ↩️ safe return',newRequiredStoryFlags:0,protectedCanonChanged:false,encounterEnabled:false,encounterIntegrationDeferred:'protected REQ-082 authority chain',globalWrapperCount:0,saveSchemaChanged:false,pointerAuthority:false,iosPhysicalVerification:'PENDING'};
})();
