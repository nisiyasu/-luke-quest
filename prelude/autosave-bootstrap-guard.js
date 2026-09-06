(() => {
  'use strict';

  const SAVE_KEY = 'lukeQuestV2';
  const QUARANTINE_KEY = 'lukeQuestAutosaveQuarantineV1';
  const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

  const isPlainObject = value => {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  };

  const quarantine = (raw, reason) => {
    const record = JSON.stringify({
      timestamp: new Date().toISOString(),
      reason,
      raw
    });

    try {
      localStorage.setItem(QUARANTINE_KEY, record);
    } catch (error) {
      // Do not destroy the only durable corrupt payload if quarantine itself cannot be stored.
      console.warn('[LUKE QUEST] autosave quarantine write failed; preserving canonical payload', error);
      return false;
    }

    try {
      localStorage.removeItem(SAVE_KEY);
      return true;
    } catch (error) {
      console.warn('[LUKE QUEST] autosave quarantine stored but canonical removal failed', error);
      return false;
    }
  };

  let raw;
  try {
    raw = localStorage.getItem(SAVE_KEY);
  } catch (error) {
    console.warn('[LUKE QUEST] autosave bootstrap guard could not read localStorage', error);
    return;
  }

  if (raw === null) return;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    quarantine(raw, 'malformed-json');
    return;
  }

  if (!isPlainObject(parsed)) {
    quarantine(raw, 'invalid-root-shape');
    return;
  }

  let changed = false;
  const sanitized = Object.create(null);

  for (const key of Object.keys(parsed)) {
    if (DANGEROUS_KEYS.has(key)) {
      changed = true;
      continue;
    }
    sanitized[key] = parsed[key];
  }

  if (isPlainObject(parsed.flags)) {
    const safeFlags = Object.create(null);
    let flagsChanged = false;
    for (const key of Object.keys(parsed.flags)) {
      if (DANGEROUS_KEYS.has(key)) {
        changed = true;
        flagsChanged = true;
        continue;
      }
      safeFlags[key] = parsed.flags[key];
    }
    if (flagsChanged) sanitized.flags = safeFlags;
  }

  if (!changed) return;

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(sanitized));
  } catch (error) {
    console.warn('[LUKE QUEST] autosave bootstrap sanitization rewrite failed', error);
  }
})();
