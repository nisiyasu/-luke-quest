(() => {
'use strict';

/* LUKE QUEST v0.30 iPhone/PWA shell integration. */

function ensureLink(rel,href,attrs={}){
  let el=document.querySelector(`link[rel="${rel}"]`);
  if(!el){el=document.createElement('link');el.rel=rel;document.head.appendChild(el);}
  el.href=href;Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;
}
function ensureMeta(name,content){
  let el=document.querySelector(`meta[name="${name}"]`);
  if(!el){el=document.createElement('meta');el.name=name;document.head.appendChild(el);}
  el.content=content;return el;
}

ensureLink('manifest','manifest.webmanifest');
ensureLink('icon','assets/app-icon.svg',{type:'image/svg+xml'});
ensureMeta('theme-color','#102f54');
ensureMeta('apple-mobile-web-app-capable','yes');
ensureMeta('apple-mobile-web-app-status-bar-style','black-translucent');
ensureMeta('apple-mobile-web-app-title','LUKE QUEST');
ensureMeta('mobile-web-app-capable','yes');

document.documentElement.style.setProperty('--lq-safe-top','env(safe-area-inset-top, 0px)');
document.documentElement.style.setProperty('--lq-safe-bottom','env(safe-area-inset-bottom, 0px)');

const style=document.createElement('style');
style.textContent=`
body{padding-top:max(12px,var(--lq-safe-top));padding-bottom:max(14px,var(--lq-safe-bottom));overscroll-behavior-y:none;-webkit-tap-highlight-color:transparent}
button{touch-action:manipulation}.controls{padding-bottom:max(4px,var(--lq-safe-bottom))}
@media(display-mode:standalone){body{background:linear-gradient(180deg,#07121e,#0b1420);user-select:none;-webkit-user-select:none}.foot:after{content:" • HOME SCREEN";color:#7590aa}}
`;
document.head.appendChild(style);

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}),{once:true});}

window.LQ_PWA_STATUS={manifest:true,serviceWorker:true,standaloneMeta:true,safeArea:true,appIcon:'assets/app-icon.svg'};
})();
