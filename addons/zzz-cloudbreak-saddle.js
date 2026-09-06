(() => {
'use strict';

/* REQ-108 + REQ-121 — canon-safe Cloudbreak continuation and restored Wind Stair transition. */
const SKY='skylineTraverse';
const SADDLE='cloudbreakSaddle';
const RIDGE='windStairRidge';
const ENTRY_GRACE=5;
const RETURN_GRACE=4;
if(!MAPS[SKY])return;

MAPS[SADDLE]={
 name:'北尾根・雲上の鞍部',w:22,h:20,
 tiles:[
  '##########^^##########',
  '#....^^..........^^..#',
  '#...^^^^........^^^^.#',
  '#....................#',
  '#....####....####....#',
  '#....................#',
  '#..^^............^^..#',
  '#.^^^^..........^^^^.#',
  '#..^^............^^..#',
  '#....................#',
  '#....####....####....#',
  '#....................#',
  '#..^^^^........^^^^..#',
  '#...^^..........^^...#',
  '#....................#',
  '#....^^........^^....#',
  '#....................#',
  '#....................#',
  '#....................#',
  '##########VV##########'
 ],
 npcs:[
  {x:11,y:16,e:'',name:'岩粉に残る新しい擦れ跡',kind:'lqCloudbreakScuff',text:'風の弱い岩陰に、靴底が横へ滑った新しい擦れ跡が残っている。跡はそこから北へ向き直っている。\nルーク「ここで一度、風を避けたみたいですね。」'},
  {x:6,y:12,e:'',name:'風除けの石窪み',kind:'lqCloudbreakHollow',text:'自然にえぐれた浅い石窪みが、稜線の横風をほとんど遮っている。足元には踏み固められた砂が薄く残る。'},
  {x:16,y:7,e:'',name:'北側を望む岩肩',kind:'lqCloudbreakView',text:'雲の上から、北へもう一段高くなる尾根が見える。道は細いが、人ひとりが通れる幅は続いている。'},
  {x:10,y:1,e:'',name:'次の高所へ続く石段跡',kind:'lqCloudbreakBoundary',text:'自然石を踏み段にした古い通り道が、さらに北の高所へ続いている。いくつかの石には新しい土汚れがついている。\nルーク「追跡路としては、まだ終わってないですね。」'}
 ]
};

const tileClassBase=tileClass;
tileClass=function(c){
 if(s.map===SADDLE){
  if(c==='#')return'wall lqCloudbreakWall';
  if(c==='^')return'wall lqCloudbreakRock';
  if(c==='V')return'gate lqCloudbreakExit';
  return'floor lqCloudbreakPath';
 }
 return tileClassBase(c);
};
const tileEmojiBase=tileEmoji;
tileEmoji=function(c){if(s.map===SADDLE)return'';return tileEmojiBase(c);};
const npcClassBase=npcClass;
npcClass=function(n){
 if(n?.kind==='lqCloudbreakScuff')return'npc lqCloudbreakScuff';
 if(n?.kind==='lqCloudbreakHollow')return'npc lqCloudbreakHollow';
 if(n?.kind==='lqCloudbreakView')return'npc lqCloudbreakView';
 if(n?.kind==='lqCloudbreakBoundary')return'npc lqCloudbreakBoundary';
 return npcClassBase(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqCloudbreakPath{background:radial-gradient(circle at 26% 55%,#d9c99625 0 4%,transparent 5%),linear-gradient(147deg,#989b8d,#6b766e 58%,#45524c);box-shadow:inset 0 1px #fff4}.tile.lqCloudbreakWall{background:linear-gradient(126deg,#858a82,#58655f 56%,#35423c);box-shadow:inset 0 -13px #222e29cc}.tile.lqCloudbreakRock{background:linear-gradient(149deg,#bdb6a2,#7a8178 50%,#4b5751);box-shadow:inset 0 -8px #2d3833bd,0 2px 0 #f1e0b83d}.tile.lqCloudbreakExit{background:linear-gradient(#a18d69,#625642);box-shadow:inset 0 0 0 3px #fbe2a655}
.lqCloudbreakScuff{width:46px;height:40px;font-size:0}.lqCloudbreakScuff:before{content:'';position:absolute;left:9px;top:15px;width:28px;height:7px;border-radius:55%;background:linear-gradient(90deg,#4a3c30,#70574588,transparent);transform:rotate(-13deg);box-shadow:0 0 0 2px #ddc28c24}
.lqCloudbreakHollow{width:48px;height:43px;font-size:0;border-radius:50% 50% 42% 42%;background:radial-gradient(ellipse at 50% 66%,#27342f 0 35%,#626a62 38% 61%,#8a887b 64% 100%);box-shadow:0 5px 7px #0008}
.lqCloudbreakView{width:46px;height:42px;font-size:0;background:linear-gradient(#eefcff66,#a8d1d438 52%,transparent 53%);border-bottom:4px solid #6c7169;box-shadow:0 0 18px #e0ffff2f}.lqCloudbreakView:after{content:'≈';position:absolute;left:10px;top:-1px;color:#fff;font-size:28px;text-shadow:0 2px 4px #000}
.lqCloudbreakBoundary{width:48px;height:44px;font-size:0;background:repeating-linear-gradient(to top,#817968 0 7px,#5e655f 8px 13px,transparent 14px 17px);filter:drop-shadow(0 6px 5px #000a)}.lqCloudbreakBoundary:after{content:'↑';position:absolute;right:4px;top:-8px;color:#fff1ad;font-size:22px;text-shadow:0 2px 4px #000}
.lqCloudbreakGuide{position:absolute;z-index:44;left:50%;top:calc(env(safe-area-inset-top,0px) + 62px);transform:translateX(-50%);max-width:min(78%,360px);padding:5px 9px;border:1px solid #eef0b566;border-radius:999px;background:#071521d9;color:#f7efc8;font-size:8px;font-weight:900;letter-spacing:.03em;text-align:center;pointer-events:none;box-shadow:0 4px 12px #0008}.lqCloudbreakMarker{position:absolute;z-index:7;width:34px;height:34px;transform:translate(-50%,-55%);border:2px solid #f7eaa7ad;border-radius:50%;box-shadow:0 0 11px #fff0a978,inset 0 0 9px #fff0a936;pointer-events:none;animation:lqCloudbreakPulse 1.3s ease-in-out infinite alternate}.lqCloudbreakMarker:after{content:'!';position:absolute;left:50%;top:50%;transform:translate(-50%,-55%);color:#fff8cf;font-size:13px;font-weight:1000;text-shadow:0 2px 4px #000}@keyframes lqCloudbreakPulse{from{opacity:.48;scale:.9}to{opacity:1;scale:1.08}}@media(prefers-reduced-motion:reduce){.lqCloudbreakMarker{animation:none;opacity:.8}}
`;
document.head.appendChild(style);

let guidePhase='clue';
let lastMap=s.map;
function aheadNpc(mapId){if(s.screen!=='world'||s.map!==mapId)return null;const p=front();return MAPS[mapId]?.npcs?.find(n=>n.x===p.x&&n.y===p.y)||null;}
function enterSaddle(boundary){
 stopMoving();encounterGrace=ENTRY_GRACE;s.map=SADDLE;s.x=10;s.y=18;s.dir='up';guidePhase='clue';
 s.dialog={kind:boundary?.kind||'lqSkylineBoundary',name:'北尾根・雲上の鞍部',text:'露出した稜線を越えると、岩壁に挟まれた短い鞍部へ出た。風が急に弱まり、岩粉の上に新しい擦れ跡が見える。\nルーク「風が消えた分、足跡は探しやすそうです。」'};
 render();
}
function enterWindStair(){
 if(!MAPS[RIDGE])return false;
 stopMoving();encounterGrace=ENTRY_GRACE;s.map=RIDGE;s.x=11;s.y=18;s.dir='up';guidePhase='north';
 s.dialog={kind:'lqCloudbreakBoundary',name:'北尾根・風鳴りの石段',text:'古い踏み段を上がると、風が石の隙間を鳴らす細い尾根道へ出た。石段には新しい靴跡が残っている。\nルーク「……ちゃんと道、続いてましたね。」'};
 render();
 return true;
}
function returnToSaddle(){
 stopMoving();encounterGrace=RETURN_GRACE;s.map=SADDLE;s.x=10;s.y=2;s.dir='down';guidePhase='north';
 s.dialog={kind:'lqWindStairReturn',name:'北尾根・雲上の鞍部',text:'風鳴りの石段を下り、雲上の鞍部へ戻った。北へ続く石段跡はすぐ後ろにある。'};
 render();
}
const actionBase=action;
action=function(){
 if(!s.dialog&&s.screen==='world'){
  if(s.map===SKY){const n=aheadNpc(SKY);if(n?.kind==='lqSkylineBoundary'){enterSaddle(n);return;}}
  if(s.map===SADDLE){
   const n=aheadNpc(SADDLE);
   if(n){
    if(n.kind==='lqCloudbreakBoundary'&&enterWindStair())return;
    stopMoving();if(n.kind==='lqCloudbreakScuff')guidePhase='north';s.dialog=n;render();return;
   }
  }
  if(s.map===RIDGE){
   const n=aheadNpc(RIDGE);
   if(n?.kind==='lqWindStairReturn'){returnToSaddle();return;}
  }
 }
 return actionBase();
};
const checkGateBase=checkGate;
checkGate=function(){
 if(s.map===SADDLE){const row=MAPS[SADDLE]?.tiles?.[s.y]||'';if(row[s.x]==='V'){
  stopMoving();encounterGrace=RETURN_GRACE;s.map=SKY;s.x=10;s.y=2;s.dir='down';guidePhase='clue';
  s.dialog={name:'北尾根・雲裂きの稜線',text:'雲上の鞍部から露出した稜線へ戻った。横風の音が一気に耳へ戻ってくる。'};return;
 }}
 return checkGateBase();
};
const encounterMapBase=encounterMap;
encounterMap=function(){return s.map===SADDLE?true:encounterMapBase();};
const enemyPoolBase=enemyPool;
enemyPool=function(){return s.map===SADDLE?EVAC_ENEMIES:enemyPoolBase();};

function decorate(){
 if(lastMap!==s.map){if(lastMap===SADDLE)guidePhase='clue';lastMap=s.map;}
 if(s.screen!=='world'||s.map!==SADDLE)return;
 const shell=app.querySelector('.gameShell');const w=app.querySelector('.world');if(!shell||!w)return;
 let guide=shell.querySelector('.lqCloudbreakGuide');if(!guide){guide=document.createElement('div');guide.className='lqCloudbreakGuide';shell.appendChild(guide);}
 guide.textContent=guidePhase==='clue'?'雲上の鞍部：入口近くの新しい擦れ跡を調べる':'雲上の鞍部：北側へ続く石段跡を確認する';
 w.querySelectorAll('.lqCloudbreakMarker').forEach(n=>n.remove());
 const target=guidePhase==='clue'?{x:11,y:16}:{x:10,y:1};
 const marker=document.createElement('div');marker.className='lqCloudbreakMarker';marker.style.left=`${target.x*TS+TS/2}px`;marker.style.top=`${target.y*TS+TS/2}px`;w.appendChild(marker);
}
const worldBase=world;world=function(){const r=worldBase();decorate();return r;};
const renderBase=render;render=function(){const r=renderBase();decorate();return r;};

window.LQ_CLOUDBREAK_SADDLE_STATUS={version:'1.1',requirement:'REQ-121',map:SADDLE,displayName:'北尾根・雲上の鞍部',entryFrom:SKY,entrySpawn:[10,18],returnSpawn:[10,2],interactionCount:4,firstClue:{kind:'lqCloudbreakScuff',x:11,y:16},northBoundary:{kind:'lqCloudbreakBoundary',x:10,y:1},northTransition:{to:RIDGE,spawn:[11,18],dir:'up',canonicalAction:true},windStairReturn:{kind:'lqWindStairReturn',to:SADDLE,spawn:[10,2],dir:'down'},newRequiredStoryFlags:0,protectedCanonChanged:false,encounterEnabled:true,encounterPool:'EVAC_ENEMIES',entryEncounterGrace:ENTRY_GRACE,returnEncounterGrace:RETURN_GRACE,canonicalAction:true,canonicalCheckGate:true,saveSchemaChanged:false,pointerSafeGuidance:true,iosPhysicalVerification:'PENDING',guidePhase:()=>guidePhase};
})();
