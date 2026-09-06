(() => {
'use strict';

/* REQ-121 assembled-browser progression acceptance.
   Runs as a dedicated probe, and late in the existing lqSmoke regression so
   failures are surfaced by the already-canonical browser runtime error gate. */
if(typeof location==='undefined')return;
const qs=new URLSearchParams(location.search);
const dedicated=qs.has('lqReq121Smoke');
const integrated=qs.has('lqSmoke');
if(!dedicated&&!integrated)return;

function marker(data){
  const el=document.createElement('i');el.id='lqReq121TransitionSmokeMarker';
  Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));el.hidden=true;document.body.appendChild(el);return el;
}
function failure(reason){
  const el=document.createElement('i');el.id='lqReq121TransitionSmokeFailure';el.dataset.reason=String(reason||'unknown');el.hidden=true;document.body.appendChild(el);return el;
}
function walkable(mapId,x,y){
  const m=MAPS[mapId], row=m?.tiles?.[y]||'', c=row[x];
  return !!m&&x>=0&&y>=0&&x<m.w&&y<m.h&&c!==undefined&&c!=='#'&&c!=='^';
}

setTimeout(()=>{
  const snapshot=structuredClone(s);
  let reached=false,safeSpawn=false,noFlag=false,returned=false,returnSafe=false,statusContract=false;
  let deferredError=null;
  try{
    stopMoving();
    const beforeFlags=JSON.stringify(s.flags||{});
    s.screen='world';s.map='cloudbreakSaddle';s.x=10;s.y=2;s.dir='up';s.dialog=null;render();
    action();
    reached=s.map==='windStairRidge';
    safeSpawn=reached&&s.x===11&&s.y===18&&walkable('windStairRidge',s.x,s.y);
    noFlag=JSON.stringify(s.flags||{})===beforeFlags;

    s.dialog=null;s.screen='world';s.map='windStairRidge';s.x=10;s.y=17;s.dir='down';render();
    action();
    returned=s.map==='cloudbreakSaddle';
    returnSafe=returned&&s.x===10&&s.y===2&&walkable('cloudbreakSaddle',s.x,s.y);

    const st=window.LQ_REQ121_TRANSITION_STATUS;
    statusContract=!!st&&st.from==='cloudbreakSaddle'&&st.to==='windStairRidge'&&st.boundaryKind==='lqCloudbreakBoundary'&&st.returnKind==='lqWindStairReturn'&&st.canonicalAction===true&&st.saveSchemaChanged===false&&st.newRequiredStoryFlags===0;
    if(!(reached&&safeSpawn&&noFlag&&returned&&returnSafe&&statusContract))throw new Error(JSON.stringify({reached,safeSpawn,noFlag,returned,returnSafe,statusContract,map:s.map,x:s.x,y:s.y}));
  }catch(err){
    console.error('lqReq121TransitionSmokeFailure',err);
    deferredError=new TypeError(`REQ-121 transition smoke failed: ${err&&err.message}`);
  }finally{
    stopMoving();Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
    const data={reached,safeSpawn,noFlag,returned,returnSafe,statusContract};
    if(deferredError){failure(deferredError.message);marker(data);setTimeout(()=>{throw deferredError;},0);}else marker(data);
  }
},dedicated?700:5000);
})();
