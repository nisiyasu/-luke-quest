import fs from 'node:fs';
import path from 'node:path';

const inputPath = path.resolve(process.argv[2] || 'prototypes/target-image-threejs/verification/landmark-spatial-intent-v1.json');
const outputPath = path.resolve(process.argv[3] || 'evidence-local/landmark-measurement-v1.json');
const source = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const { width, height, dpr } = source.source.viewport;
if (width !== 941 || height !== 1672 || dpr !== 1) throw new Error('CANONICAL_VIEWPORT_REQUIRED');

const round = (n) => Number(n.toFixed(6));
const measurements = source.landmarks.map((lm) => {
  const r = lm.roi_norm;
  if (!r || r.x_min < 0 || r.y_min < 0 || r.x_max > 1 || r.y_max > 1 || r.x_max <= r.x_min || r.y_max <= r.y_min) {
    throw new Error(`INVALID_ROI:${lm.id}`);
  }
  const widthNorm = round(r.x_max - r.x_min);
  const heightNorm = round(r.y_max - r.y_min);
  const roiCenter = { x: round((r.x_min + r.x_max) / 2), y: round((r.y_min + r.y_max) / 2) };
  return {
    id: lm.id, name: lm.name, priority: lm.priority, space: lm.space,
    center_norm: lm.center_norm, roi_center_norm: roiCenter,
    size_norm: { width: widthNorm, height: heightNorm },
    reference_lines_norm: { left: r.x_min, right: r.x_max, top: r.y_min, bottom: r.y_max,
      horizontal_center: roiCenter.y, vertical_center: roiCenter.x },
    depth_intent: lm.depth_intent
  };
});const result = {
  schema: 'LQ_LANDMARK_MEASUREMENT:v1', task_id: 'T021',
  source_identity: {
    target_blob_sha: source.source.target_blob_sha,
    target_source_commit_sha: source.source.target_source_commit_sha,
    viewport: source.source.viewport,
    spatial_intent_path: path.relative(process.cwd(), inputPath).replaceAll('\\', '/')
  },
  coordinate_convention: source.coordinate_convention,
  measurement_count: measurements.length,
  measurements,
  gate_summary: {
    machine_readable: true,
    all_measurements_normalized: measurements.every((m) =>
      [m.center_norm.x, m.center_norm.y, m.size_norm.width, m.size_norm.height].every((v) => v >= 0 && v <= 1)),
    p0_count: measurements.filter((m) => m.priority === 'P0').length,
    p1_count: measurements.filter((m) => m.priority === 'P1').length,
    p2_count: measurements.filter((m) => m.priority === 'P2').length
  }
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
if (!result.gate_summary.all_measurements_normalized) throw new Error('NORMALIZATION_GATE_FAIL');
console.log(JSON.stringify({ status: 'LANDMARK_MEASUREMENT_PASS', outputPath, ...result.gate_summary }));