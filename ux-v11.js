(() => {
'use strict';

/* LUKE QUEST v0.11 owner-feedback patch.
   Goals: four-direction Luke field facing + non-repeating post-battle Luke lines.
   This is an interim sprite presentation layer, NOT final generated character art. */

const style=document.createElement('style');
style.textContent=`
.player{font-size:0;overflow:visible}
.lukeFieldSprite{position:relative;width:32px;height:42px;margin:auto;filter:drop-shadow(0 3px 2px #0008)}
.lukeFieldSprite .cape{position:absolute;left:4px;top:17px;width:24px;height:20px;background:#2459a8;border-radius:8px 8px 6px 6px;border:1px solid #173b76}
.lukeFieldSprite .body{position:absolute;left:8px;top:16px;width:18px;height:19px;background:linear-gradient(90deg,#9ea9b7,#e7edf3 48%,#8795a6);border:2px solid #d8b84b;border-radius:6px 6px 4px 4px;z-index:2}
.lukeFieldSprite .belt{position:absolute;left:7px;top:29px;width:20px;height:4px;background:#64442c;border:1px solid #d8b84b;z-index:3}
.lukeFieldSprite .head{position:absolute;left:9px;top:6px;width:16px;height:14px;background:#efc39e;border-radius:48% 48% 44% 44%;z-index:4}
.lukeFieldSprite .hair{position:absolute;left:7px;top:2px;width:20px;height:11px;background:#1e4e91;border-radius:60% 45% 42% 35%;z-index:5;clip-path:polygon(0 55%,14% 18%,26% 36%,43% 0,55% 31%,73% 8%,100% 44%,90% 100%,7% 100%)}
.lukeFieldSprite .legs{position:absolute;left:10px;top:34px;width:14px;height:8px;border-left:5px solid #26384d;border-right:5px solid #26384d;z-index:1}
.lukeFieldSprite .faceMark{position:absolute;top:12px;width:3px;height:3px;background:#254b7b;border-radius:50%;z-index:6}
.lukeFieldSprite.dir-down .faceMark.a{left:13px}.lukeFieldSprite.dir-down .faceMark.b{right:12px}
.lukeFieldSprite.dir-up .head{background:#d8ad8d}.lukeFieldSprite.dir-up .hair{top:3px;height:15px;width:21px;left:6px;border-radius:48%}
.lukeFieldSprite.dir-up .faceMark{display:none}.lukeFieldSprite.dir-up .cape{top:15px;height:23px;background:#1f58aa;z-index:3}.lukeFieldSprite.dir-up .body{z-index:2;filter:brightness(.82)}
.lukeFieldSprite.dir-left{transform:translateX(-1px)}.lukeFieldSprite.dir-right{transform:translateX(1px)}
.lukeFieldSprite.dir-left .head,.lukeFieldSprite.dir-right .head{width:14px}
.lukeFieldSprite.dir-left .hair,.lukeFieldSprite.dir-right .hair{width:18px}
.lukeFieldSprite.dir-left .body,.lukeFieldSprite.dir-right .body{width:15px}
.lukeFieldSprite.dir-left .cape{left:12px;width:15px;transform:skewY(10deg)}
.lukeFieldSprite.dir-right .cape{left:5px;width:15px;transform:skewY(-10deg)}
.lukeFieldSprite.dir-left .faceMark.b,.lukeFieldSprite.dir-right .faceMark.a{display:none}
.lukeFieldSprite.dir-left .faceMark.a{left:9px;top:11px}.lukeFieldSprite.dir-right .faceMark.b{right:8px;top:11px}
.lukeFieldSpriteBadge{position:absolute;left:50%;bottom:-9px;transform:translateX(-50%);font-size:7px;line-height:1;background:#07111fc9;color:#cfe3ff;border:1px solid #ffffff2a;border-radius:99px;padding:2px 4px;white-space:nowrap}
`;
document.head.appendChild(style);

function lukeSpriteMarkup(){
  const dir=['up','down','left','right'].includes(s.dir)?s.dir:'down';
  return `<div class="lukeFieldSprite dir-${dir}" aria-label="ルーク ${dir}"><span class=cape></span><span class=body></span><span class=belt></span><span class=head></span><span class=hair></span><span class="faceMark a"></span><span class="faceMark b"></span><span class=legs></span><span class=lukeFieldSpriteBadge>LUKE</span></div>`;
}

function applyLukeFacing(){
  const player=app.querySelector('.player');
  if(!player)return;
  player.innerHTML=lukeSpriteMarkup();
  player.dataset.direction=s.dir||'down';
}

const worldV10=world;
world=function(){
  worldV10();
  applyLukeFacing();
};

const VICTORY_LINES=[
'よし……生きてます。まずそこを喜びましょう。',
'勝った。手が震えてるのは武者震いということにします。',
'今の、勇者っぽかったですよね？ たぶん。',
'敵より先に僕の心臓が倒れるかと思いました。',
'終わった……。次の敵、今日は有給取ってませんか？',
'剣って振れば当たるんですね。毎回そうなら助かります。',
'怖かった……でも、逃げなくてよかった。',
'勝利！ なお本人は開始三秒前まで帰りたかった模様です。',
'危ない危ない。勇者って労災おります？',
'僕、少しずつ強くなってません？ 気のせいじゃないですよね。',
'倒せた……。今のうちに格好いい顔しておきます。',
'よし。反省会は安全な場所でやりましょう。長めに。',
'敵が倒れた。僕も座りたい。',
'勝ったから言えますけど、途中かなり帰りたかったです。',
'これが勇気……というより必死さの力ですね。',
'無事終了。命が一本しかない仕様、まだ慣れません。',
'ふう……剣より先に深呼吸を装備したいです。',
'今の戦い、レオンならもっと格好よく勝つんでしょうね。僕は生存優先で。',
'勝てた！ ……いや、勝った。そこは言い切っておきましょう。',
'僕の作戦は「なんとかする」でした。成功です。',
'魔物も大変ですね。僕なんかに当たって。',
'今の一撃、ちょっとだけ自分でも驚きました。',
'怖くても前に出れば、たまには道が開くんですね。',
'終わりました？ 本当に？ 追加注文ないですよね？',
'生還確認。HPより精神力の表示も欲しいです。',
'これで一歩前進。できれば次の一歩は平和にお願いします。',
'勇者らしさ、今ので一ポイントくらい増えました？',
'勝った直後だけは、自信満々でも許されますよね。',
'さっきまで怖かったのに、終わると少し誇らしい。不思議です。',
'敵を倒しました。僕の膝はまだ戦闘中です。',
'やりました！ ……声が裏返ったのは演出です。',
'勝利です。誰か記録しておいてください。僕は忘れたいです。',
'剣も盾も大事。でも一番大事なの、運じゃないですか？',
'まだ進める。怖いけど、進めます。',
'今の僕、ちょっと勇者でした。ちょっとだけ。',
'倒した！ よし、強そうに歩いて帰りましょう。',
'敵の攻撃より自分の悲鳴の方が大きかった気がします。',
'勝てる時もあるんですね。これは良いデータです。',
'危なかった。でも、本当に危ない時は逃げないって決めたので。',
'戦闘終了。勇者業、やっぱりデスクワークじゃなかった。',
'僕の剣、今日かなり働いてます。僕より働いてます。',
'よしよし。生き残れば次があります。大事です。',
'今の敵、絶対僕より自信ありましたよね。勝ったけど。',
'怖いままでも戦える。最近それだけは分かってきました。',
'ふう……次は話し合いで解決できる相手だと助かります。',
'勝利！ では速やかに安全地帯へ避難……じゃなくて前進します。',
'僕、もしかして本当に強くなってる？ 調子に乗るのはあと五分にします。',
'敵を倒したので、今だけ胸を張ります。今だけ。',
'終わった。剣をしまう手だけ妙に速いです。',
'また一つ越えた。怖かったことは、なかったことにはしません。',
'勝てました……じゃない。勝ちました！ 今日は言い直します。',
'よし、前へ。ここで止まったらレオンに追いつけません。',
'怖さゼロではないです。でも足は止まりませんでした。',
'今のは上出来。自分で自分を褒めておきます。',
'敵が強いほど、終わった後のお茶が美味しそうです。',
'無事です！ たぶん鎧も。あとでへこみを数えます。',
'勝ったけど、油断はなし。次はもっと強いかもしれない。嫌ですね。',
'一戦終了。勇者ポイントが目に見えたら励みになるんですけど。',
'僕でも守れるものがあるなら、もう少しだけ頑張れます。',
'よし。怖かった。でも逃げなかった。それで十分です。'
];

function pickVictoryLine(){
  if(!Array.isArray(s.recentVictoryLines))s.recentVictoryLines=[];
  const blocked=new Set(s.recentVictoryLines.slice(-8));
  const pool=VICTORY_LINES.filter(line=>!blocked.has(line));
  const source=pool.length?pool:VICTORY_LINES;
  const line=source[Math.floor(Math.random()*source.length)];
  s.recentVictoryLines.push(line);
  if(s.recentVictoryLines.length>8)s.recentVictoryLines=s.recentVictoryLines.slice(-8);
  return line;
}

win=function(){
  const e=s.enemy;
  s.gold+=e.g;
  s.xp+=e.xp;
  s.wins++;
  s.log.push(`${e.n}を倒した！ EXP${e.xp} / ${e.g}G`);
  if(s.xp>=s.nx){
    s.xp-=s.nx;
    s.lv++;
    s.nx=Math.floor(s.nx*1.5);
    s.mh+=9;
    s.hp=s.mh;
    s.atk+=3;
  }
  s.screen='world';
  s.enemy=null;
  encounterGrace=3;
  s.dialog=s.wins===2
    ?{name:'ナレーション',text:'草原での戦いを越えた。王都近郊の北東、森の入口へ進める。'}
    :{name:'ルーク',portraitKey:'luke',text:pickVictoryLine()};
  render();
};

window.LQ_VICTORY_LINE_COUNT=VICTORY_LINES.length;

if(s.screen==='world')applyLukeFacing();

})();
