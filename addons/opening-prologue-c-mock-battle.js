(() => {
'use strict';

/* REQ-120 Checkpoint C — school flashback + deterministic mock battle.
   Battle tutorial state is module-local: no main HP/EXP/G/equipment mutation. */

const OPEN_MAP='openingAldia';
const SCREEN='openingMockBattle';
const DONE_FLAG='lqOpeningMockDone';
const STYLE_ID='lq-opening-mock-battle-style';
let mock=null;

function decorateTrainingMemory(){
  const m=typeof MAPS!=='undefined'?MAPS[OPEN_MAP]:null;
  if(!m)return;
  const n=m.npcs?.find(q=>q.name==='学院の記念掲示');
  if(n)n.kind='openingTrainingMemory';
}

function injectStyle(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
.lqMockStage{min-height:min(76vh,650px);padding:16px;border-radius:20px;background:linear-gradient(180deg,#263e54,#162738 42%,#101b28);border:1px solid #ffffff20;box-shadow:0 20px 50px #000a;display:flex;flex-direction:column;justify-content:center;gap:12px}
.lqMockMemory{font-size:11px;letter-spacing:.24em;text-align:center;color:#cfdef0;font-weight:900}
.lqMockArena{position:relative;min-height:220px;border-radius:16px;overflow:hidden;background:linear-gradient(#91b8cc 0 38%,#759b69 38% 43%,#aa9166 43%);border:1px solid #ffffff22;box-shadow:inset 0 -20px 40px #0003}
.lqMockArena::before{content:"";position:absolute;inset:43% 0 0;background:repeating-linear-gradient(90deg,transparent 0 46px,rgba(55,40,24,.14) 47px 48px),repeating-linear-gradient(0deg,transparent 0 46px,rgba(55,40,24,.12) 47px 48px);pointer-events:none}
.lqMockFighter{position:absolute;bottom:36px;width:110px;text-align:center;z-index:2}.lqMockFighter.luke{left:8%}.lqMockFighter.leon{right:8%}.lqMockSprite{font-size:62px;filter:drop-shadow(0 8px 5px #0007)}.lqMockName{font-weight:950;text-shadow:0 2px 5px #000}.lqMockHp{height:8px;border-radius:99px;background:#07111faa;overflow:hidden;margin:5px auto;width:92px}.lqMockHp i{display:block;height:100%;background:#75dc91;transition:width .22s ease}.lqMockFighter.leon .lqMockHp i{background:#f0c75e}
.lqMockLog{background:#07111fe8;border:1px solid #ffffff22;border-radius:12px;padding:10px;min-height:72px;line-height:1.55}.lqMockCommands{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lqMockCommands button{margin:0}.lqMockResult{text-align:center;padding:18px}.lqMockResult .faces{font-size:54px;margin-bottom:10px}
@media(max-width:430px){.lqMockArena{min-height:195px}.lqMockFighter{width:92px}.lqMockSprite{font-size:54px}}
@media(prefers-reduced-motion:reduce){.lqMockHp i{transition:none}}
`;
  document.head.appendChild(st);
}

function freshMock(){return {phase:'setup',lukeHp:30,leonHp:24,turn:0,guard:false,log:['学院・実技授業。レオンは最初から本気だ。']};}
function getMock(){if(!mock)mock=freshMock();return mock;}
function push(line){const m=getMock();m.log.push(line);if(m.log.length>4)m.log.shift();}

function renderSetup(){
  app.innerHTML=`<div class=lqMockStage><div class=lqMockMemory>数年前 • 王都学院 訓練場</div><div class=lqMockArena><div class="lqMockFighter luke"><div class=lqMockSprite>🧑‍🦱</div><div class=lqMockName>ルーク</div></div><div class="lqMockFighter leon"><div class=lqMockSprite>🧑‍🦳⚔️</div><div class=lqMockName>レオン</div></div></div><div class=lqMockLog>教官「模擬戦、始め！」<br>レオン「手を抜くな、ルーク。」<br>ルーク「先生、これ本気でやらないとダメですか？」</div><button class="btn gold" onclick="lqMockStart()">模擬戦を始める</button></div>`;
}
function renderBattle(){
  const m=getMock();
  app.innerHTML=`<div class=lqMockStage><div class=lqMockMemory>TRAINING MATCH • 報酬 / 経験値なし</div><div class=lqMockArena><div class="lqMockFighter luke"><div class=lqMockSprite>🧑‍🦱🛡️</div><div class=lqMockName>ルーク</div><div class=lqMockHp><i style="width:${100*m.lukeHp/30}%"></i></div></div><div class="lqMockFighter leon"><div class=lqMockSprite>🧑‍🦳⚔️</div><div class=lqMockName>レオン</div><div class=lqMockHp><i style="width:${100*m.leonHp/24}%"></i></div></div></div><div class=lqMockLog>${m.log.map(x=>String(x)).join('<br>')}</div><div class=lqMockCommands><button class=btn onclick="lqMockAttack()">こうげき</button><button class="btn gray" onclick="lqMockGuard()">ぼうぎょ</button></div></div>`;
}
function renderResult(){
  app.innerHTML=`<div class=lqMockStage><div class=lqMockMemory>TRAINING MATCH • RESULT</div><div class=lqMockResult><div class=faces>🧑‍🦱　⚔️　🧑‍🦳</div><div class=lqMockLog>教官「そこまで。勝者、ルーク。」<br><br>レオン「……もう一度だ。」<br>ルーク「ええ……もう帰りたいです。」<br><br><span style="color:#d5c27c">レオン「……まだだ。」</span></div><button class="btn gold" onclick="lqMockFinish()">現在へ戻る</button></div></div>`;
}
function renderMock(){
  injectStyle();document.body.classList.remove('lqOpeningMorning');
  const m=getMock();
  if(m.phase==='setup')renderSetup();else if(m.phase==='result')renderResult();else renderBattle();
}

function startMemory(){
  stopMoving();mock=freshMock();s.screen=SCREEN;s.flags=s.flags||{};s.flags.lqOpeningMemoryStarted=true;render();
}
window.lqMockStart=function(){const m=getMock();m.phase='battle';push('レオン「来い！」');render();};
function leonTurn(){
  const m=getMock();
  if(m.leonHp<=0)return;
  const raw=5+(m.turn%2);const d=m.guard?Math.max(1,Math.floor(raw/2)):raw;
  m.lukeHp=Math.max(1,m.lukeHp-d);push(`レオンの鋭い一撃。ルークは${d}ダメージ。`);m.guard=false;
}
window.lqMockAttack=function(){
  const m=getMock();if(m.phase!=='battle')return;
  m.turn++;const d=m.turn===1?8:m.turn===2?9:8;m.leonHp=Math.max(0,m.leonHp-d);push(`ルークの攻撃。力みがないのに${d}ダメージ。`);
  if(m.leonHp<=0){m.phase='result';render();return;}
  leonTurn();render();
};
window.lqMockGuard=function(){const m=getMock();if(m.phase!=='battle')return;m.turn++;m.guard=true;push('ルークは受け流す構えを取った。');leonTurn();render();};
window.lqMockFinish=function(){
  s.flags=s.flags||{};s.flags[DONE_FLAG]=true;s.flags.lqOpeningMemoryStarted=false;s.screen='world';s.map=OPEN_MAP;s.dialog={name:'ルーク',text:'「ここでレオンに、もう一度って何回言われたっけ……。」\n北の大神殿へ急ごう。今日はそのレオンが勇者になる日だ。'};mock=null;render();
};

decorateTrainingMemory();injectStyle();
const baseRender=render;
render=function(){if(s.screen===SCREEN){stopMoving();save();renderMock();return;}return baseRender.apply(this,arguments);};
const baseAction=action;
action=function(){
  if(s.screen==='world'&&s.map===OPEN_MAP){
    const p=front();const n=currentNpcs().find(q=>q.x===p.x&&q.y===p.y);
    if(n?.kind==='openingTrainingMemory'&&!s.flags?.[DONE_FLAG]){startMemory();return;}
  }
  return baseAction.apply(this,arguments);
};
const baseCheckGate=checkGate;
checkGate=function(){
  if(s.screen==='world'&&s.map===OPEN_MAP){
    const c=(MAPS[OPEN_MAP].tiles[s.y]||'')[s.x];
    if(c==='G'&&s.y===0&&!s.flags?.[DONE_FLAG]){startMemory();return;}
  }
  return baseCheckGate.apply(this,arguments);
};

function smoke(){
  if(typeof s==='undefined'||!MAPS?.[OPEN_MAP])return;
  decorateTrainingMemory();
  const before={screen:s.screen,map:s.map,x:s.x,y:s.y,dir:s.dir,step:s.step,dialog:s.dialog?{...s.dialog}:s.dialog,flags:{...(s.flags||{})},hp:s.hp,xp:s.xp,gold:s.gold,wins:s.wins};
  const raw=localStorage.getItem('lukeQuestV2');
  try{
    const training=MAPS[OPEN_MAP].npcs.find(n=>n.kind==='openingTrainingMemory');if(!training)throw new Error('training memory landmark missing');
    s.screen='world';s.map=OPEN_MAP;s.x=14;s.y=7;s.dir='up';s.flags={...(s.flags||{}),[DONE_FLAG]:false};
    startMemory();window.lqMockStart();window.lqMockAttack();window.lqMockAttack();window.lqMockAttack();
    if(getMock().phase!=='result')throw new Error('Luke did not win deterministic mock battle');
    if(s.hp!==before.hp||s.xp!==before.xp||s.gold!==before.gold||s.wins!==before.wins)throw new Error('main progression mutated by tutorial battle');
    window.lqMockFinish();if(!s.flags[DONE_FLAG]||s.screen!=='world'||s.map!==OPEN_MAP)throw new Error('flashback return invalid');
    const marker=document.createElement('i');marker.className='lqReq120CSmokeMarker';marker.hidden=true;marker.dataset.lukeWins='true';marker.dataset.mainStateIsolated='true';marker.dataset.returned='true';document.body.appendChild(marker);
  }finally{
    s.screen=before.screen;s.map=before.map;s.x=before.x;s.y=before.y;s.dir=before.dir;s.step=before.step;s.dialog=before.dialog;s.flags=before.flags;s.hp=before.hp;s.xp=before.xp;s.gold=before.gold;s.wins=before.wins;mock=null;
    if(raw===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',raw);render();
  }
}
window.LQ_REQ120_OPENING_C_STATUS={requirement:'REQ-120',checkpoint:'C',schoolFlashback:true,mockBattle:true,lukeVictoryDeterministic:true,mainProgressionMutation:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ120_OPENING_C_TEST={smoke,startMemory};
setTimeout(()=>{if(new URLSearchParams(location.search).has('lqSmoke'))smoke();},0);
})();
