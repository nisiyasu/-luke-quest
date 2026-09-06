(() => {
'use strict';

/* REQ-022 / REQ-034 / REQ-091 — iPhone fullscreen world UI.
   Presentation-only: world/status/controls are reflowed into one viewport-sized
   gameShell. Map coordinates, collision, story flags and save semantics remain
   untouched. REQ-034 additionally hardens the world plane against an opaque
   full-screen controls layer and adds iPhone-sized visual-liveness assertions.
   REQ-091 compacts top overlays, lowers control opacity, and gives the camera a
   north-edge presentation allowance so the player does not disappear under HUD. */

const STYLE_ID='lq-iphone-fullscreen-world-style';
const WORLD_CLASS='lqWorldFullscreen';
const DIALOGUE_CLASS='lqWorldDialogueOpen';
let resizeRaf=0;
let smokeFailureRaised=false;

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
html.${WORLD_CLASS},body.${WORLD_CLASS}{width:100%;height:100%;margin:0;overflow:hidden;background:#07111f;overscroll-behavior:none}
body.${WORLD_CLASS}{padding:0!important}
body.${WORLD_CLASS} #app{width:100%;max-width:720px;height:100dvh;min-height:100dvh;margin:0 auto;padding:0!important;overflow:hidden;position:relative}
@supports not (height:100dvh){body.${WORLD_CLASS} #app{height:100vh;min-height:100vh}}
body.${WORLD_CLASS} .gameShell{width:100%!important;height:100dvh!important;max-height:none!important;aspect-ratio:auto!important;margin:0!important;border-radius:0!important;border:0!important;box-shadow:none!important;position:relative!important;overflow:hidden!important;background:#000}
@supports not (height:100dvh){body.${WORLD_CLASS} .gameShell{height:100vh!important}}
body.${WORLD_CLASS} .gameShell>.world{display:block!important;visibility:visible!important;z-index:1!important;overflow:visible!important}
body.${WORLD_CLASS} .lqWorldStatusOverlay{position:absolute!important;z-index:58;top:calc(env(safe-area-inset-top,0px) + 7px);left:calc(env(safe-area-inset-left,0px) + 7px);right:calc(env(safe-area-inset-right,0px) + 92px);margin:0!important;padding:4px 5px!important;border:1px solid #ffffff24!important;border-radius:11px!important;background:#07111fb3!important;box-shadow:0 3px 12px #0007!important;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);pointer-events:none!important}
body.${WORLD_CLASS} .lqWorldStatusOverlay .status{grid-template-columns:repeat(6,minmax(0,1fr))!important;gap:2px!important}
body.${WORLD_CLASS} .lqWorldStatusOverlay .stat{min-width:0!important;padding:3px 2px!important;background:#0915259c!important;border-radius:6px!important}
body.${WORLD_CLASS} .lqWorldStatusOverlay .stat small{font-size:8px!important;line-height:1!important;white-space:nowrap!important}
body.${WORLD_CLASS} .lqWorldStatusOverlay .stat b{font-size:11px!important;line-height:1.15!important;white-space:nowrap!important}
body.${WORLD_CLASS} #lq-music-toggle{top:calc(env(safe-area-inset-top,0px) + 8px)!important;right:calc(env(safe-area-inset-right,0px) + 7px)!important;min-width:72px!important;max-width:78px!important;height:31px!important;padding:0 6px!important;font-size:9px!important;line-height:29px!important}
body.${WORLD_CLASS} .hud{top:calc(env(safe-area-inset-top,0px) + 55px)!important;left:calc(env(safe-area-inset-left,0px) + 8px)!important;right:calc(env(safe-area-inset-right,0px) + 8px)!important;z-index:56!important}
body.${WORLD_CLASS} .hud .chip{padding:3px 6px!important;font-size:9px!important;background:#07111fa6!important;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
body.${WORLD_CLASS} .questGuide{top:calc(env(safe-area-inset-top,0px) + 84px)!important;left:calc(env(safe-area-inset-left,0px) + 8px)!important;right:calc(env(safe-area-inset-right,0px) + 8px)!important;z-index:55!important;padding:5px 8px!important;font-size:10px!important;background:#0b172eae!important;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}
body.${WORLD_CLASS} .lqWorldControlsOverlay{position:absolute!important;inset:0!important;z-index:76!important;display:block!important;margin:0!important;padding:0!important;pointer-events:none!important;background:transparent!important;background-image:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;outline:0!important}
body.${WORLD_CLASS} .lqWorldControlsOverlay .dpad{position:absolute!important;left:calc(env(safe-area-inset-left,0px) + 9px);bottom:calc(env(safe-area-inset-bottom,0px) + 10px);display:grid!important;grid-template-columns:42px 42px 42px!important;grid-template-rows:42px 42px 42px!important;width:126px!important;height:126px!important;opacity:.18!important;pointer-events:auto!important;transition:opacity .12s ease}
body.${WORLD_CLASS} .lqWorldControlsOverlay .dpad:active{opacity:.48!important}
body.${WORLD_CLASS} .lqWorldControlsOverlay .dpad button{width:40px!important;height:40px!important;min-width:40px!important;min-height:40px!important;border-radius:13px!important;font-size:18px!important;padding:0!important;background:#10294378!important;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}
body.${WORLD_CLASS} .lqWorldControlsOverlay .actionPad{position:absolute!important;right:calc(env(safe-area-inset-right,0px) + 10px);bottom:calc(env(safe-area-inset-bottom,0px) + 13px);display:flex!important;flex-direction:column!important;align-items:center!important;gap:8px!important;pointer-events:auto!important}
body.${WORLD_CLASS} .lqWorldControlsOverlay .actionPad button{width:52px!important;height:52px!important;min-width:52px!important;min-height:52px!important;margin:0!important;border-radius:50%!important;font-size:15px!important;background:#102943a5!important;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);box-shadow:0 3px 11px #0008!important}
body.${WORLD_CLASS} .lqWorldControlsOverlay .actionPad .a{width:58px!important;height:58px!important;min-width:58px!important;min-height:58px!important;font-size:20px!important;background:#6f4a9bb0!important}
body.${WORLD_CLASS} .dialogBox{left:calc(env(safe-area-inset-left,0px) + 8px)!important;right:calc(env(safe-area-inset-right,0px) + 8px)!important;bottom:calc(env(safe-area-inset-bottom,0px) + 8px)!important;max-height:min(43dvh,330px);overflow:auto;z-index:90!important;background:#07111fe8!important;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
body.${WORLD_CLASS} .foot{display:none!important}
body.${WORLD_CLASS}.${DIALOGUE_CLASS} .lqWorldControlsOverlay .dpad,body.${WORLD_CLASS}.${DIALOGUE_CLASS} .lqWorldControlsOverlay .actionPad{opacity:0!important;pointer-events:none!important}
body.${WORLD_CLASS} #lq-floating-touch-controller{z-index:110!important}
@media(max-width:430px){
 body.${WORLD_CLASS} .lqWorldStatusOverlay{right:calc(env(safe-area-inset-right,0px) + 92px)}
 body.${WORLD_CLASS} .lqWorldStatusOverlay .stat small{font-size:7.5px!important}
 body.${WORLD_CLASS} .lqWorldStatusOverlay .stat b{font-size:10.5px!important}
 body.${WORLD_CLASS} .lqWorldControlsOverlay .dpad{grid-template-columns:38px 38px 38px!important;grid-template-rows:38px 38px 38px!important;width:114px!important;height:114px!important}
 body.${WORLD_CLASS} .lqWorldControlsOverlay .dpad button{width:36px!important;height:36px!important;min-width:36px!important;min-height:36px!important;font-size:16px!important}
 body.${WORLD_CLASS} .lqWorldControlsOverlay .actionPad button{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important}
 body.${WORLD_CLASS} .lqWorldControlsOverlay .actionPad .a{width:54px!important;height:54px!important;min-width:54px!important;min-height:54px!important}
}
@media(prefers-reduced-motion:reduce){body.${WORLD_CLASS} .lqWorldControlsOverlay .dpad{transition:none!important}}
`;
  document.head.appendChild(style);
}

function setWorldClasses(enabled,dialogue){
  document.documentElement.classList.toggle(WORLD_CLASS,enabled);
  document.body.classList.toggle(WORLD_CLASS,enabled);
  document.body.classList.toggle(DIALOGUE_CLASS,enabled&&dialogue);
}

function recenterCamera(){
  if(typeof s==='undefined'||!s||s.screen!=='world'||typeof MAPS==='undefined'||typeof TS==='undefined')return;
  const shell=document.querySelector('.gameShell');
  const worldEl=shell&&shell.querySelector('.world');
  const m=MAPS[s.map];
  if(!shell||!worldEl||!m)return;
  const mapWidth=m.w*TS,mapHeight=m.h*TS;
  worldEl.style.width=`${mapWidth}px`;
  worldEl.style.height=`${mapHeight}px`;
  const vw=shell.clientWidth||innerWidth;
  const vh=shell.clientHeight||innerHeight;
  const px=s.x*TS+5,py=s.y*TS+3;
  const minimumPlayerScreenY=Math.min(132,Math.max(112,Math.round(vh*.16)));
  let cx=vw/2-px-19,cy=vh/2-py-21;
  cx=mapWidth<=vw?Math.round((vw-mapWidth)/2):Math.min(0,Math.max(vw-mapWidth,cx));
  if(mapHeight<=vh){
    cy=Math.round((vh-mapHeight)/2);
    const playerScreenY=py+cy;
    if(playerScreenY<minimumPlayerScreenY){
      cy=Math.min(vh-mapHeight,cy+(minimumPlayerScreenY-playerScreenY));
    }
  }else{
    cy=Math.min(0,Math.max(vh-mapHeight,cy));
    const playerScreenY=py+cy;
    if(playerScreenY<minimumPlayerScreenY){
      cy=Math.min(minimumPlayerScreenY,cy+(minimumPlayerScreenY-playerScreenY));
    }
  }
  worldEl.style.transform=`translate(${Math.round(cx)}px,${Math.round(cy)}px)`;
}

function rectIntersects(a,b){
  return !!a&&!!b&&a.width>0&&a.height>0&&b.width>0&&b.height>0&&a.right>b.left&&a.left<b.right&&a.bottom>b.top&&a.top<b.bottom;
}

function isTransparentBackground(el){
  if(!el)return false;
  const value=getComputedStyle(el).backgroundColor||'';
  return value==='transparent'||/^rgba\([^)]*,\s*0(?:\.0+)?\)$/.test(value);
}

function styleHasPaint(style){
  if(!style)return false;
  const bg=style.backgroundColor||'';
  const image=style.backgroundImage||'none';
  const colorPaint=bg&&bg!=='transparent'&&bg!=='rgba(0, 0, 0, 0)';
  return colorPaint||image!=='none';
}

function smokeMarker(shell,statusCard,controls){
  if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqTouchSmoke'))return;
  let marker=document.getElementById('lqFullscreenWorldRuntimeSmokeMarker');
  if(!marker){marker=document.createElement('i');marker.id='lqFullscreenWorldRuntimeSmokeMarker';marker.hidden=true;document.body.appendChild(marker);}
  const shellRect=shell.getBoundingClientRect();
  const worldEl=shell.querySelector('.world');
  const player=worldEl&&worldEl.querySelector('.player');
  const worldRect=worldEl&&worldEl.getBoundingClientRect();
  const playerRect=player&&player.getBoundingClientRect();
  const visibleTileGeometry=worldEl?[...worldEl.querySelectorAll('.tile')].filter(tile=>{
    const r=tile.getBoundingClientRect();
    const cs=getComputedStyle(tile);
    return rectIntersects(r,shellRect)&&cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)>.05;
  }):[];
  const paintedTiles=visibleTileGeometry.filter(tile=>styleHasPaint(getComputedStyle(tile))||styleHasPaint(getComputedStyle(tile,'::before'))||styleHasPaint(getComputedStyle(tile,'::after'))||!!tile.textContent.trim());
  const heightRatio=(shellRect.height||0)/Math.max(1,innerHeight);
  const data={
    worldClass:document.body.classList.contains(WORLD_CLASS),
    statusOverlay:!!statusCard&&statusCard.parentElement===shell,
    controlsOverlay:!!controls&&controls.parentElement===shell,
    fullscreenHeight:heightRatio>.8,
    footHidden:!document.querySelector('.foot')||getComputedStyle(document.querySelector('.foot')).display==='none',
    controlsAbsolute:!!controls&&getComputedStyle(controls).position==='absolute',
    controlsTransparent:isTransparentBackground(controls),
    statusAbsolute:!!statusCard&&getComputedStyle(statusCard).position==='absolute',
    shellGeometry:shellRect.width>250&&shellRect.height>400,
    worldGeometry:!!worldRect&&worldRect.width>100&&worldRect.height>100,
    playerGeometry:!!playerRect&&playerRect.width>10&&playerRect.height>10,
    worldIntersectsViewport:rectIntersects(worldRect,shellRect),
    playerIntersectsViewport:rectIntersects(playerRect,shellRect),
    visibleWorldTiles:visibleTileGeometry.length>=8,
    paintedWorldTiles:paintedTiles.length>=8
  };
  Object.entries(data).forEach(([k,v])=>marker.dataset[k]=String(!!v));
  marker.dataset.visibleTileCount=String(visibleTileGeometry.length);
  marker.dataset.paintedTileCount=String(paintedTiles.length);
  marker.dataset.controlsBackground=controls?getComputedStyle(controls).backgroundColor:'missing';
  marker.dataset.worldWidth=worldRect?String(Math.round(worldRect.width)):'0';
  marker.dataset.worldHeight=worldRect?String(Math.round(worldRect.height)):'0';
  marker.dataset.playerX=playerRect?String(Math.round(playerRect.left)):'missing';
  marker.dataset.playerY=playerRect?String(Math.round(playerRect.top)):'missing';
  marker.dataset.minimumPlayerScreenY=String(Math.min(132,Math.max(112,Math.round((shellRect.height||innerHeight)*.16))));
  const failed=Object.entries(data).find(([,v])=>!v);
  if(failed&&!smokeFailureRaised){
    smokeFailureRaised=true;
    const key=failed[0].replace(/[^A-Za-z0-9_$]/g,'_');
    setTimeout(()=>{eval(`LQ_REQ034_VISUAL_FAIL_${key}()`);},0);
  }
}

function applyWorldLayout(){
  const isWorld=typeof s!=='undefined'&&s&&s.screen==='world';
  if(!isWorld){setWorldClasses(false,false);return;}
  const shell=document.querySelector('.gameShell');
  if(!shell){setWorldClasses(false,false);return;}
  setWorldClasses(true,!!document.querySelector('.dialogBox'));

  const statusGrid=document.querySelector('#app > .card .status');
  const statusCard=statusGrid&&statusGrid.closest('.card');
  if(statusCard&&statusCard.parentElement!==shell)shell.appendChild(statusCard);
  if(statusCard)statusCard.classList.add('lqWorldStatusOverlay');

  const controls=document.querySelector('#app > .controls')||document.querySelector('.controls.lqWorldControlsOverlay');
  if(controls&&controls.parentElement!==shell)shell.appendChild(controls);
  if(controls)controls.classList.add('lqWorldControlsOverlay');

  recenterCamera();
  smokeMarker(shell,statusCard,controls);
}

function scheduleRecenter(){
  cancelAnimationFrame(resizeRaf);
  resizeRaf=requestAnimationFrame(()=>{applyWorldLayout();recenterCamera();});
}

injectStyle();
if(typeof render==='function'){
  const beforeFullscreenWorld=render;
  render=function(){
    const result=beforeFullscreenWorld();
    applyWorldLayout();
    return result;
  };
}
window.addEventListener('resize',scheduleRecenter,{passive:true});
window.addEventListener('orientationchange',scheduleRecenter,{passive:true});
if(window.visualViewport)window.visualViewport.addEventListener('resize',scheduleRecenter,{passive:true});
applyWorldLayout();

window.LQ_IPHONE_FULLSCREEN_WORLD_STATUS={version:'1.0.6',worldViewportPrimary:true,dynamicViewportUnits:true,safeAreaAware:true,statusOverlay:true,topOverlayCompacted:true,playerNorthEdgeSafePresentation:true,controlsOverlay:true,controlsPlaneTransparent:true,worldPlaneGeometry:true,visualLivenessSmoke:true,pseudoPaintAware:true,menuOverlay:true,fallbackAOverlay:true,dialogueOverlay:true,cameraRecenter:true,gameplayCoordinatesUnchanged:true,iosPhysicalVerification:'PENDING'};
})();