(() => {
'use strict';

/* REQ-118 Checkpoint F+G — abnormal crystal response without Hero confirmation.
   The crystal visibly reacts in an unprecedented, mixed way. This scene must
   create uncertainty, not establish that Luke is the Hero. */
const REQ='REQ-118';
const PHASE_KEY='req118OpeningPhase';
const DONE_KEY='req118OpeningComplete';
const DE_DONE='ceremony_leon_absent_complete';
const FG_ACTIVE='crystal_abnormal_reaction';
const FG_DONE='crystal_abnormal_reaction_complete';
const SCREEN='req118CrystalFG';
const STYLE_ID='lq-req118-opening-fg-style';
let fg={step:0};
function flags(){if(typeof s==='undefined'||!s)return null;if(!s.flags||typeof s.flags!=='object'||Array.isArray(s.flags))s.flags={};return s.flags;}
function phase(){return flags()?.[PHASE_KEY]||null;}
function safeSave(){try{if(typeof save==='function')save();}catch(e){console.error('REQ-118 F+G save failed',e);}}
function installStyle(){if(document.getElementById(STYLE_ID))return;const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
.lqReq118FG{min-height:100dvh;padding:max(14px,env(safe-area-inset-top)) 14px max(14px,env(safe-area-inset-bottom));background:#050912;color:#fff7dd;display:flex;align-items:center;justify-content:center}.lqReq118FGCard{width:min(100%,610px);display:flex;flex-direction:column;gap:11px;padding:15px;border:1px solid #ffffff20;border-radius:18px;background:#101d31}.lqReq118Temple{position:relative;min-height:330px;border-radius:16px;overflow:hidden;background:radial-gradient(circle at 50% 29%,var(--glow,#8bc6ff20),transparent 36%),linear-gradient(180deg,#263d64 0 68%,#61584c 68%);transition:background .25s ease}.lqReq118Crystal{position:absolute;z-index:4;left:50%;top:48px;transform:translateX(-50%);font-size:88px;filter:drop-shadow(0 0 10px #8bc6ff88)}.lqReq118Luke{position:absolute;z-index:3;left:50%;bottom:47px;transform:translateX(-50%);font-size:61px}.lqReq118Priest{position:absolute;left:8%;bottom:43px;text-align:center;font-size:13px}.lqReq118Priest b{display:block;font-size:48px}.lqReq118EleanorFG{position:absolute;right:8%;bottom:43px;text-align:center;font-size:13px}.lqReq118EleanorFG b{display:block;font-size:52px}.lqReq118FG.white{--glow:#ffffff80}.lqReq118FG.white .lqReq118Crystal{filter:drop-shadow(0 0 24px #fff) drop-shadow(0 0 45px #dff6ff)}.lqReq118FG.blue{--glow:#50aaff85}.lqReq118FG.blue .lqReq118Crystal{filter:drop-shadow(0 0 25px #62b7ff) drop-shadow(0 0 48px #247cff)}.lqReq118FG.gold{--glow:#ffd96888}.lqReq118FG.gold .lqReq118Crystal{filter:drop-shadow(0 0 24px #fff0a5) drop-shadow(0 0 48px #ffbe3b)}.lqReq118FG.dark{--glow:#66377755}.lqReq118FG.dark .lqReq118Crystal{filter:drop-shadow(0 0 14px #7a3a9f) drop-shadow(0 0 18px #111827)}.lqReq118FGCaption{min-height:112px;padding:11px;border-radius:11px;background:#07111f;line-height:1.68;white-space:pre-line}.lqReq118FG button{border:0;border-radius:12px;padding:13px;background:#347cff;color:white;font:inherit;font-weight:900}@media(prefers-reduced-motion:reduce){.lqReq118Temple{transition:none!important}}
`;document.head.appendChild(st);}
const scenes=[
 {cls:'',text:'神官「ルーク。水晶へ手を。」\n\nルーク「触るだけですよね？ 爆発とかしませんよね？」'},
 {cls:'',text:'ルークが水晶へ手を置く。\n\n…………。\n\n何も起きない。'},
 {cls:'white',text:'ルーク「ほら、やっぱり僕じゃ――」\n\nその瞬間。大神殿が白い光に飲み込まれた。'},
 {cls:'blue',text:'白は蒼へ。蒼い光が水晶の奥から何層にも押し寄せる。'},
 {cls:'gold',text:'さらに金の光が重なる。\n通常の選定反応とは明らかに違う。神官たちが顔を見合わせる。'},
 {cls:'dark',text:'ほんの一瞬。\n光の中心を、記録にない暗い脈動が横切った。'},
 {cls:'gold',text:'エレノアの微笑みが、一瞬だけ消える。\n\n神官「……これは……何だ？」'},
 {cls:'',text:'ルーク「えっと。壊した場合、弁償ですか？」\n\n張りつめた大神殿に、場違いなほど小さな笑いが漏れた。'},
 {cls:'',text:'神官「判定を保留する。これほど複雑な反応は記録にない。」\n\nルーク「保留。いい言葉ですね。帰っていいですか？」'},
 {cls:'',text:'エレノア「……式を続けてください。」\n\n声は穏やかだった。だが視線だけは、水晶から離れない。'},
 {cls:'dark',text:'式場の外。誰にも聞こえない声で。\n\nエレノア「……あの子を見ていて。まだ、何も決めつけないで。」'}
];
function renderFG(){installStyle();document.body.classList.remove('lqWorldFullscreen');const sc=scenes[Math.min(fg.step,scenes.length-1)];app.innerHTML=`<main class="lqReq118FG ${sc.cls}" data-req118-phase="${FG_ACTIVE}"><section class=lqReq118FGCard><div class=lqReq118Temple><div class=lqReq118Crystal>🔷</div><div class=lqReq118Priest><b>🧙‍♂️</b>大神官</div><div class=lqReq118Luke>🧑‍🦱</div><div class=lqReq118EleanorFG><b>👩‍🦳</b>エレノア</div></div><div class=lqReq118FGCaption>${sc.text}</div><button id=lqReq118FGNext type=button>${fg.step===scenes.length-1?'式場を出る':'つづける'}</button></section></main>`;document.getElementById('lqReq118FGNext')?.addEventListener('click',()=>window.lqReq118FGNext(),{once:true});}
function startFG(){const f=flags();if(!f||f[DONE_KEY]||phase()!==DE_DONE)return false;if(typeof stopMoving==='function')stopMoving();fg={step:0};f[PHASE_KEY]=FG_ACTIVE;s.dialog=null;s.screen=SCREEN;safeSave();render();return true;}
window.lqReq118FGNext=function(){if(typeof s==='undefined'||s.screen!==SCREEN||phase()!==FG_ACTIVE)return;if(fg.step<scenes.length-1){fg.step++;render();return;}const f=flags();f[PHASE_KEY]=FG_DONE;s.screen='world';s.map='town';s.x=9;s.y=7;s.dir='down';s.dialog={name:'ルーク',text:'「保留で助かった……と思っていいのかな。」\n神殿の外が、なにやら騒がしい。'};safeSave();render();};
installStyle();
if(typeof render==='function'){const baseRender=render;render=function(){if(typeof s!=='undefined'&&s.screen===SCREEN&&phase()===FG_ACTIVE){if(typeof stopMoving==='function')stopMoving();renderFG();return;}return baseRender.apply(this,arguments);};}
if(typeof action==='function'){const baseAction=action;action=function(){if(typeof s!=='undefined'&&s.screen==='world'&&s.map==='town'&&phase()===DE_DONE&&!s.dialog){if(startFG())return;}return baseAction.apply(this,arguments);};}
function stableSnapshot(){return JSON.stringify({hp:s.hp,maxHp:s.maxHp,mp:s.mp,maxMp:s.maxMp,exp:s.exp,gold:s.gold,herbs:s.herbs,smoke:s.smoke,atk:s.atk,def:s.def,level:s.level,wins:s.wins,equipment:s.equipment,keyItems:s.keyItems});}
function smoke(){if(typeof s==='undefined'||!window.LQ_REQ118_OPENING_TEST)return;const snap=structuredClone(s);const raw=localStorage.getItem('lukeQuestV2');const marker=document.createElement('i');marker.id='lqReq118FGMarker';marker.hidden=true;try{Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,structuredClone(DEFAULT));s.flags.req118OpeningPhase=DE_DONE;s.flags.req118OpeningComplete=false;s.screen='world';s.map='town';s.dialog=null;const before=stableSnapshot();if(!startFG())throw new Error('D+E->F+G transition failed');let abnormal=false,dark=false,comedy=false,hold=false,watch=false;for(let i=0;i<scenes.length;i++){const t=scenes[Math.min(fg.step,scenes.length-1)].text;abnormal ||= t.includes('通常の選定反応とは明らかに違う');dark ||= t.includes('暗い脈動');comedy ||= t.includes('弁償');hold ||= t.includes('判定を保留');watch ||= t.includes('何も決めつけないで');window.lqReq118FGNext();}if(!abnormal||!dark||!comedy||!hold||!watch)throw new Error('required F+G beats missing');if(phase()!==FG_DONE||s.screen!=='world'||s.map!=='town')throw new Error('F+G completion invalid');if(stableSnapshot()!==before)throw new Error('F+G mutated canonical progression');const all=scenes.map(x=>x.text).join('\n');if(/勇者。?ルーク|勇者ルーク|ルーク.*勇者に選/.test(all))throw new Error('Hero confirmation leaked into F+G');marker.dataset.status='PASS';marker.dataset.abnormalCrystal='true';marker.dataset.darkPulse='true';marker.dataset.heroConfirmed='false';marker.dataset.comedy='true';marker.dataset.eleanorConcern='true';marker.dataset.progressionIsolated='true';}catch(e){marker.dataset.status='FAIL';marker.dataset.error=e?.message||String(e);console.error(e);}finally{Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snap);fg={step:0};if(raw===null)localStorage.removeItem('lukeQuestV2');else localStorage.setItem('lukeQuestV2',raw);render();document.body.appendChild(marker);}}
window.LQ_REQ118_OPENING_FG_STATUS={requirement:REQ,checkpoint:'F+G',status:'IN_PROGRESS',abnormalCrystal:true,mixedReaction:true,subtleDarkPulse:true,heroConfirmed:false,lukeComedy:true,eleanorConcern:true,canonicalProgressionMutation:false,iosPhysicalVerification:'PENDING'};
window.LQ_REQ118_OPENING_FG_TEST={startFG,phase,smoke,stableSnapshot};
if(new URLSearchParams(location.search).get('lqReq118FGSmoke')==='1')setTimeout(smoke,6800);
})();
