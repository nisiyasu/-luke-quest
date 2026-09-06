(() => {
'use strict';

/* REQ-100 late-loading fail-closed integration guard. CI smoke only; no gameplay/state mutation. */
if(typeof location!=='undefined'&&!new URLSearchParams(location.search).has('lqSmoke'))return;

function fail(message){throw new TypeError('REQ-100 '+message);}
if(typeof MAPS==='undefined'||!MAPS.windcutPass)fail('canonical MAPS.windcutPass missing');
const guide=window.LQ_WINDCUT_GUIDANCE_STATUS;
if(!guide||guide.map!=='windcutPass')fail('Windcut local guidance coverage missing');
const battle=window.LQ_ORIGINAL_BATTLE_BACKGROUND_STATUS;
if(!battle||typeof battle.hasMap!=='function'||!battle.hasMap('windcutPass'))fail('Windcut battle backdrop coverage missing');
const title=window.LQ_AREA_TITLE_STATUS;
if(!title||typeof title.hasMap!=='function'||!title.hasMap('windcutPass'))fail('Windcut area-title coverage missing');
const ambient=window.LQ_WORLD_AMBIENT_STATUS;
if(!ambient||typeof ambient.typeFor!=='function'||ambient.typeFor('windcutPass')!=='fog')fail('Windcut ambient coverage missing');
const cloud=window.LQ_WORLD_CLOUD_STATUS;
if(!cloud||typeof cloud.classFor!=='function'||cloud.classFor('windcutPass')!=='mist')fail('Windcut cloud-shadow coverage missing');
const foot=window.LQ_FOOTSTEP_PARTICLE_STATUS;
if(!foot||typeof foot.kindFor!=='function'||foot.kindFor('windcutPass')!=='mist')fail('Windcut footstep coverage missing');

if(!MAPS.northCliffRoad)fail('northCliffRoad canonical predecessor regressed');
if(!battle.hasMap('northCliffRoad'))fail('northCliffRoad battle backdrop regressed');
if(!title.hasMap('northCliffRoad'))fail('northCliffRoad area-title regressed');
if(ambient.typeFor('northCliffRoad')!=='fog')fail('northCliffRoad ambient regressed');
if(cloud.classFor('northCliffRoad')!=='mist')fail('northCliffRoad cloud-shadow regressed');
if(foot.kindFor('northCliffRoad')!=='mist')fail('northCliffRoad footstep regressed');

window.LQ_WINDCUT_CROSS_SYSTEM_GUARD={pass:true,map:'windcutPass',predecessor:'northCliffRoad',checks:['map','guidance','battleBackdrop','areaTitle','ambient','cloudShadow','footstep','predecessorContinuity'],gameplayMutation:false};
})();
