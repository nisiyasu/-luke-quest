(()=>{
'use strict';
const DIRS=['down','up','left','right'];
const PATHS=Object.fromEntries(DIRS.map(d=>[d,`assets/characters/luke/field-${d}.webp.b64`]));
const raster={};
let stepSeq=0;
let lastDir='down';
let lastMoveAt=0;
let hydrated=false;
const frameForStep=()=>[0,1,2,1][stepSeq%4];
function player(){return document.querySelector('.player')}
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
  window.LQ_LUKE_FIELD_SPRITE_STATUS={formal:true,directions:4,framesPerDirection:3,transport:'webp-base64',paths:{...PATHS}};
  apply();
}
function apply(){
  const el=player();
  if(!el||!hydrated)return;
  const dir=(typeof s!=='undefined'&&s&&DIRS.includes(s.dir))?s.dir:lastDir;
  lastDir=dir;
  const walking=Date.now()-lastMoveAt<210;
  const frame=walking?frameForStep():1;
  el.textContent='';
  el.dataset.lukeSprite='formal-raster';
  el.dataset.lukeDirection=dir;
  el.dataset.lukeFrame=String(frame);
  el.style.width='48px';
  el.style.height='64px';
  el.style.marginLeft='-5px';
  el.style.marginTop='-22px';
  el.style.backgroundImage=`url("${raster[dir]}")`;
  el.style.backgroundRepeat='no-repeat';
  el.style.backgroundSize='144px 64px';
  el.style.backgroundPosition=`${-48*frame}px 0px`;
  el.style.imageRendering='auto';
  el.style.filter='drop-shadow(0 4px 3px #0008)';
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
hydrate().catch(err=>{console.error(err);window.LQ_LUKE_FIELD_SPRITE_STATUS={formal:false,error:String(err)};});
})();