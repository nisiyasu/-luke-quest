(() => {
'use strict';

/* REQ-024 dedicated browser assertion. Runs only in existing ?lqSmoke=1 CI mode. */
if(typeof location==='undefined'||new URLSearchParams(location.search).get('lqSmoke')!=='1')return;

function run(){
  const snapshot=structuredClone(s);
  try{
    stopMoving();
    s.screen='world';s.map='town';s.x=12;s.y=6;s.dir='up';s.dialog=null;
    render();action();
    const entered=s.screen==='world'&&s.map==='aldiaHomeInterior'&&!!MAPS.aldiaHomeInterior;

    s.dialog=null;s.x=6;s.y=4;s.dir='up';render();action();
    const talked=!!s.dialog&&s.dialog.name==='暮らし上手のリナ';

    s.dialog=null;s.x=4;s.y=8;s.dir='down';checkGate();
    const exited=s.screen==='world'&&s.map==='town'&&s.x===12&&s.y===6;
    const registered=window.LQ_BUILDING_INTERIORS?.aldiaCivilianHome?.map==='aldiaHomeInterior';
    const noReward=window.LQ_CIVILIAN_HOME_STATUS?.rewardsAdded===false;
    const canonSafe=window.LQ_CIVILIAN_HOME_STATUS?.protectedCanonChanged===false;

    const marker=document.createElement('i');marker.id='lqCivilianHomeRuntimeSmokeMarker';marker.hidden=true;
    marker.dataset.entered=String(entered);marker.dataset.talked=String(talked);marker.dataset.exited=String(exited);marker.dataset.registered=String(registered);marker.dataset.noReward=String(noReward);marker.dataset.canonSafe=String(canonSafe);document.body.appendChild(marker);
    if(!(entered&&talked&&exited&&registered&&noReward&&canonSafe))throw new Error('REQ-024 civilian home assertion false');
  }catch(err){
    const fail=document.createElement('div');fail.id='lqRuntimeSmokeFailure';fail.textContent=String(err&&err.stack||err);document.body.appendChild(fail);
  }finally{
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
  }
}

if(document.readyState==='complete')setTimeout(run,80);else window.addEventListener('load',()=>setTimeout(run,80),{once:true});
})();
