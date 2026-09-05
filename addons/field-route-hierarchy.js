(() => {
'use strict';

/* REQ-009 Checkpoint A: make the Aldia outskirts read as a route between the capital and the forest. Presentation only. */
const style=document.createElement('style');
style.textContent=`
.lqFieldHierarchyWorld .tile.grass{background:linear-gradient(135deg,#6f9b50 0 24%,#648d49 25% 49%,#759f57 50% 74%,#678f4c 75%);box-shadow:inset 0 0 0 1px #314b2750}
.lqFieldRoute{position:absolute;z-index:2;pointer-events:none;border-radius:26px;background:linear-gradient(90deg,#756c59,#a3916f 20%,#b09b75 50%,#917e61 80%,#6b624f);box-shadow:inset 0 0 0 4px #d0bf9150,0 5px 8px #0004;transform-origin:center}
.lqFieldRoute:after{content:'';position:absolute;inset:5px;border-radius:20px;background:repeating-linear-gradient(90deg,transparent 0 28px,#6d624f35 29px 32px)}
.lqFieldTownPaving{position:absolute;z-index:3;pointer-events:none;background:repeating-linear-gradient(90deg,#aaa18d 0 21px,#817a6b 22px 24px);border-top:2px solid #d5ccb8;border-bottom:2px solid #5d574e;box-shadow:0 5px 7px #0004}
.lqFieldForestVerge{position:absolute;z-index:3;pointer-events:none;width:122px;height:72px;border-radius:50%;background:radial-gradient(circle at 20% 65%,#31502b 0 18%,transparent 19%),radial-gradient(circle at 47% 45%,#385c31 0 24%,transparent 25%),radial-gradient(circle at 76% 60%,#294a28 0 22%,transparent 23%);filter:drop-shadow(0 7px 5px #0006);opacity:.88}
.lqFieldDirectionStone{position:absolute;z-index:4;pointer-events:none;width:34px;height:46px;border-radius:15px 15px 5px 5px;background:linear-gradient(110deg,#b8b09a,#777164);border:2px solid #d6cfbd;box-shadow:0 6px 6px #0006}
.lqFieldDirectionStone:before{content:'';position:absolute;left:50%;top:9px;width:12px;height:12px;border-top:3px solid #435366;border-right:3px solid #435366;transform:translateX(-55%) rotate(45deg)}
.lqFieldDirectionStone.town:before{transform:translateX(-45%) rotate(225deg);top:20px}
.lqFieldLowShrub{position:absolute;z-index:3;pointer-events:none;width:54px;height:30px;border-radius:50%;background:radial-gradient(circle at 25% 62%,#416c36 0 28%,transparent 29%),radial-gradient(circle at 53% 42%,#4f7940 0 34%,transparent 35%),radial-gradient(circle at 80% 64%,#365e31 0 27%,transparent 28%);filter:drop-shadow(0 4px 3px #0005)}
.lqFieldEdgeVignette{position:absolute;inset:0;z-index:6;pointer-events:none;box-shadow:inset 0 0 55px #1832202c}
`;
document.head.appendChild(style);
function add(w,cls,x,y,width,height,rotate){const n=document.createElement('i');n.className=cls;n.style.left=`${x*TS}px`;n.style.top=`${y*TS}px`;if(width)n.style.width=`${width*TS}px`;if(height)n.style.height=`${height*TS}px`;if(rotate)n.style.transform=`rotate(${rotate}deg)`;w.appendChild(n);return n}
function decorate(){
 if(s.screen!=='world'||s.map!=='field')return;
 const w=app.querySelector('.world');if(!w||w.querySelector('.lqFieldHierarchyAnchor'))return;
 w.classList.add('lqFieldHierarchyWorld');const a=document.createElement('i');a.className='lqFieldHierarchyAnchor';a.hidden=true;w.appendChild(a);
 /* The route begins as capital stonework, becomes a maintained road, then bends northeast into the forest. */
 add(w,'lqFieldTownPaving',9.15,15.0,3.6,.55);
 add(w,'lqFieldRoute',9.25,9.85,2.75,6.0,0);
 add(w,'lqFieldRoute',10.35,7.85,7.3,2.0,-8);
 add(w,'lqFieldRoute',16.05,3.25,2.05,5.6,-28);
 add(w,'lqFieldRoute',18.15,.75,2.15,3.6,-38);
 /* Capital marker points back south-west; darker vegetation collects toward the forest gate. */
 add(w,'lqFieldDirectionStone town',8.45,14.65);
 add(w,'lqFieldDirectionStone',17.95,3.05);
 add(w,'lqFieldForestVerge',18.25,.45);
 [[7.8,12.2],[12.7,9.4],[16.7,6.1],[18.6,2.9],[3.6,14.2]].forEach(([x,y])=>add(w,'lqFieldLowShrub',x,y));
 add(w,'lqFieldEdgeVignette',0,0,23,18);
}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};
const renderBase=render;render=function(){const r=renderBase();decorate();return r;};
if(s.screen==='world')decorate();
window.LQ_FIELD_ROUTE_HIERARCHY_STATUS={checkpoint:'REQ-009-A',presentationOnly:true,collisionChanged:false,routeSegments:4,directionStones:2,shrubs:5};
})();