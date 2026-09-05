(() => {
'use strict';

/* Presentation-only PS1-early density pass for mist, observation and evacuation routes. */
const style=document.createElement('style');style.textContent=`
.lqRouteStake{position:absolute;z-index:3;width:11px;height:46px;background:linear-gradient(90deg,#554636,#8b7152 45%,#46392f);border-radius:2px;box-shadow:0 5px 4px #0007;pointer-events:none}.lqRouteStake:after{content:'';position:absolute;left:-8px;top:7px;width:28px;height:13px;background:#66513c;clip-path:polygon(0 15%,100% 0,88% 100%,0 88%)}
.lqSupplyCrate{position:absolute;z-index:3;width:44px;height:35px;border:3px solid #3e3329;background:linear-gradient(135deg,#72553d 0 46%,#4f3b2e 47% 54%,#7b5a40 55%);box-shadow:0 5px 6px #0008,inset 0 0 0 2px #a77c5044;pointer-events:none}.lqSupplyCrate:after{content:'';position:absolute;left:4px;right:4px;top:14px;height:4px;background:#332a23}
.lqBlackBanner{position:absolute;z-index:3;width:39px;height:88px;pointer-events:none;filter:drop-shadow(0 5px 5px #0008)}.lqBlackBanner:before{content:'';position:absolute;left:7px;top:0;width:5px;height:88px;background:#35383b}.lqBlackBanner:after{content:'';position:absolute;left:11px;top:7px;width:28px;height:55px;background:linear-gradient(#252730,#3d2734);clip-path:polygon(0 0,100% 7%,94% 86%,52% 100%,0 88%);border-top:2px solid #6c4f6d}
.lqRopeBarrier{position:absolute;z-index:2;width:105px;height:30px;pointer-events:none}.lqRopeBarrier:before{content:'';position:absolute;left:3px;right:3px;top:13px;height:4px;background:repeating-linear-gradient(90deg,#8f7454 0 7px,#554739 8px 12px);transform:rotate(-3deg)}.lqRopeBarrier:after{content:'';position:absolute;left:0;top:0;width:7px;height:30px;background:#59504a;box-shadow:95px 0 #59504a}
.lqColdLantern{position:absolute;z-index:4;width:18px;height:48px;pointer-events:none;filter:drop-shadow(0 0 7px #9ac6ca55) drop-shadow(0 5px 4px #0007)}.lqColdLantern:before{content:'';position:absolute;left:7px;top:14px;width:4px;height:34px;background:#40474d}.lqColdLantern:after{content:'';position:absolute;left:1px;top:0;width:16px;height:20px;clip-path:polygon(25% 0,75% 0,100% 30%,80% 100%,20% 100%,0 30%);background:radial-gradient(circle,#d4eff0 0 27%,#6e999f 29% 48%,#333a40 50%)}
`;
document.head.appendChild(style);
const layouts={
 mistTrail:[['lqRouteStake',4.2,6.2],['lqRouteStake',21.0,15.1],['lqColdLantern',11.4,18.2],['lqRopeBarrier',19.1,4.5]],
 observation:[['lqSupplyCrate',4.3,12.7],['lqSupplyCrate',24.2,5.2],['lqBlackBanner',11.1,3.3],['lqBlackBanner',25.4,16.0],['lqRopeBarrier',8.2,18.1]],
 evacRoute:[['lqRouteStake',5.0,10.4],['lqRouteStake',20.4,4.1],['lqSupplyCrate',12.1,15.3],['lqColdLantern',23.0,17.4],['lqRopeBarrier',3.3,6.6]]
};
function decorate(){const cfg=layouts[s.map];if(s.screen!=='world'||!cfg)return;const w=app.querySelector('.world');if(!w||w.querySelector('.lqNorthRoutePropAnchor'))return;const a=document.createElement('i');a.className='lqNorthRoutePropAnchor';a.style.display='none';w.appendChild(a);for(const [cls,x,y] of cfg){const e=document.createElement('i');e.className=cls;e.style.left=`${x*TS}px`;e.style.top=`${y*TS}px`;w.appendChild(e);}}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};const renderBase=render;render=function(){const r=renderBase();decorate();return r;};if(s.screen==='world')decorate();window.LQ_NORTH_ROUTE_PROP_STATUS={maps:Object.keys(layouts),presentationOnly:true,spoilerSafe:true};
})();