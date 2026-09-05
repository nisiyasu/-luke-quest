(() => {
'use strict';

/* Presentation-only field-density pass: fence sections, milestones, flowers and road-edge stones. */
const style=document.createElement('style');style.textContent=`
.lqFieldFence{position:absolute;z-index:2;width:112px;height:34px;pointer-events:none;filter:drop-shadow(0 4px 3px #0006)}.lqFieldFence:before{content:'';position:absolute;left:0;right:0;top:11px;height:7px;background:linear-gradient(#8a6946,#5a432f);box-shadow:0 12px #644a34}.lqFieldFence:after{content:'';position:absolute;left:8px;top:0;width:8px;height:34px;background:#76563a;box-shadow:46px 0 #76563a,92px 0 #76563a;border-radius:2px}
.lqMilestone{position:absolute;z-index:3;width:28px;height:40px;border-radius:12px 12px 5px 5px;background:linear-gradient(110deg,#a3a091,#706d63);border:2px solid #c2bda9;box-shadow:0 5px 5px #0006;pointer-events:none}.lqMilestone:after{content:'王';position:absolute;left:50%;top:10px;transform:translateX(-50%);color:#554f46;font-size:11px;font-weight:900}
.lqWildflowerPatch{position:absolute;z-index:2;width:56px;height:32px;pointer-events:none;background:radial-gradient(circle at 12% 55%,#f1d783 0 3px,transparent 4px),radial-gradient(circle at 30% 34%,#dbc0e8 0 3px,transparent 4px),radial-gradient(circle at 55% 62%,#f2a9a1 0 3px,transparent 4px),radial-gradient(circle at 76% 30%,#efe9d4 0 3px,transparent 4px),linear-gradient(transparent 0 58%,#4e7a43 59% 70%,transparent 71%);filter:drop-shadow(0 2px 2px #0004)}
.lqRoadStone{position:absolute;z-index:2;width:20px;height:12px;border-radius:50%;background:linear-gradient(#9b9483,#676257);box-shadow:0 3px 3px #0005;pointer-events:none}.lqRoadStone.small{transform:scale(.7)}
`;
document.head.appendChild(style);
function add(w,cls,x,y){const e=document.createElement('i');e.className=cls;e.style.left=`${x*TS}px`;e.style.top=`${y*TS}px`;w.appendChild(e)}
function decorate(){if(s.screen!=='world'||s.map!=='field')return;const w=app.querySelector('.world');if(!w||w.querySelector('.lqFieldDetailAnchor'))return;const a=document.createElement('i');a.className='lqFieldDetailAnchor';a.style.display='none';w.appendChild(a);
 [[1.1,5.8],[16.7,7.3],[2.3,13.7]].forEach(([x,y])=>add(w,'lqFieldFence',x,y));
 [[8.8,14.3],[15.2,5.6]].forEach(([x,y])=>add(w,'lqMilestone',x,y));
 [[2.0,2.1],[7.1,10.6],[15.1,12.0],[19.2,4.3],[4.3,15.0]].forEach(([x,y])=>add(w,'lqWildflowerPatch',x,y));
 [[9.2,13.5,''],[11.3,10.9,'small'],[17.6,14.1,''],[6.3,4.1,'small'],[13.5,6.4,'']].forEach(([x,y,c])=>add(w,`lqRoadStone ${c}`.trim(),x,y));}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};const renderBase=render;render=function(){const r=renderBase();decorate();return r;};if(s.screen==='world')decorate();window.LQ_FIELD_ROADSIDE_DETAIL_STATUS={fences:3,milestones:2,flowers:5,stones:5,presentationOnly:true};
})();