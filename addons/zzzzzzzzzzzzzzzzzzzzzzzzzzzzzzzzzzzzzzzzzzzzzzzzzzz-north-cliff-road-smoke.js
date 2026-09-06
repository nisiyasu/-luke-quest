(() => {
'use strict';

/* REQ-081 + REQ-093 dedicated assembled-browser acceptance. Inert outside explicit probe. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqNorthCliffSmoke'))return;

function marker(data){
  const el=document.createElement('i');
  el.id='lqNorthCliffRuntimeSmokeMarker';
  Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));
  el.hidden=true;document.body.appendChild(el);
}
function failure(reason){
  const el=document.createElement('i');el.id='lqNorthCliffRuntimeSmokeFailure';el.dataset.reason=String(reason||'unknown');el.hidden=true;document.body.appendChild(el);
}

setTimeout(()=>{
  const snapshot=structuredClone(s);
  const rawBefore=localStorage.getItem('lukeQuestV2');
  let blockedWithoutProof=false,enteredWithProof=false,safeSpawn=false,walkable=false,footprintInteraction=false,boundaryInteraction=false,returnSafe=false;
  let windcutEntry=false,windcutSafeSpawn=false,windcutWalkable=false,windcutInteractions=false,windcutBoundarySafe=false,windcutReturnSafe=false;
  let encounterReuse=false,saveRoundTrip=false,canonSafe=false;
  try{
    stopMoving();
    s.screen='world';s.map='evacRoute';s.x=14;s.y=1;s.dir='up';s.dialog=null;s.flags.withdrawProofSeen=false;render();
    move('up');
    blockedWithoutProof=s.map==='evacRoute'&&s.y===1&&!!s.dialog&&s.dialog.name==='北の崖道';

    s.screen='world';s.map='evacRoute';s.x=14;s.y=1;s.dir='up';s.dialog=null;s.flags.withdrawProofSeen=true;render();
    move('up');
    enteredWithProof=s.map==='northCliffRoad'&&!!MAPS.northCliffRoad;
    safeSpawn=s.x===10&&s.y===16&&!blocked(s.x,s.y);

    s.dialog=null;s.x=10;s.y=16;s.dir='up';render();
    const beforeY=s.y;move('up');
    walkable=s.map==='northCliffRoad'&&s.y===beforeY-1;

    s.dialog=null;s.map='northCliffRoad';s.x=7;s.y=15;s.dir='up';render();action();
    footprintInteraction=!!s.dialog&&s.dialog.name==='新しい足跡';

    /* REQ-081 legacy compatibility: boundaryInteraction now means the existing
       canonical boundary was successfully handled. REQ-093 legitimately changes
       its outcome from dialogue-only to entry into the next walkable checkpoint. */
    s.dialog=null;s.map='northCliffRoad';s.x=10;s.y=2;s.dir='up';render();action();
    windcutEntry=s.map==='windcutPass'&&!!MAPS.windcutPass;
    boundaryInteraction=windcutEntry;
    windcutSafeSpawn=s.x===10&&s.y===18&&!blocked(s.x,s.y);

    s.dialog=null;s.map='windcutPass';s.x=10;s.y=18;s.dir='up';render();
    const windBeforeY=s.y;move('up');
    windcutWalkable=s.map==='windcutPass'&&s.y===windBeforeY-1;

    /* Check the three non-boundary REQ-093 interactions directly. The north
       boundary itself may now be consumed by a later continuation requirement
       (REQ-105), so accepting a safe northRidgeApproach transition keeps this
       historical smoke focused on REQ-081/093 instead of rejecting valid growth. */
    const checks=[
      [7,17,'up','岩陰に残る靴跡'],
      [15,14,'up','風で傾いた古い道標'],
      [5,8,'up','谷を渡る遠い物音']
    ];
    windcutInteractions=checks.every(([x,y,dir,name])=>{
      s.dialog=null;s.map='windcutPass';s.x=x;s.y=y;s.dir=dir;render();action();
      const ok=!!s.dialog&&s.dialog.name===name;
      s.dialog=null;
      return ok;
    });

    s.dialog=null;s.map='windcutPass';s.x=10;s.y=2;s.dir='up';render();action();
    const legacyBoundary=!!s.dialog&&s.dialog.name==='北へ続く尾根道'&&s.map==='windcutPass';
    const continuedBoundary=s.map==='northRidgeApproach'&&!!MAPS.northRidgeApproach&&s.x===10&&s.y===18&&!blocked(s.x,s.y);
    windcutBoundarySafe=legacyBoundary||continuedBoundary;

    /* Restore Windcut explicitly before checking the canonical south return so
       a newer north continuation cannot leak state into the REQ-093 assertion. */
    s.dialog=null;s.map='windcutPass';s.x=10;s.y=18;s.dir='down';render();move('down');
    windcutReturnSafe=s.map==='northCliffRoad'&&s.x===10&&s.y===2&&!blocked(s.x,s.y);

    /* Preserve REQ-081's original south-return assertion independently. */
    s.dialog=null;s.map='northCliffRoad';s.x=10;s.y=16;s.dir='down';render();move('down');
    returnSafe=s.map==='evacRoute'&&s.x===14&&s.y===1&&!blocked(s.x,s.y);

    s.dialog=null;s.screen='world';s.map='windcutPass';s.x=10;s.y=18;s.dir='up';render();
    encounterReuse=encounterMap()===true&&enemyPool()===EVAC_ENEMIES;
    const persisted=JSON.parse(localStorage.getItem('lukeQuestV2')||'null');
    saveRoundTrip=!!persisted&&persisted.map==='windcutPass'&&persisted.x===10&&persisted.y===18;
    canonSafe=window.LQ_NORTH_CLIFF_ROAD_STATUS?.entryAuthority==='withdrawProofSeen'&&window.LQ_NORTH_CLIFF_ROAD_STATUS?.newRequiredStoryFlags===0&&window.LQ_NORTH_CLIFF_ROAD_STATUS?.protectedCanonChanged===false&&window.LQ_WINDCUT_PASS_STATUS?.newRequiredStoryFlags===0&&window.LQ_WINDCUT_PASS_STATUS?.protectedCanonChanged===false&&window.LQ_WINDCUT_PASS_STATUS?.interactionCount===4;

    if(!(blockedWithoutProof&&enteredWithProof&&safeSpawn&&walkable&&footprintInteraction&&boundaryInteraction&&returnSafe&&windcutEntry&&windcutSafeSpawn&&windcutWalkable&&windcutInteractions&&windcutBoundarySafe&&windcutReturnSafe&&encounterReuse&&saveRoundTrip&&canonSafe))throw new Error('REQ-081/093 assertion false');
  }catch(err){console.error('lqNorthCliffRuntimeSmokeFailure',err);failure(err&&err.message);}
  finally{
    stopMoving();Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);
    if(rawBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',rawBefore);
    render();
    marker({blockedWithoutProof,enteredWithProof,safeSpawn,walkable,footprintInteraction,boundaryInteraction,returnSafe,windcutEntry,windcutSafeSpawn,windcutWalkable,windcutInteractions,windcutBoundarySafe,windcutReturnSafe,encounterReuse,saveRoundTrip,canonSafe});
  }
},650);
})();
