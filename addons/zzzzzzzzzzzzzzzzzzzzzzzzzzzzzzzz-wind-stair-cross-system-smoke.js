(() => {
'use strict';

/* REQ-117 late-loading fail-closed integration guard. CI smoke only; no gameplay/state mutation. */
if(typeof location!=='undefined'&&!new URLSearchParams(location.search).has('lqSmoke'))return;

function fail(message){throw new TypeError('REQ-117 '+message);}
if(typeof MAPS==='undefined'||!MAPS.windStairRidge)fail('canonical MAPS.windStairRidge missing');

const title=window.LQ_AREA_TITLE_STATUS;
if(!title||typeof title.hasMap!=='function'||!title.hasMap('windStairRidge'))fail('WindStair area-title coverage missing');
if(typeof title.subtitle!=='function'||title.subtitle('windStairRidge')==='LUKE QUEST')fail('WindStair subtitle fell back to generic title');

const ambient=window.LQ_WORLD_AMBIENT_STATUS;
if(!ambient||typeof ambient.typeFor!=='function'||ambient.typeFor('windStairRidge')!=='fog')fail('WindStair ambient coverage missing');

const cloud=window.LQ_WORLD_CLOUD_STATUS;
if(!cloud||typeof cloud.classFor!=='function'||cloud.classFor('windStairRidge')!=='mist')fail('WindStair cloud-shadow coverage missing');

const foot=window.LQ_FOOTSTEP_PARTICLE_STATUS;
if(!foot||typeof foot.kindFor!=='function'||foot.kindFor('windStairRidge')!=='mist')fail('WindStair footstep coverage missing');

const light=window.LQ_WORLD_LANDMARK_LIGHT_STATUS;
if(!light||typeof light.hasMap!=='function'||!light.hasMap('windStairRidge'))fail('WindStair landmark-light coverage missing');
if(typeof light.countFor!=='function'||light.countFor('windStairRidge')<2)fail('WindStair landmark-light density regressed');

if(!MAPS.cloudbreakSaddle)fail('cloudbreakSaddle canonical predecessor regressed');
if(!title.hasMap('cloudbreakSaddle'))fail('cloudbreakSaddle area-title regressed');
if(ambient.typeFor('cloudbreakSaddle')!=='fog')fail('cloudbreakSaddle ambient regressed');
if(cloud.classFor('cloudbreakSaddle')!=='mist')fail('cloudbreakSaddle cloud-shadow regressed');
if(foot.kindFor('cloudbreakSaddle')!=='mist')fail('cloudbreakSaddle footstep regressed');
if(!light.hasMap('cloudbreakSaddle')||light.countFor('cloudbreakSaddle')<2)fail('cloudbreakSaddle landmark-light regressed');

window.LQ_WIND_STAIR_CROSS_SYSTEM_GUARD={
 pass:true,
 map:'windStairRidge',
 predecessor:'cloudbreakSaddle',
 checks:['map','areaTitle','subtitle','ambient','cloudShadow','footstep','landmarkLighting','predecessorContinuity'],
 battleAuthorityExpected:false,
 gameplayMutation:false
};
})();
