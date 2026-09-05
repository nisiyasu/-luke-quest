(() => {
'use strict';

/* LUKE QUEST v0.16 first building-interior patch.
   Adds a physical inn doorway, interior map, exit, readable props, and functional innkeeper.
   Keeps the rollback-safe v0.7 core and v0.8-v0.15 behavior intact. */

MAPS.innInterior={
  name:'南門宿・一階',w:14,h:11,
  tiles:[
    '##############',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '#............#',
    '######GG######'
  ],
  npcs:[
    {x:7,y:3,e:'🧔',name:'南門宿の主人',kind:'lqInnInteriorKeeper',text:'一泊12Gです。旅人も勇者も、寝る時くらいは同じ料金ですよ。'},
    {x:3,y:3,e:'🔥',name:'暖炉',kind:'lqInnProp',text:'薪が静かに爆ぜている。\nルーク「ここ、戦闘コマンドに『休む』を追加したくなる暖かさですね。」'},
    {x:10,y:3,e:'🛏️',name:'客室のベッド',kind:'lqInnProp',text:'きれいに整えられたベッドだ。宿代を払えば、ここでゆっくり休めそうだ。'},
    {x:3,y:6,e:'🪑',name:'食堂のテーブル',kind:'lqInnProp',text:'旅人向けの素朴な食卓。壁には「剣は鞘に、泥は玄関に」と書かれている。'},
    {x:10,y:7,e:'📚',name:'旅人の本棚',kind:'lqInnProp',text:'街道や森の旅行記が並ぶ。北へ行くほど、途中からページがやけに短い。'}
  ]
};

const oldInn=MAPS.town?.npcs?.find(n=>n.kind==='lqInn');
if(oldInn){
  oldInn.kind='lqInnDoor';
  oldInn.e='🚪';
  oldInn.name='南門宿';
  oldInn.text='扉を開けて宿へ入る。';
}

function innNpcAhead(){
  if(s.screen!=='world')return null;
  const p=front();
  return currentNpcs().find(n=>n.x===p.x&&n.y===p.y)||null;
}

function enterInn(){
  stopMoving();
  s.map='innInterior';
  s.x=6;s.y=8;s.dir='up';
  s.dialog={name:'南門宿',text:'木の扉を開けると、暖炉の匂いと食事の湯気が流れてきた。\nルーク「宿屋……敵が出ない建物。好きです。」'};
  render();
}

function restInsideInn(){
  stopMoving();
  if(s.hp>=s.mh){
    s.dialog={name:'南門宿の主人',text:`HPはすでに満タンです（${s.hp}/${s.mh}）。\n主人「休むのは自由ですが、治療目的なら今は必要なさそうですね。」`};
    return render();
  }
  if(s.gold<12){
    s.dialog={name:'南門宿の主人',text:`一泊12Gです。\n所持金：${s.gold}G\n主人「不足分は次の冒険で。無理して倒れたら宿代どころじゃありません。」`};
    return render();
  }
  const before=s.hp;
  s.gold-=12;
  s.hp=s.mh;
  s.dialog={name:'南門宿の主人',text:`一晩休んだ。\nHP ${before} → ${s.hp}　残金 ${s.gold}G\nルーク「ベッドって、薬草より大きいのに持ち歩けないのが欠点ですね。」`};
  render();
}

const tileClassV15=tileClass;
tileClass=function(c){
  if(s.map==='innInterior'){
    if(c==='#')return'wall lqInnWall';
    if(c==='G')return'gate lqInnDoorTile';
    return'lqInnFloor';
  }
  return tileClassV15(c);
};

const tileEmojiV15=tileEmoji;
tileEmoji=function(c){
  if(s.map==='innInterior'&&c==='G')return'🚪';
  return tileEmojiV15(c);
};

const checkGateV15=checkGate;
checkGate=function(){
  if(s.map==='innInterior'){
    const c=(MAPS.innInterior.tiles[s.y]||'')[s.x];
    if(c==='G'){
      stopMoving();
      s.map='town';
      s.x=5;s.y=13;s.dir='down';
      s.dialog={name:'南門宿',text:'宿を出て、王都の石畳へ戻った。'};
      return;
    }
  }
  return checkGateV15();
};

const actionV15=action;
action=function(){
  if(s.dialog)return actionV15();
  const n=innNpcAhead();
  if(s.map==='town'&&n?.kind==='lqInnDoor')return enterInn();
  if(s.map==='innInterior'&&n?.kind==='lqInnInteriorKeeper')return restInsideInn();
  return actionV15();
};

const style=document.createElement('style');
style.textContent=`
.tile.lqInnFloor{background:linear-gradient(90deg,#855b38 0 7%,#9d7047 7% 93%,#7a5031 93%);box-shadow:inset 0 1px #c7966338,inset 0 -1px #4c311f55}
.tile.lqInnWall{background:linear-gradient(#554333,#3c2d24);box-shadow:inset 0 -8px #241b16aa}
.tile.lqInnDoorTile{background:linear-gradient(#c59659,#76502f);font-size:24px;box-shadow:inset 0 0 0 3px #e2bd7a55}
.lqInnRug{position:absolute;z-index:3;border-radius:12px;background:repeating-linear-gradient(90deg,#7d2531 0 10px,#b94b42 10px 20px,#d39b4b 20px 23px);border:3px solid #e4b85e;box-shadow:0 5px 12px #0005;pointer-events:none}
.lqInnCounter{position:absolute;z-index:4;background:linear-gradient(#9b6c40,#644329);border:3px solid #c7975d;border-radius:7px;box-shadow:0 5px 10px #0007;pointer-events:none}
.lqInnLabel{position:absolute;z-index:6;transform:translate(-50%,-100%);background:#241a15e8;color:#ffe8ad;border:1px solid #d8a85d;border-radius:8px;padding:4px 7px;font-size:10px;font-weight:900;white-space:nowrap;pointer-events:none}
`;
document.head.appendChild(style);

function decorateInn(){
  if(s.screen!=='world'||s.map!=='innInterior')return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqInnRug'))return;
  const rug=document.createElement('div');
  rug.className='lqInnRug';rug.style.left=`${4*TS}px`;rug.style.top=`${5*TS}px`;rug.style.width=`${6*TS}px`;rug.style.height=`${3*TS}px`;w.appendChild(rug);
  const counter=document.createElement('div');
  counter.className='lqInnCounter';counter.style.left=`${5*TS}px`;counter.style.top=`${2*TS+20}px`;counter.style.width=`${5*TS}px`;counter.style.height='20px';w.appendChild(counter);
  const label=document.createElement('div');
  label.className='lqInnLabel';label.textContent='受付・宿泊 12G';label.style.left=`${7*TS+TS/2}px`;label.style.top=`${3*TS}px`;w.appendChild(label);
}

const worldV15=world;
world=function(){worldV15();decorateInn();};
const renderV15=render;
render=function(){const r=renderV15();if(s.screen==='world'&&s.map==='innInterior')decorateInn();return r;};

window.LQ_BUILDING_INTERIORS={innInterior:{entryMap:'town',exitMap:'town',service:'inn',price:12}};

if(s.screen==='world')render();
})();
