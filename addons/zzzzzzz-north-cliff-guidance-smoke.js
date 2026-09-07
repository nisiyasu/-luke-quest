(() => {
'use strict';

/* REQ-083 browser acceptance + REQ-132 terminal closure regression.
   Reuses the existing 390x844 lqTouchSmoke gate, but must never mutate shared
   runtime state while the canonical REQ-001/021 input smoke is still active. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

function runReq083Smoke(){
  const snapshot=structuredClone(s);
  let entryObjective=false,footMarker=false,canonicalInteraction=false,northObjective=false,northMarker=false,footGone=false,outsideGone=false,chapter1CompleteGone=false,preCompletionRestored=false;
  try{
    stopMoving();
    s.flags={...(s.flags||{}),chapter1Complete:false};
    s.screen='world';s.map='northCliffRoad';s.x=7;s.y=15;s.dir='up';s.dialog=null;
    render();
    let shell=document.querySelector('.gameShell');
    const entryGuide=shell?.querySelector('.questGuide,.lqNorthCliffGuideFallback');
    entryObjective=!!entryGuide&&entryGuide.textContent.includes('新しい足跡');
    footMarker=!!shell?.querySelector('.lqNorthCliffQuestMark[data-target="footprints"]');

    action();
    canonicalInteraction=!!s.dialog&&s.dialog.kind==='lqNorthCliffFootprints'&&s.dialog.name==='新しい足跡';
    shell=document.querySelector('.gameShell');
    const northGuide=shell?.querySelector('.questGuide,.lqNorthCliffGuideFallback');
    northObjective=!!northGuide&&northGuide.textContent.includes('北へ曲がる崖道');
    northMarker=!!shell?.querySelector('.lqNorthCliffQuestMark[data-target="northBoundary"]');
    footGone=!!shell&&!shell.querySelector('.lqNorthCliffQuestMark[data-target="footprints"]');

    s.dialog=null;s.flags.chapter1Complete=true;render();
    shell=document.querySelector('.gameShell');
    chapter1CompleteGone=!!shell&&!shell.querySelector('.lqNorthCliffQuestMark')&&!shell.querySelector('.lqNorthCliffGuideFallback')&&!shell.querySelector('.lqNorthCliffObjective');

    s.flags.chapter1Complete=false;render();
    shell=document.querySelector('.gameShell');
    preCompletionRestored=!!shell&&!!shell.querySelector('.lqNorthCliffQuestMark[data-target="northBoundary"]')&&!!shell.querySelector('.lqNorthCliffObjective,.lqNorthCliffGuideFallback');

    s.map='evacRoute';s.x=14;s.y=1;s.dir='down';render();
    shell=document.querySelector('.gameShell');
    outsideGone=!!shell&&!shell.querySelector('.lqNorthCliffQuestMark')&&!shell.querySelector('.lqNorthCliffGuideFallback')&&!shell.querySelector('.lqNorthCliffObjective');

    const pass=entryObjective&&footMarker&&canonicalInteraction&&northObjective&&northMarker&&footGone&&chapter1CompleteGone&&preCompletionRestored&&outsideGone;
    if(!pass){
      const failure=document.createElement('i');failure.id='lqFloatingTouchSmokeFailure';failure.dataset.reason='REQ-083/132 north cliff guidance assertion false';failure.hidden=true;document.body.appendChild(failure);
    }

    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
    const marker=document.createElement('i');marker.id='lqNorthCliffGuidanceSmokeMarker';marker.hidden=true;
    marker.dataset.entryObjective=String(entryObjective);marker.dataset.footMarker=String(footMarker);marker.dataset.canonicalInteraction=String(canonicalInteraction);marker.dataset.northObjective=String(northObjective);marker.dataset.northMarker=String(northMarker);marker.dataset.footGone=String(footGone);marker.dataset.chapter1CompleteGone=String(chapter1CompleteGone);marker.dataset.preCompletionRestored=String(preCompletionRestored);marker.dataset.outsideGone=String(outsideGone);marker.dataset.req132='true';marker.dataset.serializedAfterCoreTouch='true';
    document.body.appendChild(marker);
  }catch(err){
    const failure=document.createElement('i');failure.id='lqFloatingTouchSmokeFailure';failure.dataset.reason='REQ-083/132 north cliff guidance smoke exception: '+String(err?.message||err);failure.hidden=true;document.body.appendChild(failure);
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
  }
}

let polls=0;
const waitForCoreTouch=setInterval(()=>{
  polls++;
  const core=document.getElementById('lqFloatingTouchRuntimeSmokeMarker');
  if(core){clearInterval(waitForCoreTouch);setTimeout(runReq083Smoke,40);return;}
  if(polls>=45){
    clearInterval(waitForCoreTouch);
    const failure=document.createElement('i');failure.id='lqFloatingTouchSmokeFailure';failure.dataset.reason='REQ-083/132 waited for canonical touch smoke marker but it never completed';failure.hidden=true;document.body.appendChild(failure);
  }
},40);
})();
