(() => {
'use strict';

/* LUKE QUEST v0.54 contextual interaction bubble.
   Shows a small A prompt directly over the NPC/prop currently in front of Luke. */

const style=document.createElement('style');
style.textContent=`
.npc.lqInteractTarget:after{content:"A";position:absolute;left:50%;top:-15px;transform:translateX(-50%);min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:#f3d86f;color:#17202a;border:2px solid #fff3b3;display:grid;place-items:center;font-size:9px;font-weight:1000;line-height:1;z-index:20;box-shadow:0 3px 8px #0009;animation:lqInteractBob .65s ease-in-out infinite alternate}@keyframes lqInteractBob{to{translate:0 -2px}}
.npc.lqWorldProp.lqInteractTarget:after,.npc.lqTreasureChestNpc.lqInteractTarget:after,.npc.lqV43Sprite.lqInteractTarget:after{top:-12px}
`;
document.head.appendChild(style);

function markFrontInteraction(){
 if(s.screen!=='world'||s.dialog||s.pauseOpen||s.shopOpen||s.victoryResult)return;
 const p=front();const target=currentNpcs().find(n=>n.x===p.x&&n.y===p.y);if(!target)return;
 const left=target.x*TS+5,top=target.y*TS+3;
 for(const el of app.querySelectorAll('.world .npc')){
   if(Math.abs(parseFloat(el.style.left)-left)<1&&Math.abs(parseFloat(el.style.top)-top)<1){el.classList.add('lqInteractTarget');break;}
 }
}

const worldV53=world;world=function(){worldV53();markFrontInteraction();};
const renderV53=render;render=function(){const r=renderV53();if(s.screen==='world')markFrontInteraction();return r;};
window.LQ_INTERACTION_GUIDANCE_STATUS={frontTargetBubble:true};
if(s.screen==='world')markFrontInteraction();
})();
