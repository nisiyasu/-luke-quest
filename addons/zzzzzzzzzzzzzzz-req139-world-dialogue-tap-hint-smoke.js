(() => {
'use strict';

if(typeof location==='undefined')return;
const params=new URLSearchParams(location.search);
if(!params.has('lqReq139Smoke'))return;

setTimeout(()=>{
  const snapshot=structuredClone(s);
  const marker=document.createElement('i');
  marker.id='lqReq139WorldDialogueTapHintSmokeMarker';
  marker.hidden=true;
  try{
    stopMoving();
    s.screen='world';
    s.map='town';
    s.x=9;s.y=12;s.dir='up';
    s.dialog={name:'REQ-139',text:'dialogue hint probe'};
    render();

    const hint=document.querySelector('.gameShell .dialogBox .sub');
    const hintVisible=!!hint&&hint.textContent.trim()==='タップ / Aで閉じる';
    const markerApplied=!!hint&&hint.dataset.req139TapHint==='true';
    const status=window.LQ_REQ139_WORLD_DIALOGUE_TAP_HINT_STATUS||{};
    const presentationOnly=status.presentationOnly===true&&status.inputHandlersAdded===false&&status.canonicalActionChanged===false;

    if(typeof action!=='function')throw new Error('canonical action() missing');
    action();
    const canonicalClose=s.dialog===null;

    const pass=hintVisible&&markerApplied&&presentationOnly&&canonicalClose;
    marker.dataset.pass=String(pass);
    marker.dataset.hintVisible=String(hintVisible);
    marker.dataset.markerApplied=String(markerApplied);
    marker.dataset.presentationOnly=String(presentationOnly);
    marker.dataset.canonicalClose=String(canonicalClose);
    if(!pass)throw new Error('REQ-139 assertion false');
  }catch(err){
    marker.dataset.pass='false';
    marker.dataset.error=String(err&&err.message||err);
    console.error('LQ_REQ139_SMOKE_FAIL',err);
  }finally{
    Object.keys(s).forEach(k=>delete s[k]);
    Object.assign(s,snapshot);
    render();
    document.body.appendChild(marker);
  }
},180);
})();
