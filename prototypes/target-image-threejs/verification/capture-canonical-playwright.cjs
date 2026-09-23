const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const outputDir = path.resolve(process.argv[2] || "evidence-local");
const url = process.argv[3] || "http://127.0.0.1:8140/index.html";
const executablePath = process.env.LQ_CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const errors = [];

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage({
    viewport: { width: 941, height: 1672 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("response", (response) => {
    if (response.status() >= 400 && !response.url().endsWith("/favicon.ico")) {
      errors.push(`http:${response.status()}:${response.url()}`);
    }
  });
  page.on("console", (message) => {
    const text = message.text();
    const faviconNoise =
      message.type() === "error" &&
      text.includes("Failed to load resource") &&
      text.includes("404");
    if (message.type() === "error" && !faviconNoise) errors.push("console:" + text);
  });
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 150000 });
  await page.waitForLoadState("networkidle", { timeout: 150000 }).catch(() => {});
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, "actual.png"), fullPage: false });
  const meta = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    runtime: document.documentElement.dataset.lqTargetImageRuntime || null,
  }));
  const audit = { url, meta, browserVersion: browser.version(), pageErrors: errors };
  fs.writeFileSync(path.join(outputDir, "runtime-audit.json"), JSON.stringify(audit, null, 2));
  await browser.close();
  if (meta.width !== 941 || meta.height !== 1672 || meta.devicePixelRatio !== 1) {
    throw new Error("CANONICAL_VIEWPORT_MISMATCH " + JSON.stringify(meta));
  }
  if (errors.length) throw new Error("RUNTIME_ERRORS " + JSON.stringify(errors));
  console.log(JSON.stringify({ status: "CAPTURE_PASS", ...audit }));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
