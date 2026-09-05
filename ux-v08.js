(() => {
'use strict';

/* LUKE QUEST v0.8 presentation/world patch.
   Loaded by Pages after index.html so the canonical v0.7 core stays rollback-safe. */

const style=document.createElement('style');
style.textContent=`
.questGuide{position:absolute;left:10px;right:10px;top:48px;z-index:21;background:#0b172ee8;border:1px solid #f6d35b99;border-radius:10px;padding:8px 10px;font-weight:850;font-size:12px;line-height:1.35;pointer-events:none;box-shadow:0 4px 15px #0008}.questGuide b{color:#f6d35b}
.exitMark{font-size:13px;font-weight:950;color:#241900;background:#ffd84f;border:2px solid #fff4a8;border-radius:7px;padding:2px 4px;box-shadow:0 0 0 3px #ffd84f44,0 0 15px #ffd84faa;animation:lqPulse 1s infinite alternate}
@keyframes lqPulse{to{transform:scale(1.08);box-shadow:0 0 0 5px #ffd84f55,0 0 22px #ffd84f}}
.cliff{background:#555044}
@media(max-height:700px){.questGuide{font-size:11px}}
`;
document.head.appendChild(style);

DEFAULT.flags.guidanceIntroSeen ??= false;
DEFAULT.flags.cliffEntered ??= false;
DEFAULT.flags.leonSecondSeen ??= false;
s.flags.guidanceIntroSeen ??= false;
s.flags.cliffEntered ??= false;
s.flags.leonSecondSeen ??= false;

if(!MAPS.town.npcs.some(n=>n.kind==='exitGuide')){
  MAPS.town.npcs.push({
    x:7,y:13,e:'🛡️',name:'南門の案内兵',kind:'exitGuide',
    text:'レオンを追うなら、このすぐ南の門だ。黄色い「出口」表示を目印に王都近郊へ出てくれ。\nルーク「最初からそれを聞きたかったです。」'
  });
}

MAPS.cliffRoad={
  name:'北の崖道',w:30,h:24,
  tiles:[
    '##############W###############',
    '#....^^^.........^^^^^.......#',
    '#..^^^^^....++...^^^^^^......#',
    '#...^^......++......^^.......#',
    '#..........++++..............#',
    '#..#####............#####....#',
    '#..#...#....^^^^....#...#....#',
    '#..#...#...^^^^^^...#...#....#',
    '#..#####...^^^^^^...#####....#',
    '#..........^^^^^^............#',
    '#....++++............++++....#',
    '#....++++..#####.....++++....#',
    '#..........#...#.............#',
    '#..^^^^....#...#....^^^^.....#',
    '#..^^^^....#####....^^^^.....#',
    '#............................#',
    '#.....^^^^.........^^^^......#',
    '#.....^^^^..++++...^^^^......#',
    '#...........++++.............#',
    '#..#####............#####....#',
    '#............................#',
    '#.....++++........++++.......#',
    '#.............CC.............#',
    '##############..##############'
  ],
  npcs:[
    {x:15,y:6,e:'🧑‍🦳',name:'レオン',text:'',kind:'leon2'},
    {x:8,y:14,e:'🧣',name:'裂けた青い布',text:'王都の勇者候補用マントと同じ青。血が乾き始めている。\nルーク「かなり近い。今度こそ話を聞かないと。」'}
  ]
};

const CLIFF_ENEMIES=[
  {n:'崖風コウモリ',e:'🦇',hp:82,a:[12,17],xp:48,g:36},
  {n:'岩角ヤギ',e:'🐐',hp:90,a:[12,18],xp:52,g:40},
  {n:'裂谷ワシ',e:'🦅',hp:88,a:[13,18],xp:54,g:42}
];

const baseTileClass=tileClass;
tileClass=function(c){
  if(['C','W'].includes(c))return'gate';
  if(s.map==='cliffRoad'){
    if(c==='+')return'ash';
    if(c==='.')return'cliff';
  }
  return baseTileClass(c);
};

const baseTileEmoji=tileEmoji;
tileEmoji=function(c){
  if(s.map==='town'&&c==='G')return'<span class="exitMark">出口↓</span>';
  if(s.map==='cliffRoad'&&c==='W')return'🌫️';
  return baseTileEmoji(c);
};

const baseVisibleNpcs=visibleNpcs;
visibleNpcs=function(m){
  return baseVisibleNpcs(m).filter(n=>!(n.kind==='leon2'&&s.flags.leonSecondSeen));
};

const baseEncounterMap=encounterMap;
encounterMap=function(){return s.map==='cliffRoad'||baseEncounterMap()};

const baseEnemyPool=enemyPool;
enemyPool=function(){return s.map==='cliffRoad'?CLIFF_ENEMIES:baseEnemyPool()};

function goalTextV08(){
  if(s.map==='town')return'南へ進み、黄色い「出口」から王都近郊へ';
  if(s.map==='field')return s.wins<2?'王都近郊で2勝 → 北東の魔物の森へ':'北東の魔物の森へ';
  if(s.map==='forest')return'森の北側から深部へ';
  if(s.map==='deepForest')return s.flags.leonSeen?'北の霧へレオンを追う':'深部でレオン本人を探す';
  if(s.map==='mistTrail')return s.flags.glennTraceSeen?'北の監視区域へ':'魔王軍の痕跡を調べる';
  if(s.map==='observation')return s.flags.glennSeen?'北の封鎖線を越える':'グレン隊長を探す';
  if(s.map==='evacRoute')return s.flags.withdrawProofSeen?'北端から崖道へ':'退避路の痕跡を調べる';
  if(s.map==='cliffRoad')return s.flags.leonSecondSeen?'北端へ進みレオンを追跡':'崖道でレオン本人に追いつく';
  return'レオンを追う';
}

world=function(){
  let m=MAPS[s.map],vw=Math.min(640,window.innerWidth-24),vh=Math.min(Math.round(vw*1.25),window.innerHeight*.68),px=s.x*TS+5,py=s.y*TS+3,cx=vw/2-px-19,cy=vh/2-py-21;
  cx=Math.min(0,Math.max(vw-m.w*TS,cx));cy=Math.min(0,Math.max(vh-m.h*TS,cy));
  let tiles='';
  for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){
    let c=m.tiles[y][x]||'#';
    tiles+=`<div class="tile ${tileClass(c)}" style="left:${x*TS}px;top:${y*TS}px">${tileEmoji(c)}</div>`;
  }
  let npcs=visibleNpcs(m).map(n=>`<div class="${npcClass(n)}" style="left:${n.x*TS+5}px;top:${n.y*TS+3}px">${n.e}</div>`).join('');
  let tag=s.flags.leonSecondSeen?'レオン再会':s.flags.withdrawProofSeen?'退避命令確認':s.flags.evacEntered?'退避路追跡':s.flags.glennSeen?'グレン確認':s.flags.glennTraceSeen?'魔王軍追跡':s.flags.leonSeen?'レオン発見':'勝利 '+s.wins;
  app.innerHTML=status()+`<div class=gameShell style="height:${vh}px"><div class=world style="width:${m.w*TS}px;height:${m.h*TS}px;transform:translate(${cx}px,${cy}px)">${tiles}${npcs}<div class=player style="left:${px}px;top:${py}px">🧑‍🦱</div></div><div class=hud><div class=chip>📍 ${m.name}</div><div class=chip>${tag}</div></div><div class=questGuide><b>目的：</b>${goalTextV08()}</div>${s.dialog?`<div class=dialogBox><div class=speaker>${s.dialog.name}</div><div class=dialog>${s.dialog.text}</div><div class=sub style="text-align:right">Aで閉じる</div></div>`:''}</div><div class=controls><div class=dpad><button class=up data-d=up>▲</button><button class=left data-d=left>◀</button><button class=down data-d=down>▼</button><button class=right data-d=right>▶</button></div><div class=actionPad><button class=a onclick=action()>A</button><button onclick="openMenu()">☰</button></div></div><div class=foot>LUKE QUEST v0.8 • autosave</div>`;
  bindControls();
};

const baseCheckGate=checkGate;
checkGate=function(){
  let m=MAPS[s.map],c=(m.tiles[s.y]||'')[s.x];
  if(s.map==='town'&&c==='G'){
    s.map='field';s.x=10;s.y=15;encounterGrace=3;
    s.dialog={name:'王都近郊',text:'王都を出た。次は草原で2勝し、北東の魔物の森へ。\n画面上部の「目的」が次の進路を案内します。'};
    stopMoving();return;
  }
  if(s.map==='evacRoute'&&c==='N'){
    if(!s.flags.withdrawProofSeen){
      s.y=1;stopMoving();s.dialog={name:'北の崖道',text:'先へ進む前に、この退避路に残された痕跡を調べた方がよさそうだ。'};return;
    }
    s.map='cliffRoad';s.x=14;s.y=22;encounterGrace=5;s.flags.cliffEntered=true;
    s.dialog={name:'ナレーション',text:'風の強い崖道へ出た。岩陰に、新しい血痕と靴跡。\n今度こそレオンは近い。'};
    stopMoving();return;
  }
  if(s.map==='cliffRoad'&&c==='C'){
    s.map='evacRoute';s.x=14;s.y=1;encounterGrace=4;return;
  }
  if(s.map==='cliffRoad'&&c==='W'){
    s.y=1;stopMoving();
    s.dialog={name:'北の尾根',text:s.flags.leonSecondSeen?'レオンはさらに北へ進んだ。ここから先は次の更新で開通予定。':'まず崖道でレオン本人に追いつこう。'};
    return;
  }
  return baseCheckGate();
};

const baseStoryProximity=checkStoryProximity;
checkStoryProximity=function(){
  if(s.map==='cliffRoad'&&!s.flags.leonSecondSeen&&Math.abs(s.x-15)+Math.abs(s.y-6)<=1){
    stopMoving();s.flags.leonSecondSeen=true;
    s.dialog={name:'レオン',text:'岩壁にもたれていたレオンが、びくりと剣を上げる。\nレオン「また来たのか……帰れ！」\nルーク「帰るなら一緒に帰りましょう。傷もひどいです。」\nレオン「戻れない。僕が王都へ戻れば……神殿の連中だけじゃない。宿の人たちも、訓練所の仲間も巻き込まれる。」\nルーク「誰に？」\nレオン「言えない。言ったら君まで狙われる！」\n声は震えている。強がりでは隠せない恐怖だ。だが、誰かを守ろうとしているのも嘘ではない。\nレオン「僕は勇者なんかじゃない。でも……僕のせいで誰かが死ぬのは嫌だ。」\n突風が吹き、レオンは北の尾根へ走る。\nルーク「待って！ ……負傷者の速度じゃないですよ！」'};
    render();return true;
  }
  return baseStoryProximity();
};

const baseAction=action;
action=function(){
  if(s.dialog){stopMoving();s.dialog=null;return render()}
  let p=front(),n=currentNpcs().find(q=>q.x===p.x&&q.y===p.y);
  if(n&&n.kind==='leon2'){checkStoryProximity();return}
  return baseAction();
};

openMenu=function(){
  stopMoving();
  s.dialog={name:'冒険メモ',text:`目的：${goalTextV08()}\n現在地：${MAPS[s.map].name}\n総勝利：${s.wins}\n操作：十字キーで移動、Aで会話。`};
  render();
};

const baseTitle=title;
title=function(){
  baseTitle();
  const notice=app.querySelector('.notice');
  if(notice)notice.innerHTML='第一章：逃げた本命勇者レオンを追え。<br><b>迷ったら画面上の「目的」を見れば次の進路が分かります。</b>';
};

const baseNextIntro=nextIntro;
nextIntro=function(){
  const finishing=s.step===intro.length-1;
  baseNextIntro();
  if(finishing&&!s.flags.guidanceIntroSeen){
    s.flags.guidanceIntroSeen=true;
    s.dialog={name:'冒険ガイド',text:'まずは王都を出よう。画面上の「目的」を見ながら、下（南）へ進んで黄色い「出口」から王都近郊へ。\n迷ったら☰の冒険メモでも確認できます。'};
    render();
  }
};

if(s.screen==='world'&&s.map==='town'&&!s.flags.guidanceIntroSeen){
  s.flags.guidanceIntroSeen=true;
  s.dialog={name:'冒険ガイド',text:'まずは王都を出よう。下（南）へ進んで黄色い「出口」から王都近郊へ。\n画面上の「目的」は常に次の進路を表示します。'};
}
render();
})();
