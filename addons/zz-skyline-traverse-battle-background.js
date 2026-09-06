(() => {
'use strict';

/* REQ-107: original-vector Skyline Traverse battle presentation. */
const MAP_ID='skylineTraverse';
const style=document.createElement('style');
style.textContent=`
.lqSkylineBattleBackdrop{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none;border-radius:inherit;background:linear-gradient(#cfdee0 0 38%,#727d77 39% 100%)}
.lqSkylineBattleBackdrop svg{width:100%;height:100%;display:block;object-fit:cover}.lqSkylineBattleBackdrop::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,#fff0 24%,#12202216 58%,#07100e78 100%);pointer-events:none}
.gameShell>.lqBattleFocus,.gameShell>.lqBattleForeground,.enemySpriteStage,.battleHud,.battleCommands{position:relative;z-index:3}
`;
document.head.appendChild(style);
function art(){return `<svg class="lqSkylineBattleBackgroundSvg" viewBox="0 0 420 220" preserveAspectRatio="xMidYMid slice" role="img" aria-label="北尾根・雲裂きの稜線 戦闘背景"><rect width="420" height="220" fill="#ccdcde"/><g fill="#f4fbfb" opacity=".74"><path d="M-18 55Q36 22 87 52T183 49T278 45T374 48T448 35V88H-18Z"/><path d="M-20 92Q41 63 103 86T216 79T326 84T446 70V111H-20Z" opacity=".45"/></g><path d="M0 119L48 72L89 101L132 43L176 93L220 50L261 100L307 38L351 88L397 48L420 67V154H0Z" fill="#7f8b87"/><path d="M0 150L50 117L98 132L147 91L191 126L242 92L290 130L337 91L382 122L420 98V176H0Z" fill="#5c6963"/><path d="M0 177Q55 154 111 169T220 159T328 171T420 156V220H0Z" fill="#424d47"/><path d="M-22 198Q64 166 127 181T240 166T345 179T445 162" fill="none" stroke="#d9cca4" stroke-width="9" opacity=".88"/><g fill="none" stroke="#f8ffff" stroke-width="3" stroke-linecap="round" opacity=".72"><path d="M-25 30Q67 14 153 31T307 27T449 31"/><path d="M-10 65Q78 47 167 62T326 56T447 61"/></g><g fill="#37413c"><path d="M38 220L83 148L116 220M293 220L337 139L390 220"/></g></svg>`;}
function apply(){
 if(s.screen!=='battle'||s.map!==MAP_ID)return false;
 const shell=app.querySelector('.gameShell');if(!shell)return false;
 let layer=shell.querySelector('.lqSkylineBattleBackdrop');
 if(!layer){layer=document.createElement('div');layer.className='lqSkylineBattleBackdrop';layer.dataset.map=MAP_ID;layer.dataset.lqFormalStage='original-vector-skyline-traverse-battle-background';layer.innerHTML=art();shell.prepend(layer);}
 return true;
}
const battleBase=battle;battle=function(){const r=battleBase();apply();return r;};
const renderBase=render;render=function(){const r=renderBase();apply();return r;};
window.LQ_SKYLINE_BATTLE_BACKGROUND_STATUS={map:MAP_ID,displayName:'北尾根・雲裂きの稜線',originalVector:true,presentationOnly:true,pointerSafe:true,protectedCanonChanged:false,saveSchemaChanged:false,apply};
apply();
})();
