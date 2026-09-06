(() => {
'use strict';

/* REQ-081 dedicated assembled-browser acceptance. Inert outside explicit probe. */
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
  let blockedWithoutProof=false,enteredWithProof=false,safeSpawn=false,walkable=false,footprintInteraction=false,boundaryInteraction=false,returnSafe=false,saveRoundTrip=false,canonSafe=false;
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

    s.dialog=null;s.map='northCliffRoad';s.x=10;s.y=2;s.dir='up';render();action();
    boundaryInteraction=!!s.dialog&&s.dialog.name==='北へ曲がる崖道';

    s.dialog=null;s.map='northCliffRoad';s.x=10;s.y=16;s.dir='down';render();move('down');
    returnSafe=s.map==='evacRoute'&&s.x===14&&s.y===1&&!blocked(s.x,s.y);

    s.dialog=null;s.screen='world';s.map='northCliffRoad';s.x=10;s.y=16;s.dir='up';render();
    const persisted=JSON.parse(localStorage.getItem('lukeQuestV2')||'null');
    saveRoundTrip=!!persisted&&persisted.map==='northCliffRoad'&&persisted.x===10&&persisted.y===16;
    canonSafe=window.LQ_NORTH_CLIFF_ROAD_STATUS?.entryAuthority==='withdrawProofSeen'&&window.LQ_NORTH_CLIFF_ROAD_STATUS?.newRequiredStoryFlags===0&&window.LQ_NORTH_CLIFF_ROAD_STATUS?.protectedCanonChanged===false;

    if(!(blockedWithoutProof&&enteredWithProof&&safeSpawn&&walkable&&footprintInteraction&&boundaryInteraction&&returnSafe&&saveRoundTrip&&canonSafe))throw new Error('REQ-081 assertion false');
  }catch(err){console.error('lqNorthCliffRuntimeSmokeFailure',err);failure(err&&err.message);}
  finally{
    stopMoving();Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);
    if(rawBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',rawBefore);
    render();
    marker({blockedWithoutProof,enteredWithProof,safeSpawn,walkable,footprintInteraction,boundaryInteraction,returnSafe,saveRoundTrip,canonSafe});
  }
},650);
})();
