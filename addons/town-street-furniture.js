(() => {
'use strict';

/* Presentation-only town-density pass: lamps, planters, benches and civic banners. */
const style=document.createElement('style');
style.textContent=`
.lqStreetLamp{position:absolute;z-index:4;width:13px;height:57px;pointer-events:none;filter:drop-shadow(0 5px 4px #0007)}.lqStreetLamp:before{content:'';position:absolute;left:5px;top:14px;width:4px;height:43px;background:linear-gradient(90deg,#343d45,#85929a 48%,#2c3339);border-radius:3px}.lqStreetLamp:after{content:'';position:absolute;left:0;top:0;width:13px;height:18px;clip-path:polygon(22% 0,78% 0,100% 35%,82% 100%,18% 100%,0 35%);background:radial-gradient(circle,#fff0a5 0 28%,#e3b54e 30% 48%,#4d5355 50% 66%,#252a2d 68%);box-shadow:0 0 13px #f4cf6488}
.lqTownPlanter{position:absolute;z-index:3;width:62px;height:33px;border-radius:6px 6px 12px 12px;background:linear-gradient(#91704d 0 22%,#684b35 23% 100%);border:2px solid #a9855a;box-shadow:0 5px 7px #0006;pointer-events:none}.lqTownPlanter:before{content:'';position:absolute;left:5px;right:5px;top:-15px;height:22px;background:radial-gradient(circle at 13% 55%,#e38f98 0 5px,transparent 6px),radial-gradient(circle at 35% 35%,#f0cf77 0 5px,transparent 6px),radial-gradient(circle at 60% 55%,#b39bd8 0 5px,transparent 6px),radial-gradient(circle at 83% 35%,#f1e7bd 0 5px,transparent 6px),linear-gradient(transparent 0 50%,#597646 51%);filter:drop-shadow(0 2px 2px #0004)}
.lqTownBench{position:absolute;z-index:3;width:82px;height:31px;pointer-events:none;filter:drop-shadow(0 5px 5px #0006)}.lqTownBench:before{content:'';position:absolute;left:0;right:0;top:5px;height:13px;border-radius:4px;background:repeating-linear-gradient(0deg,#8b6543 0 5px,#5e432f 6px 7px);border:2px solid #4d3a2c}.lqTownBench:after{content:'';position:absolute;left:9px;right:9px;bottom:0;height:14px;border-left:5px solid #4b5153;border-right:5px solid #4b5153}
.lqCivicBanner{position:absolute;z-index:3;width:30px;height:74px;pointer-events:none;filter:drop-shadow(0 4px 4px #0006)}.lqCivicBanner:before{content:'';position:absolute;left:13px;top:0;width:4px;height:74px;background:#4c4034}.lqCivicBanner:after{content:'A';position:absolute;left:16px;top:6px;width:26px;height:46px;padding-top:9px;box-sizing:border-box;clip-path:polygon(0 0,100% 0,100% 82%,50% 100%,0 82%);background:linear-gradient(#2d5275,#1b344f);border-top:2px solid #d0b76c;color:#ead694;text-align:center;font-size:12px;font-weight:950}
@media(prefers-reduced-motion:reduce){.lqStreetLamp:after{box-shadow:0 0 9px #f4cf6455}}
`;
document.head.appendChild(style);
function addNode(w,cls,x,y){const e=document.createElement('i');e.className=cls;e.style.left=`${x*TS}px`;e.style.top=`${y*TS}px`;w.appendChild(e);}
function decorate(){
 if(s.screen!=='world'||s.map!=='town')return;const w=app.querySelector('.world');if(!w||w.querySelector('.lqStreetFurnitureAnchor'))return;
 const a=document.createElement('i');a.className='lqStreetFurnitureAnchor';a.style.display='none';w.appendChild(a);
 [[6.2,5.2],[10.8,5.2],[6.2,10.9],[10.8,10.9],[2.2,12.5],[14.8,12.5]].forEach(([x,y])=>addNode(w,'lqStreetLamp',x,y));
 [[6.6,9.7],[9.9,9.7],[6.6,11.3],[9.9,11.3]].forEach(([x,y])=>addNode(w,'lqTownPlanter',x,y));
 [[4.8,10.2],[11.4,10.2]].forEach(([x,y])=>addNode(w,'lqTownBench',x,y));
 [[7.2,4.8],[9.3,4.8],[7.2,12.0],[9.3,12.0]].forEach(([x,y])=>addNode(w,'lqCivicBanner',x,y));
}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};const renderBase=render;render=function(){const r=renderBase();decorate();return r;};if(s.screen==='world')decorate();
window.LQ_TOWN_STREET_FURNITURE_STATUS={lamps:6,planters:4,benches:2,banners:4,presentationOnly:true};
})();