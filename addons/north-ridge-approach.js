(() => {
'use strict';

/* REQ-105 — one more safe walkable pursuit area beyond Windcut Pass.
   Reuses the adjacent route's encounter pool and canonical action/checkGate loop.
   No protected reveal or new required story flag is introduced. */
const WIND='windcutPass';
const RIDGE='northRidgeApproach';
const ENTRY_GRACE=5;
const RETURN_GRACE=4;
if(!MAPS[WIND])return;

MAPS[RIDGE]={
  name:'北尾根・岩棚道',w:22,h:20,
  tiles:[
    '##########^^##########',
    '#...^^............^^.#',
    '#..^^^^..........^^^^#',
    '#...^^............^^.#',
    '#....................#',
    '#.####..........####.#',
    '#.#................#.#',
    '#.#....^^^^^^......#.#',
    '#.....^^^^^^^^.......#',
    '#.....^^....^^.......#',
    '#....................#',
    '#..^^............^^..#',
    '#..^^^^........^^^^..#',
    '#....................#',
    '#.#####........#####.#',
    '#....................#',
    '#....^^........^^....#',
    '#....................#',
    '#....................#',
    '##########VV##########'
  ],
  npcs:[
    {x:7,y:16,e:'',name:'岩粉に残る新しい靴跡',kind:'lqNorthRidgeFootprints',text:'白っぽい岩粉の上に、まだ輪郭の崩れていない靴跡が北へ続いている。風切り峠で見た一人分と同じ幅だ。\nルーク「ここまで来て別人だったら、それはそれで怖いですけどね。」'},
    {x:15,y:13,e:'',name:'崖側へ倒れた境界杭',kind:'lqNorthRidgeStake',text:'古い境界杭が崖側へ倒れている。新しい擦り傷があり、誰かが急いで脇を抜けたようだ。\nルーク「急いでるのは確かですね。僕は急がず落ちない方を優先します。」'},
    {x:5,y:7,e:'',name:'北側を望む狭い岩棚',kind:'lqNorthRidgeView',text:'岩棚の向こうで尾根はさらに北へ折れている。人影までは見えないが、風が弱まるたび小石の転がる音が返ってくる。'},
    {x:10,y:1,e:'',name:'さらに北へ続く岩棚道',kind:'lqNorthRidgeBoundary',text:'靴跡は細い岩棚の向こうへ続いている。ここから先も追跡路は途切れていない。\nルーク「まだ先か……でも、少なくとも道は合ってます。ここで見失うより百倍マシです。」'}
  ]
};

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===RIDGE){
    if(c==='#')return'wall lqNorthRidgeWall';
    if(c==='^')return'wall lqNorthRidgeRock';
    if(c==='V')return'gate lqNorthRidgeExit';
    return'floor lqNorthRidgePath';
  }
  return baseTileClass(c);
};
const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===RIDGE)return'';return baseTileEmoji(c);};
const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqNorthRidgeFootprints')return'npc lqNorthRidgeFootprints';
  if(n?.kind==='lqNorthRidgeStake')return'npc lqNorthRidgeStake';
  if(n?.kind==='lqNorthRidgeView')return'npc lqNorthRidgeView';
  if(n?.kind==='lqNorthRidgeBoundary')return'npc lqNorthRidgeBoundary';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqNorthRidgePath{background:radial-gradient(circle at 28% 32%,#d2c6a92b 0 6%,transparent 7%),linear-gradient(150deg,#8b8577,#646761 58%,#464d4a);box-shadow:inset 0 1px #fff4}.tile.lqNorthRidgeWall{background:linear-gradient(128deg,#7b7d77,#505852 56%,#303835);box-shadow:inset 0 -13px #1d2521bd}.tile.lqNorthRidgeRock{background:linear-gradient(148deg,#aaa394,#72776e 52%,#444c47);box-shadow:inset 0 -8px #2b342fbd,0 2px 0 #ddd3b53c}.tile.lqNorthRidgeExit{background:linear-gradient(#998360,#5d503d);box-shadow:inset 0 0 0 3px #f5dda94a}
.lqNorthRidgeFootprints{width:46px;height:40px;font-size:0}.lqNorthRidgeFootprints:before,.lqNorthRidgeFootprints:after{content:'';position:absolute;width:9px;height:17px;border-radius:55% 55% 45% 45%;background:#3d342b;box-shadow:0 0 0 2px #d4c09b45}.lqNorthRidgeFootprints:before{left:10px;top:17px;transform:rotate(-19deg)}.lqNorthRidgeFootprints:after{left:27px;top:3px;transform:rotate(18deg)}
.lqNorthRidgeStake{width:44px;height:44px;font-size:0}.lqNorthRidgeStake:before{content:'';position:absolute;left:19px;top:4px;width:6px;height:37px;background:linear-gradient(#cab27f,#6c583a);transform:rotate(32deg);box-shadow:2px 3px 4px #0008}.lqNorthRidgeStake:after{content:'';position:absolute;left:5px;top:25px;width:35px;height:4px;background:repeating-linear-gradient(90deg,#d3bc84 0 6px,#786340 6px 10px);transform:rotate(-18deg)}
.lqNorthRidgeView{width:44px;height:42px;font-size:0;background:linear-gradient(#b8e2e955,#eef8f75c 58%,transparent 59%);border-bottom:4px solid #6a6455;box-shadow:0 0 15px #c9f4ff2c}.lqNorthRidgeView:after{content:'⌁';position:absolute;left:10px;top:2px;color:#f3fbfc;font-size:24px;text-shadow:0 2px 4px #000}
.lqNorthRidgeBoundary{width:48px;height:44px;font-size:0;background:linear-gradient(145deg,#777970 0 35%,transparent 36%),linear-gradient(28deg,#535a53 0 48%,transparent 49%);filter:drop-shadow(0 6px 5px #000a)}.lqNorthRidgeBoundary:after{content:'↑';position:absolute;right:7px;top:-5px;color:#f0d889;font-size:20px;text-shadow:0 2px 4px #000}
.lqNorthRidgeMist{position:absolute;z-index:2;width:190px;height:50px;border-radius:50%;background:radial-gradient(ellipse,#edf6f69c 0 24%,#cfdddd52 46%,transparent 72%);filter:blur(2px);pointer-events:none;animation:lqNorthRidgeMist 8.8s infinite alternate ease-in-out}.lqNorthRidgeWind{position:absolute;z-index:4;width:152px;height:18px;border-top:2px solid #f1fbff80;border-radius:50%;pointer-events:none;animation:lqNorthRidgeWind 2.15s infinite ease-in-out}@keyframes lqNorthRidgeMist{from{transform:translateX(-20px);opacity:.35}to{transform:translateX(28px);opacity:.7}}@keyframes lqNorthRidgeWind{0%{opacity:0;transform:translateX(-34px)}45%{opacity:.82}100%{opacity:0;transform:translateX(45px)}}@media(prefers-reduced-motion:reduce){.lqNorthRidgeMist,.lqNorthRidgeWind{animation:none;opacity:.28}}
`;
document.head.appendChild(style);

function aheadNpc(mapId){
  if(s.screen!=='world'||s.map!==mapId)return null;
  const p=front();
  return MAPS[mapId]?.npcs?.find(n=>n.x===p.x&&n.y===p.y)||null;
}
function enterRidge(){
  stopMoving();
  encounterGrace=ENTRY_GRACE;
  s.map=RIDGE;s.x=10;s.y=18;s.dir='up';
  s.dialog={name:'北尾根・岩棚道',text:'峠を越えると、尾根は岩棚のように細く伸びていた。白い岩粉の上へ、新しい靴跡が点々と続いている。\nルーク「道が細くなるたびに、帰り道の価値が上がっていきますね。」'};
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'){
    if(s.map===WIND){
      const n=aheadNpc(WIND);
      if(n?.kind==='lqWindcutBoundary'){enterRidge();return;}
    }
    if(s.map===RIDGE){
      const n=aheadNpc(RIDGE);
      if(n){stopMoving();s.dialog=n;render();return;}
    }
  }
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.map===RIDGE){
    const row=MAPS[RIDGE]?.tiles?.[s.y]||'';
    if(row[s.x]==='V'){
      stopMoving();
      encounterGrace=RETURN_GRACE;
      s.map=WIND;s.x=10;s.y=2;s.dir='down';
      s.dialog={name:'風切り峠',text:'岩棚道から風切り峠へ戻った。北へ続く靴跡は、まだ岩壁の向こうに残っている。'};
      return;
    }
  }
  return baseCheckGate();
};

const baseEncounterMap=encounterMap;
encounterMap=function(){return s.map===RIDGE?true:baseEncounterMap();};
const baseEnemyPool=enemyPool;
enemyPool=function(){return s.map===RIDGE?EVAC_ENEMIES:baseEnemyPool();};

function decorate(){
  if(s.screen!=='world'||s.map!==RIDGE)return;
  const w=app.querySelector('.world');if(!w||w.querySelector('.lqNorthRidgeMist'))return;
  for(const [x,y] of [[1.1,3.0],[14.6,10.4]]){const m=document.createElement('div');m.className='lqNorthRidgeMist';m.style.left=`${x*TS}px`;m.style.top=`${y*TS}px`;w.appendChild(m);}
  for(const [x,y,d] of [[2.2,4.2,'0s'],[10.7,8.5,'.5s'],[5.2,13.0,'1s'],[13.0,16.2,'1.4s']]){const e=document.createElement('div');e.className='lqNorthRidgeWind';e.style.left=`${x*TS}px`;e.style.top=`${y*TS}px`;e.style.animationDelay=d;w.appendChild(e);}
}
const baseWorld=world;
world=function(){const r=baseWorld();decorate();return r;};
const baseRender=render;
render=function(){const r=baseRender();decorate();return r;};

window.LQ_NORTH_RIDGE_APPROACH_STATUS={
  version:'1.0',map:RIDGE,displayName:'北尾根・岩棚道',entryFrom:WIND,entrySpawn:[10,18],returnSpawn:[10,2],
  interactionCount:4,firstClue:{kind:'lqNorthRidgeFootprints',x:7,y:16},northBoundary:{kind:'lqNorthRidgeBoundary',x:10,y:1},
  newRequiredStoryFlags:0,protectedCanonChanged:false,encounterEnabled:true,encounterPool:'EVAC_ENEMIES',entryEncounterGrace:ENTRY_GRACE,returnEncounterGrace:RETURN_GRACE,
  canonicalAction:true,canonicalCheckGate:true,saveSchemaChanged:false,iosPhysicalVerification:'PENDING'
};
})();
