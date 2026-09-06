(() => {
'use strict';

/* REQ-103 fail-closed presentation contract. No gameplay/state mutation. */
const status=window.LQ_WORLD_LANDMARK_LIGHT_STATUS;
if(!status||typeof status.hasMap!=='function'||typeof status.specsFor!=='function'||typeof status.countFor!=='function'||typeof status.typesFor!=='function'){
 throw new TypeError('REQ-103 world landmark light runtime status contract missing');
}
if(!status.presentationOnly||!status.pointerSafe){
 throw new TypeError('REQ-103 landmark lighting must remain presentation-only and pointer-safe');
}
if(!status.hasMap('windcutPass')||status.countFor('windcutPass')!==2){
 throw new TypeError('REQ-103 windcutPass landmark light coverage missing');
}
const windTypes=status.typesFor('windcutPass');
if(windTypes.length!==2||windTypes.some(type=>type!=='wind')){
 throw new TypeError('REQ-103 windcutPass must use two cold wind glints');
}
const windSpecs=status.specsFor('windcutPass');
if(!windSpecs.some(spec=>spec.x===15&&spec.y===13)||!windSpecs.some(spec=>spec.x===10&&spec.y===1)){
 throw new TypeError('REQ-103 windcutPass glints must track canonical sign and north-boundary landmarks');
}
if(status.countFor('town')!==4||status.countFor('forest')!==1||status.countFor('observation')!==4){
 throw new TypeError('REQ-103 existing landmark lighting counts regressed');
}
if(status.hasMap('__lq_unknown_map__')||status.countFor('__lq_unknown_map__')!==0||status.specsFor('__lq_unknown_map__').length!==0){
 throw new TypeError('REQ-103 unknown-map landmark lighting fallback changed');
}
window.LQ_WORLD_LANDMARK_LIGHT_WINDCUT_SMOKE={pass:true,map:'windcutPass',count:2,style:'wind',existingCoveragePreserved:true,unknownFallback:true,presentationOnly:true,pointerSafe:true};
})();
