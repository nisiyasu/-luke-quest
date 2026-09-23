const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(process.argv[2] || 'assets/reference/owner_2026-09-11_ps1_visual_target/TARGET_PS1_FINAL.png');
const actualPath = path.resolve(process.argv[3] || 'evidence-local/actual.png');
const outputDir = path.resolve(process.argv[4] || 'evidence-local/overlay-diff');
const executablePath = process.env.LQ_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function dataUrl(filePath) {
  return 'data:image/png;base64,' + fs.readFileSync(filePath).toString('base64');
}

(async () => {
  if (!fs.existsSync(targetPath)) throw new Error('TARGET_NOT_FOUND ' + targetPath);
  if (!fs.existsSync(actualPath)) throw new Error('ACTUAL_NOT_FOUND ' + actualPath);
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport: { width: 941, height: 1672 }, deviceScaleFactor: 1 });
  await page.setContent('<canvas id="overlay"></canvas><canvas id="diff"></canvas>');
  const result = await page.evaluate(async ({ targetSrc, actualSrc }) => {
    const load = (src) => new Promise((resolve, reject) => {
      const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = src;
    });
    const [target, actual] = await Promise.all([load(targetSrc), load(actualSrc)]);
    if (target.width !== actual.width || target.height !== actual.height) {
      throw new Error(`IMAGE_DIMENSION_MISMATCH target=${target.width}x${target.height} actual=${actual.width}x${actual.height}`);
    }
    const w = target.width, h = target.height;
    const overlay = document.getElementById('overlay');
    const diff = document.getElementById('diff');
    overlay.width = diff.width = w; overlay.height = diff.height = h;
    const oc = overlay.getContext('2d');
    oc.drawImage(target, 0, 0); oc.globalAlpha = 0.5; oc.drawImage(actual, 0, 0); oc.globalAlpha = 1;
    const tc = document.createElement('canvas').getContext('2d'); tc.canvas.width=w; tc.canvas.height=h; tc.drawImage(target,0,0);
    const ac = document.createElement('canvas').getContext('2d'); ac.canvas.width=w; ac.canvas.height=h; ac.drawImage(actual,0,0);
    const t = tc.getImageData(0,0,w,h).data, a = ac.getImageData(0,0,w,h).data;
    const out = diff.getContext('2d').createImageData(w,h); let sum=0, changed=0;
    for (let i=0;i<t.length;i+=4) {
      const dr=Math.abs(t[i]-a[i]), dg=Math.abs(t[i+1]-a[i+1]), db=Math.abs(t[i+2]-a[i+2]);
      out.data[i]=dr; out.data[i+1]=dg; out.data[i+2]=db; out.data[i+3]=255;
      sum += dr+dg+db; if (dr||dg||db) changed++;
    }
    diff.getContext('2d').putImageData(out,0,0);
    return { width:w, height:h, changedPixels:changed, totalPixels:w*h,
      changedPixelRatio:changed/(w*h), meanAbsoluteError:sum/(w*h*3),
      overlay:overlay.toDataURL('image/png'), diff:diff.toDataURL('image/png') };
  }, { targetSrc: dataUrl(targetPath), actualSrc: dataUrl(actualPath) });
  const writeDataUrl = (name, value) => fs.writeFileSync(path.join(outputDir,name), Buffer.from(value.split(',')[1], 'base64'));
  writeDataUrl('overlay.png', result.overlay); writeDataUrl('diff.png', result.diff);
  delete result.overlay; delete result.diff;
  const audit = { schema:'LQ_OVERLAY_DIFF_AUDIT:v1', targetPath, actualPath, ...result };
  fs.writeFileSync(path.join(outputDir,name), JSON.stringify(audit,null,2));
  await browser.close();
  console.log(JSON.stringify({ status:'OVERLAY_DIFF_PASS', ...audit }));
})().catch((error)=>{ console.error(error); process.exit(1); });
