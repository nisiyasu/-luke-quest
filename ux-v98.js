(() => {
'use strict';

/* LUKE QUEST v0.98 save schema 4.
   Normalizes systems introduced after v0.68: smoke bombs, bestiary and optional exploration/quest flags. */

const LQ_SAVE_SCHEMA_V98=4;
function normalizeV98(){
 s.flags=s.flags||{};
 for(const k of ['fieldSparkleFound','forestSparkleFound','elderCharmQuest','elderCharmFound','elderCharmComplete','forestCacheOpened','deepCacheOpened'])if(typeof s.flags[k]!=='boolean')s.flags[k]=false;
 s.smokeBombs=Number.isFinite(Number(s.smokeBombs))?Math.max(0,Math.floor(Number(s.smokeBombs))):0;
 s.seenEnemies=Array.isArray(s.seenEnemies)?Array.from(new Set(s.seenEnemies.filter(x=>typeof x==='string'))):[];
 s.enemyDefeats=s.enemyDefeats&&typeof s.enemyDefeats==='object'&&!Array.isArray(s.enemyDefeats)?s.enemyDefeats:{};
 for(const k of Object.keys(s.enemyDefeats)){const v=Math.max(0,Math.floor(Number(s.enemyDefeats[k])||0));if(v)s.enemyDefeats[k]=v;else delete s.enemyDefeats[k];}
 s.saveSchema=LQ_SAVE_SCHEMA_V98;
}
normalizeV98();
const saveV97=save;save=function(){normalizeV98();return saveV97();};save();
window.LQ_SAVE_SCHEMA_STATUS=Object.assign({},window.LQ_SAVE_SCHEMA_STATUS,{version:LQ_SAVE_SCHEMA_V98,smokeBombMigration:true,bestiaryMigration:true,sideQuestMigration:true});
})();
