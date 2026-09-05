(() => {
'use strict';

/* LUKE QUEST v0.124 examinable Royal Capital landmarks.
   Makes the v0.123 scenery prompts functional interactions instead of decorative guidance only. */
const EXAMINE={town:{
 '8,8':{name:'王都中央広場の噴水',text:'澄んだ水が石造りの水盤へ流れ落ちている。旅人が何枚か硬貨を投げ入れている。\nルーク「願い事……『今日の敵が全員ちょっと寝不足でありますように』。」'},
 '2,9':{name:'朝採れ果実の露店',text:'赤や黄色の果実が木箱いっぱいに積まれている。甘い匂いがする。\n店主「森へ行くなら腹ごしらえしな！」\nルーク「魔物より先に空腹に負けるのも勇者っぽくないですからね。」'},
 '3,9':{name:'朝採れ果実の露店',text:'果物の山の横に、小さく「試食は一人ひとつ」と書かれている。\nルーク「……二回帽子を変えて来るのは駄目ですよね。」'},
 '14,9':{name:'旅道具の露店',text:'縄、火打石、小型ランタン、革袋。派手さはないが旅には役立ちそうな品ばかりだ。'},
 '15,9':{name:'旅道具の露店',text:'丈夫そうな靴が並んでいる。北へ向かう旅人向けらしい。\nルーク「勇者認定の前に、靴の支給制度を整えてほしかったです。」'}
}};
function landmarkAhead(){if(s.screen!=='world'||s.dialog)return null;const table=EXAMINE[s.map];if(!table)return null;const p=front();return table[`${p.x},${p.y}`]||null;}
const actionV123=action;action=function(){const x=landmarkAhead();if(x){stopMoving();s.dialog={name:x.name,text:x.text};return render();}return actionV123();};
window.LQ_LANDMARK_INTERACTION_STATUS={fountain:true,marketStalls:true,functional:true};
})();