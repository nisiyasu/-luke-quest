(() => {
'use strict';

/* REQ-097 fail-closed presentation contract. No gameplay/state mutation. */
const status=window.LQ_WORLD_AMBIENT_STATUS;
if(!status||typeof status.hasMap!=='function'||typeof status.typeFor!=='function'){
 throw new TypeError('REQ-097 world ambient runtime status contract missing');
}
if(!status.hasMap('windcutPass')||status.typeFor('windcutPass')!=='fog'){
 throw new TypeError('REQ-097 windcutPass fog ambience missing');
}
if(!status.hasMap('northCliffRoad')||status.typeFor('northCliffRoad')!=='fog'){
 throw new TypeError('REQ-097 northCliffRoad ambience regressed');
}
if(!status.hasMap('cliffRoad')||status.typeFor('cliffRoad')!=='fog'){
 throw new TypeError('REQ-097 legacy cliffRoad ambience alias changed');
}
if(status.hasMap('__lq_unknown_map__')||status.typeFor('__lq_unknown_map__')!==null){
 throw new TypeError('REQ-097 unknown-map ambience fallback changed');
}
window.LQ_WORLD_AMBIENT_WINDCUT_SMOKE={pass:true,map:'windcutPass',type:'fog',northCliffPreserved:true,legacyAlias:true,unknownFallback:true};
})();
