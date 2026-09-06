(() => {
'use strict';

/* REQ-054 — materialize the already-canonical North Temple as a walkable interior. */
const TEMPLE_MAP='aldiaNorthTemple';
const ENTRY_X=8,ENTRY_Y=1;

MAPS[TEMPLE_MAP]={
  name:'王都アルディア・北の神殿',w:12,h:10,
  tiles:[
    '############',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#..........#',
    '#####GG#####'
  ],
  npcs:[
    {x:3,y:4,e:'',name:'神殿の侍祭',kind:'lqTempleAttendant',text:'「祈りなら静かに。水晶のことを聞きたいなら……私も答えを持っていません。」\nルーク「答えがない人ほど意味深に言うの、神殿の伝統なんですか？」'},
    {x:6,y:2,e:'',name:'青白い祈祷水晶',kind:'lqTempleCrystal',text:'淡い光が水晶の奥で脈打っている。近づくと一瞬だけ光が強くなった。\nルーク「見習いさんが言ってたの、これか……。触らない方が長生きできそうですね。」'},
    {x:9,y:5,e:'',name:'古い奉納札の棚',kind:'lqTempleProp',text:'願い事を書いた木札が何段にも積まれている。「家族が無事でありますように」「明日のパンが焼けますように」。王都の普通の暮らしがここにもある。'}
  ]
};

if(MAPS.town&&!MAPS.town.npcs.some(n=>n.kind==='lqNorthTempleDoor')){
  MAPS.town.npcs.push({x:ENTRY_X,y:ENTRY_Y,e:'',name:'北の神殿・正門',kind:'lqNorthTempleDoor',text:'北区画に建つ白石の神殿。扉の奥から青白い光が漏れている。'});
}

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===TEMPLE_MAP){
    if(c==='#')return'wall lqTempleWall';
    if(c==='G')return'gate lqTempleExitTile';
    return'lqTempleFloor';
  }
  return baseTileClass(c);
};

const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===TEMPLE_MAP)return'';return baseTileEmoji(c);};

const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqNorthTempleDoor')return'npc lqNorthTempleDoor';
  if(n?.kind==='lqTempleAttendant')return'npc lqTempleAttendant';
  if(n?.kind==='lqTempleCrystal')return'npc lqTempleCrystal';
  if(n?.kind==='lqTempleProp')return'npc lqTempleProp';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqTempleFloor{background:linear-gradient(135deg,#d8d5c8,#bcbeb8);box-shadow:inset 0 0 0 1px #ffffff38}.tile.lqTempleWall{background:linear-gradient(#8f98a2,#5f6872 68%,#414852);box-shadow:inset 0 -8px #2b3138aa}.tile.lqTempleExitTile{background:linear-gradient(#928269,#625341);box-shadow:inset 0 0 0 3px #dfca9b55}
.lqNorthTempleDoor{width:42px;height:46px;font-size:0;border-radius:12px 12px 3px 3px;background:linear-gradient(90deg,#d6d9dc,#9ca7b1 46%,#7b8791 47% 53%,#c8ced2 54%);border:3px solid #e9e4cf;box-shadow:0 0 12px #80bfff55,0 6px 9px #0007}.lqNorthTempleDoor:before{content:'✦';position:absolute;left:12px;top:7px;color:#9ddcff;font-size:18px;text-shadow:0 0 8px #65c7ff}.lqNorthTempleDoor:after{content:'';position:absolute;left:7px;right:7px;bottom:5px;height:15px;border-radius:8px 8px 2px 2px;background:#4a5968}
.lqTempleAttendant{width:38px;height:44px;font-size:0;border-radius:13px 13px 7px 7px;background:linear-gradient(#d5d9df 0 23%,#e0bda3 24% 44%,#8799ae 45% 100%);border:2px solid #dfe8ef;box-shadow:0 4px 8px #0006}.lqTempleAttendant:after{content:'…';position:absolute;right:-7px;top:-12px;color:#e7f5ff;font-size:15px}
.lqTempleCrystal{width:42px;height:46px;font-size:0;background:linear-gradient(145deg,#d7f5ff,#70bce4 48%,#5276c5 72%,#243d78);clip-path:polygon(50% 0,87% 30%,72% 100%,28% 100%,13% 30%);filter:drop-shadow(0 0 10px #6ed3ff)}.lqTempleCrystal:after{content:'';position:absolute;left:16px;top:9px;width:9px;height:22px;background:#ffffff99;transform:rotate(18deg);border-radius:50%}
.lqTempleProp{width:40px;height:38px;font-size:0;background:linear-gradient(#806849,#4f402f);border:2px solid #b79a69;border-radius:5px;box-shadow:0 4px 7px #0006}.lqTempleProp:after{content:'▤';position:absolute;left:10px;top:6px;color:#e8d4a5;font-size:18px}
.lqTempleAltarVisual{position:absolute;z-index:3;width:116px;height:54px;border:4px solid #747c86;border-radius:10px;background:linear-gradient(#d5d7d7,#8d969e);box-shadow:0 8px 13px #0006;pointer-events:none}.lqTempleAltarVisual:after{content:'✧';position:absolute;left:45px;top:8px;color:#c8efff;font-size:27px;text-shadow:0 0 10px #6ed3ff}
.lqTempleWindowVisual{position:absolute;z-index:2;width:65px;height:90px;border:6px solid #68727c;border-radius:32px 32px 8px 8px;background:radial-gradient(circle at 50% 35%,#b8edff,#5087b7 55%,#293f66);box-shadow:inset 0 0 0 3px #c9d9df55,0 0 18px #6ebeff44;pointer-events:none}
`;
document.head.appendChild(style);

function templeNpcAhead(){
  if(s.screen!=='world'||s.map!==TEMPLE_MAP)return null;
  const p=front();
  return MAPS[TEMPLE_MAP].npcs.find(n=>n.x===p.x&&n.y===p.y)||null;
}

function enterTemple(){
  stopMoving();
  s.map=TEMPLE_MAP;s.x=5;s.y=7;s.dir='up';
  s.dialog={name:'王都アルディア・北の神殿',text:'白石の床に足音が響く。正面の水晶だけが、昼なのに月明かりのような光を放っていた。\nルーク「……老人の忠告、入ってから思い出すタイプなんですよね、僕。」'};
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'&&s.map==='town'){
    const p=front();
    if(p.x===ENTRY_X&&p.y===ENTRY_Y)return enterTemple();
  }
  if(!s.dialog&&s.screen==='world'&&s.map===TEMPLE_MAP){
    const n=templeNpcAhead();
    if(n){stopMoving();s.dialog=n;render();return;}
  }
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.map===TEMPLE_MAP&&(MAPS[TEMPLE_MAP].tiles[s.y]||'')[s.x]==='G'){
    stopMoving();s.map='town';s.x=8;s.y=2;s.dir='down';
    s.dialog={name:'王都アルディア',text:'北の神殿を出て、王都の通りへ戻った。'};
    return;
  }
  return baseCheckGate();
};

function decorateTemple(){
  if(s.screen!=='world'||s.map!==TEMPLE_MAP)return;
  const w=app.querySelector('.world');if(!w||w.querySelector('.lqTempleAltarVisual'))return;
  const altar=document.createElement('div');altar.className='lqTempleAltarVisual';altar.style.left=`${4.8*TS}px`;altar.style.top=`${1.05*TS}px`;w.appendChild(altar);
  const win=document.createElement('div');win.className='lqTempleWindowVisual';win.style.left=`${1.2*TS}px`;win.style.top=`${1.05*TS}px`;w.appendChild(win);
}
const baseWorld=world;world=function(){const r=baseWorld();decorateTemple();return r;};
const baseRender=render;render=function(){const r=baseRender();decorateTemple();return r;};

window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{aldiaNorthTemple:{entryMap:'town',map:TEMPLE_MAP,exitMap:'town',type:'temple'}});
window.LQ_NORTH_TEMPLE_STATUS={version:'1.0',map:TEMPLE_MAP,entry:{map:'town',x:ENTRY_X,y:ENTRY_Y},exit:{map:'town',x:8,y:2},walkable:true,attendantCount:1,crystalCount:1,propCount:1,rewardsAdded:false,healingAdded:false,protectedCanonChanged:false,canonicalAction:true};
if(s.screen==='world')decorateTemple();
})();
