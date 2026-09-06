(() => {
'use strict';

/* REQ-027 — first walkable interior of Aldia castle proper.
   Extends the published courtyard without inventing protected story canon. */
const COURTYARD='aldiaCastleCourtyard';
const HALL='aldiaCastleEntranceHall';
if(!MAPS[COURTYARD])return;

MAPS[HALL]={
  name:'王都アルディア・王城玄関ホール',w:16,h:12,
  tiles:[
    '######SSSS######',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#..............#',
    '#######GG#######'
  ],
  npcs:[
    {x:4,y:4,e:'',name:'王城玄関衛兵',kind:'lqCastleHallGuard',text:'「本館は警戒態勢中です。玄関ホールまでは通れますが、奥の執務区画へはまだ進めません。」\nルーク「“勇者だから全部フリーパス”じゃないんですね。ちょっと安心しました。」'},
    {x:11,y:4,e:'',name:'城内案内板',kind:'lqCastleHallProp',text:'「南：前庭　北：大階段・執務区画」\n磨かれた真鍮板に、城内の主要区画が簡潔に刻まれている。'},
    {x:3,y:7,e:'',name:'王国の古い儀礼鎧',kind:'lqCastleHallProp',text:'実戦用というより儀礼用らしい。銀の縁取りまで曇りなく磨かれている。\nルーク「これ着て転んだら、音だけで王都中にバレそうです。」'},
    {x:12,y:7,e:'',name:'青銀の王国旗',kind:'lqCastleHallProp',text:'高い天井から青銀の旗が垂れている。前庭よりも静かで、城の中へ入った実感が強くなる。'},
    {x:7,y:1,e:'',name:'王城大階段',kind:'lqCastleDeepBoundary',text:'大階段の先には衛兵が配置されている。現在は王都の警戒対応で、許可のない者は奥の執務区画へ進めない。'}
  ]
};

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===HALL){
    if(c==='#')return'wall lqCastleHallWall';
    if(c==='G')return'gate lqCastleHallExit';
    if(c==='S')return'wall lqCastleHallStairs';
    return'floor lqCastleHallFloor';
  }
  return baseTileClass(c);
};
const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===HALL)return'';return baseTileEmoji(c);};
const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqCastleHallGuard')return'npc lqCastleHallGuard';
  if(n?.kind==='lqCastleHallProp')return'npc lqCastleHallProp';
  if(n?.kind==='lqCastleDeepBoundary')return'npc lqCastleDeepBoundary';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqCastleHallFloor{background:linear-gradient(135deg,#8d9295 0 45%,#747a7e 46% 51%,#9da2a4 52%);box-shadow:inset 0 1px #ffffff24}.tile.lqCastleHallWall{background:linear-gradient(#59636f,#394451 65%,#222b35);box-shadow:inset 0 -10px #101720aa}.tile.lqCastleHallExit{background:linear-gradient(#a98251,#704e31);box-shadow:inset 0 0 0 3px #f2d18b55}.tile.lqCastleHallStairs{background:repeating-linear-gradient(0deg,#5f6872 0 8px,#7a848e 8px 13px);box-shadow:inset 0 -8px #1a222b,0 0 16px #dcecff18}
.lqCastleHallGuard{width:40px;height:46px;font-size:0;border-radius:10px 10px 5px 5px;background:linear-gradient(#233a59 0 23%,#d7b18b 24% 43%,#697683 44% 100%);border:2px solid #d0d7df;box-shadow:0 5px 9px #0009}.lqCastleHallGuard:before{content:'';position:absolute;left:6px;top:1px;width:25px;height:14px;border-radius:50% 50% 24% 24%;background:#929ca6;border:2px solid #e1e5e8}.lqCastleHallGuard:after{content:'…';position:absolute;right:-7px;top:-11px;color:#fff0b0;font-size:15px;text-shadow:0 2px 4px #000}
.lqCastleHallProp{width:40px;height:40px;font-size:0;border:2px solid #c5b57b;border-radius:6px;background:linear-gradient(145deg,#687580,#34414e);box-shadow:0 5px 9px #0008}.lqCastleHallProp:after{content:'✦';position:absolute;right:2px;top:0;color:#ffe18a;font-size:11px;text-shadow:0 0 6px #ffd45b}
.lqCastleDeepBoundary{width:44px;height:48px;font-size:0;border:3px solid #cab878;border-radius:5px;background:linear-gradient(#374c69,#1c2d42);box-shadow:0 6px 10px #0009}.lqCastleDeepBoundary:before{content:'▲';position:absolute;left:9px;top:7px;color:#e8edf2;font-size:22px}.lqCastleDeepBoundary:after{content:'';position:absolute;left:5px;right:5px;bottom:6px;height:5px;background:#d3bd75;box-shadow:0 -9px #9f8f62,0 -18px #6e7480}
.lqCastleHallRunner{position:absolute;z-index:2;width:184px;height:430px;background:linear-gradient(90deg,#5e1017,#a3222d 50%,#5e1017);border-left:5px solid #c5a65a;border-right:5px solid #c5a65a;box-shadow:0 0 18px #0007;pointer-events:none}.lqCastleHallPillar{position:absolute;z-index:3;width:54px;height:126px;border-radius:5px 5px 2px 2px;background:linear-gradient(90deg,#444d56,#7c858d 48%,#414a54 52%);border:3px solid #aeb6bc;box-shadow:0 8px 12px #0009;pointer-events:none}.lqCastleHallBanner{position:absolute;z-index:4;width:52px;height:90px;background:linear-gradient(90deg,#123c76,#2869ac,#123c76);clip-path:polygon(0 0,100% 0,100% 82%,50% 100%,0 82%);box-shadow:0 6px 10px #0008;pointer-events:none}.lqCastleHallBanner:after{content:'✦';position:absolute;left:13px;top:24px;color:#eef4f7;font-size:25px}
`;
document.head.appendChild(style);

function aheadNpc(){
  if(s.screen!=='world'||s.map!==HALL)return null;
  const p=front();
  return MAPS[HALL].npcs.find(n=>n.x===p.x&&n.y===p.y)||null;
}

function enterHall(){
  stopMoving();
  s.map=HALL;s.x=7;s.y=9;s.dir='up';
  s.dialog={name:'王城玄関ホール',text:'大扉の向こうには、磨かれた石床と青銀の旗が続いていた。\nルーク「外から大きいと思ってましたけど、中に入るとさらに帰り道が遠く見えますね……。」'};
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'&&s.map===COURTYARD){
    const p=front();
    const n=MAPS[COURTYARD].npcs.find(x=>x.x===p.x&&x.y===p.y);
    if(n?.kind==='lqCastleMainDoor')return enterHall();
  }
  if(!s.dialog&&s.screen==='world'&&s.map===HALL){
    const n=aheadNpc();
    if(n){stopMoving();s.dialog=n;render();return;}
  }
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.map===HALL&&s.y===11&&((MAPS[HALL].tiles[s.y]||'')[s.x]==='G')){
    stopMoving();s.map=COURTYARD;s.x=7;s.y=2;s.dir='down';
    s.dialog={name:'王城前庭',text:'王城玄関ホールを出て、前庭へ戻った。'};
    return;
  }
  return baseCheckGate();
};

function decorate(){
  if(s.screen!=='world'||s.map!==HALL)return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqCastleHallRunner'))return;
  const runner=document.createElement('div');runner.className='lqCastleHallRunner';runner.style.left=`${6.1*TS}px`;runner.style.top=`${1.2*TS}px`;w.appendChild(runner);
  for(const x of [2.0,12.85]){for(const y of [2.0,7.4]){const p=document.createElement('div');p.className='lqCastleHallPillar';p.style.left=`${x*TS}px`;p.style.top=`${y*TS}px`;w.appendChild(p);}}
  for(const x of [4.3,10.7]){const b=document.createElement('div');b.className='lqCastleHallBanner';b.style.left=`${x*TS}px`;b.style.top=`${1.25*TS}px`;w.appendChild(b);}
}
const baseWorld=world;
world=function(){const r=baseWorld();decorate();return r;};
const baseRender=render;
render=function(){const r=baseRender();decorate();return r;};

window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{aldiaCastleEntranceHall:{entryMap:COURTYARD,map:HALL,exitMap:COURTYARD,type:'castle-main-interior'}});
window.LQ_CASTLE_ENTRANCE_HALL_STATUS={version:'1.0',map:HALL,from:COURTYARD,interactionCount:5,deepBoundary:true,protectedCanonChanged:false,fullCastleComplete:false,iosPhysicalVerification:'PENDING'};
})();
