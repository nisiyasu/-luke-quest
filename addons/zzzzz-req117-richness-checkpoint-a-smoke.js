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

setTimeout(()=>{
 const snapshot=structuredClone(s),originalSave=rawSave();
 try{
  s.screen='world';s.map='town';s.x=8;s.y=13;s.dir='up';s.dialog=null;
  render();
  window.LQ_WORLD_CHARACTER_RICHNESS_STATUS?.refresh?.();
  const semanticBefore=semantic();
  const saveBefore=rawSave();
  const world=document.querySelector('.gameShell .world');
  assert(world,'world missing');
  let entities=[...world.querySelectorAll('.player,.npc')].filter(el=>{const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0;});
  let shadows=[...world.querySelectorAll('.lqEntityFootShadow')];
  assert(entities.length>0,'no visible entities');
  assert(shadows.length===entities.length,`shadow count ${shadows.length} != entity count ${entities.length}`);
  assert(shadows.every(el=>getComputedStyle(el).pointerEvents==='none'),'shadow intercepts pointer');
  assert(entities.every(el=>el.classList.contains('lqRichIdle')),'idle class missing');
  assert(entities.every(el=>(el.style.getPropertyValue('--lq-idle-delay')||'').endsWith('ms')),'idle phase missing');

  // Calling the presentation refresher alone must be a pure DOM projection.
  window.LQ_WORLD_CHARACTER_RICHNESS_STATUS.refresh();
  assert(semantic()===semanticBefore,'presentation refresh mutated semantic game state');
  assert(rawSave()===saveBefore,'presentation refresh mutated persistent save');

  const coords=entities.map(el=>[el.style.left,el.style.top]);
  render();
  window.LQ_WORLD_CHARACTER_RICHNESS_STATUS?.refresh?.();
  entities=[...document.querySelectorAll('.gameShell .world .player,.gameShell .world .npc')].filter(el=>{const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>0;});
  shadows=[...document.querySelectorAll('.gameShell .world .lqEntityFootShadow')];
  assert(shadows.length===entities.length,'shadow duplication/removal drift after rerender');
  assert(new Set(shadows.map(el=>el.dataset.owner)).size===shadows.length,'duplicate shadow owner after rerender');
  assert(entities.every((el,i)=>el.style.left===coords[i]?.[0]&&el.style.top===coords[i]?.[1]),'presentation layer changed entity coordinates');
  assert(semantic()===semanticBefore,'rerender changed semantic gameplay state');

  const st=window.LQ_WORLD_CHARACTER_RICHNESS_STATUS;
  assert(st?.checkpoint==='A'&&st.presentationOnly===true&&st.footShadows===true&&st.separateShadowNodes===true,'status contract missing');
  assert(st.idleMotion===true&&st.idleCoordinateMutation===false&&st.reducedMotionSafe===true,'idle safety contract missing');
  assert(st.interactionPromptEasing===true&&st.promptWordingChanged===false&&st.inputAuthorityChanged===false,'interaction presentation contract missing');
  assert(st.collisionChanged===false&&st.saveSchemaChanged===false&&st.storyChanged===false&&st.pointerSafe===true,'authority safety contract missing');

  mark({status:'PASS',entities:entities.length,shadows:shadows.length,pointerSafe:true,rerenderStable:true,statePreserved:true,savePreserved:true,checkpoint:'A'});
 }catch(error){
  console.error('REQ-117 Checkpoint A smoke failure',error);
  mark({status:'FAIL',error:error?.message||String(error)});
 }finally{
  Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();
  if(originalSave===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',originalSave);
 }
},1400);
})();
