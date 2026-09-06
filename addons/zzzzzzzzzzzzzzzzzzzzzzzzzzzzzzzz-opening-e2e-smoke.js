(() => {
'use strict';

/* REQ-120 full Opening E2E smoke.
   Runs late under the existing ?lqSmoke assembled-browser gate so other legacy
   smokes can finish first. Any failure throws and is caught by the existing
   workflow runtime-error guard. */

function fail(reason){
  const el=document.createElement('i');
  el.className='lqReq120OpeningE2EFailure';
  el.hidden=true;
  el.dataset.reason=String(reason);
  document.body.appendChild(el);
  throw new TypeError(`REQ-120 opening E2E failed: ${reason}`);
}
function assert(ok,reason){if(!ok)fail(reason);}

function run(){
  if(typeof s==='undefined'||typeof newGame!=='function')return;
  const raw=localStorage.getItem('lukeQuestV2');
  const before={
    screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,step:s.step,
    dialog:s.dialog?{...s.dialog}:s.dialog,flags:{...(s.flags||{})},
    hp:s.hp,mh:s.mh,atk:s.atk,xp:s.xp,nx:s.nx,gold:s.gold,
    potions:s.potions,wins:s.wins,lv:s.lv,enemy:s.enemy,ehp:s.ehp,
    log:Array.isArray(s.log)?[...s.log]:s.log
  };
  try{
    newGame();
    assert(s.screen==='opening','fresh NEW GAME did not enter Opening');
    assert(typeof window.lqOpeningNext==='function','A+B controller missing');

    window.lqOpeningNext();
    window.lqOpeningNext();
    window.lqOpeningNext();
    assert(s.screen==='world'&&s.map==='openingAldia','A+B playable Aldia morning missing');
    assert(s.flags?.lqOpeningV1==='walk','Opening walk state missing');

    const baseProgress={hp:s.hp,mh:s.mh,atk:s.atk,xp:s.xp,gold:s.gold,potions:s.potions,wins:s.wins,lv:s.lv};

    assert(window.LQ_REQ120_OPENING_C_TEST?.startMemory,'C start authority missing');
    window.LQ_REQ120_OPENING_C_TEST.startMemory();
    assert(s.screen==='openingMockBattle','C flashback did not start');
    window.lqMockStart();
    window.lqMockAttack();window.lqMockAttack();window.lqMockAttack();
    window.lqMockFinish();
    assert(s.screen==='world'&&s.map==='openingAldia'&&s.flags?.lqOpeningMockDone===true,'C did not return cleanly');
    for(const [k,v] of Object.entries(baseProgress))assert(s[k]===v,`tutorial battle mutated ${k}`);

    assert(window.LQ_REQ120_OPENING_DE_TEST?.startDE,'D+E start authority missing');
    window.LQ_REQ120_OPENING_DE_TEST.startDE();
    assert(s.screen==='openingCeremonyDE','D+E did not start');
    for(let i=0;i<11;i++)window.lqDENext();
    assert(s.flags?.lqOpeningDEDone===true,'D+E completion flag missing');
    assert(s.screen==='openingCrystalFG','F+G interception missing');

    for(let i=0;i<11;i++)window.lqFGNext();
    assert(s.flags?.lqOpeningFGDone===true,'F+G completion flag missing');
    assert(s.screen==='openingMissionH','H interception missing');

    for(let i=0;i<7;i++)window.lqHNext();
    assert(s.flags?.lqOpeningComplete===true,'Opening complete flag missing');
    assert(s.flags?.lqOpeningV1==='complete','Opening version completion state missing');
    assert(s.screen==='world'&&s.map==='town'&&s.x===9&&s.y===12,'Chapter 1 handoff invalid');

    for(const [k,v] of Object.entries(baseProgress))assert(s[k]===v,`Opening changed starting progression ${k}`);
    assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'Tap Anywhere authority regressed');
    assert(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true,'fullscreen authority regressed');
    assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.continuousMovement===true,'dynamic touch authority regressed');

    save();
    const saved=JSON.parse(localStorage.getItem('lukeQuestV2')||'null');
    assert(saved?.flags?.lqOpeningComplete===true,'Opening completion did not round-trip to save');
    assert(saved?.screen==='world'&&saved?.map==='town','saved Chapter 1 handoff invalid');

    // A progressed state must stay where it is; no opening wrapper may rewind it.
    s.screen='world';s.map='field';s.x=10;s.y=15;s.flags.lqOpeningComplete=true;s.flags.lqOpeningV1='complete';
    render();
    assert(s.screen==='world'&&s.map==='field','progressed save was rewound into Opening');

    const marker=document.createElement('i');
    marker.className='lqReq120OpeningE2EMarker';
    marker.hidden=true;
    marker.dataset.newGameOpening='true';
    marker.dataset.ab='true';marker.dataset.c='true';marker.dataset.de='true';marker.dataset.fg='true';marker.dataset.h='true';
    marker.dataset.chapterOne='true';marker.dataset.saveRoundTrip='true';marker.dataset.progressedSaveBypass='true';marker.dataset.p0InputPreserved='true';
    document.body.appendChild(marker);
  } finally {
    s.screen=before.screen;s.map=before.map;s.x=before.x;s.y=before.y;s.dir=before.dir;s.step=before.step;
    s.dialog=before.dialog;s.flags=before.flags;s.hp=before.hp;s.mh=before.mh;s.atk=before.atk;s.xp=before.xp;s.nx=before.nx;
    s.gold=before.gold;s.potions=before.potions;s.wins=before.wins;s.lv=before.lv;s.enemy=before.enemy;s.ehp=before.ehp;s.log=before.log;
    if(raw===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',raw);
    render();
  }
}

window.LQ_REQ120_OPENING_E2E_STATUS={requirement:'REQ-120',fullOpening:true,newGame:true,saveRoundTrip:true,progressedSaveBypass:true,p0InputProtected:true,iosPhysicalVerification:'PENDING'};
window.LQ_REQ120_OPENING_E2E_TEST={run};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))run();},4200);
})();
