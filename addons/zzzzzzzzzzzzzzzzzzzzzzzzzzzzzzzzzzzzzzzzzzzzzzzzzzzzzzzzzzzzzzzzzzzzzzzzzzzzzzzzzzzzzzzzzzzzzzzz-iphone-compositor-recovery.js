(() => {
'use strict';

/* Emergency iPhone/WebKit compositor recovery.
   Presentation-only. It deliberately removes expensive visual compositing on
   coarse/mobile world play while leaving gameplay, save, collision and input
   authority untouched. Physical iPhone verification remains Owner-only. */

const STYLE_ID='lq-iphone-compositor-black-screen-recovery';

function installSafeStyle(){
  let style=document.getElementById(STYLE_ID);
  if(style)return style;
  style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
@media (max-width:430px),(pointer:coarse){
  body.lqWorldFullscreen .gameShell{background:#07111f!important;transform:none!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;isolation:auto!important}
  body.lqWorldFullscreen .gameShell>.world{display:block!important;visibility:visible!important;opacity:1!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;isolation:auto!important;will-change:auto!important}
  body.lqWorldFullscreen .gameShell>.world .tile{visibility:visible!important;opacity:1!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;isolation:auto!important;will-change:auto!important}
  body.lqWorldFullscreen .gameShell>.world .tile.lqDepthTile{filter:none!important;isolation:auto!important}
  body.lqWorldFullscreen .gameShell>.world .tile.lqDepthTile::before,
  body.lqWorldFullscreen .gameShell>.world .tile.lqDepthTile::after{display:none!important;filter:none!important}
  body.lqWorldFullscreen .gameShell>.world .player,
  body.lqWorldFullscreen .gameShell>.world .npc{visibility:visible!important;opacity:1!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;will-change:auto!important}
  body.lqWorldFullscreen .lqAmbientLayer{display:none!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;contain:none!important}
  body.lqWorldFullscreen .lqWorldStatusOverlay,
  body.lqWorldFullscreen .hud .chip,
  body.lqWorldFullscreen .questGuide,
  body.lqWorldFullscreen .lqWorldControlsOverlay,
  body.lqWorldFullscreen .lqWorldControlsOverlay .dpad,
  body.lqWorldFullscreen .lqWorldControlsOverlay .dpad button,
  body.lqWorldFullscreen .lqWorldControlsOverlay .actionPad,
  body.lqWorldFullscreen .lqWorldControlsOverlay .actionPad button,
  body.lqWorldFullscreen .dialogBox,
  body.lqWorldFullscreen #lq-music-toggle,
  body.lqWorldFullscreen #lqTopHudToggle{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;filter:none!important}
  body.lqWorldFullscreen .lqWorldControlsOverlay{background:transparent!important;background-image:none!important;box-shadow:none!important}
}
`;
  document.head.appendChild(style);
  return style;
}

function reinforceWorld(){
  installSafeStyle();
  if(typeof s==='undefined'||!s||s.screen!=='world')return false;
  const shell=document.querySelector('.gameShell');
  const world=shell?.querySelector('.world');
  if(!shell||!world)return false;
  shell.style.setProperty('background','#07111f','important');
  world.style.setProperty('display','block','important');
  world.style.setProperty('visibility','visible','important');
  world.style.setProperty('opacity','1','important');
  for(const el of world.querySelectorAll('.tile,.player,.npc')){
    el.style.setProperty('visibility','visible','important');
    el.style.setProperty('opacity','1','important');
  }
  return true;
}

function scheduleReinforce(){
  requestAnimationFrame(()=>requestAnimationFrame(reinforceWorld));
}

/* Append this style after the synchronous add-on stack so it wins equivalent
   presentation rules even if filename ordering changes later. */
setTimeout(()=>{installSafeStyle();reinforceWorld();},0);
window.addEventListener('pageshow',scheduleReinforce,{passive:true});
window.addEventListener('resize',scheduleReinforce,{passive:true});
if(window.visualViewport)window.visualViewport.addEventListener('resize',scheduleReinforce,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)scheduleReinforce();},{passive:true});

window.LQ_IPHONE_COMPOSITOR_SAFE_MODE={
  version:'1.0.0',
  emergencyBlackScreenRecovery:true,
  presentationOnly:true,
  disablesMobileAmbientLayer:true,
  disablesMobileDepthFilters:true,
  disablesMobileBackdropFilters:true,
  forcesWorldVisibilityOnResume:true,
  gameplayMutation:false,
  saveMutation:false,
  inputAuthority:false,
  iosPhysicalVerification:'PENDING',
  reinforceWorld
};
})();
