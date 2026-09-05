(() => {
'use strict';

/* LUKE QUEST v0.100 discovered-area record. */

s.discoveredMaps=Array.isArray(s.discoveredMaps)?Array.from(new Set(s.discoveredMaps)):[];
function recordMap(){if(s.screen!=='world'||!MAPS[s.map])return;if(!s.discoveredMaps.includes(s.map)){s.discoveredMaps.push(s.map);save();}}
recordMap();

const style=document.createElement('style');
style.textContent=`
.lqAreaRecord{display:flex;flex-wrap:wrap;gap:5px}.lqAreaChip{padding:5px 7px;border-radius:7px;background:#0a1b28;border:1px solid #ffffff12;color:#aebfca;font-size:8px}.lqAreaChip.current{color:#ffe79a;border-color:#d0b75755;background:#2d2a1d}.lqAreaCount{float:right;color:#8298a9;font-size:8px}
`;
document.head.appendChild(style);
function addAreaRecord(){
 if(!s.pauseOpen||s.screen!=='world')return;const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqAreaRecordSection'))return;
 const valid=s.discoveredMaps.filter(k=>MAPS[k]);const sec=document.createElement('div');sec.className='lqPauseSection lqAreaRecordSection';sec.innerHTML=`<h3>DISCOVERED AREAS <span class=lqAreaCount>${valid.length}</span></h3><div class=lqAreaRecord>${valid.map(k=>`<span class="lqAreaChip${k===s.map?' current':''}">${MAPS[k].name}</span>`).join('')}</div>`;
 const buttons=panel.querySelector('.lqPauseButtons');panel.insertBefore(sec,buttons);
}
const checkGateV99=checkGate;checkGate=function(){const before=s.map;const r=checkGateV99();if(before!==s.map)recordMap();return r;};
const worldV99=world;world=function(){recordMap();worldV99();addAreaRecord();};const renderV99=render;render=function(){const r=renderV99();recordMap();addAreaRecord();return r;};
window.LQ_AREA_RECORD_STATUS={visitedMaps:true};
save();if(s.pauseOpen)addAreaRecord();
})();
