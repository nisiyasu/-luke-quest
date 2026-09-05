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
 action();
 const interacted=!!s.dialog&&s.dialog.name==='旅好きの老人'&&!!app.querySelector('.dialogBox');
 const shell=app.querySelector('.gameShell'),player=app.querySelector('.player');
 const marker=document.createElement('div');marker.id='lqRuntimeSmokeMarker';marker.dataset.screen=s.screen;marker.dataset.map=s.map;marker.dataset.shell=String(!!shell);marker.dataset.player=String(!!player);marker.dataset.moved=String(moved);marker.dataset.interacted=String(interacted);marker.dataset.dialog=String(s.dialog?.name||'');marker.dataset.x=String(s.x);marker.dataset.y=String(s.y);marker.style.display='none';document.body.appendChild(marker);

 s.dialog=null;s.hp=99;s.mh=99;s.enemy={n:'訓練用スモーク標的',e:'',hp:999,a:[1,1],xp:0,g:0};s.ehp=999;s.log=['CI battle smoke'];s.screen='battle';s.lqFocusSlashUsed=false;s.lqBattleMeta={turns:0,herbUsed:false};
 battle();const beforeEnemyHp=s.ehp;attack();
 const battled=s.screen==='battle'&&s.enemy?.n==='訓練用スモーク標的'&&s.ehp<beforeEnemyHp&&s.hp<99&&s.hp>0;
 const battleMarker=document.createElement('div');battleMarker.id='lqRuntimeBattleSmokeMarker';battleMarker.dataset.battled=String(battled);battleMarker.dataset.enemy=String(s.enemy?.n||'');battleMarker.dataset.enemyHp=String(s.ehp);battleMarker.dataset.playerHp=String(s.hp);battleMarker.style.display='none';document.body.appendChild(battleMarker);

 const beforeStorage=localStorage.length;
 s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='down';s.dialog=null;s.enemy=null;s.ehp=0;
 save();
 const saved=localStorage.length>beforeStorage;
 const saveMarker=document.createElement('div');saveMarker.id='lqRuntimeSaveSmokeMarker';saveMarker.dataset.saved=String(saved);saveMarker.dataset.storageCount=String(localStorage.length);saveMarker.style.display='none';document.body.appendChild(saveMarker);

 window.LQ_RUNTIME_SMOKE_HOOK_STATUS={available:true,active:true,worldRendered:!!shell,playerRendered:!!player,movement:moved,interaction:interacted,battleAction:battled,savePersistence:saved,map:'town'};
}catch(err){
 const marker=document.createElement('div');marker.id='lqRuntimeSmokeFailure';marker.textContent=String(err&&err.stack||err);document.body.appendChild(marker);throw err;
}
})();
