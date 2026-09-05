(() => {
'use strict';

/* LUKE QUEST v0.68 save-schema normalization.
   Establishes an explicit schema marker and defensive migration for fields introduced across patch generations. */

const LQ_SAVE_SCHEMA=3;
function normalizeSaveState(){
 s.flags=s.flags||{};
 s.equipmentOwned=Array.isArray(s.equipmentOwned)?Array.from(new Set(s.equipmentOwned)):['旅人の短剣','旅人服'];
 if(!s.equipmentOwned.includes('旅人の短剣'))s.equipmentOwned.unshift('旅人の短剣');
 if(!s.equipmentOwned.includes('旅人服'))s.equipmentOwned.push('旅人服');
 s.weapon=s.weapon||'旅人の短剣';s.armor=s.armor||'旅人服';
 s.def=Number.isFinite(Number(s.def))?Math.max(0,Number(s.def)):0;
 s.gold=Number.isFinite(Number(s.gold))?Math.max(0,Math.floor(Number(s.gold))):0;
 s.potions=Number.isFinite(Number(s.potions))?Math.max(0,Math.floor(Number(s.potions))):0;
 s.settings=s.settings||{};if(typeof s.settings.sound!=='boolean')s.settings.sound=true;
 s.saveSchema=LQ_SAVE_SCHEMA;
}
normalizeSaveState();

const saveV67=save;
save=function(){normalizeSaveState();return saveV67();};
save();

window.LQ_SAVE_SCHEMA_STATUS={version:LQ_SAVE_SCHEMA,normalizedEquipment:true,normalizedEconomy:true,settingsMigration:true};
})();
