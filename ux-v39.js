(() => {
'use strict';

/* LUKE QUEST v0.39 demon-army route visual identity.
   Gives observation/evacuation maps a distinct occupied-zone look without changing story/collision. */

const style=document.createElement('style');
style.textContent=`
.lqArmyBanner{position:absolute;z-index:4;width:28px;height:62px;background:linear-gradient(90deg,#421d2d,#73263a 52%,#321422);border:2px solid #a48b63;clip-path:polygon(0 0,100% 0,100% 84%,50% 100%,0 84%);filter:drop-shadow(0 5px 4px #0008);pointer-events:none}.lqArmyBanner:before{content:"";position:absolute;left:9px;top:14px;width:8px;height:20px;border:2px solid #c6a66f;transform:rotate(45deg)}
.lqBarricade{position:absolute;z-index:4;width:96px;height:20px;background:repeating-linear-gradient(135deg,#66513b 0 13px,#342a21 13px 26px);border:3px solid #8f7555;transform:rotate(-5deg);box-shadow:0 5px 8px #0008;pointer-events:none}.lqBarricade:before,.lqBarricade:after{content:"";position:absolute;width:9px;height:40px;top:-10px;background:#463729}.lqBarricade:before{left:10px;transform:rotate(25deg)}.lqBarricade:after{right:10px;transform:rotate(-25deg)}
.lqArmyTorch{position:absolute;z-index:5;width:8px;height:46px;background:#3e3024;border-radius:4px;pointer-events:none}.lqArmyTorch:before{content:"";position:absolute;left:-9px;top:-17px;width:26px;height:27px;border-radius:50% 50% 45% 45%;background:radial-gradient(circle at 50% 65%,#fff09b 0 15%,#f29b38 18% 40%,#a83c29 45% 62%,transparent 65%);filter:drop-shadow(0 0 9px #ff963caa);animation:lqTorch .7s ease-in-out infinite alternate}@keyframes lqTorch{to{transform:scale(.9,1.12) translateY(-2px)}}
.lqSupplyCrate{position:absolute;z-index:4;width:44px;height:40px;background:linear-gradient(45deg,#765333,#4f3826);border:3px solid #9a7650;box-shadow:inset 0 0 0 2px #2e2118,0 5px 8px #0007;pointer-events:none}.lqSupplyCrate:after{content:"";position:absolute;left:4px;right:4px;top:16px;height:5px;background:#9a7650;transform:rotate(-35deg)}
.lqArmyMarker{position:absolute;z-index:6;transform:translate(-50%,-100%);padding:4px 7px;border-radius:7px;background:#25131ce8;border:1px solid #a5796d;color:#e9c9b8;font-size:9px;font-weight:900;white-space:nowrap;pointer-events:none}
.lqEvacFootprints{position:absolute;z-index:3;width:110px;height:36px;background:radial-gradient(ellipse at 10% 60%,#251c1777 0 5px,transparent 6px),radial-gradient(ellipse at 28% 36%,#251c1777 0 5px,transparent 6px),radial-gradient(ellipse at 48% 62%,#251c1777 0 5px,transparent 6px),radial-gradient(ellipse at 68% 34%,#251c1777 0 5px,transparent 6px),radial-gradient(ellipse at 88% 60%,#251c1777 0 5px,transparent 6px);transform:rotate(-15deg);pointer-events:none}
`;
document.head.appendChild(style);

function dec(cls,x,y){const n=document.createElement('div');n.className=cls;n.style.left=`${x*TS}px`;n.style.top=`${y*TS}px`;return n;}
function decorateArmyRoute(){
 if(s.screen!=='world'||!['observation','evacRoute'].includes(s.map))return;
 const w=app.querySelector('.world');if(!w||w.querySelector('.lqArmyDecorMarker'))return;
 const m=document.createElement('i');m.className='lqArmyDecorMarker';m.hidden=true;w.appendChild(m);
 if(s.map==='observation'){
   for(const [x,y] of [[4,4],[20,4],[5,15],[19,15]])w.appendChild(dec('lqArmyBanner',x,y));
   for(const [x,y] of [[7,7],[17,7],[9,16],[15,16]])w.appendChild(dec('lqArmyTorch',x,y));
   for(const [x,y] of [[4.5,11],[18.5,12]])w.appendChild(dec('lqSupplyCrate',x,y));
   w.appendChild(dec('lqBarricade',10.5,5.5));
   const label=dec('lqArmyMarker',12,4.8);label.textContent='魔王軍・監視区域';w.appendChild(label);
 }else{
   for(const [x,y] of [[5,6],[18,7]])w.appendChild(dec('lqSupplyCrate',x,y));
   for(const [x,y] of [[8,4],[16,14]])w.appendChild(dec('lqArmyTorch',x,y));
   w.appendChild(dec('lqEvacFootprints',7,11));w.appendChild(dec('lqEvacFootprints',14,7));
   const label=dec('lqArmyMarker',12,4);label.textContent='撤収の痕跡が北へ続く';w.appendChild(label);
 }
}
const worldV38=world;world=function(){worldV38();decorateArmyRoute();};
const renderV38=render;render=function(){const r=renderV38();if(s.screen==='world')decorateArmyRoute();return r;};
window.LQ_ARMY_ROUTE_VISUALS={observationIdentity:true,evacuationClues:true};
if(s.screen==='world')render();
})();
