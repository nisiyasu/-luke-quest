(() => {
'use strict';

/* LUKE QUEST v0.129 active bounty field tracker.
   Keeps the optional forest objective visible while exploring without opening the pause menu. */
const style=document.createElement('style');style.textContent=`
.lqBountyHud{position:absolute;z-index:19;right:9px;bottom:48px;min-width:118px;padding:6px 8px;border-radius:10px;background:#0b151dc9;border:1px solid #d2aa5850;box-shadow:0 5px 13px #0008;pointer-events:none;backdrop-filter:blur(2px)}.lqBountyHud small{display:block;color:#9d8968;font-size:7px;letter-spacing:.14em}.lqBountyHud b{display:block;color:#e9d29b;font-size:9px;margin-top:2px}.lqBountyHudTrack{height:4px;margin-top:5px;background:#1c2931;border-radius:99px;overflow:hidden}.lqBountyHudTrack i{display:block;height:100%;background:linear-gradient(90deg,#a7664f,#deb059)}.lqBountyHud.ready{border-color:#74bb7a66}.lqBountyHud.ready b{color:#bce5b7}.lqBountyHud.ready .lqBountyHudTrack i{background:#76bb7b}@media(max-height:700px){.lqBountyHud{bottom:39px;padding:5px 7px}}
`;document.head.appendChild(style);
function addBountyHud(){
 if(s.screen!=='world'||s.dialog||s.pauseOpen||s.shopOpen||s.victoryResult||!s.flags?.forestBountyAccepted||s.flags?.forestBountyComplete)return;const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqBountyHud'))return;const kills=Math.max(0,Math.min(3,Number(s.forestBountyKills)||0)),ready=kills>=3,e=document.createElement('div');e.className=`lqBountyHud${ready?' ready':''}`;e.innerHTML=`<small>BOUNTY</small><b>${ready?'報告可能・王都へ戻る':`森の魔物 ${kills}/3`}</b><div class=lqBountyHudTrack><i style="width:${kills/3*100}%"></i></div>`;shell.appendChild(e);
}
const renderV128=render;render=function(){const r=renderV128();addBountyHud();return r;};queueMicrotask(addBountyHud);window.LQ_BOUNTY_HUD_STATUS={fieldTracker:true,reportReadyState:true};
})();