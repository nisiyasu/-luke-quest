(() => {
'use strict';

/* Collision-safe add-on: readable market canopies plus legacy fountain fallback for Royal Capital scene density. */
const style=document.createElement('style');
style.textContent=`
.lqTownFountainVisual{position:absolute;z-index:3;width:78px;height:78px;transform:translate(-50%,-50%);border-radius:50%;border:8px solid #9ca8aa;background:radial-gradient(circle,#d8f3f4 0 10%,#78c5cf 12% 34%,#3c8ea0 36% 58%,#b5c3c0 60% 69%,#6c7777 71%);box-shadow:0 7px 11px #0007,inset 0 0 12px #e9ffff77;pointer-events:none}
.lqTownFountainVisual:before{content:'';position:absolute;left:50%;top:47%;width:20px;height:35px;transform:translate(-50%,-64%);border-radius:45% 45% 30% 30%;background:linear-gradient(90deg,#6e7c7f,#c8d2d0 45%,#758385);border:2px solid #c7d2d0;box-shadow:0 3px 5px #0005}
.lqTownFountainVisual:after{content:'';position:absolute;left:50%;top:8px;width:22px;height:44px;transform:translateX(-50%);border-radius:50%;border-left:3px solid #b8f5ff88;border-right:3px solid #b8f5ff55;filter:drop-shadow(0 0 4px #c8fbff88);animation:lqFountainJet 1.45s ease-in-out infinite alternate}
.lqMarketCanopy{position:absolute;z-index:3;width:112px;height:58px;transform:translate(-50%,-60%);pointer-events:none;filter:drop-shadow(0 6px 6px #0006)}
.lqMarketCanopy .roof{position:absolute;left:0;right:0;top:0;height:25px;border:3px solid #62452e;border-radius:7px 7px 3px 3px;background:repeating-linear-gradient(90deg,#385f6b 0 18px,#d8c28c 18px 36px)}
.lqMarketCanopy.fruit .roof{background:repeating-linear-gradient(90deg,#9d4d43 0 18px,#e2c98f 18px 36px)}
.lqMarketCanopy .table{position:absolute;left:8px;right:8px;bottom:0;height:28px;border:3px solid #67462e;border-radius:4px;background:linear-gradient(#9b7146,#62422b)}
.lqMarketCanopy .goods{position:absolute;left:18px;right:18px;bottom:24px;height:16px;border-radius:50%;background:radial-gradient(circle at 15% 65%,#c8523c 0 5px,transparent 6px),radial-gradient(circle at 36% 55%,#e4b34d 0 5px,transparent 6px),radial-gradient(circle at 58% 65%,#5b7b4c 0 5px,transparent 6px),radial-gradient(circle at 80% 52%,#ba6843 0 5px,transparent 6px)}
.lqMarketCanopy.gear .goods{border-radius:3px;background:linear-gradient(135deg,transparent 0 15%,#b69867 16% 24%,transparent 25% 40%,#77858d 41% 50%,transparent 51% 65%,#8c6944 66% 76%,transparent 77%)}
@keyframes lqFountainJet{from{height:38px;opacity:.7}to{height:47px;opacity:1}}
@media(prefers-reduced-motion:reduce){.lqTownFountainVisual:after{animation:none;height:42px}}
`;
document.head.appendChild(style);
function addLandmarks(){
 if(s.screen!=='world'||s.map!=='town')return;const w=app.querySelector('.world');if(!w)return;
 const hasPhysicalFountain=currentNpcs().some(n=>n.kind==='lqTownFountain');
 if(!hasPhysicalFountain&&!w.querySelector('.lqTownFountainVisual')){const f=document.createElement('div');f.className='lqTownFountainVisual';f.style.left=`${8*TS+TS/2}px`;f.style.top=`${8*TS+TS/2}px`;w.appendChild(f);}
 if(!w.querySelector('.lqMarketCanopy.fruit')){const m=document.createElement('div');m.className='lqMarketCanopy fruit';m.style.left=`${2.5*TS+TS/2}px`;m.style.top=`${9*TS+TS/2}px`;m.innerHTML='<i class="roof"></i><i class="table"></i><i class="goods"></i>';w.appendChild(m);}
 if(!w.querySelector('.lqMarketCanopy.gear')){const m=document.createElement('div');m.className='lqMarketCanopy gear';m.style.left=`${14.5*TS+TS/2}px`;m.style.top=`${9*TS+TS/2}px`;m.innerHTML='<i class="roof"></i><i class="table"></i><i class="goods"></i>';w.appendChild(m);}
}
const worldBase=world;world=function(){const r=worldBase();addLandmarks();return r;};
const renderBase=render;render=function(){const r=renderBase();addLandmarks();return r;};
if(s.screen==='world')addLandmarks();
window.LQ_TOWN_LANDMARK_VISUAL_STATUS={fountain:'physical-interaction-preferred',marketCanopies:2,presentationOnly:true,reducedMotion:true};
})();
