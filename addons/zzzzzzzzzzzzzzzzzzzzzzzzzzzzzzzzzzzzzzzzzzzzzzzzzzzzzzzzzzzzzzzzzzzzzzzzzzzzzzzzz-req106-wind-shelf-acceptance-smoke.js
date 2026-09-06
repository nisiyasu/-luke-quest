(() => {
'use strict';

/* REQ-106 dedicated late assembled-browser acceptance. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqNorthCliffEncounterSmoke'))return;

const RIDGE='northRidgeApproach';
const SHELF='windShelf';
const UNKNOWN='__req106UnknownMap__';
function add(id,data={}){const el=document.createElement('i');el.id=id;el.hidden=true;Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));document.body.appendChild(el);return el;}
function fail(reason){
 add('lqReq106RuntimeSmokeFailure',{reason:reason||'unknown'});
 if(!document.getElementById('lqNorthCliffEncounterSmokeFailure'))add('lqNorthCliffEncounterSmokeFailure',{reason:`REQ-106: ${reason||'unknown'}`});
}

setTimeout(()=>{
 const snapshot=structuredClone(s);
 const rawBefore=localStorage.getItem('lukeQuestV2');
 const graceBefore=typeof encounterGrace==='number'?encounterGrace:null;
 const result={};
 try{
  stopMoving();
  const map=MAPS[SHELF];
  result.mapShape=!!map&&map.name==='北尾根・風蝕の岩棚'&&map.w===22&&map.h===20&&Array.isArray(map.tiles)&&map.tiles.length===20&&map.tiles.every(row=>typeof row==='string'&&row.length===22);
  const kinds=map?.npcs?.map(n=>`${n.kind}@${n.x},${n.y}`)||[];
  result.interactables=map?.npcs?.length===4&&[
   'lqWindShelfFootprints@8,16','lqWindShelfPillar@15,13','lqWindShelfView@5,7','lqWindShelfBoundary@10,1'
  ].every(v=>kinds.includes(v));

  s.screen='world';s.map=RIDGE;s.x=10;s.y=2;s.dir='up';s.dialog=null;render();action();
  result.entry=s.map===SHELF&&s.x===10&&s.y===18&&!blocked(s.x,s.y)&&!!s.dialog&&s.dialog.name==='北尾根・風蝕の岩棚';
  s.dialog=null;const yBefore=s.y;move('up');
  result.walkable=s.map===SHELF&&s.y===yBefore-1;

  const status=window.LQ_WIND_SHELF_STATUS;
  result.guideInitial=status?.guidePhase?.()==='clue';
  s.dialog=null;s.map=SHELF;s.x=8;s.y=17;s.dir='up';render();action();
  result.footprints=!!s.dialog&&s.dialog.kind==='lqWindShelfFootprints';
  result.guideAdvance=status?.guidePhase?.()==='north';
  s.dialog=null;s.map=SHELF;s.x=15;s.y=14;s.dir='up';render();action();
  result.pillar=!!s.dialog&&s.dialog.kind==='lqWindShelfPillar';
  s.dialog=null;s.map=SHELF;s.x=5;s.y=8;s.dir='up';render();action();
  result.view=!!s.dialog&&s.dialog.kind==='lqWindShelfView';
  s.dialog=null;s.map=SHELF;s.x=10;s.y=2;s.dir='up';render();action();
  result.boundary=!!s.dialog&&s.dialog.kind==='lqWindShelfBoundary';

  s.dialog=null;s.map=SHELF;s.x=10;s.y=18;s.dir='down';render();move('down');
  result.returnSafe=s.map===RIDGE&&s.x===10&&s.y===2&&!blocked(s.x,s.y);

  s.dialog=null;s.screen='world';s.map=SHELF;s.x=10;s.y=18;s.dir='up';render();
  result.encounterReuse=encounterMap()===true&&enemyPool()===EVAC_ENEMIES;
  result.contract=!!status&&status.interactionCount===4&&status.newRequiredStoryFlags===0&&status.protectedCanonChanged===false&&status.saveSchemaChanged===false&&status.canonicalAction===true&&status.canonicalCheckGate===true&&status.pointerSafeGuidance===true&&status.iosPhysicalVerification==='PENDING';

  result.areaTitle=window.LQ_AREA_TITLE_STATUS?.hasMap?.(SHELF)===true&&window.LQ_AREA_TITLE_STATUS?.subtitle?.(SHELF)==='北尾根のさらに高みへ続く風蝕の岩棚';
  result.ambient=window.LQ_WORLD_AMBIENT_STATUS?.hasMap?.(SHELF)===true&&window.LQ_WORLD_AMBIENT_STATUS?.typeFor?.(SHELF)==='fog';
  result.cloud=window.LQ_WORLD_CLOUD_STATUS?.hasMap?.(SHELF)===true&&window.LQ_WORLD_CLOUD_STATUS?.classFor?.(SHELF)==='mist';
  result.footstep=window.LQ_FOOTSTEP_PARTICLE_STATUS?.hasMap?.(SHELF)===true&&window.LQ_FOOTSTEP_PARTICLE_STATUS?.kindFor?.(SHELF)==='mist';
  const objective=window.LQ_ADVENTURE_JOURNAL_TEST?.mainGoal?.({flags:{withdrawProofSeen:true},map:SHELF,wins:0})||'';
  result.journal=window.LQ_ADVENTURE_JOURNAL_STATUS?.windShelfLocationAware===true&&objective.includes('北尾根・風蝕の岩棚');
  const lightTypes=window.LQ_WORLD_LANDMARK_LIGHT_STATUS?.typesFor?.(SHELF)||[];
  result.landmarks=window.LQ_WORLD_LANDMARK_LIGHT_STATUS?.countFor?.(SHELF)===3&&lightTypes.join(',')==='cliff,wind,wind';

  const shell=app.querySelector('.gameShell');const worldEl=app.querySelector('.world');
  const guide=shell?.querySelector('.lqWindShelfGuide');const marker=worldEl?.querySelector('.lqWindShelfMarker');
  const lights=[...(worldEl?.querySelectorAll('.lqMapLight')||[])];
  result.pointerSafe=!!guide&&!!marker&&getComputedStyle(guide).pointerEvents==='none'&&getComputedStyle(marker).pointerEvents==='none'&&lights.length===3&&lights.every(el=>getComputedStyle(el).pointerEvents==='none');

  result.unknownFallback=
   window.LQ_AREA_TITLE_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_AREA_TITLE_STATUS?.subtitle?.(UNKNOWN)==='LUKE QUEST'&&
   window.LQ_WORLD_AMBIENT_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_WORLD_AMBIENT_STATUS?.typeFor?.(UNKNOWN)===null&&
   window.LQ_WORLD_CLOUD_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_WORLD_CLOUD_STATUS?.classFor?.(UNKNOWN)===null&&
   window.LQ_FOOTSTEP_PARTICLE_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_FOOTSTEP_PARTICLE_STATUS?.kindFor?.(UNKNOWN)===null&&
   window.LQ_WORLD_LANDMARK_LIGHT_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_WORLD_LANDMARK_LIGHT_STATUS?.countFor?.(UNKNOWN)===0;

  s.screen='battle';s.map=SHELF;
  const battleStatus=window.LQ_WIND_SHELF_BATTLE_BACKGROUND_STATUS;
  result.battleBackground=!!battleStatus&&battleStatus.map===SHELF&&battleStatus.presentationOnly===true&&battleStatus.protectedCanonChanged===false&&battleStatus.saveSchemaChanged===false&&battleStatus.apply()===true;
  const bg=app.querySelector('.lqWindShelfBattleBackdrop');
  result.battleLayer=!!bg&&bg.dataset.map===SHELF&&getComputedStyle(bg).pointerEvents==='none';
  s.map=UNKNOWN;result.battleUnknownFallback=battleStatus?.apply()===false;

  const persistedBefore=localStorage.getItem('lukeQuestV2');
  s.screen='world';s.map=SHELF;s.x=10;s.y=18;s.dialog=null;render();
  const persisted=JSON.parse(localStorage.getItem('lukeQuestV2')||'null');
  result.saveRoundTrip=!!persisted&&persisted.map===SHELF&&persisted.x===10&&persisted.y===18;
  if(persistedBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',persistedBefore);

  const required=['mapShape','interactables','entry','walkable','guideInitial','footprints','guideAdvance','pillar','view','boundary','returnSafe','encounterReuse','contract','areaTitle','ambient','cloud','footstep','journal','landmarks','pointerSafe','unknownFallback','battleBackground','battleLayer','battleUnknownFallback','saveRoundTrip'];
  const missing=required.filter(k=>result[k]!==true);
  if(missing.length)throw new Error(`acceptance false: ${missing.join(',')}`);
 }catch(err){console.error('lqReq106RuntimeSmokeFailure',err);fail(err&&err.message);}
 finally{
  stopMoving();Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);
  if(graceBefore!==null)encounterGrace=graceBefore;
  if(rawBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',rawBefore);
  render();add('lqReq106RuntimeSmokeMarker',result);
 }
},1500);
})();
