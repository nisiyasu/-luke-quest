(() => {
'use strict';

/* REQ-108: original-vector Cloudbreak Saddle battle presentation. */
const MAP_ID='cloudbreakSaddle';
const style=document.createElement('style');
style.textContent=`
.lqCloudbreakBattleBackdrop{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none;border-radius:inherit;background:linear-gradient(#d8e4e4 0 36%,#758079 37% 100%)}
.lqCloudbreakBattleBackdrop svg{width:100%;height:100%;display:block;object-fit:cover}.lqCloudbreakBattleBackdrop::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,#fff0 24%,#12202214 58%,#07100e78 100%);pointer-events:none}
.gameShell>.lqBattleFocus,.gameShell>.lqBattleForeground,.enemySpriteStage,.battleHud,.battleCommands{position:relative;z-index:3}
`;
document.head.appendChild(style);
function art(){return `<svg class="lqCloudbreakBattleBackgroundSvg" viewBox="0 0 420 220" preserveAspectRatio="xMidYMid slice" role="img" aria-label="北尾根・雲上の鞍部 戦闘背景"><rect width="420" height="220" fill="#d6e2e1"/><path d="M0 115L54 73L92 96L132 61L173 99L216 66L255 102L302 58L344 92L390 65L420 83V157H0Z" fill="#808b84"/><path d="M0 146L45 118L92 131L137 105L181 131L229 104L274 132L319 105L365 128L420 109V180H0Z" fill="#5f6b64"/><g fill="#f3fbfb" opacity=".68"><path d="M-20 43Q47 13 107 42T219 38T331 41T448 28V78H-20Z"/><path d="M-25 78Q41 52 104 73T222 69T336 74T449 59V104H-25Z" opacity=".4"/></g><path d="M0 181Q60 158 120 174T236 162T342 176T420 163V220H0Z" fill="#424d47"/><path d="M-20 200Q58 177 126 189T242 175T351 188T442 174" fill="none" stroke="#d9cda8" stroke-width="10" opacity=".9"/><g fill="#303a35"><path d="M24 220L69 159L106 220M302 220L346 152L397 220"/></g><g fill="none" stroke="#f8ffff" stroke-width="3" stroke-linecap="round" opacity=".55"><path d="M-15 35Q75 20 164 34T324 31T444 35"/><path d="M0 64Q83 50 173 63T333 58T448 61"/></g></svg>`;}
function apply(){
 if(s.screen!=='battle'||s.map!==MAP_ID)return false;
 const shell=app.querySelector('.gameShell');if(!shell)return false;
 let layer=shell.querySelector('.lqCloudbreakBattleBackdrop');
 if(!layer){layer=document.createElement('div');layer.className='lqCloudbreakBattleBackdrop';layer.dataset.map=MAP_ID;layer.dataset.lqFormalStage='original-vector-cloudbreak-saddle-battle-background';layer.innerHTML=art();shell.prepend(layer);}
 return true;
}
const battleBase=battle;battle=function(){const r=battleBase();apply();return r;};
const renderBase=render;render=function(){const r=renderBase();apply();return r;};
window.LQ_CLOUDBREAK_BATTLE_BACKGROUND_STATUS={map:MAP_ID,displayName:'北尾根・雲上の鞍部',originalVector:true,presentationOnly:true,pointerSafe:true,protectedCanonChanged:false,saveSchemaChanged:false,apply};
apply();
})();
