import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getDb } from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW_DIR = join(__dirname, 'raw');

// Canonical team names mapping (Cricsheet name → our name)
const TEAM_ALIASES = {
  'India': 'India',
  'Australia': 'Australia',
  'New Zealand': 'New Zealand',
  'Pakistan': 'Pakistan',
  'England': 'England',
  'Sri Lanka': 'Sri Lanka',
  'Bangladesh': 'Bangladesh',
  'Afghanistan': 'Afghanistan',
  'South Africa': 'South Africa',
  'Zimbabwe': 'Zimbabwe',
  'Namibia': 'Namibia',
  // Common aliases
  'U.A.E.': null, 'United Arab Emirates': null,
};

const SHORT_NAMES = {
  'India': 'IND', 'Australia': 'AUS', 'New Zealand': 'NZ',
  'Pakistan': 'PAK', 'England': 'ENG', 'Sri Lanka': 'SL',
  'Bangladesh': 'BAN', 'Afghanistan': 'AFG',
  'South Africa': 'SA', 'Zimbabwe': 'ZIM', 'Namibia': 'NAM',
};

const WC_TEAMS = new Set(Object.keys(SHORT_NAMES));

function parseMatch(filePath) {
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const info = raw.info;

    // Only ODI matches
    if (info.match_type !== 'ODI') return null;

    // Only from 2019 onwards
    const date = info.dates?.[0];
    if (!date || date < '2019-01-01') return null;

    const teams = info.teams;
    if (!teams || teams.length !== 2) return null;

    const [t1, t2] = teams;
    const canonT1 = TEAM_ALIASES[t1] ?? t1;
    const canonT2 = TEAM_ALIASES[t2] ?? t2;

    // At least one WC team
    if (!WC_TEAMS.has(canonT1) && !WC_TEAMS.has(canonT2)) return null;

    const outcome = info.outcome;
    let winnerName = null;
    if (outcome?.winner) {
      winnerName = TEAM_ALIASES[outcome.winner] ?? outcome.winner;
    }

    // Scores from innings
    let team1Score = null, team2Score = null;
    let marginRuns = null, marginWickets = null;
    if (outcome?.by?.runs != null) marginRuns = outcome.by.runs;
    if (outcome?.by?.wickets != null) marginWickets = outcome.by.wickets;

    if (raw.innings) {
      const inn1 = raw.innings[0];
      const inn2 = raw.innings[1];
      if (inn1) team1Score = inn1.overs?.reduce((s, o) => s + o.deliveries?.reduce((d, b) => d + (b.runs?.total ?? 0), 0), 0) ?? null;
      if (inn2) team2Score = inn2.overs?.reduce((s, o) => s + o.deliveries?.reduce((d, b) => d + (b.runs?.total ?? 0), 0), 0) ?? null;
    }

    const venue = info.venue ?? info.city ?? null;
    const isNeutral = info.neutral_venue ? 1 : 1; // treat all ODIs as neutral unless specified

    return {
      cricsheetId: filePath.split(/[\\/]/).pop().replace('.json', ''),
      date,
      team1: canonT1,
      team2: canonT2,
      winner: winnerName,
      venue,
      isNeutral,
      team1Score,
      team2Score,
      marginRuns,
      marginWickets,
    };
  } catch {
    return null;
  }
}

function run() {
  const db = getDb();

  // Ensure teams exist
  const upsertTeam = db.prepare(`
    INSERT OR IGNORE INTO teams (name, short_name) VALUES (?, ?)
  `);
  for (const [name, short] of Object.entries(SHORT_NAMES)) {
    upsertTeam.run(name, short);
  }

  const getTeamId = db.prepare('SELECT id FROM teams WHERE name = ?');

  const insertMatch = db.prepare(`
    INSERT OR REPLACE INTO matches
      (cricsheet_id, match_date, team1_id, team2_id, winner_id, venue, neutral_venue, team1_score, team2_score, margin_runs, margin_wickets)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.json'));
  console.log(`📂 Parsing ${files.length} match files...`);

  let inserted = 0, skipped = 0;
  const insertMany = db.transaction((matches) => {
    for (const m of matches) {
      const t1Row = getTeamId.get(m.team1);
      const t2Row = getTeamId.get(m.team2);
      if (!t1Row || !t2Row) { skipped++; continue; }

      const winnerRow = m.winner ? getTeamId.get(m.winner) : null;
      insertMatch.run(
        m.cricsheetId, m.date,
        t1Row.id, t2Row.id,
        winnerRow?.id ?? null,
        m.venue, m.isNeutral,
        m.team1Score, m.team2Score,
        m.marginRuns, m.marginWickets
      );
      inserted++;
    }
  });

  const batch = [];
  for (const file of files) {
    const parsed = parseMatch(join(RAW_DIR, file));
    if (parsed) batch.push(parsed);
    if (batch.length >= 500) { insertMany(batch); batch.length = 0; }
  }
  if (batch.length) insertMany(batch);

  console.log(`✅ Parsed ${inserted} matches, skipped ${skipped}.`);
}

run();
