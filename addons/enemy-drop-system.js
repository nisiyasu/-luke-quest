(() => {
'use strict';

/* Collision-safe add-on: bounded normal-enemy drops into canonical consumables. */
const DROP_TABLE={
 'ぷるぷるスライム':{type:'herb',chance:.18,label:'薬草'},
 'ツノウサギ':{type:'herb',chance:.16,label:'薬草'},
 '闇カラス':{type:'herb',chance:.14,label:'薬草'},
 '苔むしコウモリ':{type:'herb',chance:.18,label:'薬草'},
 '森グモ':{type:'herb',chance:.17,label:'薬草'},
 '木霊ウルフ':{type:'herb',chance:.16,label:'薬草'},
 '霧まといキツネ':{type:'smoke',chance:.10,label:'煙玉'},
 '樹皮トカゲ':{type:'herb',chance:.18,label:'薬草'},
 '夜歩きフクロウ':{type:'smoke',chance:.11,label:'煙玉'},
 '霧喰いヤマネコ':{type:'smoke',chance:.13,label:'煙玉'},
 '灰羽トンビ':{type:'herb',chance:.17,label:'薬草'},
 '泥鎧イノシシ':{type:'herb',chance:.20,label:'薬草'},
 '灰爪ハウンド':{type:'smoke',chance:.14,label:'煙玉'},
 '監視フクロウ':{type:'smoke',chance:.14,label:'煙玉'},
 '黒甲ムカデ':{type:'herb',chance:.19,label:'薬草'},
 '崖ネズミ':{type:'herb',chance:.18,label:'薬草'},
 '石羽コンドル':{type:'smoke',chance:.15,label:'煙玉'},
 '退避路オオカミ':{type:'smoke',chance:.16,label:'煙玉'}
};

function grantDrop(drop){
 if(drop.type==='herb')s.potions=(Number(s.potions)||0)+1;
 else if(drop.type==='smoke')s.smokeBombs=(Number(s.smokeBombs)||0)+1;
 else return false;
 return true;
}
function rollDrop(enemyName){
 const drop=DROP_TABLE[enemyName];
 if(!drop)return null;
 if(Math.random()>=drop.chance)return null;
 return drop;
}
const winDropBase=win;
win=function(){
 const enemyName=s.enemy?.n||'';
 const result=winDropBase();
 const drop=rollDrop(enemyName);
 if(!drop||!grantDrop(drop))return result;
 if(s.dialog&&typeof s.dialog.text==='string')s.dialog.text+=`\n戦利品：${drop.label} ×1`;
 save();
 if(s.screen==='world')render();
 return result;
};

window.LQ_ENEMY_DROP_STATUS={
 stage:'canonical-consumable-battle-drops',
 registeredEnemies:Object.keys(DROP_TABLE).length,
 enemyNames:Object.keys(DROP_TABLE),
 rewardTypes:[...new Set(Object.values(DROP_TABLE).map(d=>d.type))],
 maxUnitsPerVictory:1,
 mutatesGold:false,
 canonicalPotionField:'potions',
 canonicalSmokeField:'smokeBombs',
 unknownEnemyFallback:true,
 delegatesBaseWin:true
};
})();
