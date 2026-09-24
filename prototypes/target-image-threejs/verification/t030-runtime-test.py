from playwright.sync_api import sync_playwright
import json, pathlib, sys, math
URL = "http://127.0.0.1:4173/prototypes/target-image-threejs/index.html"
OUT = pathlib.Path(__file__).with_name("t030-infrastructure-test-v1.json")
errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        executable_path=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        args=["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    page = browser.new_page(viewport={"width":941,"height":1672}, device_scale_factor=1)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append("console:"+m.text) if m.type == "error" and not ("Failed to load resource" in m.text and "404" in m.text) else None)
    page.goto(URL, wait_until="domcontentloaded", timeout=150000)
    page.wait_for_function("window.__LQ_T030__?.ready || document.documentElement.dataset.lqT030Compare === 'failed'", timeout=150000)
    observed = page.evaluate("() => ({probe: window.__LQ_T030__, width: innerWidth, height: innerHeight, dpr: devicePixelRatio})")
    browser.close()
probe = observed.get("probe") or {}
mesh = probe.get("meshoptMs") or []
draco = probe.get("dracoMs") or []
passed = bool(probe.get("ready") and probe.get("model") == "BrainStem"
              and len(mesh) == 3 and len(draco) == 3
              and all(isinstance(x,(int,float)) and x > 0 and math.isfinite(x) for x in mesh+draco)
              and isinstance(probe.get("meshoptMedianMs"),(int,float)) and probe["meshoptMedianMs"] > 0
              and isinstance(probe.get("dracoMedianMs"),(int,float)) and probe["dracoMedianMs"] > 0
              and observed["width"] == 941 and observed["height"] == 1672 and observed["dpr"] == 1 and not errors)
evidence = {
    "schema":"LQ_INFRASTRUCTURE_TEST_EVIDENCE:v1","task_id":"T030","evaluator_id":"INFRASTRUCTURE_TEST_V1",
    "result":"PASS" if passed else "FAIL","runtime":"Three.js 0.180.0 GLTFLoader + MeshoptDecoder + DRACOLoader",
    "entrypoint":"prototypes/target-image-threejs/index.html","viewport":[941,1672],"device_pixel_ratio":1,
    "comparison_model":"Khronos glTF-Sample-Assets BrainStem",
    "method":"network-prefetch excluded; decoder warm-up excluded; 3 alternating parse/decode samples per codec; compare medians",
    "observed":observed,"runtime_errors":errors
}
OUT.write_text(json.dumps(evidence,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
print(json.dumps(evidence,ensure_ascii=False))
sys.exit(0 if passed else 1)
