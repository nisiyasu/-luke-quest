(() => {
'use strict';

/* LUKE QUEST v0.12 character-asset transport layer.
   Purpose: prove repository-safe base64 raster transport and integrate only approved formal art. */

const TEST_ASSET={
  path:'assets/characters/transport-test.png.b64',
  mime:'image/png',
  formal:false
};

window.LQ_CHARACTER_ASSETS=window.LQ_CHARACTER_ASSETS||{};
window.LQ_CHARACTER_ASSETS.luke=window.LQ_CHARACTER_ASSETS.luke||{};
window.LQ_CHARACTER_ASSETS.luke.dialogue=window.LQ_CHARACTER_ASSETS.luke.dialogue||{};
window.LQ_CHARACTER_ASSETS.luke.dialogue.neutral={
  path:'assets/characters/luke/dialogue-neutral.webp.b64',
  mime:'image/webp',
  formal:true,
  source:'owner-approved Luke full-body reference'
};
window.LQ_ASSET_TRANSPORT_STATUS={state:'pending',detail:'probe not started'};

const assetCache=new Map();

function base64ToBlobUrl(base64,mime){
  const clean=String(base64||'').replace(/\s+/g,'');
  const binary=atob(clean);
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes],{type:mime||'application/octet-stream'}));
}

async function loadBase64Asset(spec){
  if(!spec||!spec.path)throw new Error('asset spec missing path');
  const key=`${spec.mime||''}|${spec.path}`;
  if(assetCache.has(key))return assetCache.get(key);
  const promise=(async()=>{
    const response=await fetch(spec.path,{cache:'force-cache'});
    if(!response.ok)throw new Error(`asset fetch ${response.status}: ${spec.path}`);
    const base64=(await response.text()).trim();
    if(!base64)throw new Error(`asset payload empty: ${spec.path}`);
    const url=base64ToBlobUrl(base64,spec.mime);
    await new Promise((resolve,reject)=>{
      const img=new Image();
      img.onload=()=>resolve();
      img.onerror=()=>reject(new Error(`decoded image failed: ${spec.path}`));
      img.src=url;
    });
    return url;
  })();
  assetCache.set(key,promise);
  return promise;
}

window.LQ_loadBase64Asset=loadBase64Asset;

async function runTransportProbe(){
  try{
    const url=await loadBase64Asset(TEST_ASSET);
    window.LQ_ASSET_TRANSPORT_STATUS={state:'pass',detail:'base64 text fetched and decoded as PNG',urlKind:url.startsWith('blob:')?'blob':'other'};
  }catch(error){
    window.LQ_ASSET_TRANSPORT_STATUS={state:'fail',detail:String(error&&error.message||error)};
    console.warn('[LUKE QUEST] asset transport probe failed',error);
  }
}

function formalDialogueSpec(key,expression='neutral'){
  const character=window.LQ_CHARACTER_ASSETS&&window.LQ_CHARACTER_ASSETS[key];
  const spec=character&&character.dialogue&&(character.dialogue[expression]||character.dialogue.neutral);
  return spec&&spec.formal===true?spec:null;
}

function formalFieldSpec(key,dir){
  const character=window.LQ_CHARACTER_ASSETS&&window.LQ_CHARACTER_ASSETS[key];
  const spec=character&&character.field&&character.field[dir];
  return spec&&spec.formal===true?spec:null;
}

async function hydrateFormalDialogueAsset(key,expression='neutral'){
  const spec=formalDialogueSpec(key,expression);
  if(!spec||!window.LQ_PORTRAITS||!window.LQ_PORTRAITS[key])return false;
  try{
    const url=await loadBase64Asset(spec);
    window.LQ_PORTRAITS[key][expression]=url;
    if(expression!=='neutral'&&!window.LQ_PORTRAITS[key].neutral)window.LQ_PORTRAITS[key].neutral=url;
    return true;
  }catch(error){
    console.warn(`[LUKE QUEST] formal dialogue asset failed: ${key}/${expression}`,error);
    return false;
  }
}

async function applyFormalLukeFieldArt(){
  if(typeof s==='undefined'||s.screen!=='world')return false;
  const dir=['up','down','left','right'].includes(s.dir)?s.dir:'down';
  const spec=formalFieldSpec('luke',dir);
  if(!spec)return false;
  const host=app&&app.querySelector('.player');
  if(!host)return false;
  try{
    const url=await loadBase64Asset(spec);
    if(typeof s==='undefined'||s.screen!=='world')return false;
    const currentDir=['up','down','left','right'].includes(s.dir)?s.dir:'down';
    if(currentDir!==dir)return false;
    const img=document.createElement('img');
    img.className='lukeFormalFieldArt';
    img.src=url;
    img.alt=`ルーク ${dir}`;
    img.decoding='async';
    host.replaceChildren(img);
    host.dataset.direction=dir;
    host.dataset.formalArt='1';
    return true;
  }catch(error){
    console.warn(`[LUKE QUEST] formal Luke field art failed: ${dir}`,error);
    return false;
  }
}

const style=document.createElement('style');
style.textContent=`
.player .lukeFormalFieldArt{display:block;width:38px;height:42px;object-fit:contain;object-position:center bottom;filter:drop-shadow(0 4px 3px #0008)}
.dialogPortrait img,.storyPortrait img{object-fit:contain!important;object-position:center bottom!important;background:linear-gradient(180deg,#31577e,#14243b)}
.dialogBox.portraitMode{grid-template-columns:142px 1fr}
.dialogBox.portraitMode.portraitRight{grid-template-columns:1fr 142px}
.dialogPortrait{min-height:196px}
.storyPortraitCard{padding-left:152px;min-height:220px}
.storyPortraitCard.storyPortraitRight{padding-left:14px;padding-right:152px}
.storyPortraitCard .storyPortrait{width:140px}
@media(max-width:390px){
 .dialogBox.portraitMode{grid-template-columns:116px 1fr;min-height:180px}
 .dialogBox.portraitMode.portraitRight{grid-template-columns:1fr 116px}
 .dialogPortrait{min-height:180px}
 .storyPortraitCard{padding-left:126px;min-height:196px}
 .storyPortraitCard.storyPortraitRight{padding-left:14px;padding-right:126px}
 .storyPortraitCard .storyPortrait{width:114px}
}
@media(max-height:700px){
 .dialogBox.portraitMode{grid-template-columns:96px 1fr;min-height:150px}
 .dialogBox.portraitMode.portraitRight{grid-template-columns:1fr 96px}
 .dialogPortrait{min-height:150px}
}
`;
document.head.appendChild(style);

const worldV11=world;
world=function(){
  worldV11();
  void applyFormalLukeFieldArt();
};

const renderV11=render;
render=function(){
  const result=renderV11();
  if(typeof s!=='undefined'&&s.screen==='world')void applyFormalLukeFieldArt();
  return result;
};

window.LQ_hydrateFormalDialogueAsset=hydrateFormalDialogueAsset;
window.LQ_applyFormalLukeFieldArt=applyFormalLukeFieldArt;
window.LQ_CHARACTER_ASSET_CONTRACT_VERSION='1.0';

void runTransportProbe();
void hydrateFormalDialogueAsset('luke','neutral').then(ok=>{
  window.LQ_LUKE_FORMAL_DIALOGUE_STATUS=ok?'integrated':'failed';
  if(ok&&typeof render==='function')render();
});

})();
