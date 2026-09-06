(() => {
'use strict';

/* REQ-102 — Owner iPhone hot-fix bundle.
   1) Keep the first forest step usable after the field -> forest transition,
      including an already-saved legacy entry position.
   2) Re-stack the iPhone top HUD without overlap and allow the Owner to collapse it.
   3) Route Luke dialogue portrait to the Owner-uploaded source image using a face crop.
   Gameplay collision remains canonical; this changes only the entry spawn lane and presentation. */

const OWNER_PORTRAIT='assets/images/03334052-E944-4DE4-9C61-48F011193E46.png';
const STYLE_ID='lq-req102-owner-iphone-style';
const TOGGLE_ID='lqTopHudToggle';
const COLLAPSED_CLASS='lqReq102HudCollapsed';
let hudCollapsed=false;
let legacyForestEntryNormalized=false;

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
@media(max-width:680px){
 body.lqWorldFullscreen .lqWorldStatusOverlay{
   top:calc(env(safe-area-inset-top,0px) + 7px)!important;
   left:calc(env(safe-area-inset-left,0px) + 7px)!important;
   right:calc(env(safe-area-inset-right,0px) + 7px)!important;
   max-width:none!important;
   pointer-events:none!important;
 }
 body.lqWorldFullscreen .hud{
   top:calc(env(safe-area-inset-top,0px) + 55px)!important;
   left:calc(env(safe-area-inset-left,0px) + 8px)!important;
   right:calc(env(safe-area-inset-right,0px) + 65px)!important;
   display:flex!important;
   flex-wrap:nowrap!important;
   gap:4px!important;
   overflow:hidden!important;
 }
 body.lqWorldFullscreen #lq-music-toggle{
   top:calc(env(safe-area-inset-top,0px) + 84px)!important;
   right:calc(env(safe-area-inset-right,0px) + 7px)!important;
   left:auto!important;
   min-width:72px!important;
   max-width:78px!important;
   z-index:59!important;
 }
 body.lqWorldFullscreen .questGuide{
   top:calc(env(safe-area-inset-top,0px) + 84px)!important;
   left:calc(env(safe-area-inset-left,0px) + 8px)!important;
   right:calc(env(safe-area-inset-right,0px) + 88px)!important;
   max-width:none!important;
   overflow:hidden!important;
   text-overflow:ellipsis!important;
 }
 body.lqWorldFullscreen #${TOGGLE_ID}{
   position:absolute!important;
   z-index:121!important;
   top:calc(env(safe-area-inset-top,0px) + 54px)!important;
   right:calc(env(safe-area-inset-right,0px) + 7px)!important;
   width:52px!important;
   min-width:52px!important;
   height:25px!important;
   min-height:25px!important;
   margin:0!important;
   padding:0 5px!important;
   border:1px solid #ffffff38!important;
   border-radius:999px!important;
   background:#07111fd9!important;
   color:#eef6ff!important;
   font:800 9px/23px system-ui,sans-serif!important;
   letter-spacing:.02em!important;
   box-shadow:0 2px 8px #0008!important;
   backdrop-filter:blur(4px);
   -webkit-backdrop-filter:blur(4px);
   pointer-events:auto!important;
   touch-action:manipulation!important;
 }
 body.lqWorldFullscreen.${COLLAPSED_CLASS} .lqWorldStatusOverlay,
 body.lqWorldFullscreen.${COLLAPSED_CLASS} .hud,
 body.lqWorldFullscreen.${COLLAPSED_CLASS} .questGuide,
 body.lqWorldFullscreen.${COLLAPSED_CLASS} #lq-music-toggle{
   display:none!important;
 }
 body.lqWorldFullscreen.${COLLAPSED_CLASS} #${TOGGLE_ID}{
   top:calc(env(safe-area-inset-top,0px) + 7px)!important;
 }
 body.lqWorldFullscreen .dialogBox[data-req102-owner-luke="true"] .dialogPortrait{
   overflow:hidden!important;
 }
 body.lqWorldFullscreen .dialogBox[data-req102-owner-luke="true"] .dialogPortrait img{
   width:100%!important;
   height:100%!important;
   object-fit:cover!important;
   object-position:50% 18%!important;
 }
}
`;
  document.head.appendChild(style);
}

function isLukeDialog(){
  return typeof s!=='undefined'&&s&&s.dialog&&(s.dialog.portraitKey==='luke'||s.dialog.name==='ルーク');
}

function applyOwnerPortrait(){
  if(!isLukeDialog())return false;
  const img=document.querySelector('.dialogBox .dialogPortrait img');
  if(!img)return false;
  const raw=img.getAttribute('src')||'';
  if(raw!==OWNER_PORTRAIT)img.setAttribute('src',OWNER_PORTRAIT);
  img.alt='ルーク Owner指定会話フェイス';
  img.dataset.req102OwnerPortrait='true';
  img.style.objectFit='cover';
  img.style.objectPosition='50% 18%';
  const box=img.closest('.dialogBox');
  if(box)box.dataset.req102OwnerLuke='true';
  return true;
}

function ensureToggle(){
  if(typeof s==='undefined'||!s||s.screen!=='world')return null;
  const shell=document.querySelector('.gameShell');
  if(!shell)return null;
  let button=document.getElementById(TOGGLE_ID);
  if(!button){
    button=document.createElement('button');
    button.id=TOGGLE_ID;
    button.type='button';
    button.dataset.lqNoGlobalAction='true';
    button.setAttribute('aria-label','上部表示を開閉');
    button.addEventListener('pointerdown',event=>event.stopPropagation());
    button.addEventListener('pointerup',event=>event.stopPropagation());
    button.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      hudCollapsed=!hudCollapsed;
      applyHudState();
    });
  }
  if(button.parentElement!==shell)shell.appendChild(button);
  return button;
}

function applyHudState(){
  const enabled=typeof s!=='undefined'&&s&&s.screen==='world'&&document.body.classList.contains('lqWorldFullscreen');
  document.body.classList.toggle(COLLAPSED_CLASS,enabled&&hudCollapsed);
  const button=ensureToggle();
  if(button){
    button.hidden=!enabled;
    button.textContent=hudCollapsed?'HUD ▼':'HUD ▲';
    button.setAttribute('aria-expanded',String(!hudCollapsed));
  }
}

function normalizeLegacyForestEntry(){
  if(legacyForestEntryNormalized)return false;
  if(typeof s==='undefined'||!s||s.screen!=='world'||s.map!=='forest'||s.x!==11||s.y!==18)return false;
  const forest=typeof MAPS!=='undefined'&&MAPS&&MAPS.forest;
  const row17=forest&&forest.tiles&&forest.tiles[17];
  if(!row17)return false;
  const blockedSymbols=new Set(['#','H','~','*','^']);
  const legacyNorthBlocked=blockedSymbols.has(row17[11]);
  const repairedNorthOpen=!blockedSymbols.has(row17[12]);
  if(!legacyNorthBlocked||!repairedNorthOpen)return false;
  s.x=12;
  s.y=18;
  legacyForestEntryNormalized=true;
  window.LQ_REQ102_LEGACY_FOREST_ENTRY_REPAIRED={from:{x:11,y:18},to:{x:12,y:18},northOpen:true};
  return true;
}

/* The canonical forest collision map remains unchanged. The previous field->forest
   spawn was (11,18), directly below a blocked tree at (11,17), so an Owner swipe
   toward the north objective looked like total movement failure. Shift the entry
   one passable tile right; (12,17) is open and the player can immediately proceed. */
if(typeof checkGate==='function'){
  const beforeReq102Gate=checkGate;
  checkGate=function(){
    const fromMap=typeof s!=='undefined'&&s?s.map:null;
    const result=beforeReq102Gate();
    if(fromMap==='field'&&s&&s.map==='forest'&&s.x===11&&s.y===18){
      s.x=12;
      s.y=18;
      legacyForestEntryNormalized=true;
      window.LQ_REQ102_LAST_FOREST_ENTRY={x:s.x,y:s.y,northOpen:typeof blocked==='function'?!blocked(12,17):null};
    }
    return result;
  };
}

function decorate(){
  injectStyle();
  applyHudState();
  requestAnimationFrame(applyOwnerPortrait);
}

injectStyle();
if(typeof render==='function'){
  const beforeReq102Render=render;
  render=function(){
    normalizeLegacyForestEntry();
    const result=beforeReq102Render();
    decorate();
    return result;
  };
}
window.addEventListener('resize',()=>requestAnimationFrame(decorate),{passive:true});
if(window.visualViewport)window.visualViewport.addEventListener('resize',()=>requestAnimationFrame(decorate),{passive:true});
const repairedExistingSave=normalizeLegacyForestEntry();
decorate();
if(repairedExistingSave&&typeof render==='function')setTimeout(()=>render(),0);

window.LQ_REQ102_STATUS={
  version:'1.1.0',
  forestEntryNorthLane:true,
  legacySavedForestEntryRepair:true,
  forestCanonicalCollisionPreserved:true,
  topHudRestacked:true,
  topHudToggle:true,
  toggleExcludedFromWorldAction:true,
  ownerDialogueImage:OWNER_PORTRAIT,
  ownerDialogueFaceCrop:true,
  generatedSubstitute:false,
  iosPhysicalVerification:'PENDING'
};
})();
