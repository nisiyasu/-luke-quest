(() => {
'use strict';

/* Collision-safe add-on: unobtrusive autosave feedback on map transitions and major flag changes. */
let lastMap=s.map,lastFlags='';
function importantFlags(){return JSON.stringify({fieldChestOpened:!!s.flags?.fieldChestOpened,forestCacheOpened:!!s.flags?.forestCacheOpened,deepCacheOpened:!!s.flags?.deepCacheOpened,elderCharmFound:!!s.flags?.elderCharmFound,elderCharmComplete:!!s.flags?.elderCharmComplete,forestBountyComplete:!!s.flags?.forestBountyComplete,leonSeen:!!s.flags?.leonSeen,glennSeen:!!s.flags?.glennSeen,withdrawProofSeen:!!s.flags?.withdrawProofSeen});}
lastFlags=importantFlags();
const style=document.createElement('style');style.textContent=`.lqSavePulse{position:absolute;z-index:62;right:9px;bottom:122px;padding:4px 7px;border-radius:8px;background:#07131fdd;border:1px solid #6da88744;color:#8dc8a4;font-size:7px;font-weight:900;letter-spacing:.14em;pointer-events:none;animation:lqSavePulse 1.1s ease both}.lqSavePulse:before{content:"● ";color:#71d193}@keyframes lqSavePulse{0%{opacity:0;transform:translateY(4px)}18%,70%{opacity:1;transform:none}100%{opacity:0}}@media(max-height:700px){.lqSavePulse{bottom:104px}}`;document.head.appendChild(style);
function pulse(){const shell=app.querySelector('.gameShell');if(!shell)return;const old=shell.querySelector('.lqSavePulse');if(old)old.remove();const e=document.createElement('div');e.className='lqSavePulse';e.textContent='AUTOSAVE';shell.appendChild(e);setTimeout(()=>e.remove(),1150);}
function detect(){if(s.screen!=='world')return;const flags=importantFlags();if(s.map!==lastMap||flags!==lastFlags){lastMap=s.map;lastFlags=flags;requestAnimationFrame(pulse);}}
const renderS=render;render=function(){const r=renderS();detect();return r;};window.LQ_AUTOSAVE_FEEDBACK_STATUS={mapAndMajorFlagPulse:true};
})();
