(() => {
'use strict';

/* LUKE QUEST v0.23 temple-lobby interior.
   Adds a third walkable Royal Capital building without advancing hidden story canon. */

MAPS.templeInterior={
  name:'王国神殿・礼拝堂',w:16,h:13,
  tiles:[
    '################',
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
    '#..............#',
    '#######GG#######'
  ],
  npcs:[
    {x:8,y:4,e:'🧑‍⚕️',name:'神殿の見習い',kind:'lqTempleNovice',text:'水晶があんな光り方をしたの、初めて見ました。エレノア様も驚いていたような……。'},
    {x:8,y:2,e:'💎',name:'勇者選定の祭壇',kind:'lqTempleAltar',text:'選定の儀式に使われた祭壇だ。今は静かだが、台座には新しい焦げ跡が残っている。\nルーク「爆発的に光る水晶って、説明書に書いておいてほしかったです。」'},
    {x:3,y:4,e:'🕯️',name:'祈りの燭台',kind:'lqTempleProp',text:'小さな灯が幾つも揺れている。旅立つ者の無事を祈るための燭台らしい。'},
    {x:12,y:4,e:'📜',name:'神殿の掲示板',kind:'lqTempleProp',text:'『勇者候補選定に関する問い合わせは受付へ』\nその下に、小さく『水晶の破損については調査中』と追記されている。'},
    {x:4,y:8,e:'🪑',name:'礼拝席',kind:'lqTempleProp',text:'磨かれた長椅子。王都の人々が日々祈りに訪れているようだ。'},
    {x:11,y:8,e:'🚪',name:'奥の聖堂',kind:'lqTempleSanctum',text:'重い扉には神殿の印章が掛かっている。今は関係者以外立入禁止らしい。'}
  ]
};

const noviceOutside=MAPS.town?.npcs?.find(n=>n.name==='神殿の見習い');
if(noviceOutside){
  noviceOutside.kind='lqTempleDoor';
  noviceOutside.e='⛩️';
  noviceOutside.name='王国神殿';
  noviceOutside.text='神殿の礼拝堂へ入る。';
}

function templeNpcAhead(){
  if(s.screen!=='world')return null;
  const p=front();
  return currentNpcs().find(n=>n.x===p.x&&n.y===p.y)||null;
}
function enterTemple(){
  stopMoving();s.map='templeInterior';s.x=7;s.y=10;s.dir='up';
  s.dialog={name:'王国神殿',text:'高い天井の礼拝堂へ足を踏み入れた。青白い光が石床に落ちている。\nルーク「静かだと、あの水晶の音を思い出しますね……。」'};render();
}

const tileClassV22=tileClass;
tileClass=function(c){
  if(s.map==='templeInterior'){
    if(c==='#')return'wall lqTempleWall';
    if(c==='G')return'gate lqTempleDoorTile';
    return'lqTempleFloor';
  }
  return tileClassV22(c);
};
const tileEmojiV22=tileEmoji;
tileEmoji=function(c){if(s.map==='templeInterior'&&c==='G')return'🚪';return tileEmojiV22(c);};

const checkGateV22=checkGate;
checkGate=function(){
  if(s.map==='templeInterior'){
    const c=(MAPS.templeInterior.tiles[s.y]||'')[s.x];
    if(c==='G'){
      stopMoving();s.map='town';s.x=8;s.y=6;s.dir='down';
      s.dialog={name:'王国神殿',text:'礼拝堂を出て王都中央広場へ戻った。'};return;
    }
  }
  return checkGateV22();
};

const actionV22=action;
action=function(){
  if(s.dialog)return actionV22();
  const n=templeNpcAhead();
  if(s.map==='town'&&n?.kind==='lqTempleDoor')return enterTemple();
  return actionV22();
};

const style=document.createElement('style');
style.textContent=`
.tile.lqTempleFloor{background:linear-gradient(135deg,#b9c3ca 0 48%,#8897a0 49% 52%,#c8d0d4 53%);box-shadow:inset 0 0 0 1px #eff8ff2d}
.tile.lqTempleWall{background:linear-gradient(#667582,#3b4852);box-shadow:inset 0 -9px #202b3388,inset 0 2px #dbe8ef22}
.tile.lqTempleDoorTile{background:linear-gradient(#a3adb4,#58636b);font-size:22px;box-shadow:inset 0 0 0 3px #d6e2e855}
.lqTempleRunner{position:absolute;z-index:2;background:linear-gradient(90deg,#384e8a,#5e78bd 48%,#384e8a);border-left:4px solid #d4b65d;border-right:4px solid #d4b65d;box-shadow:0 0 10px #0004;pointer-events:none}
.lqTempleDais{position:absolute;z-index:3;background:linear-gradient(#d4dce1,#8a969e);border:3px solid #e6edf1;border-radius:8px;box-shadow:0 6px 10px #0007;pointer-events:none}
.lqTempleWindow{position:absolute;z-index:3;width:50px;height:82px;border:5px solid #646f78;border-radius:26px 26px 5px 5px;background:conic-gradient(from 45deg,#5ed1e3,#3758af,#b96dc7,#f0c55d,#5ed1e3);box-shadow:inset 0 0 14px #fff7,0 0 18px #70cfe933;opacity:.85;pointer-events:none}
.lqTempleRay{position:absolute;z-index:2;width:130px;height:250px;background:linear-gradient(170deg,#aeefff00,#aeefff20 38%,#aeefff3c 70%,#aeefff00);clip-path:polygon(35% 0,65% 0,100% 100%,0 100%);filter:blur(2px);pointer-events:none}
.lqTempleTitle{position:absolute;z-index:6;transform:translate(-50%,-100%);background:#182738e8;border:1px solid #b9dbe7;border-radius:8px;padding:4px 8px;color:#e7f8ff;font-size:10px;font-weight:950;white-space:nowrap;pointer-events:none}
`;
document.head.appendChild(style);

function decorateTemple(){
  if(s.screen!=='world'||s.map!=='templeInterior')return;
  const w=app.querySelector('.world');if(!w||w.querySelector('.lqTempleRunner'))return;
  const runner=document.createElement('div');runner.className='lqTempleRunner';runner.style.left=`${6.3*TS}px`;runner.style.top=`${3*TS}px`;runner.style.width=`${3.4*TS}px`;runner.style.height=`${8*TS}px`;w.appendChild(runner);
  const dais=document.createElement('div');dais.className='lqTempleDais';dais.style.left=`${5.5*TS}px`;dais.style.top=`${1.2*TS}px`;dais.style.width=`${5*TS}px`;dais.style.height=`${1.7*TS}px`;w.appendChild(dais);
  for(const [x,y] of [[1.2,1.1],[13.6,1.1]]){const win=document.createElement('div');win.className='lqTempleWindow';win.style.left=`${x*TS}px`;win.style.top=`${y*TS}px`;w.appendChild(win);}
  const ray=document.createElement('div');ray.className='lqTempleRay';ray.style.left=`${5.8*TS}px`;ray.style.top=`${1.6*TS}px`;w.appendChild(ray);
  const title=document.createElement('div');title.className='lqTempleTitle';title.textContent='勇者選定の祭壇';title.style.left=`${8*TS+TS/2}px`;title.style.top=`${2*TS}px`;w.appendChild(title);
}
const worldV22=world;
world=function(){worldV22();decorateTemple();};
const renderV22=render;
render=function(){const r=renderV22();if(s.screen==='world'&&s.map==='templeInterior')decorateTemple();return r;};

window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{templeInterior:{entryMap:'town',exitMap:'town',service:'story-lobby',hiddenCanonRevealed:false}});
if(s.screen==='world')render();
})();
