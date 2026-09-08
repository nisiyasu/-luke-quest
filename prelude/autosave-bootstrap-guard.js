(() => {
  'use strict';

  const SAVE_KEY = 'lukeQuestV2';
  const QUARANTINE_KEY = 'lukeQuestAutosaveQuarantineV1';
  const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

  /* REQ-140 owner recovery path.
     A physical iPhone can render black after importing the legacy save even
     when its map coordinates are changed. Do not derive this recovery from
     that payload. Build a clean canonical-shaped save before index.html
     reads localStorage, while preserving the old bytes under a backup key.

     Target is intentionally one interaction before REQ-128:
       windStairRidge / (10,2) / facing up -> north-boundary Action -> Leon.
     Owner physical play evidence establishes LV11 as the appropriate level
     here: LV8 was too harsh and LV11 was where this stretch became stable.
  */
  const installCleanPreLeonRecovery = () => {
    let requested = false;
    try {
      requested = new URLSearchParams(location.search).get('leon-recovery') === '1';
    } catch (_) {}
    if (!requested) return false;

    let previous = null;
    try { previous = localStorage.getItem(SAVE_KEY); } catch (_) {}

    if (previous !== null) {
      try {
        localStorage.setItem(`lukeQuestV2_req140_before_leon_recovery_${Date.now()}`, previous);
      } catch (error) {
        console.warn('[LUKE QUEST] pre-Leon backup write failed; recovery aborted', error);
        return true;
      }
    }

    const clean = {
      screen: 'world',
      lv: 11,
      hp: 132,
      mh: 132,
      atk: 34,
      xp: 413,
      nx: 1135,
      gold: 1797,
      potions: 6,
      map: 'windStairRidge',
      x: 10,
      y: 2,
      dir: 'up',
      step: 0,
      wins: 90,
      enemy: null,
      ehp: 0,
      log: ['長い追跡の末、風鳴りの石段の最北端へ着いた。レオンはこの先にいる。'],
      dialog: null,
      flags: {
        leonSeen: true,
        mistEntered: true,
        glennTraceSeen: true,
        observationEntered: true,
        glennSeen: true,
        evacEntered: true,
        leonInjurySeen: true,
        escapeProofSeen: true,
        withdrawProofSeen: true,
        guidanceIntroSeen: true,
        req118OpeningComplete: true,
        req118OpeningPhase: 'legacy_bypass',
        chapter1ClimaxStarted: false,
        chapter1HeroRevealedToLeon: false,
        chapter1LeonConfrontationResolved: false,
        chapter1SisterWounded: false,
        chapter1SisterInjuryNonfatal: false,
        chapter1Complete: false
      },
      weapon: '旅人の短剣',
      armor: '旅人服',
      settings: { sound: true, music: true, sfx: true },
      saveSchema: 3,
      playSeconds: 0,
      mmp: 30,
      mp: 30,
      seenEnemies: [],
      enemyDefeats: {},
      dialogHistory: [],
      discoveredMaps: [
        'town','field','forest','deepForest','mistTrail','observation',
        'evacRoute','northCliffRoad','northRidgeApproach','windShelf',
        'skylineTraverse','cloudbreakSaddle','windStairRidge'
      ]
    };

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(clean));
      const verify = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
      if (!verify || verify.map !== 'windStairRidge' || verify.lv !== 11 || verify.x !== 10 || verify.y !== 2) {
        throw new Error('post-write verification mismatch');
      }
      try {
        const url = new URL(location.href);
        url.searchParams.delete('leon-recovery');
        url.searchParams.set('recovered', 'pre-leon-lv11');
        history.replaceState(null, '', url.pathname + '?' + url.searchParams.toString() + url.hash);
      } catch (_) {}
      console.info('[LUKE QUEST] clean pre-Leon LV11 recovery installed');
    } catch (error) {
      console.warn('[LUKE QUEST] clean pre-Leon recovery write failed', error);
    }
    return true;
  };

  if (installCleanPreLeonRecovery()) return;

  const isPlainObject = value => {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  };

  const normalizeKeyItems = value => {
    if (!Array.isArray(value)) return [];
    const seen = new Set();
    const out = [];
    for (const item of value) {
      if (typeof item !== 'string' || !item || seen.has(item)) continue;
      seen.add(item);
      out.push(item);
    }
    return out;
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

  if (Object.prototype.hasOwnProperty.call(parsed, 'keyItems')) {
    const normalizedKeyItems = normalizeKeyItems(parsed.keyItems);
    if (!Array.isArray(parsed.keyItems) || JSON.stringify(normalizedKeyItems) !== JSON.stringify(parsed.keyItems)) {
      sanitized.keyItems = normalizedKeyItems;
      changed = true;
    }
  }

  if (!changed) return;

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(sanitized));
  } catch (error) {
    console.warn('[LUKE QUEST] autosave bootstrap sanitization rewrite failed', error);
  }
})();
