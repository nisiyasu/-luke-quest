(() => {
'use strict';

/* LUKE QUEST v0.48 battle command visual language.
   Replaces emoji-led command labels with original lightweight console-style glyphs and hierarchy. */

const style=document.createElement('style');
style.textContent=`
.commandGrid .commandBtn{display:grid;grid-template-columns:28px 1fr;align-items:center;text-align:left;gap:8px;min-height:54px;padding:8px 10px}.lqCmdGlyph{position:relative;width:26px;height:26px;border-radius:7px;background:#09172788;border:1px solid #ffffff20;display:block}.lqCmdCopy{display:flex;flex-direction:column;line-height:1.05}.lqCmdCopy b{font-size:13px}.lqCmdCopy small{font-size:7px;letter-spacing:.13em;color:#9fb4c8;margin-top:4px}.lqSword:before{content:"";position:absolute;left:12px;top:3px;width:3px;height:19px;background:linear-gradient(#f1efe4,#8ca0b3);transform:rotate(40deg);border-radius:2px}.lqSword:after{content:"";position:absolute;left:5px;top:15px;width:17px;height:3px;background:#d0ad56;transform:rotate(40deg);border-radius:2px}.lqShield:before{content:"";position:absolute;left:6px;top:4px;width:14px;height:17px;background:linear-gradient(#7294b2,#344f68);border:2px solid #a9c3d8;clip-path:polygon(50% 0,100% 17%,90% 72%,50% 100%,10% 72%,0 17%)}.lqHerb:before{content:"";position:absolute;left:11px;top:5px;width:4px;height:17px;background:#5f8a52;transform:rotate(28deg);border-radius:4px}.lqHerb:after{content:"";position:absolute;left:5px;top:4px;width:15px;height:12px;background:#72ad62;clip-path:polygon(50% 45%,0 0,16% 68%,50% 100%,84% 68%,100% 0);transform:rotate(-8deg)}.lqBoot:before{content:"";position:absolute;left:8px;top:4px;width:10px;height:15px;background:#8e7964;border:2px solid #c4aa88;border-radius:3px 3px 2px 5px}.lqBoot:after{content:"";position:absolute;left:7px;top:16px;width:16px;height:7px;background:#6e5b4c;border:2px solid #b89d7e;border-radius:2px 6px 4px 4px;transform:rotate(-7deg)}
.battleAreaChip{letter-spacing:.08em}.battleAreaChip.lqBattleMode{color:#f1d37a;border-color:#d6b85a66}.battleAreaChip.lqBattlePlace{color:#c5d6e5}
@media(max-width:390px){.commandGrid .commandBtn{grid-template-columns:24px 1fr;gap:6px;padding:7px 8px}.lqCmdGlyph{width:23px;height:23px}.lqCmdCopy b{font-size:12px}}
`;
document.head.appendChild(style);

function decorateBattleCommands(){
 if(s.screen!=='battle')return;
 const buttons=Array.from(app.querySelectorAll('.commandGrid .commandBtn'));if(buttons.length>=4&&buttons[0].dataset.lqConsole!=='1'){
   const specs=[['lqSword','こうげき','ATTACK'],['lqShield','ぼうぎょ','GUARD'],['lqHerb','やくそう','ITEM'],['lqBoot','にげる','ESCAPE']];
   buttons.slice(0,4).forEach((b,i)=>{const [icon,jp,en]=specs[i];b.dataset.lqConsole='1';b.innerHTML=`<i class="lqCmdGlyph ${icon}"></i><span class=lqCmdCopy><b>${jp}</b><small>${en}</small></span>`;});
 }
 const chips=app.querySelectorAll('.battleAreaChip');
 if(chips[0]){chips[0].textContent='BATTLE';chips[0].classList.add('lqBattleMode');}
 if(chips[1]){chips[1].textContent=(MAPS[s.map]?.name||'戦場');chips[1].classList.add('lqBattlePlace');}
}

const battleV47=battle;battle=function(){const r=battleV47();decorateBattleCommands();return r;};
const renderV47=render;render=function(){const r=renderV47();if(s.screen==='battle')decorateBattleCommands();return r;};
window.LQ_BATTLE_COMMAND_VISUAL_STATUS={emojiLabelsRemoved:true,consoleGlyphs:true};
if(s.screen==='battle')decorateBattleCommands();
})();
