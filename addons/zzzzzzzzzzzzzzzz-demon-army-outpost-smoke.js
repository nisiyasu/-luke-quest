(() => {
'use strict';

/* REQ-033 assembled-browser acceptance. */
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
const snapshot=structuredClone(s);
function marker(ok,data={}){
  const el=document.createElement('i');
  el.id=ok?'lqDemonOutpostRuntimeSmokeMarker':'lqRuntimeSmokeFailure_REQ033';
  el.style.display='none';
  for(const [k,v] of Object.entries(data))el.dataset[k]=String(v);
  document.body.appendChild(el);
  return el;
}
try{
  const status=window.LQ_DEMON_ARMY_OUTPOST_STATUS;
  if(!status||status.protectedCanonChanged!==false||status.mainStoryFlagsAdded!==0)throw new Error('outpost safety status missing');
  if(!MAPS.aldiaHighlandTrail||!MAPS.abandonedDemonArmyOutpost)throw new Error('outpost maps missing');
  const entrance=(MAPS.aldiaHighlandTrail.npcs||[]).find(n=>n.kind==='lqDemonOutpostEntrance');
  if(!entrance||entrance.x!==16||entrance.y!==13)throw new Error('highland outpost entrance missing');

  const originalHighInteractions=['lqHighlandSign','lqHighlandCairn','lqHighlandView','lqHighlandRope','lqHighlandBoundary'];
  const highlandPreserved=originalHighInteractions.every(kind=>(MAPS.aldiaHighlandTrail.npcs||[]).some(n=>n.kind===kind))&&((MAPS.aldiaHighlandTrail.tiles[15]||'')[9]==='G');
  if(!highlandPreserved)throw new Error('REQ-030 highland contract changed');

  s.screen='world';s.dialog=null;s.map='aldiaHighlandTrail';s.x=15;s.y=13;s.dir='right';render();action();
  const entered=s.map==='abandonedDemonArmyOutpost'&&s.x===7&&s.y===10;
  const spawnSafe=entered&&((MAPS[s.map].tiles[s.y]||'')[s.x]!== '#')&&!(MAPS[s.map].npcs||[]).some(n=>n.x===s.x&&n.y===s.y);
  if(!entered||!spawnSafe)throw new Error('canonical outpost entry/spawn failed');
  if(s.dialog)action();

  const targets=[
    {stand:[4,5,'up'],name:'古い監視地図'},
    {stand:[11,5,'up'],name:'空の兵站棚'},
    {stand:[4,7,'down'],name:'壊れた信号灯'},
    {stand:[11,7,'down'],name:'高地を望む監視窓'},
    {stand:[8,3,'up'],name:'剥がされた勤務札'}
  ];
  const interacted=[];
  for(const t of targets){
    const [x,y,dir]=t.stand;
    s.dialog=null;s.x=x;s.y=y;s.dir=dir;render();action();
    interacted.push(!!s.dialog&&s.dialog.name===t.name);
    if(!interacted[interacted.length-1])throw new Error(`interaction failed ${t.name}`);
  }

  const noStoryMutation=status.mainStoryFlagsAdded===0&&status.occupied===false;
  if(!noStoryMutation)throw new Error('outpost unexpectedly mutates story authority');

  s.dialog=null;s.x=7;s.y=11;s.dir='down';checkGate();render();
  const exited=s.map==='aldiaHighlandTrail'&&s.x===15&&s.y===13&&s.dir==='right';
  const exitSafe=exited&&((MAPS.aldiaHighlandTrail.tiles[s.y]||'')[s.x]!=='#')&&!(MAPS.aldiaHighlandTrail.npcs||[]).some(n=>n.x===s.x&&n.y===s.y);
  if(!exited||!exitSafe)throw new Error('outpost exit/safe highland spawn failed');

  marker(true,{entered,spawnSafe,highlandPreserved,interactionCount:interacted.filter(Boolean).length,noStoryMutation,exited,exitSafe});
}catch(err){
  const reason=err&&err.message||String(err);
  const fail=marker(false,{reason});
  fail.id=`lqRuntimeSmokeFailure_REQ033_${reason.replace(/[^a-zA-Z0-9_-]+/g,'_').slice(0,120)}`;
}finally{
  stopMoving();s=structuredClone(snapshot);render();
}
})();
