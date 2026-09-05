(() => {
'use strict';

/* LUKE QUEST v0.29 map-arrival polish.
   Adds lightweight scene fades/map-name banners whenever the active map changes. */

const style=document.createElement('style');
style.textContent=`
.gameShell.lqMapArrive{animation:lqMapArrive .34s ease-out both}
@keyframes lqMapArrive{0%{opacity:0;filter:brightness(.55);transform:scale(.992)}100%{opacity:1;filter:brightness(1);transform:scale(1)}}
.lqMapTitleSplash{position:absolute;z-index:35;left:50%;top:17%;transform:translate(-50%,-50%);min-width:180px;max-width:80%;text-align:center;padding:9px 15px;background:linear-gradient(90deg,transparent,#081524e8 18%,#081524ef 82%,transparent);border-top:1px solid #d7bd6988;border-bottom:1px solid #d7bd6988;color:#fff2bf;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:900;letter-spacing:.08em;text-shadow:0 2px 5px #000;pointer-events:none;animation:lqMapTitle 1.25s ease both}
.lqMapTitleSplash small{display:block;color:#9fb0c5;font-family:system-ui,sans-serif;font-size:8px;letter-spacing:.22em;margin-top:3px}
@keyframes lqMapTitle{0%{opacity:0;transform:translate(-50%,-30%)}18%,70%{opacity:1;transform:translate(-50%,-50%)}100%{opacity:0;transform:translate(-50%,-65%)}}
.battleScene.lqBattleArrive{animation:lqBattleArrive .28s ease-out both}@keyframes lqBattleArrive{from{opacity:.15;filter:brightness(2);transform:scale(1.025)}to{opacity:1;filter:brightness(1);transform:scale(1)}}
`;
document.head.appendChild(style);

let lastPresentedMap=s.screen==='world'?s.map:null;
let pendingMapSplash=false;
let lastScreenV29=s.screen;

function decorateArrival(){
  if(s.screen==='world'){
    const changed=lastPresentedMap!==s.map||pendingMapSplash;
    if(changed){
      const shell=app.querySelector('.gameShell');
      if(shell){
        shell.classList.add('lqMapArrive');
        const splash=document.createElement('div');splash.className='lqMapTitleSplash';
        splash.innerHTML=`${MAPS[s.map]?.name||s.map}<small>AREA ARRIVAL</small>`;shell.appendChild(splash);
      }
      lastPresentedMap=s.map;pendingMapSplash=false;
    }
  }
  if(s.screen==='battle'&&lastScreenV29!=='battle')app.querySelector('.battleScene')?.classList.add('lqBattleArrive');
  if(lastScreenV29==='battle'&&s.screen==='world')pendingMapSplash=false;
  lastScreenV29=s.screen;
}

const checkGateV28=checkGate;
checkGate=function(){
  const before=s.map;const r=checkGateV28();if(s.map!==before)pendingMapSplash=true;return r;
};

const renderV28=render;
render=function(){const beforeMap=lastPresentedMap;const r=renderV28();if(s.screen==='world'&&s.map!==beforeMap)pendingMapSplash=true;decorateArrival();return r;};

window.LQ_TRANSITION_STATUS={mapArrivalFade:true,mapNameSplash:true,battleArrivalFlash:true};
if(s.screen==='world')decorateArrival();
})();
