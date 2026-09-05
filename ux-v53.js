(() => {
'use strict';

/* LUKE QUEST v0.53 illustrated regional battle scenery.
   Adds original multi-layer CSS silhouettes per region so battle backgrounds read as places, not flat gradients. */

const style=document.createElement('style');
style.textContent=`
.lqScenery{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}.lqScenery i{position:absolute;display:block}
.fieldBattle .lqScenery .far{left:-8%;right:-8%;bottom:36%;height:34%;background:linear-gradient(150deg,transparent 0 11%,#46644a 12% 24%,transparent 25% 31%,#587453 32% 45%,transparent 46% 55%,#3e5d46 56% 68%,transparent 69%);opacity:.76}.fieldBattle .lqScenery .near{left:0;right:0;bottom:17%;height:20%;background:repeating-linear-gradient(100deg,transparent 0 34px,#48633caa 35px 39px,transparent 40px 71px);clip-path:polygon(0 55%,10% 38%,19% 62%,31% 31%,44% 57%,58% 34%,70% 60%,83% 29%,100% 49%,100% 100%,0 100%)}
.forestBattle .lqScenery .far{inset:0;background:linear-gradient(90deg,#112d21cc 0 9%,transparent 10% 18%,#173927bb 19% 27%,transparent 28% 70%,#112d21cc 71% 81%,transparent 82% 90%,#173927bb 91%);}.forestBattle .lqScenery .far:before,.forestBattle .lqScenery .far:after{content:"";position:absolute;top:0;width:90px;height:78%;background:#10291dc9;clip-path:polygon(18% 0,58% 0,55% 30%,88% 42%,59% 45%,54% 100%,24% 100%,25% 47%,0 41%,27% 31%)}.forestBattle .lqScenery .far:before{left:2%}.forestBattle .lqScenery .far:after{right:1%;transform:scaleX(-1)}.forestBattle .lqScenery .near{left:4%;right:4%;bottom:10%;height:16%;background:radial-gradient(ellipse at 12% 100%,#203a25 0 24%,transparent 25%),radial-gradient(ellipse at 36% 100%,#19351f 0 28%,transparent 29%),radial-gradient(ellipse at 68% 100%,#213b26 0 25%,transparent 26%),radial-gradient(ellipse at 91% 100%,#17321e 0 27%,transparent 28%)}
.mistBattle .lqScenery .far{left:7%;right:7%;top:18%;height:54%;background:linear-gradient(90deg,transparent 0 12%,#25363888 13% 15%,transparent 16% 34%,#273b3c88 35% 38%,transparent 39% 72%,#22343688 73% 76%,transparent 77%);filter:blur(.3px)}.mistBattle .lqScenery .near{left:-10%;right:-10%;bottom:20%;height:27%;background:radial-gradient(ellipse at 20% 50%,#d4e4e51c 0 24%,transparent 25%),radial-gradient(ellipse at 51% 64%,#d4e4e522 0 31%,transparent 32%),radial-gradient(ellipse at 82% 44%,#d4e4e51e 0 29%,transparent 30%);animation:lqMistDrift 6s ease-in-out infinite alternate}@keyframes lqMistDrift{to{transform:translateX(4%)}}
.militaryBattle .lqScenery .far{left:3%;right:3%;top:18%;height:55%;background:linear-gradient(90deg,transparent 0 10%,#1a2027 11% 13%,transparent 14% 28%,#20262d 29% 31%,transparent 32% 70%,#1a2027 71% 73%,transparent 74% 88%,#20262d 89% 91%,transparent 92%)}.militaryBattle .lqScenery .far:after{content:"";position:absolute;right:10%;top:2%;width:56px;height:82px;background:linear-gradient(#252b32,#15191e);clip-path:polygon(18% 22%,36% 22%,36% 0,64% 0,64% 22%,82% 22%,82% 100%,18% 100%);box-shadow:-170px 13px 0 #1c2228}.militaryBattle .lqScenery .near{left:0;right:0;bottom:15%;height:13%;background:repeating-linear-gradient(150deg,#2a2220 0 8px,#49352c 9px 14px,transparent 15px 35px);opacity:.68}
.cliffBattle .lqScenery .far{left:-2%;right:-2%;bottom:34%;height:48%;background:linear-gradient(145deg,transparent 0 12%,#514e49aa 13% 28%,transparent 29% 40%,#656058a8 41% 55%,transparent 56% 68%,#464541aa 69% 81%,transparent 82%);}.cliffBattle .lqScenery .near{left:-2%;right:-2%;bottom:10%;height:31%;background:linear-gradient(165deg,#393834 0 28%,transparent 29%),linear-gradient(195deg,transparent 0 60%,#343431 61%);clip-path:polygon(0 37%,15% 22%,28% 48%,42% 25%,55% 53%,68% 29%,84% 43%,100% 19%,100% 100%,0 100%)}
.lqScenery .spark{width:3px;height:3px;border-radius:50%;background:#fff4bd99;left:22%;top:28%;box-shadow:120px 31px #fff4bd66,240px -4px #fff4bd55;animation:lqScenerySpark 2.8s ease-in-out infinite alternate}@keyframes lqScenerySpark{to{opacity:.25;transform:translateY(-5px)}}
`;
document.head.appendChild(style);

function addScenery(){
 if(s.screen!=='battle')return;
 const scene=app.querySelector('.battleScene');if(!scene||scene.querySelector('.lqScenery'))return;
 const layer=document.createElement('div');layer.className='lqScenery';layer.innerHTML='<i class=far></i><i class=near></i><i class=spark></i>';
 const horizon=scene.querySelector('.battleHorizon');if(horizon)horizon.after(layer);else scene.prepend(layer);
}

const battleV52=battle;battle=function(){const r=battleV52();addScenery();return r;};
const renderV52=render;render=function(){const r=renderV52();if(s.screen==='battle')addScenery();return r;};
window.LQ_BATTLE_SCENERY_STATUS={regionalIllustratedCss:true,mechanicsChanged:false};
if(s.screen==='battle')addScenery();
})();
