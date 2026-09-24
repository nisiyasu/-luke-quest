from playwright.sync_api import sync_playwright
import json, pathlib, sys
URL = "http://127.0.0.1:4173/prototypes/target-image-threejs/index.html"
OUT = pathlib.Path(__file__).with_name("t032-infrastructure-test-v1.json")
errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=r"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", args=["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    page = browser.new_page(viewport={"width":941,"height":1672}, device_scale_factor=1)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append("console:"+m.text) if m.type == "error" and not ("Failed to load resource" in m.text and "404" in m.text) else None)
    page.goto(URL, wait_until="domcontentloaded", timeout=150000)
    page.wait_for_function("window.__LQ_T032__?.ready", timeout=150000)
    observed = page.evaluate("() => ({probe: window.__LQ_T032__, width: innerWidth, height: innerHeight, dpr: devicePixelRatio})")
    browser.close()
probe = observed.get("probe") or {}
rows = probe.get("observed") or []
expected = {"low":[470,836],"medium":[705,1254],"high":[941,1672]}
buffers = {r.get("name"):r.get("drawingBuffer") for r in rows}
passed = bool(probe.get("ready") and set(buffers)==set(expected) and buffers==expected
              and probe.get("slowFrame",{}).get("name")=="low" and probe.get("fastFrame",{}).get("name")=="high"
              and observed["width"]==941 and observed["height"]==1672 and observed["dpr"]==1 and not errors)
evidence = {"schema":"LQ_INFRASTRUCTURE_TEST_EVIDENCE:v1","task_id":"T032","evaluator_id":"INFRASTRUCTURE_TEST_V1",
"result":"PASS" if passed else "FAIL","runtime":"Three.js 0.180.0 WebGLRenderer",
"entrypoint":"prototypes/target-image-threejs/index.html","viewport":[941,1672],"device_pixel_ratio":1,
"method":"switch low/medium/high presets; verify exact drawing-buffer scaling; synthetic slow/fast frame thresholds exercise dynamic resolution selection",
"observed":observed,"runtime_errors":errors}
OUT.write_text(json.dumps(evidence,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
print(json.dumps(evidence,ensure_ascii=False))
sys.exit(0 if passed else 1)
