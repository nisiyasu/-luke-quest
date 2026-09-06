(() => {
'use strict';

/* REQ-031 assembled-browser acceptance. Verifies actual blocking/opening
   semantics and persistent projection, not merely flag existence. */
if(!new URLSearchParams(location.search).has('lqSmoke'))return;
function marker(ok,data={}){
  const el=document.createElement('i');
  el.id=ok?'lqSurveyDungeonRuntimeSmokeMarker':'lqRuntimeSmokeFailure';
  el.style.display='none';
  for(const [k,v] of Object.entries(data))el.dataset[k]=String(v);
  document.body.appendChild(el);
}
setTimeout(()=>{
  const snapshot={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,dialog:s.dialog,flags:Object.assign({},s.flags||{})};
  try{
    if(!MAPS.aldiaLimestoneCave||!MAPS.aldiaSurveyDungeon)throw new Error('survey dungeon maps missing');
    const entrance=MAPS.aldiaLimestoneCave.npcs.find(n=>n.kind==='lqSurveyDungeonEntrance');
    if(!entrance||entrance.x!==16||entrance.y!==11)throw new Error('survey dungeon entrance missing');

    s.flags=Object.assign({},s.flags||{});delete s.flags.lqSurveyGateOpen;
    s.screen='world';s.dialog=null;s.map='aldiaLimestoneCave';s.x=15;s.y=11;s.dir='right';render();action();
    const entered=s.map==='aldiaSurveyDungeon'&&s.x===9&&s.y===14;
    const spawnSafe=entered&&((MAPS[s.map].tiles[s.y]||'')[s.x]!=='#');
    if(!entered||!spawnSafe)throw new Error('canonical dungeon entry/spawn failed');
    if(s.dialog)action();

    render();
    const gateClosed=MAPS.aldiaSurveyDungeon.npcs.some(n=>n.kind==='lqSurveyGate'&&n.x===9&&n.y===7);
    if(!gateClosed)throw new Error('gate not projected closed');
    s.x=9;s.y=8;s.dir='up';s.dialog=null;
    const blockedClosed=!canWalk(9,7);
    if(!blockedClosed)throw new Error('closed gate is walkable');

    s.x=5;s.y=12;s.dir='up';s.dialog=null;render();action();
    const flagOpened=!!s.flags.lqSurveyGateOpen;
    const gateRemoved=!MAPS.aldiaSurveyDungeon.npcs.some(n=>n.kind==='lqSurveyGate');
    if(!flagOpened||!gateRemoved)throw new Error('lever did not open gate');

    s.dialog=null;render();
    const persistedAfterRender=!!s.flags.lqSurveyGateOpen&&!MAPS.aldiaSurveyDungeon.npcs.some(n=>n.kind==='lqSurveyGate');
    const passableOpen=canWalk(9,7);
    if(!persistedAfterRender||!passableOpen)throw new Error('open gate did not persist/project');

    s.x=14;s.y=4;s.dir='up';s.dialog=null;render();action();
    const deepInteracted=!!s.dialog&&s.dialog.name==='奥区画の測量標';
    if(!deepInteracted)throw new Error('deep survey interaction failed');

    /* Simulate load-like projection by re-inserting stale gate DOM model data,
       then render from persistent flag and require it to be removed again. */
    if(!MAPS.aldiaSurveyDungeon.npcs.some(n=>n.kind==='lqSurveyGate')){
      MAPS.aldiaSurveyDungeon.npcs.push({x:9,y:7,e:'',name:'stale gate',kind:'lqSurveyGate',text:'stale'});
    }
    render();
    const reconstructedOpen=!!s.flags.lqSurveyGateOpen&&!MAPS.aldiaSurveyDungeon.npcs.some(n=>n.kind==='lqSurveyGate');
    if(!reconstructedOpen)throw new Error('persistent gate projection failed after reconstruction');

    s.dialog=null;s.x=9;s.y=15;s.dir='down';checkGate();render();
    const exited=s.map==='aldiaLimestoneCave'&&s.x===15&&s.y===11;
    const exitSafe=exited&&((MAPS.aldiaLimestoneCave.tiles[s.y]||'')[s.x]!=='#')&&!MAPS.aldiaLimestoneCave.npcs.some(n=>n.x===s.x&&n.y===s.y);
    if(!exited||!exitSafe)throw new Error('dungeon exit/safe cave spawn failed');

    marker(true,{entered,spawnSafe,gateClosed,blockedClosed,flagOpened,gateRemoved,persistedAfterRender,passableOpen,deepInteracted,reconstructedOpen,exited,exitSafe});
  }catch(err){
    const reason=err&&err.message||String(err);
    console.error('REQ-031 runtime smoke failure',reason);
    marker(false,{reason});
  }finally{
    stopMoving();
    s.screen=snapshot.screen;s.map=snapshot.map;s.x=snapshot.x;s.y=snapshot.y;s.dir=snapshot.dir;s.dialog=snapshot.dialog;s.flags=snapshot.flags;
    render();
  }
},5000);
})();
