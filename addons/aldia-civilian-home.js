(() => {
'use strict';

/* REQ-024 — a walkable civilian home in Aldia.
   Self-contained content add-on. No protected-canon reveal, rewards or changes
   to existing town collision/gates beyond one clearly visible home doorway. */

const HOME_MAP='aldiaHomeInterior';
const ENTRY_X=12,ENTRY_Y=5;

MAPS[HOME_MAP]={
  name:'王都アルディア・民家',w:10,h:9,
  tiles:[
    '##########',
    '#........#',
    '#........#',
    '#........#',
    '#........#',
    '#........#',
    '#........#',
    '#........#',
    '####GG####'
  ],
  npcs:[
    {x:6,y:3,e:'',name:'暮らし上手のリナ',kind:'lqCivilianResident',text:'朝から町じゅうレオン様の話でもちきりよ。勇者候補だって、逃げたくなる日はあるのね。\nルーク「その発言、今の僕には効きすぎます。」'},
    {x:2,y:2,e:'',name:'きちんと整えた寝台',kind:'lqCivilianHomeProp',text:'小さな寝台。毛布の端までぴっちり揃っている。\nルーク「ここ、冒険より圧倒的に安全そうですね……。」'},
    {x:7,y:2,e:'',name:'家計帳の棚',kind:'lqCivilianHomeProp',text:'薪、パン、灯油。細かな支出が几帳面に書かれている。勇者の冒険には出てこない、王都の毎日だ。'},
    {x:2,y:5,e:'',name:'煮込み鍋',kind:'lqCivilianHomeProp',text:'火を落としたばかりの鍋から、野菜と香草の匂いがする。\nルーク「世界を救う前に、これを一杯いただく案はありません？」'},
    {x:7,y:5,e:'',name:'南門を描いた小さな絵',kind:'lqCivilianHomeProp',text:'子どもの筆跡で、王都の南門と青い空が描かれている。壁の隅に大切そうに飾られている。'}
  ]
};

if(MAPS.town&&!MAPS.town.npcs.some(n=>n.kind==='lqCivilianHomeDoor')){
  MAPS.town.npcs.push({x:ENTRY_X,y:ENTRY_Y,e:'',name:'住宅街の木戸',kind:'lqCivilianHomeDoor',text:'東側の民家の玄関。小さな灯りがともっている。'});
}

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===HOME_MAP){
    if(c==='#')return'wall lqHomeWall';
    if(c==='G')return'gate lqHomeDoorTile';
    return'lqHomeFloor';
  }
  return baseTileClass(c);
};

const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===HOME_MAP)return'';return baseTileEmoji(c);};

const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqCivilianHomeDoor')return'npc lqCivilianHomeDoor';
  if(n?.kind==='lqCivilianResident')return'npc lqCivilianResident';
  if(n?.kind==='lqCivilianHomeProp')return'npc lqCivilianHomeProp';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqHomeFloor{background:repeating-linear-gradient(90deg,#aa825b 0 22px,#906a48 22px 24px);box-shadow:inset 0 1px #efd0a32e}.tile.lqHomeWall{background:linear-gradient(#715c46,#4f4033 68%,#332a23);box-shadow:inset 0 -7px #201a1699}.tile.lqHomeDoorTile{background:linear-gradient(#bc8c58,#745137);box-shadow:inset 0 0 0 3px #f1ce8d55}
.lqCivilianHomeDoor{width:38px;height:44px;font-size:0;background:linear-gradient(90deg,#694126,#865636 48%,#5b351f 49%);border:3px solid #c19058;border-radius:4px;box-shadow:inset 0 0 0 2px #352014,0 5px 8px #0007}.lqCivilianHomeDoor:before{content:'';position:absolute;right:6px;top:20px;width:5px;height:5px;border-radius:50%;background:#f5d574;box-shadow:0 0 8px #ffd873}.lqCivilianHomeDoor:after{content:'';position:absolute;left:13px;top:-12px;width:12px;height:9px;border-radius:50% 50% 35% 35%;background:#ffd56d;box-shadow:0 0 12px #ffc74d}
.lqCivilianResident{width:40px;height:43px;font-size:0;border-radius:13px 13px 7px 7px;background:linear-gradient(#60402e 0 24%,#d7b18f 25% 47%,#5e718d 48% 100%);border:2px solid #d1aa76;box-shadow:0 5px 8px #0007}.lqCivilianResident:before{content:'';position:absolute;left:9px;top:4px;width:20px;height:14px;border-radius:50% 50% 35% 35%;background:#583525}.lqCivilianResident:after{content:'…';position:absolute;right:-7px;top:-12px;color:#fff7d3;font-size:15px;text-shadow:0 2px 4px #000}
.lqCivilianHomeProp{width:40px;height:38px;font-size:0;background:linear-gradient(145deg,#8a6849,#4f3b2d);border:2px solid #b99669;border-radius:7px;box-shadow:0 4px 7px #0006}.lqCivilianHomeProp:after{content:'✦';position:absolute;right:3px;top:1px;color:#f2d890;font-size:9px}
.lqHomeBedVisual{position:absolute;z-index:3;width:96px;height:62px;border:4px solid #715038;border-radius:7px;background:linear-gradient(#f1e4c8 0 28%,#7c6b8d 29% 100%);box-shadow:0 7px 11px #0006;pointer-events:none}.lqHomeBedVisual:before{content:'';position:absolute;left:7px;top:6px;width:38px;height:16px;border-radius:7px;background:#fff8e8;box-shadow:inset 0 -3px #d7cab3}
.lqHomeTableVisual{position:absolute;z-index:3;width:82px;height:54px;border-radius:50%;background:radial-gradient(circle at 50% 42%,#b88858,#795137 70%);border:4px solid #543723;box-shadow:0 8px 10px #0007;pointer-events:none}.lqHomeTableVisual:after{content:'';position:absolute;left:31px;top:14px;width:20px;height:14px;border-radius:50%;background:#d6b36d;box-shadow:0 0 0 2px #715139}
.lqHomeWindowVisual{position:absolute;z-index:2;width:68px;height:45px;border:5px solid #674a34;background:linear-gradient(160deg,#91bed0,#d8e4dc 55%,#839eac 56%);box-shadow:inset 0 0 0 2px #e5c985,0 4px 8px #0005;pointer-events:none}.lqHomeWindowVisual:before{content:'';position:absolute;left:50%;top:0;bottom:0;width:3px;background:#65472f}.lqHomeWindowVisual:after{content:'';position:absolute;left:0;right:0;top:50%;height:3px;background:#65472f}
`;
document.head.appendChild(style);

function frontNpc(){
  if(s.screen!=='world')return null;
  const p=front();
  return currentNpcs().find(n=>n.x===p.x&&n.y===p.y)||null;
}

function enterHome(){
  stopMoving();
  s.map=HOME_MAP;s.x=4;s.y=6;s.dir='up';
  s.dialog={name:'王都アルディア・民家',text:'木戸を開けると、香草と薪の匂いがする小さな家だった。\nルーク「こういう普通の家を見ると、王都にもちゃんと生活があるんだなって思いますね。」'};
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.map==='town'&&frontNpc()?.kind==='lqCivilianHomeDoor')return enterHome();
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.map===HOME_MAP&&(MAPS[HOME_MAP].tiles[s.y]||'')[s.x]==='G'){
    stopMoving();
    s.map='town';s.x=12;s.y=6;s.dir='down';
    s.dialog={name:'王都アルディア',text:'民家を出て、住宅街へ戻った。'};
    return;
  }
  return baseCheckGate();
};

function decorateHome(){
  if(s.screen!=='world'||s.map!==HOME_MAP)return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqHomeBedVisual'))return;
  const bed=document.createElement('div');bed.className='lqHomeBedVisual';bed.style.left=`${1.05*TS}px`;bed.style.top=`${1.15*TS}px`;w.appendChild(bed);
  const table=document.createElement('div');table.className='lqHomeTableVisual';table.style.left=`${5.15*TS}px`;table.style.top=`${4.65*TS}px`;w.appendChild(table);
  const win=document.createElement('div');win.className='lqHomeWindowVisual';win.style.left=`${5.95*TS}px`;win.style.top=`${1.05*TS}px`;w.appendChild(win);
}

const baseWorld=world;
world=function(){const r=baseWorld();decorateHome();return r;};
const baseRender=render;
render=function(){const r=baseRender();decorateHome();return r;};

window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{aldiaCivilianHome:{entryMap:'town',map:HOME_MAP,exitMap:'town',type:'civilian-home'}});
window.LQ_CIVILIAN_HOME_STATUS={version:'1.0',map:HOME_MAP,entry:{map:'town',x:ENTRY_X,y:ENTRY_Y},residentCount:1,propCount:4,rewardsAdded:false,protectedCanonChanged:false,walkable:true};
if(s.screen==='world')decorateHome();
})();
