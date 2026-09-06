(() => {
'use strict';

/* REQ-030 — optional highland trail near Aldia. No protected canon or required story flags. */
const FIELD='field';
const HIGH='aldiaHighlandTrail';
const TRAIL_X=19,TRAIL_Y=14;
if(!MAPS[FIELD])return;

MAPS[HIGH]={
  name:'王都近郊・高地の登山道',w:20,h:16,
  tiles:[
    '#########^^#########',
    '#....^^^.....^^^...#',
    '#...^^^^.....^^^^..#',
    '#....^^.......^^...#',
    '#..................#',
    '#..####......####..#',
    '#..#............#..#',
    '#..#....^^^^....#..#',
    '#.......^^^^.......#',
    '#..^^....^^....^^..#',
    '#..^^..........^^..#',
    '#......####........#',
    '#......#..#........#',
    '#......####........#',
    '#..................#',
    '#########GG#########'
  ],
  npcs:[
    {x:4,y:4,e:'',name:'古い登山道標',kind:'lqHighlandSign',text:'風化した道標に「王都近郊高地・旧見張り道」とだけ読める文字が残っている。\nルーク「“旧”って書いてある道、だいたい現役より不安なんですよね。」'},
    {x:15,y:4,e:'',name:'石積みのケルン',kind:'lqHighlandCairn',text:'旅人が積んだらしい石が崩れず残っている。風の強い高地で、道を見失わないための目印だ。'},
    {x:5,y:10,e:'',name:'王都を望む崖際',kind:'lqHighlandView',text:'眼下に王都の城壁と屋根が小さく見える。森へ続く街道も一本の線のようだ。\nルーク「帰る場所が見える景色、僕はかなり好きです。」'},
    {x:14,y:10,e:'',name:'古い安全ロープ',kind:'lqHighlandRope',text:'岩杭に結ばれた古いロープ。毛羽立っていて、体重を預けるには少し心細い。'},
    {x:9,y:1,e:'',name:'崩れた尾根道',kind:'lqHighlandBoundary',text:'先の尾根は大きく崩れ、足場が途切れている。強い風が岩の隙間を抜けていく。\nルーク「これは勇気じゃなくて足場の問題です。戻りましょう。」'}
  ]
};

if(!MAPS[FIELD].npcs.some(n=>n.kind==='lqHighlandTrailhead')){
  MAPS[FIELD].npcs.push({x:TRAIL_X,y:TRAIL_Y,e:'',name:'高地への登山口',kind:'lqHighlandTrailhead',text:'王都近郊の東側へ伸びる古い登山道。岩肌の向こうから強い風が吹いている。'});
}

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===HIGH){
    if(c==='#')return'wall lqHighlandCliff';
    if(c==='^')return'wall lqHighlandRock';
    if(c==='G')return'gate lqHighlandExit';
    return'floor lqHighlandPath';
  }
  return baseTileClass(c);
};
const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===HIGH)return'';return baseTileEmoji(c);};
const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqHighlandTrailhead')return'npc lqHighlandTrailhead';
  if(n?.kind==='lqHighlandSign')return'npc lqHighlandSign';
  if(n?.kind==='lqHighlandCairn')return'npc lqHighlandCairn';
  if(n?.kind==='lqHighlandView')return'npc lqHighlandView';
  if(n?.kind==='lqHighlandRope')return'npc lqHighlandRope';
  if(n?.kind==='lqHighlandBoundary')return'npc lqHighlandBoundary';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqHighlandPath{background:radial-gradient(circle at 25% 25%,#8c876f 0 7%,transparent 8%),linear-gradient(135deg,#777661,#5f604f 58%,#4d5146);box-shadow:inset 0 1px #fff2}.tile.lqHighlandCliff{background:linear-gradient(145deg,#69695f,#454941 58%,#2c302d);box-shadow:inset 0 -11px #171a18bb}.tile.lqHighlandRock{background:linear-gradient(135deg,#7f7e72,#555950 55%,#353a36);box-shadow:inset 0 -7px #222622aa,0 2px 0 #9c9a8955}.tile.lqHighlandExit{background:linear-gradient(#8c7655,#5c4d38);box-shadow:inset 0 0 0 3px #e7d09d44}
.lqHighlandTrailhead{width:46px;height:44px;font-size:0;background:linear-gradient(145deg,transparent 18%,#66685d 19% 39%,#373c36 40% 70%,transparent 71%);filter:drop-shadow(0 5px 5px #000a)}.lqHighlandTrailhead:after{content:'';position:absolute;left:5px;right:5px;bottom:3px;height:8px;border-top:3px dashed #c9b98a;transform:rotate(-12deg)}
.lqHighlandSign{width:38px;height:43px;font-size:0}.lqHighlandSign:before{content:'';position:absolute;left:17px;top:13px;width:5px;height:28px;background:#4d3c2b}.lqHighlandSign:after{content:'→';position:absolute;left:2px;top:1px;width:33px;height:18px;background:#75583b;border:2px solid #b99a66;color:#e7d9b6;font-size:15px;line-height:15px;text-align:center}
.lqHighlandCairn{width:40px;height:40px;font-size:0;background:radial-gradient(ellipse at 50% 75%,#77766c 0 22%,transparent 24%),radial-gradient(ellipse at 46% 54%,#989486 0 20%,transparent 22%),radial-gradient(ellipse at 52% 31%,#b0aa99 0 17%,transparent 19%);filter:drop-shadow(0 5px 4px #0008)}
.lqHighlandView{width:42px;height:38px;font-size:0;border-bottom:5px solid #6a6554;background:linear-gradient(#9ed0df55,#d9e9e755 55%,transparent 56%);box-shadow:0 0 12px #bcecff33}.lqHighlandView:after{content:'⌄';position:absolute;left:12px;top:4px;color:#e6f4f6;font-size:22px;text-shadow:0 2px 4px #000}
.lqHighlandRope{width:42px;height:38px;font-size:0}.lqHighlandRope:after{content:'';position:absolute;left:2px;right:2px;top:18px;height:5px;background:repeating-linear-gradient(90deg,#c2a36f 0 7px,#785f3e 7px 11px);transform:rotate(-16deg);box-shadow:0 2px 4px #0008}
.lqHighlandBoundary{width:46px;height:42px;font-size:0;background:linear-gradient(150deg,#707066 0 31%,transparent 32%),linear-gradient(30deg,#55594f 0 43%,transparent 44%);filter:drop-shadow(0 6px 5px #000a)}.lqHighlandBoundary:after{content:'!';position:absolute;right:2px;top:-4px;color:#e3cb7b;font-size:17px;text-shadow:0 2px 4px #000}
.lqHighlandCloud{position:absolute;z-index:2;width:150px;height:46px;border-radius:50%;background:radial-gradient(ellipse,#e8f3f58a 0 28%,#cfe0e34f 46%,transparent 70%);filter:blur(1px);pointer-events:none;animation:lqCloudDrift 8s infinite alternate ease-in-out}@keyframes lqCloudDrift{from{transform:translateX(-16px)}to{transform:translateX(20px)}}
.lqHighlandWind{position:absolute;z-index:4;width:96px;height:18px;border-top:2px solid #d9edf066;border-radius:50%;pointer-events:none;animation:lqWindSweep 2.8s infinite ease-in-out}@keyframes lqWindSweep{0%{opacity:0;transform:translateX(-25px)}45%{opacity:.8}100%{opacity:0;transform:translateX(35px)}}
.lqHighlandPine{position:absolute;z-index:3;width:44px;height:88px;background:linear-gradient(90deg,transparent 44%,#4b3b2d 45% 55%,transparent 56%);pointer-events:none}.lqHighlandPine:before{content:'';position:absolute;left:2px;top:0;width:40px;height:68px;background:linear-gradient(#315b45,#1f4533);clip-path:polygon(50% 0,100% 100%,0 100%);filter:drop-shadow(0 6px 5px #0008)}
`;
document.head.appendChild(style);

function highAhead(){
  if(s.screen!=='world'||s.map!==HIGH)return null;
  const p=front();
  return MAPS[HIGH].npcs.find(n=>n.x===p.x&&n.y===p.y)||null;
}
function enterHighland(){
  stopMoving();s.map=HIGH;s.x=9;s.y=14;s.dir='up';
  s.dialog={name:'王都近郊・高地の登山道',text:'登山道へ入ると、平地より一段強い風が頬を抜けた。遠くに王都の屋根が見える。\nルーク「景色は最高です。問題は、帰りも自分の足だということですね。」'};
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'&&s.map===FIELD){
    const p=front();
    const n=MAPS[FIELD].npcs.find(x=>x.x===p.x&&x.y===p.y);
    if(n?.kind==='lqHighlandTrailhead')return enterHighland();
  }
  if(!s.dialog&&s.screen==='world'&&s.map===HIGH){
    const n=highAhead();
    if(n){stopMoving();s.dialog=n;render();return;}
  }
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.map===HIGH&&s.y===15&&((MAPS[HIGH].tiles[s.y]||'')[s.x]==='G')){
    stopMoving();s.map=FIELD;s.x=18;s.y=14;s.dir='right';
    s.dialog={name:'王都近郊',text:'高地の登山道を下り、王都近郊へ戻った。平地の風がずいぶん穏やかに感じる。'};
    return;
  }
  return baseCheckGate();
};

function decorate(){
  if(s.screen!=='world'||s.map!==HIGH)return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqHighlandCloud'))return;
  for(const [x,y] of [[2.0,2.0],[14.9,6.7]]){const c=document.createElement('div');c.className='lqHighlandCloud';c.style.left=`${x*TS}px`;c.style.top=`${y*TS}px`;w.appendChild(c);}
  for(const [x,y,d] of [[5.0,5.0,'0s'],[11.2,8.2,'.9s'],[7.1,12.2,'1.6s']]){const wind=document.createElement('div');wind.className='lqHighlandWind';wind.style.left=`${x*TS}px`;wind.style.top=`${y*TS}px`;wind.style.animationDelay=d;w.appendChild(wind);}
  for(const [x,y] of [[1.3,9.4],[16.1,11.0]]){const p=document.createElement('div');p.className='lqHighlandPine';p.style.left=`${x*TS}px`;p.style.top=`${y*TS}px`;w.appendChild(p);}
}
const baseWorld=world;
world=function(){const r=baseWorld();decorate();return r;};
const baseRender=render;
render=function(){const r=baseRender();decorate();return r;};

window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{aldiaHighlandTrail:{entryMap:FIELD,map:HIGH,exitMap:FIELD,type:'mountain-trail'}});
window.LQ_HIGHLAND_TRAIL_STATUS={version:'1.0',map:HIGH,entry:[TRAIL_X,TRAIL_Y],spawn:[9,14],interactionCount:5,storyFlagsAdded:0,protectedCanonChanged:false,iosPhysicalVerification:'PENDING'};
})();
