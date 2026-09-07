(() => {
'use strict';

/* REQ-118 Checkpoint C — academy flashback + isolated mock battle.
   The tutorial battle is intentionally module-local. It must never mutate
   canonical HP/MP/EXP/G/inventory/equipment/wins or normal battle authority. */

const REQ='REQ-118';
const PHASE_KEY='req118OpeningPhase';
const DONE_KEY='req118OpeningComplete';
const B_DONE='aldia_morning_complete';
const C_ACTIVE='academy_flashback';
const C_DONE='academy_flashback_complete';
const SCREEN='req118MockBattle';
const STYLE_ID='lq-req118-opening-c-style';
let mock=null;

function flags(){
  if(typeof s==='undefined'||!s)return null;
  if(!s.flags||typeof s.flags!=='object'||Array.isArray(s.flags))s.flags={};
  return s.flags;
}
function phase(){return flags()?.[PHASE_KEY]||null;}
function safeSave(){try{if(typeof save==='function')save();}catch(e){console.error('REQ-118 C save failed',e);}}
function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
.lqReq118Mock{min-height:100dvh;padding:max(14px,env(safe-area-inset-top)) 14px max(14px,env(safe-area-inset-bottom));background:#07111f;color:#fff7dd;display:flex;align-items:center;justify-content:center}
.lqReq118MockCard{width:min(100%,590px);display:flex;flex-direction:column;gap:11px;padding:15px;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:#101d31;box-shadow:0 16px 40px rgba(0,0,0,.38)}
.lqReq118MockMemory{text-align:center;font-size:11px;letter-spacing:.2em;color:#cbd8e7;font-weight:900}.lqReq118MockArena{position:relative;min-height:220px;overflow:hidden;border-radius:15px;border:1px solid rgba(255,255,255,.17);background:linear-gradient(#91b8cc 0 38%,#759b69 38% 43%,#aa9166 43%)}
.lqReq118MockArena:before{content:"";position:absolute;inset:43% 0 0;background:repeating-linear-gradient(90deg,transparent 0 46px,rgba(55,40,24,.14) 47px 48px),repeating-linear-gradient(0deg,transparent 0 46px,rgba(55,40,24,.12) 47px 48px);pointer-events:none}.lqReq118Fighter{position:absolute;bottom:32px;width:110px;text-align:center}.lqReq118Fighter.luke{left:7%}.lqReq118Fighter.leon{right:7%}.lqReq118FighterFace{font-size:58px}.lqReq118FighterName{font-weight:950}.lqReq118Hp{height:8px;width:92px;margin:5px auto 0;background:#07111f;border-radius:99px;overflow:hidden}.lqReq118Hp i{display:block;height:100%;background:#75dc91;transition:width .2s ease}.lqReq118Fighter.leon .lqReq118Hp i{background:#f0c75e}.lqReq118MockLog{min-height:82px;padding:10px;border-radius:11px;background:#07111f;line-height:1.55}.lqReq118MockCmd{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lqReq118Mock button{border:0;border-radius:12px;padding:13px;background:#347cff;color:#fff;font:inherit;font-weight:900}.lqReq118Mock button.secondary{background:#2b405a}.lqReq118MockNote{text-align:center;font-size:11px;color:#b9c6d4}
@media(max-width:430px){.lqReq118MockArena{min-height:194px}.lqReq118Fighter{width:92px}.lqReq118FighterFace{font-size:51px}}
@media(prefers-reduced-motion:reduce){.lqReq118Hp i{transition:none!important}}
`;
  document.head.appendChild(st);
}
function freshMock(){return {phase:'setup',lukeHp:30,leonHp:24,turn:0,guard:false,log:['学院・実技授業。レオンは最初から本気だ。']};}
function getMock(){if(!mock)mock=freshMock();return mock;}
function push(line){const m=getMock();m.log.push(line);if(m.log.length>4)m.log.shift();}
function arena(m){return `<div class=lqReq118MockArena><div class="lqReq118Fighter luke"><div class=lqReq118FighterFace>🧑‍🦱🛡️</div><div class=lqReq118FighterName>ルーク</div><div class=lqReq118Hp><i style="width:${100*m.lukeHp/30}%"></i></div></div><div class="lqReq118Fighter leon"><div class=lqReq118FighterFace>🧑‍🦳⚔️</div><div class=lqReq118FighterName>レオン</div><div class=lqReq118Hp><i style="width:${100*m.leonHp/24}%"></i></div></div></div>`;}
function renderMock(){
  installStyle();const m=getMock();document.body.classList.remove('lqWorldFullscreen');
  if(m.phase==='setup'){
    app.innerHTML=`<main class=lqReq118Mock data-req118-phase="${C_ACTIVE}"><section class=lqReq118MockCard><div class=lqReq118MockMemory>数年前 · 王都学院 訓練場</div>${arena(m)}<div class=lqReq118MockLog>教官「模擬戦、始め！」<br>レオン「手を抜くな、ルーク。」<br>ルーク「先生、これ本気でやらないとダメですか？」</div><button id=lqReq118MockStart type=button>模擬戦を始める</button><div class=lqReq118MockNote>訓練戦 · 経験値 / G / アイテム報酬なし</div></section></main>`;
    document.getElementById('lqReq118MockStart')?.addEventListener('click',()=>window.lqReq118MockStart(),{once:true});return;
  }
  if(m.phase==='result'){
    app.innerHTML=`<main class=lqReq118Mock data-req118-phase="${C_ACTIVE}"><section class=lqReq118MockCard><div class=lqReq118MockMemory>TRAINING MATCH · RESULT</div>${arena(m)}<div class=lqReq118MockLog>教官「そこまで。勝者、ルーク。」<br><br>レオン「……もう一度だ。」<br>ルーク「ええ……もう帰りたいです。」<br><br><span style="color:#d5c27c">レオン「……まだだ。」</span></div><button id=lqReq118MockFinish type=button>現在へ戻る</button></section></main>`;
    document.getElementById('lqReq118MockFinish')?.addEventListener('click',()=>window.lqReq118MockFinish(),{once:true});return;
  }
  app.innerHTML=`<main class=lqReq118Mock data-req118-phase="${C_ACTIVE}"><section class=lqReq118MockCard><div class=lqReq118MockMemory>TRAINING MATCH · 報酬なし</div>${arena(m)}<div class=lqReq118MockLog>${m.log.map(x=>String(x)).join('<br>')}</div><div class=lqReq118MockCmd><button type=button onclick="lqReq118MockAttack()">こうげき</button><button type=button class=secondary onclick="lqReq118MockGuard()">ぼうぎょ</button></div></section></main>`;
}
function startMemory(){
  const f=flags();if(!f||f[DONE_KEY]||phase()!==B_DONE)return false;
  if(typeof stopMoving==='function')stopMoving();
  mock=freshMock();f[PHASE_KEY]=C_ACTIVE;s.dialog=null;s.screen=SCREEN;safeSave();render();return true;
}
window.lqReq118MockStart=function(){const m=getMock();if(m.phase!=='setup')return;m.phase='battle';push('レオン「来い！」');render();};
function leonTurn(){const m=getMock();if(m.leonHp<=0)return;const raw=5+(m.turn%2);const d=m.guard?Math.max(1,Math.floor(raw/2)):raw;m.lukeHp=Math.max(1,m.lukeHp-d);push(`レオンの鋭い一撃。ルークは${d}ダメージ。`);m.guard=false;}
window.lqReq118MockAttack=function(){const m=getMock();if(m.phase!=='battle')return;m.turn++;const d=m.turn===1?8:m.turn===2?9:8;m.leonHp=Math.max(0,m.leonHp-d);push(`ルークの攻撃。${d}ダメージ。`);if(m.leonHp<=0){m.phase='result';render();return;}leonTurn();render();};
window.lqReq118MockGuard=function(){const m=getMock();if(m.phase!=='battle')return;m.turn++;m.guard=true;push('ルークは受け流す構えを取った。');leonTurn();render();};
window.lqReq118MockFinish=function(){
  const f=flags();if(!f||phase()!==C_ACTIVE)return;
  f[PHASE_KEY]=C_DONE;s.screen='world';s.map='town';s.x=8;s.y=6;s.dir='up';s.dialog={name:'ルーク',text:'「……あの頃から、レオンは負けるのが嫌いだったな。」\n今日は勇者選定の日だ。神殿前の様子を見よう。'};mock=null;safeSave();render();
};

installStyle();
if(typeof render==='function'){
  const baseRender=render;
  render=function(){if(typeof s!=='undefined'&&s.screen===SCREEN&&phase()===C_ACTIVE){if(typeof stopMoving==='function')stopMoving();renderMock();return;}return baseRender.apply(this,arguments);};
}
if(typeof action==='function'){
  const baseAction=action;
  action=function(){if(typeof s!=='undefined'&&s.screen==='world'&&s.map==='town'&&phase()===B_DONE&&!s.dialog){if(startMemory())return;}return baseAction.apply(this,arguments);};
}

function stableSnapshot(){return JSON.stringify({hp:s.hp,maxHp:s.maxHp,mp:s.mp,maxMp:s.maxMp,exp:s.exp,gold:s.gold,herbs:s.herbs,smoke:s.smoke,atk:s.atk,def:s.def,level:s.level,wins:s.wins,equipment:s.equipment,keyItems:s.keyItems});}
function smoke(){
  if(typeof s==='undefined'||!window.LQ_REQ118_OPENING_TEST)return;
  const snap=structuredClone(s);const raw=localStorage.getItem('lukeQuestV2');const marker=document.createElement('i');marker.id='lqReq118CMarker';marker.hidden=true;
  try{
    Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,structuredClone(DEFAULT));
    s.flags.req118OpeningPhase=B_DONE;s.flags.req118OpeningComplete=false;s.screen='world';s.map='town';s.x=8;s.y=6;s.dir='up';s.dialog=null;
    const before=stableSnapshot();
    if(!startMemory())throw new Error('B->C flashback transition failed');
    if(s.screen!==SCREEN||phase()!==C_ACTIVE)throw new Error('mock screen not active');
    window.lqReq118MockStart();window.lqReq118MockAttack();window.lqReq118MockAttack();window.lqReq118MockAttack();
    if(getMock().phase!=='result'||getMock().leonHp!==0)throw new Error('Luke did not win deterministic mock battle');
    if(stableSnapshot()!==before)throw new Error('tutorial battle mutated canonical progression');
    window.lqReq118MockFinish();
    if(phase()!==C_DONE||s.screen!=='world'||s.map!=='town')throw new Error('C return to present invalid');
    if(stableSnapshot()!==before)throw new Error('tutorial completion mutated canonical progression');
    marker.dataset.status='PASS';marker.dataset.flashback='true';marker.dataset.lukeWins='true';marker.dataset.progressionIsolated='true';marker.dataset.returned='true';
  }catch(e){marker.dataset.status='FAIL';marker.dataset.error=e?.message||String(e);console.error(e);}
  finally{Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snap);mock=null;if(raw===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',raw);render();document.body.appendChild(marker);}
}

window.LQ_REQ118_OPENING_C_STATUS={requirement:REQ,checkpoint:'C',status:'IN_PROGRESS',academyFlashback:true,mockBattle:true,lukeVictoryDeterministic:true,canonicalProgressionMutation:false,normalBattleAuthorityWrapped:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ118_OPENING_C_TEST={startMemory,phase,getMock,stableSnapshot,smoke};
if(new URLSearchParams(location.search).get('lqReq118CSmoke')==='1')setTimeout(smoke,5600);
})();
