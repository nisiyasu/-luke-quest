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
console.log(`LUKE QUEST addon contract PASS: ${addons.length} isolated add-ons after ${ux.length} sequential patches`);
