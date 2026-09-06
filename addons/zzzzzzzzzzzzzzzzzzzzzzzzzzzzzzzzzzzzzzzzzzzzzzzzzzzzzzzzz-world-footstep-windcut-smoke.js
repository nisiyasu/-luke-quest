(() => {
'use strict';

/* REQ-099 fail-closed presentation contract. No gameplay/state mutation. */
const status=window.LQ_FOOTSTEP_PARTICLE_STATUS;
if(!status||typeof status.hasMap!=='function'||typeof status.kindFor!=='function'){
 throw new TypeError('REQ-099 footstep runtime status contract missing');
}
if(!status.hasMap('windcutPass')||status.kindFor('windcutPass')!=='mist'){
 throw new TypeError('REQ-099 windcutPass mist footstep coverage missing');
}
if(!status.hasMap('northCliffRoad')||status.kindFor('northCliffRoad')!=='mist'){
 throw new TypeError('REQ-099 northCliffRoad footstep coverage regressed');
}
for(const legacy of ['cliff','cliffRoad']){
 if(!status.hasMap(legacy)||status.kindFor(legacy)!=='mist'){
  throw new TypeError(`REQ-099 legacy ${legacy} footstep coverage changed`);
 }
}
if(status.hasMap('__lq_unknown_map__')||status.kindFor('__lq_unknown_map__')!==null){
 throw new TypeError('REQ-099 unknown-map footstep fallback changed');
}
window.LQ_FOOTSTEP_WINDCUT_SMOKE={pass:true,map:'windcutPass',kind:'mist',northCliffPreserved:true,legacy:true,unknownFallback:true};
})();
