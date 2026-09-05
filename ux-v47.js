(() => {
'use strict';

/* LUKE QUEST v0.47 investigation journal.
   Turns discovered story evidence into a readable mystery-progress layer without revealing hidden canon. */

const CLUES=[
 {when:()=>!!s.flags?.leonSeen,title:'逃げたレオン',text:'森の深部で本人を発見。怯えているが、単に自分を守るためだけに逃げている様子ではない。'},
 {when:()=>!!s.flags?.glennTraceSeen,title:'接触禁止命令',text:'魔王軍はレオンを見張っているのに、直接接触を禁じられている。命令を出した「グレン隊長」の意図は不明。'},
 {when:()=>!!s.flags?.observationEntered,title:'警報の鳴らない監視区域',text:'勇者が侵入しても即座に襲撃されない。監視と攻撃が明確に分けられている。'},
 {when:()=>!!s.flags?.glennSeen,title:'グレンの不可解な態度',text:'敵軍の隊長グレンはルークを排除せず、むしろ「ここで死ぬな」と警告した。'},
 {when:()=>!!s.flags?.leonInjurySeen,title:'立ち上がった血痕',text:'退避路でレオンの負傷痕を発見。片膝をついた後、再び北へ進んでいる。'},
 {when:()=>!!s.flags?.escapeProofSeen,title:'外された封鎖杭',text:'封鎖設備はレオンを止めるためではなく、北へ通すように外されていた。グレン隊長命令の札が残る。'},
 {when:()=>!!s.flags?.withdrawProofSeen,title:'追撃禁止と退路確保',text:'魔王軍の正式な撤収命令を発見。レオンを追撃せず、北の退避路を空けたまま後退するよう命じている。'}
];

const style=document.createElement('style');
style.textContent=`
.lqClueJournal{position:relative;overflow:hidden}.lqClueJournal:before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(#b48b49,#5d4930)}
.lqClueCount{float:right;color:#8ea5b8;font-size:9px;letter-spacing:0}.lqClueList{display:grid;gap:6px}.lqClue{position:relative;background:linear-gradient(90deg,#101f2b,#0b1823);border:1px solid #ffffff12;border-radius:8px;padding:7px 8px 7px 28px}.lqClue:before{content:"?";position:absolute;left:7px;top:8px;width:15px;height:15px;border-radius:50%;display:grid;place-items:center;background:#604e2e;color:#ffe69b;font-size:9px;font-weight:950;border:1px solid #b59a55}.lqClue b{display:block;color:#f1db91;font-size:10px;margin-bottom:2px}.lqClue span{display:block;color:#bdc9d2;font-size:9px;line-height:1.45}.lqClueEmpty{color:#71889b;font-size:9px;line-height:1.5;padding:4px}
`;
document.head.appendChild(style);

function addClueJournal(){
 if(!s.pauseOpen||s.screen!=='world')return;
 const panel=app.querySelector('.lqPausePanel');if(!panel||panel.querySelector('.lqClueJournal'))return;
 const found=CLUES.filter(c=>c.when());
 const section=document.createElement('div');section.className='lqPauseSection lqClueJournal';
 section.innerHTML=`<h3>INVESTIGATION <span class=lqClueCount>${found.length}/${CLUES.length}</span></h3><div class=lqClueList>${found.length?found.map(c=>`<div class=lqClue><b>${c.title}</b><span>${c.text}</span></div>`).join(''):'<div class=lqClueEmpty>まだ決定的な手掛かりはない。レオンの行動と魔王軍の痕跡を追おう。</div>'}</div>`;
 const buttons=panel.querySelector('.lqPauseButtons');if(buttons)panel.insertBefore(section,buttons);else panel.appendChild(section);
}

const worldV46=world;world=function(){worldV46();addClueJournal();};
const renderV46=render;render=function(){const r=renderV46();if(s.pauseOpen)addClueJournal();return r;};
window.LQ_CLUE_JOURNAL_STATUS={entries:CLUES.length,spoilerSafe:true};
if(s.pauseOpen)addClueJournal();
})();
