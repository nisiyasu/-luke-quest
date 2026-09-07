(() => {
'use strict';

/* REQ-133 — Chapter 1 Complete Upper Pursuit Guidance Closure.
   Presentation-only terminal guard. It intentionally does not mutate story,
   save, collision, encounter, transition, action, or touch authority. */
const TARGETS={
  windShelf:['.lqWindShelfGuide','.lqWindShelfMarker'],
  skylineTraverse:['.lqSkylineGuide','.lqSkylineMarker'],
  cloudbreakSaddle:['.lqCloudbreakGuide','.lqCloudbreakMarker']
};

function chapter1Complete(){return s?.flags?.chapter1Complete===true;}
function cleanup(mapId=s?.map){
  if(!chapter1Complete())return false;
  const selectors=TARGETS[mapId];
  if(!selectors)return false;
  let removed=false;
  document.querySelectorAll(selectors.join(',')).forEach(node=>{removed=true;node.remove();});
  return removed;
}

const renderBase=render;
render=function(){
  const result=renderBase();
  cleanup();
  return result;
};
const worldBase=world;
world=function(){
  const result=worldBase();
  cleanup();
  return result;
};

window.LQ_REQ133_UPPER_GUIDANCE_GUARD={
  version:'1.0',
  maps:Object.keys(TARGETS),
  terminalFlag:'chapter1Complete',
  presentationOnly:true,
  cleanup,
  iosPhysicalVerification:'PENDING'
};
})();
