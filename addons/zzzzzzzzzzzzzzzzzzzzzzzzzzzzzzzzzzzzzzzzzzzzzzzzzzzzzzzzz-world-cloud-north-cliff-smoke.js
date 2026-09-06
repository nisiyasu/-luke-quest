(() => {
'use strict';

/* REQ-088 fail-closed presentation contract. No gameplay/state mutation. */
const status=window.LQ_WORLD_CLOUD_STATUS;
if(!status||typeof status.hasMap!=='function'||typeof status.classFor!=='function'){
 throw new TypeError('REQ-088 world cloud runtime status contract missing');
}
if(!status.hasMap('northCliffRoad')||status.classFor('northCliffRoad')!=='mist'){
 throw new TypeError('REQ-088 northCliffRoad mist cloud coverage missing');
}
for(const legacy of ['cliff','cliffRoad']){
 if(!status.hasMap(legacy)||status.classFor(legacy)!=='mist'){
  throw new TypeError(`REQ-088 legacy ${legacy} cloud coverage changed`);
 }
}
if(status.hasMap('__lq_unknown_map__')||status.classFor('__lq_unknown_map__')!==null){
 throw new TypeError('REQ-088 unknown-map cloud fallback changed');
}
window.LQ_WORLD_CLOUD_NORTH_CLIFF_SMOKE={pass:true,map:'northCliffRoad',className:'mist',legacy:true,unknownFallback:true};
})();
