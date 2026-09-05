(() => {
'use strict';

/* LUKE QUEST v0.73 story-reactive ordinary NPC dialogue.
   Lets familiar people react to already-known progress without exposing hidden canon. */

const DYNAMIC_DIALOGUE={
 '旅好きの老人':()=>{
   if(s.flags?.glennSeen)return'魔王軍の隊長と話しただと？ ……長く旅をしていると、敵味方の線が地図ほど真っ直ぐじゃないと気づく。まずは生きて帰れ。';
   if(s.flags?.leonSeen)return'金髪の勇者候補を見つけたか。逃げる理由を聞くまでは、背中だけ見て臆病者と決めつけるなよ。旅では事情の方が足が速い。';
   return'北の神殿には近づきすぎるなよ。最近、偉い人ほど笑顔が怖い。';
 },
 '道具屋のミナ':()=>{
   if(s.flags?.glennSeen)return'魔王軍の区域まで行ったんですか？ 薬草を買う前に命を大事にしてください。うち、棺桶は扱ってませんから。';
   if(s.flags?.leonSeen)return'レオンさん、生きてたんですね。なら追いかけるのはいいですけど、帰りの薬草代まで使い切らないでくださいよ。';
   return'勇者さま？ 薬草ならありますけど、勇気は仕入れてません。';
 },
 '神殿の見習い':()=>{
   if(s.flags?.glennSeen)return'魔王軍があなたを見逃した……？ エレノア様へ報告すべきでしょうか。いえ、まずはあなた自身が見たことを忘れないでください。';
   if(s.flags?.leonSeen)return'レオン様が森に……。水晶の件も、勇者候補の逃亡も、神殿では説明のつかないことばかり増えています。';
   return'水晶があんな光り方をしたの、初めて見ました。エレノア様も驚いていたような…';
 },
 '畑仕事の青年':()=>{
   if(s.flags?.leonSeen)return'やっぱりあの金髪、レオンだったのか。すごい速さだったぞ。魔物より先に逃げてるのかと思ったけど……何か追われてたのか？';
   return'森の方で魔物が増えてる。金髪の男が走っていったけど、あれ勇者候補じゃないか？';
 }
};

function refreshDynamicDialogue(){
 for(const map of Object.values(MAPS))for(const n of map.npcs||[]){const make=DYNAMIC_DIALOGUE[n.name];if(make)n.text=make();}
}
refreshDynamicDialogue();

const worldV72=world;world=function(){refreshDynamicDialogue();return worldV72();};
const renderV72=render;render=function(){refreshDynamicDialogue();return renderV72();};
window.LQ_NPC_REACTIVITY_STATUS={dynamicNpcCount:Object.keys(DYNAMIC_DIALOGUE).length,hiddenCanonRevealed:false};
})();
