const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, '../../data/tasks.db');

const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let _db = null;

function saveDb() {
  const data = _db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function getLastInsertRowid() {
  const stmt = _db.prepare('SELECT last_insert_rowid() as id');
  stmt.step();
  const { id } = stmt.getAsObject();
  stmt.free();
  return id;
}

async function initDb() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    _db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    _db = new SQL.Database();
  }

  _db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT,
      status      TEXT    NOT NULL DEFAULT 'pending',
      priority    TEXT    NOT NULL DEFAULT 'medium',
      due_date    TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);

  saveDb();
  return _db;
}

function toFlat(args) {
  return args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
}

const db = {
  run(sql, params = []) {
    _db.run(sql, params);
    saveDb();
  },

  prepare(sql) {
    return {
      run(...args) {
        const flat = toFlat(args);
        const stmt = _db.prepare(sql);
        stmt.bind(flat);
        stmt.step();
        stmt.free();
        const lastId = getLastInsertRowid();
        saveDb();
        return { lastInsertRowid: lastId };
      },
      get(...args) {
        const flat = toFlat(args);
        const stmt = _db.prepare(sql);
        stmt.bind(flat);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        }
        stmt.free();
        return undefined;
      },
      all(...args) {
        const flat = toFlat(args);
        const results = [];
        const stmt = _db.prepare(sql);
        stmt.bind(flat);
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      },
    };
  },

  exec(sql) {
    _db.run(sql);
    saveDb();
  },
};

module.exports = { db, initDb };