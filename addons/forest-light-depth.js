(() => {
'use strict';

/* REQ-009 Checkpoint B: entrance-forest hierarchy. Builds on forest-ground-details without duplicating logs/mushrooms/stones/leaves. */
const style=document.createElement('style');
style.textContent=`
.lqForestEntranceWorld .tile.forest{background:linear-gradient(135deg,#315f38 0 24%,#285530 25% 49%,#37683d 50% 74%,#2b5933 75%);box-shadow:inset 0 0 0 1px #152d1c66}
.lqForestCanopyShade{position:absolute;inset:0;z-index:6;pointer-events:none;background:radial-gradient(ellipse at 50% 92%,transparent 0 19%,#0e281318 52%,#071a0d4d 100%),linear-gradient(180deg,#0a1d113d 0 8%,transparent 30%,transparent 72%,#07140c25);box-shadow:inset 0 0 68px #06140b59}
.lqForestSunshaft{position:absolute;z-index:6;pointer-events:none;width:70px;height:270px;transform:rotate(12deg);transform-origin:top center;background:linear-gradient(90deg,transparent,#d8efb719,transparent);filter:blur(4px)}
.lqForestPath{position:absolute;z-index:2;pointer-events:none;border-radius:28px;background:linear-gradient(90deg,#415334,#68704b 28%,#756f4c 52%,#5c6742 75%,#394c31);box-shadow:inset 0 0 0 4px #9b9c6b26,0 5px 8px #0004;transform-origin:center}
.lqForestPath:after{content:'';position:absolute;inset:6px;border-radius:22px;background:radial-gradient(circle at 20% 55%,#a28c5e55 0 3px,transparent 4px),radial-gradient(circle at 63% 28%,#7e735355 0 3px,transparent 4px),radial-gradient(circle at 82% 67%,#a5956555 0 2px,transparent 3px)}
.lqForestRoot{position:absolute;z-index:3;pointer-events:none;width:88px;height:18px;border-radius:50%;border-top:7px solid #4c3828;transform:rotate(-8deg);filter:drop-shadow(0 4px 3px #0005)}
.lqForestRoot:after{content:'';position:absolute;right:-8px;top:-5px;width:38px;height:15px;border-top:5px solid #5a422e;border-radius:50%;transform:rotate(16deg)}
.lqForestFern{position:absolute;z-index:3;pointer-events:none;width:54px;height:38px;background:repeating-conic-gradient(from 205deg at 50% 100%,#4d7b45 0 5deg,transparent 6deg 15deg);filter:drop-shadow(0 3px 2px #0005)}
.lqForestEntranceGlow{position:absolute;z-index:6;pointer-events:none;width:180px;height:90px;border-radius:50%;background:radial-gradient(ellipse,#d9edaa29 0 24%,#9dcf7620 38%,transparent 72%);filter:blur(4px)}
`;
document.head.appendChild(style);
function add(w,cls,x,y,width,height,rotate){const n=document.createElement('i');n.className=cls;n.style.left=`${x*TS}px`;n.style.top=`${y*TS}px`;if(width)n.style.width=`${width*TS}px`;if(height)n.style.height=`${height*TS}px`;if(rotate)n.style.transform=`rotate(${rotate}deg)`;w.appendChild(n);return n}
function decorate(){
 if(s.screen!=='world'||s.map!=='forest')return;
 const w=app.querySelector('.world');if(!w||w.querySelector('.lqForestLightDepthAnchor'))return;
 w.classList.add('lqForestEntranceWorld');const a=document.createElement('i');a.className='lqForestLightDepthAnchor';a.hidden=true;w.appendChild(a);
 /* Existing map entry is south-central; keep it brighter, then visually narrow the trail northward. */
 add(w,'lqForestEntranceGlow',9.2,17.1);
 add(w,'lqForestPath',10.35,14.0,2.7,5.0,-2);
 add(w,'lqForestPath',9.1,9.4,2.4,5.4,10);
 add(w,'lqForestPath',10.2,4.7,2.15,5.0,-7);
 [[6.9,15.2,-7],[14.8,12.6,9],[7.1,8.0,12],[16.6,6.4,-9]].forEach(([x,y,r])=>add(w,'lqForestRoot',x,y,null,null,r));
 [[4.2,14.7],[17.4,15.8],[5.8,9.1],[18.1,8.0],[8.1,4.4],[15.6,3.3]].forEach(([x,y])=>add(w,'lqForestFern',x,y));
 add(w,'lqForestSunshaft',7.4,.3);add(w,'lqForestSunshaft',15.1,2.0);add(w,'lqForestCanopyShade',0,0,24,20);
}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};
const renderBase=render;render=function(){const r=renderBase();decorate();return r;};
if(s.screen==='world')decorate();
window.LQ_FOREST_LIGHT_DEPTH_STATUS={checkpoint:'REQ-009-B',presentationOnly:true,collisionChanged:false,paths:3,roots:4,ferns:6,sunshafts:2};
})();