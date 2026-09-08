#!/usr/bin/env python3
import argparse
import html as html_lib
import json
import re
from pathlib import Path


def load_metrics(path):
    text = Path(path).read_text(errors='replace') if Path(path).exists() else ''
    matches = re.findall(r'LQ_RENDER_LIVENESS\s+(\{.*\})', text)
    if not matches:
        return None
    try:
        return json.loads(matches[-1])
    except json.JSONDecodeError:
        return None


def chromium_context(path):
    text = Path(path).read_text(errors='replace') if Path(path).exists() else ''
    attrs = dict(re.findall(r'data-([a-z0-9-]+)="([^"]*)"', text, flags=re.I))
    occluder_count = None
    marker = re.search(r'<pre[^>]+id="lqReq127DiagnosticsMarker"[^>]*>(.*?)</pre>', text, flags=re.I | re.S)
    diagnostics = None
    if marker:
        raw = html_lib.unescape(marker.group(1))
        try:
            diagnostics = json.loads(raw)
        except json.JSONDecodeError:
            diagnostics = None
    if diagnostics:
        try:
            occluder_count = len(diagnostics['latest']['viewportProbe']['occluderCandidates'])
        except (TypeError, KeyError):
            pass
    if occluder_count is None:
        try:
            occluder_count = int(attrs.get('occluder-count', ''))
        except ValueError:
            occluder_count = None
    visible = all(attrs.get(k) == 'true' for k in ('shell', 'world', 'player'))
    return {'occluder_count': occluder_count, 'world_geometry_visible': visible}


def webkit_context(path):
    try:
        data = json.loads(Path(path).read_text())
    except (OSError, json.JSONDecodeError):
        return {'occluder_count': None, 'world_geometry_visible': False}
    candidates = None
    try:
        candidates = data['diagnostics']['latest']['viewportProbe']['occluderCandidates']
    except (TypeError, KeyError):
        pass
    def rect_visible(value):
        return isinstance(value, dict) and value.get('width', 0) > 0 and value.get('height', 0) > 0 and value.get('display') != 'none' and value.get('visibility') != 'hidden' and float(value.get('opacity', 1)) > 0.01
    return {
        'occluder_count': len(candidates) if isinstance(candidates, list) else None,
        'world_geometry_visible': all(rect_visible(data.get(k)) for k in ('shell', 'world', 'player')),
    }


def classify(metrics, context):
    if metrics and metrics.get('status') == 'PASS':
        return 'PIXELS_VISIBLE'
    occluders = context.get('occluder_count')
    visible = context.get('world_geometry_visible')
    if isinstance(occluders, int) and occluders > 0:
        return 'DOM_VISUAL_OCCLUDER_SUSPECT'
    if occluders == 0 and visible:
        return 'COMPOSITOR_ONLY_SUSPECT'
    if visible:
        return 'PAINT_PIPELINE_SUSPECT_UNRESOLVED_OCCLUDER_STATE'
    return 'DOM_OR_LAYOUT_FAILURE'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--metrics', required=True)
    group = ap.add_mutually_exclusive_group(required=True)
    group.add_argument('--chromium-dom')
    group.add_argument('--webkit-json')
    ap.add_argument('--out')
    args = ap.parse_args()
    metrics = load_metrics(args.metrics)
    context = chromium_context(args.chromium_dom) if args.chromium_dom else webkit_context(args.webkit_json)
    result = {
        'requirement': 'REQ-127',
        'classification': classify(metrics, context),
        'pixel_status': metrics.get('status') if metrics else 'UNKNOWN',
        'pixel_failures': metrics.get('failures') if metrics else [],
        'occluder_count': context.get('occluder_count'),
        'world_geometry_visible': context.get('world_geometry_visible'),
        'classifier_contract': 'pixel-failure-never-downgraded-v1',
    }
    line = 'REQ127_RENDER_CLASSIFICATION ' + json.dumps(result, sort_keys=True)
    print(line)
    if args.out:
        Path(args.out).write_text(json.dumps(result, indent=2, sort_keys=True) + '\n')


if __name__ == '__main__':
    main()
