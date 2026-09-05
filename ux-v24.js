(() => {
'use strict';

/* LUKE QUEST v0.24 contextual player-guidance patch.
   Fixes objective guidance inside new interiors and displays a clear A-button prompt at usable doors/services. */

const style=document.createElement('style');
style.textContent=`
.lqActionHint{position:absolute;left:50%;bottom:118px;transform:translateX(-50%);z-index:29;background:#081422ec;border:2px solid #f0cf62;border-radius:999px;padding:7px 12px;color:#fff6d5;font-size:12px;font-weight:950;box-shadow:0 5px 16px #0009,0 0 12px #f0cf6222;white-space:nowrap;pointer-events:none;animation:lqHintBob .8s ease-in-out infinite alternate}
.lqActionHint b{display:inline-flex;align-items:center;justify-content:center;width:23px;height:23px;margin-right:6px;border-radius:50%;background:#7654a7;border:1px solid #d5c1ed;color:white}
@keyframes lqHintBob{from{transform:translate(-50%,1px)}to{transform:translate(-50%,-3px)}}
.lqInteriorGuide{border-color:#9edcf0aa;background:#0a1c29e8}.lqInteriorGuide b{color:#9ee8ff}
@media(max-height:700px){.lqActionHint{bottom:92px;padding:5px 10px;font-size:11px}}
`;
document.head.appendChild(style);

function storyGoalV24(){
  if(s.flags?.leonSecondSeen)return'北の尾根へ進み、負傷したレオンを追う。';
  if(s.flags?.withdrawProofSeen)return'北の崖道へ進み、レオンを追う。';
  if(s.flags?.evacEntered)return'北の退避路でレオンと魔王軍の痕跡を調べる。';
  if(s.flags?.glennSeen)return'北の封鎖線を越え、レオンを追う。';
  if(s.flags?.observationEntered)return'魔王軍の監視区域でグレン隊長を探す。';
  if(s.flags?.glennTraceSeen)return'霧の先にある魔王軍監視区域へ進む。';
  if(s.flags?.mistEntered)return'霧の追跡路で魔王軍の痕跡を調べる。';
  if(s.flags?.leonSeen)return'レオンを追って森の北側から霧へ進む。';
  if(s.wins<2)return'王都近郊で2勝し、北東の魔物の森へ入る。';
  if(s.map==='forest')return'魔物の森を北へ進み、深部へ入る。';
  if(s.map==='deepForest')return'森の深部でレオン本人を探す。';
  return'北東の魔物の森へ向かい、レオンを探す。';
}

function localInteriorGoal(){
  if(s.map==='innInterior')return'宿の主人に話しかけて休むか、南の扉から王都へ戻る。';
  if(s.map==='shopInterior')return'ミナに話しかけて薬草を買うか、南の扉から王都へ戻る。';
  if(s.map==='templeInterior')return'礼拝堂を調べるか、南の扉から王都へ戻る。';
  return null;
}

function contextualNpc(){
  if(s.screen!=='world'||s.dialog)return null;
  const p=front();
  return currentNpcs().find(n=>n.x===p.x&&n.y===p.y)||null;
}
function hintTextFor(n){
  if(!n)return null;
  if(['lqInnDoor','lqShopDoor','lqTempleDoor'].includes(n.kind))return'入る';
  if(n.kind==='lqInnInteriorKeeper')return'宿泊する';
  if(n.kind==='lqShopInteriorKeeper')return'薬草を買う';
  if(n.kind==='lqFieldChest')return'宝箱を開ける';
  if(n.kind==='lqTempleAltar')return'祭壇を調べる';
  return'調べる・話す';
}
function applyContextGuide(){
  if(s.screen!=='world')return;
  const guide=app.querySelector('.questGuide');
  const local=localInteriorGoal();
  if(guide&&local){guide.classList.add('lqInteriorGuide');guide.innerHTML=`<b>ここでできること：</b>${local}`;}
  if(s.dialog)return;
  const text=hintTextFor(contextualNpc());if(!text)return;
  const shell=app.querySelector('.gameShell');if(!shell||shell.querySelector('.lqActionHint'))return;
  const hint=document.createElement('div');hint.className='lqActionHint';hint.innerHTML=`<b>A</b>${text}`;shell.appendChild(hint);
}

const worldV23=world;
world=function(){worldV23();applyContextGuide();};
const renderV23=render;
render=function(){const r=renderV23();if(s.screen==='world')applyContextGuide();return r;};

openMenu=function(){
  stopMoving();
  const local=localInteriorGoal();
  const main=storyGoalV24();
  s.dialog={name:'冒険メモ',text:`メイン目的：${main}\n${local?`現在の場所：${local}\n`:''}現在地：${MAPS[s.map]?.name||s.map}\n総勝利：${s.wins}\n操作：十字キーで移動、Aで会話・調べる。`};
  render();
};

window.LQ_CONTEXT_GUIDANCE={buildingPrompts:true,interiorObjectives:true,menuInteriorFix:true};
if(s.screen==='world')render();
})();
