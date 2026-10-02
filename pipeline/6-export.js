import { getDb } from './db.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'client', 'public', 'data');
const BRACKET_CONFIG = JSON.parse(readFileSync(join(__dirname, '..', 'bracket-config.json'), 'utf8'));
const ELO_SCALE = 400;

function winProb(eloA, eloB) {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / ELO_SCALE));
}

function write(filename, data) {
  fs.writeFileSync(join(OUT_DIR, filename), JSON.stringify(data, null, 2));
  console.log(`   ✓ ${filename}`);
}

function computeFormScore(recentMatches, teamId) {
  // Weighted: more recent = higher weight
  let score = 0;
  let weight = recentMatches.length;
  for (const m of recentMatches) {
    if (m.winner_id === teamId) score += weight;
    weight--;
  }
  const maxPossible = (recentMatches.length * (recentMatches.length + 1)) / 2;
  return maxPossible > 0 ? score / maxPossible : 0;
}

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(join(OUT_DIR, 'teams'), { recursive: true });

  const db = getDb();
  console.log('📤 Exporting JSON files...');

  const teams = db.prepare(`
    SELECT t.*, sr.championship_pct, sr.semifinal_pct, sr.group_advance_pct
    FROM teams t
    LEFT JOIN simulation_results sr ON sr.team_id = t.id
    ORDER BY sr.championship_pct DESC NULLS LAST
  `).all();

  const teamsById = Object.fromEntries(teams.map(t => [t.id, t]));

  // 1. teams.json
  write('teams.json', teams.map(t => ({
    id: t.id,
    name: t.name,
    shortName: t.short_name,
    slug: t.name.toLowerCase().replace(/\s+/g, '-'),
    group: t.group_id,
    iccRanking: t.icc_ranking,
    eloRating: Math.round(t.elo_rating),
    championshipPct: t.championship_pct ? parseFloat((t.championship_pct * 100).toFixed(1)) : null,
    semifinalPct: t.semifinal_pct ? parseFloat((t.semifinal_pct * 100).toFixed(1)) : null,
    groupAdvancePct: t.group_advance_pct ? parseFloat((t.group_advance_pct * 100).toFixed(1)) : null,
  })));

  // 2. championship_odds.json (sorted by win probability)
  write('championship_odds.json', {
    generatedAt: new Date().toISOString(),
    simulationsRun: 50000,
    odds: teams.map(t => ({
      name: t.name,
      shortName: t.short_name,
      slug: t.name.toLowerCase().replace(/\s+/g, '-'),
      championshipPct: t.championship_pct ? parseFloat((t.championship_pct * 100).toFixed(1)) : null,
      semifinalPct: t.semifinal_pct ? parseFloat((t.semifinal_pct * 100).toFixed(1)) : null,
      groupAdvancePct: t.group_advance_pct ? parseFloat((t.group_advance_pct * 100).toFixed(1)) : null,
      eloRating: Math.round(t.elo_rating),
    })),
  });

  // 3. matchups.json — all 91 possible matchups pre-computed
  const matchups = {};
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const a = teams[i], b = teams[j];
      const p = winProb(a.elo_rating, b.elo_rating);

      // Head-to-head stats
      const h2h = db.prepare(`
        SELECT COUNT(*) as total,
               SUM(CASE WHEN winner_id = ? THEN 1 ELSE 0 END) as a_wins,
               SUM(CASE WHEN winner_id = ? THEN 1 ELSE 0 END) as b_wins
        FROM matches
        WHERE (team1_id = ? AND team2_id = ?) OR (team1_id = ? AND team2_id = ?)
      `).get(a.id, b.id, a.id, b.id, b.id, a.id);

      const key = `${a.short_name}-${b.short_name}`;
      matchups[key] = {
        teamA: { name: a.name, shortName: a.short_name, slug: a.name.toLowerCase().replace(/\s+/g, '-'), eloRating: Math.round(a.elo_rating), winPct: parseFloat((p * 100).toFixed(1)) },
        teamB: { name: b.name, shortName: b.short_name, slug: b.name.toLowerCase().replace(/\s+/g, '-'), eloRating: Math.round(b.elo_rating), winPct: parseFloat(((1 - p) * 100).toFixed(1)) },
        h2h: { total: h2h.total, aWins: h2h.a_wins, bWins: h2h.b_wins },
      };
    }
  }
  write('matchups.json', matchups);

  // 4. bracket.json — tournament config merged with predictions
  write('bracket.json', {
    config: BRACKET_CONFIG,
    groupPredictions: {
      A: BRACKET_CONFIG.groups.A.map(name => {
        const t = teams.find(t => t.name === name);
        return { name, shortName: t?.short_name ?? name, eloRating: t ? Math.round(t.elo_rating) : null };
      }),
      B: BRACKET_CONFIG.groups.B.map(name => {
        const t = teams.find(t => t.name === name);
        return { name, shortName: t?.short_name ?? name, eloRating: t ? Math.round(t.elo_rating) : null };
      }),
    },
  });

  // 5. elo_history.json — last 3 years of Elo per team (for charts)
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 3);
  const cutoffStr = cutoff.toISOString().split('T')[0];

  const eloHistory = {};
  for (const team of teams) {
    const history = db.prepare(`
      SELECT eh.match_date, eh.elo_after as elo
      FROM elo_history eh
      WHERE eh.team_id = ? AND eh.match_date >= ?
      ORDER BY eh.match_date ASC
    `).all(team.id, cutoffStr);
    eloHistory[team.short_name] = history.map(h => ({ date: h.match_date, elo: Math.round(h.elo) }));
  }
  write('elo_history.json', eloHistory);

  // 6. Per-team JSON files (teams/india.json, etc.)
  for (const team of teams) {
    const recentMatches = db.prepare(`
      SELECT m.match_date, m.winner_id,
             t1.name as opp_name, t1.short_name as opp_short,
             m.team1_score, m.team2_score, m.margin_runs, m.margin_wickets
      FROM matches m
      JOIN teams t1 ON (CASE WHEN m.team1_id = ? THEN m.team2_id ELSE m.team1_id END) = t1.id
      WHERE (m.team1_id = ? OR m.team2_id = ?) AND m.winner_id IS NOT NULL
      ORDER BY m.match_date DESC
      LIMIT 15
    `).all(team.id, team.id, team.id);

    const formScore = computeFormScore(recentMatches.slice(0, 8), team.id);

    const players = db.prepare(`
      SELECT name, role, batting_avg, bowling_avg, strike_rate
      FROM players WHERE team_id = ?
    `).all(team.id);

    const slug = team.name.toLowerCase().replace(/\s+/g, '-');
    write(`teams/${slug}.json`, {
      id: team.id,
      name: team.name,
      shortName: team.short_name,
      slug,
      group: team.group_id,
      iccRanking: team.icc_ranking,
      eloRating: Math.round(team.elo_rating),
      formScore: parseFloat(formScore.toFixed(3)),
      championshipPct: team.championship_pct ? parseFloat((team.championship_pct * 100).toFixed(1)) : null,
      semifinalPct: team.semifinal_pct ? parseFloat((team.semifinal_pct * 100).toFixed(1)) : null,
      recentForm: recentMatches.map(m => ({
        date: m.match_date,
        opponent: m.opp_name,
        opponentShort: m.opp_short,
        result: m.winner_id === team.id ? 'W' : 'L',
        margin: m.margin_runs ? `${m.margin_runs} runs` : m.margin_wickets ? `${m.margin_wickets} wkts` : null,
      })),
      players,
    });
  }

  console.log('\n✅ All JSON files exported successfully.');
}

run().catch(err => { console.error('❌ Export failed:', err); process.exit(1); });
