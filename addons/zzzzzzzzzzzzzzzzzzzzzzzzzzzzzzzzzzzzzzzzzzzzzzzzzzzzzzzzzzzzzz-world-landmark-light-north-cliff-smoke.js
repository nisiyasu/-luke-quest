(() => {
'use strict';

/* REQ-104 fail-closed presentation contract. No gameplay/state mutation. */
const status=window.LQ_WORLD_LANDMARK_LIGHT_STATUS;
if(!status||typeof status.hasMap!=='function'||typeof status.specsFor!=='function'||typeof status.countFor!=='function'||typeof status.typesFor!=='function'){
 throw new TypeError('REQ-104 world landmark light runtime status contract missing');
}
if(!status.presentationOnly||!status.pointerSafe){
 throw new TypeError('REQ-104 landmark lighting must remain presentation-only and pointer-safe');
}
if(!status.hasMap('northCliffRoad')||status.countFor('northCliffRoad')!==2){
 throw new TypeError('REQ-104 northCliffRoad landmark light coverage missing');
}
const cliffTypes=status.typesFor('northCliffRoad');
if(cliffTypes.length!==2||cliffTypes.some(type=>type!=='cliff')){
 throw new TypeError('REQ-104 northCliffRoad must use two cliff glints');
}
const cliffSpecs=status.specsFor('northCliffRoad');
if(!cliffSpecs.some(spec=>spec.x===15&&spec.y===12)||!cliffSpecs.some(spec=>spec.x===10&&spec.y===1)){
 throw new TypeError('REQ-104 northCliffRoad glints must track canonical broken stake and north boundary');
}
if(!status.hasMap('windcutPass')||status.countFor('windcutPass')!==2||status.typesFor('windcutPass').some(type=>type!=='wind')){
 throw new TypeError('REQ-104 REQ-103 windcutPass landmark coverage regressed');
}
if(status.countFor('town')!==4||status.countFor('forest')!==1||status.countFor('observation')!==4){
 throw new TypeError('REQ-104 existing landmark lighting counts regressed');
}
if(status.hasMap('__lq_unknown_map__')||status.countFor('__lq_unknown_map__')!==0||status.specsFor('__lq_unknown_map__').length!==0){
 throw new TypeError('REQ-104 unknown-map landmark lighting fallback changed');
}
window.LQ_WORLD_LANDMARK_LIGHT_NORTH_CLIFF_SMOKE={pass:true,map:'northCliffRoad',count:2,style:'cliff',windcutPreserved:true,existingCoveragePreserved:true,unknownFallback:true,presentationOnly:true,pointerSafe:true};
})();
