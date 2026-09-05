(() => {
'use strict';

/* REQ-023 browser probe. Runs only in the already-CI-covered touch smoke mode. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
  const snapshot=structuredClone(s);
  let clueObjective=false,clueMarker=false,northObjective=false,northMarker=false,clueGone=false;
  try{
    stopMoving();
    s.screen='world';s.map='evacRoute';s.x=14;s.y=22;s.dialog=null;s.flags.withdrawProofSeen=false;
    render();
    let shell=document.querySelector('.gameShell');
    clueObjective=!!shell&&!!shell.querySelector('.questGuide')&&shell.querySelector('.questGuide').textContent.includes('撤収命令の切れ端');
    clueMarker=!!shell&&!!shell.querySelector('.lqCriticalClueMark[data-target="withdrawProof"]');

    s.flags.withdrawProofSeen=true;
    render();
    shell=document.querySelector('.gameShell');
    northObjective=!!shell&&!!shell.querySelector('.questGuide')&&shell.querySelector('.questGuide').textContent.includes('北端へ戻り');
    northMarker=!!shell&&!!shell.querySelector('.lqNextExitMark[data-target="northExit"]');
    clueGone=!!shell&&!shell.querySelector('.lqCriticalClueMark');

    const pass=clueObjective&&clueMarker&&northObjective&&northMarker&&clueGone;
    if(!pass){
      const failure=document.createElement('i');failure.id='lqFloatingTouchSmokeFailure';failure.dataset.reason='REQ-023 evacuation guidance browser assertion false';failure.hidden=true;document.body.appendChild(failure);
    }

    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
    const marker=document.createElement('i');marker.id='lqEvacGuidanceSmokeMarker';marker.hidden=true;
    marker.dataset.clueObjective=String(clueObjective);marker.dataset.clueMarker=String(clueMarker);marker.dataset.northObjective=String(northObjective);marker.dataset.northMarker=String(northMarker);marker.dataset.clueGone=String(clueGone);
    document.body.appendChild(marker);
  }catch(err){
    const failure=document.createElement('i');failure.id='lqFloatingTouchSmokeFailure';failure.dataset.reason='REQ-023 evacuation guidance smoke exception';failure.hidden=true;document.body.appendChild(failure);
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
  }
},120);
})();
