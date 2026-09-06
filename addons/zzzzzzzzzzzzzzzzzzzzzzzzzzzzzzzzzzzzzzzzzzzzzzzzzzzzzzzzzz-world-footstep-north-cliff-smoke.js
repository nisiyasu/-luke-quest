(() => {
'use strict';

/* REQ-089 fail-closed presentation contract. No gameplay/state mutation. */
const status=window.LQ_FOOTSTEP_PARTICLE_STATUS;
if(!status||typeof status.hasMap!=='function'||typeof status.kindFor!=='function'){
 throw new TypeError('REQ-089 footstep runtime status contract missing');
}
if(!status.hasMap('northCliffRoad')||status.kindFor('northCliffRoad')!=='mist'){
 throw new TypeError('REQ-089 northCliffRoad mist footstep coverage missing');
}
for(const legacy of ['cliff','cliffRoad']){
 if(!status.hasMap(legacy)||status.kindFor(legacy)!=='mist'){
  throw new TypeError(`REQ-089 legacy ${legacy} footstep coverage changed`);
 }
}
if(status.hasMap('__lq_unknown_map__')||status.kindFor('__lq_unknown_map__')!==null){
 throw new TypeError('REQ-089 unknown-map footstep fallback changed');
}
window.LQ_FOOTSTEP_NORTH_CLIFF_SMOKE={pass:true,map:'northCliffRoad',kind:'mist',legacy:true,unknownFallback:true};
})();
