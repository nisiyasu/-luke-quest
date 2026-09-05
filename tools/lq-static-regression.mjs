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

const mpSkill=fs.readFileSync('addons/mp-skill-system.js','utf8');
const mpContracts=[
 ['MP default current','DEFAULT.mp=INITIAL_MP'],
 ['MP default max','DEFAULT.mmp=INITIAL_MP'],
 ['old-save migration','if(!Number.isFinite(s.mp))s.mp=s.mmp'],
 ['MP clamping','Math.max(0,Math.min(s.mmp,Math.floor(s.mp)))'],
 ['MP status UI','lqMpValue'],
 ['skill UI','lqSkillBtn'],
 ['skill name',"SKILL_NAME='蒼閃'"],
 ['skill cost',"SKILL_COST=4"],
 ['insufficient MP gate','if(s.mp<SKILL_COST)'],
 ['insufficient MP no enemy turn','return battle()'],
 ['canonical enemy HP','s.ehp=Math.max(0,s.ehp-d)'],
 ['victory delegation','if(s.ehp<=0)return win()'],
 ['enemy turn delegation','return enemyTurn()'],
 ['level-up MP growth','s.mmp+=2;s.mp=s.mmp'],
 ['defeat MP recovery','s.mp=s.mmp;save();render()'],
 ['runtime status','LQ_MP_SKILL_STATUS']
];
for(const [label,needle] of mpContracts)if(!mpSkill.includes(needle))throw new Error(`REQ-016 MP/skill regression guard missing: ${label}`);
for(const needle of ['function attack()','function guard()','function potion()','function runAway()'])if(!core.includes(needle))throw new Error(`REQ-016 existing battle command lost: ${needle}`);

const enemyDrop=fs.readFileSync('addons/enemy-drop-system.js','utf8');
const expectedDropEnemies=['ぷるぷるスライム','ツノウサギ','闇カラス','苔むしコウモリ','森グモ','木霊ウルフ','霧まといキツネ','樹皮トカゲ','夜歩きフクロウ','霧喰いヤマネコ','灰羽トンビ','泥鎧イノシシ','灰爪ハウンド','監視フクロウ','黒甲ムカデ','崖ネズミ','石羽コンドル','退避路オオカミ'];
for(const name of expectedDropEnemies)if(!enemyDrop.includes(`'${name}'`))throw new Error(`REQ-017 drop registry missing enemy: ${name}`);
const dropNames=[...enemyDrop.matchAll(/^ '([^']+)':\{type:/gm)].map(m=>m[1]);
if(dropNames.length!==18||new Set(dropNames).size!==18)throw new Error(`REQ-017 expected 18 unique enemy drop entries, got ${dropNames.length}`);
const dropContracts=[
 ['base win delegation','const winDropBase=win'],
 ['base win execution','const result=winDropBase()'],
 ['unknown enemy fallback','if(!drop)return null'],
 ['bounded herb grant',"s.potions=(Number(s.potions)||0)+1"],
 ['bounded smoke grant',"s.smokeBombs=(Number(s.smokeBombs)||0)+1"],
 ['save after drop','save();'],
 ['loot dialogue','戦利品：${drop.label} ×1'],
 ['runtime status','LQ_ENEMY_DROP_STATUS'],
 ['one unit cap','maxUnitsPerVictory:1'],
 ['no gold mutation marker','mutatesGold:false']
];
for(const [label,needle] of dropContracts)if(!enemyDrop.includes(needle))throw new Error(`REQ-017 drop regression guard missing: ${label}`);
if(/s\.gold\s*[+\-*/]?=/.test(enemyDrop))throw new Error('REQ-017 must not mutate Gold');
if(/s\.(?!potions\b|smokeBombs\b|enemy\b|dialog\b|screen\b)[A-Za-z_$][\w$]*\s*=/.test(enemyDrop))throw new Error('REQ-017 introduced an unexpected state authority');

const azureFx=fs.readFileSync('addons/skill-visual-feedback.js','utf8');
const azureContracts=[
 ['base skill capture','const azureFeedbackBase=window.lqUseAzureSlash'],
 ['base skill delegation','azureFeedbackBase.apply(this,arguments)'],
 ['success from canonical battle log',"includes('ルークの蒼閃！')"],
 ['insufficient MP feedback',"includes('MPが足りない！')"],
 ['slash effect class','lqAzureSlashFx'],
 ['enemy hit class','lqAzureEnemyHit'],
 ['MP spent pulse','lqMpSpentPulse'],
 ['MP denied pulse','lqMpDeniedPulse'],
 ['pointer passthrough','pointer-events:none'],
 ['reduced motion','prefers-reduced-motion:reduce'],
 ['transient cleanup','setTimeout(()=>fx.remove(),650)'],
 ['runtime status','LQ_AZURE_SLASH_FEEDBACK_STATUS'],
 ['presentation-only marker','combatStateMutation:false']
];
for(const [label,needle] of azureContracts)if(!azureFx.includes(needle))throw new Error(`REQ-018 Azure Slash feedback guard missing: ${label}`);
if(/s\.(?:hp|mh|atk|xp|nx|gold|potions|smokeBombs|mp|mmp|ehp)\s*[+\-*/]?=/.test(azureFx))throw new Error('REQ-018 presentation add-on must not mutate combat numeric state');

const campRest=fs.readFileSync('addons/campfire-rest.js','utf8');
const shrineRest=fs.readFileSync('addons/wayfarer-shrine-blessing.js','utf8');
const recoveryContracts=[
 [campRest,'campfire full HP','s.hp=s.mh'],
 [campRest,'campfire full MP','s.mp=s.mmp'],
 [campRest,'campfire MP safety','Number.isFinite(s.mmp)&&s.mmp>0'],
 [campRest,'campfire MP positive dialogue','mpHealed>0'],
 [campRest,'campfire persistent flag',"const FLAG='forestCampRested'"],
 [campRest,'campfire status','fullMpRecovery:true'],
 [shrineRest,'shrine HP ratio','Math.ceil(s.mh*.35)'],
 [shrineRest,'shrine MP ratio','Math.ceil(s.mmp*.35)'],
 [shrineRest,'shrine MP clamp','Math.min(s.mmp,s.mp+mpAmount)'],
 [shrineRest,'shrine MP safety','Number.isFinite(s.mmp)&&s.mmp>0&&Number.isFinite(s.mp)'],
 [shrineRest,'shrine MP positive dialogue','mpHealed>0'],
 [shrineRest,'shrine persistent flag',"const FLAG='wayfarerShrineBlessingUsed'"],
 [shrineRest,'shrine status','mpRecoveryRatio:.35']
];
for(const [haystack,label,needle] of recoveryContracts)if(!haystack.includes(needle))throw new Error(`REQ-019 recovery regression guard missing: ${label}`);
for(const [label,text] of [['campfire',campRest],['shrine',shrineRest]]){
 if(/s\.(?:gold|potions|smokeBombs)\s*[+\-*/]?=/.test(text))throw new Error(`REQ-019 ${label} must not mutate Gold/inventory`);
}

const extraRegressionFiles=fs.readdirSync('tools').filter(f=>/^lq-extra-regression-.*\.mjs$/.test(f)).sort();
for(const extra of extraRegressionFiles)await import(`./${extra}`);

console.log(`LUKE QUEST static regression PASS: ${files.length} ordered patches v${versions[0]}..v${versions.at(-1)}; core movement/save/battle + formal Luke dialogue + floating touch + formal 4-direction/3-frame Luke field + REQ-016 MP/skill + REQ-017 enemy-drop + REQ-018 Azure Slash feedback + REQ-019 MP recovery + ${extraRegressionFiles.length} modular extra regression guard(s) intact`);
