(() => {
'use strict';

/* REQ-140 — iPhone compositor budget recovery.
   Presentation-only. This deliberately loads late and removes expensive
   compositor effects from the fullscreen world path without changing gameplay
   input, story, collision, map state, save data, or canonical action(). */

const STYLE_ID='lq-req140-iphone-compositor-budget-style';
const WORLD_CLASS='lqWorldFullscreen';

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
body.${WORLD_CLASS} .gameShell{
  background:#07111f!important;
}
body.${WORLD_CLASS} .gameShell>.world{
  will-change:auto!important;
  filter:none!important;
}
body.${WORLD_CLASS} .player,
body.${WORLD_CLASS} .npc,
body.${WORLD_CLASS} .glenn{
  filter:none!important;
}
body.${WORLD_CLASS} .lqWorldStatusOverlay,
body.${WORLD_CLASS} .hud .chip,
body.${WORLD_CLASS} .questGuide,
body.${WORLD_CLASS} .lqWorldControlsOverlay .dpad button,
body.${WORLD_CLASS} .lqWorldControlsOverlay .actionPad button,
body.${WORLD_CLASS} .dialogBox,
body.${WORLD_CLASS} #lqTopHudToggle,
body.${WORLD_CLASS} #lq-floating-touch-controller,
body.${WORLD_CLASS} #lq-floating-touch-controller *{
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
}
body.${WORLD_CLASS} .lqWorldStatusOverlay{background:rgba(7,17,31,.92)!important}
body.${WORLD_CLASS} .hud .chip{background:rgba(7,17,31,.88)!important}
body.${WORLD_CLASS} .questGuide{background:rgba(11,23,46,.92)!important}
body.${WORLD_CLASS} .lqWorldControlsOverlay .dpad button{background:rgba(16,41,67,.72)!important}
body.${WORLD_CLASS} .lqWorldControlsOverlay .actionPad button{background:rgba(16,41,67,.78)!important}
body.${WORLD_CLASS} .lqWorldControlsOverlay .actionPad .a{background:rgba(111,74,155,.82)!important}
body.${WORLD_CLASS} .dialogBox{background:rgba(7,17,31,.97)!important}
`;
  document.head.appendChild(style);
}

function clearStaleIntroBackdrop(){
  if(typeof s==='undefined'||!s||s.screen==='intro')return;
  document.querySelectorAll('.lqIntroBackdrop').forEach(el=>el.remove());
}

function enforceWorldBudget(){
  if(!document.body||!document.body.classList.contains(WORLD_CLASS))return;
  const world=document.querySelector('.gameShell>.world');
  if(world)world.style.willChange='auto';
  clearStaleIntroBackdrop();
}

installStyle();

const observer=new MutationObserver(()=>{
  enforceWorldBudget();
});

function start(){
  enforceWorldBudget();
  if(document.body)observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
else start();

addEventListener('pageshow',enforceWorldBudget);
addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')enforceWorldBudget();});
addEventListener('resize',enforceWorldBudget,{passive:true});
addEventListener('orientationchange',enforceWorldBudget,{passive:true});

})();
