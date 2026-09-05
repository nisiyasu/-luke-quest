(() => {
'use strict';

/* LUKE QUEST v0.56 title continue-data preview.
   Gives returning players a console-RPG style save snapshot without changing save data. */

const style=document.createElement('style');
style.textContent=`
.lqContinuePreview{position:relative;z-index:2;max-width:360px;margin:5px auto 8px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px;background:#071525bb;border:1px solid #ffffff18;border-radius:10px;padding:7px}.lqContinueStat{padding:4px;border-right:1px solid #ffffff12;text-align:center}.lqContinueStat:last-child{border-right:0}.lqContinueStat small{display:block;color:#7f97ad;font-size:7px;letter-spacing:.12em}.lqContinueStat b{display:block;color:#e9f0f5;font-size:10px;margin-top:2px}.lqContinueLocation{position:relative;z-index:2;max-width:360px;margin:-2px auto 6px;color:#91a6ba;font-size:9px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
`;
document.head.appendChild(style);

function addSavePreview(){
 if(s.screen!=='title')return;
 const stage=app.querySelector('.lqTitleStage');if(!stage||stage.querySelector('.lqContinuePreview'))return;
 const raw=localStorage.getItem('lukeQuestV2');if(!raw)return;
 let saveData;try{saveData=JSON.parse(raw);}catch{return;}
 const continueBtn=Array.from(stage.querySelectorAll('button')).find(b=>b.textContent.includes('つづきから'));if(!continueBtn)return;
 const mapName=MAPS[saveData.map]?.name||'王都アルディア';
 const preview=document.createElement('div');preview.className='lqContinuePreview';preview.innerHTML=`<div class=lqContinueStat><small>LEVEL</small><b>LV ${saveData.lv||1}</b></div><div class=lqContinueStat><small>GOLD</small><b>${saveData.gold||0} G</b></div><div class=lqContinueStat><small>WINS</small><b>${saveData.wins||0}</b></div>`;
 const location=document.createElement('div');location.className='lqContinueLocation';location.textContent=`SAVE DATA　${mapName}`;
 continueBtn.before(preview);continueBtn.before(location);
}

const titleV55=title;title=function(){titleV55();addSavePreview();};
const renderV55=render;render=function(){const r=renderV55();if(s.screen==='title')addSavePreview();return r;};
window.LQ_TITLE_SAVE_PREVIEW_STATUS={level:true,gold:true,wins:true,location:true};
if(s.screen==='title')addSavePreview();
})();
