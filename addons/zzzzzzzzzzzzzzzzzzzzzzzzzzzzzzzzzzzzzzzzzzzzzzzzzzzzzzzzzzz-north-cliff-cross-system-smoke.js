(() => {
'use strict';

/* REQ-090 CI-only cross-system self-audit. No ordinary-play mutation. */
const enabled=new URLSearchParams(location.search).get('lqSmoke')==='1';
if(!enabled){window.LQ_NORTH_CLIFF_CROSS_SYSTEM_SMOKE={available:true,active:false};return;}
const MAP='northCliffRoad';
function assert(ok,msg){if(!ok)throw new TypeError(`REQ-090 ${msg}`);}
assert(typeof MAPS==='object'&&!!MAPS[MAP],'canonical northCliffRoad map missing');
assert(window.LQ_NORTH_CLIFF_GUIDANCE_STATUS?.map===MAP,'local guidance coverage missing');
assert(window.LQ_ADVENTURE_JOURNAL_STATUS?.northCliffLocationAware===true,'journal location awareness missing');
assert(typeof window.LQ_ORIGINAL_BATTLE_BACKGROUND_STATUS?.hasMap==='function'&&window.LQ_ORIGINAL_BATTLE_BACKGROUND_STATUS.hasMap(MAP),'battle backdrop coverage missing');
assert(typeof window.LQ_AREA_TITLE_STATUS?.hasMap==='function'&&window.LQ_AREA_TITLE_STATUS.hasMap(MAP),'area title coverage missing');
assert(typeof window.LQ_WORLD_AMBIENT_STATUS?.typeFor==='function'&&window.LQ_WORLD_AMBIENT_STATUS.typeFor(MAP)==='fog','ambient fog coverage missing');
assert(typeof window.LQ_WORLD_CLOUD_STATUS?.classFor==='function'&&window.LQ_WORLD_CLOUD_STATUS.classFor(MAP)==='mist','cloud-shadow mist coverage missing');
assert(typeof window.LQ_FOOTSTEP_PARTICLE_STATUS?.kindFor==='function'&&window.LQ_FOOTSTEP_PARTICLE_STATUS.kindFor(MAP)==='mist','footstep mist coverage missing');
window.LQ_NORTH_CLIFF_CROSS_SYSTEM_SMOKE={available:true,active:true,pass:true,map:MAP,checks:['map','guidance','journal','battleBackdrop','areaTitle','ambient','cloudShadow','footstep']};
})();
