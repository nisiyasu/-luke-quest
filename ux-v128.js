(() => {
'use strict';
/* LUKE QUEST v0.128 save schema 7: normalize persistent forest treasure state. */
const SCHEMA=7;function normalizeV128(){s.flags=s.flags||{};if(typeof s.flags.forestChestOpened!=='boolean')s.flags.forestChestOpened=false;s.saveSchema=SCHEMA;}normalizeV128();const saveV127=save;save=function(){normalizeV128();return saveV127();};save();window.LQ_SAVE_SCHEMA_STATUS=Object.assign({},window.LQ_SAVE_SCHEMA_STATUS,{version:SCHEMA,forestTreasureMigration:true});
})();