(() => {
'use strict';

/* REQ-082 dedicated assembled-browser acceptance. Inert outside explicit probe. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqNorthCliffEncounterSmoke'))return;

function marker(data){
  const el=document.createElement('i');el.id='lqNorthCliffEncounterSmokeMarker';
  Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));el.hidden=true;document.body.appendChild(el);
}
function failure(reason){
  const el=document.createElement('i');el.id='lqNorthCliffEncounterSmokeFailure';el.dataset.reason=String(reason||'unknown');el.hidden=true;document.body.appendChild(el);
}

setTimeout(()=>{
  const snapshot=structuredClone(s);
  const rawBefore=localStorage.getItem('lukeQuestV2');
  const originalGrace=encounterGrace;
  let encounterEnabled=false,exactPool=false,noNewEnemies=false,entryGrace=false,returnGrace=false,battleUsesExistingPool=false,statusContract=false;
  try{
    stopMoving();
    s.screen='world';s.map='northCliffRoad';s.x=10;s.y=16;s.dir='up';s.dialog=null;render();
    encounterEnabled=encounterMap()===true;
    const pool=enemyPool();
    exactPool=pool===EVAC_ENEMIES;
    noNewEnemies=pool.length===EVAC_ENEMIES.length&&pool.every((e,i)=>e===EVAC_ENEMIES[i]);

    // move() consumes one grace count after a successful step/gate transition,
    // so acceptance verifies a positive bounded grace rather than incorrectly
    // requiring the pre-move configured value to survive unchanged.
    encounterGrace=0;
    s.screen='world';s.map='evacRoute';s.x=14;s.y=1;s.dir='up';s.dialog=null;s.flags.withdrawProofSeen=true;render();move('up');
    const configuredEntry=window.LQ_NORTH_CLIFF_ROAD_STATUS?.entryEncounterGrace||0;
    entryGrace=s.map==='northCliffRoad'&&encounterGrace>0&&encounterGrace<=configuredEntry;

    s.dialog=null;s.screen='world';s.map='northCliffRoad';s.x=10;s.y=16;s.dir='down';encounterGrace=0;render();move('down');
    const configuredReturn=window.LQ_NORTH_CLIFF_ROAD_STATUS?.returnEncounterGrace||0;
    returnGrace=s.map==='evacRoute'&&encounterGrace>0&&encounterGrace<=configuredReturn;

    s.screen='world';s.map='northCliffRoad';s.x=10;s.y=16;s.dir='up';s.dialog=null;encounterGrace=0;render();
    startBattle();
    battleUsesExistingPool=s.screen==='battle'&&EVAC_ENEMIES.includes(s.enemy);

    statusContract=window.LQ_NORTH_CLIFF_ROAD_STATUS?.encounterEnabled===true&&window.LQ_NORTH_CLIFF_ROAD_STATUS?.encounterPool==='EVAC_ENEMIES'&&window.LQ_NORTH_CLIFF_ROAD_STATUS?.newEnemyIdentities===0;

    if(!(encounterEnabled&&exactPool&&noNewEnemies&&entryGrace&&returnGrace&&battleUsesExistingPool&&statusContract))throw new Error('REQ-082 assertion false');
  }catch(err){console.error('lqNorthCliffEncounterSmokeFailure',err);failure(err&&err.message);}
  finally{
    stopMoving();encounterGrace=originalGrace;Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);
    if(rawBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',rawBefore);
    render();
    marker({encounterEnabled,exactPool,noNewEnemies,entryGrace,returnGrace,battleUsesExistingPool,statusContract});
  }
},700);
})();
