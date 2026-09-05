(() => {
'use strict';

/* LUKE QUEST v0.60 victory-character presentation.
   Reuses the existing Owner-approved formal Luke art in the result screen. */

const style=document.createElement('style');
style.textContent=`
.lqVictoryPanel.lqFormalVictory{position:relative;overflow:hidden;padding-left:112px;min-height:244px;text-align:left}.lqVictoryLuke{position:absolute;left:4px;bottom:-8px;width:108px;height:232px;object-fit:contain;object-position:center bottom;filter:drop-shadow(4px 5px 6px #0009);z-index:1}.lqVictoryPanel.lqFormalVictory>*:not(.lqVictoryLuke){position:relative;z-index:2}.lqVictoryPanel.lqFormalVictory:after{content:"";position:absolute;left:82px;top:0;bottom:0;width:56px;background:linear-gradient(90deg,transparent,#152638 82%);z-index:1;pointer-events:none}.lqVictoryPanel.lqFormalVictory .lqVictoryTitle{font-size:25px}.lqVictoryPanel.lqFormalVictory .lqVictoryRewards{grid-template-columns:1fr 1fr}@media(max-width:390px){.lqVictoryPanel.lqFormalVictory{padding-left:92px;padding-right:10px;min-height:224px}.lqVictoryLuke{width:91px;height:208px;left:1px}.lqVictoryPanel.lqFormalVictory:after{left:67px;width:42px}.lqVictoryPanel.lqFormalVictory .lqVictoryTitle{font-size:21px}}
`;
document.head.appendChild(style);

function addLukeToVictory(){
 if(s.screen!=='world'||!s.victoryResult)return;
 const panel=app.querySelector('.lqVictoryPanel');if(!panel||panel.querySelector('.lqVictoryLuke'))return;
 const src=window.LQ_PORTRAITS?.luke?.neutral;if(!src||String(src).includes('assets/portraits/luke.svg'))return;
 panel.classList.add('lqFormalVictory');const img=document.createElement('img');img.className='lqVictoryLuke';img.src=src;img.alt='ルーク 正式立ち絵';img.decoding='async';panel.prepend(img);
}

const worldV59=world;world=function(){worldV59();addLukeToVictory();};
const renderV59=render;render=function(){const r=renderV59();addLukeToVictory();return r;};
if(window.LQ_hydrateFormalDialogueAsset){void window.LQ_hydrateFormalDialogueAsset('luke','neutral').then(ok=>{if(ok)addLukeToVictory();});}
window.LQ_VICTORY_CHARACTER_STATUS={formalLukeReuse:true,newArtGenerated:false};
addLukeToVictory();
})();
