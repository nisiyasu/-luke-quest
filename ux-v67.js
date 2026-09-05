(() => {
'use strict';

/* LUKE QUEST v0.67 player battle presence.
   Reuses the existing Owner-approved formal Luke full-body art inside combat UI. */

const style=document.createElement('style');
style.textContent=`
.battleCommandCard.lqBattleLukeCard{position:relative;overflow:hidden}.lqBattleLukeArt{position:absolute;z-index:1;right:5px;top:2px;width:68px;height:92px;object-fit:contain;object-position:center bottom;filter:drop-shadow(0 4px 5px #0009);opacity:.9;pointer-events:none}.battleCommandCard.lqBattleLukeCard .battlePlayerLine{position:relative;z-index:2;padding-right:72px;background:linear-gradient(90deg,#07111ff2 0 72%,#07111f99 100%)}.battleCommandCard.lqBattleLukeCard .commandLabel,.battleCommandCard.lqBattleLukeCard .commandGrid,.battleCommandCard.lqBattleLukeCard .battleLogV10{position:relative;z-index:2}@media(max-height:700px){.lqBattleLukeArt{width:54px;height:71px;opacity:.76}.battleCommandCard.lqBattleLukeCard .battlePlayerLine{padding-right:58px}}
`;
document.head.appendChild(style);

function addBattleLuke(){
 if(s.screen!=='battle')return;
 const card=app.querySelector('.battleCommandCard');if(!card||card.querySelector('.lqBattleLukeArt'))return;
 const src=window.LQ_PORTRAITS?.luke?.neutral;if(!src||String(src).includes('assets/portraits/luke.svg'))return;
 card.classList.add('lqBattleLukeCard');const img=document.createElement('img');img.className='lqBattleLukeArt';img.src=src;img.alt='ルーク 正式立ち絵';img.decoding='async';card.prepend(img);
}

const battleV66=battle;battle=function(){const r=battleV66();addBattleLuke();return r;};
const renderV66=render;render=function(){const r=renderV66();if(s.screen==='battle')addBattleLuke();return r;};
if(window.LQ_hydrateFormalDialogueAsset){void window.LQ_hydrateFormalDialogueAsset('luke','neutral').then(ok=>{if(ok)addBattleLuke();});}
window.LQ_BATTLE_CHARACTER_STATUS={formalLukeReuse:true,newArtGenerated:false};
if(s.screen==='battle')addBattleLuke();
})();
