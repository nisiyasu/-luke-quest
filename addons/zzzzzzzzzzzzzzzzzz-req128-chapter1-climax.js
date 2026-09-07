(() => {
'use strict';

/* REQ-128 — Chapter 1 climax.
   Canon-safe, nonlethal confrontation at the existing Wind Stair Ridge north boundary.
   This deliberately does NOT call startBattle(), enemyTurn(), win(), or normal reward code. */
const REQ='REQ-128';
const SCREEN='req128Chapter1Climax';
const STATE_KEY='lqReq128Climax';
const STYLE_ID='lq-req128-climax-style';
const WIND='windStairRidge';
const BOUNDARY_KIND='lqWindStairBoundary';
const REQUIRED_TURNS=3;

function flags(){if(typeof s==='undefined'||!s)return null;if(!s.flags||typeof s.flags!=='object'||Array.isArray(s.flags))s.flags={};return s.flags;}
function freshState(){return {phase:'reunion',step:0,turn:0};}
function state(){if(!s[STATE_KEY]||typeof s[STATE_KEY]!=='object'||Array.isArray(s[STATE_KEY]))s[STATE_KEY]=freshState();const q=s[STATE_KEY];if(!Number.isInteger(q.step)||q.step<0)q.step=0;if(!Number.isInteger(q.turn)||q.turn<0)q.turn=0;return q;}
function safeSave(){try{if(typeof save==='function')save();}catch(e){console.error('REQ-128 save failed',e);}}
function installStyle(){if(document.getElementById(STYLE_ID))return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
.lq128{min-height:100dvh;padding:max(14px,env(safe-area-inset-top)) 14px max(14px,env(safe-area-inset-bottom));background:linear-gradient(180deg,#0d1725,#07111f);color:#fff7dd;display:flex;align-items:center;justify-content:center}.lq128Card{width:min(100%,620px);padding:15px;border-radius:18px;border:1px solid #ffffff24;background:#101d31;box-shadow:0 18px 50px #0009}.lq128Scene{position:relative;min-height:300px;border-radius:15px;overflow:hidden;border:1px solid #ffffff18;background:linear-gradient(180deg,#4a6687 0 45%,#686761 45% 62%,#313942 62%)}.lq128Wind{position:absolute;inset:12px;text-align:center;color:#e8f4ff99;letter-spacing:.35em}.lq128People{position:absolute;left:6%;right:6%;bottom:34px;display:flex;align-items:flex-end;justify-content:space-around;text-align:center;gap:12px}.lq128Person b{display:block;font-size:58px;filter:drop-shadow(0 5px 4px #0009)}.lq128Caption{margin-top:11px;min-height:112px;padding:12px;border-radius:12px;background:#07111f;line-height:1.68;white-space:pre-line}.lq128Actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px}.lq128 button{border:0;border-radius:12px;padding:13px;background:#347cff;color:#fff;font:inherit;font-weight:900}.lq128 button.secondary{background:#29415f}.lq128Chapter{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;background:#02060cdd}.lq128Chapter small{letter-spacing:.25em;color:#d8c783;font-weight:900}.lq128Chapter b{display:block;font:900 clamp(34px,10vw,58px) serif;margin:10px 0}.lq128Pulse{font-size:12px;color:#a9b9cc;text-align:center;margin-top:8px}
`;document.head.appendChild(st);}

const reunion=[
 {sp:'ナレーション',tx:'風鳴りの石段、その先。\n長い追跡の末、ルークはついにレオンへ追いついた。'},
 {sp:'ルーク',tx:'レオン。やっと見つけた。\n帰ろう。みんな心配してる。'},
 {sp:'レオン',tx:'……帰れない。\n選定から逃げた俺が、今さら何をしに戻るんだ。'},
 {sp:'ルーク',tx:'選定は終わった。\n王都から正式な知らせが来た。選ばれたのは……僕だった。'},
 {sp:'レオン',tx:'……お前が？\nずっと俺が勇者になるって言われてきた。母上も、周りも、俺自身も……全部それで立ってた。'},
 {sp:'レオン',tx:'それなのに最後まで、お前なのか。\n努力して、期待に応えて、それでも届かないのか！'},
 {sp:'ルーク',tx:'レオン、剣を下ろして。\n僕は君と戦いに来たんじゃない。'}
];
const aftermath=[
 {sp:'レオンの妹',tx:'お兄ちゃん、やめて！'},
 {sp:'ナレーション',tx:'彼女が二人の間へ飛び込む。\n振り切れなかったレオンの一撃が、誤って彼女を傷つけた。'},
 {sp:'ナレーション',tx:'彼女はその場に崩れる。傷は命に関わるものではない。'},
 {sp:'レオン',tx:'……っ。\n俺、何を……。'},
 {sp:'ルーク',tx:'話はあとです。まず妹さんを助けます。\nレオン、手を貸して。'},
 {sp:'レオン',tx:'……ああ。'}
];
const returned=[
 {sp:'ナレーション',tx:'ルーク、レオン、そして妹は王都へ戻った。\n長い追跡は、ひとまずここで終わった。'},
 {sp:'エレノア',tx:'おかえりなさい。無事に戻ってくれてよかった。\nまずはこの子を休ませましょう。'},
 {sp:'ナレーション',tx:'誰も、すぐには答えを出せなかった。\nそれでも四人は同じ王都へ帰ってきた。'},
 {sp:'第一章 完',tx:'逃げた勇者候補\n\n第一章はここで一区切りです。続きは準備中。'}
];

function people(phase){if(phase==='aftermath')return '<div class=lq128People><div class=lq128Person><b>🧑‍🦱</b>ルーク</div><div class=lq128Person><b>🧑‍🦳</b>レオン</div><div class=lq128Person><b>👧</b>レオンの妹</div></div>';if(phase==='return')return '<div class=lq128People><div class=lq128Person><b>🧑‍🦱</b>ルーク</div><div class=lq128Person><b>🧑‍🦳</b>レオン</div><div class=lq128Person><b>👧</b>レオンの妹</div><div class=lq128Person><b>👩‍🦳</b>エレノア</div></div>';return '<div class=lq128People><div class=lq128Person><b>🧑‍🦱</b>ルーク</div><div class=lq128Person><b>🧑‍🦳</b>レオン</div></div>';}
function shell(inner,actions=''){installStyle();document.body.classList.remove('lqWorldFullscreen');app.innerHTML=`<main class=lq128 data-req128-screen><section class=lq128Card><div class=lq128Scene><div class=lq128Wind>風鳴りの石段</div>${inner}</div>${actions}</section></main>`;}
function sceneCard(sc,phase,nextLabel='つづける'){shell(`${people(phase)}<div class=lq128Chapter style="background:transparent;align-items:flex-start;justify-content:flex-start;padding:12px;pointer-events:none"><small>${sc.sp}</small></div>`,`<div class=lq128Caption>${sc.tx}</div><div class=lq128Actions><button id=lq128Next type=button>${nextLabel}</button></div>`);document.getElementById('lq128Next')?.addEventListener('click',()=>window.lqReq128Next(),{once:true});}
function renderConfrontation(){const q=state();const prompt=q.turn===0?'レオンが剣を構える。ルークは攻撃する気がない。':q.turn===1?'レオンの剣筋は荒い。感情だけが先に走っている。':'レオンの呼吸が乱れている。あと少し、傷つけずに持ちこたえる。';shell(people('confront'),`<div class=lq128Caption><b>対峙 ${Math.min(q.turn+1,REQUIRED_TURNS)} / ${REQUIRED_TURNS}</b>\n${prompt}\n\nルーク「戦いたくない。落ち着いて、レオン。」</div><div class=lq128Actions><button id=lq128Guard type=button>身を守る</button><button id=lq128Call class=secondary type=button>呼びかける</button></div><div class=lq128Pulse>攻撃コマンドなし / 非殺傷</div>`);document.getElementById('lq128Guard')?.addEventListener('click',()=>window.lqReq128DefensiveTurn('guard'),{once:true});document.getElementById('lq128Call')?.addEventListener('click',()=>window.lqReq128DefensiveTurn('call'),{once:true});}
function renderClimax(){const q=state();if(q.phase==='reunion'){const sc=reunion[Math.min(q.step,reunion.length-1)];return sceneCard(sc,'reunion',q.step===reunion.length-1?'剣を抜かずに向き合う':'つづける');}if(q.phase==='confront')return renderConfrontation();if(q.phase==='aftermath'){const sc=aftermath[Math.min(q.step,aftermath.length-1)];return sceneCard(sc,'aftermath',q.step===aftermath.length-1?'王都へ戻る':'つづける');}if(q.phase==='return'){const sc=returned[Math.min(q.step,returned.length-1)];return sceneCard(sc,'return',q.step===returned.length-1?'第一章を終える':'つづける');}q.phase='reunion';q.step=0;renderClimax();}

function facingBoundary(){if(typeof front!=='function'||!MAPS?.[WIND])return false;const p=front();if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))return false;const n=MAPS[WIND].npcs?.find(v=>v.x===p.x&&v.y===p.y);return n?.kind===BOUNDARY_KIND;}
function begin(){const f=flags();if(!f||f.chapter1Complete||s.screen!=='world'||s.map!==WIND||!facingBoundary())return false;if(typeof stopMoving==='function')stopMoving();s[STATE_KEY]=freshState();f.chapter1ClimaxStarted=true;f.chapter1HeroRevealedToLeon=false;f.chapter1LeonConfrontationResolved=false;f.chapter1SisterWounded=false;s.dialog=null;s.screen=SCREEN;safeSave();render();return true;}
function advance(){const q=state(),f=flags();if(s.screen!==SCREEN)return;if(q.phase==='reunion'){if(q.step<reunion.length-1){q.step++;if(q.step>=3)f.chapter1HeroRevealedToLeon=true;}else{f.chapter1HeroRevealedToLeon=true;q.phase='confront';q.step=0;q.turn=0;}}else if(q.phase==='aftermath'){if(q.step<aftermath.length-1){q.step++;if(q.step>=1)f.chapter1SisterWounded=true;}else{f.chapter1SisterWounded=true;q.phase='return';q.step=0;}}else if(q.phase==='return'){if(q.step<returned.length-1)q.step++;else return finish();}safeSave();render();}
function defensiveTurn(mode){const q=state(),f=flags();if(s.screen!==SCREEN||q.phase!=='confront')return;if(mode!=='guard'&&mode!=='call')return;q.turn++;if(q.turn>=REQUIRED_TURNS){f.chapter1LeonConfrontationResolved=true;q.phase='aftermath';q.step=0;}safeSave();render();}
function finish(){const f=flags();f.chapter1HeroRevealedToLeon=true;f.chapter1LeonConfrontationResolved=true;f.chapter1SisterWounded=true;f.chapter1SisterInjuryNonfatal=true;f.chapter1Complete=true;s.screen='world';s.map='town';s.x=9;s.y=12;s.dir='up';s.dialog={name:'第一章 完',text:'逃げた勇者候補を追う旅は、王都への帰還で一区切りとなった。\n続きは準備中。'};if(typeof encounterGrace!=='undefined')encounterGrace=0;safeSave();render();}

window.lqReq128Next=advance;
window.lqReq128DefensiveTurn=defensiveTurn;
installStyle();
if(typeof render==='function'){const baseRender=render;render=function(){if(typeof s!=='undefined'&&s.screen===SCREEN){if(typeof stopMoving==='function')stopMoving();safeSave();renderClimax();return;}return baseRender.apply(this,arguments);};}
if(typeof action==='function'){const baseAction=action;action=function(){if(typeof s!=='undefined'&&s.screen==='world'&&s.map===WIND&&!s.dialog){if(flags()?.chapter1Complete&&facingBoundary()){if(typeof stopMoving==='function')stopMoving();s.dialog={name:'風鳴りの石段',text:'第一章の出来事は王都への帰還で一区切りとなった。'};render();return;}if(begin())return;}return baseAction.apply(this,arguments);};}
window.LQ_REQ128_STATUS={requirement:REQ,status:'IN_PROGRESS',triggerMap:WIND,triggerKind:BOUNDARY_KIND,nonlethal:true,normalBattleAuthorityUsed:false,sisterLabel:'レオンの妹',sisterNameInvented:false,chapter2Invented:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ128_TEST={begin,advance,defensiveTurn,finish,state,facingBoundary,SCREEN,REQUIRED_TURNS};
})();
