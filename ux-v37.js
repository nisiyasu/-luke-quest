(() => {
'use strict';

/* LUKE QUEST v0.37 inn overnight presentation.
   Gives paid rest a short night-to-morning visual sequence before healing. */

const style=document.createElement('style');
style.textContent=`
.lqSleepOverlay{position:absolute;inset:0;z-index:60;background:#020712;display:flex;align-items:center;justify-content:center;overflow:hidden;animation:lqNightIn .35s ease both}
.lqSleepSky{position:absolute;inset:0;background:radial-gradient(circle at 72% 22%,#fff4bf 0 18px,#e7dda5 19px 24px,transparent 25px),linear-gradient(180deg,#061126,#0d2442 60%,#08111c);transition:filter .8s,background .8s}
.lqSleepStars{position:absolute;inset:0;background-image:radial-gradient(circle,#fff 0 1px,transparent 1.4px);background-size:37px 31px;opacity:.35}
.lqSleepMessage{position:relative;z-index:2;color:#f5e6b1;font-family:Georgia,serif;font-weight:900;font-size:17px;letter-spacing:.06em;text-align:center;text-shadow:0 2px 6px #000;padding:18px}
.lqSleepMessage small{display:block;color:#9fb1c6;font-family:system-ui,sans-serif;font-size:10px;letter-spacing:.08em;margin-top:8px}
.lqSleepOverlay.morning .lqSleepSky{background:radial-gradient(circle at 72% 22%,#fff6c8 0 22px,#ffd475 23px 28px,transparent 29px),linear-gradient(180deg,#78b8dc,#d8cda6 63%,#6b8d63);filter:brightness(1.1)}
.lqSleepOverlay.morning .lqSleepStars{opacity:0;transition:opacity .6s}
@keyframes lqNightIn{from{opacity:0}to{opacity:1}}
`;
document.head.appendChild(style);

let sleeping=false;
function innKeeperAheadV37(){
 if(s.screen!=='world'||s.map!=='innInterior'||s.dialog||s.pauseOpen||s.shopOpen)return false;
 const p=front();return currentNpcs().some(n=>n.x===p.x&&n.y===p.y&&n.kind==='lqInnInteriorKeeper');
}
function sleepSequence(){
 if(s.hp>=s.mh){s.dialog={name:'南門宿の主人',text:`HPはすでに満タンです（${s.hp}/${s.mh}）。\n主人「眠るだけなら歓迎ですが、回復目的なら今は元気そのものですよ。」`};return render();}
 if(s.gold<12){s.dialog={name:'南門宿の主人',text:`一泊12Gです。\n所持金：${s.gold}G\n主人「無理して払うより、まず無事に戻ってきなさい。」`};return render();}
 stopMoving();sleeping=true;s.gold-=12;save();
 const shell=app.querySelector('.gameShell');if(!shell){sleeping=false;s.hp=s.mh;return render();}
 const ov=document.createElement('div');ov.className='lqSleepOverlay';ov.innerHTML='<div class=lqSleepSky></div><div class=lqSleepStars></div><div class=lqSleepMessage>王都の夜は静かに更けていく……<small>南門宿</small></div>';shell.appendChild(ov);
 setTimeout(()=>{ov.classList.add('morning');const msg=ov.querySelector('.lqSleepMessage');if(msg)msg.innerHTML='朝になった。<small>HPが全回復した</small>';},650);
 setTimeout(()=>{const before=s.hp;s.hp=s.mh;sleeping=false;s.dialog={name:'ルーク',text:`よく眠れた。HP ${before} → ${s.hp}　残金 ${s.gold}G\nルーク「宿屋ってすごいですね。朝まで敵が一匹も出ませんでした。」`};render();},1400);
}

const actionV36=action;
action=function(){if(sleeping){stopMoving();return}if(innKeeperAheadV37())return sleepSequence();return actionV36();};
const moveV36=move;
move=function(dir){if(sleeping){stopMoving();return}return moveV36(dir);};
window.LQ_INN_PRESENTATION={overnightTransition:true,morningTransition:true,price:12};
})();
