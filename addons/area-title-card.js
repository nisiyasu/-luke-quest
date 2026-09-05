(() => {
'use strict';

/* Collision-safe add-on: cinematic location title cards for clearer PS1-era map presentation. */
const SUB={
 town:'王国南部の城郭都市',field:'王都と魔物の森を結ぶ街道',forest:'レオンを追う最初の森',deepForest:'森の気配が濃くなる深部',mistTrail:'足跡が霧へ消える追跡路',observation:'魔王軍が何かを監視している区域',evacuation:'北へ延びる古い退避路',evacRoute:'北へ延びる古い退避路',cliff:'風の強い北方崖道',cliffRoad:'風の強い北方崖道',
 innInterior:'南門に近い旅人の宿',innGuestRoom:'静かな二階の客室',shopInterior:'旅支度を整える小さな店',shopStockRoom:'薬草と旅用品の在庫倉庫',templeInterior:'勇者選定の祭壇がある礼拝堂',templeRecordRoom:'王都と旅人の一般閲覧記録室',residenceInterior:'王都で暮らす人々の住まい',
 wayfarerShrine:'街道を行く旅人が祈りを置く小祠',forestClearing:'木々の間に光が落ちる静かな空地',trainingYard:'王都守備兵が基本を磨く訓練場',
 innInside:'南門に近い旅人の宿',shopInside:'旅支度を整える小さな店',templeInside:'勇者選定の祭壇がある礼拝堂',residenceInside:'王都で暮らす人々の住まい'
};
const style=document.createElement('style');style.textContent=`
.lqAreaTitle{position:absolute;z-index:46;left:50%;top:21%;transform:translate(-50%,-8px);width:min(84%,440px);padding:12px 18px 11px;text-align:center;pointer-events:none;opacity:0;background:linear-gradient(90deg,transparent,#07111fe8 12%,#07111ff4 50%,#07111fe8 88%,transparent);border-top:1px solid #f4d77b66;border-bottom:1px solid #f4d77b55;filter:drop-shadow(0 7px 14px #000b);transition:opacity .28s ease,transform .28s ease}.lqAreaTitle.show{opacity:1;transform:translate(-50%,0)}.lqAreaTitle strong{display:block;color:#fff4cc;font-size:19px;font-weight:950;letter-spacing:.08em;text-shadow:0 2px 8px #000}.lqAreaTitle small{display:block;margin-top:4px;color:#c9d7e7;font-size:10px;font-weight:800;letter-spacing:.05em}.lqAreaTitle::before,.lqAreaTitle::after{content:'';position:absolute;top:50%;width:28px;height:1px;background:#f4d77b99}.lqAreaTitle::before{left:8px}.lqAreaTitle::after{right:8px}@media (prefers-reduced-motion:reduce){.lqAreaTitle{transition:none}}
`;document.head.appendChild(style);
let lastMap=null,timer=0;
function areaName(){return MAPS[s.map]?.name||s.map||'';}
function showTitle(){
 if(s.screen!=='world'||!s.map||s.map===lastMap)return;
 lastMap=s.map;const shell=app.querySelector('.gameShell');if(!shell)return;
 let el=shell.querySelector('.lqAreaTitle');if(!el){el=document.createElement('div');el.className='lqAreaTitle';shell.appendChild(el);}
 el.innerHTML=`<strong>${areaName()}</strong><small>${SUB[s.map]||'LUKE QUEST'}</small>`;
 clearTimeout(timer);requestAnimationFrame(()=>el.classList.add('show'));timer=setTimeout(()=>el.classList.remove('show'),1700);
}
const renderBase=render;render=function(){const r=renderBase();showTitle();return r;};
window.LQ_AREA_TITLE_STATUS={cinematic:true,mapAware:true,interiorSubtitles:true,reducedMotion:true};
showTitle();
})();
