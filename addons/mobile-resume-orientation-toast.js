(() => {
'use strict';

const style=document.createElement('style');
style.textContent=`
.lqResumeOrientationToast{position:fixed;z-index:88;left:50%;top:max(calc(env(safe-area-inset-top) + 64px),72px);transform:translateX(-50%);width:min(88vw,420px);pointer-events:none!important;padding:8px 10px;border-radius:12px;border:1px solid #9cc7db45;background:linear-gradient(145deg,#071724f2,#0c2534f2);box-shadow:0 10px 30px #0008;color:#dbe8ef;opacity:1;transition:opacity .18s ease,transform .18s ease}.lqResumeOrientationToast *{pointer-events:none!important}.lqResumeOrientationKicker{display:flex;justify-content:space-between;gap:10px;color:#86acbd;font-size:6px;font-weight:950;letter-spacing:.12em}.lqResumeOrientationArea{color:#ffe69c;text-align:right}.lqResumeOrientationNow{margin-top:4px;font-size:8px;font-weight:850;line-height:1.45;color:#f0e6bd}.lqResumeOrientationNow b{margin-right:5px;color:#dfc45f;font-size:6px;letter-spacing:.1em}.lqResumeOrientationToast.hide{opacity:0;transform:translate(-50%,-5px)}@media(prefers-reduced-motion:reduce){.lqResumeOrientationToast{transition:none}}@media(max-width:390px){.lqResumeOrientationToast{top:max(calc(env(safe-area-inset-top) + 58px),64px);width:86vw;padding:7px 9px}.lqResumeOrientationNow{font-size:7px}}
`;
document.head.appendChild(style);

let hiddenAt=0,removeTimer=0,fadeTimer=0;
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function objective(state=s){
  const fn=window.LQ_ADVENTURE_JOURNAL_TEST?.mainGoal;
  if(typeof fn==='function')return String(fn(state)||'');
  const map=state?.map;
  return MAPS?.[map]?.name?`「${MAPS[map].name}」を探索する。`:'';
}
function clearToast(){
  clearTimeout(removeTimer);clearTimeout(fadeTimer);removeTimer=fadeTimer=0;
  document.querySelectorAll('.lqResumeOrientationToast').forEach(el=>el.remove());
}
function model(state=s){
  if(!state||state.screen!=='world')return null;
  const area=MAPS?.[state.map]?.name;if(!area)return null;
  const now=objective(state);if(!now)return null;
  return{area:String(area),now:String(now)};
}
function showNow(state=s,{autoHide=true}={}){
  const m=model(state);clearToast();if(!m)return null;
  const el=document.createElement('div');el.className='lqResumeOrientationToast';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.innerHTML=`<div class="lqResumeOrientationKicker"><span>RESUME</span><span class="lqResumeOrientationArea">${esc(m.area)}</span></div><div class="lqResumeOrientationNow"><b>NOW</b>${esc(m.now)}</div>`;
  document.body.appendChild(el);
  if(autoHide){fadeTimer=setTimeout(()=>el.classList.add('hide'),2200);removeTimer=setTimeout(()=>{if(el.isConnected)el.remove();},2500);}
  return el;
}
function onVisibility(){
  if(document.hidden){hiddenAt=Date.now();return;}
  if(!hiddenAt)return;
  hiddenAt=0;
  if(s?.screen==='world')showNow();else clearToast();
}
document.addEventListener('visibilitychange',onVisibility,{passive:true});

function fail(reason){
  const old=document.querySelector('.lqMobileResumeOrientationSmokeFailure');if(old)old.remove();
  const el=document.createElement('div');el.className='lqMobileResumeOrientationSmokeFailure';el.hidden=true;el.dataset.reason=String(reason);document.body.appendChild(el);
  throw new TypeError(`REQ-110 mobile resume orientation smoke failed: ${reason}`);
}
function assert(ok,reason){if(!ok)fail(reason);}
function smoke(){
  const original={map:s.map,screen:s.screen,flags:{...(s.flags||{})}};
  try{
    const storyBefore=JSON.stringify(s.flags||{}),saveBefore=window.LQ_SAVE_SCHEMA_VERSION||null;
    const mm=model({...s,screen:'world',map:'evacRoute'});
    assert(mm&&mm.area===MAPS.evacRoute.name,'canonical current area');
    const journalGoal=window.LQ_ADVENTURE_JOURNAL_TEST?.mainGoal?.({...s,screen:'world',map:'evacRoute'});
    assert(mm.now===String(journalGoal||''),'journal objective reuse');
    assert(model({...s,screen:'battle'})===null,'non-world suppression');
    s.screen='world';s.map='evacRoute';
    let el=showNow(s,{autoHide:false});
    assert(el&&document.querySelectorAll('.lqResumeOrientationToast').length===1,'single world resume toast');
    assert(/RESUME/.test(el.textContent)&&/NOW/.test(el.textContent),'resume semantics');
    assert(getComputedStyle(el).pointerEvents==='none','toast pointer safety');
    assert([...el.querySelectorAll('*')].every(n=>getComputedStyle(n).pointerEvents==='none'),'descendant pointer safety');
    el=showNow(s,{autoHide:false});assert(document.querySelectorAll('.lqResumeOrientationToast').length===1,'duplicate replacement');
    clearToast();assert(!document.querySelector('.lqResumeOrientationToast'),'cleanup');
    assert(JSON.stringify(s.flags||{})===storyBefore,'story state unchanged');
    assert((window.LQ_SAVE_SCHEMA_VERSION||null)===saveBefore,'save authority unchanged');
    assert(window.LQ_TAP_ANYWHERE_ACTION_STATUS||window.LQ_UNIFIED_WORLD_TOUCH_STATUS||window.LQ_FLOATING_TOUCH_STATUS,'P0 touch status present');
    assert(window.LQ_FULLSCREEN_WORLD_STATUS||document.querySelector('.gameShell'),'P0 fullscreen status present');
    const marker=document.createElement('div');marker.className='lqMobileResumeOrientationSmokeMarker';marker.hidden=true;marker.dataset.req110='true';marker.dataset.canonicalArea='true';marker.dataset.journalObjective='true';marker.dataset.pointerSafe='true';marker.dataset.noStack='true';marker.dataset.cleanup='true';document.body.appendChild(marker);
  } finally {
    clearToast();s.map=original.map;s.screen=original.screen;s.flags=original.flags;render();
  }
}

window.LQ_MOBILE_RESUME_ORIENTATION_STATUS={requirement:'REQ-110',presentationOnly:true,pointerAuthority:false,saveSchemaChange:false,iosPhysicalVerification:'PENDING'};
window.LQ_MOBILE_RESUME_ORIENTATION_TEST={model,showNow,clearToast,smoke};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
