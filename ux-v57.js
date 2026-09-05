(() => {
'use strict';

/* LUKE QUEST v0.57 title hero presentation.
   Reuses only the existing Owner-approved formal Luke full-body art. */

const style=document.createElement('style');
style.textContent=`
.lqTitleFormalHero{position:absolute;z-index:1;right:-18px;bottom:-8px;width:190px;height:310px;object-fit:contain;object-position:center bottom;filter:drop-shadow(-10px 12px 14px #0009) saturate(.9);opacity:.52;mask-image:linear-gradient(to bottom,#000 0 68%,transparent 100%);pointer-events:none}.lqTitleStage>*:not(.lqTitleFormalHero):not(.lqTitleMountains):not(.lqTitleStars){position:relative;z-index:3}.lqTitleStage:after{content:"";position:absolute;z-index:2;inset:0;background:linear-gradient(90deg,#081a33ee 0 42%,#081a3388 64%,transparent 100%);pointer-events:none}.lqTitleStage .lqTitleMountains,.lqTitleStage .lqTitleStars{z-index:1}@media(max-width:390px){.lqTitleFormalHero{right:-48px;width:170px;height:275px;opacity:.42}.lqTitleStage:after{background:linear-gradient(90deg,#081a33f0 0 50%,#081a3377 75%,transparent)}}
`;
document.head.appendChild(style);

function addFormalTitleLuke(){
 if(s.screen!=='title')return;
 const stage=app.querySelector('.lqTitleStage');if(!stage||stage.querySelector('.lqTitleFormalHero'))return;
 const src=window.LQ_PORTRAITS?.luke?.neutral;
 if(!src||String(src).includes('assets/portraits/luke.svg'))return;
 const img=document.createElement('img');img.className='lqTitleFormalHero';img.src=src;img.alt='ルーク 正式立ち絵';img.decoding='async';stage.appendChild(img);
}

const titleV56=title;title=function(){titleV56();addFormalTitleLuke();};
const renderV56=render;render=function(){const r=renderV56();if(s.screen==='title')addFormalTitleLuke();return r;};
if(window.LQ_hydrateFormalDialogueAsset){void window.LQ_hydrateFormalDialogueAsset('luke','neutral').then(ok=>{if(ok&&s.screen==='title')addFormalTitleLuke();});}
window.LQ_TITLE_CHARACTER_STATUS={formalLukeHero:true,newArtGenerated:false};
if(s.screen==='title')addFormalTitleLuke();
})();
