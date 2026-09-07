(() => {
'use strict';

if(typeof location==='undefined'||new URLSearchParams(location.search).get('lqReq117Smoke')!=='1')return;

function mark(data){
 const el=document.createElement('i');el.id='lqReq117CheckpointAMarker';el.hidden=true;
 for(const [k,v] of Object.entries(data))el.dataset[k]=String(v);
 document.body.appendChild(el);
}
function rawSave(){try{return localStorage.getItem('lukeQuestV2');}catch{return null;}}
function semantic(){
 try{return JSON.stringify({screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,flags:s.flags,wins:s.wins,level:s.level,hp:s.hp,mp:s.mp,gold:s.gold});}
 catch{return'__ERR__';}
}
function assert(ok,msg){if(!ok)throw new Error(msg);}
function visibleEntities(){
 return [...document.querySelectorAll('.gameShell .world .player,.gameShell .world .npc')].filter(el=>{
  const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0;
 });
}

setTimeout(()=>{
 const snapshot=structuredClone(s),originalSave=rawSave();
 try{
  s.screen='world';s.map='town';s.x=8;s.y=13;s.dir='up';s.dialog=null;
  render();
  window.LQ_REQ119_CHECKPOINT_A_TEST?.sync?.();
  const semanticBefore=semantic();
  const saveBefore=rawSave();
  const world=document.querySelector('.gameShell .world');
  assert(world,'world missing');
  let entities=visibleEntities();
  assert(entities.length>0,'no visible entities');
  assert(entities.every(el=>el.classList.contains('lqGroundedEntity')),'grounded entity class missing');
  assert(entities.every(el=>el.querySelector(':scope > .lqEntityFootShadow')),'foot shadow missing');
  assert(entities.every(el=>el.querySelector(':scope > .lqEntityVisualBody')),'visual body missing');
  assert(entities.every(el=>getComputedStyle(el.querySelector(':scope > .lqEntityFootShadow')).pointerEvents==='none'),'shadow intercepts pointer');
  assert(entities.every(el=>el.classList.contains('lqIdleEntity')),'idle class missing');
  assert(entities.every(el=>(el.style.getPropertyValue('--lq-idle-delay')||'').endsWith('s')),'idle phase missing');

  // The canonical presentation sync must be a pure DOM projection.
  window.LQ_REQ119_CHECKPOINT_A_TEST?.sync?.();
  assert(semantic()===semanticBefore,'presentation sync mutated semantic game state');
  assert(rawSave()===saveBefore,'presentation sync mutated persistent save');

  const coords=entities.map(el=>[el.style.left,el.style.top]);
  render();
  window.LQ_REQ119_CHECKPOINT_A_TEST?.sync?.();
  entities=visibleEntities();
  assert(entities.every(el=>el.querySelectorAll(':scope > .lqEntityFootShadow').length===1),'shadow duplication/removal drift after rerender');
  assert(entities.every(el=>el.querySelectorAll(':scope > .lqEntityVisualBody').length===1),'visual body duplication/removal drift after rerender');
  assert(entities.every((el,i)=>el.style.left===coords[i]?.[0]&&el.style.top===coords[i]?.[1]),'presentation layer changed entity coordinates');
  assert(semantic()===semanticBefore,'rerender changed semantic gameplay state');

  const st=window.LQ_REQ119_CHECKPOINT_A_STATUS;
  assert(st?.checkpoint==='A'&&st.presentationOnly===true&&st.footShadows===true,'canonical checkpoint A status missing');
  assert(st.idleMotion===true&&st.interactionEaseIn===true,'checkpoint A presentation contract missing');
  assert(st.inputAuthority===false&&st.saveSchemaChange===false&&st.storyChange===false,'authority safety contract missing');
  assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'tap authority not preserved');
  assert(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true,'fullscreen authority not preserved');

  mark({status:'PASS',entities:entities.length,pointerSafe:true,rerenderStable:true,statePreserved:true,savePreserved:true,checkpoint:'A',authority:'canonical-grounding'});
 }catch(error){
  console.error('REQ-117 Checkpoint A smoke failure',error);
  mark({status:'FAIL',error:error?.message||String(error)});
 }finally{
  Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
  if(originalSave===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',originalSave);
 }
},1400);
})();
