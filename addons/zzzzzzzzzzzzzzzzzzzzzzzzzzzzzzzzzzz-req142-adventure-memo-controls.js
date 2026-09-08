(() => {
'use strict';

const REQ='REQ-142';
const OLD='操作：十字キーで移動、Aで会話。';
const MODERN='操作：画面をドラッグで移動、短くタップで調べる・話す。\nキーボード：矢印 / WASDで移動、Enter / Spaceで調べる・話す。';

if(typeof openMenu!=='function'){
  console.warn(`[${REQ}] canonical openMenu unavailable`);
  return;
}
const baseOpenMenu=openMenu;
openMenu=function(){
  const result=baseOpenMenu.apply(this,arguments);
  try{
    if(typeof s!=='undefined'&&s?.dialog?.name==='冒険メモ'&&typeof s.dialog.text==='string'&&s.dialog.text.includes(OLD)){
      s.dialog.text=s.dialog.text.replace(OLD,MODERN);
      if(typeof render==='function')render();
    }
  }catch(error){console.warn(`[${REQ}] memo hint decoration failed`,error)}
  return result;
};

window.LQ_REQ142_STATUS={requirement:REQ,inputHandlersAdded:0,canonicalActionChanged:false,iosPhysicalVerification:'PENDING'};
})();
