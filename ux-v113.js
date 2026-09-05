(() => {
'use strict';

/* LUKE QUEST v0.113 interior lighting atmosphere.
   Adds distinct warm/shop/temple light identity to the three walkable Royal Capital interiors. */

const style=document.createElement('style');
style.textContent=`
.lqInteriorLight{position:absolute;inset:0;z-index:13;pointer-events:none;overflow:hidden;mix-blend-mode:screen}
.lqInteriorLight.inn:before{content:"";position:absolute;left:8%;top:12%;width:42%;height:46%;border-radius:50%;background:radial-gradient(circle,#ffbd5b38 0 16%,#ff8d2820 35%,transparent 70%);filter:blur(3px);animation:lqFireGlow 1.7s ease-in-out infinite alternate}.lqInteriorLight.inn:after{content:"";position:absolute;right:8%;top:4%;width:34%;height:54%;background:linear-gradient(155deg,#ffd9891a,transparent 65%);clip-path:polygon(34% 0,100% 0,62% 100%,0 100%)}
.lqInteriorLight.shop:before,.lqInteriorLight.shop:after{content:"";position:absolute;top:6%;width:34%;height:55%;background:radial-gradient(ellipse at 50% 0,#ffe1a72e,transparent 68%);filter:blur(2px)}.lqInteriorLight.shop:before{left:7%}.lqInteriorLight.shop:after{right:7%}.lqInteriorLight.shop{background:linear-gradient(180deg,#ffd79009,transparent 48%,#1f110912)}
.lqInteriorLight.temple:before,.lqInteriorLight.temple:after{content:"";position:absolute;top:-10%;width:29%;height:76%;background:linear-gradient(170deg,#d9ecff34 0,#c4e5ff18 43%,transparent 75%);filter:blur(1px);clip-path:polygon(24% 0,72% 0,100% 100%,0 100%)}.lqInteriorLight.temple:before{left:18%;transform:rotate(4deg)}.lqInteriorLight.temple:after{right:18%;transform:rotate(-4deg)}.lqInteriorLight.temple{background:radial-gradient(circle at 50% 24%,#d8ecff13,transparent 45%)}
@keyframes lqFireGlow{from{opacity:.65;transform:scale(.97)}to{opacity:1;transform:scale(1.04)}}
@media(prefers-reduced-motion:reduce){.lqInteriorLight.inn:before{animation:none}}
`;
document.head.appendChild(style);
const INTERIORS={innInterior:'inn',shopInterior:'shop',templeInterior:'temple'};
function addInteriorLight(){
 if(s.screen!=='world')return;const theme=INTERIORS[s.map],shell=app.querySelector('.gameShell');if(!theme||!shell||shell.querySelector('.lqInteriorLight'))return;
 const layer=document.createElement('div');layer.className=`lqInteriorLight ${theme}`;layer.setAttribute('aria-hidden','true');shell.appendChild(layer);
}
const renderV112=render;render=function(){const r=renderV112();addInteriorLight();return r;};
queueMicrotask(addInteriorLight);
window.LQ_INTERIOR_LIGHT_STATUS={inn:true,shop:true,temple:true,pointerSafe:true};
})();