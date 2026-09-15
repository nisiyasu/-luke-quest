import { spawn } from 'node:child_process';
import { writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [browser, url, widthRaw, heightRaw, out] = process.argv.slice(2);
if (!browser || !url || !widthRaw || !heightRaw || !out) throw new Error('usage: node lq-modern3d-cdp-capture.mjs BROWSER URL WIDTH HEIGHT OUT');
const width=Number(widthRaw), height=Number(heightRaw);
const profile=await mkdtemp(join(tmpdir(),'lq-modern3d-cdp-'));
const port=9222 + Math.floor(Math.random()*500);
const child=spawn(browser,[
  '--headless=new','--no-sandbox','--disable-dev-shm-usage','--enable-webgl','--ignore-gpu-blocklist',
  '--use-angle=swiftshader','--enable-unsafe-swiftshader','--hide-scrollbars','--force-device-scale-factor=1',
  '--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows',
  `--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,`--window-size=${width},${height}`,'about:blank'
],{stdio:['ignore','ignore','pipe']});
let stderr=''; child.stderr.on('data',d=>stderr+=d.toString());
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let target;
for(let i=0;i<100;i++){
  try {
    const list=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    target=list.find(x=>x.type==='page'); if(target) break;
  } catch {}
  await sleep(100);
}
if(!target) throw new Error(`CDP target unavailable: ${stderr.slice(-2000)}`);
const ws=new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
let seq=0; const pending=new Map();
ws.addEventListener('message',ev=>{const m=JSON.parse(ev.data); if(m.id&&pending.has(m.id)){const {resolve,reject}=pending.get(m.id);pending.delete(m.id);m.error?reject(new Error(JSON.stringify(m.error))):resolve(m.result);}});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
try {
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url});
  let ready=false, last='';
  for(let i=0;i<160;i++){
    const r=await send('Runtime.evaluate',{expression:`JSON.stringify({ready:document.documentElement.dataset.lqModern3d==='m05-ready',m02:document.documentElement.dataset.m02Ci,m03:document.documentElement.dataset.m03Ci,scene:document.documentElement.dataset.m05Scene,canvas:[...document.querySelectorAll('canvas')].map(c=>[c.width,c.height])})`,returnByValue:true});
    last=r.result?.value||'';
    try { const s=JSON.parse(last); if(s.ready&&s.m02==='pass'&&s.m03==='pass'&&s.scene==='ready'){ready=true;break;} } catch {}
    await sleep(250);
  }
  if(!ready) throw new Error(`runtime readiness timeout: ${last}`);
  await sleep(1200);
  const shot=await send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
  await writeFile(out,Buffer.from(shot.data,'base64'));
  console.log(`cdp_capture=${out} viewport=${width}x${height} readiness=${last}`);
} finally {
  try { ws.close(); } catch {}
  child.kill('SIGKILL');
  await new Promise(resolve => {
    if (child.exitCode !== null || child.signalCode !== null) return resolve();
    child.once('exit', resolve);
    setTimeout(resolve, 3000);
  });
  for (let attempt=0; attempt<6; attempt++) {
    try { await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100}); break; }
    catch (error) {
      if (attempt===5) console.warn(`profile_cleanup_warning=${error.code||error.message}`);
      else await sleep(200*(attempt+1));
    }
  }
}
