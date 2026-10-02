import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DB_PATH = join(__dirname, 'cricket.db');

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS teams (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT UNIQUE NOT NULL,
    short_name  TEXT NOT NULL,
    group_id    TEXT,
    elo_rating  REAL DEFAULT 1500,
    icc_ranking INTEGER,
    logo_url    TEXT
  );

  CREATE TABLE IF NOT EXISTS players (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL,
    team_id      INTEGER REFERENCES teams(id),
    role         TEXT,
    batting_avg  REAL,
    bowling_avg  REAL,
    strike_rate  REAL
  );

  CREATE TABLE IF NOT EXISTS matches (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    cricsheet_id   TEXT UNIQUE,
    match_date     TEXT NOT NULL,
    team1_id       INTEGER REFERENCES teams(id),
    team2_id       INTEGER REFERENCES teams(id),
    winner_id      INTEGER REFERENCES teams(id),
    venue          TEXT,
    neutral_venue  INTEGER DEFAULT 1,
    team1_score    INTEGER,
    team2_score    INTEGER,
    margin_runs    INTEGER,
    margin_wickets INTEGER
  );

  CREATE TABLE IF NOT EXISTS elo_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id     INTEGER REFERENCES teams(id),
    match_id    INTEGER REFERENCES matches(id),
    elo_before  REAL,
    elo_after   REAL,
    match_date  TEXT
  );

  CREATE TABLE IF NOT EXISTS simulation_results (
    team_id           INTEGER PRIMARY KEY REFERENCES teams(id),
    championship_pct  REAL,
    semifinal_pct     REAL,
    group_advance_pct REAL,
    simulations_run   INTEGER
  );

  CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
  CREATE INDEX IF NOT EXISTS idx_matches_teams ON matches(team1_id, team2_id);
  CREATE INDEX IF NOT EXISTS idx_elo_history_team ON elo_history(team_id);
`;

let _db = null;

export function getDb() {
  if (_db) return _db;

  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec(SCHEMA);

  db.transaction = (fn) => {
    return (...args) => {
      db.exec('BEGIN');
      try {
        const result = fn(...args);
        db.exec('COMMIT');
        return result;
      } catch (err) {
        db.exec('ROLLBACK');
        throw err;
      }
    };
  };

  _db = db;
  return db;
}
