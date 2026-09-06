(() => {
'use strict';

/* Collision-safe add-on: compact read-only adventure statistics record. */
const style=document.createElement('style');style.textContent=`
.lqRecordGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.lqRecordCell{padding:6px 4px;border-radius:7px;background:#0a1a27;border:1px solid #ffffff10;text-align:center}.lqRecordCell small{display:block;color:#748b9e;font-size:6px;letter-spacing:.08em}.lqRecordCell b{display:block;color:#e1ebf0;font-size:11px;margin-top:2px}.lqRecordCell.gold b{color:#e4cc75}.lqRecordCell.green b{color:#9ed3a6}@media(max-width:390px){.lqRecordGrid{grid-template-columns:repeat(2,1fr)}}
`;document.head.appendChild(style);

const LEGACY_TREASURE_FLAGS=['fieldChestOpened','forestCacheOpened','deepCacheOpened','fieldSparkleFound','forestSparkleFound'];
const OPTIONAL_FLAGS=['elderCharmComplete','forestBountyComplete','lqHerbSampleQuestDone','forestMiniBossDefeated'];

function treasureFlagList(source=window){
 const dynamic=[
  ...(source?.LQ_TREASURE_CHEST_STATUS?.saveFlags||[]),
  ...(source?.LQ_HIDDEN_FIND_STATUS?.flags||[]),
  ...(source?.LQ_ITEM_TREASURE_CACHE_STATUS?.flags||[])
 ];
 return [...new Set([...LEGACY_TREASURE_FLAGS,...dynamic].filter(k=>typeof k==='string'&&k.length))];
}
function countFlags(flags,keys){return keys.reduce((n,k)=>n+Number(!!flags?.[k]),0);}
function openedTreasureCount(flags=s.flags||{},source=window){return countFlags(flags,treasureFlagList(source));}
function optionalDone(flags=s.flags||{}){return countFlags(flags,OPTIONAL_FLAGS);}

function addRecords(){
 if(!s.pauseOpen||s.screen!=='world')return;
 const panel=app.querySelector('.lqPausePanel');
 if(!panel||panel.querySelector('.lqAdventureRecordSection'))return;
 const kills=Object.values(s.enemyDefeats||{}).reduce((a,b)=>a+(Number(b)||0),0);
 const areas=(s.discoveredMaps||[]).length;
 const sec=document.createElement('div');
 sec.className='lqPauseSection lqAdventureRecordSection';
 sec.innerHTML=`<h3>ADVENTURE RECORD</h3><div class=lqRecordGrid><div class=lqRecordCell><small>BATTLES WON</small><b>${s.wins||0}</b></div><div class=lqRecordCell><small>MONSTERS DOWN</small><b>${kills}</b></div><div class=lqRecordCell><small>AREAS FOUND</small><b>${areas}</b></div><div class="lqRecordCell gold"><small>TREASURE FINDS</small><b>${openedTreasureCount()}</b></div><div class="lqRecordCell green"><small>OPTIONAL DONE</small><b>${optionalDone()}/${OPTIONAL_FLAGS.length}</b></div><div class=lqRecordCell><small>LEVEL</small><b>${s.lv||1}</b></div></div>`;
 const buttons=panel.querySelector('.lqPauseButtons');
 panel.insertBefore(sec,buttons);
}

const worldR=world;world=function(){worldR();addRecords();};
const renderR=render;render=function(){const r=renderR();addRecords();return r;};
window.LQ_ADVENTURE_RECORD_STATUS={
 battleWins:true,defeats:true,areas:true,treasures:true,optional:true,
 presentationOnly:true,
 legacyTreasureFlags:[...LEGACY_TREASURE_FLAGS],
 optionalFlags:[...OPTIONAL_FLAGS],
 optionalTotal:OPTIONAL_FLAGS.length,
 treasureFlagList,
 countFlags,
 openedTreasureCount,
 optionalDone,
 noProgressMutation:true
};
addRecords();
})();