(() => {
'use strict';

const NORTH_ROUTE_IDS=['evacRoute','northCliffRoad','windcutPass','northRidgeApproach','windShelf','skylineTraverse','cloudbreakSaddle'];
const ROUTE_COPY={
  evacRoute:{forward:'北端の出口へ戻る',back:'南端から監視区域へ戻れる'},
  northCliffRoad:{forward:'北側の痕跡を追う',back:'南側へ戻れば退避路'},
  windcutPass:{forward:'北へ続く尾根道を探す',back:'南へ戻れば崖道'},
  northRidgeApproach:{forward:'北側の岩棚を確認する',back:'南へ戻れば風切り峠'},
  windShelf:{forward:'北へ続く細道を確認する',back:'南へ戻れば岩棚道'},
  skylineTraverse:{forward:'さらに高みへ折れる踏み跡を追う',back:'南へ戻れば風蝕の岩棚'},
  cloudbreakSaddle:{forward:'北側の石段跡を確認する',back:'南へ戻れば雲裂きの稜線'}
};

const style=document.createElement('style');
style.textContent=`
.lqNorthRouteCompass{pointer-events:none!important;margin:7px 0 9px;padding:8px;border:1px solid #86b8cf38;border-radius:10px;background:linear-gradient(145deg,#071824,#0d2432);box-shadow:inset 0 1px #ffffff08}
.lqNorthRouteCompass *{pointer-events:none!important}.lqNorthRouteCompassTitle{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:7px;color:#9dc6d8;font-size:6px;font-weight:950;letter-spacing:.15em}.lqNorthRouteCompassArea{color:#fff0b0;font-size:8px;letter-spacing:.03em;text-align:right}.lqNorthRouteCompassRows{display:grid;gap:4px}.lqNorthRouteCompassRow{display:grid;grid-template-columns:52px 1fr;gap:7px;padding:5px 6px;border-radius:7px;background:#06131d;border:1px solid #ffffff0b;color:#c8d8e1;font-size:7px;line-height:1.45}.lqNorthRouteCompassRow b{color:#7faabd;font-size:6px;letter-spacing:.09em}.lqNorthRouteCompassRow.now{border-color:#d9bc5f3d;background:linear-gradient(135deg,#201b0e,#071824);color:#f2e5b5;font-size:8px;font-weight:850}.lqNorthRouteCompassRow.now b{color:#f0d778}@media(max-width:390px){.lqNorthRouteCompass{padding:7px}.lqNorthRouteCompassRow{grid-template-columns:46px 1fr;font-size:7px}.lqNorthRouteCompassRow.now{font-size:8px}}
`;
document.head.appendChild(style);

function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function canonicalGoal(state){
  const fn=window.LQ_ADVENTURE_JOURNAL_TEST?.mainGoal;
  return typeof fn==='function'?String(fn(state)||''):'';
}
function model(state=s){
  const id=state?.map;
  if(!NORTH_ROUTE_IDS.includes(id)||!MAPS?.[id])return null;
  const area=String(MAPS[id].name||id);
  const flags=state?.flags||{};
  if(id==='evacRoute'){
    if(!flags.withdrawProofSeen)return{map:id,area,now:'左下に残された撤収命令の切れ端を調べる。',forward:'まず退避路内の必須手掛かりを確認する',back:'南端から監視区域へ戻れる'};
    return{map:id,area,now:'撤収命令を確認した。北端の出口へ戻り、レオンの足跡を追う。',forward:ROUTE_COPY[id].forward,back:ROUTE_COPY[id].back};
  }
  const now=canonicalGoal(state);
  if(!now)return null;
  return{map:id,area,now,forward:ROUTE_COPY[id].forward,back:ROUTE_COPY[id].back};
}

function card(m){
  return `<div class="lqNorthRouteCompass" data-lq-north-route-compass="true"><div class="lqNorthRouteCompassTitle"><span>NORTH ROUTE COMPASS</span><span class="lqNorthRouteCompassArea">${esc(m.area)}</span></div><div class="lqNorthRouteCompassRows"><div class="lqNorthRouteCompassRow"><b>CURRENT</b><span>${esc(m.area)}</span></div><div class="lqNorthRouteCompassRow now"><b>NOW</b><span>${esc(m.now)}</span></div><div class="lqNorthRouteCompassRow"><b>FORWARD</b><span>${esc(m.forward)}</span></div><div class="lqNorthRouteCompassRow"><b>BACK</b><span>${esc(m.back)}</span></div></div></div>`;
}

function sync(){
  document.querySelectorAll('.lqNorthRouteCompass').forEach((el,i)=>{if(i>0)el.remove();});
  if(!s?.pauseOpen||s?.screen!=='world'){
    document.querySelectorAll('.lqNorthRouteCompass').forEach(el=>el.remove());
    return;
  }
  const panel=app?.querySelector?.('.lqPausePanel');
  const journal=panel?.querySelector?.('.lqAdventureJournalSection');
  const m=model();
  if(!panel||!journal||!m){document.querySelectorAll('.lqNorthRouteCompass').forEach(el=>el.remove());return;}
  const existing=journal.querySelector('.lqNorthRouteCompass');
  if(existing){existing.outerHTML=card(m);return;}
  const main=journal.querySelector('.lqJournalBlock.main');
  if(main)main.insertAdjacentHTML('afterend',card(m));
  else journal.insertAdjacentHTML('beforeend',card(m));
}
function defer(){queueMicrotask(sync);}
const priorWorld=world;world=function(){const r=priorWorld.apply(this,arguments);defer();return r;};
const priorRender=render;render=function(){const r=priorRender.apply(this,arguments);defer();return r;};

function fail(reason){
  const old=document.querySelector('.lqNorthRouteCompassSmokeFailure');if(old)old.remove();
  const el=document.createElement('div');el.className='lqNorthRouteCompassSmokeFailure';el.hidden=true;el.dataset.reason=String(reason);document.body.appendChild(el);
  throw new TypeError(`REQ-109 North-route compass smoke failed: ${reason}`);
}
function assert(ok,reason){if(!ok)fail(reason);}
function smoke(){
  const snapshot={map:s.map,flags:{...(s.flags||{})},screen:s.screen,pauseOpen:s.pauseOpen};
  try{
    assert(NORTH_ROUTE_IDS.every(id=>ROUTE_COPY[id]),'registry coverage');
    assert(model({...s,map:'town',flags:{...(s.flags||{})}})===null,'unrelated map suppression');
    const evacBefore=model({...s,map:'evacRoute',flags:{...(s.flags||{}),withdrawProofSeen:false}});
    const evacAfter=model({...s,map:'evacRoute',flags:{...(s.flags||{}),withdrawProofSeen:true}});
    assert(evacBefore&&evacBefore.area===MAPS.evacRoute.name,'canonical evacuation area');
    assert(/撤収命令/.test(evacBefore.now)&&!/北端の出口へ戻/.test(evacBefore.now),'evac clue-first guidance');
    assert(/北端の出口/.test(evacAfter.now)&&/北端/.test(evacAfter.forward),'evac post-proof north guidance');
    for(const id of ['northCliffRoad','cloudbreakSaddle']){
      const mm=model({...s,map:id,flags:{...(s.flags||{}),withdrawProofSeen:true}});
      assert(mm&&mm.now===canonicalGoal({...s,map:id,flags:{...(s.flags||{}),withdrawProofSeen:true}}),'journal objective reuse '+id);
    }
    const futureNames=NORTH_ROUTE_IDS.map(id=>MAPS?.[id]?.name).filter(Boolean);
    for(const id of NORTH_ROUTE_IDS){
      const mm=model({...s,map:id,flags:{...(s.flags||{}),withdrawProofSeen:true}});if(!mm)continue;
      const later=futureNames.filter(name=>name!==mm.area);
      assert(!later.some(name=>String(mm.forward).includes(name)),'future map-name leak '+id);
    }
    s.screen='world';s.pauseOpen=true;s.map='cloudbreakSaddle';s.flags={...(s.flags||{}),withdrawProofSeen:true};
    render();sync();
    const panel=app.querySelector('.lqPausePanel'),journal=panel?.querySelector('.lqAdventureJournalSection'),compass=journal?.querySelector('.lqNorthRouteCompass');
    assert(panel&&journal&&compass,'pause journal compass DOM');
    assert(journal.querySelectorAll('.lqNorthRouteCompass').length===1,'single compass DOM');
    assert(/CURRENT/.test(compass.textContent)&&/NOW/.test(compass.textContent)&&/FORWARD/.test(compass.textContent)&&/BACK/.test(compass.textContent),'semantic rows');
    assert(getComputedStyle(compass).pointerEvents==='none','compass pointer safety');
    assert([...compass.querySelectorAll('*')].every(el=>getComputedStyle(el).pointerEvents==='none'),'decorative pointer safety');
    assert(panel.querySelector('.lqPauseButtons'),'pause buttons preserved');
    sync();assert(journal.querySelectorAll('.lqNorthRouteCompass').length===1,'repeat render dedupe');
    s.map='town';sync();assert(!app.querySelector('.lqNorthRouteCompass'),'unrelated map stale cleanup');
    s.map='cloudbreakSaddle';s.pauseOpen=false;sync();assert(!app.querySelector('.lqNorthRouteCompass'),'pause close stale cleanup');
    assert(window.LQ_TAP_ANYWHERE_ACTION_STATUS||window.LQ_UNIFIED_WORLD_TOUCH_STATUS||window.LQ_FLOATING_TOUCH_STATUS,'P0 touch status present');
    assert(window.LQ_FULLSCREEN_WORLD_STATUS||document.querySelector('.gameShell'),'P0 fullscreen status present');
    const marker=document.createElement('div');marker.className='lqNorthRouteCompassSmokeMarker';marker.hidden=true;marker.dataset.req109='true';marker.dataset.registry='true';marker.dataset.evacBefore='true';marker.dataset.evacAfter='true';marker.dataset.dom='true';marker.dataset.pointerSafe='true';marker.dataset.noStale='true';document.body.appendChild(marker);
  } finally {
    s.map=snapshot.map;s.flags=snapshot.flags;s.screen=snapshot.screen;s.pauseOpen=snapshot.pauseOpen;render();
  }
}

window.LQ_NORTH_ROUTE_COMPASS_STATUS={requirement:'REQ-109',maps:[...NORTH_ROUTE_IDS],journalOnly:true,noSaveSchemaChange:true,noWorldPointerAuthority:true,iosPhysicalVerification:'PENDING'};
window.LQ_NORTH_ROUTE_COMPASS_TEST={model,sync,smoke,routeIds:[...NORTH_ROUTE_IDS]};
setTimeout(()=>{defer();if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
