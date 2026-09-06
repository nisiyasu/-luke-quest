(() => {
'use strict';

/* REQ-094 browser acceptance. Serialize after REQ-083 so shared runtime state is
   never mutated while canonical touch or north-cliff guidance probes are active. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;

function fail(reason){
  if(document.getElementById('lqFloatingTouchSmokeFailure'))return;
  const el=document.createElement('i');el.id='lqFloatingTouchSmokeFailure';el.dataset.reason=reason;el.hidden=true;document.body.appendChild(el);
}

function runReq094Smoke(){
  const snapshot=structuredClone(s);
  let entryObjective=false,footMarker=false,canonicalInteraction=false,northObjective=false,northMarker=false,footGone=false,outsideGone=false,authoritySafe=false;
  try{
    stopMoving();
    s.screen='world';s.map='windcutPass';s.x=7;s.y=17;s.dir='up';s.dialog=null;
    render();
    let shell=document.querySelector('.gameShell');
    const entryGuide=shell?.querySelector('.questGuide,.lqWindcutGuideFallback');
    entryObjective=!!entryGuide&&entryGuide.textContent.includes('岩陰に残る靴跡');
    footMarker=!!shell?.querySelector('.lqWindcutQuestMark[data-target="footprints"]');

    action();
    canonicalInteraction=!!s.dialog&&s.dialog.kind==='lqWindcutFootprints'&&s.dialog.name==='岩陰に残る靴跡';
    shell=document.querySelector('.gameShell');
    const northGuide=shell?.querySelector('.questGuide,.lqWindcutGuideFallback');
    northObjective=!!northGuide&&northGuide.textContent.includes('北へ続く尾根道');
    northMarker=!!shell?.querySelector('.lqWindcutQuestMark[data-target="northBoundary"]');
    footGone=!!shell&&!shell.querySelector('.lqWindcutQuestMark[data-target="footprints"]');
    authoritySafe=window.LQ_WINDCUT_GUIDANCE_STATUS?.runtimeOnly===true&&window.LQ_WINDCUT_GUIDANCE_STATUS?.saveSemanticsChanged===false&&window.LQ_WINDCUT_GUIDANCE_STATUS?.gameplayLogicChanged===false;

    s.dialog=null;s.map='northCliffRoad';s.x=10;s.y=2;s.dir='down';render();
    shell=document.querySelector('.gameShell');
    outsideGone=!!shell&&!shell.querySelector('.lqWindcutQuestMark')&&!shell.querySelector('.lqWindcutGuideFallback');

    if(!(entryObjective&&footMarker&&canonicalInteraction&&northObjective&&northMarker&&footGone&&outsideGone&&authoritySafe))fail('REQ-094 Windcut local guidance assertion false');
  }catch(err){
    fail('REQ-094 Windcut guidance smoke exception: '+String(err?.message||err));
  }finally{
    stopMoving();Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
    const marker=document.createElement('i');marker.id='lqWindcutGuidanceSmokeMarker';marker.hidden=true;
    marker.dataset.entryObjective=String(entryObjective);marker.dataset.footMarker=String(footMarker);marker.dataset.canonicalInteraction=String(canonicalInteraction);marker.dataset.northObjective=String(northObjective);marker.dataset.northMarker=String(northMarker);marker.dataset.footGone=String(footGone);marker.dataset.outsideGone=String(outsideGone);marker.dataset.authoritySafe=String(authoritySafe);marker.dataset.serializedAfterNorthCliffGuidance='true';
    document.body.appendChild(marker);
  }
}

let polls=0;
const wait=setInterval(()=>{
  polls++;
  if(document.getElementById('lqNorthCliffGuidanceSmokeMarker')){clearInterval(wait);setTimeout(runReq094Smoke,40);return;}
  if(polls>=80){clearInterval(wait);fail('REQ-094 waited for REQ-083 smoke marker but it never completed');}
},40);
})();
