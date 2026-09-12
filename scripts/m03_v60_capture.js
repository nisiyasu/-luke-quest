const { chromium } = require('playwright');
const fs = require('fs');
(async()=>{
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:8140/?quality=high',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.documentElement.dataset.lqModern3d==='m05-ready',{timeout:30000});
  await page.waitForTimeout(1600);
  const meta=await page.evaluate(()=>({scene:document.documentElement.dataset.lqModern3d,title:document.title,player:document.documentElement.dataset.m08Player,m03ci:document.documentElement.dataset.m03Ci||null,three:document.documentElement.dataset.threeRevision}));
  if(errors.length) throw new Error(errors.join('\n'));
  if(!meta.title.includes('Composition Rebuild v60')) throw new Error(`unexpected title ${meta.title}`);
  fs.mkdirSync('prototypes/modern-3d/evidence',{recursive:true});
  await page.screenshot({path:'prototypes/modern-3d/evidence/m03-v60-390x844.png',fullPage:true});
  fs.writeFileSync('prototypes/modern-3d/evidence/m03-v60-runtime.json',JSON.stringify(meta,null,2));
  await browser.close();
})();
