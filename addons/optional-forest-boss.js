(() => {
'use strict';

/* Collision-safe add-on: optional post-bounty mini-boss.
   Independent of locked main-story canon and does not replace the future Glenn/main bosses. */
const BOSS={n:'苔角の森王',e:'',hp:72,a:[7,11],xp:45,g:60};
const TRACE={x:3,y:4,e:'',name:'巨大な蹄跡',kind:'lqForestBossTrace',text:''};
s.flags=s.flags||{};s.flags.forestMiniBossWarned??=false;s.flags.forestMiniBossDefeated??=false;s.keyItems=Array.isArray(s.keyItems)?s.keyItems:[];
if(!MAPS.forest.npcs.some(n=>n.kind===TRACE.kind))MAPS.forest.npcs.push({...TRACE});

const visibleBossBase=visibleNpcs;visibleNpcs=function(m){return visibleBossBase(m).filter(n=>n.kind!==TRACE.kind||s.flags.forestBountyComplete&&!s.flags.forestMiniBossDefeated);};
const npcClassBossBase=npcClass;npcClass=function(n){return n?.kind===TRACE.kind?'npc lqBossTrace':npcClassBossBase(n);};
const style=document.createElement('style');style.textContent=`
.lqBossTrace{width:44px;height:44px;font-size:0;filter:drop-shadow(0 4px 4px #0008)}.lqBossTrace:before{content:"";position:absolute;left:7px;top:13px;width:30px;height:24px;border-radius:55% 55% 45% 45%;background:#392d24cc;box-shadow:inset 0 0 0 3px #6b5541,0 0 9px #7b5c3888}.lqBossTrace:after{content:"";position:absolute;left:12px;top:6px;width:20px;height:16px;border-left:5px solid #70523a;border-right:5px solid #70523a;border-radius:50%;transform:rotate(4deg)}
.lqForestBossSvg{width:185px;height:176px;overflow:visible;filter:drop-shadow(0 10px 7px #000a)}.lqBossAura{position:absolute;inset:10% 12%;border-radius:50%;background:radial-gradient(circle,#8dba5525,transparent 65%);filter:blur(5px);animation:lqBossAura 1.7s ease-in-out infinite alternate}@keyframes lqBossAura{to{transform:scale(1.08);opacity:.55}}.enemyPlate.lqMiniBossPlate{border-color:#9ab85f66!important;box-shadow:inset 0 0 24px #7e9b4317}.lqBossReward{margin:6px 0;padding:7px 9px;border-radius:8px;background:#26331d;border:1px solid #a9c36155;color:#dce9ad;font-size:9px;font-weight:900;text-align:left}
`;document.head.appendChild(style);

const BOSS_SVG=`<svg class="lqForestBossSvg" viewBox="0 0 210 190" aria-label="苔角の森王"><defs><linearGradient id="lqfbfur" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7b7657"/><stop offset=".55" stop-color="#4c5138"/><stop offset="1" stop-color="#293324"/></linearGradient><linearGradient id="lqfba" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d5c08a"/><stop offset="1" stop-color="#756444"/></linearGradient></defs><ellipse cx="108" cy="174" rx="72" ry="10" fill="#07100988"/><path d="M54 124 Q43 83 66 55 Q84 31 112 33 Q145 34 164 64 Q183 96 160 132 Q144 161 106 166 Q70 164 54 124Z" fill="url(#lqfbfur)" stroke="#9aa377" stroke-width="5"/><path d="M73 62 Q52 39 50 13 Q72 28 86 51 M137 55 Q153 30 173 17 Q169 43 151 67" fill="none" stroke="url(#lqfba)" stroke-width="10" stroke-linecap="round"/><path d="M74 54 Q57 49 44 36 M82 48 Q69 30 68 16 M145 55 Q161 46 176 38 M137 48 Q147 29 146 15" fill="none" stroke="#b8a272" stroke-width="5" stroke-linecap="round"/><ellipse cx="106" cy="92" rx="51" ry="43" fill="#5d6244" stroke="#8b9168" stroke-width="4"/><path d="M62 69 Q84 48 107 56 Q135 49 157 73 Q143 63 137 87 Q113 77 85 88 Q76 66 62 69Z" fill="#365232"/><circle cx="82" cy="91" r="8" fill="#f0d36b"/><circle cx="131" cy="91" r="8" fill="#f0d36b"/><circle cx="84" cy="89" r="3" fill="#fff4b5"/><circle cx="133" cy="89" r="3" fill="#fff4b5"/><path d="M93 111 Q106 119 120 110 L116 128 Q105 136 95 127Z" fill="#302b24"/><path d="M68 134 Q79 161 81 176 M145 133 Q137 159 137 176" stroke="#4b4a34" stroke-width="13" stroke-linecap="round"/><path d="M42 116 Q20 105 13 86 Q39 91 59 105 M168 111 Q190 96 202 79 Q188 111 158 125" fill="#4b5a39" stroke="#76805a" stroke-width="4"/><circle cx="74" cy="58" r="5" fill="#82a253"/><circle cx="145" cy="61" r="4" fill="#a2bd63"/><circle cx="62" cy="122" r="4" fill="#7da150"/></svg>`;

function traceAhead(){if(s.screen!=='world'||s.map!=='forest')return false;const p=front();return currentNpcs().some(n=>n.x===p.x&&n.y===p.y&&n.kind===TRACE.kind);}
function startBoss(){stopMoving();s.enemy=BOSS;s.ehp=BOSS.hp;s.log=['苔角の森王が森を揺らして現れた！'];s.screen='battle';s.lqFocusSlashUsed=false;s.lqBattleMeta={turns:0,herbUsed:false};s.status=s.status||{};s.status.poison=0;if(Array.isArray(s.seenEnemies)&&!s.seenEnemies.includes(BOSS.n))s.seenEnemies.push(BOSS.n);save();render();}
function useTrace(){
 if(!s.flags.forestMiniBossWarned){s.flags.forestMiniBossWarned=true;save();stopMoving();s.dialog={name:'巨大な蹄跡',text:'普通の魔物とは比べものにならない大きな跡だ。森の奥から低いうなり声が響く。\nもう一度この跡を調べれば、森の主を呼び出せそうだ。\nルーク「できれば呼び出したくない情報まで分かりました。」'};return render();}
 return startBoss();
}
const actionBossBase=action;action=function(){if(!s.dialog&&traceAhead())return useTrace();return actionBossBase();};
function applyBossArt(){if(s.screen!=='battle'||s.enemy?.n!==BOSS.n)return;const target=app.querySelector('.enemySpriteStage .enemy');if(target&&!target.querySelector('.lqForestBossSvg')){target.innerHTML=BOSS_SVG;target.dataset.lqFormalStage='original-vector-optional-boss';const aura=document.createElement('div');aura.className='lqBossAura';target.parentElement?.prepend(aura);}app.querySelector('.enemyPlate')?.classList.add('lqMiniBossPlate');}
const winBossBase=win;win=function(){const isBoss=s.enemy?.n===BOSS.n;const r=winBossBase();if(isBoss){s.flags.forestMiniBossDefeated=true;if(!s.keyItems.includes('森王の角'))s.keyItems.push('森王の角');if(s.victoryResult)s.victoryResult.bossReward='森王の角';s.dialog={name:'ルーク',text:'森の主まで倒しちゃった……。怖かったけど、街道を使う人がこれで少し安全になるなら、まあ……やった意味はあります。'};save();render();}return r;};
function addBossReward(){const v=s.victoryResult;if(!v?.bossReward)return;const panel=app.querySelector('.lqVictoryPanel');const rewards=panel?.querySelector('.lqVictoryRewards');if(!panel||!rewards||panel.querySelector('.lqBossReward'))return;const d=document.createElement('div');d.className='lqBossReward';d.textContent=`KEY ITEM　${v.bossReward}`;rewards.after(d);}
function addKeyItem(){if(!s.pauseOpen||!s.keyItems.length)return;const row=app.querySelector('.lqInventoryRow');if(!row||row.querySelector('.lqBossKeyItem'))return;const c=document.createElement('div');c.className='lqItemChip lqBossKeyItem';c.innerHTML=`森王の角 <strong>KEY</strong>`;row.appendChild(c);}
const battleBossBase=battle;battle=function(){const r=battleBossBase();applyBossArt();return r;};const worldBossBase=world;world=function(){worldBossBase();addBossReward();addKeyItem();};const renderBossBase=render;render=function(){const r=renderBossBase();applyBossArt();addBossReward();addKeyItem();return r;};
window.LQ_OPTIONAL_BOSS_STATUS={forestLord:{unlocksAfterBounty:true,hp:BOSS.hp,reward:'森王の角',mainStoryBoss:false}};
if(s.screen==='world')render();
})();
