(() => {
'use strict';

/* LUKE QUEST v0.126 save schema 6.
   Adds bounded dialogue-history normalization to the existing schema-5 progression migration. */
const SCHEMA=6;
function normalizeV126(){
 s.dialogHistory=Array.isArray(s.dialogHistory)?s.dialogHistory.filter(x=>x&&typeof x.text==='string').slice(-30).map(x=>({name:String(x.name||'SYSTEM').slice(0,40),text:String(x.text).slice(0,600)})):[];
 s.saveSchema=SCHEMA;
}
normalizeV126();const saveV125=save;save=function(){normalizeV126();return saveV125();};save();
window.LQ_SAVE_SCHEMA_STATUS=Object.assign({},window.LQ_SAVE_SCHEMA_STATUS,{version:SCHEMA,dialogueHistoryMigration:true,dialogueHistoryLimit:30});
})();