import * as SQLite from "expo-sqlite";

let _db;
function getDB() {
  if (!_db) _db = SQLite.openDatabase("uniapp2.db");
  return _db;
}

function execSql(sql, params = []) {
  const db = getDB();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (_tx, result) => resolve(result),
        (_tx, error) => { reject(error); return true; }
      );
    });
  });
}

// Schema: id, created_at (ISO), data (JSON)
export async function initDB() {
  await execSql(
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      data TEXT NOT NULL
    )
  );
}

export async function saveSession(matchObj) {
  const createdAt = matchObj?.created_at || matchObj?.timestamp || new Date().toISOString();
  const data = JSON.stringify({ ...matchObj, created_at: createdAt });
  await initDB();
  const res = await execSql(
    "INSERT INTO sessions (created_at, data) VALUES (?, ?)",
    [createdAt, data]
  );
  return { insertId: res.insertId };
}

export async function getSessions(limit = 100) {
  await initDB();
  const res = await execSql(
    SELECT id, created_at, data FROM sessions ORDER BY id DESC LIMIT ?,
    [limit]
  );
  const out = [];
  const rows = res?.rows || { length: 0, item: () => null };
  for (let i = 0; i < rows.length; i++) {
    const row = rows.item(i);
    let parsed = null;
    try { parsed = JSON.parse(row.data); } catch { parsed = { raw: row.data }; }
    out.push({ id: row.id, created_at: row.created_at, data: parsed });
  }
  return out;
}

export async function clearSessions() {
  await initDB();
  await execSql("DELETE FROM sessions");
}
