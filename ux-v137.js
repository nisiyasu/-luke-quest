(() => {
'use strict';
/* LUKE QUEST v0.137 save schema 8: normalize audio preference flags. */
const SCHEMA=8;function normalizeV137(){s.settings=s.settings||{};if(typeof s.settings.music!=='boolean')s.settings.music=true;if(typeof s.settings.sfx!=='boolean')s.settings.sfx=true;s.saveSchema=SCHEMA;}normalizeV137();const saveV136=save;save=function(){normalizeV137();return saveV136();};save();window.LQ_SAVE_SCHEMA_STATUS=Object.assign({},window.LQ_SAVE_SCHEMA_STATUS,{version:SCHEMA,audioSettingsMigration:true});
})();