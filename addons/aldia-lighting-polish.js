(() => {
'use strict';

/* REQ-008 Checkpoint C: subtle light, contact shadow and foreground framing for Aldia. */
const style=document.createElement('style');
style.textContent=`
.lqAldiaAtmosphere{position:absolute;inset:0;z-index:6;pointer-events:none;overflow:hidden;background:radial-gradient(ellipse at 50% 35%,#fff3c514 0 18%,transparent 50%),linear-gradient(180deg,#b9d9ff12,transparent 35%,#07111f0f 76%,#07111f25);box-shadow:inset 0 0 64px #07111f42}
.lqAldiaAtmosphere:before{content:'';position:absolute;left:19%;top:-18%;width:82px;height:92%;transform:rotate(13deg);transform-origin:top center;background:linear-gradient(90deg,transparent,#fff2ba14,transparent);filter:blur(5px)}
.lqAldiaAtmosphere:after{content:'';position:absolute;right:10%;top:-12%;width:52px;height:75%;transform:rotate(-9deg);background:linear-gradient(90deg,transparent,#d8ecff10,transparent);filter:blur(4px)}
.lqAldiaContactShadow{position:absolute;z-index:3;pointer-events:none;height:18px;border-radius:50%;background:radial-gradient(ellipse,#0007 0 22%,#0004 42%,transparent 72%);filter:blur(1px)}
.lqAldiaCurb{position:absolute;z-index:3;pointer-events:none;height:8px;background:repeating-linear-gradient(90deg,#b9b09c 0 21px,#7c766a 22px 24px);border-top:1px solid #ded5c1;box-shadow:0 4px 4px #0005}
.lqAldiaForegroundBough{position:absolute;z-index:9;pointer-events:none;width:92px;height:70px;border-radius:50%;background:radial-gradient(circle at 28% 48%,#284d2d 0 18%,transparent 19%),radial-gradient(circle at 50% 35%,#35613a 0 22%,transparent 23%),radial-gradient(circle at 70% 58%,#24482c 0 20%,transparent 21%);filter:drop-shadow(0 7px 5px #0008);opacity:.88}
.lqAldiaForegroundBough.left{transform:rotate(18deg)}.lqAldiaForegroundBough.right{transform:rotate(-22deg)}
.lqAldiaRouteGlow{position:absolute;z-index:3;pointer-events:none;width:30px;height:30px;border-radius:50%;background:radial-gradient(circle,#ffe7a233 0 18%,#ffd76516 35%,transparent 70%);filter:blur(2px)}
`;
document.head.appendChild(style);
function add(w,cls,x,y,width,height){const n=document.createElement('i');n.className=cls;n.style.left=`${x*TS}px`;n.style.top=`${y*TS}px`;if(width)n.style.width=`${width*TS}px`;if(height)n.style.height=`${height*TS}px`;w.appendChild(n);return n}
function decorate(){
  if(s.screen!=='world'||s.map!=='town')return;
  const w=app.querySelector('.world');if(!w||w.querySelector('.lqAldiaLightingAnchor'))return;
  const a=document.createElement('i');a.className='lqAldiaLightingAnchor';a.hidden=true;w.appendChild(a);

  /* Building contact shadows stay behind actors and do not alter collision. */
  add(w,'lqAldiaContactShadow',2.8,4.65,3.5,.45);
  add(w,'lqAldiaContactShadow',9.8,4.65,3.5,.45);
  add(w,'lqAldiaContactShadow',5.8,8.85,4.4,.48);

  /* Curbs make the south approach and civic crossing read as constructed stone routes. */
  add(w,'lqAldiaCurb',7.35,9.63,3.3);
  add(w,'lqAldiaCurb',7.35,14.72,3.3);
  add(w,'lqAldiaCurb',5.55,4.92,6.65);

  [[7.08,5.12],[10.53,5.12],[7.08,11.92],[10.53,11.92]].forEach(([x,y])=>add(w,'lqAldiaRouteGlow',x,y));

  /* Foreground corner foliage frames the camera without covering the central route. */
  add(w,'lqAldiaForegroundBough left',.05,12.95);
  add(w,'lqAldiaForegroundBough right',16.05,12.9);
  add(w,'lqAldiaAtmosphere',0,0,18,16);
}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};
const renderBase=render;render=function(){const r=renderBase();decorate();return r;};
if(s.screen==='world')decorate();
window.LQ_ALDIA_LIGHTING_STATUS={checkpoint:'C',presentationOnly:true,collisionChanged:false,contactShadows:3,curbs:3,routeGlows:4,foregroundFrames:2,atmosphere:true};
})();