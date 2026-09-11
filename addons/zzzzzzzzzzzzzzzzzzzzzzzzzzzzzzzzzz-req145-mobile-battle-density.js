(() => {
'use strict';

/* REQ-145 mobile battle density pass.
   Presentation-only: preserve the candidate's enemy focal hierarchy while
   returning a small amount of vertical space to commands on iPhone portrait. */
const STYLE_ID='lq-req145-mobile-battle-density-style';
function install(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
@media (max-width:430px) and (orientation:portrait){
  body.lqReq145GoldSlice.lq145Battle .enemySpriteStage{
    width:158px!important;
    height:144px!important;
  }
  body.lqReq145GoldSlice.lq145Battle .lqOriginalEnemySvg{
    width:min(218px,76vw)!important;
    height:170px!important;
  }
}
`;
  document.head.appendChild(style);
}
install();

function smoke(){
  if(typeof s==='undefined'||!s||typeof render!=='function')return;
  const snapshot=structuredClone(s);
  try{
    s.screen='battle';s.map='field';s.lv=3;s.hp=51;s.mh=60;s.gold=38;s.wins=2;
    if(typeof ENEMIES!=='undefined'&&ENEMIES[1])s.enemy=ENEMIES[1];
    s.ehp=17;s.log=['ツノウサギが現れた！'];render();
    requestAnimationFrame(()=>{
      const stage=document.querySelector('.enemySpriteStage');
      const svg=document.querySelector('.lqOriginalEnemySvg');
      const sr=stage?.getBoundingClientRect();
      const vr=svg?.getBoundingClientRect();
      const marker=document.createElement('i');
      marker.id='lqReq145MobileBattleDensitySmokeMarker';
      marker.hidden=true;
      marker.dataset.stagePresent=String(!!stage);
      marker.dataset.svgPresent=String(!!svg);
      marker.dataset.stageHeight=String(Math.round(sr?.height||0));
      marker.dataset.svgHeight=String(Math.round(vr?.height||0));
      marker.dataset.compactStage=String(!!sr&&sr.height<=150);
      marker.dataset.enemyStillFocal=String(!!vr&&vr.height>=160);
      marker.dataset.inputAuthority='false';
      marker.dataset.saveAuthority='false';
      marker.dataset.battleAuthority='false';
      document.body.appendChild(marker);
      s=structuredClone(snapshot);render();
    });
  }catch(error){
    const marker=document.createElement('i');
    marker.id='lqReq145MobileBattleDensitySmokeFailure';
    marker.hidden=true;
    marker.dataset.error=String(error&&error.message||error);
    document.body.appendChild(marker);
    s=structuredClone(snapshot);render();
  }
}

if(new URLSearchParams(location.search).has('lqReq145BattleDensitySmoke'))setTimeout(smoke,0);
})();
