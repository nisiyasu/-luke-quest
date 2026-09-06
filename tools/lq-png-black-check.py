#!/usr/bin/env python3
import json
import struct
import sys
import zlib
from pathlib import Path

PNG_SIG = b'\x89PNG\r\n\x1a\n'


def paeth(a, b, c):
    p = a + b - c
    pa = abs(p - a)
    pb = abs(p - b)
    pc = abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    if pb <= pc:
        return b
    return c


def decode_png(path):
    data = Path(path).read_bytes()
    if not data.startswith(PNG_SIG):
        raise ValueError('not a PNG file')
    pos = len(PNG_SIG)
    width = height = bit_depth = color_type = interlace = None
    idat = bytearray()
    while pos + 12 <= len(data):
        length = struct.unpack('>I', data[pos:pos + 4])[0]
        ctype = data[pos + 4:pos + 8]
        payload = data[pos + 8:pos + 8 + length]
        pos += 12 + length
        if ctype == b'IHDR':
            width, height, bit_depth, color_type, _comp, _filter, interlace = struct.unpack('>IIBBBBB', payload)
        elif ctype == b'IDAT':
            idat.extend(payload)
        elif ctype == b'IEND':
            break
    if None in (width, height, bit_depth, color_type, interlace):
        raise ValueError('missing IHDR')
    if bit_depth != 8 or interlace != 0:
        raise ValueError(f'unsupported PNG format bit_depth={bit_depth} interlace={interlace}')
    channels = {0: 1, 2: 3, 4: 2, 6: 4}.get(color_type)
    if not channels:
        raise ValueError(f'unsupported PNG color_type={color_type}')
    raw = zlib.decompress(bytes(idat))
    stride = width * channels
    expected = height * (stride + 1)
    if len(raw) != expected:
        raise ValueError(f'unexpected decompressed size {len(raw)} != {expected}')
    rows = []
    prev = bytearray(stride)
    off = 0
    for _y in range(height):
        f = raw[off]
        off += 1
        scan = bytearray(raw[off:off + stride])
        off += stride
        recon = bytearray(stride)
        for i, x in enumerate(scan):
            left = recon[i - channels] if i >= channels else 0
            up = prev[i]
            upper_left = prev[i - channels] if i >= channels else 0
            if f == 0:
                val = x
            elif f == 1:
                val = (x + left) & 0xFF
            elif f == 2:
                val = (x + up) & 0xFF
            elif f == 3:
                val = (x + ((left + up) // 2)) & 0xFF
            elif f == 4:
                val = (x + paeth(left, up, upper_left)) & 0xFF
            else:
                raise ValueError(f'unsupported PNG filter={f}')
            recon[i] = val
        rows.append(recon)
        prev = recon
    return width, height, color_type, channels, rows


def rgb_at(row, i, color_type, channels):
    base = i * channels
    if color_type == 0:
        g = row[base]
        return g, g, g
    if color_type == 2:
        return row[base], row[base + 1], row[base + 2]
    if color_type == 4:
        g = row[base]
        return g, g, g
    return row[base], row[base + 1], row[base + 2]


def analyze(path):
    width, height, color_type, channels, rows = decode_png(path)
    total = width * height
    near_black = 0
    dark = 0
    bright = 0
    colorful = 0
    quantized = set()
    lum_sum = 0.0
    for row in rows:
        for x in range(width):
            r, g, b = rgb_at(row, x, color_type, channels)
            mx, mn = max(r, g, b), min(r, g, b)
            lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
            lum_sum += lum
            if mx < 40:
                near_black += 1
            if lum < 32:
                dark += 1
            if lum > 72:
                bright += 1
            if mx - mn > 24 and mx > 55:
                colorful += 1
            quantized.add((r // 16, g // 16, b // 16))
    metrics = {
        'width': width,
        'height': height,
        'pixels': total,
        'near_black_ratio': round(near_black / total, 6),
        'dark_ratio': round(dark / total, 6),
        'bright_ratio': round(bright / total, 6),
        'colorful_ratio': round(colorful / total, 6),
        'mean_luminance': round(lum_sum / total, 3),
        'quantized_color_bins': len(quantized),
    }
    # A legitimate LUKE QUEST world frame has colored terrain, sprites and HUD.
    # Fail only on extreme dark/uniform output to avoid false positives from its dark UI theme.
    failures = []
    if metrics['near_black_ratio'] >= 0.94:
        failures.append('near_black_ratio>=0.94')
    if metrics['mean_luminance'] < 24 and metrics['bright_ratio'] < 0.025:
        failures.append('mean_luminance<24 with bright_ratio<0.025')
    if metrics['quantized_color_bins'] < 12:
        failures.append('quantized_color_bins<12')
    if metrics['bright_ratio'] < 0.015 and metrics['colorful_ratio'] < 0.01:
        failures.append('insufficient bright/colorful painted pixels')
    metrics['status'] = 'FAIL' if failures else 'PASS'
    metrics['failures'] = failures
    return metrics


def main():
    if len(sys.argv) != 2:
        raise SystemExit('usage: lq-png-black-check.py screenshot.png')
    metrics = analyze(sys.argv[1])
    print('LQ_RENDER_LIVENESS ' + json.dumps(metrics, ensure_ascii=False, sort_keys=True))
    if metrics['status'] != 'PASS':
        raise SystemExit(2)


if __name__ == '__main__':
    main()
