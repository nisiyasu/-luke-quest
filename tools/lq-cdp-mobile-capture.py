from __future__ import annotations

import argparse
import base64
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import time
import urllib.request

from websocket import create_connection


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Capture a page at an exact CSS viewport through Chrome DevTools Protocol.")
    parser.add_argument("--url", required=True)
    parser.add_argument("--png", required=True)
    parser.add_argument("--dom", required=True)
    parser.add_argument("--width", type=int, default=390)
    parser.add_argument("--height", type=int, default=844)
    parser.add_argument("--wait-ms", type=int, default=5500)
    parser.add_argument("--port", type=int, default=9227)
    parser.add_argument("--browser")
    return parser.parse_args()


def browser_path(explicit: str | None) -> str:
    candidates = [explicit, os.environ.get("BROWSER"), shutil.which("google-chrome"), shutil.which("chromium-browser"), shutil.which("chromium")]
    for candidate in candidates:
        if candidate:
            return candidate
    raise SystemExit("no Chromium/Chrome browser found")


def wait_for_tab(port: int, proc: subprocess.Popen, timeout: float = 20.0) -> dict:
    deadline = time.time() + timeout
    last_error: Exception | None = None
    attempts = 0
    while time.time() < deadline:
        attempts += 1
        return_code = proc.poll()
        if return_code is not None:
            raise SystemExit(f"Chrome exited before DevTools page target became ready: exit={return_code}, attempts={attempts}")
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{port}/json/list", timeout=1.0) as response:
                tabs = json.load(response)
            page_tabs = [tab for tab in tabs if tab.get("type") == "page" and not str(tab.get("url", "")).startswith("chrome-extension://")]
            blank_tabs = [tab for tab in page_tabs if tab.get("url") in {"about:blank", "chrome://newtab/"}]
            if blank_tabs:
                return blank_tabs[0]
            if page_tabs:
                return page_tabs[0]
        except Exception as exc:
            last_error = exc
        time.sleep(0.15)
    raise SystemExit(f"Chrome DevTools page target did not become ready after {attempts} attempts: {last_error}")


class Cdp:
    def __init__(self, websocket_url: str, port: int):
        self.ws = create_connection(websocket_url, timeout=10, origin=f"http://127.0.0.1:{port}")
        self.seq = 0

    def close(self) -> None:
        self.ws.close()

    def call(self, method: str, params: dict | None = None) -> dict:
        self.seq += 1
        call_id = self.seq
        self.ws.send(json.dumps({"id": call_id, "method": method, "params": params or {}}))
        while True:
            message = json.loads(self.ws.recv())
            if message.get("id") != call_id:
                continue
            if "error" in message:
                raise RuntimeError(f"CDP {method} failed: {message['error']}")
            return message.get("result", {})


def evaluated_json(cdp: Cdp, expression: str) -> dict:
    result = cdp.call("Runtime.evaluate", {"expression": f"JSON.stringify({expression})", "returnByValue": True})
    raw = result["result"].get("value")
    if not raw:
        raise RuntimeError(f"evaluation returned no value: {expression}")
    return json.loads(raw)


def main() -> None:
    args = parse_args()
    if args.width <= 0 or args.height <= 0:
        raise SystemExit("width/height must be positive")

    png_path = Path(args.png).resolve()
    dom_path = Path(args.dom).resolve()
    png_path.parent.mkdir(parents=True, exist_ok=True)
    dom_path.parent.mkdir(parents=True, exist_ok=True)

    profile = tempfile.mkdtemp(prefix="lq-cdp-profile-")
    browser = browser_path(args.browser)
    proc = subprocess.Popen(
        [
            browser,
            "--headless=new",
            "--no-sandbox",
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--hide-scrollbars",
            f"--remote-debugging-port={args.port}",
            "--remote-allow-origins=*",
            f"--user-data-dir={profile}",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    cdp: Cdp | None = None
    try:
        tab = wait_for_tab(args.port, proc)
        cdp = Cdp(tab["webSocketDebuggerUrl"], args.port)
        cdp.call("Page.enable")
        cdp.call("Runtime.enable")
        cdp.call(
            "Emulation.setDeviceMetricsOverride",
            {
                "width": args.width,
                "height": args.height,
                "deviceScaleFactor": 1,
                "mobile": True,
                "screenWidth": args.width,
                "screenHeight": args.height,
                "screenOrientation": {"type": "portraitPrimary", "angle": 0},
            },
        )
        navigation = cdp.call("Page.navigate", {"url": args.url})
        navigation_error = navigation.get("errorText")
        time.sleep(max(0, args.wait_ms) / 1000.0)

        page_state = evaluated_json(
            cdp,
            "({href:location.href,innerWidth,innerHeight,dpr:devicePixelRatio,visualWidth:visualViewport?.width||0,visualHeight:visualViewport?.height||0,ready:document.readyState})",
        )
        if not page_state["href"].startswith(args.url):
            raise RuntimeError(f"navigation did not settle on target: {page_state['href']} (initial error={navigation_error})")
        if page_state["ready"] != "complete":
            raise RuntimeError(f"document not complete after wait: {page_state['ready']}")
        if page_state["innerWidth"] != args.width or page_state["innerHeight"] != args.height:
            raise RuntimeError(f"viewport mismatch: expected {args.width}x{args.height}, observed {page_state['innerWidth']}x{page_state['innerHeight']}")
        if round(page_state["visualWidth"]) != args.width or round(page_state["visualHeight"]) != args.height:
            raise RuntimeError(f"visualViewport mismatch: {page_state['visualWidth']}x{page_state['visualHeight']}")

        dom_result = cdp.call("Runtime.evaluate", {"expression": "document.documentElement.outerHTML", "returnByValue": True})
        dom_path.write_text(dom_result["result"]["value"], encoding="utf-8")

        screenshot = cdp.call("Page.captureScreenshot", {"format": "png", "fromSurface": True, "captureBeyondViewport": False})
        png_path.write_bytes(base64.b64decode(screenshot["data"]))

        print(json.dumps({"viewport": f"{args.width}x{args.height}", "metrics": page_state, "initialNavigationError": navigation_error, "targetType": tab.get("type"), "targetUrl": tab.get("url"), "png": str(png_path), "dom": str(dom_path)}, ensure_ascii=False))
    finally:
        if cdp is not None:
            try:
                cdp.close()
            except Exception:
                pass
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except subprocess.TimeoutExpired:
            proc.kill()
            proc.wait(timeout=3)
        shutil.rmtree(profile, ignore_errors=True)


if __name__ == "__main__":
    main()
