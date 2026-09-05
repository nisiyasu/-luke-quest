import fs from 'node:fs';

const dir='addons';
if(!fs.existsSync(dir)){console.log('No addons directory');process.exit(0);}
const addons=fs.readdirSync(dir).filter(f=>f.endsWith('.js')).sort();
const ux=fs.readdirSync('.').filter(f=>/^ux-v\d+\.js$/.test(f)).sort((a,b)=>Number(a.match(/\d+/)[0])-Number(b.match(/\d+/)[0]));
const source=[fs.readFileSync('index.html','utf8'),...ux.map(f=>fs.readFileSync(f,'utf8'))].join('\n');
const contracts=[
 ['render function','function render()'],['world renderer','function world()'],['battle renderer','function battle()'],['save function','function save()'],['current NPC helper','function currentNpcs()'],['front helper','function front()'],['main map registry','const MAPS=']
];
for(const [label,needle] of contracts)if(!source.includes(needle))throw new Error(`Addon host contract missing: ${label}`);
if(!/(?:const|let|var)\s+s\s*=/.test(source))throw new Error('Addon host contract missing: state object');
for(const file of addons){
 const text=fs.readFileSync(`${dir}/${file}`,'utf8');
 if(!text.includes("'use strict'"))throw new Error(`${file}: strict mode required`);
 if(!text.trim().startsWith('(() => {'))throw new Error(`${file}: must be isolated in an IIFE`);
 if(text.includes('document.write('))throw new Error(`${file}: document.write forbidden`);
}

const originalEnemyPath=`${dir}/original-enemy-art.js`;
if(fs.existsSync(originalEnemyPath)){
 const text=fs.readFileSync(originalEnemyPath,'utf8');
 const names=['ぷるぷるスライム','ツノウサギ','闇カラス','苔むしコウモリ','森グモ','木霊ウルフ','霧まといキツネ','樹皮トカゲ','夜歩きフクロウ','霧喰いヤマネコ','灰羽トンビ','泥鎧イノシシ','灰爪ハウンド','監視フクロウ','黒甲ムカデ','崖ネズミ','石羽コンドル','退避路オオカミ'];
 for(const name of names)if(!text.includes(`'${name}'`))throw new Error(`original-enemy-art.js: missing registry entry ${name}`);
 if(!text.includes('LQ_ORIGINAL_ENEMY_ART_STATUS'))throw new Error('original-enemy-art.js: runtime status contract missing');
 if(!text.includes("original-vector-normal-enemy"))throw new Error('original-enemy-art.js: formal-stage marker missing');
 if(!text.includes("if(!cfg)return false"))throw new Error('original-enemy-art.js: unknown-enemy fallback guard missing');
 if(!text.includes(".enemySpriteStage .enemy")||!text.includes("app.querySelector('.enemy')"))throw new Error('original-enemy-art.js: assembled/base battle target compatibility missing');
 const forbidden=['🟦','🐇','🐦‍⬛','🦇','🕷️','🐺','🦊','🦎','🦉','🐈‍⬛','🦅','🐗','🐕‍🦺','🐛','🐀'];
 for(const glyph of forbidden)if(text.includes(glyph))throw new Error(`original-enemy-art.js: emoji final art forbidden (${glyph})`);
 const entryCount=(text.match(/'[^']+':\{kind:/g)||[]).length;
 if(entryCount!==18)throw new Error(`original-enemy-art.js: expected 18 registered normal enemies, got ${entryCount}`);
}

const backdropPath=`${dir}/original-battle-backgrounds.js`;
if(fs.existsSync(backdropPath)){
 const text=fs.readFileSync(backdropPath,'utf8');
 const maps=['field','forest','deepForest','mistTrail','observation','evacRoute'];
 for(const map of maps)if(!new RegExp(`(?:^|\\n)${map}:\\{`).test(text))throw new Error(`original-battle-backgrounds.js: missing scene ${map}`);
 if(!text.includes('LQ_ORIGINAL_BATTLE_BACKGROUND_STATUS'))throw new Error('original-battle-backgrounds.js: runtime status contract missing');
 if(!text.includes('lqOriginalBattleBackgroundSvg'))throw new Error('original-battle-backgrounds.js: original image SVG layer missing');
 if(!text.includes('original-vector-regional-battle-background'))throw new Error('original-battle-backgrounds.js: formal-stage marker missing');
 if(!text.includes("if(!scene)return false"))throw new Error('original-battle-backgrounds.js: unknown-map fallback guard missing');
 if(!text.includes("shell.querySelector('.lqOriginalBattleBackdrop')"))throw new Error('original-battle-backgrounds.js: duplicate-layer reuse guard missing');
 const sceneCount=(text.match(/^(?:field|forest|deepForest|mistTrail|observation|evacRoute):\{/gm)||[]).length;
 if(sceneCount!==6)throw new Error(`original-battle-backgrounds.js: expected 6 regional scenes, got ${sceneCount}`);
}
console.log(`LUKE QUEST addon contract PASS: ${addons.length} isolated add-ons after ${ux.length} sequential patches`);
