(() => {
'use strict';

/* Collision-safe add-on: highlights the exact NPC Luke is facing without changing interaction logic. */
const style=document.createElement('style');
style.textContent=`
.npc.lqFacingNpc{filter:drop-shadow(0 0 7px #f3d86f99) drop-shadow(0 4px 3px #0009)}
.npc.lqFacingNpc::after{content:'A';position:absolute;left:50%;top:-13px;transform:translateX(-50%);width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#f0d36c;color:#18202a;border:2px solid #fff7d4;box-shadow:0 2px 8px #000a;font-size:9px;font-weight:950;line-height:1;animation:lqNpcPromptBob 1s ease-in-out infinite;pointer-events:none}
@keyframes lqNpcPromptBob{0%,100%{margin-top:0}50%{margin-top:-3px}}
@media(prefers-reduced-motion:reduce){.npc.lqFacingNpc::after{animation:none}}
`;
document.head.appendChild(style);

function refreshFacingMarker(){
 const nodes=[...app.querySelectorAll('.npc')];
 nodes.forEach(n=>n.classList.remove('lqFacingNpc'));
 if(s.screen!=='world'||s.dialog||s.pauseOpen||s.shopOpen||s.victoryResult)return;
 const p=front();
 const npcs=currentNpcs();
 const idx=npcs.findIndex(n=>n.x===p.x&&n.y===p.y);
 if(idx>=0&&nodes[idx])nodes[idx].classList.add('lqFacingNpc');
}

const worldBase=world;
world=function(){const r=worldBase();refreshFacingMarker();return r;};
const renderBase=render;
render=function(){const r=renderBase();refreshFacingMarker();return r;};
if(s.screen==='world')refreshFacingMarker();
window.LQ_FACING_NPC_MARKER_STATUS={active:true,interactionLogicUntouched:true,reducedMotion:true};
})();
