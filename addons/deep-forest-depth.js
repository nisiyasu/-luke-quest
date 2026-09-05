(() => {
'use strict';

/* REQ-009 Checkpoint C: deeper, colder forest depth toward the northern mist. Presentation only. */
const style=document.createElement('style');
style.textContent=`
.lqDeepForestWorld .tile.deep{background:linear-gradient(135deg,#1d472d 0 24%,#173d28 25% 49%,#245037 50% 74%,#183e2b 75%);box-shadow:inset 0 0 0 1px #0a211566}
.lqDeepForestMistHint{position:absolute;z-index:6;pointer-events:none;width:250px;height:118px;border-radius:50%;background:radial-gradient(ellipse,#b9d9d727 0 18%,#7da9a521 36%,transparent 72%);filter:blur(7px)}
.lqDeepForestDarkness{position:absolute;inset:0;z-index:6;pointer-events:none;background:radial-gradient(ellipse at 50% 56%,transparent 0 22%,#07170e26 56%,#030c075c 100%),linear-gradient(180deg,#203e3426,#07150d35 42%,#020b0652);box-shadow:inset 0 0 84px #020b0670}
.lqDeepForestLightPool{position:absolute;z-index:6;pointer-events:none;width:128px;height:78px;border-radius:50%;background:radial-gradient(ellipse,#d9edb21d 0 22%,#8fb67814 42%,transparent 72%);filter:blur(5px)}
.lqDeepRootMass{position:absolute;z-index:3;pointer-events:none;width:116px;height:38px;border-radius:50%;background:radial-gradient(ellipse at 18% 62%,#413328 0 13%,transparent 14%),radial-gradient(ellipse at 42% 48%,#523c2d 0 18%,transparent 19%),radial-gradient(ellipse at 67% 67%,#342b23 0 17%,transparent 18%),radial-gradient(ellipse at 86% 38%,#4a382b 0 15%,transparent 16%);filter:drop-shadow(0 6px 4px #0007)}
.lqDeepMossPatch{position:absolute;z-index:3;pointer-events:none;width:70px;height:34px;border-radius:50%;background:radial-gradient(ellipse at 25% 60%,#526c3c 0 25%,transparent 26%),radial-gradient(ellipse at 53% 40%,#667d48 0 31%,transparent 32%),radial-gradient(ellipse at 78% 65%,#405b35 0 24%,transparent 25%);opacity:.76;filter:drop-shadow(0 3px 3px #0005)}
.lqDeepDeadBranch{position:absolute;z-index:3;pointer-events:none;width:104px;height:25px;border-top:6px solid #3c3027;border-radius:50%;transform:rotate(10deg);filter:drop-shadow(0 4px 3px #0006)}
.lqDeepDeadBranch:before,.lqDeepDeadBranch:after{content:'';position:absolute;top:-7px;width:38px;height:18px;border-top:4px solid #49372a;border-radius:50%}.lqDeepDeadBranch:before{left:22px;transform:rotate(-25deg)}.lqDeepDeadBranch:after{right:15px;transform:rotate(28deg)}
.lqDeepColdTrail{position:absolute;z-index:2;pointer-events:none;border-radius:30px;background:linear-gradient(90deg,#263e32,#3f5240 24%,#4a5541 50%,#35493a 76%,#22392f);box-shadow:inset 0 0 0 4px #71806a22,0 5px 8px #0005;transform-origin:center}
`;
document.head.appendChild(style);
function add(w,cls,x,y,width,height,rotate){const n=document.createElement('i');n.className=cls;n.style.left=`${x*TS}px`;n.style.top=`${y*TS}px`;if(width)n.style.width=`${width*TS}px`;if(height)n.style.height=`${height*TS}px`;if(rotate)n.style.transform=`rotate(${rotate}deg)`;w.appendChild(n);return n}
function decorate(){
 if(s.screen!=='world'||s.map!=='deepForest')return;
 const w=app.querySelector('.world');if(!w||w.querySelector('.lqDeepForestDepthAnchor'))return;
 w.classList.add('lqDeepForestWorld');const a=document.createElement('i');a.className='lqDeepForestDepthAnchor';a.hidden=true;w.appendChild(a);
 /* South entry is readable; the path becomes colder and visually points toward the northern mist gate. */
 add(w,'lqDeepColdTrail',10.5,16.8,2.5,5.0,-4);
 add(w,'lqDeepColdTrail',11.25,11.4,2.2,5.8,8);
 add(w,'lqDeepColdTrail',10.9,5.6,2.05,6.0,-6);
 add(w,'lqDeepColdTrail',10.85,.7,2.15,5.4,4);
 [[4.6,17.0],[17.2,17.2],[5.4,12.0],[18.8,11.1],[6.3,6.6],[17.7,5.0]].forEach(([x,y])=>add(w,'lqDeepRootMass',x,y));
 [[3.3,14.9],[20.2,14.0],[8.2,10.1],[15.4,8.8],[7.1,3.8],[18.7,2.9]].forEach(([x,y])=>add(w,'lqDeepMossPatch',x,y));
 [[3.8,9.6,-12],[18.4,7.3,11],[6.2,2.5,8]].forEach(([x,y,r])=>add(w,'lqDeepDeadBranch',x,y,null,null,r));
 add(w,'lqDeepForestLightPool',11.1,15.6);add(w,'lqDeepForestLightPool',8.6,8.5);add(w,'lqDeepForestMistHint',9.1,-.4);add(w,'lqDeepForestDarkness',0,0,26,22);
}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};
const renderBase=render;render=function(){const r=renderBase();decorate();return r;};
if(s.screen==='world')decorate();
window.LQ_DEEP_FOREST_DEPTH_STATUS={checkpoint:'REQ-009-C',presentationOnly:true,collisionChanged:false,trailSegments:4,rootMasses:6,mossPatches:6,deadBranches:3,lightPools:2,mistHint:true};
})();