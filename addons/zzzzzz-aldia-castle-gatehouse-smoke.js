(() => {
'use strict';

/* REQ-025 runtime acceptance probe. Inert in normal play. The existing assembled
   browser smoke catches the deliberate ReferenceError if any acceptance check fails. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqSmoke'))return;

function marker(data){
  const m=document.createElement('i');
  m.id='lqCastleGatehouseRuntimeSmokeMarker';
  Object.entries(data).forEach(([k,v])=>m.dataset[k]=String(v));
  m.hidden=true;
  document.body.appendChild(m);
}

setTimeout(()=>{
  const snapshot=structuredClone(s);
  const result={registered:false,entered:false,walkable:false,guardTalk:false,propTalk:false,exited:false,safeSpawn:false,restored:false};
  try{
    stopMoving();
    result.registered=!!MAPS.aldiaCastleGatehouse&&window.LQ_CASTLE_GATEHOUSE_STATUS?.walkable===true&&window.LQ_CASTLE_GATEHOUSE_STATUS?.fullCastleComplete===false;

    // Enter through the same final canonical action() chain used by A/tap-anywhere.
    s.screen='world';s.map='town';s.x=8;s.y=2;s.dir='up';s.dialog=null;
    render();
    action();
    result.entered=s.map==='aldiaCastleGatehouse'&&s.x===5&&s.y===7&&!!s.dialog&&s.dialog.name==='王城門衛詰所';

    // Close entry dialogue, then prove interior movement on a clear tile.
    action();
    const beforeX=s.x,beforeY=s.y;
    move('right');
    result.walkable=s.map==='aldiaCastleGatehouse'&&(s.x!==beforeX||s.y!==beforeY);
    stopMoving();

    // Guard interaction through canonical action wrapper.
    s.x=6;s.y=4;s.dir='up';s.dialog=null;render();action();
    result.guardTalk=!!s.dialog&&s.dialog.name==='王城門衛ベルク';
    action();

    // Environment prop interaction through the same wrapper chain.
    s.x=2;s.y=3;s.dir='up';s.dialog=null;render();action();
    result.propTalk=!!s.dialog&&s.dialog.name==='整列した槍掛け';
    action();

    // Gate exit logic returns to a non-colliding town spawn.
    s.map='aldiaCastleGatehouse';s.x=5;s.y=9;s.dir='down';s.dialog=null;
    checkGate();
    result.exited=s.map==='town'&&s.x===8&&s.y===2&&!!s.dialog&&s.dialog.name==='王都アルディア';
    const town=MAPS.town;
    const tile=(town.tiles[s.y]||'')[s.x];
    const occupied=(town.npcs||[]).some(n=>n.x===s.x&&n.y===s.y);
    result.safeSpawn=tile!==undefined&&tile!=='#'&&!occupied;

    const pass=Object.values(result).slice(0,7).every(Boolean);
    if(!pass){
      console.error('lqCastleGatehouseSmokeFailure',result);
      setTimeout(()=>{LQ_REQ025_RUNTIME_ACCEPTANCE_FAILED();},0);
    }
  }catch(err){
    console.error('lqCastleGatehouseSmokeFailure',err,result);
    setTimeout(()=>{LQ_REQ025_RUNTIME_EXCEPTION();},0);
  }finally{
    try{
      stopMoving();
      Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
      result.restored=true;
    }catch(err){console.error('lqCastleGatehouseRestoreFailure',err);}
    marker(result);
  }
},4300);
})();
