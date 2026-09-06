(() => {
'use strict';

/* Collision-safe add-on: unobtrusive autosave feedback on map transitions and major progress changes. */
const LEGACY_MAJOR_FLAGS=['fieldChestOpened','forestCacheOpened','deepCacheOpened','elderCharmFound','elderCharmComplete','forestBountyComplete','leonSeen','glennSeen','withdrawProofSeen'];
const OPTIONAL_PROGRESS_FLAGS=['elderCharmComplete','forestBountyComplete','lqHerbSampleQuestDone','forestMiniBossDefeated'];
let lastMap=s.map,lastFlags='';
function dynamicProgressFlags(statuses=window){
 const extra=[
  ...(statuses.LQ_TREASURE_CHEST_STATUS?.saveFlags||[]),
  ...(statuses.LQ_HIDDEN_FIND_STATUS?.flags||[]),
  ...(statuses.LQ_ITEM_TREASURE_CACHE_STATUS?.flags||[])
 ];
 return [...new Set([...LEGACY_MAJOR_FLAGS,...OPTIONAL_PROGRESS_FLAGS,...extra].filter(v=>typeof v==='string'&&v))];
}
function progressSignature(state=s,statuses=window){
 const flags=state?.flags||{};
 return JSON.stringify(dynamicProgressFlags(statuses).map(key=>[key,!!flags[key]]));
}
lastFlags=progressSignature();
const style=document.createElement('style');style.textContent=`.lqSavePulse{position:absolute;z-index:62;right:9px;bottom:122px;padding:4px 7px;border-radius:8px;background:#07131fdd;border:1px solid #6da88744;color:#8dc8a4;font-size:7px;font-weight:900;letter-spacing:.14em;pointer-events:none;box-shadow:0 3px 9px #0006}.lqSavePulse b{color:#d9c0eb;font-size:7px;letter-spacing:.11em;margin-right:4px}@keyframes lqSavePulse{0%{opacity:0;transform:translateY(4px)}18%,70%{opacity:1;transform:none}100%{opacity:0}}@media(max-height:700px){.lqSavePulse{bottom:104px}}`;document.head.appendChild(style);
function pulse(){const shell=app.querySelector('.gameShell');if(!shell)return;const old=shell.querySelector('.lqSavePulse');if(old)old.remove();const e=document.createElement('div');e.className='lqSavePulse';e.textContent='AUTOSAVE';shell.appendChild(e);setTimeout(()=>e.remove(),1150);}
function detect(){if(s.screen!=='world')return;const flags=progressSignature();if(s.map!==lastMap||flags!==lastFlags){lastMap=s.map;lastFlags=flags;requestAnimationFrame(pulse);}}
const renderS=render;render=function(){const r=renderS();detect();return r;};
window.LQ_AUTOSAVE_FEEDBACK_STATUS={
 mapAndMajorFlagPulse:true,
 canonicalSaveOwner:'index.html save()',
 presentationOnly:true,
 noProgressMutation:true,
 pointerSafe:true,
 dynamicProgressCoverage:true,
 legacyMajorFlags:[...LEGACY_MAJOR_FLAGS],
 optionalProgressFlags:[...OPTIONAL_PROGRESS_FLAGS],
 dynamicProgressFlags,
 progressSignature
};
})();
