(() => {
'use strict';

/* CI-only runtime smoke hook. Activated only by ?lqSmoke=1 and never during ordinary play. */
const enabled=new URLSearchParams(location.search).get('lqSmoke')==='1';
if(!enabled){window.LQ_RUNTIME_SMOKE_HOOK_STATUS={available:true,active:false};return;}
try{
 stopMoving();
 s.screen='world';s.map=MAPS.town?'town':Object.keys(MAPS)[0];s.x=9;s.y=12;s.dir='down';s.dialog=null;s.pauseOpen=false;s.shopOpen=false;s.victoryResult=null;
 render();
 const before={x:s.x,y:s.y};
 move('left');
 const moved=s.screen==='world'&&s.map==='town'&&s.x===before.x-1&&s.y===before.y&&s.dir==='left';
 s.x=4;s.y=7;s.dir='up';s.dialog=null;render();
 const facingCue=!!app.querySelector('.npc.lqFacingNpc');
 action();
 const interacted=!!s.dialog&&s.dialog.name==='旅好きの老人'&&!!app.querySelector('.dialogBox');
 const shell=app.querySelector('.gameShell'),player=app.querySelector('.player');
 const marker=document.createElement('div');marker.id='lqRuntimeSmokeMarker';marker.dataset.screen=s.screen;marker.dataset.map=s.map;marker.dataset.shell=String(!!shell);marker.dataset.player=String(!!player);marker.dataset.moved=String(moved);marker.dataset.facingCue=String(facingCue);marker.dataset.interacted=String(interacted);marker.dataset.dialog=String(s.dialog?.name||'');marker.dataset.x=String(s.x);marker.dataset.y=String(s.y);marker.style.display='none';document.body.appendChild(marker);

 s.screen='world';s.map='innInterior';s.x=10;s.y=6;s.dir='right';s.dialog=null;render();action();
 const enteredGuestRoom=s.screen==='world'&&s.map==='innGuestRoom'&&!!MAPS.innGuestRoom;
 s.dialog=null;s.x=4;s.y=7;s.dir='down';checkGate();
 const exitedGuestRoom=s.screen==='world'&&s.map==='innInterior';
 s.map='shopInterior';s.x=10;s.y=6;s.dir='right';s.dialog=null;render();action();
 const enteredStockRoom=s.screen==='world'&&s.map==='shopStockRoom'&&!!MAPS.shopStockRoom;
 s.dialog=null;s.x=3;s.y=7;s.dir='down';checkGate();
 const exitedStockRoom=s.screen==='world'&&s.map==='shopInterior';
 const buildingMarker=document.createElement('div');buildingMarker.id='lqRuntimeBuildingSmokeMarker';buildingMarker.dataset.entered=String(enteredGuestRoom);buildingMarker.dataset.exited=String(exitedGuestRoom);buildingMarker.dataset.room=String(!!MAPS.innGuestRoom);buildingMarker.dataset.stockEntered=String(enteredStockRoom);buildingMarker.dataset.stockExited=String(exitedStockRoom);buildingMarker.dataset.stockRoom=String(!!MAPS.shopStockRoom);buildingMarker.style.display='none';document.body.appendChild(buildingMarker);

 s.dialog=null;s.hp=99;s.mh=99;s.enemy={n:'訓練用スモーク標的',e:'',hp:999,a:[1,1],xp:0,g:0};s.ehp=999;s.log=['CI battle smoke'];s.screen='battle';s.lqFocusSlashUsed=false;s.lqBattleMeta={turns:0,herbUsed:false};
 battle();const beforeEnemyHp=s.ehp;attack();
 const battled=s.screen==='battle'&&s.enemy?.n==='訓練用スモーク標的'&&s.ehp<beforeEnemyHp&&s.hp<99&&s.hp>0;
 const battleMarker=document.createElement('div');battleMarker.id='lqRuntimeBattleSmokeMarker';battleMarker.dataset.battled=String(battled);battleMarker.dataset.enemy=String(s.enemy?.n||'');battleMarker.dataset.enemyHp=String(s.ehp);battleMarker.dataset.playerHp=String(s.hp);battleMarker.style.display='none';document.body.appendChild(battleMarker);

 const beforeStorage={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);beforeStorage[k]=localStorage.getItem(k);}
 s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='down';s.dialog=null;s.enemy=null;s.ehp=0;s.gold=43210;
 save();
 const afterStorage={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);afterStorage[k]=localStorage.getItem(k);}
 const changed=Object.keys(afterStorage).some(k=>afterStorage[k]!==beforeStorage[k]);
 const sentinel=Object.values(afterStorage).some(v=>String(v).includes('43210'));
 const saved=changed&&sentinel;
 const saveMarker=document.createElement('div');saveMarker.id='lqRuntimeSaveSmokeMarker';saveMarker.dataset.saved=String(saved);saveMarker.dataset.changed=String(changed);saveMarker.dataset.sentinel=String(sentinel);saveMarker.dataset.storageCount=String(localStorage.length);saveMarker.style.display='none';document.body.appendChild(saveMarker);

 window.LQ_RUNTIME_SMOKE_HOOK_STATUS={available:true,active:true,worldRendered:!!shell,playerRendered:!!player,movement:moved,facingInteractionCue:facingCue,interaction:interacted,buildingTransition:enteredGuestRoom&&exitedGuestRoom,stockRoomTransition:enteredStockRoom&&exitedStockRoom,battleAction:battled,savePersistence:saved,map:'town'};
}catch(err){
 const marker=document.createElement('div');marker.id='lqRuntimeSmokeFailure';marker.textContent=String(err&&err.stack||err);document.body.appendChild(marker);throw err;
}
})();
