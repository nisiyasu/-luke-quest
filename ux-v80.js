(() => {
'use strict';

/* LUKE QUEST v0.80 interaction label polish.
   Extends the existing A bubble with a readable contextual name for nearby NPCs and clue props. */

const style=document.createElement('style');
style.textContent=`
.lqInteractLabel{position:absolute;z-index:24;left:50%;bottom:122px;transform:translateX(-50%);max-width:76%;padding:5px 9px;border-radius:9px;background:#07111fe8;border:1px solid #d8c36c55;box-shadow:0 4px 12px #0008;color:#edf2f5;font-size:9px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none;animation:lqInteractLabelIn .12s ease-out both}.lqInteractLabel b{color:#f4dc86;margin-right:6px}.lqInteractLabel small{color:#7f95a8;font-size:7px;letter-spacing:.08em}@keyframes lqInteractLabelIn{from{opacity:0;transform:translate(-50%,4px)}to{opacity:1;transform:translate(-50%,0)}}@media(max-height:700px){.lqInteractLabel{bottom:105px}}
`;
document.head.appendChild(style);

function addInteractionLabel(){
 if(s.screen!=='world'||s.dialog||s.pauseOpen||s.shopOpen||s.victoryResult)return;
 const p=front();const n=currentNpcs().find(q=>q.x===p.x&&q.y===p.y);if(!n)return;
 const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqInteractLabel'))return;
 const el=document.createElement('div');el.className='lqInteractLabel';el.innerHTML=`<b>A</b>${n.name||'調べる'} <small>EXAMINE</small>`;shell.appendChild(el);
}
const worldV79=world;world=function(){worldV79();addInteractionLabel();};
const renderV79=render;render=function(){const r=renderV79();if(s.screen==='world')addInteractionLabel();return r;};
window.LQ_INTERACTION_LABEL_STATUS={npcAndPropNames:true};
if(s.screen==='world')addInteractionLabel();
})();
