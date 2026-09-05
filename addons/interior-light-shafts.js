(() => {
'use strict';

/* Collision-safe add-on: layered window light and dust for physical interiors. */
const INTERIORS=new Set(['innInterior','innGuestRoom','shopInterior','shopStockRoom','templeInterior','templeRecordRoom','residenceInterior']);
const style=document.createElement('style');
style.textContent=`
.lqInteriorLightLayer{position:absolute;inset:0;z-index:5;pointer-events:none;overflow:hidden}
.lqInteriorShaft{position:absolute;width:145px;height:230px;top:22px;transform:skewX(-13deg) rotate(-4deg);transform-origin:top center;background:linear-gradient(180deg,#fff2bd32 0%,#ffe09a18 48%,transparent 100%);filter:blur(.2px);mix-blend-mode:screen;opacity:.78}
.lqInteriorShaft.one{left:14%}.lqInteriorShaft.two{right:13%;opacity:.45;transform:skewX(12deg) rotate(5deg)}
.lqInteriorDust{position:absolute;width:3px;height:3px;border-radius:50%;background:#ffe7a8aa;box-shadow:0 0 4px #ffe5a777;animation:lqInteriorDust 5.4s linear infinite}
.lqInteriorDust.d1{left:23%;top:34%;animation-delay:-1.1s}.lqInteriorDust.d2{left:39%;top:57%;animation-delay:-3.8s}.lqInteriorDust.d3{right:27%;top:42%;animation-delay:-2.2s}.lqInteriorDust.d4{right:39%;top:66%;animation-delay:-4.6s}
.lqInteriorLightLayer.temple .lqInteriorShaft{background:linear-gradient(180deg,#e7eeff38,#c8d4ff1a 48%,transparent)}
.lqInteriorLightLayer.shop .lqInteriorShaft{opacity:.56}
@keyframes lqInteriorDust{0%{transform:translate(0,10px);opacity:0}15%{opacity:.7}70%{opacity:.45}100%{transform:translate(18px,-40px);opacity:0}}
@media(prefers-reduced-motion:reduce){.lqInteriorDust{animation:none;opacity:.35}}
`;
document.head.appendChild(style);
function addInteriorLight(){
 if(s.screen!=='world'||!INTERIORS.has(s.map))return;
 const worldEl=app.querySelector('.world');if(!worldEl||worldEl.querySelector('.lqInteriorLightLayer'))return;
 const layer=document.createElement('div');
 layer.className=`lqInteriorLightLayer ${(s.map==='templeInterior'||s.map==='templeRecordRoom')?'temple':(s.map==='shopInterior'||s.map==='shopStockRoom')?'shop':''}`;
 layer.innerHTML='<i class="lqInteriorShaft one"></i><i class="lqInteriorShaft two"></i><i class="lqInteriorDust d1"></i><i class="lqInteriorDust d2"></i><i class="lqInteriorDust d3"></i><i class="lqInteriorDust d4"></i>';
 worldEl.appendChild(layer);
}
const worldBase=world;world=function(){const r=worldBase();addInteriorLight();return r;};
const renderBase=render;render=function(){const r=renderBase();addInteriorLight();return r;};
if(s.screen==='world')addInteriorLight();
window.LQ_INTERIOR_LIGHT_STATUS={maps:[...INTERIORS],presentationOnly:true,reducedMotion:true};
})();
