(() => {
'use strict';

function fail(reason){
  const old=document.querySelector('.lqReq133SmokeFailure');if(old)old.remove();
  const el=document.createElement('div');el.className='lqReq133SmokeFailure';el.hidden=true;el.dataset.reason=String(reason);document.body.appendChild(el);
  throw new TypeError(`REQ-133 upper pursuit guidance smoke failed: ${reason}`);
}
function assert(ok,reason){if(!ok)fail(reason);}
const cases=[
  {map:'windShelf',guide:'.lqWindShelfGuide',marker:'.lqWindShelfMarker'},
  {map:'skylineTraverse',guide:'.lqSkylineGuide',marker:'.lqSkylineMarker'},
  {map:'cloudbreakSaddle',guide:'.lqCloudbreakGuide',marker:'.lqCloudbreakMarker'}
];
function run(){
  const snap={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,flags:{...(s.flags||{})},dialog:s.dialog,pauseOpen:s.pauseOpen};
  try{
    assert(window.LQ_REQ133_UPPER_GUIDANCE_GUARD,'terminal guard loaded');
    for(const c of cases){
      assert(MAPS?.[c.map],`map exists ${c.map}`);
      s.screen='world';s.map=c.map;s.x=10;s.y=18;s.dir='up';s.dialog=null;s.pauseOpen=false;
      s.flags={...(s.flags||{}),chapter1Complete:false};
      render();
      assert(document.querySelector(c.guide),`pre-completion guide ${c.map}`);
      assert(document.querySelector(c.marker),`pre-completion marker ${c.map}`);
      s.flags.chapter1Complete=true;
      render();
      assert(!document.querySelector(c.guide),`terminal guide cleanup ${c.map}`);
      assert(!document.querySelector(c.marker),`terminal marker cleanup ${c.map}`);
      s.flags.chapter1Complete=false;
      render();
      assert(document.querySelector(c.guide),`unfinished-state guide restoration ${c.map}`);
      assert(document.querySelector(c.marker),`unfinished-state marker restoration ${c.map}`);
    }
    const ok=document.createElement('div');ok.className='lqReq133SmokeMarker';ok.hidden=true;
    ok.dataset.req133='true';ok.dataset.terminalSuppression='true';ok.dataset.unfinishedRestore='true';ok.dataset.maps='windShelf,skylineTraverse,cloudbreakSaddle';document.body.appendChild(ok);
  } finally {
    s.screen=snap.screen;s.map=snap.map;s.x=snap.x;s.y=snap.y;s.dir=snap.dir;s.flags=snap.flags;s.dialog=snap.dialog;s.pauseOpen=snap.pauseOpen;render();
  }
}
window.LQ_REQ133_UPPER_GUIDANCE_TEST={run,cases};
if(new URLSearchParams(location.search).has('lqSmoke'))setTimeout(run,2200);
})();
