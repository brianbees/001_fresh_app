import { Platform } from 'react-native';

let SQLite = null;
try {
  SQLite = require('expo-sqlite');
} catch (e) {
  console.warn('expo-sqlite not available. DB disabled.');
}

let _db = null;

export async function ensureDb() {
  if (!SQLite || !SQLite.openDatabaseAsync) {
    console.warn('SQLite not available (or web). Skipping DB init.');
    return false;
  }
  if (_db) return true;

  try {
    _db = await SQLite.openDatabaseAsync('uniapp2.db');
    await _db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        payload TEXT NOT NULL
      );
    `);
    return true;
  } catch (e) {
    console.warn('DB init failed:', e?.message || e);
    _db = null;
    return false;
  }
}

export async function saveSession(sessionObj) {
  const ok = await ensureDb();
  if (!ok || !_db) return { ok: false, error: 'DB unavailable' };
  try {
    const created_at = new Date().toISOString();
    const payload = JSON.stringify(sessionObj);
    await _db.runAsync('INSERT INTO sessions (created_at, payload) VALUES (?, ?)', [created_at, payload]);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e?.message || String(e) };
  }
}

export async function getSessions() {
  const ok = await ensureDb();
  if (!ok || !_db) return [];
  try {
    const rows = await _db.getAllAsync('SELECT * FROM sessions ORDER BY id DESC');
    return rows.map(r => ({
      id: r.id,
      created_at: r.created_at,
      data: (() => { try { return JSON.parse(r.payload); } catch { return null; }})()
    }));
  } catch (e) {
    console.warn('getSessions failed:', e?.message || e);
    return [];
  }
}
