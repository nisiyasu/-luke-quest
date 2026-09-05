(() => {
'use strict';

/* Optional early-game side quest linking the Royal Capital novice cleric to the forest clearing. */
s.flags=s.flags||{};
const ASK='lqHerbSampleQuestAsked',DONE='lqHerbSampleQuestDone',HARVEST='forestClearingHerbHarvested';
function noviceAhead(){if(s.screen!=='world'||s.map!=='town')return false;const p=front();return currentNpcs().some(n=>n.x===p.x&&n.y===p.y&&n.name==='神殿の見習い');}
function talkQuest(){
 stopMoving();
 if(s.flags[DONE]){s.dialog={name:'神殿の見習い',text:'「前にもらった森の薬草、ちゃんと乾燥させて標本にしました。助かりました。」\nルーク「勇者の実績欄に“薬草を届けた”って書いておいてください。」'};return render();}
 if(s.flags[HARVEST]){
  s.flags[ASK]=true;s.flags[DONE]=true;s.gold=Math.max(0,Number(s.gold)||0)+18;save();window.LQ_sfx?.('chest');
  s.dialog={name:'神殿の見習い',text:'「その葉、森の陽だまりで育つ薬草ですね！ 標本に一枚だけ分けてもらえますか？」\n摘んだ葉の一部を渡した。お礼に 18G を受け取った。\nルーク「薬草を摘んだだけで褒められた……勇者業、ここを主力にしたいです。」'};return render();
 }
 if(!s.flags[ASK]){
  s.flags[ASK]=true;save();
  s.dialog={name:'神殿の見習い',text:'「森の入口には、木々が開けて日が差す場所があるそうです。そこで育つ薬草を一度見てみたいんです。」\nルーク「魔物じゃなく薬草を探す依頼……好きです。すごく好きです。」'};return render();
 }
 s.dialog={name:'神殿の見習い',text:'「森の入口の、木漏れ日が差す空地です。無理はしないでくださいね。」\nルーク「その“無理しないで”を王の使者にも共有してほしいです。」'};return render();
}
const actionBase=action;action=function(){if(!s.dialog&&noviceAhead())return talkQuest();return actionBase();};
window.LQ_SIDEQUEST_STATUS=Object.assign({},window.LQ_SIDEQUEST_STATUS,{forestHerbSample:{requestFlag:ASK,completionFlag:DONE,rewardGold:18,harvestFlag:HARVEST,spoilerSafe:true}});
})();