import fs from 'node:fs';

const files=fs.readdirSync('.').filter(f=>/^ux-v\d+\.js$/.test(f)).sort((a,b)=>Number(a.match(/\d+/)[0])-Number(b.match(/\d+/)[0]));
if(!files.length)throw new Error('No ux-vNN.js presentation patches found');
const versions=files.map(f=>Number(f.match(/\d+/)[0]));
if(versions[0]!==8)throw new Error(`Patch chain must start at v08, found v${versions[0]}`);
for(let i=1;i<versions.length;i++)if(versions[i]<=versions[i-1])throw new Error(`Patch order/duplicate invalid: v${versions[i-1]} -> v${versions[i]}`);
const gaps=[];for(let i=1;i<versions.length;i++)if(versions[i]>versions[i-1]+1)gaps.push(`v${versions[i-1]}->v${versions[i]}`);
if(gaps.length)console.warn(`Non-fatal sequential patch gaps (collision-safe addons may carry independent work): ${gaps.join(', ')}`);

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
const expectedFeatures=[
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
const missing=expectedFeatures.filter(([,needle])=>!combined.includes(needle)).map(([label])=>label);
if(missing.length)console.warn(`Non-fatal feature-marker drift: ${missing.join(', ')}. Syntax, core safety, add-on contracts and browser smoke remain authoritative.`);

const lukeTransport=fs.readFileSync('ux-v12.js','utf8');
const lukeGuard=fs.readFileSync('addons/luke-formal-dialogue-guard.js','utf8');
const touchController=fs.readFileSync('addons/floating-touch-controller.js','utf8');
const approvedLukeB64=fs.readFileSync('assets/characters/luke/dialogue-neutral.webp.b64','utf8').trim();
const approvedLukeBytes=Buffer.from(approvedLukeB64,'base64');

const formalLukeContracts=[
 ['approved Luke transport path',"assets/characters/luke/dialogue-neutral.webp.b64"],
 ['approved Luke asset marked formal',"formal:true"],
 ['formal Luke hydration export','LQ_hydrateFormalDialogueAsset'],
 ['formal Luke guard blob-only source',"startsWith('blob:')"],
 ['formal Luke dialogue marker',"dataset.formalLuke='true'"],
 ['formal Luke box marker',"lukeFormalPortrait"],
 ['fallback SVG not promoted',"approvedRasterOnly:true"]
];
for(const [label,needle] of formalLukeContracts){
  const haystack=label.includes('guard')||label.includes('marker')||label.includes('fallback')?lukeGuard:lukeTransport;
  if(!haystack.includes(needle))throw new Error(`Formal Luke regression guard missing: ${label}`);
}
if(approvedLukeBytes.length<16||approvedLukeBytes.slice(0,4).toString()!=='RIFF'||approvedLukeBytes.slice(8,12).toString()!=='WEBP'){
  throw new Error('Formal Luke approved dialogue payload is not a valid WebP transport');
}

const touchContracts=[
 ['touch controller pointerdown','pointerdown'],
 ['touch controller pointermove','pointermove'],
 ['touch controller pointerup','pointerup'],
 ['touch controller pointercancel','pointercancel'],
 ['touch controller mouse exclusion',"event.pointerType==='mouse'"],
 ['touch controller world-screen gate',"s.screen!=='world'"],
 ['touch controller centralized stop','stopMoving()'],
 ['touch controller blur safety',"addEventListener('blur'"],
 ['touch controller visibility safety','visibilitychange'],
 ['touch controller fallback cleanup helper','function clearFallback()'],
 ['touch controller direction-switch cleanup','clearFallback();\n  if(typeof stopMoving'],
 ['touch controller cleanup status marker','directionSwitchTimerCleanup:true']
];
for(const [label,needle] of touchContracts)if(!touchController.includes(needle))throw new Error(`Floating touch controller regression guard missing: ${label}`);

const fieldSprite=fs.readFileSync('addons/zzz-luke-field-sprite.js','utf8');
const fieldDirections=['down','up','left','right'];
if(!fieldSprite.includes("assets/characters/luke/field-${d}.webp.b64"))throw new Error('Luke field runtime dynamic transport pattern missing');
for(const dir of fieldDirections){
  const path=`assets/characters/luke/field-${dir}.webp.b64`;
  if(!fs.existsSync(path))throw new Error(`Formal Luke field transport missing: ${dir}`);
  const b64=fs.readFileSync(path,'utf8').trim();
  const bytes=Buffer.from(b64,'base64');
  if(bytes.length<16||bytes.slice(0,4).toString()!=='RIFF'||bytes.slice(8,12).toString()!=='WEBP')throw new Error(`Formal Luke ${dir} field payload is not WebP`);
}
const fieldContracts=[
 ['formal field status','LQ_LUKE_FIELD_SPRITE_STATUS'],
 ['formal raster marker',"dataset.lukeSprite='formal-raster'"],
 ['direction marker','dataset.lukeDirection=dir'],
 ['frame marker','dataset.lukeFrame=String(frame)'],
 ['three-frame strip','framesPerDirection:3'],
 ['four directions','directions:4'],
 ['movement wrapper','const baseMove=move'],
 ['central stop wrapper','const baseStop=stopMoving'],
 ['idle neutral frame','const frame=walking?frameForStep():1']
];
for(const [label,needle] of fieldContracts)if(!fieldSprite.includes(needle))throw new Error(`Formal Luke field regression guard missing: ${label}`);

console.log(`LUKE QUEST static regression PASS: ${files.length} ordered patches v${versions[0]}..v${versions.at(-1)}; core movement/save/battle + formal Luke dialogue + floating touch + formal 4-direction/3-frame Luke field contracts intact`);
