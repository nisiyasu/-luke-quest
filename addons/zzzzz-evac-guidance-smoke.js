(() => {
'use strict';

/* REQ-023 browser probe. Runs only in the already-CI-covered touch smoke mode.
   The critical progression proof must be earned through canonical action(),
   not by the test directly writing withdrawProofSeen. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
  const snapshot=structuredClone(s);
  let clueObjective=false,clueMarker=false,optionalClueNoProgress=false,canonicalActionProgress=false,northObjective=false,northMarker=false,clueGone=false;
  try{
    stopMoving();
    s.screen='world';s.map='evacRoute';s.x=14;s.y=22;s.dialog=null;s.flags.withdrawProofSeen=false;s.flags.escapeProofSeen=false;
    render();
    let shell=document.querySelector('.gameShell');
    clueObjective=!!shell&&!!shell.querySelector('.questGuide')&&shell.querySelector('.questGuide').textContent.includes('撤収命令の切れ端');
    clueMarker=!!shell&&!!shell.querySelector('.lqCriticalClueMark[data-target="withdrawProof"]');

    if(typeof action!=='function')throw new Error('canonical action authority missing');

    s.x=20;s.y=8;s.dir='up';s.dialog=null;s.flags.withdrawProofSeen=false;s.flags.escapeProofSeen=false;
    render();
    action();
    optionalClueNoProgress=s.flags.escapeProofSeen===true&&s.flags.withdrawProofSeen===false;
    s.dialog=null;

    s.x=6;s.y=18;s.dir='up';s.dialog=null;s.flags.withdrawProofSeen=false;
    render();
    action();
    canonicalActionProgress=s.flags.withdrawProofSeen===true;

    s.dialog=null;
    render();
    shell=document.querySelector('.gameShell');
    northObjective=!!shell&&!!shell.querySelector('.questGuide')&&shell.querySelector('.questGuide').textContent.includes('北端へ戻り');
    northMarker=!!shell&&!!shell.querySelector('.lqNextExitMark[data-target="northExit"]');
    clueGone=!!shell&&!shell.querySelector('.lqCriticalClueMark');

    const data={clueObjective,clueMarker,optionalClueNoProgress,canonicalActionProgress,northObjective,northMarker,clueGone,escapeProofSeen:s.flags.escapeProofSeen,withdrawProofSeen:s.flags.withdrawProofSeen,map:s.map,x:s.x,y:s.y,dir:s.dir};
    const pass=clueObjective&&clueMarker&&optionalClueNoProgress&&canonicalActionProgress&&northObjective&&northMarker&&clueGone;
    if(!pass){
      console.error('LQ_REQ023_SMOKE_FAIL',JSON.stringify(data));
      const failure=document.createElement('i');failure.id='lqFloatingTouchSmokeFailure';failure.dataset.reason='REQ-023 evacuation canonical-action assertion false';Object.entries(data).forEach(([k,v])=>failure.dataset[k]=String(v));failure.hidden=true;document.body.appendChild(failure);
    }

    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
    const marker=document.createElement('i');marker.id='lqEvacGuidanceSmokeMarker';marker.hidden=true;
    Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(v));
    document.body.appendChild(marker);
  }catch(err){
    console.error('LQ_REQ023_SMOKE_EXCEPTION',err);
    const failure=document.createElement('i');failure.id='lqFloatingTouchSmokeFailure';failure.dataset.reason='REQ-023 evacuation guidance smoke exception: '+String(err&&err.message||err);failure.hidden=true;document.body.appendChild(failure);
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
  }
},120);
})();
