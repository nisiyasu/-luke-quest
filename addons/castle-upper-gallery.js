(() => {
'use strict';

/* REQ-028 — safe walkable upper gallery beyond the castle entrance hall. */
const HALL='aldiaCastleEntranceHall';
const GALLERY='aldiaCastleUpperGallery';
if(!MAPS[HALL])return;

MAPS[GALLERY]={
  name:'王都アルディア・王城上階回廊',w:18,h:12,
  tiles:[
    '##################',
    '#................#',
    '#................#',
    '#................#',
    '#................#',
    '#................#',
    '#................#',
    '#................#',
    '#................#',
    '#................#',
    '#................#',
    '########GG########'
  ],
  npcs:[
    {x:4,y:3,e:'',name:'上階警備兵',kind:'lqUpperGuard',text:'「この先の執務区画と謁見区画は警戒中です。回廊の通行までなら問題ありません。」\nルーク「城って、“入れます”の次に“そこから先はダメです”がいっぱいあるんですね。」'},
    {x:13,y:3,e:'',name:'古い王都俯瞰図',kind:'lqUpperProp',text:'王都の城壁、中央道、神殿、南門が細かな線で描かれている。今歩いてきた道が、城の窓から一本につながって見える。'},
    {x:3,y:7,e:'',name:'西側の高窓',kind:'lqUpperProp',text:'高窓から王都の屋根と城壁が見える。遠くの街道まで薄く続いている。\nルーク「帰り道が見えると、急に元気が出ますね。」'},
    {x:14,y:7,e:'',name:'青銀の壁旗',kind:'lqUpperProp',text:'回廊の壁に沿って青銀の旗が並ぶ。近くで見ると、縁取りには細かな植物模様が織り込まれている。'},
    {x:1,y:5,e:'',name:'西執務区画の扉',kind:'lqUpperBoundary',text:'扉の前には警備札が掛かっている。現在は警戒対応のため、許可者以外の立ち入りは止められている。'},
    {x:16,y:5,e:'',name:'東謁見区画の扉',kind:'lqUpperBoundary',text:'重い扉の向こうから人の気配がする。今は衛兵が通行を制限している。\nルーク「謁見って言葉だけで姿勢が悪いのバレそうですね……。」'}
  ]
};

const baseTileClass=tileClass;
tileClass=function(c){
  if(s.map===GALLERY){
    if(c==='#')return'wall lqUpperWall';
    if(c==='G')return'gate lqUpperExit';
    return'floor lqUpperFloor';
  }
  return baseTileClass(c);
};
const baseTileEmoji=tileEmoji;
tileEmoji=function(c){if(s.map===GALLERY)return'';return baseTileEmoji(c);};
const baseNpcClass=npcClass;
npcClass=function(n){
  if(n?.kind==='lqUpperGuard')return'npc lqUpperGuard';
  if(n?.kind==='lqUpperProp')return'npc lqUpperProp';
  if(n?.kind==='lqUpperBoundary')return'npc lqUpperBoundary';
  return baseNpcClass(n);
};

const style=document.createElement('style');
style.textContent=`
.tile.lqUpperFloor{background:linear-gradient(135deg,#888c8c 0 45%,#717676 46% 51%,#969b99 52%);box-shadow:inset 0 1px #fff2}.tile.lqUpperWall{background:linear-gradient(#55616d,#36424e 65%,#202934);box-shadow:inset 0 -10px #101720aa}.tile.lqUpperExit{background:linear-gradient(#a77f50,#6d4c31);box-shadow:inset 0 0 0 3px #f3d08a55}
.lqUpperGuard{width:40px;height:46px;font-size:0;border-radius:10px 10px 5px 5px;background:linear-gradient(#233a59 0 23%,#d7b18b 24% 43%,#687583 44% 100%);border:2px solid #d1d8df;box-shadow:0 5px 9px #0009}.lqUpperGuard:before{content:'';position:absolute;left:6px;top:1px;width:25px;height:14px;border-radius:50% 50% 24% 24%;background:#929ca6;border:2px solid #e1e5e8}.lqUpperGuard:after{content:'…';position:absolute;right:-7px;top:-11px;color:#fff0b0;font-size:15px;text-shadow:0 2px 4px #000}
.lqUpperProp{width:40px;height:40px;font-size:0;border:2px solid #c5b57b;border-radius:6px;background:linear-gradient(145deg,#66747f,#33414d);box-shadow:0 5px 9px #0008}.lqUpperProp:after{content:'✦';position:absolute;right:2px;top:0;color:#ffe18a;font-size:11px;text-shadow:0 0 6px #ffd45b}
.lqUpperBoundary{width:42px;height:47px;font-size:0;border:3px solid #c9b879;border-radius:4px;background:linear-gradient(90deg,#263a53,#415d80 49%,#24364d 51%);box-shadow:inset 0 0 0 2px #111b29,0 6px 10px #0009}.lqUpperBoundary:after{content:'';position:absolute;right:5px;top:21px;width:5px;height:5px;border-radius:50%;background:#ffe48c;box-shadow:0 0 8px #ffd85d}
.lqUpperRunner{position:absolute;z-index:2;width:680px;height:116px;background:linear-gradient(#781621,#a32632 52%,#6d111a);border-top:5px solid #c4a75d;border-bottom:5px solid #c4a75d;box-shadow:0 0 18px #0007;pointer-events:none}.lqUpperArch{position:absolute;z-index:3;width:70px;height:132px;border:9px solid #77838c;border-bottom:0;border-radius:35px 35px 0 0;box-shadow:0 7px 10px #0008,inset 0 0 0 3px #aeb8bd44;pointer-events:none}.lqUpperWindow{position:absolute;z-index:2;width:64px;height:96px;border:7px solid #626d76;border-radius:28px 28px 4px 4px;background:linear-gradient(#83b7d7,#d6e9ec 55%,#8aa9b3);box-shadow:0 0 20px #bde7ff55,inset 0 0 0 2px #fff5;pointer-events:none}.lqUpperBanner{position:absolute;z-index:4;width:50px;height:82px;background:linear-gradient(90deg,#123c76,#2869ac,#123c76);clip-path:polygon(0 0,100% 0,100% 82%,50% 100%,0 82%);box-shadow:0 6px 10px #0008;pointer-events:none}.lqUpperBanner:after{content:'✦';position:absolute;left:12px;top:22px;color:#eef4f7;font-size:24px}
`;
document.head.appendChild(style);

function galleryAhead(){
  if(s.screen!=='world'||s.map!==GALLERY)return null;
  const p=front();
  return MAPS[GALLERY].npcs.find(n=>n.x===p.x&&n.y===p.y)||null;
}
function enterGallery(){
  stopMoving();s.map=GALLERY;s.x=8;s.y=9;s.dir='up';
  s.dialog={name:'王城上階回廊',text:'大階段を上ると、長い回廊の窓から王都の屋根が見渡せた。\nルーク「高いところまで来ると、勇者っぽさより帰りの階段の長さが気になりますね……。」'};
  render();
}

const baseAction=action;
action=function(){
  if(!s.dialog&&s.screen==='world'&&s.map===HALL){
    const p=front();
    const n=MAPS[HALL].npcs.find(x=>x.x===p.x&&x.y===p.y);
    if(n?.kind==='lqCastleDeepBoundary')return enterGallery();
  }
  if(!s.dialog&&s.screen==='world'&&s.map===GALLERY){
    const n=galleryAhead();
    if(n){stopMoving();s.dialog=n;render();return;}
  }
  return baseAction();
};

const baseCheckGate=checkGate;
checkGate=function(){
  if(s.map===GALLERY&&s.y===11&&((MAPS[GALLERY].tiles[s.y]||'')[s.x]==='G')){
    stopMoving();s.map=HALL;s.x=7;s.y=2;s.dir='down';
    s.dialog={name:'王城玄関ホール',text:'大階段を下り、玄関ホールへ戻った。'};
    return;
  }
  return baseCheckGate();
};

function decorate(){
  if(s.screen!=='world'||s.map!==GALLERY)return;
  const w=app.querySelector('.world');
  if(!w||w.querySelector('.lqUpperRunner'))return;
  const r=document.createElement('div');r.className='lqUpperRunner';r.style.left=`${1.9*TS}px`;r.style.top=`${5.0*TS}px`;w.appendChild(r);
  for(const x of [2.3,7.7,13.1]){const a=document.createElement('div');a.className='lqUpperArch';a.style.left=`${x*TS}px`;a.style.top=`${1.1*TS}px`;w.appendChild(a);}
  for(const x of [5.0,11.0]){const win=document.createElement('div');win.className='lqUpperWindow';win.style.left=`${x*TS}px`;win.style.top=`${1.25*TS}px`;w.appendChild(win);}
  for(const x of [3.8,12.6]){const b=document.createElement('div');b.className='lqUpperBanner';b.style.left=`${x*TS}px`;b.style.top=`${7.5*TS}px`;w.appendChild(b);}
}
const baseWorld=world;
world=function(){const r=baseWorld();decorate();return r;};
const baseRender=render;
render=function(){const r=baseRender();decorate();return r;};

window.LQ_BUILDING_INTERIORS=Object.assign({},window.LQ_BUILDING_INTERIORS,{aldiaCastleUpperGallery:{entryMap:HALL,map:GALLERY,exitMap:HALL,type:'castle-upper-gallery'}});
window.LQ_CASTLE_UPPER_GALLERY_STATUS={version:'1.0',map:GALLERY,from:HALL,interactionCount:6,deepBoundaries:2,protectedCanonChanged:false,fullCastleComplete:false,iosPhysicalVerification:'PENDING'};
})();
