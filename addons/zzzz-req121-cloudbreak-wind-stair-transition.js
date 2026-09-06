(() => {
'use strict';

/* REQ-121 — narrow late-bound transition authority.
   Loaded after both canonical data maps exist, so the established Cloudbreak
   runtime wrapper remains untouched while the missing successor link is restored. */
const SADDLE='cloudbreakSaddle';
const RIDGE='windStairRidge';
const ENTRY_GRACE=5;
const RETURN_GRACE=4;
if(!MAPS[SADDLE]||!MAPS[RIDGE])return;

function aheadNpc(mapId){
  if(s.screen!=='world'||s.map!==mapId)return null;
  const p=front();
  return MAPS[mapId]?.npcs?.find(n=>n.x===p.x&&n.y===p.y)||null;
}
function enterRidge(boundary){
  stopMoving();
  encounterGrace=ENTRY_GRACE;
  s.map=RIDGE;s.x=11;s.y=18;s.dir='up';
  s.dialog={kind:boundary?.kind||'lqCloudbreakBoundary',name:'北尾根・風鳴りの石段',text:'古い踏み段を登ると、風が岩の隙間を鳴らす細い石段へ出た。少し先には、新しい靴跡が残っている。\nルーク「ちゃんと道は続いてますね。……まだ登るのか。」'};
  render();
}
function returnToSaddle(ret){
  stopMoving();
  encounterGrace=RETURN_GRACE;
  s.map=SADDLE;s.x=10;s.y=2;s.dir='down';
  s.dialog={kind:ret?.kind||'lqWindStairReturn',name:'北尾根・雲上の鞍部',text:'風鳴りの石段を南へ下り、雲上の鞍部へ戻った。北へ進む石段跡は、すぐ背後にある。'};
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'){
    if(s.map===SADDLE){
      const n=aheadNpc(SADDLE);
      if(n?.kind==='lqCloudbreakBoundary'){enterRidge(n);return;}
    }else if(s.map===RIDGE){
      const n=aheadNpc(RIDGE);
      if(n?.kind==='lqWindStairReturn'){returnToSaddle(n);return;}
    }
  }
  return baseAction();
};

window.LQ_REQ121_TRANSITION_STATUS={
  version:'1.0',
  from:SADDLE,
  to:RIDGE,
  boundaryKind:'lqCloudbreakBoundary',
  entrySpawn:[11,18],
  returnKind:'lqWindStairReturn',
  returnSpawn:[10,2],
  canonicalAction:true,
  saveSchemaChanged:false,
  newRequiredStoryFlags:0,
  iosPhysicalVerification:'PENDING'
};
})();
