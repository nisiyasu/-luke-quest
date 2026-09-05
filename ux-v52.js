(() => {
'use strict';

/* LUKE QUEST v0.52 adventure-menu character presentation.
   Reuses the already Owner-approved formal Luke full-body asset. No new character art is fabricated. */

const style=document.createElement('style');
style.textContent=`
.lqHeroEmblem.lqFormalLukeMenu{position:relative;overflow:hidden;border-radius:10px;width:68px;height:84px;background:linear-gradient(180deg,#31577e,#13243a);box-shadow:0 5px 14px #0008;border:2px solid #d4b75f}.lqHeroEmblem.lqFormalLukeMenu img{width:100%;height:100%;object-fit:contain;object-position:center bottom;display:block;filter:drop-shadow(0 2px 3px #0007)}.lqHeroEmblem.lqFormalLukeMenu:after{content:"LUKE";position:absolute;left:3px;right:3px;bottom:2px;padding:2px;border-radius:5px;background:#07111fbb;color:#ffe5a1;font-size:7px;letter-spacing:.14em;text-align:center}.lqPauseHero:has(.lqFormalLukeMenu){grid-template-columns:74px 1fr;align-items:center}@media(max-width:390px){.lqHeroEmblem.lqFormalLukeMenu{width:58px;height:74px}.lqPauseHero:has(.lqFormalLukeMenu){grid-template-columns:62px 1fr}}
`;
document.head.appendChild(style);

function applyFormalLukeToMenu(){
 if(!s.pauseOpen||s.screen!=='world')return;
 const host=app.querySelector('.lqHeroEmblem');if(!host||host.dataset.formalLuke==='1')return;
 const src=window.LQ_PORTRAITS?.luke?.neutral;
 if(!src||String(src).includes('assets/portraits/luke.svg'))return;
 host.dataset.formalLuke='1';host.classList.add('lqFormalLukeMenu');
 const img=document.createElement('img');img.src=src;img.alt='ルーク 正式立ち絵';img.decoding='async';host.replaceChildren(img);
}

const worldV51=world;world=function(){worldV51();applyFormalLukeToMenu();};
const renderV51=render;render=function(){const r=renderV51();applyFormalLukeToMenu();return r;};

if(window.LQ_hydrateFormalDialogueAsset){
 void window.LQ_hydrateFormalDialogueAsset('luke','neutral').then(ok=>{if(ok&&s.pauseOpen)applyFormalLukeToMenu();});
}
window.LQ_MENU_CHARACTER_STATUS={formalLukeReuse:true,newArtGenerated:false};
if(s.pauseOpen)applyFormalLukeToMenu();
})();
