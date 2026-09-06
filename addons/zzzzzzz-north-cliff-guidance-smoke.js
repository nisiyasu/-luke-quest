(() => {
'use strict';

/* REQ-083 browser acceptance. Reuses the existing 390x844 lqTouchSmoke gate. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

setTimeout(()=>{
  const snapshot=structuredClone(s);
  let entryObjective=false,footMarker=false,canonicalInteraction=false,northObjective=false,northMarker=false,footGone=false,outsideGone=false;
  try{
    stopMoving();
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

    s.dialog=null;s.map='evacRoute';s.x=14;s.y=1;s.dir='down';render();
    shell=document.querySelector('.gameShell');
    outsideGone=!!shell&&!shell.querySelector('.lqNorthCliffQuestMark')&&!shell.querySelector('.lqNorthCliffGuideFallback');

    const pass=entryObjective&&footMarker&&canonicalInteraction&&northObjective&&northMarker&&footGone&&outsideGone;
    if(!pass){
      const failure=document.createElement('i');failure.id='lqFloatingTouchSmokeFailure';failure.dataset.reason='REQ-083 north cliff local guidance assertion false';failure.hidden=true;document.body.appendChild(failure);
    }

    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
    const marker=document.createElement('i');marker.id='lqNorthCliffGuidanceSmokeMarker';marker.hidden=true;
    marker.dataset.entryObjective=String(entryObjective);marker.dataset.footMarker=String(footMarker);marker.dataset.canonicalInteraction=String(canonicalInteraction);marker.dataset.northObjective=String(northObjective);marker.dataset.northMarker=String(northMarker);marker.dataset.footGone=String(footGone);marker.dataset.outsideGone=String(outsideGone);
    document.body.appendChild(marker);
  }catch(err){
    const failure=document.createElement('i');failure.id='lqFloatingTouchSmokeFailure';failure.dataset.reason='REQ-083 north cliff guidance smoke exception: '+String(err?.message||err);failure.hidden=true;document.body.appendChild(failure);
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
  }
},420);
})();
