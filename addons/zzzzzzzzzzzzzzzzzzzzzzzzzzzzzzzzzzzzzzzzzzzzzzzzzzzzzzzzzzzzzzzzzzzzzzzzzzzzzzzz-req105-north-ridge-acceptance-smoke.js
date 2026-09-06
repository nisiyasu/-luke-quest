(() => {
'use strict';

/* REQ-105 dedicated assembled-browser acceptance.
   Reuses the existing public browser-gate query but owns its own fail-closed marker.
   It is deliberately late-loading so every cross-system add-on has already registered. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqNorthCliffEncounterSmoke'))return;

const RIDGE='northRidgeApproach';
const WIND='windcutPass';
const UNKNOWN='__req105UnknownMap__';
function add(id,data={}){
 const el=document.createElement('i');el.id=id;el.hidden=true;
 Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));
 document.body.appendChild(el);return el;
}
function fail(reason){
 add('lqReq105RuntimeSmokeFailure',{reason:reason||'unknown'});
 /* Existing Pages REQ-082 gate already fails on this marker. Piggybacking keeps
    REQ-105 public completion fail-closed without weakening or replacing REQ-082. */
 if(!document.getElementById('lqNorthCliffEncounterSmokeFailure'))add('lqNorthCliffEncounterSmokeFailure',{reason:`REQ-105: ${reason||'unknown'}`});
}

setTimeout(()=>{
 const snapshot=structuredClone(s);
 const rawBefore=localStorage.getItem('lukeQuestV2');
 const graceBefore=typeof encounterGrace==='number'?encounterGrace:null;
 const result={};
 try{
  stopMoving();
  const map=MAPS[RIDGE];
  result.mapShape=!!map&&map.name==='北尾根・岩棚道'&&map.w===22&&map.h===20&&Array.isArray(map.tiles)&&map.tiles.length===20&&map.tiles.every(row=>typeof row==='string'&&row.length===22);
  const kinds=map?.npcs?.map(n=>`${n.kind}@${n.x},${n.y}`)||[];
  result.interactables=map?.npcs?.length===4&&[
   'lqNorthRidgeFootprints@7,16','lqNorthRidgeStake@15,13','lqNorthRidgeView@5,7','lqNorthRidgeBoundary@10,1'
  ].every(v=>kinds.includes(v));

  s.screen='world';s.map=WIND;s.x=10;s.y=2;s.dir='up';s.dialog=null;render();action();
  result.entry=s.map===RIDGE&&s.x===10&&s.y===18&&!blocked(s.x,s.y)&&!!s.dialog&&s.dialog.name==='北尾根・岩棚道';
  s.dialog=null;const yBefore=s.y;move('up');
  result.walkable=s.map===RIDGE&&s.y===yBefore-1;

  s.dialog=null;s.map=RIDGE;s.x=7;s.y=17;s.dir='up';render();action();
  result.footprints=!!s.dialog&&s.dialog.kind==='lqNorthRidgeFootprints';
  s.dialog=null;s.map=RIDGE;s.x=15;s.y=14;s.dir='up';render();action();
  result.stake=!!s.dialog&&s.dialog.kind==='lqNorthRidgeStake';
  s.dialog=null;s.map=RIDGE;s.x=5;s.y=8;s.dir='up';render();action();
  result.view=!!s.dialog&&s.dialog.kind==='lqNorthRidgeView';
  s.dialog=null;s.map=RIDGE;s.x=10;s.y=2;s.dir='up';render();action();
  result.boundary=!!s.dialog&&s.dialog.kind==='lqNorthRidgeBoundary';

  s.dialog=null;s.map=RIDGE;s.x=10;s.y=18;s.dir='down';render();move('down');
  result.returnSafe=s.map===WIND&&s.x===10&&s.y===2&&!blocked(s.x,s.y);

  s.dialog=null;s.screen='world';s.map=RIDGE;s.x=10;s.y=18;s.dir='up';render();
  result.encounterReuse=encounterMap()===true&&enemyPool()===EVAC_ENEMIES;
  const status=window.LQ_NORTH_RIDGE_APPROACH_STATUS;
  result.contract=!!status&&status.interactionCount===4&&status.newRequiredStoryFlags===0&&status.protectedCanonChanged===false&&status.saveSchemaChanged===false&&status.canonicalAction===true&&status.canonicalCheckGate===true&&status.iosPhysicalVerification==='PENDING';

  result.areaTitle=!!window.LQ_AREA_TITLE_STATUS?.hasMap?.(RIDGE)&&window.LQ_AREA_TITLE_STATUS.subtitle(RIDGE)==='風切り峠の先へ伸びる細い北尾根';
  result.ambient=!!window.LQ_WORLD_AMBIENT_STATUS?.hasMap?.(RIDGE)&&window.LQ_WORLD_AMBIENT_STATUS.typeFor(RIDGE)==='fog';
  result.cloud=!!window.LQ_WORLD_CLOUD_STATUS?.hasMap?.(RIDGE)&&window.LQ_WORLD_CLOUD_STATUS.classFor(RIDGE)==='mist';
  result.footstep=!!window.LQ_FOOTSTEP_PARTICLE_STATUS?.hasMap?.(RIDGE)&&window.LQ_FOOTSTEP_PARTICLE_STATUS.kindFor(RIDGE)==='mist';
  const objective=window.LQ_ADVENTURE_JOURNAL_TEST?.mainGoal?.({flags:{withdrawProofSeen:true},map:RIDGE,wins:0})||'';
  result.journal=window.LQ_ADVENTURE_JOURNAL_STATUS?.northRidgeApproachLocationAware===true&&objective.includes('北尾根・岩棚道');
  const lightTypes=window.LQ_WORLD_LANDMARK_LIGHT_STATUS?.typesFor?.(RIDGE)||[];
  result.landmarks=window.LQ_WORLD_LANDMARK_LIGHT_STATUS?.countFor?.(RIDGE)===2&&lightTypes.length===2&&lightTypes[0]==='cliff'&&lightTypes[1]==='wind';

  result.unknownFallback=
   window.LQ_AREA_TITLE_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_AREA_TITLE_STATUS?.subtitle?.(UNKNOWN)==='LUKE QUEST'&&
   window.LQ_WORLD_AMBIENT_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_WORLD_AMBIENT_STATUS?.typeFor?.(UNKNOWN)===null&&
   window.LQ_WORLD_CLOUD_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_WORLD_CLOUD_STATUS?.classFor?.(UNKNOWN)===null&&
   window.LQ_FOOTSTEP_PARTICLE_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_FOOTSTEP_PARTICLE_STATUS?.kindFor?.(UNKNOWN)===null&&
   window.LQ_WORLD_LANDMARK_LIGHT_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_WORLD_LANDMARK_LIGHT_STATUS?.countFor?.(UNKNOWN)===0&&
   (window.LQ_WORLD_LANDMARK_LIGHT_STATUS?.typesFor?.(UNKNOWN)||[]).length===0;

  const worldEl=app.querySelector('.world');
  const localMist=worldEl?.querySelectorAll('.lqNorthRidgeMist').length||0;
  const localWind=worldEl?.querySelectorAll('.lqNorthRidgeWind').length||0;
  const lights=[...(worldEl?.querySelectorAll('.lqMapLight')||[])];
  result.presentation=localMist===2&&localWind===4&&lights.length===2&&lights.every(el=>getComputedStyle(el).pointerEvents==='none');

  s.screen='battle';s.map=RIDGE;
  const battleStatus=window.LQ_NORTH_RIDGE_BATTLE_BACKGROUND_STATUS;
  result.battleBackground=!!battleStatus&&battleStatus.map===RIDGE&&battleStatus.presentationOnly===true&&battleStatus.protectedCanonChanged===false&&battleStatus.saveSchemaChanged===false&&battleStatus.apply()===true;
  const bg=app.querySelector('.lqNorthRidgeBattleBackdrop');
  result.battleLayer=!!bg&&bg.dataset.map===RIDGE&&getComputedStyle(bg).pointerEvents==='none';
  s.map=UNKNOWN;
  result.battleUnknownFallback=battleStatus?.apply()===false;

  const required=['mapShape','interactables','entry','walkable','footprints','stake','view','boundary','returnSafe','encounterReuse','contract','areaTitle','ambient','cloud','footstep','journal','landmarks','unknownFallback','presentation','battleBackground','battleLayer','battleUnknownFallback'];
  const missing=required.filter(k=>result[k]!==true);
  if(missing.length)throw new Error(`acceptance false: ${missing.join(',')}`);
 }catch(err){console.error('lqReq105RuntimeSmokeFailure',err);fail(err&&err.message);}
 finally{
  stopMoving();
  Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);
  if(graceBefore!==null)encounterGrace=graceBefore;
  if(rawBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',rawBefore);
  render();
  add('lqReq105RuntimeSmokeMarker',result);
 }
},1200);
})();
