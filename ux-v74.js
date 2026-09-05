(() => {
'use strict';

/* LUKE QUEST v0.74 enemy attack personalities.
   Gives regular enemies lightweight behavior variation while preserving existing DEF/guard/death rules. */

const FAST_ENEMIES=new Set(['ツノウサギ','闇カラス','苔むしコウモリ','夜歩きフクロウ','灰羽トンビ','監視フクロウ','石羽コンドル']);
const HEAVY_ENEMIES=new Set(['木霊ウルフ','泥鎧イノシシ','灰爪ハウンド','黒甲ムカデ','退避路オオカミ']);
const TRICKY_ENEMIES=new Set(['ぷるぷるスライム','森グモ','霧まといキツネ','樹皮トカゲ','霧喰いヤマネコ','崖ネズミ']);

function enemyActionRoll(){
 const name=s.enemy?.n||'';const r=Math.random();
 if(FAST_ENEMIES.has(name)&&r<.24)return{bonus:2,label:'素早く踏み込んだ！'};
 if(HEAVY_ENEMIES.has(name)&&r<.22)return{bonus:3,label:'力を溜めて叩きつけた！'};
 if(TRICKY_ENEMIES.has(name)&&r<.22)return{bonus:-2,label:'フェイント気味に様子をうかがった。'};
 return{bonus:0,label:''};
}

enemyTurn=function(g=false){
 const move=enemyActionRoll();
 const base=rnd(s.enemy.a[0],s.enemy.a[1]);
 const raw=Math.max(1,base+move.bonus);
 let d=Math.max(1,raw-(s.def||0));if(g)d=Math.max(1,Math.floor(d/2));
 s.hp=Math.max(0,s.hp-d);
 if(move.label)s.log.push(`${s.enemy.n}は${move.label}`);
 s.log.push(`${s.enemy.n}の攻撃！ ${d}ダメージ！${s.def?`（DEF ${s.def}）`:''}${g?'（ガード）':''}`);
 if(!s.hp){s.hp=s.mh;s.screen='world';s.map='town';s.x=9;s.y=12;s.shopOpen=false;s.victoryResult=null;encounterGrace=3;s.dialog={name:'南門宿の主人',text:'また倒れて運ばれてきたぞ。勇者って大変だな。'};return render();}
 battle();
};

window.LQ_ENEMY_AI_STATUS={fastProfiles:FAST_ENEMIES.size,heavyProfiles:HEAVY_ENEMIES.size,trickyProfiles:TRICKY_ENEMIES.size,guardAndDefPreserved:true};
})();
