(() => {
'use strict';

/* REQ-098 fail-closed presentation contract. No gameplay/state mutation. */
const status=window.LQ_WORLD_CLOUD_STATUS;
if(!status||typeof status.hasMap!=='function'||typeof status.classFor!=='function'){
 throw new TypeError('REQ-098 world cloud runtime status contract missing');
}
if(!status.hasMap('windcutPass')||status.classFor('windcutPass')!=='mist'){
 throw new TypeError('REQ-098 windcutPass mist cloud coverage missing');
}
if(!status.hasMap('northCliffRoad')||status.classFor('northCliffRoad')!=='mist'){
 throw new TypeError('REQ-098 northCliffRoad cloud coverage regressed');
}
for(const legacy of ['cliff','cliffRoad']){
 if(!status.hasMap(legacy)||status.classFor(legacy)!=='mist'){
  throw new TypeError(`REQ-098 legacy ${legacy} cloud coverage changed`);
 }
}
if(status.hasMap('__lq_unknown_map__')||status.classFor('__lq_unknown_map__')!==null){
 throw new TypeError('REQ-098 unknown-map cloud fallback changed');
}
window.LQ_WORLD_CLOUD_WINDCUT_SMOKE={pass:true,map:'windcutPass',className:'mist',northCliffPreserved:true,legacy:true,unknownFallback:true};
})();
