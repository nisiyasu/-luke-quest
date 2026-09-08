(() => {
'use strict';

/* REQ-140 physical-iPhone recovery aid.
   Adds an explicit, reversible safe-resume action to the rescue panel.
   The canonical save is backed up first; only screen/map/x/y/dir/dialog are
   changed, so progression, stats, inventory, flags and history are preserved. */

const SAVE_KEY='lukeQuestV2';
const PANEL_ID='lqReq140SaveRescue';
const SAFE_MAP='skylineTraverse';

function requested(){
  try{return new URLSearchParams(location.search).get('save-rescue')==='1';}catch(_){return false;}
}
function parse(raw){try{return raw?JSON.parse(raw):null}catch(_){return null}}
function mountSafeResume(){
  if(!requested())return;
  const panel=document.getElementById(PANEL_ID);
  if(!panel||document.getElementById('lqReq140SafeResume'))return;
  const raw=localStorage.getItem(SAVE_KEY)||'';
  const data=parse(raw);
  if(!data||typeof data!=='object')return;

  const box=panel.querySelector('.lqReq140Box');
  if(!box)return;
  const wrap=document.createElement('div');
  wrap.id='lqReq140SafeResume';
  wrap.innerHTML=`<div class="lqReq140Head">黒画面から安全再開</div><div class="lqReq140Note">現在地だけを1つ前の「雲裂きの稜線」へ戻します。LV・所持品・勝利数・進行フラグなどは維持し、変更前セーブも端末内に別バックアップします。</div><button id="lqReq140SafeResumeBtn">1つ前の稜線で安全再開</button><div id="lqReq140SafeResumeResult" aria-live="polite"></div>`;
  const cont=document.getElementById('lqReq140Continue');
  box.insertBefore(wrap,cont||null);

  document.getElementById('lqReq140SafeResumeBtn').addEventListener('click',()=>{
    const result=document.getElementById('lqReq140SafeResumeResult');
    const currentRaw=localStorage.getItem(SAVE_KEY)||'';
    const current=parse(currentRaw);
    if(!current||typeof current!=='object'){
      result.textContent='セーブを読めないため変更していません。';
      return;
    }
    try{
      let backupKey='lukeQuestV2_req140_original';
      if(localStorage.getItem(backupKey)) backupKey='lukeQuestV2_req140_original_'+Date.now();
      localStorage.setItem(backupKey,currentRaw);
      const relocated={...current,screen:'world',map:SAFE_MAP,x:10,y:2,dir:'down',dialog:null,enemy:null,ehp:0,pauseOpen:false,shopOpen:false};
      localStorage.setItem(SAVE_KEY,JSON.stringify(relocated));
      const verify=parse(localStorage.getItem(SAVE_KEY)||'');
      if(!verify||verify.map!==SAFE_MAP||verify.x!==10||verify.y!==2){
        localStorage.setItem(SAVE_KEY,currentRaw);
        result.textContent='検証に失敗したため元セーブへ戻しました。';
        return;
      }
      result.textContent='安全地点へ移動しました。元セーブも退避済みです。再読み込みします。';
      setTimeout(()=>{location.href=location.pathname+'?safe-resumed='+Date.now();},650);
    }catch(e){
      result.textContent='変更できませんでした。元の外部バックアップはそのまま安全です。';
    }
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(mountSafeResume,0),{once:true});
else setTimeout(mountSafeResume,0);
})();
