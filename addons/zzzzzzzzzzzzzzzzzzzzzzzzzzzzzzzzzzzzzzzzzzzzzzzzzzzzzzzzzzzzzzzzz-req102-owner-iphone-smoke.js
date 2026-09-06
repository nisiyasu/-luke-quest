(() => {
'use strict';

/* REQ-102 fail-closed assembled-browser guard. Runs only under the existing
   390x844 lqTouchSmoke path and verifies that the late Owner hot-fix is actually
   present in the public assembled game. */

if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
  const marker=document.createElement('i');
  marker.id='lqReq102RuntimeSmokeMarker';
  marker.hidden=true;
  document.body.appendChild(marker);

  const status=window.LQ_REQ102_STATUS||{};
  const forest=typeof MAPS!=='undefined'&&MAPS.forest;
  const northTile=forest&&forest.tiles&&forest.tiles[17]&&forest.tiles[17][12];
  const northPassable=!!northTile&&!['#','H','~','*','^'].includes(northTile);
  const toggle=document.getElementById('lqTopHudToggle');
  const toggleButton=!!toggle&&toggle.tagName==='BUTTON'&&toggle.dataset.lqNoGlobalAction==='true';
  let toggleCycle=false;
  if(toggleButton){
    const before=document.body.classList.contains('lqReq102HudCollapsed');
    toggle.click();
    const middle=document.body.classList.contains('lqReq102HudCollapsed');
    toggle.click();
    const after=document.body.classList.contains('lqReq102HudCollapsed');
    toggleCycle=middle!==before&&after===before;
  }

  const portraitRoute=status.ownerDialogueImage==='assets/images/03334052-E944-4DE4-9C61-48F011193E46.png'&&status.ownerDialogueFaceCrop===true;
  const checks={
    forestNorthLane:northPassable&&status.forestEntryNorthLane===true,
    canonicalCollision:status.forestCanonicalCollisionPreserved===true,
    hudRestacked:status.topHudRestacked===true,
    hudToggle:status.topHudToggle===true&&toggleButton&&toggleCycle,
    toggleExcluded:status.toggleExcludedFromWorldAction===true,
    portraitRoute,
    noGeneratedSubstitute:status.generatedSubstitute===false
  };
  Object.entries(checks).forEach(([key,value])=>marker.dataset[key]=String(!!value));
  const failed=Object.entries(checks).find(([,value])=>!value);
  if(failed){
    const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');
    setTimeout(()=>{eval(`LQ_REQ102_SMOKE_FAIL_${key}()`);},0);
  }
},80);
})();
