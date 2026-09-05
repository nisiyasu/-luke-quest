(() => {
'use strict';

/* LUKE QUEST v0.75 enemy behavior readability.
   Gives players a compact visual clue about v0.74 attack tendencies. */

const FAST=new Set(['ツノウサギ','闇カラス','苔むしコウモリ','夜歩きフクロウ','灰羽トンビ','監視フクロウ','石羽コンドル']);
const HEAVY=new Set(['木霊ウルフ','泥鎧イノシシ','灰爪ハウンド','黒甲ムカデ','退避路オオカミ']);
const TRICKY=new Set(['ぷるぷるスライム','森グモ','霧まといキツネ','樹皮トカゲ','霧喰いヤマネコ','崖ネズミ']);

const style=document.createElement('style');
style.textContent=`
.lqEnemyTrait{display:inline-flex;align-items:center;margin:0 0 6px;padding:3px 7px;border-radius:999px;border:1px solid #ffffff18;background:#0b1825;color:#9eb2c1;font-size:8px;font-weight:900;letter-spacing:.08em}.lqEnemyTrait.fast{color:#b9e7ef;border-color:#6cb9ca55;background:#123038}.lqEnemyTrait.heavy{color:#f1c4a8;border-color:#c7855c55;background:#38251b}.lqEnemyTrait.tricky{color:#d9c0e8;border-color:#9c6db655;background:#30203c}
`;
document.head.appendChild(style);

function traitFor(name){if(FAST.has(name))return['fast','迅速型'];if(HEAVY.has(name))return['heavy','強襲型'];if(TRICKY.has(name))return['tricky','技巧型'];return['','標準型'];}
function addEnemyTrait(){
 if(s.screen!=='battle'||!s.enemy)return;const plate=app.querySelector('.enemyPlate');if(!plate||plate.querySelector('.lqEnemyTrait'))return;
 const [cls,label]=traitFor(s.enemy.n);const chip=document.createElement('div');chip.className=`lqEnemyTrait ${cls}`;chip.textContent=label;const bar=plate.querySelector('.enemyBarV10');plate.insertBefore(chip,bar);
}
const battleV74=battle;battle=function(){const r=battleV74();addEnemyTrait();return r;};
const renderV74=render;render=function(){const r=renderV74();if(s.screen==='battle')addEnemyTrait();return r;};
window.LQ_ENEMY_TRAIT_UI_STATUS={behaviorReadability:true};
if(s.screen==='battle')addEnemyTrait();
})();
