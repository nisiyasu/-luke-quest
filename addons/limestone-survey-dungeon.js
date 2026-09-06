(() => {
'use strict';

/* REQ-031 — compact dungeon with a persistent lever-controlled gate. */
const CAVE='aldiaLimestoneCave';
const DUNGEON='aldiaSurveyDungeon';
const ENTRANCE_X=16,ENTRANCE_Y=11;
const GATE_X=9,GATE_Y=7;
const FLAG='lqSurveyGateOpen';
if(!MAPS[CAVE])return;

const gateNpc={x:GATE_X,y:GATE_Y,e:'',name:'旧坑道の鉄格子',kind:'lqSurveyGate',text:'錆びた鉄格子が坑道を完全に塞いでいる。壁際の機構へどこかから繋がっているようだ。'};

MAPS[DUNGEON]={
  name:'石灰洞・旧測量坑道',w:20,h:16,
  tiles:[
    '####################',
    '#..................#',
    '#..####......####..#',
    '#..................#',
    '#....###....###....#',
    '#..................#',
    '#..................#',
    '#########.##########',
    '#..................#',
    '#..####......####..#',
    '#..#............#..#',
    '#..#............#..#',
    '#..................#',
    '#..................#',
    '#..................#',
    '#########GG#########'
  ],
  npcs:[
    gateNpc,
    {x:5,y:11,e:'',name:'坑道開閉レバー',kind:'lqSurveyLever',text:'古い鉄製レバー。壁の中を通る鎖が、坑道中央の鉄格子へ伸びている。'},
    {x:14,y:11,e:'',name:'測量坑道の注意書き',kind:'lqSurveyProp',text:'「支柱を越えて掘削するな。水脈付近では二人以上で行動すること」\n実務的な注意だけが淡々と残っている。'},
    {x:4,y:3,e:'',name:'古い測量台',kind:'lqSurveyTable',text:'三脚の跡が残る石台。表面には角度と距離らしい数字が細かく刻まれている。'},
    {x:14,y:3,e:'',name:'奥区画の測量標',kind:'lqSurveyDeepMark',text:'坑道最深部の壁に終点を示す測量標が残っている。ここから先は自然岩盤で、掘削された形跡はない。\nルーク「ちゃんと“ここまで”で終わってる記録、安心感がありますね。」'}
  ]
};

if(!MAPS[CAVE].npcs.some(n=>n.kind==='lqSurveyDungeonEntrance')){
  MAPS[CAVE].npcs.push({x:ENTRANCE_X,y:ENTRANCE_Y,e:'',name:'旧測量坑道の入口',kind:'lqSurveyDungeonEntrance',text:'補強木材の残る古い坑道口。自然洞とは違い、人の手で掘られた通路が奥へ伸びている。'});
}

function ensureFlags(){if(!s.flags||typeof s.flags!=='object')s.flags={};return s.flags;}
function gateOpen(){return !!ensureFlags()[FLAG];}
function syncGate(){
  const list=MAPS[DUNGEON].npcs;
  const i=list.findIndex(n=>n.kind==='lqSurveyGate');
  if(gateOpen()&&i>=0)list.splice(i,1);
  else if(!gateOpen()&&i<0)list.push(gateNpc);
}

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===DUNGEON){
    if(c==='#')return'wall lqSurveyWall';
    if(c==='G')return'gate lqSurveyExit';
    return'floor lqSurveyFloor';
  }
  return baseTileClass(c);
};
const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===DUNGEON)return'';return baseTileEmoji(c);};
const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqSurveyDungeonEntrance')return'npc lqSurveyDungeonEntrance';
  if(n?.kind==='lqSurveyGate')return'npc lqSurveyGate';
  if(n?.kind==='lqSurveyLever')return'npc lqSurveyLever';
  if(n?.kind==='lqSurveyProp')return'npc lqSurveyProp';
  if(n?.kind==='lqSurveyTable')return'npc lqSurveyTable';
  if(n?.kind==='lqSurveyDeepMark')return'npc lqSurveyDeepMark';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqSurveyFloor{background:linear-gradient(135deg,#4d4a42,#34332e 58%,#282824);box-shadow:inset 0 1px #fff1}.tile.lqSurveyWall{background:repeating-linear-gradient(90deg,#3a3832 0 18px,#4b473e 18px 22px),linear-gradient(#504c43,#282824);box-shadow:inset 0 -10px #171612cc}.tile.lqSurveyExit{background:linear-gradient(#79634a,#4d3e30);box-shadow:inset 0 0 0 3px #cdb88c44}
.lqSurveyDungeonEntrance{width:46px;height:44px;font-size:0;border:4px solid #66513a;border-bottom:0;border-radius:22px 22px 3px 3px;background:radial-gradient(ellipse at 50% 75%,#070909 0 42%,#252825 43% 63%,transparent 64%);box-shadow:0 5px 8px #000b}.lqSurveyDungeonEntrance:after{content:'';position:absolute;left:4px;right:4px;top:11px;height:5px;background:#806544;box-shadow:0 11px #6d553b}
.lqSurveyGate{width:43px;height:48px;font-size:0;border:3px solid #807567;background:repeating-linear-gradient(90deg,#333 0 5px,#9a9081 5px 9px,#252525 9px 14px);box-shadow:0 5px 10px #000c,inset 0 0 8px #000}.lqSurveyGate:after{content:'';position:absolute;left:5px;right:5px;top:20px;height:6px;background:#8e6d43}
.lqSurveyLever{width:40px;height:42px;font-size:0;border:2px solid #82745e;border-radius:5px;background:linear-gradient(#4f4b43,#2e2c28);box-shadow:0 5px 8px #000a}.lqSurveyLever:before{content:'';position:absolute;left:18px;top:5px;width:6px;height:25px;background:#b0a18a;transform:rotate(-24deg);transform-origin:bottom}.lqSurveyLever:after{content:'';position:absolute;left:13px;top:2px;width:15px;height:12px;border-radius:50%;background:#8d3f2f;box-shadow:0 0 7px #d36a4b66}
.lqSurveyProp,.lqSurveyTable,.lqSurveyDeepMark{width:40px;height:40px;font-size:0;border:2px solid #8f8067;border-radius:5px;background:linear-gradient(145deg,#5d574b,#35332d);box-shadow:0 5px 8px #0009}.lqSurveyProp:after{content:'≡';position:absolute;left:10px;top:6px;color:#cfbd91;font-size:21px}.lqSurveyTable:after{content:'⌖';position:absolute;left:8px;top:5px;color:#d2c195;font-size:23px}.lqSurveyDeepMark:after{content:'⊙';position:absolute;left:8px;top:5px;color:#b8d5d6;font-size:23px;text-shadow:0 0 7px #8ad1d6}
.lqSurveyBeam{position:absolute;z-index:3;width:18px;height:108px;background:linear-gradient(90deg,#4a3829,#77583b,#443225);border:2px solid #2d2119;box-shadow:0 7px 8px #000a;pointer-events:none}.lqSurveyLantern{position:absolute;z-index:4;width:22px;height:28px;border:3px solid #6e5f48;border-radius:6px;background:radial-gradient(circle,#ffe5a0 0 22%,#d69a48 38%,#3b3025 70%);box-shadow:0 0 24px #ffbd5d66;pointer-events:none}.lqSurveyChain{position:absolute;z-index:4;width:190px;height:6px;background:repeating-linear-gradient(90deg,#80796e 0 8px,#383632 8px 12px);transform:rotate(-7deg);opacity:.65;pointer-events:none}
`;
document.head.appendChild(style);

function aheadNpc(){
  if(s.screen!=='world'||s.map!==DUNGEON)return null;
  const p=front();
  return MAPS[DUNGEON].npcs.find(n=>n.x===p.x&&n.y===p.y)||null;
}
function enterDungeon(){
  stopMoving();syncGate();s.map=DUNGEON;s.x=9;s.y=14;s.dir='up';
  s.dialog={name:'石灰洞・旧測量坑道',text:'補強された坑道へ入ると、自然洞とは違う直線的な通路が続いていた。\nルーク「人が作った地下道って、自然洞より安心……と思ったら鉄格子がありますね。」'};
  render();
}
function activateLever(){
  stopMoving();
  const flags=ensureFlags();
  if(!flags[FLAG]){
    flags[FLAG]=true;syncGate();
    s.dialog={name:'坑道開閉レバー',text:'重いレバーを倒すと、壁の中で鎖が走り、中央の鉄格子がゆっくり持ち上がった。\nルーク「よし。戻る前に、ちゃんと開いたままか二回見ます。」'};
  }else{
    syncGate();
    s.dialog={name:'坑道開閉レバー',text:'レバーは開放位置で固定されている。中央の鉄格子も上がったままだ。'};
  }
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'&&s.map===CAVE){
    const p=front();
    const n=MAPS[CAVE].npcs.find(x=>x.x===p.x&&x.y===p.y);
    if(n?.kind==='lqSurveyDungeonEntrance')return enterDungeon();
  }
  if(!s.dialog&&s.screen==='world'&&s.map===DUNGEON){
    const n=aheadNpc();
    if(n?.kind==='lqSurveyLever')return activateLever();
    if(n){stopMoving();s.dialog=n;render();return;}
  }
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.map===DUNGEON&&s.y===15&&((MAPS[DUNGEON].tiles[s.y]||'')[s.x]==='G')){
    stopMoving();s.map=CAVE;s.x=15;s.y=11;s.dir='right';
    s.dialog={name:'王都近郊・石灰洞',text:'旧測量坑道を出て、自然の石灰洞へ戻った。'};
    return;
  }
  return baseCheckGate();
};

function decorate(){
  if(s.screen!=='world'||s.map!==DUNGEON)return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqSurveyBeam'))return;
  for(const [x,y] of [[2.0,2.0],[16.8,2.0],[2.0,9.0],[16.8,9.0]]){const b=document.createElement('div');b.className='lqSurveyBeam';b.style.left=`${x*TS}px`;b.style.top=`${y*TS}px`;w.appendChild(b);}
  for(const [x,y] of [[6.0,5.6],[12.5,10.4]]){const l=document.createElement('div');l.className='lqSurveyLantern';l.style.left=`${x*TS}px`;l.style.top=`${y*TS}px`;w.appendChild(l);}
  const c=document.createElement('div');c.className='lqSurveyChain';c.style.left=`${5.8*TS}px`;c.style.top=`${9.9*TS}px`;w.appendChild(c);
}
const baseRender=render;
render=function(){if(s.map===DUNGEON)syncGate();const r=baseRender();decorate();return r;};
const baseWorld=world;
world=function(){if(s.map===DUNGEON)syncGate();const r=baseWorld();decorate();return r;};

window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{aldiaSurveyDungeon:{entryMap:CAVE,map:DUNGEON,exitMap:CAVE,type:'persistent-switch-dungeon'}});
window.LQ_SURVEY_DUNGEON_STATUS={version:'1.0',map:DUNGEON,entry:[ENTRANCE_X,ENTRANCE_Y],spawn:[9,14],gate:[GATE_X,GATE_Y],flag:FLAG,persistentGate:true,protectedCanonChanged:false,iosPhysicalVerification:'PENDING'};
})();
