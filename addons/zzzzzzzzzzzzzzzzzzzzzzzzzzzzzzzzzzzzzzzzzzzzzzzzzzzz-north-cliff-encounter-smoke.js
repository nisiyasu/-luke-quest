(() => {
'use strict';

/* REQ-082 dedicated assembled-browser acceptance. Inert outside explicit probe. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqNorthCliffEncounterSmoke'))return;
if(window.__LQ_REQ082_SMOKE_ARMED)return;
window.__LQ_REQ082_SMOKE_ARMED=true;

function marker(data){
  const el=document.createElement('i');el.id='lqNorthCliffEncounterSmokeMarker';
  Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));el.hidden=true;document.body.appendChild(el);return el;
}
function failure(reason,data){
  const el=document.createElement('i');el.id='lqReq082SmokeFailureDetail';el.dataset.reason=String(reason||'unknown');
  Object.entries(data||{}).forEach(([k,v])=>el.dataset[k]=String(v));el.hidden=true;document.body.appendChild(el);return el;
}

setTimeout(()=>{
  const snapshot=structuredClone(s);
  const rawBefore=localStorage.getItem('lukeQuestV2');
  const originalGrace=encounterGrace;
  let encounterEnabled=false,exactPool=false,noNewEnemies=false,entryGrace=false,returnGrace=false,battleUsesExistingPool=false,statusContract=false;
  let failureReason='';
  try{
    stopMoving();
    s.screen='world';s.map='northCliffRoad';s.x=10;s.y=16;s.dir='up';s.dialog=null;render();
    encounterEnabled=encounterMap()===true;
    const pool=enemyPool();
    exactPool=pool===EVAC_ENEMIES;
    noNewEnemies=pool.length===EVAC_ENEMIES.length&&pool.every((e,i)=>e===EVAC_ENEMIES[i]);

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

    if(!(encounterEnabled&&exactPool&&noNewEnemies&&entryGrace&&returnGrace&&battleUsesExistingPool&&statusContract)){
      failureReason=`REQ-082 assertion false ${JSON.stringify({encounterEnabled,exactPool,noNewEnemies,entryGrace,returnGrace,battleUsesExistingPool,statusContract,map:s.map,screen:s.screen,grace:encounterGrace})}`;
    }
  }catch(err){
    failureReason=`REQ-082 exception ${err&&err.message}`;
  }
  finally{
    try{stopMoving();}catch(_){ }
    encounterGrace=originalGrace;
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);
    if(rawBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',rawBefore);
    const data={encounterEnabled,exactPool,noNewEnemies,entryGrace,returnGrace,battleUsesExistingPool,statusContract};
    if(failureReason){
      document.documentElement.replaceChildren();
      const head=document.createElement('head');
      const body=document.createElement('body');
      document.documentElement.append(head,body);
      failure(failureReason,data);
    }else{
      try{render();}catch(err){
        document.documentElement.replaceChildren();
        const head=document.createElement('head');
        const body=document.createElement('body');
        document.documentElement.append(head,body);
        failure(`REQ-082 cleanup render exception ${err&&err.message}`,data);
        return;
      }
      marker(data);
    }
  }
},700);
})();
