(() => {
'use strict';

/* REQ-029 — optional limestone cave near Aldia. No protected canon or required story flags. */
const FIELD='field';
const CAVE='aldiaLimestoneCave';
const MOUTH_X=3,MOUTH_Y=14;
if(!MAPS[FIELD])return;

MAPS[CAVE]={
  name:'王都近郊・石灰洞',w:18,h:14,
  tiles:[
    '##################',
    '#....###.........#',
    '#....#...........#',
    '#................#',
    '#..###.......##..#',
    '#..#.........##..#',
    '#..#....~~~......#',
    '#.......~~~..###.#',
    '#..###..~~~..#...#',
    '#..#.........#...#',
    '#..#....###......#',
    '#.......###......#',
    '#................#',
    '########GG########'
  ],
  npcs:[
    {x:4,y:3,e:'',name:'古い測量印',kind:'lqCaveProp',text:'壁に古い測量線と数字が刻まれている。かなり前に誰かが奥行きを測ったらしい。\nルーク「洞窟まで数字で管理する人、すごく仕事ができそうです。」'},
    {x:13,y:3,e:'',name:'淡く光る鉱脈',kind:'lqCaveCrystal',text:'石灰岩の割れ目に青白い鉱物が細く光っている。触れるとひんやりしているが、危険な気配はない。'},
    {x:9,y:7,e:'',name:'静かな地底水',kind:'lqCaveWater',text:'天井から落ちた雫が小さな水溜まりを作っている。水面に洞口の光がかすかに揺れている。'},
    {x:4,y:10,e:'',name:'折れた採掘杭',kind:'lqCaveProp',text:'古い木杭が岩の隙間に残っている。最近使われた形跡はない。'},
    {x:14,y:10,e:'',name:'奥へ続く細い亀裂',kind:'lqCaveBoundary',text:'岩の亀裂はさらに奥へ続いているが、人が安全に通れる幅ではない。冷たい風だけがゆっくり流れてくる。\nルーク「細い道って、“勇者なら行ける”扱いされがちなので、入れなくて助かります。」'}
  ]
};

if(!MAPS[FIELD].npcs.some(n=>n.kind==='lqLimestoneCaveMouth')){
  MAPS[FIELD].npcs.push({x:MOUTH_X,y:MOUTH_Y,e:'',name:'石灰洞の入口',kind:'lqLimestoneCaveMouth',text:'王都近郊の岩陰に開いた小さな洞口。中から冷たい空気が流れている。'});
}

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===CAVE){
    if(c==='#')return'wall lqCaveWall';
    if(c==='G')return'gate lqCaveExit';
    if(c==='~')return'water lqCavePool';
    return'floor lqCaveFloor';
  }
  return baseTileClass(c);
};
const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===CAVE)return'';return baseTileEmoji(c);};
const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqLimestoneCaveMouth')return'npc lqLimestoneCaveMouth';
  if(n?.kind==='lqCaveProp')return'npc lqCaveProp';
  if(n?.kind==='lqCaveCrystal')return'npc lqCaveCrystal';
  if(n?.kind==='lqCaveWater')return'npc lqCaveWaterMarker';
  if(n?.kind==='lqCaveBoundary')return'npc lqCaveBoundary';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqCaveFloor{background:radial-gradient(circle at 30% 25%,#626663 0 7%,transparent 8%),linear-gradient(135deg,#4b504e,#353a39 58%,#2a2f2e);box-shadow:inset 0 1px #ffffff12}.tile.lqCaveWall{background:radial-gradient(circle at 25% 30%,#747873 0 12%,transparent 13%),linear-gradient(#4a4f4d,#303533 62%,#1b201f);box-shadow:inset 0 -10px #111615bb}.tile.lqCavePool{background:radial-gradient(ellipse at 45% 35%,#86bed044,#254f5e 45%,#152e37 80%);box-shadow:inset 0 0 14px #b4efff33}.tile.lqCaveExit{background:linear-gradient(#73634d,#493f34);box-shadow:inset 0 0 0 3px #d8c79b44}
.lqLimestoneCaveMouth{width:46px;height:42px;font-size:0;border-radius:48% 48% 18% 18%;background:radial-gradient(ellipse at 50% 72%,#070b0c 0 43%,#2a3130 44% 57%,#626a65 58% 72%,transparent 73%);filter:drop-shadow(0 5px 5px #000b)}.lqLimestoneCaveMouth:after{content:'';position:absolute;left:5px;right:5px;bottom:0;height:8px;background:#455048;border-radius:50%}
.lqCaveProp{width:38px;height:38px;font-size:0;border:2px solid #878d88;border-radius:7px;background:linear-gradient(145deg,#616762,#353a37);box-shadow:0 5px 9px #000a}.lqCaveProp:after{content:'⌁';position:absolute;left:8px;top:4px;color:#d7c69b;font-size:22px}
.lqCaveCrystal{width:42px;height:42px;font-size:0;background:linear-gradient(145deg,transparent 25%,#8be6f2 26% 42%,#4ca8c5 43% 60%,transparent 61%);filter:drop-shadow(0 0 8px #79dff0aa)}.lqCaveCrystal:after{content:'';position:absolute;left:17px;top:4px;width:10px;height:30px;background:#c8f7ff;clip-path:polygon(50% 0,100% 30%,78% 100%,22% 100%,0 30%);opacity:.75}
.lqCaveWaterMarker{width:40px;height:28px;font-size:0;border-radius:50%;background:radial-gradient(ellipse,#80d5e655 0 25%,#285a6955 55%,transparent 70%);box-shadow:0 0 12px #7be1ef55}.lqCaveBoundary{width:42px;height:44px;font-size:0;background:linear-gradient(80deg,#313735 0 37%,#0b1010 38% 62%,#434945 63%);border:2px solid #5f6661;border-radius:12px;box-shadow:0 5px 11px #000b}.lqCaveBoundary:after{content:'↟';position:absolute;left:12px;top:7px;color:#9fb7b5;font-size:20px;opacity:.55}
.lqCaveStalagmite{position:absolute;z-index:3;width:34px;height:76px;background:linear-gradient(90deg,#444946,#858b84 48%,#343936);clip-path:polygon(50% 0,100% 100%,0 100%);filter:drop-shadow(0 7px 5px #0009);pointer-events:none}.lqCaveGlow{position:absolute;z-index:2;width:130px;height:130px;border-radius:50%;background:radial-gradient(circle,#87e7f02b 0 18%,#4ab0c112 40%,transparent 70%);pointer-events:none}.lqCaveDrip{position:absolute;z-index:4;width:3px;height:13px;border-radius:50%;background:#b6efff99;box-shadow:0 0 7px #83dbea;pointer-events:none;animation:lqCaveDrip 2.6s infinite ease-in}@keyframes lqCaveDrip{0%{opacity:0;transform:translateY(-7px)}35%{opacity:.8}100%{opacity:0;transform:translateY(25px)}}
`;
document.head.appendChild(style);

function caveAhead(){
  if(s.screen!=='world'||s.map!==CAVE)return null;
  const p=front();
  return MAPS[CAVE].npcs.find(n=>n.x===p.x&&n.y===p.y)||null;
}
function enterCave(){
  stopMoving();s.map=CAVE;s.x=8;s.y=11;s.dir='up';
  s.dialog={name:'王都近郊・石灰洞',text:'洞口をくぐると、外の風音がすっと遠くなった。岩肌から落ちる水滴だけが響いている。\nルーク「任意探索ですよね？ “奥に勇者の義務があります”とか後から言わないですよね？」'};
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'&&s.map===FIELD){
    const p=front();
    const n=MAPS[FIELD].npcs.find(x=>x.x===p.x&&x.y===p.y);
    if(n?.kind==='lqLimestoneCaveMouth')return enterCave();
  }
  if(!s.dialog&&s.screen==='world'&&s.map===CAVE){
    const n=caveAhead();
    if(n){stopMoving();s.dialog=n;render();return;}
  }
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.map===CAVE&&s.y===13&&((MAPS[CAVE].tiles[s.y]||'')[s.x]==='G')){
    stopMoving();s.map=FIELD;s.x=4;s.y=14;s.dir='left';
    s.dialog={name:'王都近郊',text:'石灰洞を出ると、王都近郊の風が急に暖かく感じた。'};
    return;
  }
  return baseCheckGate();
};

function decorate(){
  if(s.screen!=='world'||s.map!==CAVE)return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqCaveGlow'))return;
  for(const [x,y] of [[2.2,2.0],[15.0,4.5],[5.7,8.3],[12.6,10.0]]){const st=document.createElement('div');st.className='lqCaveStalagmite';st.style.left=`${x*TS}px`;st.style.top=`${y*TS}px`;w.appendChild(st);}
  const glow=document.createElement('div');glow.className='lqCaveGlow';glow.style.left=`${11.8*TS}px`;glow.style.top=`${1.5*TS}px`;w.appendChild(glow);
  for(const [x,y,d] of [[8.2,4.8,'0s'],[10.1,5.2,'.8s'],[7.1,7.0,'1.4s']]){const drip=document.createElement('div');drip.className='lqCaveDrip';drip.style.left=`${x*TS}px`;drip.style.top=`${y*TS}px`;drip.style.animationDelay=d;w.appendChild(drip);}
}
const baseWorld=world;
world=function(){const r=baseWorld();decorate();return r;};
const baseRender=render;
render=function(){const r=baseRender();decorate();return r;};

window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{aldiaLimestoneCave:{entryMap:FIELD,map:CAVE,exitMap:FIELD,type:'natural-cave'}});
window.LQ_LIMESTONE_CAVE_STATUS={version:'1.0',map:CAVE,entry:[MOUTH_X,MOUTH_Y],interactionCount:5,storyFlagsAdded:0,protectedCanonChanged:false,iosPhysicalVerification:'PENDING'};
})();
