(() => {
'use strict';

/* REQ-023 browser probe. Runs only in the already-CI-covered touch smoke mode.
   The critical progression proof must now be earned through canonical action(),
   not by the test directly writing withdrawProofSeen. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
  const snapshot=structuredClone(s);
  let clueObjective=false,clueMarker=false,canonicalActionProgress=false,northObjective=false,northMarker=false,clueGone=false;
  try{
    stopMoving();
    s.screen='world';s.map='evacRoute';s.x=14;s.y=22;s.dialog=null;s.flags.withdrawProofSeen=false;
    render();
    let shell=document.querySelector('.gameShell');
    clueObjective=!!shell&&!!shell.querySelector('.questGuide')&&shell.querySelector('.questGuide').textContent.includes('撤収命令の切れ端');
    clueMarker=!!shell&&!!shell.querySelector('.lqCriticalClueMark[data-target="withdrawProof"]');

    if(typeof action!=='function')throw new Error('canonical action authority missing');
    // withdrawProof is canonical tile (6,17); face it from the walkable tile directly south.
    s.x=6;s.y=18;s.dir='up';s.dialog=null;s.flags.withdrawProofSeen=false;
    render();
    action();
    canonicalActionProgress=s.flags.withdrawProofSeen===true;

    // The interaction may open dialogue. Close only presentation state so the
    // post-proof objective can be inspected without invoking a second action.
    s.dialog=null;
    render();
    shell=document.querySelector('.gameShell');
    northObjective=!!shell&&!!shell.querySelector('.questGuide')&&shell.querySelector('.questGuide').textContent.includes('北端へ戻り');
    northMarker=!!shell&&!!shell.querySelector('.lqNextExitMark[data-target="northExit"]');
    clueGone=!!shell&&!shell.querySelector('.lqCriticalClueMark');

    const pass=clueObjective&&clueMarker&&canonicalActionProgress&&northObjective&&northMarker&&clueGone;
    if(!pass){
      const failure=document.createElement('i');failure.id='lqFloatingTouchSmokeFailure';failure.dataset.reason='REQ-023 evacuation canonical-action assertion false';failure.hidden=true;document.body.appendChild(failure);
    }

    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
    const marker=document.createElement('i');marker.id='lqEvacGuidanceSmokeMarker';marker.hidden=true;
    marker.dataset.clueObjective=String(clueObjective);marker.dataset.clueMarker=String(clueMarker);marker.dataset.canonicalActionProgress=String(canonicalActionProgress);marker.dataset.northObjective=String(northObjective);marker.dataset.northMarker=String(northMarker);marker.dataset.clueGone=String(clueGone);
    document.body.appendChild(marker);
  }catch(err){
    const failure=document.createElement('i');failure.id='lqFloatingTouchSmokeFailure';failure.dataset.reason='REQ-023 evacuation guidance smoke exception: '+String(err&&err.message||err);failure.hidden=true;document.body.appendChild(failure);
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
  }
},120);
})();
