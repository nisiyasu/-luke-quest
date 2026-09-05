(() => {
'use strict';

/* LUKE QUEST v0.107 save schema 5.
   Normalizes systems added after schema 4: playtime, discovered areas and forest bounty. */

const LQ_SAVE_SCHEMA_V107=5;
function normalizeV107(){
 s.flags=s.flags||{};
 if(typeof s.flags.forestBountyAccepted!=='boolean')s.flags.forestBountyAccepted=false;
 if(typeof s.flags.forestBountyComplete!=='boolean')s.flags.forestBountyComplete=false;
 s.forestBountyKills=Math.max(0,Math.min(3,Math.floor(Number(s.forestBountyKills)||0)));
 s.playSeconds=Math.max(0,Math.floor(Number(s.playSeconds)||0));
 s.discoveredMaps=Array.isArray(s.discoveredMaps)?Array.from(new Set(s.discoveredMaps.filter(k=>typeof k==='string'&&MAPS[k]))):[];
 if(s.screen==='world'&&MAPS[s.map]&&!s.discoveredMaps.includes(s.map))s.discoveredMaps.push(s.map);
 s.saveSchema=LQ_SAVE_SCHEMA_V107;
}
normalizeV107();
const saveV106=save;save=function(){normalizeV107();return saveV106();};save();
window.LQ_SAVE_SCHEMA_STATUS=Object.assign({},window.LQ_SAVE_SCHEMA_STATUS,{version:LQ_SAVE_SCHEMA_V107,playtimeMigration:true,discoveredAreaMigration:true,bountyMigration:true});
})();