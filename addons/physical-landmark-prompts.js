(() => {
'use strict';

/* Collision-safe add-on: direct A prompts for physical landmarks that are not NPC-list objects. */
const LANDMARKS={
 town:{'8,8':'王都中央広場の噴水','2,9':'朝採れ果実の露店','3,9':'朝採れ果実の露店','14,9':'旅道具の露店','15,9':'旅道具の露店'}
};
const style=document.createElement('style');
style.textContent=`.lqLandmarkPrompt{position:absolute;z-index:25;left:50%;bottom:122px;transform:translateX(-50%);padding:5px 9px;border-radius:9px;background:#07111fe8;border:1px solid #d8c36c55;box-shadow:0 4px 12px #0008;color:#edf2f5;font-size:9px;font-weight:900;white-space:nowrap;pointer-events:none}.lqLandmarkPrompt b{display:inline-grid;place-items:center;width:17px;height:17px;border-radius:50%;margin-right:6px;background:#efd873;color:#18222b;font-size:9px}.lqLandmarkPrompt small{color:#8095a7;font-size:7px;margin-left:6px;letter-spacing:.08em}@media(max-height:700px){.lqLandmarkPrompt{bottom:105px}}`;
document.head.appendChild(style);
function addPrompt(){
 if(s.screen!=='world'||s.dialog||s.pauseOpen||s.shopOpen||s.victoryResult)return;const table=LANDMARKS[s.map];if(!table)return;const p=front(),name=table[`${p.x},${p.y}`];if(!name)return;const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqLandmarkPrompt'))return;const e=document.createElement('div');e.className='lqLandmarkPrompt';e.innerHTML=`<b>A</b>${name}<small>EXAMINE</small>`;shell.appendChild(e);
}
const worldL=world;world=function(){worldL();addPrompt();};const renderL=render;render=function(){const r=renderL();addPrompt();return r;};
window.LQ_LANDMARK_PROMPT_STATUS={fountain:true,marketStalls:true};
if(s.screen==='world')addPrompt();
})();
