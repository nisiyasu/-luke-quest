(() => {
'use strict';

/* LUKE QUEST v0.92 residence polish.
   Adds domestic furniture layers and folds the new residence into door-audio feedback. */

const style=document.createElement('style');
style.textContent=`
.lqResidenceWindow{position:absolute;z-index:2;width:55px;height:42px;border:5px solid #74543a;border-radius:4px;background:linear-gradient(135deg,#84b9ce,#b7d6d7 48%,#6e9fb6 49%);box-shadow:inset 0 0 0 2px #d4bb80,0 5px 8px #0005;pointer-events:none}.lqResidenceWindow:before{content:"";position:absolute;left:50%;top:0;bottom:0;width:3px;background:#71513a}.lqResidenceWindow:after{content:"";position:absolute;left:0;right:0;top:50%;height:3px;background:#71513a}.lqResidenceShelf{position:absolute;z-index:3;width:95px;height:48px;border:3px solid #89613c;border-radius:5px;background:repeating-linear-gradient(90deg,#4f3828 0 13px,#9f6c42 14px 16px,#5d412c 17px 29px);box-shadow:inset 0 8px #3d2b20,0 5px 8px #0006;pointer-events:none}.lqResidenceBasket{position:absolute;z-index:3;width:42px;height:25px;border-radius:4px 4px 13px 13px;background:repeating-linear-gradient(90deg,#ad814b 0 5px,#7e5a34 5px 7px);border:2px solid #674727;box-shadow:0 4px 5px #0005;pointer-events:none}.lqResidenceBasket:after{content:"";position:absolute;left:7px;right:7px;top:-12px;height:16px;border:3px solid #9a7042;border-bottom:0;border-radius:14px 14px 0 0}
`;
document.head.appendChild(style);
function div(cls,x,y){const e=document.createElement('div');e.className=cls;e.style.left=`${x}px`;e.style.top=`${y}px`;return e;}
function decorateResidence92(){if(s.screen!=='world'||s.map!=='residenceInterior')return;const w=app.querySelector('.world');if(!w||w.querySelector('.lqResidenceWindow'))return;w.appendChild(div('lqResidenceWindow',2.0*TS,1.1*TS));w.appendChild(div('lqResidenceShelf',7.2*TS,1.2*TS));w.appendChild(div('lqResidenceBasket',2.2*TS,5.9*TS));}
const actionV91=action;
action=function(){const before=s.map;const r=actionV91();if(before!==s.map&&(before==='residenceInterior'||s.map==='residenceInterior'))window.LQ_sfx?.('door');return r;};
const checkGateV91=checkGate;
checkGate=function(){const before=s.map;const r=checkGateV91();if(before!==s.map&&(before==='residenceInterior'||s.map==='residenceInterior'))window.LQ_sfx?.('door');return r;};
const worldV91=world;world=function(){worldV91();decorateResidence92();};const renderV91=render;render=function(){const r=renderV91();decorateResidence92();return r;};
window.LQ_RESIDENCE_VISUAL_STATUS={window:true,shelf:true,basket:true,doorAudio:true};
if(s.screen==='world')decorateResidence92();
})();
