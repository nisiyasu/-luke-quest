(() => {
'use strict';

/* REQ-008 Checkpoint A: presentation-only Aldia density pass. No collision or event coordinates are changed. */
const style=document.createElement('style');
style.textContent=`
.lqAldiaWorld .tile.grass{background:linear-gradient(135deg,#66844d 0 24%,#5c7946 25% 49%,#6c8953 50% 74%,#607d49 75%);box-shadow:inset 0 0 0 1px #33482a55}
.lqAldiaWorld .tile.wall{background:linear-gradient(135deg,#887d6c,#625b51 58%,#4f4a43);box-shadow:inset 0 -7px #403c36,inset 0 2px #aaa08e}
.lqAldiaWorld .tile.roof{background:linear-gradient(160deg,#6f3041,#a84b4c 45%,#6d2939 46% 70%,#4a2230);box-shadow:inset 0 3px #d17b67,inset 0 -5px #3d1e27}
.lqAldiaWorld .tile.floor{background:linear-gradient(135deg,#d8ceb0 0 47%,#bbaa82 48% 52%,#cfc39f 53%);box-shadow:inset 0 0 0 2px #efe5c866,inset 0 -5px #8e805e55}
.lqAldiaWorld .tile.gate{background:linear-gradient(90deg,#756750,#a4936e 35%,#b7a67d 50%,#8a795c 70%,#5f5445);box-shadow:inset 0 3px #d3c393,inset 0 -6px #433c32}
.lqAldiaRoad{position:absolute;z-index:2;pointer-events:none;border:1px solid #7c766a;background:linear-gradient(90deg,#7b766b 0 8%,#a39c8c 9% 18%,#898377 19% 28%,#aaa293 29% 38%,#817b70 39% 48%,#aaa293 49% 58%,#858074 59% 68%,#a49d8e 69% 78%,#7d786d 79% 100%);box-shadow:inset 8px 0 #524d4655,inset -8px 0 #524d4655,0 5px 8px #0004}
.lqAldiaRoad:after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 21px,#5d585144 22px 24px);mix-blend-mode:multiply}
.lqAldiaPlaza{position:absolute;z-index:2;pointer-events:none;border:2px solid #b1a98f;background:radial-gradient(circle at 50% 50%,#b7ae97 0 10%,#918a78 11% 13%,transparent 14%),repeating-conic-gradient(from 45deg,#9d9684 0 12.5%,#aaa28e 0 25%);box-shadow:inset 0 0 0 8px #716b5f88,0 8px 12px #0004}
.lqAldiaBuildingFacade{position:absolute;z-index:4;pointer-events:none;border:2px solid #d2c6a1;border-radius:4px;background:linear-gradient(#d8c9a6 0 14%,#a38f6d 15% 74%,#675b49 75%);box-shadow:inset 0 0 0 3px #695d4933,0 9px 9px #0007}
.lqAldiaBuildingFacade:before{content:'';position:absolute;left:-5px;right:-5px;top:-13px;height:18px;border:2px solid #e0a578;background:linear-gradient(#a84c50,#6c2c3d);clip-path:polygon(5% 100%,16% 0,84% 0,95% 100%);box-shadow:0 5px 6px #0005}
.lqAldiaBuildingFacade:after{content:'';position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:28px;height:34px;border:2px solid #40382e;background:linear-gradient(90deg,#4d3e31,#6f5a45 48%,#352c25 49%);box-shadow:inset 0 0 0 3px #93826566}
.lqAldiaWindow{position:absolute;z-index:5;pointer-events:none;width:24px;height:22px;border:3px solid #4f4537;border-radius:3px;background:linear-gradient(135deg,#b8e3df,#5f8d9d 60%,#355363);box-shadow:inset 0 0 0 2px #e9dbad55,0 3px 4px #0005}
.lqAldiaLamp{position:absolute;z-index:5;pointer-events:none;width:8px;height:38px;border-radius:3px;background:linear-gradient(90deg,#302f32,#79746c,#242428);box-shadow:0 4px 5px #0007}
.lqAldiaLamp:before{content:'';position:absolute;left:-8px;top:-12px;width:22px;height:18px;border:2px solid #776e58;border-radius:6px 6px 3px 3px;background:radial-gradient(circle,#fff0a8 0 26%,#d6a94d 27% 52%,#55482c 53%);box-shadow:0 0 12px #ffd76688}
.lqAldiaBanner{position:absolute;z-index:5;pointer-events:none;width:22px;height:47px;background:linear-gradient(90deg,#173b79,#2f67b9 52%,#16366e);border:2px solid #b8c2c7;border-top:5px solid #d9b95e;clip-path:polygon(0 0,100% 0,100% 78%,50% 100%,0 78%);filter:drop-shadow(0 5px 3px #0006)}
.lqAldiaBanner:after{content:'✦';position:absolute;left:50%;top:12px;transform:translateX(-50%);color:#f5d36a;font-size:12px}
.lqAldiaPlanter{position:absolute;z-index:4;pointer-events:none;width:42px;height:22px;border-radius:4px 4px 10px 10px;background:linear-gradient(#8b6a4d,#503a2d);box-shadow:0 5px 5px #0005}
.lqAldiaPlanter:before{content:'';position:absolute;left:3px;right:3px;top:-13px;height:17px;background:radial-gradient(circle at 15% 70%,#f0d275 0 4px,transparent 5px),radial-gradient(circle at 42% 45%,#d49bcb 0 4px,transparent 5px),radial-gradient(circle at 72% 64%,#eee5c5 0 4px,transparent 5px),linear-gradient(transparent 50%,#457144 51%)}
.lqAldiaEdgeShade{position:absolute;z-index:3;pointer-events:none;background:linear-gradient(90deg,#0005,transparent);}
`;
document.head.appendChild(style);

function el(w,cls,x,y,width,height){
  const n=document.createElement('i');
  n.className=cls;
  n.style.left=`${x*TS}px`;
  n.style.top=`${y*TS}px`;
  if(width)n.style.width=`${width*TS}px`;
  if(height)n.style.height=`${height*TS}px`;
  w.appendChild(n);
  return n;
}

function decorateAldia(){
  if(s.screen!=='world'||s.map!=='town')return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqAldiaPresentationAnchor'))return;
  w.classList.add('lqAldiaWorld');
  const anchor=document.createElement('i');
  anchor.className='lqAldiaPresentationAnchor';
  anchor.hidden=true;
  w.appendChild(anchor);

  /* Main south-to-temple boulevard plus east-west civic crossing. */
  el(w,'lqAldiaRoad',7.55,9.7,2.9,5.25);
  el(w,'lqAldiaRoad',5.7,5.0,6.3,1.1);
  el(w,'lqAldiaPlaza',6.25,9.65,5.5,2.05);

  /* Two southern-facing civic facades overlay the existing H building footprints. */
  el(w,'lqAldiaBuildingFacade',3.05,2.15,2.9,2.75);
  el(w,'lqAldiaBuildingFacade',10.05,2.15,2.9,2.75);
  [[3.45,3.0],[5.05,3.0],[10.45,3.0],[12.05,3.0]].forEach(([x,y])=>el(w,'lqAldiaWindow',x,y));

  /* Royal-blue wayfinding and warm lamps keep the main route readable without text. */
  [[7.1,5.2],[10.55,5.2],[7.1,12.0],[10.55,12.0]].forEach(([x,y])=>el(w,'lqAldiaLamp',x,y));
  [[6.55,5.0],[11.15,5.0],[6.55,12.0],[11.15,12.0]].forEach(([x,y])=>el(w,'lqAldiaBanner',x,y));
  [[2.15,6.25],[13.55,6.25],[4.75,11.7],[12.3,11.7]].forEach(([x,y])=>el(w,'lqAldiaPlanter',x,y));

  /* Soft wall-edge depth. */
  const left=el(w,'lqAldiaEdgeShade',0,1,0.45,14);left.style.background='linear-gradient(90deg,#0007,transparent)';
  const right=el(w,'lqAldiaEdgeShade',17.55,1,0.45,14);right.style.background='linear-gradient(270deg,#0007,transparent)';
}

const worldBase=world;
world=function(){const r=worldBase();decorateAldia();return r;};
const renderBase=render;
render=function(){const r=renderBase();decorateAldia();return r;};
if(s.screen==='world')decorateAldia();
window.LQ_ALDIA_VISUAL_DENSITY_STATUS={checkpoint:'A',presentationOnly:true,collisionChanged:false,roads:2,plaza:1,facades:2,lamps:4,banners:4,planters:4};
})();