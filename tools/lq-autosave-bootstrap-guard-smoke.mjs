import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source = fs.readFileSync('prelude/autosave-bootstrap-guard.js', 'utf8');
const SAVE = 'lukeQuestV2';
const QUAR = 'lukeQuestAutosaveQuarantineV1';

class MemoryStorage {
  constructor(seed = {}) { this.map = new Map(Object.entries(seed)); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

function run(seed = {}) {
  const localStorage = new MemoryStorage(seed);
  const context = vm.createContext({
    localStorage,
    console: { warn() {} },
    Date,
    Set,
    Object,
    JSON
  });
  vm.runInContext(source, context, { filename: 'autosave-bootstrap-guard.js' });
  return localStorage;
}

// 1. No canonical save: no mutation.
{
  const storage = run();
  assert.equal(storage.getItem(SAVE), null);
  assert.equal(storage.getItem(QUAR), null);
}

// 2. Valid plain-object save remains byte-for-byte unchanged.
{
  const raw = JSON.stringify({ screen: 'world', map: 'town', x: 8, y: 14, flags: { introDone: true } });
  const storage = run({ [SAVE]: raw });
  assert.equal(storage.getItem(SAVE), raw);
  assert.equal(storage.getItem(QUAR), null);
}

// 3. Malformed JSON is quarantined before canonical removal.
{
  const raw = '{broken';
  const storage = run({ [SAVE]: raw });
  assert.equal(storage.getItem(SAVE), null);
  const record = JSON.parse(storage.getItem(QUAR));
  assert.equal(record.reason, 'malformed-json');
  assert.equal(record.raw, raw);
  assert.ok(!Number.isNaN(Date.parse(record.timestamp)));
}

// 4. Primitive / array / null roots are rejected and quarantined.
for (const raw of ['42', '"save"', '[]', 'null']) {
  const storage = run({ [SAVE]: raw });
  assert.equal(storage.getItem(SAVE), null, `canonical root should be removed for ${raw}`);
  const record = JSON.parse(storage.getItem(QUAR));
  assert.equal(record.reason, 'invalid-root-shape');
  assert.equal(record.raw, raw);
}

// 5 + 6. Dangerous root and nested flag keys are removed while safe values survive.
{
  const raw = '{"screen":"world","map":"town","__proto__":{"polluted":true},"constructor":{"bad":true},"prototype":{"bad":true},"flags":{"introDone":true,"__proto__":{"polluted":true},"constructor":1,"prototype":2}}';
  const storage = run({ [SAVE]: raw });
  const saved = JSON.parse(storage.getItem(SAVE));
  assert.equal(saved.screen, 'world');
  assert.equal(saved.map, 'town');
  assert.equal(saved.flags.introDone, true);
  for (const key of ['__proto__', 'constructor', 'prototype']) {
    assert.equal(Object.prototype.hasOwnProperty.call(saved, key), false, `dangerous root key survived: ${key}`);
    assert.equal(Object.prototype.hasOwnProperty.call(saved.flags, key), false, `dangerous flag key survived: ${key}`);
  }
}

console.log('REQ-063 autosave bootstrap guard smoke PASS');
