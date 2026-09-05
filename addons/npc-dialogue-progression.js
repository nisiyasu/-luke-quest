(() => {
'use strict';

/* Collision-safe add-on: existing NPCs react to canonical story progression. */
const DIALOGUE_STATES={
 '旅好きの老人':[
  '北の神殿には近づきすぎるなよ。最近、偉い人ほど笑顔が怖い。',
  '勇者になったからって、全部ひとりで背負うなよ。旅は長い。休める時に休め。',
  '金髪の若者を追ってるんだって？ 逃げるにも理由がある。追いついたら、まず話を聞いてやれ。',
  '森の向こうが妙に静かだ。静かな時ほど、旅人は耳を澄ますもんだ。',
  '魔王軍の動きが妙だって噂だ。敵だから全部同じ、とは限らんのかもしれんな。',
  '北へ道が続いている。答えを急ぐなよ。見たものを一つずつ覚えておくんだ。'
 ],
 '道具屋のミナ':[
  '勇者さま？ 薬草ならありますけど、勇気は仕入れてません。',
  '森へ行くなら薬草はケチらないでくださいね。勇気より在庫の方が補充できますから。',
  'レオンさんを追うんですか？ あの人、強そうだけど顔色はずっと悪かったですよ。',
  '最近、森帰りのお客さんが「黒い旗を見た」って。返品できない危険は仕入れたくないですね。',
  '魔王軍なのに襲わない兵がいる？ ……世の中、値札みたいに分かりやすくはないんですね。',
  '北へ行くなら準備は多めに。帰ってきた時に笑えるくらいが、ちょうどいいです。'
 ],
 '神殿の見習い':[
  '水晶があんな光り方をしたの、初めて見ました。エレノア様も驚いていたような…',
  'あの水晶反応、記録庫でも似た例が見つからないんです。だからこそ、決めつけない方がいいのかも。',
  'レオン様が森へ……。勇者候補にも、怖くなることはあるんですね。',
  '神殿では「魔王軍の兆候」とだけ報告されています。でも現場を見た人の話は、少し違うみたいです。',
  '敵の行動が教本と合わない時は、教本ではなく事実を見ろ。先生にそう教わりました。',
  '帰ってきたら、見たことを教えてください。神殿の記録より、あなたの目の方が今は新しいです。'
 ],
 '畑仕事の青年':[
  '森の方で魔物が増えてる。金髪の男が走っていったけど、あれ勇者候補じゃないか？',
  '街道の魔物、前より落ち着かないな。森へ行くなら足元も見とけよ。',
  'やっぱりあの金髪、レオンだったのか。必死な走り方だった。追うなら急いだ方がいい。',
  '森から軍靴みたいな跡が街道へ出てる。でも畑は荒らされてない。変な連中だな。',
  '魔王軍が近いなら怖い。でも、何も考えず襲ってくる奴らなら畑はもう無事じゃないはずだ。',
  '北へ行くのか。腹が減ったら戻ってこい。世界の謎より飯の方が先に効くぞ。'
 ]
};

function progressionStage(){
 const f=s.flags||{};
 if(f.evacEntered||f.withdrawProofSeen)return 5;
 if(f.observationEntered||f.glennSeen)return 4;
 if(f.mistEntered||f.glennTraceSeen)return 3;
 if(f.leonSeen)return 2;
 if((Number(s.wins)||0)>0)return 1;
 return 0;
}
function applyProgressionDialogue(){
 const stage=progressionStage();
 for(const mapName of ['town','field']){
  const map=MAPS[mapName];if(!map||!Array.isArray(map.npcs))continue;
  for(const npc of map.npcs){
   const lines=DIALOGUE_STATES[npc.name];if(!lines)continue;
   npc.text=lines[Math.min(stage,lines.length-1)];
  }
 }
 return stage;
}
const actionDialogueBase=action;action=function(){applyProgressionDialogue();return actionDialogueBase();};
const worldDialogueBase=world;world=function(){applyProgressionDialogue();return worldDialogueBase();};
const renderDialogueBase=render;render=function(){applyProgressionDialogue();return renderDialogueBase();};
const initialStage=applyProgressionDialogue();
window.LQ_NPC_DIALOGUE_PROGRESSION_STATUS={stage:'canonical-state-reactive-npc-dialogue',npcCount:Object.keys(DIALOGUE_STATES).length,stateCount:6,maps:['town','field'],canonicalFlags:['wins','leonSeen','mistEntered','glennTraceSeen','observationEntered','glennSeen','evacEntered','withdrawProofSeen'],currentStage:initialStage,projectionOnly:true,changesNpcPosition:false,changesCollision:false};
})();
