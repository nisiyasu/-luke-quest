(() => {
'use strict';

/* REQ-144 presentation-only generic field NPC art.
   Replaces scoped person emoji bodies with repository-owned SVG symbols.
   No input/save/story/collision authority is introduced or changed. */

const ASSET='assets/characters/npc/field-generic-sprites.svg';
const SVG_NS='http://www.w3.org/2000/svg';
const XLINK_NS='http://www.w3.org/1999/xlink';
const BODY_CLASS='lqEntityVisualBody';
const ART_CLASS='lqOriginalGenericNpc';
const GLYPH_ROLES=new Map([
  ['👴','elder'],
  ['👩','merchant'],
  ['🧑‍⚕️','acolyte'],
  ['🧑‍🌾','farmer']
]);
const PERSON_GLYPHS=['👴','👩','🧑‍⚕️','🧑‍🌾'];

function isWorld(){return typeof s!=='undefined'&&s&&s.screen==='world';}
function currentDirection(){
  const d=typeof s!=='undefined'&&s&&['up','down','left','right'].includes(s.dir)?s.dir:'down';
  return d;
}
function roleFor(entity,body){
  if(!entity||!body)return null;
  const remembered=entity.dataset.lqOriginalNpcRole;
  if(remembered)return remembered;
  const text=(body.textContent||'').trim();
  for(const [glyph,role] of GLYPH_ROLES){if(text.includes(glyph))return role;}
  if(typeof s!=='undefined'&&s?.map==='observation'&&text.includes('🛡️'))return 'watch';
  return null;
}
function makeArt(role,direction){
  const svg=document.createElementNS(SVG_NS,'svg');
  svg.classList.add(ART_CLASS);
  svg.setAttribute('viewBox','0 0 40 44');
  svg.setAttribute('width','38');
  svg.setAttribute('height','42');
  svg.setAttribute('aria-hidden','true');
  svg.setAttribute('focusable','false');
  svg.dataset.role=role;
  svg.dataset.direction=direction;
  svg.style.pointerEvents='none';
  const use=document.createElementNS(SVG_NS,'use');
  const href=`${ASSET}#${role}-${direction}`;
  use.setAttribute('href',href);
  try{use.setAttributeNS(XLINK_NS,'xlink:href',href);}catch(_e){}
  svg.appendChild(use);
  return svg;
}
function applyEntity(entity){
  if(!entity||!isWorld())return false;
  const body=entity.querySelector(`:scope > .${BODY_CLASS}`)||entity;
  const role=roleFor(entity,body);
  if(!role)return false;
  const direction=currentDirection();
  const existing=body.querySelector(`:scope > .${ART_CLASS}`);
  if(existing&&existing.dataset.role===role&&existing.dataset.direction===direction){
    entity.dataset.lqOriginalNpcArt='true';
    return true;
  }
  entity.dataset.lqOriginalNpcRole=role;
  entity.dataset.lqOriginalNpcArt='true';
  entity.dataset.lqOriginalNpcGlyph=(body.textContent||'').trim();
  body.replaceChildren(makeArt(role,direction));
  return true;
}
function sync(){
  if(!isWorld())return 0;
  let count=0;
  document.querySelectorAll('.gameShell .npc').forEach(entity=>{if(applyEntity(entity))count++;});
  return count;
}

const style=document.createElement('style');
style.id='lq-req144-generic-npc-style';
style.textContent=`
.${ART_CLASS}{display:block;width:38px;height:42px;max-width:100%;max-height:100%;overflow:visible;pointer-events:none;filter:none!important;will-change:auto!important}
.npc[data-lq-original-npc-art="true"]>.${BODY_CLASS}{font-size:0!important;text-shadow:none!important;filter:none!important;will-change:auto!important}
@media(max-width:430px),(pointer:coarse){.${ART_CLASS}{filter:none!important;will-change:auto!important}}
`;
document.head.appendChild(style);

if(typeof render==='function'){
  const beforeReq144Render=render;
  render=function(){const result=beforeReq144Render.apply(this,arguments);sync();return result;};
}
if(typeof world==='function'){
  const beforeReq144World=world;
  world=function(){const result=beforeReq144World.apply(this,arguments);sync();return result;};
}
if(isWorld())sync();

function fail(reason){
  const el=document.createElement('i');
  el.className='lqReq144SmokeFailure';
  el.hidden=true;
  el.dataset.reason=String(reason);
  document.body.appendChild(el);
  throw new TypeError(`REQ-144 smoke failed: ${reason}`);
}
function assert(ok,reason){if(!ok)fail(reason);}
function visiblePersonEmoji(root){
  const text=(root?.textContent||'');
  return PERSON_GLYPHS.some(g=>text.includes(g));
}
function smoke(){
  if(typeof s==='undefined'||!s||typeof render!=='function')return;
  const snapshot={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,dialog:s.dialog?{...s.dialog}:s.dialog,flags:{...(s.flags||{})}};
  const flagsBefore=JSON.stringify(s.flags||{});
  try{
    s.screen='world';s.map='town';s.x=8;s.y=12;s.dir='down';s.dialog=null;render();
    const town=[...document.querySelectorAll('.gameShell .npc[data-lq-original-npc-art="true"]')];
    assert(town.length>=3,'town generic NPC art count');
    assert(town.some(n=>n.dataset.lqOriginalNpcRole==='elder'),'elder art');
    assert(town.some(n=>n.dataset.lqOriginalNpcRole==='merchant'),'merchant art');
    assert(town.some(n=>n.dataset.lqOriginalNpcRole==='acolyte'),'acolyte art');
    assert(!visiblePersonEmoji(document.querySelector('.gameShell')),'town person emoji hidden/replaced');
    assert(town.every(n=>n.querySelector(`.${ART_CLASS}`)),'town SVG body exists');
    assert(town.every(n=>n.querySelector('.lqEntityFootShadow')),'grounding shadow preserved');

    s.map='field';s.x=11;s.y=16;s.dir='left';render();
    const farmer=document.querySelector('.gameShell .npc[data-lq-original-npc-role="farmer"]');
    assert(farmer&&farmer.querySelector(`.${ART_CLASS}`),'field worker original art');
    assert(farmer.querySelector(`.${ART_CLASS}`).dataset.direction==='left','direction symbol selection');
    assert(!visiblePersonEmoji(document.querySelector('.gameShell')),'field person emoji hidden/replaced');

    s.map='observation';s.x=15;s.y=22;s.dir='down';render();
    const watch=document.querySelector('.gameShell .npc[data-lq-original-npc-role="watch"]');
    assert(watch&&watch.querySelector(`.${ART_CLASS}`),'watch original art');

    s.map='forest';s.x=11;s.y=18;s.dir='down';render();
    const forestText=document.querySelector('.gameShell')?.textContent||'';
    assert(forestText.includes('🔥'),'fire evidence glyph preserved');
    assert(forestText.includes('🪶'),'feather evidence glyph preserved');

    assert(JSON.stringify(s.flags||{})===flagsBefore,'story flags unchanged');
    assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'tap authority preserved');
    assert(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true,'fullscreen authority preserved');
    const marker=document.createElement('i');
    marker.className='lqReq144SmokeMarker';
    marker.hidden=true;
    marker.dataset.town='true';
    marker.dataset.field='true';
    marker.dataset.watch='true';
    marker.dataset.propsPreserved='true';
    marker.dataset.inputAuthority='preserved';
    marker.dataset.formalArt='false';
    document.body.appendChild(marker);
  }finally{
    s.screen=snapshot.screen;s.map=snapshot.map;s.x=snapshot.x;s.y=snapshot.y;s.dir=snapshot.dir;s.dialog=snapshot.dialog;s.flags=snapshot.flags;render();
  }
}

window.LQ_REQ144_STATUS={
  requirement:'REQ-144',
  qualityLevel:'Q2',
  presentationOnly:true,
  asset:ASSET,
  genericRoles:['elder','merchant','acolyte','farmer','watch'],
  formalArt:false,
  inputAuthorityChange:false,
  saveSchemaChange:false,
  storyChange:false,
  iosPhysicalVerification:'PENDING'
};
window.LQ_REQ144_TEST={sync,applyEntity,smoke};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
