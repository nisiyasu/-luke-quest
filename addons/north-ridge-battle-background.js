(() => {
'use strict';

/* REQ-105: North Ridge battle presentation. Presentation-only, collision/save/canon neutral. */
const MAP_ID='northRidgeApproach';
const style=document.createElement('style');
style.textContent=`
.lqNorthRidgeBattleBackdrop{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none;border-radius:inherit;background:linear-gradient(#aebdc2 0 43%,#596766 44% 100%)}
.lqNorthRidgeBattleBackdrop svg{width:100%;height:100%;display:block;object-fit:cover}
.lqNorthRidgeBattleBackdrop::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,#fff0 34%,#14202216 58%,#0810116f 100%);pointer-events:none}
.gameShell>.lqBattleFocus,.gameShell>.lqBattleForeground,.enemySpriteStage,.battleHud,.battleCommands{position:relative;z-index:3}
`;
document.head.appendChild(style);

function art(){return `<svg class="lqNorthRidgeBattleBackgroundSvg" viewBox="0 0 420 220" preserveAspectRatio="xMidYMid slice" role="img" aria-label="北尾根・岩棚道 戦闘背景"><rect width="420" height="220" fill="#afbec3"/><path d="M0 94L51 45L93 72L141 9L188 66L231 25L276 62L324 16L370 57L420 20V126H0Z" fill="#7c8d91"/><path d="M0 121L48 84L97 105L143 60L189 101L233 68L280 104L329 62L373 98L420 69V149H0Z" fill="#626f72"/><path d="M0 153Q57 140 117 151T229 145T341 153T420 148V220H0Z" fill="#454d4c"/><path d="M-12 184Q58 151 119 171T231 150T337 166T438 145" fill="none" stroke="#d8ca9f" stroke-width="11" opacity=".82"/><path d="M25 220L75 137L112 220M294 220L335 123L384 220" fill="#303737"/><g fill="#677477"><path d="M2 158l31-50 35 50zM348 154l29-51 37 51z"/></g><g fill="none" stroke="#f0f7f7" stroke-width="3" stroke-linecap="round" opacity=".55"><path d="M-18 40Q61 28 144 42T307 38T438 43"/><path d="M17 72Q101 55 179 69T327 65T445 69"/><path d="M-24 101Q52 84 130 97T286 91T440 97"/></g><g fill="none" stroke="#d7c79a" stroke-width="4" opacity=".66"><path d="M144 178q18-14 36-2M186 166q17-13 34-1M226 158q14-10 29-1"/></g></svg>`;}

function apply(){
 if(s.screen!=='battle'||s.map!==MAP_ID)return false;
 const shell=app.querySelector('.gameShell');
 if(!shell)return false;
 let layer=shell.querySelector('.lqNorthRidgeBattleBackdrop');
 if(!layer){
  layer=document.createElement('div');
  layer.className='lqNorthRidgeBattleBackdrop';
  layer.dataset.map=MAP_ID;
  layer.dataset.lqFormalStage='original-vector-north-ridge-battle-background';
  layer.innerHTML=art();
  shell.prepend(layer);
 }
 return true;
}

const battleBase=battle;
battle=function(){const r=battleBase();apply();return r;};
const renderBase=render;
render=function(){const r=renderBase();apply();return r;};

window.LQ_NORTH_RIDGE_BATTLE_BACKGROUND_STATUS={
 map:MAP_ID,
 displayName:'北尾根・岩棚道',
 originalVector:true,
 presentationOnly:true,
 pointerSafe:true,
 protectedCanonChanged:false,
 saveSchemaChanged:false,
 apply
};
apply();
})();
