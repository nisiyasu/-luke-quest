(() => {
'use strict';

/* LUKE QUEST collision-safe add-on: situational victory banter.
   Preserves the original 60-line pool and adds 30 context lines for close wins, quick wins and herb-use battles. */
const SITUATIONAL={
 close:['今のは危なかった……。勝った実感より、まだ立ってる安心感の方が大きいです。','HPの数字、見ないふりしてました。終わったので今なら見られます。','あと一発もらってたら宿屋直行でした。いや、たぶん担架で。','怖い時ほど足が止まりそうになる。でも今回は止まりませんでした。','勝利というより生還……でも、生還できたなら立派な勝利ですよね。','膝が笑ってます。僕は笑えません。とりあえず薬草の残りを確認します。','ギリギリだった。次はもう少し格好よく……いや、安全に勝ちたいです。','本当に危なかった。でも誰かが後ろにいたら、やっぱり逃げられなかったと思います。','心臓の音が戦闘BGMより大きかったです。終わってよかった……。','今の戦いは忘れません。できれば同じ目には二度と遭いたくないですが。'],
 herb:['薬草、偉い。勇者よりずっと安定して仕事してます。','回復してなかったら危なかったですね。持ち物確認、大事です。本当に。','薬草の味には慣れません。でも生きてる味だと思えば……やっぱり苦い。','回復する判断、今回は正解でした。格好よさより生存率です。','薬草を使った分まで働きました。元は取れた……はず。','持っててよかった薬草。ミナには今度、少しだけ素直にお礼を言います。','戦いの途中で草を食べる勇者像、誰が想像したんでしょうね。助かりましたけど。','回復して、立て直して、勝つ。僕にしてはかなり計画的でした。','薬草一個で勇気まで回復した気がします。成分表に書いてませんけど。','使えるものは使う。勇者だからって無傷で勝つ必要はないですよね。'],
 quick:['え、もう終わり？ ……こういう戦闘なら毎日でも。いや毎日は嫌です。','今の、かなり綺麗に決まりました。誰か見てました？','速く終わると怖がる暇もないんですね。これは発見です。','あっという間でした。僕、ちょっとだけ強者っぽくなってません？','今の一戦だけ切り抜けば、かなり勇者です。前後は見せない方向で。','よし、快勝！ ……言ってみたかったんです、その言葉。','剣が迷わず動きました。本人はいつも通り少し迷ってました。','短期決戦、大歓迎です。心臓への福利厚生として。','今の敵には悪いけど、自信を少し置いていってもらいます。','こういう勝ち方が増えたら、勇者業も……いや、好きにはならないですけど。']
};
function resetMeta(){s.lqBattleMeta={turns:0,herbUsed:false};}
const startBattleA=startBattle;startBattle=function(){resetMeta();return startBattleA();};
const attackA=attack;attack=function(){if(s.screen==='battle'){s.lqBattleMeta=s.lqBattleMeta||{};s.lqBattleMeta.turns=(s.lqBattleMeta.turns||0)+1;}return attackA();};
const guardA=guard;guard=function(){if(s.screen==='battle'){s.lqBattleMeta=s.lqBattleMeta||{};s.lqBattleMeta.turns=(s.lqBattleMeta.turns||0)+1;}return guardA();};
const potionA=potion;potion=function(){if(s.screen==='battle'){s.lqBattleMeta=s.lqBattleMeta||{};s.lqBattleMeta.turns=(s.lqBattleMeta.turns||0)+1;s.lqBattleMeta.herbUsed=true;}return potionA();};
if(window.lqFocusSlash){const skillA=window.lqFocusSlash;window.lqFocusSlash=function(){if(s.screen==='battle'){s.lqBattleMeta=s.lqBattleMeta||{};s.lqBattleMeta.turns=(s.lqBattleMeta.turns||0)+1;}return skillA();};}
function contextual(meta,hpRatio){let key=null;if(hpRatio<=.3)key='close';else if(meta?.herbUsed)key='herb';else if((meta?.turns||99)<=2)key='quick';if(!key)return null;const blocked=new Set(Array.isArray(s.recentVictoryLines)?s.recentVictoryLines.slice(-8):[]),pool=SITUATIONAL[key].filter(x=>!blocked.has(x)),src=pool.length?pool:SITUATIONAL[key];return src[Math.floor(Math.random()*src.length)];}
const winA=win;win=function(){const meta={...(s.lqBattleMeta||{})},ratio=s.hp/Math.max(1,s.mh);const r=winA();if(!s.victoryResult?.bossReward&&s.dialog?.name==='ルーク'&&Math.random()<.7){const line=contextual(meta,ratio);if(line){s.dialog.text=line;s.recentVictoryLines=Array.isArray(s.recentVictoryLines)?s.recentVictoryLines:[];s.recentVictoryLines.push(line);s.recentVictoryLines=s.recentVictoryLines.slice(-8);save();render();}}return r;};
window.LQ_VICTORY_LINE_COUNT=Math.max(Number(window.LQ_VICTORY_LINE_COUNT)||60,90);window.LQ_SITUATIONAL_BANTER_STATUS={close:10,herb:10,quick:10,last8Protection:true,bossDialogueProtected:true};
})();
