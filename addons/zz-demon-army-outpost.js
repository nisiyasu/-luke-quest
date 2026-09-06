(() => {
'use strict';

/* REQ-033 — optional abandoned Demon Army observation outpost.
   Player-visible military-world capability only: no main-story flags and no
   protected-canon exposition. Loaded after the highland add-on so its entry
   can intentionally intercept the generic highland NPC interaction wrapper. */
const HIGH='aldiaHighlandTrail';
const OUTPOST='abandonedDemonArmyOutpost';
const ENTRY_X=16,ENTRY_Y=13;
const RETURN_X=15,RETURN_Y=13;

if(!MAPS[HIGH])return;

MAPS[OUTPOST]={
  name:'高地・放棄された魔王軍監視所',w:16,h:12,
  tiles:[
    '################',
    '#..............#',
    '#..####..####..#',
    '#..#........#..#',
    '#..#........#..#',
    '#..............#',
    '#....######....#',
    '#..............#',
    '#..#........#..#',
    '#..####..####..#',
    '#..............#',
    '#######GG#######'
  ],
  npcs:[
    {x:4,y:4,e:'',name:'古い監視地図',kind:'lqDemonOutpostMap',text:'王都と街道の位置だけを粗く刻んだ古い監視地図。細かな作戦指示は残っていない。\nルーク「見られてた側だと思うと、景色の良さが急に落ち着かないですね。」'},
    {x:11,y:4,e:'',name:'空の兵站棚',kind:'lqDemonOutpostSupply',text:'棚はほとんど空だ。乾いた紐と割れた木箱だけが残り、補給品はずっと前に撤去されたらしい。'},
    {x:4,y:8,e:'',name:'壊れた信号灯',kind:'lqDemonOutpostSignal',text:'黒鉄の枠に青白いガラス片が残る信号灯。芯は抜かれ、もう点火できない。'},
    {x:11,y:8,e:'',name:'高地を望む監視窓',kind:'lqDemonOutpostWindow',text:'細い監視窓から王都近郊の街道が遠く見える。ここが地形観測に向いた場所だったことだけは分かる。'},
    {x:8,y:2,e:'',name:'剥がされた勤務札',kind:'lqDemonOutpostRoster',text:'壁に勤務札の跡だけが残っている。名前も部隊名も剥がされ、誰が使っていた施設かまでは分からない。'}
  ]
};

if(!MAPS[HIGH].npcs.some(n=>n.kind==='lqDemonOutpostEntrance')){
  MAPS[HIGH].npcs.push({x:ENTRY_X,y:ENTRY_Y,e:'',name:'黒鉄の脇道標',kind:'lqDemonOutpostEntrance',text:'高地の岩陰へ続く、黒鉄で補強された古い脇道。抽象的な角型の紋だけが残っている。'});
}

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===OUTPOST){
    if(c==='#')return'wall lqDemonOutpostWall';
    if(c==='G')return'gate lqDemonOutpostExit';
    return'floor lqDemonOutpostFloor';
  }
  return baseTileClass(c);
};
const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===OUTPOST)return'';return baseTileEmoji(c);};
const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqDemonOutpostEntrance')return'npc lqDemonOutpostEntrance';
  if(n?.kind?.startsWith('lqDemonOutpost'))return'npc lqDemonOutpostProp';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqDemonOutpostFloor{background:linear-gradient(135deg,#454a50 0 46%,#353a40 47% 53%,#4d5157 54%);box-shadow:inset 0 1px #d7e5f315}.tile.lqDemonOutpostWall{background:linear-gradient(#343940,#20252c 65%,#15191e);box-shadow:inset 0 -9px #090c10cc,inset 4px 0 #56606a22}.tile.lqDemonOutpostExit{background:linear-gradient(#54483b,#302a25);box-shadow:inset 0 0 0 3px #8496a655}
.lqDemonOutpostEntrance{width:44px;height:46px;font-size:0;background:linear-gradient(135deg,transparent 0 18%,#30363c 19% 80%,transparent 81%);border-bottom:4px solid #181c20;filter:drop-shadow(0 5px 5px #000a)}.lqDemonOutpostEntrance:before{content:'';position:absolute;left:7px;top:4px;width:28px;height:30px;border:3px solid #78828c;border-radius:4px;clip-path:polygon(50% 0,100% 30%,82% 100%,18% 100%,0 30%)}.lqDemonOutpostEntrance:after{content:'◆';position:absolute;left:14px;top:10px;color:#7ea2b4;font-size:15px;text-shadow:0 0 6px #74b8d488}
.lqDemonOutpostProp{width:40px;height:38px;font-size:0;border:2px solid #65717c;border-radius:5px;background:linear-gradient(145deg,#414950,#252b31);box-shadow:0 5px 8px #0008,inset 0 0 0 2px #11171c}.lqDemonOutpostProp:after{content:'◇';position:absolute;right:3px;top:1px;color:#89afbf;font-size:10px;text-shadow:0 0 5px #78bdd055}
.lqDemonOutpostBanner{position:absolute;z-index:2;width:48px;height:72px;background:linear-gradient(90deg,#1b242d,#334451,#1b242d);clip-path:polygon(0 0,100% 0,100% 82%,50% 100%,0 82%);border-top:3px solid #6f7c86;box-shadow:0 7px 10px #0009;pointer-events:none}.lqDemonOutpostBanner:after{content:'◆';position:absolute;left:14px;top:19px;color:#789bab;font-size:20px;opacity:.72}.lqDemonOutpostTable{position:absolute;z-index:3;width:88px;height:48px;border:4px solid #22282d;border-radius:4px;background:linear-gradient(#4e4840,#302d2a);box-shadow:0 7px 9px #0009;pointer-events:none}.lqDemonOutpostRack{position:absolute;z-index:3;width:76px;height:66px;border:3px solid #343b41;background:repeating-linear-gradient(90deg,#252c32 0 9px,#66727b 9px 12px,#1c2227 12px 21px);box-shadow:0 6px 9px #0009;pointer-events:none}.lqDemonOutpostColdLight{position:absolute;z-index:2;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,#7bc0d52d 0 18%,#6aa8bf16 40%,transparent 70%);filter:blur(2px);pointer-events:none}
`;
document.head.appendChild(style);

function outpostAhead(){
  if(s.screen!=='world'||s.map!==OUTPOST)return null;
  const p=front();
  return MAPS[OUTPOST].npcs.find(n=>n.x===p.x&&n.y===p.y)||null;
}
function enterOutpost(){
  stopMoving();
  s.map=OUTPOST;s.x=7;s.y=10;s.dir='up';
  s.dialog={name:'放棄された魔王軍監視所',text:'岩陰の通路を抜けると、冷えた石造りの監視所へ出た。人の気配はなく、古い黒鉄だけが残っている。\nルーク「“放棄済み”って文字、入口に大きく書いておいてほしいです。」'};
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'&&s.map===HIGH){
    const p=front();
    const n=(MAPS[HIGH].npcs||[]).find(q=>q.x===p.x&&q.y===p.y);
    if(n?.kind==='lqDemonOutpostEntrance')return enterOutpost();
  }
  if(!s.dialog&&s.screen==='world'&&s.map===OUTPOST){
    const n=outpostAhead();
    if(n){stopMoving();s.dialog=n;render();return;}
  }
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.map===OUTPOST&&s.y===11&&((MAPS[OUTPOST].tiles[s.y]||'')[s.x]==='G')){
    stopMoving();
    s.map=HIGH;s.x=RETURN_X;s.y=RETURN_Y;s.dir='right';
    s.dialog={name:'王都近郊・高地の登山道',text:'古い監視所を出て、高地の登山道へ戻った。外の風が妙に明るく感じる。'};
    return;
  }
  return baseCheckGate();
};

function decorate(){
  if(s.screen!=='world'||s.map!==OUTPOST)return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqDemonOutpostColdLight'))return;
  for(const [x,y] of [[1.3,1.5],[12.1,1.5]]){const l=document.createElement('div');l.className='lqDemonOutpostColdLight';l.style.left=`${x*TS}px`;l.style.top=`${y*TS}px`;w.appendChild(l);}
  for(const [x,y] of [[1.7,3.2],[12.7,3.2]]){const b=document.createElement('div');b.className='lqDemonOutpostBanner';b.style.left=`${x*TS}px`;b.style.top=`${y*TS}px`;w.appendChild(b);}
  const table=document.createElement('div');table.className='lqDemonOutpostTable';table.style.left=`${6.8*TS}px`;table.style.top=`${4.8*TS}px`;w.appendChild(table);
  const rack=document.createElement('div');rack.className='lqDemonOutpostRack';rack.style.left=`${6.9*TS}px`;rack.style.top=`${7.0*TS}px`;w.appendChild(rack);
}
const baseWorld=world;
world=function(){const r=baseWorld();decorate();return r;};
const baseRender=render;
render=function(){const r=baseRender();decorate();return r;};

window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{abandonedDemonArmyOutpost:{entryMap:HIGH,map:OUTPOST,exitMap:HIGH,type:'demon-army-facility'}});
window.LQ_DEMON_ARMY_OUTPOST_STATUS={version:'1.0',map:OUTPOST,entryMap:HIGH,entry:[ENTRY_X,ENTRY_Y],spawn:[7,10],returnSpawn:[RETURN_X,RETURN_Y],interactionCount:5,mainStoryFlagsAdded:0,protectedCanonChanged:false,occupied:false,iosPhysicalVerification:'PENDING'};
})();
