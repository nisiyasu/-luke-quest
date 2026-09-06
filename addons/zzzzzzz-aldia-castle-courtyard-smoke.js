(() => {
'use strict';

/* REQ-026 runtime acceptance probe. Inert in normal play. The assembled browser
   smoke fails on the deliberate ReferenceError if any acceptance check is false. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqSmoke'))return;

function marker(data){
  const m=document.createElement('i');m.id='lqCastleCourtyardRuntimeSmokeMarker';
  Object.entries(data).forEach(([k,v])=>m.dataset[k]=String(v));m.hidden=true;document.body.appendChild(m);
}

setTimeout(()=>{
  const snapshot=structuredClone(s);
  const r={registered:false,entered:false,walkable:false,landmark:false,interaction:false,mainDoorBoundary:false,returned:false,safeSpawn:false,restored:false};
  try{
    stopMoving();
    r.registered=!!MAPS.aldiaCastleCourtyard&&window.LQ_CASTLE_COURTYARD_STATUS?.fullCastleComplete===false;

    // Enter from the gatehouse north passage using its gate transition path.
    s.screen='world';s.map='aldiaCastleGatehouse';s.x=5;s.y=0;s.dir='up';s.dialog=null;
    checkGate();render();
    r.entered=s.map==='aldiaCastleCourtyard'&&s.x===7&&s.y===9&&!!s.dialog&&s.dialog.name==='王城前庭';
    action();

    const bx=s.x,by=s.y;move('right');stopMoving();
    r.walkable=s.map==='aldiaCastleCourtyard'&&(s.x!==bx||s.y!==by);
    render();
    r.landmark=!!document.querySelector('.lqCourtyardFountain')&&document.querySelectorAll('.lqCourtyardBanner').length===2;

    // Canonical optional interaction.
    s.x=3;s.y=5;s.dir='up';s.dialog=null;render();action();
    r.interaction=!!s.dialog&&s.dialog.name==='前庭の案内板';action();

    // The visible main-castle boundary is world-consistent, not a meta/dev message.
    s.x=7;s.y=2;s.dir='up';s.dialog=null;render();action();
    r.mainDoorBoundary=!!s.dialog&&s.dialog.name==='王城本館の大扉'&&!/開発|未実装|TODO|debug/i.test(s.dialog.text||'');action();

    // Return to the gatehouse and verify non-colliding spawn.
    s.map='aldiaCastleCourtyard';s.x=7;s.y=11;s.dir='down';s.dialog=null;checkGate();
    r.returned=s.map==='aldiaCastleGatehouse'&&s.x===5&&s.y===1&&!!s.dialog&&s.dialog.name==='王城門衛詰所';
    const gm=MAPS.aldiaCastleGatehouse;const tile=(gm.tiles[s.y]||'')[s.x];
    const occupied=(gm.npcs||[]).some(n=>n.x===s.x&&n.y===s.y);
    r.safeSpawn=tile!==undefined&&tile!=='#'&&!occupied;

    const pass=Object.values(r).slice(0,8).every(Boolean);
    if(!pass){console.error('lqCastleCourtyardSmokeFailure',r);setTimeout(()=>{LQ_REQ026_RUNTIME_ACCEPTANCE_FAILED();},0);}
  }catch(err){
    console.error('lqCastleCourtyardSmokeFailure',err,r);setTimeout(()=>{LQ_REQ026_RUNTIME_EXCEPTION();},0);
  }finally{
    try{stopMoving();Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();r.restored=true;}catch(err){console.error('lqCastleCourtyardRestoreFailure',err);}
    marker(r);
  }
},4900);
})();
