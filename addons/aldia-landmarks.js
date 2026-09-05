(() => {
'use strict';

/* REQ-008 Checkpoint B: landmark + civic-prop layer. Presentation only, pointer transparent. */
const style=document.createElement('style');
style.textContent=`
.lqAldiaTempleFront{position:absolute;z-index:4;pointer-events:none;border:2px solid #d5d7d0;border-radius:5px 5px 2px 2px;background:linear-gradient(90deg,#766f63,#b5aa91 18%,#d1c7ae 50%,#a79b82 82%,#665f55);box-shadow:inset 0 -10px #554f4744,0 10px 12px #0006}
.lqAldiaTempleFront:before{content:'';position:absolute;left:8%;right:8%;top:-28px;height:31px;background:linear-gradient(135deg,transparent 49%,#d7d0b9 50%) left/50% 100% no-repeat,linear-gradient(225deg,transparent 49%,#c1b69d 50%) right/50% 100% no-repeat;filter:drop-shadow(0 4px 3px #0005)}
.lqAldiaTempleFront:after{content:'✦';position:absolute;left:50%;top:13px;transform:translateX(-50%);width:32px;height:32px;border:3px solid #cdb65d;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,#e7f6ff,#7ea6c5 55%,#274d74 56%);color:#f8dc78;font-size:17px;box-shadow:0 0 10px #91c6ff66}
.lqAldiaFountain{position:absolute;z-index:4;pointer-events:none;width:76px;height:44px;border-radius:50%;border:5px solid #b8b19d;background:radial-gradient(ellipse,#d8eff1 0 22%,#65a5bb 23% 52%,#3a718e 53% 62%,#999180 63%);box-shadow:0 7px 8px #0006,inset 0 3px #e9e3d2}
.lqAldiaFountain:before{content:'';position:absolute;left:31px;top:-22px;width:14px;height:34px;border-radius:6px 6px 2px 2px;background:linear-gradient(90deg,#777269,#c7c0ae,#6b675f);box-shadow:0 2px 4px #0005}
.lqAldiaFountain:after{content:'';position:absolute;left:20px;top:-17px;width:36px;height:25px;border-radius:50%;border-top:3px solid #9ee8ff;border-left:3px solid transparent;border-right:3px solid transparent;filter:drop-shadow(0 0 4px #b6efff)}
.lqAldiaMarketAwning{position:absolute;z-index:4;pointer-events:none;width:82px;height:34px;border:2px solid #59493a;border-radius:5px;background:repeating-linear-gradient(90deg,#eee0bf 0 13px,#28558e 13px 26px);box-shadow:0 7px 7px #0006}
.lqAldiaMarketAwning:after{content:'';position:absolute;left:7px;right:7px;bottom:-19px;height:19px;border-left:5px solid #614d38;border-right:5px solid #614d38}
.lqAldiaBench{position:absolute;z-index:4;pointer-events:none;width:58px;height:20px;border-radius:4px;background:linear-gradient(#98714c,#5f452f);border:2px solid #4a3b2e;box-shadow:0 6px 5px #0005}
.lqAldiaBench:after{content:'';position:absolute;left:8px;right:8px;bottom:-9px;height:9px;border-left:5px solid #3f3934;border-right:5px solid #3f3934}
.lqAldiaCrate{position:absolute;z-index:4;pointer-events:none;width:28px;height:28px;border:2px solid #4b3928;background:linear-gradient(45deg,transparent 44%,#59432e 45% 54%,transparent 55%),linear-gradient(-45deg,transparent 44%,#6a5036 45% 54%,transparent 55%),#92704a;box-shadow:0 5px 5px #0006}
.lqAldiaBarrel{position:absolute;z-index:4;pointer-events:none;width:24px;height:31px;border-radius:8px;background:linear-gradient(90deg,#65482e,#a1774b 35%,#8b633d 65%,#523923);border-top:4px solid #3d3935;border-bottom:4px solid #3d3935;box-shadow:0 5px 5px #0006}
.lqAldiaWallPennant{position:absolute;z-index:4;pointer-events:none;width:16px;height:38px;background:linear-gradient(90deg,#123a79,#3568ac,#123a79);border-top:4px solid #cab45e;clip-path:polygon(0 0,100% 0,100% 78%,50% 100%,0 78%);filter:drop-shadow(0 4px 2px #0006)}
.lqAldiaGroundShadow{position:absolute;z-index:3;pointer-events:none;height:16px;border-radius:50%;background:radial-gradient(ellipse,#0005,transparent 72%);filter:blur(1px)}
`;
document.head.appendChild(style);

function add(w,cls,x,y,width,height){
  const n=document.createElement('i');n.className=cls;n.style.left=`${x*TS}px`;n.style.top=`${y*TS}px`;
  if(width)n.style.width=`${width*TS}px`;if(height)n.style.height=`${height*TS}px`;w.appendChild(n);return n;
}
function decorate(){
  if(s.screen!=='world'||s.map!=='town')return;
  const w=app.querySelector('.world');if(!w||w.querySelector('.lqAldiaLandmarkAnchor'))return;
  const a=document.createElement('i');a.className='lqAldiaLandmarkAnchor';a.hidden=true;w.appendChild(a);

  /* The existing T footprint reads as a temple precinct rather than anonymous floor. */
  add(w,'lqAldiaGroundShadow',6.15,8.88,3.7,.42);
  add(w,'lqAldiaTempleFront',6.15,6.1,3.7,2.9);
  [[6.25,6.55],[9.5,6.55]].forEach(([x,y])=>add(w,'lqAldiaWallPennant',x,y));

  /* Civic plaza landmark and small lived-in clusters near the side districts. */
  add(w,'lqAldiaFountain',8.2,10.15);
  add(w,'lqAldiaMarketAwning',2.05,10.65);
  add(w,'lqAldiaMarketAwning',12.25,10.65);
  [[5.75,10.2],[10.95,10.2],[2.25,7.15],[14.4,7.15]].forEach(([x,y])=>add(w,'lqAldiaBench',x,y));
  [[2.15,12.25],[13.85,12.15],[14.55,12.15]].forEach(([x,y])=>add(w,'lqAldiaCrate',x,y));
  [[2.85,12.2],[13.25,12.2],[15.1,5.15]].forEach(([x,y])=>add(w,'lqAldiaBarrel',x,y));
}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};
const renderBase=render;render=function(){const r=renderBase();decorate();return r;};
if(s.screen==='world')decorate();
window.LQ_ALDIA_LANDMARK_STATUS={checkpoint:'B',presentationOnly:true,collisionChanged:false,temple:1,fountain:1,marketAwnings:2,benches:4,crates:3,barrels:3};
})();