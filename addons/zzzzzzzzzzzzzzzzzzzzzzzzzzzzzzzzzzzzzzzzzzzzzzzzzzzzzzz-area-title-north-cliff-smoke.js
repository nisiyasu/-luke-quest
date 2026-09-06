(() => {
'use strict';

/* REQ-086 fail-closed presentation contract. No gameplay/state mutation. */
const status=window.LQ_AREA_TITLE_STATUS;
if(!status||typeof status.hasMap!=='function'||typeof status.subtitle!=='function'){
 throw new TypeError('REQ-086 area-title runtime status contract missing');
}
if(!status.hasMap('northCliffRoad')){
 throw new TypeError('REQ-086 northCliffRoad area-title coverage missing');
}
const north=status.subtitle('northCliffRoad');
if(!north||north==='LUKE QUEST'||!north.includes('崖道')){
 throw new TypeError('REQ-086 northCliffRoad dedicated subtitle missing');
}
if(status.subtitle('__lq_unknown_map__')!=='LUKE QUEST'){
 throw new TypeError('REQ-086 unknown-map fallback changed');
}
window.LQ_AREA_TITLE_NORTH_CLIFF_SMOKE={pass:true,map:'northCliffRoad',subtitle:north,unknownFallback:true};
})();
