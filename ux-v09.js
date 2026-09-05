(() => {
'use strict';

/* LUKE QUEST v0.9 dialogue presentation patch.
   Loaded after ux-v08.js. Keeps field sprites separate from conversation portraits. */

const PORTRAITS={
  luke:{neutral:'assets/portraits/luke.svg'},
  leon:{neutral:'assets/portraits/leon.svg'},
  glenn:{neutral:'assets/portraits/glenn.svg'}
};
const SPEAKER_KEYS={
  'ルーク':'luke',
  'レオン':'leon',
  'グレン':'glenn'
};
const DEFAULT_SIDE={luke:'left',leon:'right',glenn:'right'};

window.LQ_PORTRAITS=PORTRAITS;

const style=document.createElement('style');
style.textContent=`
.dialogBox.portraitMode{min-height:164px;padding:0;overflow:hidden;display:grid;grid-template-columns:116px 1fr;background:linear-gradient(180deg,#0b172df7,#07111ff7);border-color:#f3e8c5;box-shadow:0 10px 26px #000c}
.dialogBox.portraitMode.portraitRight{grid-template-columns:1fr 116px}
.dialogPortrait{position:relative;min-height:164px;overflow:hidden;background:linear-gradient(180deg,#182943,#0b1322);border-right:1px solid #ffffff25}
.portraitRight .dialogPortrait{order:2;border-right:0;border-left:1px solid #ffffff25}
.dialogPortrait img{position:absolute;width:100%;height:100%;object-fit:cover;object-position:50% 18%;inset:0;filter:saturate(1.04) contrast(1.02);transform:scale(1.02)}
.dialogPortrait:after{content:"";position:absolute;inset:0;box-shadow:inset 0 -22px 28px #07111f80;pointer-events:none}
.dialogCopy{padding:12px 13px 11px;min-width:0;display:flex;flex-direction:column}
.dialogCopy .speaker{font-size:16px;letter-spacing:.03em;margin-bottom:7px;text-shadow:0 2px 8px #000}
.dialogCopy .dialog{font-size:14px;line-height:1.55;overflow-wrap:anywhere;flex:1}
.dialogHint{color:#a9b9cc;font-size:10px;text-align:right;margin-top:7px}
.portraitBadge{position:absolute;left:6px;bottom:6px;z-index:2;background:#07111fce;border:1px solid #ffffff30;border-radius:999px;padding:3px 6px;font-size:9px;font-weight:800;color:#dbe8f8}
.storyPortraitCard{position:relative;overflow:hidden;padding-left:132px;min-height:190px}
.storyPortraitCard.storyPortraitRight{padding-left:14px;padding-right:132px}
.storyPortraitCard .storyPortrait{position:absolute;left:0;top:0;bottom:0;width:118px;background:#0a1424;border-right:1px solid #ffffff1f;overflow:hidden}
.storyPortraitCard.storyPortraitRight .storyPortrait{left:auto;right:0;border-right:0;border-left:1px solid #ffffff1f}
.storyPortrait img{width:100%;height:100%;object-fit:cover;object-position:50% 18%}
@media(max-width:390px){
 .dialogBox.portraitMode{grid-template-columns:96px 1fr;min-height:150px}
 .dialogBox.portraitMode.portraitRight{grid-template-columns:1fr 96px}
 .dialogPortrait{min-height:150px}
 .dialogCopy{padding:10px}
 .dialogCopy .dialog{font-size:13px;line-height:1.48}
 .storyPortraitCard{padding-left:112px;min-height:176px}
 .storyPortraitCard.storyPortraitRight{padding-left:14px;padding-right:112px}
 .storyPortraitCard .storyPortrait{width:100px}
}
@media(max-height:700px){
 .dialogBox.portraitMode{min-height:132px;grid-template-columns:82px 1fr}
 .dialogBox.portraitMode.portraitRight{grid-template-columns:1fr 82px}
 .dialogPortrait{min-height:132px}
 .dialogCopy .dialog{font-size:12px;line-height:1.4}
 .dialogCopy .speaker{font-size:14px}
}
`;
document.head.appendChild(style);

function portraitSpec(dialog){
  if(!dialog)return null;
  const key=dialog.portraitKey||SPEAKER_KEYS[dialog.name];
  if(!key||!PORTRAITS[key])return null;
  const expression=dialog.expression||'neutral';
  const src=PORTRAITS[key][expression]||PORTRAITS[key].neutral;
  if(!src)return null;
  return {key,expression,src,side:dialog.side||DEFAULT_SIDE[key]||'left'};
}

function enhanceWorldDialogue(){
  const box=app.querySelector('.dialogBox');
  if(!box||box.dataset.portraitEnhanced==='1'||!s.dialog)return;
  const spec=portraitSpec(s.dialog);
  if(!spec)return;
  const speaker=box.querySelector('.speaker');
  const text=box.querySelector('.dialog');
  if(!speaker||!text)return;
  box.dataset.portraitEnhanced='1';
  box.classList.add('portraitMode');
  if(spec.side==='right')box.classList.add('portraitRight');
  const portrait=document.createElement('div');
  portrait.className='dialogPortrait';
  const img=document.createElement('img');
  img.src=spec.src;
  img.alt=`${s.dialog.name} 会話立ち絵`;
  img.decoding='async';
  portrait.appendChild(img);
  const badge=document.createElement('div');
  badge.className='portraitBadge';
  badge.textContent=s.dialog.name;
  portrait.appendChild(badge);
  const copy=document.createElement('div');
  copy.className='dialogCopy';
  copy.appendChild(speaker);
  copy.appendChild(text);
  const hint=document.createElement('div');
  hint.className='dialogHint';
  hint.textContent='Aで閉じる';
  copy.appendChild(hint);
  box.innerHTML='';
  box.appendChild(portrait);
  box.appendChild(copy);
}

function enhanceStoryDialogue(){
  const speaker=app.querySelector('.card .speaker');
  if(!speaker)return;
  const name=speaker.textContent.trim();
  const key=SPEAKER_KEYS[name];
  if(!key||!PORTRAITS[key])return;
  const card=speaker.closest('.card');
  if(!card||card.dataset.portraitEnhanced==='1')return;
  card.dataset.portraitEnhanced='1';
  card.classList.add('storyPortraitCard');
  const side=DEFAULT_SIDE[key]||'left';
  if(side==='right')card.classList.add('storyPortraitRight');
  const frame=document.createElement('div');
  frame.className='storyPortrait';
  const img=document.createElement('img');
  img.src=PORTRAITS[key].neutral;
  img.alt=`${name} 会話立ち絵`;
  img.decoding='async';
  frame.appendChild(img);
  card.prepend(frame);
}

const worldV08=world;
world=function(){
  worldV08();
  enhanceWorldDialogue();
};

const storyCore=story;
story=function(){
  storyCore();
  enhanceStoryDialogue();
};

const renderBeforeV09=render;
render=function(){
  const result=renderBeforeV09();
  if(s.screen==='world')enhanceWorldDialogue();
  if(s.screen==='intro')enhanceStoryDialogue();
  return result;
};

/* Re-render current screen so an already-open dialogue gains the new portrait shell. */
render();

})();
