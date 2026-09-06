(() => {
'use strict';

/* REQ-087 fail-closed presentation contract. No gameplay/state mutation. */
const status=window.LQ_WORLD_AMBIENT_STATUS;
if(!status||typeof status.hasMap!=='function'||typeof status.typeFor!=='function'){
 throw new TypeError('REQ-087 world ambient runtime status contract missing');
}
if(!status.hasMap('northCliffRoad')||status.typeFor('northCliffRoad')!=='fog'){
 throw new TypeError('REQ-087 northCliffRoad fog ambience missing');
}
if(!status.hasMap('cliffRoad')||status.typeFor('cliffRoad')!=='fog'){
 throw new TypeError('REQ-087 legacy cliffRoad ambience alias changed');
}
if(status.hasMap('__lq_unknown_map__')||status.typeFor('__lq_unknown_map__')!==null){
 throw new TypeError('REQ-087 unknown-map ambience fallback changed');
}
window.LQ_WORLD_AMBIENT_NORTH_CLIFF_SMOKE={pass:true,map:'northCliffRoad',type:'fog',legacyAlias:true,unknownFallback:true};
})();
