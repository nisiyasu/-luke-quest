(() => {
'use strict';
const DIRS=['down','up','left','right'];
const PATHS=Object.fromEntries(DIRS.map(d=>[d,`assets/characters/luke/field-${d}.webp.b64`]));
const raster={};
let stepSeq=0;
let lastDir='down';
let lastMoveAt=0;
let hydrated=false;
const frameForStep=()=>[0,1,2,1][stepSeq%4];
function player(){return document.querySelector('.gameShell .player')}
function visualBody(el){return el?.querySelector(':scope > .lqEntityVisualBody')||el}
async function hydrate(){
  const pairs=await Promise.all(DIRS.map(async d=>{
    const r=await fetch(PATHS[d],{cache:'force-cache'});
    if(!r.ok)throw new Error(`Luke field asset load failed: ${d}`);
    const b64=(await r.text()).trim();
    if(!b64.startsWith('UklGR'))throw new Error(`Luke field asset is not WebP transport: ${d}`);
    return [d,`data:image/webp;base64,${b64}`];
  }));
  for(const [d,url] of pairs)raster[d]=url;
  hydrated=true;
  window.LQ_LUKE_FIELD_SPRITE_STATUS={formal:true,directions:4,framesPerDirection:3,transport:'webp-base64',paths:{...PATHS},approvedRasterPreserved:true,canonicalVisualBody:true,compositorFilter:false,imageRendering:'pixelated',req117CheckpointD:true};
  apply();
}
function apply(){
  const el=player();
  if(!el||!hydrated)return;
  window.LQ_REQ117_CHECKPOINT_A_TEST?.ensureEntityVisual?.(el,0);
  const body=visualBody(el);
  if(!body)return;
  const dir=(typeof s!=='undefined'&&s&&DIRS.includes(s.dir))?s.dir:lastDir;
  lastDir=dir;
  const walking=Date.now()-lastMoveAt<210;
  const frame=walking?frameForStep():1;
  // Clear only the presentation body. Never destroy the canonical grounding
  // wrapper or foot shadow on the player entity.
  body.textContent='';
  body.classList.add('lqFormalLukeBody');
  el.dataset.lukeSprite='formal-raster';
  el.dataset.lukeDirection=dir;
  el.dataset.lukeFrame=String(frame);
  el.style.width='48px';
  el.style.height='64px';
  el.style.marginLeft='-5px';
  el.style.marginTop='-22px';
  el.style.backgroundImage='none';
  el.style.filter='none';
  body.style.backgroundImage=`url("${raster[dir]}")`;
  body.style.backgroundRepeat='no-repeat';
  body.style.backgroundSize='144px 64px';
  body.style.backgroundPosition=`${-48*frame}px 0px`;
  body.style.imageRendering='pixelated';
  body.style.filter='none';
}
if(typeof move==='function'){
  const baseMove=move;
  move=function(d){
    if(DIRS.includes(d)){lastDir=d;stepSeq++;lastMoveAt=Date.now();}
    const out=baseMove.apply(this,arguments);
    queueMicrotask(apply);
    return out;
  };
}
if(typeof stopMoving==='function'){
  const baseStop=stopMoving;
  stopMoving=function(){
    const out=baseStop.apply(this,arguments);
    lastMoveAt=0;
    queueMicrotask(apply);
    return out;
  };
}
const mo=new MutationObserver(()=>apply());
mo.observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('load',apply,{once:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){lastMoveAt=0;}apply();});

function fail(reason){const el=document.createElement('i');el.className='lqReq117CheckpointDSmokeFailure';el.hidden=true;el.dataset.reason=String(reason);document.body.appendChild(el);throw new TypeError(`REQ-117 checkpoint D smoke failed: ${reason}`);}
function assert(ok,reason){if(!ok)fail(reason);}
function smoke(){
  if(typeof s==='undefined'||typeof render!=='function'||!hydrated)return;
  const before={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,dialog:s.dialog?{...s.dialog}:s.dialog};
  try{
    s.screen='world';s.map='town';s.x=8;s.y=13;s.dialog=null;
    for(const dir of DIRS){
      s.dir=dir;render();apply();
      const el=player(),body=visualBody(el),shadow=el?.querySelector(':scope > .lqEntityFootShadow');
      assert(el&&body&&shadow,`${dir} canonical grounded structure preserved`);
      assert(el.dataset.lukeDirection===dir,`${dir} direction applied`);
      assert(body.classList.contains('lqFormalLukeBody'),`${dir} formal visual body`);
      assert((body.style.backgroundImage||'').includes('data:image/webp;base64,'),`${dir} approved raster hydrated`);
      assert(getComputedStyle(el).filter==='none',`${dir} player compositor filter disabled`);
      assert(getComputedStyle(body).filter==='none',`${dir} body compositor filter disabled`);
      assert(getComputedStyle(shadow).pointerEvents==='none',`${dir} foot shadow pointer safe`);
      assert(el.querySelectorAll(':scope > .lqEntityFootShadow').length===1,`${dir} one foot shadow`);
      assert(el.querySelectorAll(':scope > .lqEntityVisualBody').length===1,`${dir} one visual body`);
    }
    render();apply();
    const npcs=[...document.querySelectorAll('.gameShell .npc .lqEntityVisualBody')];
    assert(npcs.length>=2,'multiple recurring NPC visual bodies');
    assert(npcs.every(n=>getComputedStyle(n).filter==='none'),'NPC compositor filters disabled');
    assert(npcs.some(n=>getComputedStyle(n).textShadow!=='none'),'NPC silhouette treatment present');
    assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'Tap Anywhere authority preserved');
    assert(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true,'fullscreen authority preserved');
    const marker=document.createElement('i');marker.id='lqReq117CheckpointDMarker';marker.hidden=true;
    marker.dataset.status='PASS';marker.dataset.directions='4';marker.dataset.frames='3';marker.dataset.approvedRaster='true';marker.dataset.groundingPreserved='true';marker.dataset.npcSilhouette='true';marker.dataset.filterEffects='false';marker.dataset.presentationOnly='true';document.body.appendChild(marker);
  }finally{s.screen=before.screen;s.map=before.map;s.x=before.x;s.y=before.y;s.dir=before.dir;s.dialog=before.dialog;render();apply();}
}
window.LQ_REQ117_CHECKPOINT_D_STATUS={requirement:'REQ-117',checkpoint:'D',approvedLukeRasterPreserved:true,directions:4,framesPerDirection:3,canonicalVisualBody:true,npcSilhouetteTreatment:true,compositorFilterEffects:false,inputAuthority:false,collisionMutation:false,saveMutation:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ117_CHECKPOINT_D_TEST={apply,smoke};
const q=new URLSearchParams(location.search);
setTimeout(()=>{if(q.get('lqReq117SpriteSmoke')==='1')smoke();},4200);

hydrate().catch(err=>{console.error(err);window.LQ_LUKE_FIELD_SPRITE_STATUS={formal:false,error:String(err)};});
})();