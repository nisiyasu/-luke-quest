import fs from 'node:fs';

const files=fs.readdirSync('.').filter(f=>/^ux-v\d+\.js$/.test(f)).sort((a,b)=>Number(a.match(/\d+/)[0])-Number(b.match(/\d+/)[0]));
if(!files.length)throw new Error('No ux-vNN.js presentation patches found');
const versions=files.map(f=>Number(f.match(/\d+/)[0]));
if(versions[0]!==8)throw new Error(`Patch chain must start at v08, found v${versions[0]}`);
for(let i=1;i<versions.length;i++)if(versions[i]!==versions[i-1]+1)throw new Error(`Patch chain gap/reorder: v${versions[i-1]} -> v${versions[i]}`);

const core=fs.readFileSync('index.html','utf8');
const requiredCore=[
 ['localStorage save key',"lukeQuestV2"],
 ['central stopMoving','function stopMoving()'],
 ['global pointer release',"addEventListener('pointerup',stopMoving"],
 ['pointer cancellation',"addEventListener('pointercancel',stopMoving"],
 ['visibility safety',"visibilitychange"],
 ['world action','function action()'],
 ['battle attack','function attack()'],
 ['battle guard','function guard()'],
 ['battle herb','function potion()'],
 ['escape command','function runAway()'],
 ['victory handler','function win()']
];
for(const [label,needle] of requiredCore)if(!core.includes(needle))throw new Error(`Core regression guard missing: ${label}`);

const combined=files.map(f=>fs.readFileSync(f,'utf8')).join('\n');
const requiredPatches=[
 ['formal Luke raster hydrate','LQ_hydrateFormalDialogueAsset'],
 ['four-direction interim Luke','lukeFieldSprite'],
 ['victory line pool','VICTORY_LINES'],
 ['full adventure menu','lqPausePanel'],
 ['physical interiors','innInterior'],
 ['equipment system','LQ_EQUIPMENT_STATUS'],
 ['save schema','LQ_SAVE_SCHEMA_STATUS'],
 ['investigation journal','LQ_CLUE_JOURNAL_STATUS'],
 ['battle scenery','LQ_BATTLE_SCENERY_STATUS'],
 ['PWA/input polish','LQ_TOUCH_CONTROL_STATUS'],
 ['battle technique','LQ_SKILL_STATUS'],
 ['enemy behavior','LQ_ENEMY_AI_STATUS'],
 ['side quest','LQ_SIDEQUEST_STATUS'],
 ['minimap','LQ_MINIMAP_STATUS']
];
for(const [label,needle] of requiredPatches)if(!combined.includes(needle))throw new Error(`Patch regression guard missing: ${label}`);

console.log(`LUKE QUEST static regression PASS: ${files.length} sequential patches v${versions[0]}..v${versions.at(-1)}`);
