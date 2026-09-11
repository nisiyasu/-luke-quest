(() => {
'use strict';
if(typeof location==='undefined'||!new URLSearchParams(location.search).has('lqReq147Smoke'))return;
function marker(data){let el=document.getElementById('lqReq147SmokeMarker');if(!el){el=document.createElement('i');el.id='lqReq147SmokeMarker';el.hidden=true;document.documentElement.appendChild(el);}Object.entries(data).forEach(([k,v])=>el.dataset[k]=String(v));return el;}
function fail(reason){console.error('REQ-147 smoke FAIL',reason);marker({pass:false,reason});}
function settle(ms=80){return new Promise(r=>setTimeout(r,ms));}
function columnCount(el){return el?getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length:0;}
function directButtons(el){return el?[...el.children].filter(child=>child.matches('button,.btn')):[];}
function commandGeometry(surface){
 const buttons=directButtons(surface);
 const rects=buttons.map(button=>button.getBoundingClientRect());
 const xs=[...new Set(rects.map(rect=>Math.round(rect.left)))];
 const ys=[...new Set(rects.map(rect=>Math.round(rect.top)))];
 return {
  buttonCount:buttons.length,
  minHeight:rects.length?Math.min(...rects.map(rect=>rect.height)):0,
  xCount:xs.length,
  yCount:ys.length,
  xs:xs.join(','),
  ys:ys.join(','),
  overflow:surface?surface.scrollWidth-surface.clientWidth:0
 };
}
async function run(){
 const snapshot=structuredClone(s);
 try{
  s.screen='battle';
  s.enemy={n:'REQ-147 TEST',e:'◈',hp:1,a:[0,0],xp:0,g:0};
  s.ehp=0;
  s.log=['REQ-147 victory acceptance'];
  s.hp=Math.max(1,s.hp||42);
  battle();
  await settle();
  // Authoritative Gold/UX v10 production surface.
  const actualSurface=document.querySelector('#app .commandGrid,#app .lqReq147BattleCommandSurface');
  const actualStyle=actualSurface?getComputedStyle(actualSurface):null;
  const actualColumns=columnCount(actualSurface);
  const actualGeometry=commandGeometry(actualSurface);
  const actualSurfacePass=!!actualSurface&&actualStyle.display==='grid'&&actualColumns===2&&actualGeometry.buttonCount>=4&&actualGeometry.xCount===2&&actualGeometry.yCount>=2&&actualGeometry.minHeight>=43.5&&actualGeometry.overflow<=1;
  // Legacy/base renderer fallback remains covered so the regression gate survives renderer changes.
  const commandRows=[...document.querySelectorAll('#app .lqReq147BattleCommandGrid')];
  const rowColumns=commandRows.map(columnCount);
  const pairedRowsPass=commandRows.length>=2&&commandRows.every((row,i)=>rowColumns[i]===2&&directButtons(row).length===2);
  const commandStacks=[...document.querySelectorAll('#app .lqReq147BattleCommandStack')];
  const stackColumns=commandStacks.map(columnCount);
  const stackButtonCounts=commandStacks.map(stack=>[...stack.querySelectorAll(':scope>.lqReq147BattleCommandRow>button,:scope>.lqReq147BattleCommandRow>.btn')].length);
  const flattenedStackPass=commandStacks.length>=1&&commandStacks.some((stack,i)=>stackColumns[i]===2&&stackButtonCounts[i]>=4);
  const legacySurfacePass=pairedRowsPass||flattenedStackPass;
  const twoColumnCommands=actualSurfacePass||legacySurfacePass;
  marker({phase:'battle',actualSurface:!!actualSurface,actualClass:actualSurface?.className||'',actualDisplay:actualStyle?.display||'',actualColumns,actualButtonCount:actualGeometry.buttonCount,actualMinHeight:actualGeometry.minHeight.toFixed(1),actualXCount:actualGeometry.xCount,actualYCount:actualGeometry.yCount,actualXs:actualGeometry.xs,actualYs:actualGeometry.ys,actualOverflow:actualGeometry.overflow,actualSurfacePass,commandRows:commandRows.length,rowColumns:rowColumns.join(','),commandStacks:commandStacks.length,stackColumns:stackColumns.join(','),stackButtonCounts:stackButtonCounts.join(',')});
  win();
  await settle(120);
  const victoryDialog=document.querySelector('#lqVictoryBattleFrame .dialogBox[aria-label="戦闘勝利"]');
  const battleFrame=document.getElementById('lqVictoryBattleFrame');
  const noSeparateOverlay=!document.getElementById('lqReq147VictoryOverlay');
  const battleContext=!!battleFrame&&battleFrame.textContent.includes('REQ-147 TEST');
  const lukeComment=!!victoryDialog&&(victoryDialog.textContent||'').includes('ルーク');
  const victoryState=s.dialog;
  const dialogBeforeDismiss=!!victoryState&&!!victoryDialog;
  victoryDialog?.click();
  await settle(100);
  const victoryGone=!document.querySelector('.dialogBox[aria-label="戦闘勝利"]');
  const battleFrameGone=!document.getElementById('lqVictoryBattleFrame');
  const victoryStateGone=s.dialog!==victoryState;
  const oneDismissClean=victoryGone&&battleFrameGone&&victoryStateGone&&s.screen==='world';
  const pass=twoColumnCommands&&noSeparateOverlay&&battleContext&&lukeComment&&dialogBeforeDismiss&&oneDismissClean;
  marker({pass,phase:'done',twoColumnCommands,actualSurfacePass,legacySurfacePass,pairedRowsPass,flattenedStackPass,actualSurface:!!actualSurface,actualClass:actualSurface?.className||'',actualDisplay:actualStyle?.display||'',actualColumns,actualButtonCount:actualGeometry.buttonCount,actualMinHeight:actualGeometry.minHeight.toFixed(1),actualXCount:actualGeometry.xCount,actualYCount:actualGeometry.yCount,actualXs:actualGeometry.xs,actualYs:actualGeometry.ys,actualOverflow:actualGeometry.overflow,commandRows:commandRows.length,rowColumns:rowColumns.join(','),commandStacks:commandStacks.length,stackColumns:stackColumns.join(','),stackButtonCounts:stackButtonCounts.join(','),noSeparateOverlay,battleContext,lukeComment,dialogBeforeDismiss,victoryGone,battleFrameGone,victoryStateGone,oneDismissClean,screenAfterDismiss:s.screen||''});
 }catch(error){fail(error?.message||String(error));}
 finally{document.getElementById('lqVictoryBattleFrame')?.remove();Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,snapshot);render();}
}
if(document.readyState==='complete')setTimeout(run,900);else addEventListener('load',()=>setTimeout(run,900),{once:true});
})();
