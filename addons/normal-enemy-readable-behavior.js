(() => {
'use strict';

/* Readable ordinary-enemy behavior. Keeps canonical enemyTurn/guard/poison chain authoritative. */
const EXCLUDED_BOSSES=new Set(['苔角の森王']);
const PRESSURE=new Set(['ツノウサギ','木霊ウルフ','泥鎧イノシシ','灰爪ハウンド','黒甲ムカデ','退避路オオカミ']);
const BURST=new Set(['闇カラス','苔むしコウモリ','霧まといキツネ','樹皮トカゲ','夜歩きフクロウ','霧喰いヤマネコ','灰羽トンビ','監視フクロウ','石羽コンドル']);
let normalEnemyTurn=0;

function isExcludedBoss(enemy){return !!enemy&&(EXCLUDED_BOSSES.has(enemy.n)||enemy.isBoss===true||enemy.boss===true);}
function behaviorFor(name){
 if(PRESSURE.has(name))return{kind:'PRESSURE',cadence:3,multiplier:1.22,label:'圧力攻撃'};
 if(BURST.has(name))return{kind:'BURST',cadence:4,multiplier:1.34,label:'溜め攻撃'};
 return{kind:'STEADY',cadence:0,multiplier:1,label:'通常攻撃'};
}
function isStrongTurn(turn,behavior){return !!behavior?.cadence&&turn>0&&turn%behavior.cadence===0;}
function boostedRange(range,multiplier){
 if(!Array.isArray(range)||range.length<2)return range;
 const lo=Number(range[0]),hi=Number(range[1]);
 if(!Number.isFinite(lo)||!Number.isFinite(hi))return range;
 return[Math.max(0,Math.ceil(lo*multiplier)),Math.max(0,Math.ceil(hi*multiplier))];
}
function nextIntent(){
 if(s.screen!=='battle'||!s.enemy||isExcludedBoss(s.enemy))return null;
 const behavior=behaviorFor(s.enemy.n),turn=normalEnemyTurn+1,strong=isStrongTurn(turn,behavior);
 return{turn,kind:behavior.kind,strong,label:strong?behavior.label:'通常攻撃',text:strong?'次の敵行動は強め。ぼうぎょが有効です。':'大きな予兆はない。通常攻撃の構え。'};
}

const style=document.createElement('style');style.textContent=`
.lqNormalEnemyIntent{margin:5px auto 7px;padding:5px 8px;max-width:320px;border-radius:8px;background:#132131;border:1px solid #6f8ba444;color:#aebfce;font-size:8px;font-weight:850;text-align:center;letter-spacing:.03em}.lqNormalEnemyIntent strong{color:#d8e5ec}.lqNormalEnemyIntent.strong{background:#35221d;border-color:#c8795a66;color:#edb7a1}.lqNormalEnemyIntent.strong strong{color:#ffd09e}.lqNormalEnemyIntent .turn{opacity:.68;margin-left:5px;font-size:7px}
`;
document.head.appendChild(style);

function addIntent(){
 app.querySelectorAll('.lqNormalEnemyIntent').forEach(n=>n.remove());
 const intent=nextIntent();if(!intent)return;
 const name=app.querySelector('.enemyName');if(!name)return;
 const el=document.createElement('div');el.className=`lqNormalEnemyIntent ${intent.strong?'strong':''}`;
 el.innerHTML=`<strong>${intent.label}</strong><span class=turn>NEXT ${intent.turn}</span><br>${intent.text}`;
 name.insertAdjacentElement('afterend',el);
}

const startNormalAiBase=startBattle;startBattle=function(...args){
 const r=startNormalAiBase.apply(this,args);
 if(s.screen==='battle'&&s.enemy&&!isExcludedBoss(s.enemy))normalEnemyTurn=0;
 requestAnimationFrame(addIntent);return r;
};

const enemyTurnNormalAiBase=enemyTurn;enemyTurn=function(g=false){
 if(s.screen!=='battle'||!s.enemy||isExcludedBoss(s.enemy))return enemyTurnNormalAiBase(g);
 normalEnemyTurn++;
 const enemy=s.enemy,behavior=behaviorFor(enemy.n),strong=isStrongTurn(normalEnemyTurn,behavior);
 if(!strong){const r=enemyTurnNormalAiBase(g);requestAnimationFrame(addIntent);return r;}
 const originalRange=enemy.a,temporaryRange=boostedRange(originalRange,behavior.multiplier);
 enemy.a=temporaryRange;
 s.log.push(`${enemy.n}は予告どおり${behavior.label}を放つ！`);
 try{return enemyTurnNormalAiBase(g);}finally{enemy.a=originalRange;requestAnimationFrame(addIntent);}
};

const battleNormalAiBase=battle;battle=function(){const r=battleNormalAiBase();addIntent();return r;};
const renderNormalAiBase=render;render=function(){const r=renderNormalAiBase();if(s.screen!=='battle')normalEnemyTurn=0;addIntent();return r;};

window.LQ_NORMAL_ENEMY_BEHAVIOR_STATUS={
 readableIntent:true,bossExcluded:true,canonicalEnemyTurnPreserved:true,guardPassthrough:true,battleLocalCounter:true,
 archetypes:{pressure:{cadence:3,multiplier:1.22},burst:{cadence:4,multiplier:1.34},steady:{cadence:0,multiplier:1}},
 behaviorFor,isStrongTurn,boostedRange,isExcludedBoss,nextIntent,
 getTurn:()=>normalEnemyTurn
};
addIntent();
})();
