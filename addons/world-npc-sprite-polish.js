(() => {
'use strict';

/* REQ-119 Checkpoint D2 — safe recurring-NPC field readability polish.
   This does NOT claim formal NPC raster art. It preserves the existing emoji/source
   identity and adds a small presentation-only role palette plate + clean outline so
   multiple recurring NPCs read more distinctly until canonical raster art exists. */

const STYLE_ID='lq-req119-npc-sprite-polish-style';
const PLATE_CLASS='lqNpcRolePalettePlate';
const ROLE_BY_GLYPH=new Map([
  ['👴','elder'],['👩','shopkeeper'],['🧑‍⚕️','acolyte'],['🧑‍🌾','farmer'],
  ['🧑‍🦳','leon'],['🛡️','guard'],['🧛','glenn']
]);
const ROLE_COLORS={
  elder:['#514d55','#817a83','#c3b9aa'],
  shopkeeper:['#56354f','#a15b78','#e8b58f'],
  acolyte:['#273f66','#5177a8','#d9e8f2'],
  farmer:['#4b3b24','#7e6840','#c9aa68'],
  leon:['#554a1f','#a58a35','#ead777'],
  guard:['#263544','#536a7d','#a9bdc9'],
  glenn:['#2a163e','#633a83','#b47bc9']
};

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
.gameShell .npc.lqNpcSpritePolished>.lqEntityVisualBody{isolation:isolate;text-shadow:1px 0 #101823,-1px 0 #101823,0 1px #101823,0 -1px #101823,1px 1px #101823,-1px 1px #101823}
.gameShell .npc.lqNpcSpritePolished>.lqEntityVisualBody>.${PLATE_CLASS}{position:absolute;left:50%;bottom:3px;width:24px;height:20px;transform:translateX(-50%);border:1px solid #111923;border-radius:5px 5px 7px 7px;box-shadow:inset 3px 0 var(--lq-npc-shadow),inset -3px 0 var(--lq-npc-highlight),0 1px 0 #ffffff18,0 3px 3px #0007;background:var(--lq-npc-base);pointer-events:none;z-index:-1;image-rendering:pixelated}
.gameShell .npc.lqNpcSpritePolished>.lqEntityVisualBody>.${PLATE_CLASS}::before{content:'';position:absolute;left:4px;right:4px;top:5px;height:2px;background:var(--lq-npc-highlight);opacity:.68;box-shadow:0 6px 0 var(--lq-npc-shadow)}
.gameShell .npc.lqNpcSpritePolished[data-lq-npc-role="leon"]>.lqEntityVisualBody>.${PLATE_CLASS}{border-radius:4px 4px 8px 8px}
.gameShell .npc.lqNpcSpritePolished[data-lq-npc-role="glenn"]>.lqEntityVisualBody>.${PLATE_CLASS}{box-shadow:inset 3px 0 var(--lq-npc-shadow),inset -3px 0 var(--lq-npc-highlight),0 0 5px #8d4ec766,0 3px 3px #0008}
@media(max-width:390px){.gameShell .npc.lqNpcSpritePolished>.lqEntityVisualBody>.${PLATE_CLASS}{width:22px;height:19px}}
@media(prefers-reduced-motion:reduce){.gameShell .npc.lqNpcSpritePolished>.lqEntityVisualBody{transition:none!important}}
`;
  document.head.appendChild(style);
}

function classify(entity){
  const body=entity?.querySelector?.('.lqEntityVisualBody');
  if(!body)return null;
  const text=(body.textContent||'').trim();
  for(const [glyph,role] of ROLE_BY_GLYPH){if(text.includes(glyph))return role;}
  return null;
}

function ensurePlate(entity,role){
  const body=entity.querySelector('.lqEntityVisualBody');
  if(!body)return false;
  const colors=ROLE_COLORS[role];
  if(!colors)return false;
  entity.classList.add('lqNpcSpritePolished');
  entity.dataset.lqNpcRole=role;
  entity.style.setProperty('--lq-npc-shadow',colors[0]);
  entity.style.setProperty('--lq-npc-base',colors[1]);
  entity.style.setProperty('--lq-npc-highlight',colors[2]);
  let plate=body.querySelector(`.${PLATE_CLASS}`);
  if(!plate){
    plate=document.createElement('span');
    plate.className=PLATE_CLASS;
    plate.setAttribute('aria-hidden','true');
    body.prepend(plate);
  }
  return true;
}

function sync(){
  if(typeof s==='undefined'||!s||s.screen!=='world')return 0;
  let count=0;
  document.querySelectorAll('.gameShell .npc').forEach(entity=>{
    const role=classify(entity);
    if(role&&ensurePlate(entity,role))count++;
  });
  return count;
}

injectStyle();
if(typeof render==='function'){
  const beforeNpcPolishRender=render;
  render=function(){const result=beforeNpcPolishRender.apply(this,arguments);sync();return result;};
}
if(typeof world==='function'){
  const beforeNpcPolishWorld=world;
  world=function(){const result=beforeNpcPolishWorld.apply(this,arguments);sync();return result;};
}
if(typeof s!=='undefined'&&s?.screen==='world')sync();

function assert(ok,reason){if(!ok){const el=document.createElement('i');el.hidden=true;el.className='lqReq119D2SmokeFailure';el.dataset.reason=String(reason);document.body.appendChild(el);throw new TypeError(`REQ-119 D2 smoke failed: ${reason}`);}}
function smoke(){
  if(typeof s==='undefined'||typeof render!=='function')return;
  const snapshot={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,dialog:s.dialog?{...s.dialog}:s.dialog,flags:{...(s.flags||{})}};
  const flagsBefore=JSON.stringify(s.flags||{});
  try{
    s.screen='world';s.map='town';s.x=9;s.y=12;s.dialog=null;render();
    const polished=[...document.querySelectorAll('.gameShell .npc.lqNpcSpritePolished')];
    const roles=new Set(polished.map(el=>el.dataset.lqNpcRole));
    assert(polished.length>=3,'town recurring NPC polish coverage');
    assert(roles.has('elder')&&roles.has('shopkeeper')&&roles.has('acolyte'),'distinct town role palettes');
    assert(polished.every(el=>el.querySelector(`.lqEntityVisualBody>.${PLATE_CLASS}`)),'palette plate attached inside visual body');
    assert(polished.every(el=>getComputedStyle(el.querySelector(`.${PLATE_CLASS}`)).pointerEvents==='none'),'palette plates pointer transparent');
    assert(JSON.stringify(s.flags||{})===flagsBefore,'story flags unchanged');
    assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'tap authority preserved');
    assert(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true,'fullscreen authority preserved');
    const marker=document.createElement('i');marker.hidden=true;marker.className='lqReq119D2SmokeMarker';
    marker.dataset.multipleNpc='true';marker.dataset.distinctPalette='true';marker.dataset.outline='true';marker.dataset.presentationOnly='true';marker.dataset.formalNpcRaster='false';
    document.body.appendChild(marker);
  } finally {
    s.screen=snapshot.screen;s.map=snapshot.map;s.x=snapshot.x;s.y=snapshot.y;s.dir=snapshot.dir;s.dialog=snapshot.dialog;s.flags=snapshot.flags;render();
  }
}

window.LQ_REQ119_D2_SAFE_NPC_POLISH={
  requirement:'REQ-119',checkpoint:'D2',state:'safe-presentation-partial',
  multipleRecurringNpcReadability:true,cleanOutline:true,rolePaletteThreeTone:true,
  formalNpcRasterAvailable:false,formalNpcArtClaimed:false,
  hitboxChanged:false,inputChanged:false,collisionChanged:false,saveChanged:false,storyChanged:false
};
window.LQ_REQ119_D2_TEST={sync,smoke};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
