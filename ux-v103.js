(() => {
'use strict';

/* LUKE QUEST v0.103 bounty state presentation. */

let bountyToast=false;
const style=document.createElement('style');
style.textContent=`
.npc.lqBountyBoard.lqBountyReady:after{content:"?";position:absolute;left:50%;top:-16px;transform:translateX(-50%);width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#68b678;color:#07170d;border:2px solid #c1efc7;box-shadow:0 3px 8px #0009;font-size:11px;font-weight:1000;animation:lqBountyReady .7s ease-in-out infinite alternate}@keyframes lqBountyReady{to{translate:0 -2px}}.npc.lqBountyBoard.lqBountyDone:after{content:"✓";position:absolute;left:50%;top:-16px;transform:translateX(-50%);width:18px;height:18px;border-radius:50%;display:grid;place-items:center;background:#596b78;color:#e2eaf0;border:2px solid #94a5b1;font-size:10px;font-weight:1000}.lqBountyCompleteToast{position:absolute;z-index:60;left:50%;top:27%;transform:translate(-50%,-50%);width:min(330px,86%);padding:13px;border-radius:13px;background:linear-gradient(180deg,#3a291cf5,#1c1611f5);border:2px solid #daae58;box-shadow:0 12px 34px #000c;text-align:center;pointer-events:none;animation:lqBountyToast 2s ease both}.lqBountyCompleteToast small{display:block;color:#a89270;font-size:8px;letter-spacing:.2em}.lqBountyCompleteToast b{display:block;color:#ffe39a;font-family:Georgia,serif;font-size:18px;margin:3px}.lqBountyCompleteToast span{color:#d4c4a5;font-size:9px}@keyframes lqBountyToast{0%{opacity:0;transform:translate(-50%,-40%) scale(.94)}12%,82%{opacity:1;transform:translate(-50%,-50%)}100%{opacity:0;transform:translate(-50%,-57%)}}
`;
document.head.appendChild(style);
function markBoard(){if(s.screen!=='world'||s.map!=='town')return;const board=MAPS.town.npcs.find(n=>n.kind==='lqBountyBoard');if(!board)return;const left=board.x*TS+5,top=board.y*TS+3;for(const el of app.querySelectorAll('.world .lqBountyBoard')){if(Math.abs(parseFloat(el.style.left)-left)>1||Math.abs(parseFloat(el.style.top)-top)>1)continue;if(s.flags?.forestBountyComplete)el.classList.add('lqBountyDone');else if(s.flags?.forestBountyAccepted&&s.forestBountyKills>=3)el.classList.add('lqBountyReady');break;}}
function showBountyToast(){if(!bountyToast||s.screen!=='world')return;const shell=app.querySelector('.gameShell');if(!shell)return;bountyToast=false;const e=document.createElement('div');e.className='lqBountyCompleteToast';e.innerHTML='<small>BOUNTY COMPLETE</small><b>魔物の森・安全確認</b><span>報酬 50G</span>';shell.appendChild(e);window.LQ_sfx?.('chest');setTimeout(()=>e.remove(),2050);}
const actionV102=action;action=function(){const before=!!s.flags?.forestBountyComplete;const r=actionV102();if(!before&&s.flags?.forestBountyComplete){bountyToast=true;requestAnimationFrame(showBountyToast);}return r;};
const worldV102=world;world=function(){worldV102();markBoard();showBountyToast();};const renderV102=render;render=function(){const r=renderV102();markBoard();showBountyToast();return r;};
window.LQ_BOUNTY_PRESENTATION_STATUS={readyMarker:true,completeMarker:true,completeToast:true};
if(s.screen==='world'){markBoard();showBountyToast();}
})();
