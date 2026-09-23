#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync, inflateSync } from 'node:zlib';

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const CHANNELS = new Map([[0, 1], [2, 3], [3, 1], [4, 2], [6, 4]]);

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

function decodePng(bytes) {
  if (!Buffer.isBuffer(bytes)) bytes = Buffer.from(bytes);
  if (bytes.length < 8 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error('Input is not a PNG image');
  }

  let width;
  let height;
  let colorType;
  let bitDepth;
  let palette;
  let transparency;
  const compressed = [];
  let offset = 8;
  let ended = false;

  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    const start = offset + 8;
    const end = start + length;
    if (end + 4 > bytes.length) throw new Error('Truncated PNG chunk');
    const data = bytes.subarray(start, end);

    if (type === 'IHDR') {
      if (length !== 13 || width !== undefined) throw new Error('Invalid PNG header');
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      if (data[10] !== 0 || data[11] !== 0 || data[12] !== 0) {
        throw new Error('Unsupported PNG compression, filter, or interlace method');
      }
    } else if (type === 'PLTE') {
      palette = Buffer.from(data);
    } else if (type === 'tRNS') {
      transparency = Buffer.from(data);
    } else if (type === 'IDAT') {
      compressed.push(data);
    } else if (type === 'IEND') {
      ended = true;
      break;
    }
    offset = end + 4;
  }

  if (!ended || !width || !height) throw new Error('PNG is missing required image data');
  if (bitDepth !== 8) throw new Error(`Unsupported PNG bit depth: ${bitDepth}`);
  const channels = CHANNELS.get(colorType);
  if (!channels) throw new Error(`Unsupported PNG color type: ${colorType}`);
  if (colorType === 3 && (!palette || palette.length % 3 !== 0)) {
    throw new Error('Indexed PNG is missing a valid palette');
  }

  const stride = width * channels;
  const expectedLength = height * (stride + 1);
  const raw = inflateSync(Buffer.concat(compressed), { maxOutputLength: expectedLength });
  if (raw.length !== expectedLength) throw new Error('PNG decompressed data length mismatch');
  const pixels = Buffer.alloc(height * stride);
  let source = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[source++];
    const rowStart = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const value = raw[source++];
      const left = x >= channels ? pixels[rowStart + x - channels] : 0;
      const above = y > 0 ? pixels[rowStart + x - stride] : 0;
      const upperLeft = y > 0 && x >= channels ? pixels[rowStart + x - stride - channels] : 0;
      if (filter === 0) pixels[rowStart + x] = value;
      else if (filter === 1) pixels[rowStart + x] = (value + left) & 0xff;
      else if (filter === 2) pixels[rowStart + x] = (value + above) & 0xff;
      else if (filter === 3) pixels[rowStart + x] = (value + Math.floor((left + above) / 2)) & 0xff;
      else if (filter === 4) pixels[rowStart + x] = (value + paeth(left, above, upperLeft)) & 0xff;
      else throw new Error(`Unsupported PNG row filter: ${filter}`);
    }
  }

  return { width, height, colorType, channels, pixels, palette, transparency };
}

function foregroundMask(image, threshold) {
  const mask = new Uint8Array(image.width * image.height);
  for (let index = 0; index < mask.length; index += 1) {
    const offset = index * image.channels;
    let intensity;
    let alpha = 255;
    if (image.colorType === 0) intensity = image.pixels[offset];
    else if (image.colorType === 2 || image.colorType === 6) {
      const r = image.pixels[offset];
      const g = image.pixels[offset + 1];
      const b = image.pixels[offset + 2];
      intensity = Math.floor((299 * r + 587 * g + 114 * b + 500) / 1000);
      if (image.colorType === 6) alpha = image.pixels[offset + 3];
    } else if (image.colorType === 3) {
      const paletteIndex = image.pixels[offset];
      const paletteOffset = paletteIndex * 3;
      if (paletteOffset + 2 >= image.palette.length) throw new Error('PNG palette index is out of range');
      const r = image.palette[paletteOffset];
      const g = image.palette[paletteOffset + 1];
      const b = image.palette[paletteOffset + 2];
      intensity = Math.floor((299 * r + 587 * g + 114 * b + 500) / 1000);
      if (image.transparency && paletteIndex < image.transparency.length) alpha = image.transparency[paletteIndex];
    } else {
      intensity = image.pixels[offset];
      alpha = image.pixels[offset + 1];
    }
    mask[index] = alpha > 0 && intensity >= threshold ? 1 : 0;
  }
  return mask;
}

export function compareMasks(referenceBytes, actualBytes, options = {}) {
  const pixelThreshold = options.pixelThreshold ?? 128;
  const minimumIou = options.minimumIou ?? 0.85;
  if (!Number.isInteger(pixelThreshold) || pixelThreshold < 0 || pixelThreshold > 255) {
    throw new Error('pixelThreshold must be an integer from 0 through 255');
  }
  if (typeof minimumIou !== 'number' || !Number.isFinite(minimumIou) || minimumIou < 0 || minimumIou > 1) {
    throw new Error('minimumIou must be a number from 0 through 1');
  }

  const reference = decodePng(Buffer.from(referenceBytes));
  const actual = decodePng(Buffer.from(actualBytes));
  if (reference.width !== actual.width || reference.height !== actual.height) {
    throw new Error(`Mask dimensions differ: reference ${reference.width}x${reference.height}, actual ${actual.width}x${actual.height}`);
  }
  const referenceMask = foregroundMask(reference, pixelThreshold);
  const actualMask = foregroundMask(actual, pixelThreshold);
  let referencePixels = 0;
  let actualPixels = 0;
  let intersectionPixels = 0;
  for (let i = 0; i < referenceMask.length; i += 1) {
    const a = referenceMask[i];
    const b = actualMask[i];
    referencePixels += a;
    actualPixels += b;
    intersectionPixels += a & b;
  }
  const unionPixels = referencePixels + actualPixels - intersectionPixels;
  const iou = unionPixels === 0 ? null : intersectionPixels / unionPixels;
  const verdict = unionPixels === 0 ? 'BLOCKED_EMPTY_UNION' : iou >= minimumIou ? 'PASS' : 'FAIL';
  const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
  return {
    schema: 'LUKE_QUEST_SILHOUETTE_IOU:v1',
    algorithm: 'binary-mask-intersection-over-union',
    dimensions: { width: reference.width, height: reference.height },
    pixel_threshold: pixelThreshold,
    minimum_iou: minimumIou,
    pixel_counts: { reference: referencePixels, actual: actualPixels, intersection: intersectionPixels, union: unionPixels },
    iou,
    verdict,
    inputs: { reference_sha256: sha256(referenceBytes), actual_sha256: sha256(actualBytes) }
  };
}

function usage() {
  return 'Usage: node silhouette-iou-v1.mjs <reference-mask.png> <actual-mask.png> [--pixel-threshold 0..255] [--minimum-iou 0..1] [--output result.json]';
}

async function main(argv) {
  const [referencePath, actualPath, ...flags] = argv;
  if (!referencePath || !actualPath) throw new Error(usage());
  const options = {};
  let outputPath;
  for (let i = 0; i < flags.length; i += 1) {
    const flag = flags[i];
    const value = flags[++i];
    if (!value) throw new Error(usage());
    if (flag === '--pixel-threshold') options.pixelThreshold = Number(value);
    else if (flag === '--minimum-iou') options.minimumIou = Number(value);
    else if (flag === '--output') outputPath = value;
    else throw new Error(`Unknown option: ${flag}\n${usage()}`);
  }
  const result = compareMasks(await readFile(referencePath), await readFile(actualPath), options);
  const json = `${JSON.stringify(result, null, 2)}\n`;
  if (outputPath) await writeFile(outputPath, json, { encoding: 'utf8', flag: 'wx' });
  else process.stdout.write(json);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
  });
}
