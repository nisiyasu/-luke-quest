(() => {
'use strict';

/* REQ-140 emergency save rescue/import panel.
   Export from the broken standalone PWA; import into a fresh Safari context
   with ?save-rescue=1. Existing save is never overwritten until JSON passes
   validation and the user explicitly taps restore. */

const SAVE_KEY='lukeQuestV2';
const PANEL_ID='lqReq140SaveRescue';

function isStandalone(){
  return (window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone===true;
}
function rescueRequested(){
  try{return new URLSearchParams(location.search).get('save-rescue')==='1';}catch(_){return false;}
}
function safeParse(raw){try{return raw?JSON.parse(raw):null}catch(_){return null}}
function validSave(data){
  return !!data&&typeof data==='object'&&!Array.isArray(data)&&
    Number.isFinite(data.lv)&&typeof data.map==='string'&&
    Number.isFinite(data.x)&&Number.isFinite(data.y);
}
function summary(raw){
  const data=safeParse(raw);
  if(!data)return raw?'セーブJSONあり / 解析失敗':'セーブなし';
  const bits=[];
  if(data.map)bits.push(`場所: ${data.map}`);
  if(Number.isFinite(data.lv))bits.push(`LV ${data.lv}`);
  if(Number.isFinite(data.wins))bits.push(`勝利 ${data.wins}`);
  if(Number.isFinite(data.playSeconds))bits.push(`プレイ ${Math.floor(data.playSeconds/60)}分`);
  return bits.join(' / ')||'セーブあり';
}
function copyText(text,button){
  const done=()=>{if(button){const old=button.textContent;button.textContent='コピーしました';setTimeout(()=>button.textContent=old,1800)}};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text,done));
  else fallbackCopy(text,done);
}
function fallbackCopy(text,done){
  const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');
  Object.assign(ta.style,{position:'fixed',left:'-9999px',top:'0'});document.body.appendChild(ta);ta.select();
  try{document.execCommand('copy');done();}catch(_){} ta.remove();
}
function download(raw){
  const blob=new Blob([raw],{type:'application/json'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob);a.download='luke-quest-save-rescue.json';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function mount(){
  const standalone=isStandalone(), requested=rescueRequested();
  if((!standalone&&!requested)||document.getElementById(PANEL_ID))return;
  const raw=localStorage.getItem(SAVE_KEY)||'';
  const panel=document.createElement('section');panel.id=PANEL_ID;panel.setAttribute('role','dialog');panel.setAttribute('aria-label','LUKE QUEST セーブ救出');
  const exportHtml=standalone?(raw?`<div class="lqReq140Note">このPWAのセーブを先にバックアップしてください。</div><button id="lqReq140Copy">セーブをコピー</button><button id="lqReq140Download">セーブをファイル保存</button>`:`<div class="lqReq140Note">このPWA保存領域には ${SAVE_KEY} が見つかりません。</div>`):'';
  const importHtml=requested?`<div class="lqReq140Import"><div class="lqReq140Head">セーブを復元</div><div class="lqReq140Note">救出したJSON全文を下へ貼り付けてください。正常なJSONだけ保存します。</div><textarea id="lqReq140Paste" rows="8" placeholder="ここに { から } まで全部貼り付け"></textarea><input id="lqReq140File" type="file" accept="*/*"><button id="lqReq140Restore">検証して復元</button><div id="lqReq140Result" aria-live="polite"></div></div>`:'';
  panel.innerHTML=`<div class="lqReq140Box"><div class="lqReq140Title">LUKE QUEST セーブ救出</div><div class="lqReq140Status">現在: ${summary(raw)}</div>${exportHtml}${importHtml}<button id="lqReq140Continue">ゲーム画面へ戻る</button></div>`;
  const style=document.createElement('style');style.id='lqReq140SaveRescueStyle';style.textContent=`#${PANEL_ID}{position:fixed!important;inset:0!important;z-index:2147483647!important;background:#07111f!important;color:#fff7dd!important;display:flex!important;align-items:flex-start!important;justify-content:center!important;padding:20px!important;overflow:auto!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;transform:none!important;opacity:1!important;visibility:visible!important;contain:none!important}.lqReq140Box{width:min(92vw,520px);background:#101d31;border:1px solid #ffffff33;border-radius:16px;padding:18px;margin:auto;box-shadow:none}.lqReq140Title{font-size:22px;font-weight:900;margin-bottom:10px}.lqReq140Head{font-size:18px;font-weight:900;margin-top:18px}.lqReq140Status,.lqReq140Note,#lqReq140Result{line-height:1.55;margin:10px 0}.lqReq140Note{font-size:13px;color:#c7d2df}#lqReq140Paste{box-sizing:border-box;width:100%;min-height:150px;padding:10px;border-radius:10px;border:1px solid #ffffff44;background:#07111f;color:#fff;font:12px/1.4 monospace}#lqReq140File{box-sizing:border-box;width:100%;margin:10px 0;color:#fff}#${PANEL_ID} button{display:block;width:100%;margin:9px 0;padding:14px;border:0;border-radius:12px;background:#347cff;color:#fff;font-weight:800;font-size:16px}#${PANEL_ID} #lqReq140Continue{background:#2b405a}`;
  document.head.appendChild(style);document.body.appendChild(panel);
  const copyBtn=document.getElementById('lqReq140Copy');if(copyBtn)copyBtn.addEventListener('click',()=>copyText(raw,copyBtn));
  const dlBtn=document.getElementById('lqReq140Download');if(dlBtn)dlBtn.addEventListener('click',()=>download(raw));
  const file=document.getElementById('lqReq140File'),paste=document.getElementById('lqReq140Paste'),result=document.getElementById('lqReq140Result');
  if(file)file.addEventListener('change',async()=>{const f=file.files&&file.files[0];if(!f)return;try{paste.value=await f.text();result.textContent='ファイルを読み込みました。次に「検証して復元」を押してください。';}catch(_){result.textContent='ファイルを読み込めませんでした。テキスト貼り付けを使ってください。';}});
  const restore=document.getElementById('lqReq140Restore');if(restore)restore.addEventListener('click',()=>{
    const candidate=(paste.value||'').trim(),data=safeParse(candidate);
    if(!validSave(data)){result.textContent='復元しませんでした：JSONまたはセーブ形式が不正です。';return;}
    try{
      localStorage.setItem(SAVE_KEY,JSON.stringify(data));
      const verify=localStorage.getItem(SAVE_KEY)||'';
      if(!validSave(safeParse(verify))){result.textContent='保存後の検証に失敗しました。再読み込みしません。';return;}
      result.textContent=`復元成功：${summary(verify)}。ゲームを再読み込みします。`;
      setTimeout(()=>{location.href=location.pathname+'?restored='+Date.now();},700);
    }catch(e){result.textContent='保存に失敗しました：'+(e&&e.message?e.message:'unknown error');}
  });
  document.getElementById('lqReq140Continue').addEventListener('click',()=>{panel.remove();style.remove();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
