import { getDb } from './db.js';

const K_FACTOR = 40;
const ELO_SCALE = 400;
const HOME_ADVANTAGE = 50; // not used for ODIs (mostly neutral venues)
const INITIAL_ELO = 1500;

// ICC rating-seeded starting Elos (reflect 2025 relative strength)
const SEED_ELOS = {
  'India': 1720, 'Australia': 1700, 'New Zealand': 1660, 'England': 1640,
  'Pakistan': 1620, 'South Africa': 1630, 'Sri Lanka': 1560,
  'Bangladesh': 1520, 'Afghanistan': 1510, 'Zimbabwe': 1420, 'Namibia': 1380,
};

function expectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / ELO_SCALE));
}

function newRating(rating, expected, actual) {
  return rating + K_FACTOR * (actual - expected);
}

function run() {
  const db = getDb();

  // Seed initial Elo ratings
  const setElo = db.prepare('UPDATE teams SET elo_rating = ? WHERE name = ?');
  for (const [name, elo] of Object.entries(SEED_ELOS)) {
    setElo.run(elo, name);
  }

  // Load all matches with team names, ordered by date
  const matches = db.prepare(`
    SELECT m.id, m.match_date, m.neutral_venue,
           t1.id as t1_id, t1.name as t1_name,
           t2.id as t2_id, t2.name as t2_name,
           w.id  as winner_id
    FROM matches m
    JOIN teams t1 ON m.team1_id = t1.id
    JOIN teams t2 ON m.team2_id = t2.id
    LEFT JOIN teams w ON m.winner_id = w.id
    WHERE m.winner_id IS NOT NULL
    ORDER BY m.match_date ASC
  `).all();

  const elos = {};
  const allTeams = db.prepare('SELECT id, name, elo_rating FROM teams').all();
  for (const t of allTeams) elos[t.id] = t.elo_rating ?? INITIAL_ELO;

  const insertHistory = db.prepare(`
    INSERT OR REPLACE INTO elo_history (team_id, match_id, elo_before, elo_after, match_date)
    VALUES (?, ?, ?, ?, ?)
  `);

  const updateElo = db.prepare('UPDATE teams SET elo_rating = ? WHERE id = ?');

  const processMatches = db.transaction((matches) => {
    for (const m of matches) {
      const r1 = elos[m.t1_id] ?? INITIAL_ELO;
      const r2 = elos[m.t2_id] ?? INITIAL_ELO;

      const exp1 = expectedScore(r1, r2);
      const exp2 = 1 - exp1;

      const actual1 = m.winner_id === m.t1_id ? 1 : 0;
      const actual2 = 1 - actual1;

      const new1 = newRating(r1, exp1, actual1);
      const new2 = newRating(r2, exp2, actual2);

      insertHistory.run(m.t1_id, m.id, r1, new1, m.match_date);
      insertHistory.run(m.t2_id, m.id, r2, new2, m.match_date);

      elos[m.t1_id] = new1;
      elos[m.t2_id] = new2;
    }
  });

  processMatches(matches);

  // Write final Elo ratings back to teams table
  for (const [id, elo] of Object.entries(elos)) {
    updateElo.run(elo, id);
  }

  console.log(`✅ Computed Elo ratings for ${matches.length} matches.`);
  const teams = db.prepare('SELECT name, elo_rating FROM teams ORDER BY elo_rating DESC').all();
  for (const t of teams) {
    console.log(`   ${t.name.padEnd(20)} ${Math.round(t.elo_rating)}`);
  }
}

run();
