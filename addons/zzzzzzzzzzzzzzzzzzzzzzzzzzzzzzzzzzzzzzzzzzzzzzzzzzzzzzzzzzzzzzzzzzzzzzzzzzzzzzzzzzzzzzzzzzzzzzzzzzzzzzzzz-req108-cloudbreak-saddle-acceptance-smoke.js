(() => {
'use strict';

/* REQ-108 dedicated late assembled-browser acceptance. */
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqNorthCliffEncounterSmoke'))return;
const SKY='skylineTraverse',SADDLE='cloudbreakSaddle',UNKNOWN='__req108UnknownMap__';
function add(id,data={}){const el=document.createElement('i');el.id=id;el.hidden=true;Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));document.body.appendChild(el);return el;}
function fail(reason){add('lqReq108RuntimeSmokeFailure',{reason:reason||'unknown'});if(!document.getElementById('lqNorthCliffEncounterSmokeFailure'))add('lqNorthCliffEncounterSmokeFailure',{reason:`REQ-108: ${reason||'unknown'}`});}
setTimeout(()=>{
 const snapshot=structuredClone(s),rawBefore=localStorage.getItem('lukeQuestV2'),graceBefore=typeof encounterGrace==='number'?encounterGrace:null,result={};
 try{
  stopMoving();const map=MAPS[SADDLE];
  result.mapShape=!!map&&map.name==='北尾根・雲上の鞍部'&&map.w===22&&map.h===20&&Array.isArray(map.tiles)&&map.tiles.length===20&&map.tiles.every(row=>typeof row==='string'&&row.length===22);
  const kinds=map?.npcs?.map(n=>`${n.kind}@${n.x},${n.y}`)||[];
  result.interactables=map?.npcs?.length===4&&['lqCloudbreakScuff@11,16','lqCloudbreakHollow@6,12','lqCloudbreakView@16,7','lqCloudbreakBoundary@10,1'].every(v=>kinds.includes(v));

  s.screen='world';s.map=SKY;s.x=10;s.y=2;s.dir='up';s.dialog=null;render();action();
  result.entry=s.map===SADDLE&&s.x===10&&s.y===18&&!blocked(s.x,s.y)&&!!s.dialog&&s.dialog.kind==='lqSkylineBoundary'&&s.dialog.name==='北尾根・雲上の鞍部';
  s.dialog=null;const y0=s.y;move('up');result.walkable=s.map===SADDLE&&s.y===y0-1;

  const status=window.LQ_CLOUDBREAK_SADDLE_STATUS;
  result.guideInitial=status?.guidePhase?.()==='clue';
  s.dialog=null;s.map=SADDLE;s.x=11;s.y=17;s.dir='up';render();action();
  result.scuff=!!s.dialog&&s.dialog.kind==='lqCloudbreakScuff';
  result.guideAdvance=status?.guidePhase?.()==='north';
  s.dialog=null;s.map=SADDLE;s.x=6;s.y=13;s.dir='up';render();action();result.hollow=!!s.dialog&&s.dialog.kind==='lqCloudbreakHollow';
  s.dialog=null;s.map=SADDLE;s.x=16;s.y=8;s.dir='up';render();action();result.view=!!s.dialog&&s.dialog.kind==='lqCloudbreakView';
  s.dialog=null;s.map=SADDLE;s.x=10;s.y=2;s.dir='up';render();action();result.boundary=!!s.dialog&&s.dialog.kind==='lqCloudbreakBoundary'&&s.map===SADDLE;

  s.dialog=null;s.map=SADDLE;s.x=10;s.y=18;s.dir='down';render();move('down');result.returnSafe=s.map===SKY&&s.x===10&&s.y===2&&!blocked(s.x,s.y);

  s.dialog=null;s.screen='world';s.map=SADDLE;s.x=10;s.y=18;s.dir='up';render();
  result.encounterReuse=encounterMap()===true&&enemyPool()===EVAC_ENEMIES;
  result.contract=!!status&&status.interactionCount===4&&status.newRequiredStoryFlags===0&&status.protectedCanonChanged===false&&status.saveSchemaChanged===false&&status.canonicalAction===true&&status.canonicalCheckGate===true&&status.pointerSafeGuidance===true&&status.iosPhysicalVerification==='PENDING';
  result.areaTitle=window.LQ_AREA_TITLE_STATUS?.hasMap?.(SADDLE)===true&&window.LQ_AREA_TITLE_STATUS?.subtitle?.(SADDLE)==='露出した稜線の合間にある風の弱い高所鞍部';
  result.ambient=window.LQ_WORLD_AMBIENT_STATUS?.hasMap?.(SADDLE)===true&&window.LQ_WORLD_AMBIENT_STATUS?.typeFor?.(SADDLE)==='fog';
  result.cloud=window.LQ_WORLD_CLOUD_STATUS?.hasMap?.(SADDLE)===true&&window.LQ_WORLD_CLOUD_STATUS?.classFor?.(SADDLE)==='mist';
  result.footstep=window.LQ_FOOTSTEP_PARTICLE_STATUS?.hasMap?.(SADDLE)===true&&window.LQ_FOOTSTEP_PARTICLE_STATUS?.kindFor?.(SADDLE)==='mist';
  const objective=window.LQ_ADVENTURE_JOURNAL_TEST?.mainGoal?.({flags:{withdrawProofSeen:true},map:SADDLE,wins:0})||'';
  result.journal=window.LQ_ADVENTURE_JOURNAL_STATUS?.cloudbreakSaddleLocationAware===true&&objective.includes('北尾根・雲上の鞍部');
  const lightTypes=window.LQ_WORLD_LANDMARK_LIGHT_STATUS?.typesFor?.(SADDLE)||[];
  result.landmarks=window.LQ_WORLD_LANDMARK_LIGHT_STATUS?.countFor?.(SADDLE)===3&&lightTypes.join(',')==='cliff,cliff,wind';
  const shell=app.querySelector('.gameShell'),worldEl=app.querySelector('.world'),guide=shell?.querySelector('.lqCloudbreakGuide'),marker=worldEl?.querySelector('.lqCloudbreakMarker'),lights=[...(worldEl?.querySelectorAll('.lqMapLight')||[])];
  result.pointerSafe=!!guide&&!!marker&&getComputedStyle(guide).pointerEvents==='none'&&getComputedStyle(marker).pointerEvents==='none'&&lights.length===3&&lights.every(el=>getComputedStyle(el).pointerEvents==='none');
  result.p0Input=window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true&&window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.releaseSafety===true&&window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.transitionRenderStops===true&&window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.iosPhysicalVerification==='PENDING';
  result.p0Fullscreen=window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true&&window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.dynamicViewportUnits===true&&window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.safeAreaAware===true&&window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.controlsOverlay===true&&window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.iosPhysicalVerification==='PENDING';
  result.unknownFallback=window.LQ_AREA_TITLE_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_AREA_TITLE_STATUS?.subtitle?.(UNKNOWN)==='LUKE QUEST'&&window.LQ_WORLD_AMBIENT_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_WORLD_AMBIENT_STATUS?.typeFor?.(UNKNOWN)===null&&window.LQ_WORLD_CLOUD_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_WORLD_CLOUD_STATUS?.classFor?.(UNKNOWN)===null&&window.LQ_FOOTSTEP_PARTICLE_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_FOOTSTEP_PARTICLE_STATUS?.kindFor?.(UNKNOWN)===null&&window.LQ_WORLD_LANDMARK_LIGHT_STATUS?.hasMap?.(UNKNOWN)===false&&window.LQ_WORLD_LANDMARK_LIGHT_STATUS?.countFor?.(UNKNOWN)===0;

  s.screen='battle';s.map=SADDLE;const battleStatus=window.LQ_CLOUDBREAK_BATTLE_BACKGROUND_STATUS;
  result.battleBackground=!!battleStatus&&battleStatus.map===SADDLE&&battleStatus.presentationOnly===true&&battleStatus.protectedCanonChanged===false&&battleStatus.saveSchemaChanged===false&&battleStatus.apply()===true;
  const bg=app.querySelector('.lqCloudbreakBattleBackdrop');result.battleLayer=!!bg&&bg.dataset.map===SADDLE&&getComputedStyle(bg).pointerEvents==='none';s.map=UNKNOWN;result.battleUnknownFallback=battleStatus?.apply()===false;

  const persistedBefore=localStorage.getItem('lukeQuestV2');s.screen='world';s.map=SADDLE;s.x=10;s.y=18;s.dialog=null;render();const persisted=JSON.parse(localStorage.getItem('lukeQuestV2')||'null');result.saveRoundTrip=!!persisted&&persisted.map===SADDLE&&persisted.x===10&&persisted.y===18;if(persistedBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',persistedBefore);

  const required=['mapShape','interactables','entry','walkable','guideInitial','scuff','guideAdvance','hollow','view','boundary','returnSafe','encounterReuse','contract','areaTitle','ambient','cloud','footstep','journal','landmarks','pointerSafe','p0Input','p0Fullscreen','unknownFallback','battleBackground','battleLayer','battleUnknownFallback','saveRoundTrip'];
  const missing=required.filter(k=>result[k]!==true);if(missing.length)throw new Error(`acceptance false: ${missing.join(',')}`);
 }catch(err){console.error('lqReq108RuntimeSmokeFailure',err);fail(err&&err.message);}
 finally{stopMoving();Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);if(graceBefore!==null)encounterGrace=graceBefore;if(rawBefore===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',rawBefore);render();add('lqReq108RuntimeSmokeMarker',result);}
},2150);
})();
