(() => {
'use strict';

/* Collision-safe add-on: spoiler-safe main objective / discovered clues / side-quest journal. */
const style=document.createElement('style');style.textContent=`
.lqAdventureJournalSection{position:relative;overflow:hidden}.lqJournalLead{margin:2px 0 7px;color:#8299aa;font-size:7px;letter-spacing:.08em}.lqJournalBlock{margin:6px 0;padding:8px;border-radius:9px;background:linear-gradient(145deg,#0a1b29,#10283a);border:1px solid #ffffff12;box-shadow:inset 0 1px #ffffff08}.lqJournalBlock.main{border-color:#d4b75f44;background:linear-gradient(145deg,#242013,#15283a)}.lqJournalLabel{display:flex;align-items:center;gap:5px;margin-bottom:4px;color:#8299aa;font-size:6px;font-weight:950;letter-spacing:.13em}.lqJournalLabel .mark{display:inline-grid;place-items:center;width:16px;height:16px;border-radius:50%;background:#203e56;color:#dbe7ed;font-size:8px}.lqJournalBlock.main .mark{background:#5a4c20;color:#ffe797}.lqJournalMainText{color:#f0e3b2;font-size:10px;font-weight:850;line-height:1.55}.lqJournalRows{display:grid;gap:5px}.lqJournalRow{position:relative;padding:6px 7px 6px 23px;border-radius:7px;background:#081620;border:1px solid #ffffff0d;color:#c5d2da;font-size:8px;line-height:1.45}.lqJournalRow:before{content:'◆';position:absolute;left:8px;top:7px;color:#62869d;font-size:7px}.lqJournalRow.done{color:#9fc9a6;border-color:#5e9c6b22}.lqJournalRow.done:before{content:'✓';color:#74b981}.lqJournalEmpty{padding:6px 7px;border-radius:7px;background:#081620;color:#667f90;font-size:8px}.lqJournalProgress{display:inline-block;margin-left:5px;padding:1px 5px;border-radius:99px;background:#173349;color:#91b8cf;font-size:6px;font-weight:900}@media(max-width:390px){.lqJournalBlock{padding:7px}.lqJournalMainText{font-size:9px}.lqJournalRow,.lqJournalEmpty{font-size:7px}}
`;document.head.appendChild(style);

function mainGoal(state=s){
 const flags=state?.flags||{};
 const wins=state===s?s.wins:state?.wins;
 if(flags.withdrawProofSeen&&state?.map==='skylineTraverse')return'北尾根・雲裂きの稜線で新しい足跡を追い、さらに高みへ折れる踏み跡を確認する。';
 if(flags.withdrawProofSeen&&state?.map==='windShelf')return'北尾根・風蝕の岩棚で新しい足跡を追い、さらに高みへ続く細道を確認する。';
 if(flags.withdrawProofSeen&&state?.map==='northRidgeApproach')return'北尾根・岩棚道で新しい靴跡を追い、さらに北へ続く岩棚を確認する。';
 if(flags.withdrawProofSeen&&state?.map==='windcutPass')return'風切り峠でレオンの痕跡を追い、北へ続く尾根道を確認する。';
 if(flags.withdrawProofSeen&&state?.map==='northCliffRoad')return'北の崖道で新しい足跡を追い、北側へ続く道を確認する。';
 if(flags.withdrawProofSeen)return'北の崖道へ向かい、レオンを追う。';
 if(flags.evacEntered)return'北の退避路でレオンと魔王軍の痕跡を調べる。';
 if(flags.glennSeen)return'北の封鎖線を越えてレオンを追う。';
 if(flags.observationEntered)return'監視区域でグレン隊長を探す。';
 if(flags.glennTraceSeen)return'北の魔王軍監視区域へ進む。';
 if(flags.mistEntered)return'霧の追跡路で魔王軍の痕跡を調べる。';
 if(flags.leonSeen)return'レオンを追って北の霧へ入る。';
 if((wins||0)<2)return'王都近郊で2勝し、魔物の森へ入る。';
 if(state?.map==='field')return'北東の魔物の森へ向かう。';
 if(state?.map==='forest')return'森の北側から深部へ進む。';
 return'深部でレオンの痕跡を追う。';
}

function discoveredClues(){
 const rows=[];
 if(s.flags?.leonSeen)rows.push('森深部でレオン本人を発見。レオンは「まだ戻れない」と言い、北の霧へ逃げた。');
 if(s.flags?.glennTraceSeen)rows.push('魔王軍の命令標から、勇者候補への直接接触が禁じられていることを確認。');
 if(s.flags?.glennSeen)rows.push('グレン隊長が部下に、レオンを追い詰めず北へ逃げ道を残すよう命じていた。');
 if(s.flags?.leonInjurySeen)rows.push('北の退避路でレオンの新しい負傷痕と、再び北へ進んだ足跡を確認。');
 if(s.flags?.escapeProofSeen)rows.push('北側通路の封鎖杭がグレン隊長命令で外され、逃げ道が確保されていた。');
 if(s.flags?.withdrawProofSeen)rows.push('魔王軍の撤収命令に「レオンへの追撃禁止」と記されていることを確認。');
 return rows;
}

function sideQuests(){
 const rows=[];
 if(s.flags?.elderCharmComplete)rows.push({done:true,text:'旅好きの老人の銀留め具',detail:'返却完了'});
 else if(s.flags?.elderCharmQuest)rows.push({text:'旅好きの老人の銀留め具',detail:s.flags?.elderCharmFound?'銀留め具を老人へ返す':'王都近郊で銀留め具を探す'});
 if(s.flags?.forestBountyComplete)rows.push({done:true,text:'森の討伐依頼',detail:'報酬受取完了'});
 else if(s.flags?.forestBountyAccepted){const kills=Math.min(3,Number(s.forestBountyKills)||0);rows.push({text:'森の討伐依頼',detail:kills>=3?'討伐掲示板で報酬を受け取る':`森の魔物を討伐する ${kills}/3`,progress:`${kills}/3`});}
 if(s.flags?.lqHerbSampleQuestDone)rows.push({done:true,text:'森の薬草標本',detail:'神殿見習いへ届けた'});
 else if(s.flags?.lqHerbSampleQuestAsked)rows.push({text:'森の薬草標本',detail:s.flags?.forestClearingHerbHarvested?'森の薬草標本を神殿見習いへ届ける':'森入口の木漏れ日の空地で薬草を探す'});
 if(s.flags?.forestMiniBossDefeated)rows.push({done:true,text:'苔角の森王',detail:'森の主を討伐した'});
 else if(s.flags?.forestMiniBossWarned)rows.push({text:'巨大な蹄跡',detail:'魔物の森・入口で巨大な蹄跡をもう一度調べる'});
 return rows;
}

function esc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function addJournal(){
 if(!s.pauseOpen||s.screen!=='world')return;
 const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqAdventureJournalSection'))return;
 const clues=discoveredClues(),sides=sideQuests();
 const clueHtml=clues.length?`<div class=lqJournalRows>${clues.map(x=>`<div class=lqJournalRow>${esc(x)}</div>`).join('')}</div>`:'<div class=lqJournalEmpty>まだ記録できる決定的な手掛かりはありません。</div>';
 const sideHtml=sides.length?`<div class=lqJournalRows>${sides.map(q=>`<div class="lqJournalRow${q.done?' done':''}"><b>${esc(q.text)}</b><br>${esc(q.detail)}${q.progress?`<span class=lqJournalProgress>${esc(q.progress)}</span>`:''}</div>`).join('')}</div>`:'<div class=lqJournalEmpty>進行中のサブクエストはありません。</div>';
 const sec=document.createElement('div');sec.className='lqPauseSection lqAdventureJournalSection';sec.innerHTML=`<h3>ADVENTURE JOURNAL</h3><div class=lqJournalLead>いま追うべき道と、ルークが自分の目で確認した事実だけを記録。</div><div class="lqJournalBlock main"><div class=lqJournalLabel><span class=mark>!</span>MAIN OBJECTIVE</div><div class=lqJournalMainText>${esc(mainGoal())}</div></div><div class=lqJournalBlock><div class=lqJournalLabel><span class=mark>?</span>DISCOVERED CLUES</div>${clueHtml}</div><div class=lqJournalBlock><div class=lqJournalLabel><span class=mark>+</span>SIDE QUESTS</div>${sideHtml}</div>`;
 const buttons=panel.querySelector('.lqPauseButtons');if(buttons)panel.insertBefore(sec,buttons);else panel.appendChild(sec);
}
function defer(){queueMicrotask(addJournal);}
const worldJ=world;world=function(){worldJ();defer();};const renderJ=render;render=function(){const r=renderJ();defer();return r;};
window.LQ_ADVENTURE_JOURNAL_STATUS={mainObjective:true,discoveredClues:true,sideQuests:['elderCharm','forestBounty','forestHerbSample','forestMiniBoss'],spoilerSafe:true,menuIntegrated:true,northCliffLocationAware:true,windcutPassLocationAware:true,northRidgeApproachLocationAware:true,windShelfLocationAware:true,skylineTraverseLocationAware:true};
window.LQ_ADVENTURE_JOURNAL_TEST={sideQuests,mainGoal};
defer();
})();
