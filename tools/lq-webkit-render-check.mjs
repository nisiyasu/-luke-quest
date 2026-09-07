import { webkit } from 'playwright';
import fs from 'node:fs';

const url = process.env.LQ_RENDER_URL || 'http://127.0.0.1:8130/?lqReq127RenderSmoke=1';
const screenshot = process.env.LQ_WEBKIT_SCREENSHOT || '/tmp/lq-world-webkit-390x844.png';
const diagnosticOut = process.env.LQ_WEBKIT_DIAGNOSTICS || '/tmp/lq-webkit-diagnostics.json';

const browser = await webkit.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
const consoleErrors = [];
const pageErrors = [];
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', err => pageErrors.push(String(err?.stack || err)));

try {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => {
    const m = document.getElementById('lqReq127RenderSmokeMarker');
    return m && m.dataset.status === 'PASS' && m.dataset.screen === 'world' && m.dataset.shell === 'true' && m.dataset.world === 'true' && m.dataset.player === 'true';
  }, null, { timeout: 20000 });

  await page.waitForTimeout(800);
  const state = await page.evaluate(() => {
    const marker = document.getElementById('lqReq127RenderSmokeMarker');
    const diagnosticMarker = document.getElementById('lqReq127DiagnosticsMarker');
    const shell = document.querySelector('.gameShell');
    const world = document.querySelector('.world');
    const player = document.querySelector('.player');
    const rect = el => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        x: r.x, y: r.y, width: r.width, height: r.height,
        display: cs.display, visibility: cs.visibility, opacity: cs.opacity,
        backgroundColor: cs.backgroundColor,
      };
    };
    const center = document.elementsFromPoint(innerWidth / 2, innerHeight / 2).slice(0, 12).map(el => ({
      tag: el.tagName,
      id: el.id || '',
      className: typeof el.className === 'string' ? el.className : '',
    }));
    let diagnostics = null;
    if (diagnosticMarker) {
      try { diagnostics = JSON.parse(diagnosticMarker.textContent || 'null'); } catch { diagnostics = diagnosticMarker.textContent || null; }
    }
    return {
      userAgent: navigator.userAgent,
      screen: globalThis.s?.screen ?? marker?.dataset.screen ?? null,
      map: globalThis.s?.map ?? marker?.dataset.map ?? null,
      marker: marker ? { ...marker.dataset } : null,
      shell: rect(shell), world: rect(world), player: rect(player),
      tileCount: document.querySelectorAll('.tile').length,
      centerStack: center,
      diagnostics,
      viewport: { width: innerWidth, height: innerHeight, visualWidth: visualViewport?.width ?? null, visualHeight: visualViewport?.height ?? null },
      serviceWorker: 'serviceWorker' in navigator ? { controller: !!navigator.serviceWorker.controller } : { supported: false },
    };
  });

  state.consoleErrors = consoleErrors;
  state.pageErrors = pageErrors;
  fs.writeFileSync(diagnosticOut, JSON.stringify(state, null, 2));

  if (state.screen !== 'world' || !state.shell || !state.world || !state.player || state.tileCount < 1) {
    throw new Error(`WebKit world proof failed: ${JSON.stringify(state)}`);
  }
  if (state.shell.width <= 0 || state.shell.height <= 0 || state.world.width <= 0 || state.world.height <= 0 || state.player.width <= 0 || state.player.height <= 0) {
    throw new Error(`WebKit geometry failed: ${JSON.stringify(state)}`);
  }
  if (pageErrors.length) {
    throw new Error(`WebKit page errors: ${pageErrors.join('\n')}`);
  }

  await page.screenshot({ path: screenshot, fullPage: false });
  console.log('REQ-127 WebKit world-state PASS');
  console.log(JSON.stringify({ userAgent: state.userAgent, screen: state.screen, map: state.map, tileCount: state.tileCount, shell: state.shell, world: state.world, player: state.player }, null, 2));
} finally {
  await browser.close();
}
