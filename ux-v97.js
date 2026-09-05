(() => {
'use strict';

/* LUKE QUEST v0.97 prologue character presentation.
   Reuses Owner-approved formal Luke art only on Luke-spoken prologue beats. */

const style=document.createElement('style');
style.textContent=`
.lqIntroScene.lqLukeIntro{position:relative;padding-right:128px!important;overflow:hidden}.lqIntroLukeArt{position:absolute;right:0;bottom:-8px;width:122px;height:220px;object-fit:contain;object-position:center bottom;filter:drop-shadow(-5px 5px 7px #0009);opacity:.9}.lqIntroScene.lqLukeIntro .speaker,.lqIntroScene.lqLukeIntro .dialog,.lqIntroScene.lqLukeIntro .lqIntroStep,.lqIntroScene.lqLukeIntro button{position:relative;z-index:2}.lqIntroScene.lqLukeIntro:after{content:"";position:absolute;z-index:1;right:78px;top:0;bottom:0;width:72px;background:linear-gradient(90deg,#14243a,transparent);pointer-events:none}@media(max-width:390px){.lqIntroScene.lqLukeIntro{padding-right:94px!important}.lqIntroLukeArt{right:-13px;width:100px;height:190px;opacity:.78}.lqIntroScene.lqLukeIntro:after{right:57px;width:55px}}
`;
document.head.appendChild(style);
function addIntroLuke(){
 if(s.screen!=='intro')return;const speaker=app.querySelector('.lqIntroScene .speaker');const card=speaker?.closest('.lqIntroScene');if(!card||speaker.textContent.trim()!=='ルーク'||card.querySelector('.lqIntroLukeArt'))return;
 const src=window.LQ_PORTRAITS?.luke?.neutral;if(!src||String(src).includes('assets/portraits/luke.svg'))return;card.classList.add('lqLukeIntro');const img=document.createElement('img');img.className='lqIntroLukeArt';img.src=src;img.alt='ルーク 正式立ち絵';img.decoding='async';card.appendChild(img);
}
const storyV96=story;story=function(){const r=storyV96();addIntroLuke();return r;};const renderV96=render;render=function(){const r=renderV96();if(s.screen==='intro')addIntroLuke();return r;};
if(window.LQ_hydrateFormalDialogueAsset){void window.LQ_hydrateFormalDialogueAsset('luke','neutral').then(ok=>{if(ok)addIntroLuke();});}
window.LQ_PROLOGUE_CHARACTER_STATUS={formalLukeOnLukeBeats:true,newArtGenerated:false};
if(s.screen==='intro')addIntroLuke();
})();
