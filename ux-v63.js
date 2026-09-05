(() => {
'use strict';

/* LUKE QUEST v0.63 iPhone control-deck polish.
   Makes field controls read like a compact JRPG controller while preserving existing touch handlers. */

const style=document.createElement('style');
style.textContent=`
.controls{position:relative;align-items:center;padding:7px 5px 3px;border-radius:17px;background:linear-gradient(180deg,#0c1928,#07111e);border:1px solid #ffffff10;box-shadow:inset 0 1px #ffffff0d,0 7px 18px #0006}.dpad{gap:2px;filter:drop-shadow(0 5px 6px #0007)}.dpad button{border-radius:10px!important;background:linear-gradient(145deg,#30485e,#172b3f)!important;border:1px solid #6e879733!important;color:#dbe7ee;text-shadow:0 1px 2px #000;box-shadow:inset 0 1px #ffffff14,0 3px 0 #0d1b29!important}.dpad button:active{box-shadow:inset 0 3px 8px #0007!important;transform:translateY(2px)!important;filter:brightness(1.18)}
.actionPad{gap:12px}.actionPad .a{position:relative;border-radius:50%!important;width:72px!important;height:72px!important;background:radial-gradient(circle at 36% 30%,#9d77bf,#654487 62%,#3f2d5a)!important;border:2px solid #c6a7dd88!important;box-shadow:inset 0 2px #ffffff22,0 5px 0 #2c1e3e,0 8px 16px #0007!important;font-size:25px!important}.actionPad .a:after{content:"ACTION";position:absolute;left:50%;bottom:10px;transform:translateX(-50%);font-size:6px;letter-spacing:.12em;color:#e9d9f3aa}.lqMenuButton{width:68px!important;height:52px!important;border-radius:12px!important;background:linear-gradient(145deg,#33475b,#1d2d3d)!important;border:1px solid #8ea0ad44!important;box-shadow:inset 0 1px #ffffff18,0 4px 0 #101c28,0 7px 13px #0006!important;font-size:10px!important;letter-spacing:.09em;color:#d8e3ea!important}.lqMenuButton:active,.actionPad .a:active{transform:translateY(2px)!important;box-shadow:inset 0 3px 7px #0008,0 2px 0 #101722!important}.lqControlLegend{position:absolute;left:50%;bottom:2px;transform:translateX(-50%);font-size:6px;color:#536b7e;letter-spacing:.14em;pointer-events:none}
@media(max-height:700px){.actionPad .a{width:60px!important;height:60px!important}.lqMenuButton{width:60px!important;height:46px!important}.controls{padding-top:4px}}
`;
document.head.appendChild(style);

function polishControls(){
 if(s.screen!=='world')return;
 const controls=app.querySelector('.controls');if(!controls||controls.dataset.lqPolished==='1')return;
 controls.dataset.lqPolished='1';
 const menu=app.querySelector('.actionPad button:not(.a)');if(menu){menu.classList.add('lqMenuButton');menu.textContent='MENU';menu.setAttribute('aria-label','冒険メニュー');}
 const a=app.querySelector('.actionPad .a');if(a)a.setAttribute('aria-label','話す・調べる');
 const legend=document.createElement('div');legend.className='lqControlLegend';legend.textContent='MOVE　・　ACTION';controls.appendChild(legend);
}

const worldV62=world;world=function(){worldV62();polishControls();};
const renderV62=render;render=function(){const r=renderV62();if(s.screen==='world')polishControls();return r;};
window.LQ_TOUCH_CONTROL_STATUS={controllerDeck:true,handlersChanged:false,minActionTarget:60};
if(s.screen==='world')polishControls();
})();
