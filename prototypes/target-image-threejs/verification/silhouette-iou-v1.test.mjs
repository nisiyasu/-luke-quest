import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, rmdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { deflateSync } from 'node:zlib';
import { compareMasks } from './silhouette-iou-v1.mjs';

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

function maskPng(width, height, values) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 0;
  const rows = [];
  for (let y = 0; y < height; y += 1) rows.push(Buffer.from([0, ...values.slice(y * width, (y + 1) * width)]));
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

test('identical binary PNG masks produce deterministic IoU 1', () => {
  const png = maskPng(2, 2, [255, 0, 0, 255]);
  const first = compareMasks(png, png);
  const second = compareMasks(png, png);
  assert.equal(first.iou, 1);
  assert.equal(first.verdict, 'PASS');
  assert.deepEqual(first, second);
  assert.deepEqual(first.pixel_counts, { reference: 2, actual: 2, intersection: 2, union: 2 });
});

test('known one-pixel intersection over three-pixel union is exact', () => {
  const reference = maskPng(2, 2, [255, 255, 0, 0]);
  const actual = maskPng(2, 2, [255, 0, 255, 0]);
  const result = compareMasks(reference, actual, { minimumIou: 0.34 });
  assert.equal(result.iou, 1 / 3);
  assert.equal(result.verdict, 'FAIL');
  assert.deepEqual(result.pixel_counts, { reference: 2, actual: 2, intersection: 1, union: 3 });
});

test('pixel threshold is explicit and controls grayscale classification', () => {
  const reference = maskPng(2, 1, [127, 128]);
  const actual = maskPng(2, 1, [0, 255]);
  assert.equal(compareMasks(reference, actual, { pixelThreshold: 128 }).iou, 1);
  assert.equal(compareMasks(reference, actual, { pixelThreshold: 127 }).iou, 0.5);
});

test('empty union is explicit and cannot pass a silhouette gate', () => {
  const empty = maskPng(1, 1, [0]);
  const result = compareMasks(empty, empty);
  assert.equal(result.iou, null);
  assert.equal(result.verdict, 'BLOCKED_EMPTY_UNION');
});

test('dimension mismatch is rejected instead of resampled', () => {
  const one = maskPng(1, 1, [255]);
  const two = maskPng(2, 1, [255, 255]);
  assert.throws(() => compareMasks(one, two), /Mask dimensions differ/);
});

test('invalid thresholds and non-PNG inputs are rejected', () => {
  const one = maskPng(1, 1, [255]);
  assert.throws(() => compareMasks(one, one, { pixelThreshold: 256 }), /pixelThreshold/);
  assert.throws(() => compareMasks(one, one, { minimumIou: 1.1 }), /minimumIou/);
  assert.throws(() => compareMasks(Buffer.from('not png'), one), /not a PNG/);
});

test('CLI emits the documented machine-readable JSON result', () => {
  const directory = mkdtempSync(join(tmpdir(), 'lq-t022-'));
  const referencePath = join(directory, 'reference.png');
  const actualPath = join(directory, 'actual.png');
  try {
    const reference = maskPng(2, 1, [255, 0]);
    const actual = maskPng(2, 1, [255, 255]);
    writeFileSync(referencePath, reference);
    writeFileSync(actualPath, actual);
    const result = spawnSync(process.execPath, [
      fileURLToPath(new URL('./silhouette-iou-v1.mjs', import.meta.url)),
      referencePath,
      actualPath,
      '--pixel-threshold', '128',
      '--minimum-iou', '0.5'
    ], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout);
    assert.equal(output.schema, 'LUKE_QUEST_SILHOUETTE_IOU:v1');
    assert.equal(output.iou, 0.5);
    assert.equal(output.verdict, 'PASS');
    assert.equal(output.pixel_counts.union, 2);
  } finally {
    rmSync(referencePath, { force: true });
    rmSync(actualPath, { force: true });
    rmdirSync(directory);
  }
});
