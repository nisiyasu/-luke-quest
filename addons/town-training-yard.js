(() => {
'use strict';

/* Collision-safe optional town content: a walkable training yard with readable practice props. */
MAPS.trainingYard={
 name:'王都・訓練場',w:12,h:10,
 tiles:['############','#..........#','#..........#','#..........#','#..........#','#..........#','#..........#','#..........#','#..........#','#####GG#####'],
 npcs:[
  {x:3,y:2,e:'',name:'木製の訓練人形',kind:'lqTrainingDummy',text:'何度も打たれた木製人形。胴には白いチョークで「まず構え」と書かれている。\nルーク「まず帰る、ではだめですよね。」'},
  {x:8,y:2,e:'',name:'盾受けの杭',kind:'lqTrainingShield',text:'盾で受ける練習用の杭。革帯には「攻撃を全部受けるな」と注意書きがある。'},
  {x:2,y:6,e:'',name:'足運びの印',kind:'lqTrainingMarks',text:'地面に左右の足型が何列も描かれている。実戦では止まらないこと、とある。'},
  {x:9,y:6,e:'',name:'訓練記録板',kind:'lqTrainingBoard',text:'新人兵の訓練記録がびっしり並んでいる。\nルーク「みんな毎日やってる……。勇者って急に任命される制度で大丈夫なんですか？」'},
  {x:6,y:4,e:'',name:'訓練教官ベルド',kind:'lqTrainingMaster',text:'「勇者でも基本は同じだ。殴る、受ける、危なければ薬草。格好つけて倒れるな。」\nルーク「最後だけすごく僕向けです。」'}
 ]
};
if(MAPS.town&&!MAPS.town.npcs.some(n=>n.kind==='lqTrainingYardGate')){
 MAPS.town.npcs.push({x:15,y:6,e:'',name:'王都訓練場の門',kind:'lqTrainingYardGate',text:'兵士たちが使う小さな訓練場。門は開いている。'});
}

const tileClassBase=tileClass;
tileClass=function(c){if(s.map==='trainingYard'){if(c==='#')return'wall lqTrainingWall';if(c==='G')return'gate lqTrainingGateTile';return'lqTrainingGround';}return tileClassBase(c);};
const tileEmojiBase=tileEmoji;tileEmoji=function(c){if(s.map==='trainingYard')return'';return tileEmojiBase(c);};
const npcClassBase=npcClass;
npcClass=function(n){
 if(n?.kind==='lqTrainingYardGate')return'npc lqTrainingYardGate';
 if(n?.kind==='lqTrainingDummy')return'npc lqTrainingDummy';
 if(n?.kind==='lqTrainingShield')return'npc lqTrainingShield';
 if(n?.kind==='lqTrainingMarks')return'npc lqTrainingMarks';
 if(n?.kind==='lqTrainingBoard')return'npc lqTrainingBoard';
 if(n?.kind==='lqTrainingMaster')return'npc lqTrainingMaster';
 return npcClassBase(n);
};
const style=document.createElement('style');style.textContent=`
.tile.lqTrainingGround{background:radial-gradient(circle at 25% 30%,#89755b 0 2px,transparent 3px),radial-gradient(circle at 72% 68%,#705f4c 0 2px,transparent 3px),linear-gradient(#8b775c,#6c5b48);box-shadow:inset 0 1px #d9c79b2b}.tile.lqTrainingWall{background:linear-gradient(#7c5d43 0 25%,#4f4439 26% 100%);box-shadow:inset 0 -8px #2d2722aa}.tile.lqTrainingGateTile{background:linear-gradient(#a08058,#695039);box-shadow:inset 0 0 0 3px #d1b27a44}
.lqTrainingYardGate{width:46px;height:43px;font-size:0;border:3px solid #705740;border-radius:5px;background:repeating-linear-gradient(90deg,#86694d 0 7px,#4e3b2e 8px 11px);box-shadow:0 5px 7px #0007}.lqTrainingYardGate:after{content:'訓練場';position:absolute;left:50%;top:-16px;transform:translateX(-50%);white-space:nowrap;padding:2px 5px;border-radius:4px;background:#45372b;color:#f0dca8;border:1px solid #b0925e;font-size:8px;font-weight:900}
.lqTrainingDummy,.lqTrainingShield,.lqTrainingMarks,.lqTrainingBoard,.lqTrainingMaster{width:40px;height:40px;font-size:0;filter:drop-shadow(0 4px 4px #0006)}.lqTrainingDummy:before{content:'';position:absolute;left:16px;top:2px;width:9px;height:38px;background:#795333;border-radius:4px}.lqTrainingDummy:after{content:'';position:absolute;left:7px;top:12px;width:27px;height:18px;border:3px solid #8e6746;border-radius:50%;background:#b08b62}.lqTrainingShield{border-radius:50% 50% 45% 45%;background:linear-gradient(90deg,#6c7880 0 45%,#a99872 46% 54%,#59666e 55%);border:3px solid #3f474d;box-shadow:inset 0 0 0 2px #b8c0bf44}.lqTrainingMarks{background:radial-gradient(ellipse at 28% 32%,#cdbb8e 0 7px,transparent 8px),radial-gradient(ellipse at 68% 68%,#cdbb8e 0 7px,transparent 8px);transform:rotate(-18deg)}.lqTrainingBoard{border:3px solid #684f39;border-radius:3px;background:repeating-linear-gradient(#d2c18e 0 5px,#9d8b61 6px 7px);box-shadow:0 4px 6px #0006}.lqTrainingMaster{border-radius:45% 45% 34% 34%;background:linear-gradient(#8c8170 0 25%,#456070 26% 62%,#4a3c34 63%);border:2px solid #c1ad86}.lqTrainingMaster:before{content:'';position:absolute;left:10px;top:3px;width:18px;height:17px;border-radius:50%;background:#d5ae82;box-shadow:0 -5px 0 -1px #777067}.lqTrainingMaster:after{content:'';position:absolute;left:4px;right:4px;bottom:7px;height:5px;background:#b58d50;transform:rotate(-6deg)}
.lqTrainingBanner{position:absolute;z-index:2;width:78px;height:118px;pointer-events:none;filter:drop-shadow(0 5px 5px #0007)}.lqTrainingBanner:before{content:'';position:absolute;left:50%;top:0;width:5px;height:118px;background:#55412f}.lqTrainingBanner:after{content:'ALDIA';position:absolute;left:19px;top:8px;width:54px;height:72px;padding-top:14px;clip-path:polygon(0 0,100% 0,100% 84%,50% 100%,0 84%);background:linear-gradient(#304f6e,#1d334c);border-top:3px solid #d1b36e;color:#e9d59d;text-align:center;font-size:9px;font-weight:950;letter-spacing:.08em}
`;document.head.appendChild(style);
function gateAhead(){if(s.screen!=='world'||s.map!=='town')return false;const p=front();return currentNpcs().some(n=>n.x===p.x&&n.y===p.y&&n.kind==='lqTrainingYardGate');}
function enter(){stopMoving();s.map='trainingYard';s.x=6;s.y=8;s.dir='up';s.dialog={name:'王都・訓練場',text:'門の向こうでは、木剣の乾いた音が響いている。\nルーク「見るだけなら強くなった気がします。見るだけなら。」'};render();}
const actionBase=action;action=function(){if(!s.dialog&&gateAhead())return enter();return actionBase();};
const checkGateBase=checkGate;checkGate=function(){if(s.map==='trainingYard'&&(MAPS.trainingYard.tiles[s.y]||'')[s.x]==='G'){stopMoving();s.map='town';s.x=15;s.y=7;s.dir='up';s.dialog={name:'王都アルディア',text:'訓練場を出て、王都の通りへ戻った。'};return;}return checkGateBase();};
function decorate(){if(s.screen!=='world'||s.map!=='trainingYard')return;const w=app.querySelector('.world');if(!w||w.querySelector('.lqTrainingBanner'))return;for(const [x,y] of [[1.2,1.1],[9.1,1.1]]){const b=document.createElement('div');b.className='lqTrainingBanner';b.style.left=`${x*TS}px`;b.style.top=`${y*TS}px`;w.appendChild(b);}}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};const renderBase=render;render=function(){const r=renderBase();decorate();return r;};window.LQ_OPTIONAL_AREAS=Object.assign({},window.LQ_OPTIONAL_AREAS,{trainingYard:{entryMap:'town',exitMap:'town',tutorialSafe:true}});if(s.screen==='world')decorate();
})();