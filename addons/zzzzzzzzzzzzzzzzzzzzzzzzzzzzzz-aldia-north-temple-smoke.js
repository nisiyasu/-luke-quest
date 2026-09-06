(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;
setTimeout(()=>{
 const status=window.LQ_NORTH_TEMPLE_STATUS,map=MAPS?.aldiaNorthTemple,entry=status?.entry,exit=status?.exit;
 let marker=document.getElementById('lqNorthTempleSmokeMarker');
 if(!marker){marker=document.createElement('i');marker.id='lqNorthTempleSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
 const townDoor=(MAPS?.town?.npcs||[]).filter(n=>n.kind==='lqNorthTempleDoor');
 const kinds=new Set((map?.npcs||[]).map(n=>n.kind));
 const exitTile=map?.tiles?.[9]?.[5];
 const townReturnTile=MAPS?.town?.tiles?.[exit?.y]?.[exit?.x];
 const data={
  status:!!status,
  mapExists:!!map&&map.w===12&&map.h===10,
  walkable:status?.walkable===true,
  uniqueDoor:townDoor.length===1&&townDoor[0].x===entry?.x&&townDoor[0].y===entry?.y,
  entryReachable:MAPS?.town?.tiles?.[entry?.y]?.[entry?.x]==='.',
  interactions:kinds.has('lqTempleAttendant')&&kinds.has('lqTempleCrystal')&&kinds.has('lqTempleProp'),
  exitGate:exitTile==='G',
  safeReturn:townReturnTile==='.',
  noReward:status?.rewardsAdded===false&&status?.healingAdded===false,
  canonSafe:status?.protectedCanonChanged===false,
  canonicalAction:status?.canonicalAction===true,
  buildingRegistry:window.LQ_BUILDING_INTERIORS?.aldiaNorthTemple?.map==='aldiaNorthTemple'
 };
 Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
 const failed=Object.entries(data).find(([,v])=>!v);
 if(failed){const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');setTimeout(()=>{eval(`LQ_REQ054_NORTH_TEMPLE_FAIL_${key}()`);},0);}
},470);
})();
