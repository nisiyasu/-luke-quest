import fs from 'node:fs';

const enemyDrop=fs.readFileSync('addons/enemy-drop-system.js','utf8');
const bestiary=fs.readFileSync('addons/bestiary-details.js','utf8');
const expected=['ぷるぷるスライム','ツノウサギ','闇カラス','苔むしコウモリ','森グモ','木霊ウルフ','霧まといキツネ','樹皮トカゲ','夜歩きフクロウ','霧喰いヤマネコ','灰羽トンビ','泥鎧イノシシ','灰爪ハウンド','監視フクロウ','黒甲ムカデ','崖ネズミ','石羽コンドル','退避路オオカミ'];

for(const name of expected)if(!enemyDrop.includes(`'${name}'`))throw new Error(`REQ-020 source drop registry missing ${name}`);
const contracts=[
 [enemyDrop,'read-only label projection','Object.freeze(Object.fromEntries'],
 [enemyDrop,'projection exported','dropLabels,'],
 [enemyDrop,'probability hidden contract',"dropIntelProjection:'labels-only-no-probabilities'"],
 [bestiary,'single-source lookup','window.LQ_ENEMY_DROP_STATUS?.dropLabels?.[name]'],
 [bestiary,'safe unknown fallback',"||'—'"],
 [bestiary,'drop UI','class=lqMonsterDrop>DROP <b>${drop}</b>'],
 [bestiary,'existing HP','HP <b>${m.hp}</b>'],
 [bestiary,'existing ATK',"ATK <b>${m.a?.[0]??'?'}-${m.a?.[1]??'?'}</b>"],
 [bestiary,'existing EXP','EXP <b>${m.xp}</b>'],
 [bestiary,'existing Gold display','G <b>${m.g}</b>'],
 [bestiary,'area retained','class=lqMonsterArea'],
 [bestiary,'runtime status','dropIntel:true'],
 [bestiary,'no probability UI marker','dropProbabilityHidden:true']
];
for(const [text,label,needle] of contracts)if(!text.includes(needle))throw new Error(`REQ-020 regression missing: ${label}`);
if(/chance|確率|%/.test(bestiary))throw new Error('REQ-020 bestiary must not expose drop probabilities');
if(/s\.(?:hp|mh|atk|xp|nx|gold|potions|smokeBombs|mp|mmp|ehp)\s*[+\-*/]?=/.test(bestiary))throw new Error('REQ-020 bestiary projection must not mutate combat/inventory state');
console.log('REQ-020 extra regression PASS: bestiary drop intel is single-source, discovered-entry projection only, probability-hidden and state-read-only');
