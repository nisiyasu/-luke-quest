(() => {
'use strict';

/* LUKE QUEST v0.99 dynamic build label.
   Prevents the rollback-safe v0.7 core footer from making the public build look stale. */

function latestPatchVersion(){
 let max=7;for(const sc of document.scripts){const m=(sc.getAttribute('src')||'').match(/ux-v(\d+)\.js(?:\?|$)/);if(m)max=Math.max(max,Number(m[1]));}return max;
}
function updateBuildLabel(){
 const foot=app.querySelector('.foot');if(!foot)return;const v=latestPatchVersion();foot.textContent=`LUKE QUEST v0.${v} • AUTOSAVE • iPhone 2D JRPG BUILD`;foot.dataset.lqVersion=String(v);
}
const style=document.createElement('style');
style.textContent=`.foot{letter-spacing:.07em!important;color:#60798c!important;font-size:8px!important}.foot:before{content:"● ";color:#65b980}`;document.head.appendChild(style);
const renderV98=render;render=function(){const r=renderV98();queueMicrotask(updateBuildLabel);return r;};
window.addEventListener('load',updateBuildLabel,{once:true});setTimeout(updateBuildLabel,0);
window.LQ_BUILD_LABEL_STATUS={dynamicPatchDiscovery:true};
})();
