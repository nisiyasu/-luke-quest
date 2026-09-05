(() => {
'use strict';

/* Collision-safe optional exploration: a small side clearing off the early forest, before the locked north frontier. */
MAPS.forestClearing={
 name:'魔物の森・木漏れ日の空地',w:11,h:9,
 tiles:['###########','#.........#','#.........#','#.........#','#.........#','#.........#','#.........#','#.........#','#####G#####'],
 npcs:[
  {x:2,y:2,e:'',name:'苔むした切り株',kind:'lqClearingStump',text:'古い切り株の年輪が何重にも重なっている。中央に小さな木の実が置かれていた。\nルーク「誰かの非常食……だったら食べない方がいいですね。」'},
  {x:8,y:2,e:'',name:'陽だまりの花',kind:'lqClearingFlowers',text:'木漏れ日が落ちる場所だけ、小さな白い花が輪のように咲いている。'},
  {x:3,y:6,e:'',name:'小動物の足跡',kind:'lqClearingTracks',text:'小さな足跡が茂みへ続いている。魔物のものではなさそうだ。\nルーク「こういう平和な足跡だけ追う仕事に転職したいです。」'},
  {x:7,y:5,e:'',name:'薬草の群生',kind:'lqClearingHerbs',text:'葉の形から見て、王都の店でも扱う薬草と同じ種類だ。'}
 ]
};
if(MAPS.forest&&!MAPS.forest.npcs.some(n=>n.kind==='lqForestClearingPath')){
 MAPS.forest.npcs.push({x:2,y:6,e:'',name:'木々のすき間',kind:'lqForestClearingPath',text:'木々の向こうに、少し明るい空間が見える。'});
}

const tileClassBase=tileClass;
tileClass=function(c){
 if(s.map==='forestClearing'){
  if(c==='#')return'wall lqClearingTreeWall';
  if(c==='G')return'gate lqClearingExitTile';
  return'lqClearingGround';
 }
 return tileClassBase(c);
};
const tileEmojiBase=tileEmoji;
tileEmoji=function(c){if(s.map==='forestClearing')return'';return tileEmojiBase(c);};
const npcClassBase=npcClass;
npcClass=function(n){
 if(n?.kind==='lqForestClearingPath')return'npc lqForestClearingPath';
 if(n?.kind==='lqClearingStump')return'npc lqClearingStump';
 if(n?.kind==='lqClearingFlowers')return'npc lqClearingFlowers';
 if(n?.kind==='lqClearingTracks')return'npc lqClearingTracks';
 if(n?.kind==='lqClearingHerbs')return'npc lqClearingHerbs';
 return npcClassBase(n);
};
const style=document.createElement('style');
style.textContent=`
.tile.lqClearingGround{background:radial-gradient(circle at 22% 30%,#89a85d 0 2px,transparent 3px),radial-gradient(circle at 70% 72%,#769653 0 2px,transparent 3px),linear-gradient(135deg,#6e8e4f,#577643);box-shadow:inset 0 1px #d6df9e1f}.tile.lqClearingTreeWall{background:radial-gradient(circle at 28% 32%,#496d3d 0 13px,transparent 14px),radial-gradient(circle at 70% 28%,#315b36 0 15px,transparent 16px),linear-gradient(#294c31,#1d3926);box-shadow:inset 0 -8px #11251a99}.tile.lqClearingExitTile{background:linear-gradient(#6b8b4c,#435f39);box-shadow:inset 0 0 0 3px #c7d28d33}
.lqForestClearingPath{width:43px;height:43px;font-size:0;border-radius:50% 50% 16px 16px;background:radial-gradient(circle at 30% 30%,#557a45 0 12px,transparent 13px),radial-gradient(circle at 70% 28%,#426b3e 0 14px,transparent 15px),linear-gradient(#315735,#1e3927);filter:drop-shadow(0 5px 4px #0008)}.lqForestClearingPath:after{content:'';position:absolute;left:15px;right:15px;bottom:-5px;height:23px;background:linear-gradient(#7b6843,#51472f);clip-path:polygon(35% 0,65% 0,100% 100%,0 100%)}
.lqClearingStump,.lqClearingFlowers,.lqClearingTracks,.lqClearingHerbs{width:40px;height:40px;font-size:0;filter:drop-shadow(0 4px 4px #0006)}.lqClearingStump{border-radius:50% 50% 35% 35%;background:radial-gradient(circle at 50% 30%,#b7905d 0 7px,#75583d 8px 13px,#4c382a 14px);border:2px solid #4c3829}.lqClearingFlowers{background:radial-gradient(circle at 20% 35%,#fff6d3 0 4px,transparent 5px),radial-gradient(circle at 50% 18%,#f5efcf 0 4px,transparent 5px),radial-gradient(circle at 75% 42%,#fff7d8 0 4px,transparent 5px),linear-gradient(transparent 0 55%,#61794a 56%)}.lqClearingTracks{background:radial-gradient(ellipse at 35% 38%,#524737 0 4px,transparent 5px),radial-gradient(ellipse at 61% 58%,#524737 0 4px,transparent 5px),radial-gradient(ellipse at 45% 78%,#524737 0 3px,transparent 4px)}.lqClearingHerbs{border-radius:50% 50% 10px 10px;background:radial-gradient(ellipse at 28% 45%,#7eb165 0 9px,transparent 10px),radial-gradient(ellipse at 66% 38%,#6aa157 0 10px,transparent 11px),radial-gradient(ellipse at 52% 68%,#527d46 0 10px,transparent 11px)}
.lqClearingSunbeam{position:absolute;z-index:2;width:180px;height:220px;transform:skewX(-16deg);background:linear-gradient(100deg,transparent,#fff6bd24,transparent);filter:blur(2px);pointer-events:none;animation:lqClearingBeam 3.2s ease-in-out infinite alternate}.lqClearingButterfly{position:absolute;z-index:4;width:7px;height:5px;border-radius:50%;background:#f1d988;box-shadow:7px 0 #e9a7b5;pointer-events:none;animation:lqButterfly 4s ease-in-out infinite}.lqClearingButterfly.b{animation-delay:-2s;transform:scale(.8)}
@keyframes lqClearingBeam{from{opacity:.5}to{opacity:1}}@keyframes lqButterfly{0%,100%{translate:0 0}30%{translate:22px -15px}60%{translate:-10px -26px}80%{translate:16px -8px}}@media(prefers-reduced-motion:reduce){.lqClearingSunbeam,.lqClearingButterfly{animation:none}}
`;
document.head.appendChild(style);
function frontNpc(){if(s.screen!=='world')return null;const p=front();return currentNpcs().find(n=>n.x===p.x&&n.y===p.y)||null;}
function enterClearing(){stopMoving();s.map='forestClearing';s.x=5;s.y=7;s.dir='up';s.dialog={name:'木々のすき間',text:'枝をかき分けると、森の中に小さな陽だまりが開けていた。\nルーク「魔物の森にも、休憩所みたいな場所あるんですね。」'};render();}
const actionBase=action;action=function(){if(!s.dialog&&s.map==='forest'&&frontNpc()?.kind==='lqForestClearingPath')return enterClearing();return actionBase();};
const checkGateBase=checkGate;checkGate=function(){if(s.map==='forestClearing'&&(MAPS.forestClearing.tiles[s.y]||'')[s.x]==='G'){stopMoving();s.map='forest';s.x=2;s.y=7;s.dir='up';s.dialog={name:'魔物の森・入口',text:'木々のすき間を抜け、元の森道へ戻った。'};return;}return checkGateBase();};
function decorate(){if(s.screen!=='world'||s.map!=='forestClearing')return;const w=app.querySelector('.world');if(!w)return;if(!w.querySelector('.lqClearingSunbeam')){const b=document.createElement('div');b.className='lqClearingSunbeam';b.style.left=`${4*TS}px`;b.style.top=`${.6*TS}px`;w.appendChild(b);for(const [i,x,y] of [[0,2.8,3.2],[1,7.2,2.8]]){const f=document.createElement('i');f.className='lqClearingButterfly'+(i?' b':'');f.style.left=`${x*TS}px`;f.style.top=`${y*TS}px`;w.appendChild(f);}}}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};const renderBase=render;render=function(){const r=renderBase();decorate();return r;};
window.LQ_OPTIONAL_AREAS=Object.assign({},window.LQ_OPTIONAL_AREAS,{forestClearing:{entryMap:'forest',exitMap:'forest',spoilerSafe:true}});if(s.screen==='world')decorate();
})();