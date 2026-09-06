(() => {
'use strict';

/* REQ-106: original-vector Wind Shelf battle presentation. */
const MAP_ID='windShelf';
const style=document.createElement('style');
style.textContent=`
.lqWindShelfBattleBackdrop{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none;border-radius:inherit;background:linear-gradient(#b9cbd0 0 40%,#68726d 41% 100%)}
.lqWindShelfBattleBackdrop svg{width:100%;height:100%;display:block;object-fit:cover}.lqWindShelfBattleBackdrop::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,#fff0 30%,#101b1b14 57%,#08100f73 100%);pointer-events:none}
.gameShell>.lqBattleFocus,.gameShell>.lqBattleForeground,.enemySpriteStage,.battleHud,.battleCommands{position:relative;z-index:3}
`;
document.head.appendChild(style);
function art(){return `<svg class="lqWindShelfBattleBackgroundSvg" viewBox="0 0 420 220" preserveAspectRatio="xMidYMid slice" role="img" aria-label="北尾根・風蝕の岩棚 戦闘背景"><rect width="420" height="220" fill="#b8c8ca"/><path d="M0 93L53 42L91 69L133 18L172 63L219 24L257 70L307 14L348 56L393 24L420 45V132H0Z" fill="#7d8988"/><path d="M0 124L42 91L83 111L129 66L174 104L222 72L267 108L316 64L359 100L420 70V155H0Z" fill="#5d6865"/><path d="M0 162Q55 143 109 158T218 149T322 160T420 150V220H0Z" fill="#454d49"/><path d="M-18 187Q58 151 120 171T235 153T338 168T442 145" fill="none" stroke="#d8c89d" stroke-width="10" opacity=".86"/><g fill="#303835"><path d="M28 220L77 132L115 220M286 220L334 116L390 220"/></g><g fill="#6b756f"><path d="M145 220L171 151L197 220M219 220L246 142L271 220"/></g><g fill="none" stroke="#f4ffff" stroke-width="3" stroke-linecap="round" opacity=".66"><path d="M-20 36Q64 22 149 38T306 33T438 39"/><path d="M10 67Q99 48 185 65T337 58T449 64"/><path d="M-18 101Q57 82 139 96T289 87T442 94"/></g><g fill="none" stroke="#d8c792" stroke-width="4" opacity=".7"><path d="M138 182q16-11 32-1M179 171q15-10 29-1M220 164q15-9 29-1"/></g></svg>`;}
function apply(){
 if(s.screen!=='battle'||s.map!==MAP_ID)return false;
 const shell=app.querySelector('.gameShell');if(!shell)return false;
 let layer=shell.querySelector('.lqWindShelfBattleBackdrop');
 if(!layer){layer=document.createElement('div');layer.className='lqWindShelfBattleBackdrop';layer.dataset.map=MAP_ID;layer.dataset.lqFormalStage='original-vector-wind-shelf-battle-background';layer.innerHTML=art();shell.prepend(layer);}
 return true;
}
const battleBase=battle;battle=function(){const r=battleBase();apply();return r;};
const renderBase=render;render=function(){const r=renderBase();apply();return r;};
window.LQ_WIND_SHELF_BATTLE_BACKGROUND_STATUS={map:MAP_ID,displayName:'北尾根・風蝕の岩棚',originalVector:true,presentationOnly:true,pointerSafe:true,protectedCanonChanged:false,saveSchemaChanged:false,apply};
apply();
})();
