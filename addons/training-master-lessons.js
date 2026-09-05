(() => {
'use strict';

/* Tutorial content add-on: the training master gives concise, state-aware battle lessons. */
function masterAhead(){if(s.screen!=='world'||s.map!=='trainingYard')return false;const p=front();return currentNpcs().some(n=>n.x===p.x&&n.y===p.y&&n.kind==='lqTrainingMaster');}
function lesson(){
 stopMoving();
 let text;
 if((s.hp||0)<=Math.ceil((s.mh||1)*.35))text='「まず宿か薬草だ。瀕死で訓練を始めるな。勇気と無謀は別物だ。」\nルーク「今の僕、無謀側だったんですね……。」';
 else if((s.potions||0)<=0)text='「薬草ゼロで森へ行くな。勝てる相手にも事故はある。」\nルーク「“事故”って言葉、急に現実味が強いです。」';
 else if((s.wins||0)<2)text='「最初は攻撃だけで押すな。敵の一撃が重い時は、ぼうぎょで半分受ける癖をつけろ。」\nルーク「盾の後ろ、僕かなり得意です。」';
 else if((s.lv||1)<3)text='「勝てるようになった時が一番危ない。HPと薬草を見てから次へ進め。」\nルーク「調子に乗る前に止められました。」';
 else if(window.LQ_TECHNIQUE_STATUS)text='「技は強いが、使いどころを決めろ。雑魚に全部見せる必要はない。」\nルーク「必殺技を温存して逃げる。計画的ですね。」';
 else text='「基本は変わらん。相手を見る、HPを見る、逃げ道を見る。最後まで立っていた方が勝ちだ。」\nルーク「逃げ道を見る、だけ妙に得意です。」';
 s.dialog={name:'訓練教官ベルド',text};render();
}
const actionBase=action;action=function(){if(!s.dialog&&masterAhead())return lesson();return actionBase();};
window.LQ_TRAINING_MASTER_STATUS={adaptive:true,checks:['hp','potions','wins','level','technique']};
})();