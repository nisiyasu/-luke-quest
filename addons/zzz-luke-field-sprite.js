(()=>{
'use strict';
const ASSET='assets/characters/luke/field-sprite.svg';
const DIR_ROW={down:0,up:1,left:2,right:3};
let stepSeq=0;
let lastDir='down';
let lastMoveAt=0;
const frameForStep=()=>[0,1,2,1][stepSeq%4];
function player(){return document.querySelector('.player')}
function apply(){
  const el=player();
  if(!el)return;
  const dir=(typeof s!=='undefined'&&s&&DIR_ROW[s.dir]!==undefined)?s.dir:lastDir;
  lastDir=dir;
  const walking=Date.now()-lastMoveAt<210;
  const frame=walking?frameForStep():1;
  el.textContent='';
  el.dataset.lukeSprite='formal';
  el.dataset.lukeDirection=dir;
  el.dataset.lukeFrame=String(frame);
  el.style.width='48px';
  el.style.height='64px';
  el.style.marginLeft='-5px';
  el.style.marginTop='-22px';
  el.style.backgroundImage=`url("${ASSET}")`;
  el.style.backgroundRepeat='no-repeat';
  el.style.backgroundSize='144px 256px';
  el.style.backgroundPosition=`${-48*frame}px ${-64*DIR_ROW[dir]}px`;
  el.style.imageRendering='auto';
  el.style.filter='drop-shadow(0 4px 3px #0008)';
}
if(typeof move==='function'){
  const baseMove=move;
  move=function(d){
    if(DIR_ROW[d]!==undefined){lastDir=d;stepSeq++;lastMoveAt=Date.now();}
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
apply();
})();