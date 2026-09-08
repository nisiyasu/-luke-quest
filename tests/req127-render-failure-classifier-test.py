#!/usr/bin/env python3
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODULE = ROOT / 'tools' / 'lq-render-failure-classify.py'
spec = importlib.util.spec_from_file_location('lq_render_failure_classify', MODULE)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

cases = [
    (
        'healthy pixels always win',
        {'status': 'PASS', 'failures': []},
        {'occluder_count': 3, 'world_geometry_visible': False},
        'PIXELS_VISIBLE',
    ),
    (
        'failed pixels plus named visual occluder',
        {'status': 'FAIL', 'failures': ['near-black']},
        {'occluder_count': 1, 'world_geometry_visible': True},
        'DOM_VISUAL_OCCLUDER_SUSPECT',
    ),
    (
        'failed pixels with healthy geometry and zero occluders',
        {'status': 'FAIL', 'failures': ['near-black']},
        {'occluder_count': 0, 'world_geometry_visible': True},
        'COMPOSITOR_ONLY_SUSPECT',
    ),
    (
        'failed pixels with healthy geometry but unresolved occluder state',
        {'status': 'FAIL', 'failures': ['near-black']},
        {'occluder_count': None, 'world_geometry_visible': True},
        'PAINT_PIPELINE_SUSPECT_UNRESOLVED_OCCLUDER_STATE',
    ),
    (
        'failed pixels with broken layout',
        {'status': 'FAIL', 'failures': ['near-black']},
        {'occluder_count': 0, 'world_geometry_visible': False},
        'DOM_OR_LAYOUT_FAILURE',
    ),
]

for label, metrics, context, expected in cases:
    actual = mod.classify(metrics, context)
    if actual != expected:
        raise SystemExit(f'{label}: expected {expected}, got {actual}')

print(f'REQ127_RENDER_CLASSIFIER_SELF_TEST PASS cases={len(cases)}')
