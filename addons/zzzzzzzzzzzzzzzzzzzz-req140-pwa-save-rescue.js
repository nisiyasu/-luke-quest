(() => {
'use strict';

/* REQ-140 emergency save rescue panel.
   Goal: recover lukeQuestV2 from an iPhone standalone PWA even when the game
   surface is black. Presentation-only. Does not mutate or delete save data. */

const SAVE_KEY='lukeQuestV2';
const PANEL_ID='lqReq140SaveRescue';

function isStandalone(){
  return (window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone===true;
}

function safeParse(raw){
  try{return raw?JSON.parse(raw):null}catch(_){return null}
}

function summary(raw){
  const data=safeParse(raw);
  if(!data)return raw?'セーブJSONあり / 解析失敗':'セーブなし';
  const bits=[];
  if(data.map)bits.push(`場所: ${data.map}`);
  if(Number.isFinite(data.lv))bits.push(`LV ${data.lv}`);
  if(Number.isFinite(data.wins))bits.push(`勝利 ${data.wins}`);
  if(data.flags&&data.flags.withdrawProofSeen)bits.push('退避命令確認済み');
  else if(data.flags&&data.flags.evacEntered)bits.push('北の退避路到達');
  else if(data.flags&&data.flags.glennSeen)bits.push('グレン確認済み');
  else if(data.flags&&data.flags.leonSeen)bits.push('レオン発見済み');
  return bits.join(' / ')||'セーブあり';
}

function copyText(text,button){
  const done=()=>{if(button){const old=button.textContent;button.textContent='コピーしました';setTimeout(()=>button.textContent=old,1800)}};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text,done));}
  else fallbackCopy(text,done);
}

function fallbackCopy(text,done){
  const ta=document.createElement('textarea');
  ta.value=text;ta.setAttribute('readonly','');
  Object.assign(ta.style,{position:'fixed',left:'-9999px',top:'0'});
  document.body.appendChild(ta);ta.select();
  try{document.execCommand('copy');done();}catch(_){}
  ta.remove();
}

function download(raw){
  const blob=new Blob([raw],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='luke-quest-save-rescue.json';
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

function mount(){
  if(!isStandalone()||document.getElementById(PANEL_ID))return;
  const raw=localStorage.getItem(SAVE_KEY)||'';
  const panel=document.createElement('section');
  panel.id=PANEL_ID;
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-label','LUKE QUEST セーブ救出');
  panel.innerHTML=`<div class="lqReq140Box"><div class="lqReq140Title">LUKE QUEST セーブ救出</div><div class="lqReq140Status">${summary(raw)}</div>${raw?'<div class="lqReq140Note">この画面ではセーブを削除・上書きしません。まずバックアップしてください。</div><button id="lqReq140Copy">セーブをコピー</button><button id="lqReq140Download">セーブをファイル保存</button>':'<div class="lqReq140Note">このPWA保存領域には lukeQuestV2 が見つかりません。</div>'}<button id="lqReq140Continue">ゲーム画面を表示してみる</button></div>`;
  const style=document.createElement('style');
  style.id='lqReq140SaveRescueStyle';
  style.textContent=`#${PANEL_ID}{position:fixed!important;inset:0!important;z-index:2147483647!important;background:#07111f!important;color:#fff7dd!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:20px!important;overflow:auto!important;filter:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;transform:none!important;opacity:1!important;visibility:visible!important;isolation:auto!important;contain:none!important}.lqReq140Box{width:min(92vw,520px);background:#101d31;border:1px solid #ffffff33;border-radius:16px;padding:18px;box-shadow:none}.lqReq140Title{font-size:22px;font-weight:900;margin-bottom:10px}.lqReq140Status,.lqReq140Note{line-height:1.55;margin:10px 0}.lqReq140Note{font-size:13px;color:#c7d2df}#${PANEL_ID} button{display:block;width:100%;margin:9px 0;padding:14px;border:0;border-radius:12px;background:#347cff;color:#fff;font-weight:800;font-size:16px}#${PANEL_ID} #lqReq140Continue{background:#2b405a}`;
  document.head.appendChild(style);
  document.body.appendChild(panel);
  const copyBtn=document.getElementById('lqReq140Copy');
  if(copyBtn)copyBtn.addEventListener('click',()=>copyText(raw,copyBtn));
  const dlBtn=document.getElementById('lqReq140Download');
  if(dlBtn)dlBtn.addEventListener('click',()=>download(raw));
  document.getElementById('lqReq140Continue').addEventListener('click',()=>{panel.remove();style.remove();});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});
else mount();
})();
