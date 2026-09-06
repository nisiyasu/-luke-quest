(() => {
'use strict';

/* REQ-119 Checkpoint B — presentation-only map depth.
   Neighbor-aware edge treatment is applied to rendered DOM tiles only.
   MAPS data, collision, coordinates, transitions and interaction authority are
   never mutated. */

const STYLE_ID='lq-world-map-depth-style';
const MATERIALS=['grass','water','wall','floor','roof','tree','gate','forest','deep','mist','mud','military','ash','evac','rock'];
const RAISED=new Set(['wall','roof','tree','gate','military','rock']);
const PATHLIKE=new Set(['floor','gate','evac']);

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');
  st.id=STYLE_ID;
  st.textContent=`
.tile.lqDepthTile{--lq-depth-shadow:none;box-shadow:var(--lq-depth-shadow);isolation:isolate}
.tile.lqDepthTile.lqRaisedLower{filter:drop-shadow(0 4px 2px rgba(2,8,14,.28))}
.tile.lqDepthTile.lqPathLower{filter:drop-shadow(0 3px 1px rgba(3,9,14,.16))}
.tile.lqDepthTile.lqEdgeTop{background-image:linear-gradient(to bottom,rgba(255,255,255,.105),rgba(255,255,255,.015) 14%,transparent 28%)}
.tile.lqDepthTile.lqEdgeBottom{box-shadow:inset 0 -4px 0 rgba(4,11,18,.105)}
.tile.lqDepthTile.lqEdgeLeft::before,.tile.lqDepthTile.lqEdgeRight::after{content:"";position:absolute;top:0;bottom:0;width:4px;pointer-events:none;z-index:1}
.tile.lqDepthTile.lqEdgeLeft::before{left:0;background:linear-gradient(to right,rgba(255,255,255,.07),transparent)}
.tile.lqDepthTile.lqEdgeRight::after{right:0;background:linear-gradient(to left,rgba(3,10,16,.085),transparent)}
.tile.lqDepthTile.lqEdgeTop.lqEdgeBottom{box-shadow:inset 0 3px 0 rgba(255,255,255,.045),inset 0 -4px 0 rgba(4,11,18,.105)}
.tile.wall.lqDepthTile,.tile.rock.lqDepthTile,.tile.military.lqDepthTile{background-blend-mode:soft-light,normal}
.tile.tree.lqDepthTile,.tile.forest.lqDepthTile,.tile.deep.lqDepthTile{background-blend-mode:soft-light,normal}
@media(prefers-reduced-motion:reduce){.tile.lqDepthTile{transition:none!important}}
`;
  document.head.appendChild(st);
}

function material(el){
  if(!el)return 'unknown';
  for(const m of MATERIALS)if(el.classList.contains(m))return m;
  return 'unknown';
}
function xy(el){
  const left=parseFloat(el.style.left||'0');
  const top=parseFloat(el.style.top||'0');
  return [Math.round(left/48),Math.round(top/48)];
}
function sameFamily(a,b){
  if(a===b)return true;
  const green=new Set(['grass','tree','forest','deep']);
  const stone=new Set(['wall','rock','military','ash']);
  const road=new Set(['floor','gate','evac']);
  if(green.has(a)&&green.has(b))return true;
  if(stone.has(a)&&stone.has(b))return true;
  if(road.has(a)&&road.has(b))return true;
  return false;
}
function clearDepth(el){
  el.classList.remove('lqDepthTile','lqEdgeTop','lqEdgeBottom','lqEdgeLeft','lqEdgeRight','lqRaisedLower','lqPathLower');
  el.style.removeProperty('--lq-depth-shadow');
}
function applyDepth(){
  if(typeof s==='undefined'||s?.screen!=='world')return;
  injectStyle();
  const tiles=[...document.querySelectorAll('.gameShell .world .tile')];
  if(!tiles.length)return;
  const grid=new Map();
  for(const el of tiles){clearDepth(el);const [x,y]=xy(el);grid.set(`${x},${y}`,el);}
  for(const el of tiles){
    const [x,y]=xy(el),mat=material(el);
    const top=material(grid.get(`${x},${y-1}`));
    const bottom=material(grid.get(`${x},${y+1}`));
    const left=material(grid.get(`${x-1},${y}`));
    const right=material(grid.get(`${x+1},${y}`));
    el.classList.add('lqDepthTile');
    if(top!=='unknown'&&!sameFamily(mat,top))el.classList.add('lqEdgeTop');
    if(bottom!=='unknown'&&!sameFamily(mat,bottom))el.classList.add('lqEdgeBottom');
    if(left!=='unknown'&&!sameFamily(mat,left))el.classList.add('lqEdgeLeft');
    if(right!=='unknown'&&!sameFamily(mat,right))el.classList.add('lqEdgeRight');
    if(bottom!=='unknown'&&!sameFamily(mat,bottom)){
      if(RAISED.has(mat))el.classList.add('lqRaisedLower');
      else if(PATHLIKE.has(mat))el.classList.add('lqPathLower');
    }
  }
}

injectStyle();
if(typeof render==='function'){
  const before=render;
  render=function(){const out=before.apply(this,arguments);applyDepth();return out;};
}
if(typeof world==='function'){
  const before=world;
  world=function(){const out=before.apply(this,arguments);applyDepth();return out;};
}
if(typeof s!=='undefined'&&s?.screen==='world')applyDepth();

function fail(reason){
  const el=document.createElement('i');el.className='lqReq119CheckpointBSmokeFailure';el.hidden=true;el.dataset.reason=String(reason);document.body.appendChild(el);
  throw new TypeError(`REQ-119 checkpoint B smoke failed: ${reason}`);
}
function assert(ok,reason){if(!ok)fail(reason);}
function smoke(){
  if(typeof s==='undefined'||typeof render!=='function')return;
  const before={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,dialog:s.dialog?{...s.dialog}:s.dialog,flags:{...(s.flags||{})}};
  const maps=['town','field','forest'];
  const evidence=[];
  try{
    for(const map of maps){
      s.screen='world';s.map=map;s.dialog=null;s.x=9;s.y=12;s.dir='up';render();applyDepth();
      const tiles=[...document.querySelectorAll('.gameShell .world .tile.lqDepthTile')];
      const edges=tiles.filter(t=>t.classList.contains('lqEdgeTop')||t.classList.contains('lqEdgeBottom')||t.classList.contains('lqEdgeLeft')||t.classList.contains('lqEdgeRight'));
      const drops=tiles.filter(t=>t.classList.contains('lqRaisedLower')||t.classList.contains('lqPathLower'));
      assert(tiles.length>20,`${map} rendered tile coverage`);
      assert(edges.length>0,`${map} boundary blending coverage`);
      assert(drops.length>0,`${map} lower-edge depth coverage`);
      evidence.push(`${map}:${edges.length}/${drops.length}`);
    }
    assert(window.LQ_FLOATING_TOUCH_CONTROLLER_STATUS?.tapAnywhereAction===true,'Tap Anywhere authority preserved');
    assert(window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS?.worldViewportPrimary===true,'fullscreen authority preserved');
    const marker=document.createElement('i');marker.className='lqReq119CheckpointBSmokeMarker';marker.hidden=true;
    marker.dataset.town='true';marker.dataset.field='true';marker.dataset.forest='true';marker.dataset.edges='true';marker.dataset.dropShadows='true';marker.dataset.presentationOnly='true';marker.dataset.evidence=evidence.join('|');document.body.appendChild(marker);
  }finally{
    s.screen=before.screen;s.map=before.map;s.x=before.x;s.y=before.y;s.dir=before.dir;s.dialog=before.dialog;s.flags=before.flags;render();
  }
}

window.LQ_REQ119_CHECKPOINT_B_STATUS={requirement:'REQ-119',checkpoint:'B',neighborAwareEdges:true,raisedLowerShadows:true,pathLowerShadows:true,mapDataMutation:false,collisionMutation:false,inputAuthority:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ119_CHECKPOINT_B_TEST={applyDepth,smoke};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},2500);
})();
