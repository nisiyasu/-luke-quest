(() => {
'use strict';

/* LUKE QUEST v0.19 field visual-density pass.
   Adds roadside flowers, stones, grass tufts, signpost and route framing to 王都近郊
   without changing collision, exits, encounters or story state. */

const tileClassV18=tileClass;
tileClass=function(c){
  const base=tileClassV18(c);
  if(s.map!=='field')return base;
  if(c==='.')return `${base} lqFieldGrassDetail`;
  if(c==='G')return `${base} lqFieldRoadGate`;
  if(c==='F')return `${base} lqFieldForestGate`;
  return base;
};

const style=document.createElement('style');
style.textContent=`
.tile.lqFieldGrassDetail{background:
 radial-gradient(circle at 20% 18%,#a1ca69 0 2px,transparent 3px),
 radial-gradient(circle at 82% 70%,#416e38 0 2px,transparent 3px),
 linear-gradient(135deg,#62994a,#4f853f)}
.tile.lqFieldRoadGate{background:linear-gradient(135deg,#a99369,#c2ab7b);box-shadow:inset 0 0 0 2px #efe0ac33}
.tile.lqFieldForestGate{background:linear-gradient(#285d34,#1e4829);box-shadow:inset 0 0 15px #081d11aa}
.lqFieldTuft{position:absolute;z-index:3;width:26px;height:18px;background:linear-gradient(65deg,transparent 0 23%,#315f32 24% 31%,transparent 32% 46%,#3d7439 47% 55%,transparent 56% 69%,#2d5d31 70% 78%,transparent 79%);filter:drop-shadow(0 2px 2px #0005);pointer-events:none}
.lqFieldFlowers{position:absolute;z-index:3;width:50px;height:26px;background:
 radial-gradient(circle at 12% 48%,#fff2a1 0 3px,transparent 4px),
 radial-gradient(circle at 34% 32%,#e9a1ff 0 3px,transparent 4px),
 radial-gradient(circle at 57% 62%,#ffd664 0 3px,transparent 4px),
 radial-gradient(circle at 80% 38%,#ff93a2 0 3px,transparent 4px);pointer-events:none}
.lqFieldPebbles{position:absolute;z-index:3;width:46px;height:24px;background:
 radial-gradient(ellipse at 18% 61%,#7c786d 0 5px,transparent 6px),
 radial-gradient(ellipse at 49% 31%,#938d80 0 4px,transparent 5px),
 radial-gradient(ellipse at 79% 68%,#69685f 0 6px,transparent 7px);filter:drop-shadow(0 2px 1px #0005);pointer-events:none}
.lqFieldSignpost{position:absolute;z-index:6;width:9px;height:58px;background:#5b4025;border-radius:4px;box-shadow:0 4px 7px #0007;pointer-events:none}
.lqFieldSignpost:before{content:"王都 ←　　魔物の森 ↗";position:absolute;left:-78px;top:-4px;width:166px;height:28px;background:linear-gradient(#a77b43,#76532e);border:2px solid #d2a663;border-radius:5px;color:#fff0bd;font-size:9px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 7px #0007}
.lqFieldMilestone{position:absolute;z-index:4;width:28px;height:38px;background:linear-gradient(#aaa28d,#746f64);border:2px solid #d6cfba;border-radius:11px 11px 4px 4px;box-shadow:0 4px 7px #0006;pointer-events:none}
.lqFieldMilestone:after{content:"王都 1";position:absolute;inset:8px 2px auto;text-align:center;color:#302e2a;font-size:7px;font-weight:950;line-height:1.1}
.lqFieldRouteGlow{position:absolute;z-index:2;height:10px;border-radius:99px;background:linear-gradient(90deg,transparent,#dbc79255,transparent);filter:blur(1px);pointer-events:none}
`;
document.head.appendChild(style);

function fieldDecor(cls,x,y){const n=document.createElement('div');n.className=cls;n.style.left=`${x*TS}px`;n.style.top=`${y*TS}px`;return n;}
function decorateFieldV19(){
  if(s.screen!=='world'||s.map!=='field')return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqFieldSignpost'))return;

  for(const [x,y] of [[2.2,1.6],[8.1,2.2],[15.2,2.1],[3.4,10.0],[17.7,9.6],[12.2,14.8],[20.2,14.7]])w.appendChild(fieldDecor('lqFieldTuft',x,y));
  for(const [x,y] of [[7.1,5.0],[15.7,5.3],[3.2,14.2],[18.1,12.1]])w.appendChild(fieldDecor('lqFieldFlowers',x,y));
  for(const [x,y] of [[9.4,4.5],[13.8,10.5],[2.1,9.0],[18.3,15.2]])w.appendChild(fieldDecor('lqFieldPebbles',x,y));

  const sign=fieldDecor('lqFieldSignpost',11.0,12.2);w.appendChild(sign);
  const mile=fieldDecor('lqFieldMilestone',8.7,15.2);w.appendChild(mile);

  const glow=document.createElement('div');glow.className='lqFieldRouteGlow';glow.style.left=`${9.2*TS}px`;glow.style.top=`${14.9*TS}px`;glow.style.width=`${4.4*TS}px`;w.appendChild(glow);
}

const worldV18=world;
world=function(){worldV18();decorateFieldV19();};
const renderV18=render;
render=function(){const r=renderV18();if(s.screen==='world'&&s.map==='field')decorateFieldV19();return r;};

window.LQ_FIELD_VISUAL_DENSITY={grassTufts:7,flowerClusters:4,pebbleClusters:4,signpost:1,milestone:1};
if(s.screen==='world')render();
})();
