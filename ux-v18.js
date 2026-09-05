(() => {
'use strict';

/* LUKE QUEST v0.18 Royal Capital visual-density pass.
   Adds plaza identity, fountain, market awnings, lamps, flower beds and readable building signs
   without changing collision, story coordinates or exits. */

const tileClassV17=tileClass;
tileClass=function(c){
  const base=tileClassV17(c);
  if(s.map!=='town')return base;
  if(c==='.')return `${base} lqTownGrassDetail`;
  if(c==='T')return `${base} lqTownPlazaStone`;
  if(c==='H')return `${base} lqTownRoofDetail`;
  return base;
};

const style=document.createElement('style');
style.textContent=`
.tile.lqTownGrassDetail{background:
  radial-gradient(circle at 20% 25%,#9ccf68 0 2px,transparent 3px),
  radial-gradient(circle at 74% 68%,#436f36 0 2px,transparent 3px),
  linear-gradient(135deg,#6caa4f,#4f8f42)}
.tile.lqTownPlazaStone{background:linear-gradient(135deg,#d8c28f 0 48%,#bca474 48% 52%,#cfb783 52%);box-shadow:inset 0 0 0 1px #fff7cf36}
.tile.lqTownRoofDetail{background:repeating-linear-gradient(0deg,#8e3b38 0 8px,#a94b43 8px 16px);box-shadow:inset 0 -6px #55282666,inset 0 2px #e0806b44}
.lqTownFountain{position:absolute;z-index:4;width:78px;height:54px;border-radius:50%;background:radial-gradient(ellipse at center,#8ed7ee 0 31%,#448cad 34% 44%,#d6c18c 47% 64%,#8f7a55 68%);border:3px solid #dfcf9d;box-shadow:0 6px 12px #0006,inset 0 0 12px #dfffff99;pointer-events:none}
.lqTownFountain:before{content:"";position:absolute;left:31px;top:-22px;width:12px;height:36px;border-radius:10px;background:linear-gradient(#c8b98d,#7d7053);border:2px solid #e4d8ad}
.lqTownFountain:after{content:"";position:absolute;left:33px;top:-24px;width:8px;height:26px;border-radius:50%;background:linear-gradient(#b8edff99,#5ec4e9cc);filter:drop-shadow(0 0 4px #baf3ff)}
.lqTownFlowerBed{position:absolute;z-index:3;height:22px;border-radius:9px;background:
 radial-gradient(circle at 14% 45%,#ffdf65 0 3px,transparent 4px),
 radial-gradient(circle at 34% 55%,#ff8292 0 3px,transparent 4px),
 radial-gradient(circle at 58% 38%,#e6a4ff 0 3px,transparent 4px),
 radial-gradient(circle at 78% 55%,#fff0a0 0 3px,transparent 4px),#3f7838;border:2px solid #9b7449;box-shadow:0 3px 7px #0005;pointer-events:none}
.lqTownStall{position:absolute;z-index:4;width:86px;height:48px;background:linear-gradient(#8a5a34,#644124);border:3px solid #b9854e;border-radius:5px;box-shadow:0 6px 10px #0007;pointer-events:none}
.lqTownStall:before{content:"";position:absolute;left:-5px;right:-5px;top:-17px;height:21px;background:repeating-linear-gradient(90deg,#e7c767 0 14px,#9f3f45 14px 28px);border:2px solid #f3df9b;border-radius:8px 8px 2px 2px}
.lqTownLamp{position:absolute;z-index:5;width:8px;height:36px;background:#342f2a;border-radius:5px;box-shadow:0 4px 7px #0008;pointer-events:none}
.lqTownLamp:before{content:"";position:absolute;left:-8px;top:-13px;width:24px;height:20px;background:radial-gradient(circle,#ffe692 0 28%,#e69d37 31% 44%,#5c4d36 48%);border-radius:50%;filter:drop-shadow(0 0 7px #ffd66d99)}
.lqBuildingSign{position:absolute;z-index:7;transform:translate(-50%,-100%);background:#172231eb;border:2px solid #d7b35f;border-radius:8px;padding:4px 7px;color:#fff2bd;font-weight:950;font-size:10px;white-space:nowrap;box-shadow:0 4px 9px #0008;pointer-events:none}
.lqTownBanner{position:absolute;z-index:3;width:26px;height:54px;background:linear-gradient(90deg,#214e8b,#2f6ab4);border:2px solid #d5b65d;clip-path:polygon(0 0,100% 0,100% 84%,50% 100%,0 84%);filter:drop-shadow(0 4px 4px #0006);pointer-events:none}
`;
document.head.appendChild(style);

function el(cls,left,top,w,h){
  const n=document.createElement('div');n.className=cls;n.style.left=`${left}px`;n.style.top=`${top}px`;
  if(w!=null)n.style.width=`${w}px`;if(h!=null)n.style.height=`${h}px`;return n;
}
function sign(world,text,x,y){
  const n=el('lqBuildingSign',x*TS+TS/2,y*TS+8);n.textContent=text;world.appendChild(n);
}
function decorateCapital(){
  if(s.screen!=='world'||s.map!=='town')return;
  const worldEl=app.querySelector('.world');
  if(!worldEl||worldEl.querySelector('.lqTownFountain'))return;

  const fountain=el('lqTownFountain',7.2*TS,7.35*TS);worldEl.appendChild(fountain);
  const flowersA=el('lqTownFlowerBed',2*TS,10.55*TS,4*TS-10,22);worldEl.appendChild(flowersA);
  const flowersB=el('lqTownFlowerBed',11*TS,10.55*TS,4*TS-10,22);worldEl.appendChild(flowersB);

  const stallA=el('lqTownStall',1.7*TS,8.7*TS);worldEl.appendChild(stallA);
  const stallB=el('lqTownStall',13.4*TS,8.7*TS);worldEl.appendChild(stallB);

  for(const [x,y] of [[6.8,11.1],[10.8,11.1],[7.1,5.3],[10.6,5.3]])worldEl.appendChild(el('lqTownLamp',x*TS,y*TS));
  for(const [x,y] of [[6.2,12.0],[10.7,12.0]])worldEl.appendChild(el('lqTownBanner',x*TS,y*TS));

  sign(worldEl,'南門宿',5,11.95);
  sign(worldEl,'ミナの道具屋',13,10.95);
  sign(worldEl,'王都中央広場',8.35,6.55);
}

const worldV17=world;
world=function(){worldV17();decorateCapital();};
const renderV17=render;
render=function(){const r=renderV17();if(s.screen==='world'&&s.map==='town')decorateCapital();return r;};

window.LQ_TOWN_VISUAL_DENSITY={fountain:true,marketStalls:2,flowerBeds:2,lamps:4,banners:2,buildingSigns:3};
if(s.screen==='world')render();
})();
