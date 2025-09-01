// src/storage/db.js — modern async expo-sqlite with safe fallbacks
import * as SQLite from "expo-sqlite";

let _db;

// Try the new async API first; fall back to legacy and polyfill
async function openDb() {
  if (_db) return _db;
  if (SQLite.openDatabaseAsync) {
    _db = await SQLite.openDatabaseAsync("uniapp2.db");
    return _db;
  }
  // Legacy
  _db = SQLite.openDatabase("uniapp2.db");
  // Polyfill minimal async helpers on legacy DB
  if (!_db.execAsync) {
    _db.execAsync = (sql) =>
      new Promise((resolve, reject) => {
        _db.transaction((tx) => {
          tx.executeSql(
            sql,
            [],
            () => resolve(true),
            (_, err) => {
              reject(err);
              return false;
            }
          );
        });
      });
  }
  if (!_db.runAsync) {
    _db.runAsync = (sql, params = []) =>
      new Promise((resolve, reject) => {
        _db.transaction((tx) => {
          tx.executeSql(
            sql,
            params,
            (_, res) => resolve(res),
            (_, err) => {
              reject(err);
              return false;
            }
          );
        });
      });
  }
  if (!_db.getAllAsync) {
    _db.getAllAsync = (sql, params = []) =>
      new Promise((resolve, reject) => {
        _db.transaction((tx) => {
          tx.executeSql(
            sql,
            params,
            (_, res) => resolve(res.rows._array ?? []),
            (_, err) => {
              reject(err);
              return false;
            }
          );
        });
      });
  }
  return _db;
}

export async function ensureDb() {
  const db = await openDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      started_at TEXT NOT NULL,
      players INTEGER NOT NULL,
      names TEXT,
      scores TEXT,
      total INTEGER DEFAULT 0
    );
  `);
  return db;
}

export async function createSession({ started_at, players, names, scores, total = 0 }) {
  const db = await ensureDb();
  await db.runAsync(
    `INSERT INTO sessions (started_at, players, names, scores, total) VALUES (?, ?, ?, ?, ?)`,
    [started_at, players, names, scores, total]
  );
}

export async function listSessions() {
  const db = await ensureDb();
  return await db.getAllAsync(
    `SELECT id, started_at, players, names, scores, total FROM sessions ORDER BY id DESC`
  );
}

export async function clearSessions() {
  const db = await ensureDb();
  await db.execAsync(`DELETE FROM sessions; VACUUM;`);
}
