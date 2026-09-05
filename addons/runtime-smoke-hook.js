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
 const shell=app.querySelector('.gameShell'),player=app.querySelector('.player');
 const marker=document.createElement('div');marker.id='lqRuntimeSmokeMarker';marker.dataset.screen=s.screen;marker.dataset.map=s.map;marker.dataset.shell=String(!!shell);marker.dataset.player=String(!!player);marker.dataset.moved=String(moved);marker.dataset.x=String(s.x);marker.dataset.y=String(s.y);marker.style.display='none';document.body.appendChild(marker);
 window.LQ_RUNTIME_SMOKE_HOOK_STATUS={available:true,active:true,worldRendered:!!shell,playerRendered:!!player,movement:moved,map:s.map,x:s.x,y:s.y};
}catch(err){
 const marker=document.createElement('div');marker.id='lqRuntimeSmokeFailure';marker.textContent=String(err&&err.stack||err);document.body.appendChild(marker);throw err;
}
})();
