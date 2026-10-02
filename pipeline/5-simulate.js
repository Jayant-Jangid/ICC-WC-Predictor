import { getDb } from './db.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const bracketConfig = JSON.parse(readFileSync(join(__dirname, '..', 'bracket-config.json'), 'utf8'));

const N_SIMULATIONS = 50000;
const ELO_SCALE = 400;

function winProb(eloA, eloB) {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / ELO_SCALE));
}

function simulateMatch(teamA, teamB, elos) {
  const p = winProb(elos[teamA], elos[teamB]);
  return Math.random() < p ? teamA : teamB;
}

function simulateGroupStage(group, elos) {
  // Round-robin within the group
  const points = Object.fromEntries(group.map(t => [t, 0]));
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const winner = simulateMatch(group[i], group[j], elos);
      points[winner] += 2;
    }
  }
  // Sort by points, break ties by Elo
  return group.sort((a, b) => (points[b] - points[a]) || (elos[b] - elos[a]));
}

function simulateSuper7(qualified, elos) {
  // 7 teams play round-robin against teams they haven't played in groups
  // For simulation purposes: play all 7 vs all 7 round-robin, track points
  const points = Object.fromEntries(qualified.map(t => [t, 0]));
  for (let i = 0; i < qualified.length; i++) {
    for (let j = i + 1; j < qualified.length; j++) {
      const winner = simulateMatch(qualified[i], qualified[j], elos);
      points[winner] += 2;
    }
  }
  return qualified.sort((a, b) => (points[b] - points[a]) || (elos[b] - elos[a]));
}

function runOneSim(teams, elos) {
  const groupA = [...bracketConfig.groups.A].filter(t => teams.includes(t));
  const groupB = [...bracketConfig.groups.B].filter(t => teams.includes(t));

  // Substitute TBD qualifiers with average-Elo placeholders
  const resolveGroup = (group) => group.map(t => t.startsWith('TBD') ? 'TBD-Qualifier' : t);
  const rGroupA = resolveGroup(groupA);
  const rGroupB = resolveGroup(groupB);

  const sortedA = simulateGroupStage(rGroupA, elos);
  const sortedB = simulateGroupStage(rGroupB, elos);

  // Top 3 from each group advance
  const qualified = [...sortedA.slice(0, 3), ...sortedB.slice(0, 3), 'TBD-Qualifier'];
  const super7 = simulateSuper7(qualified.slice(0, 7), elos);

  // Top 4 → Semis
  const [s1a, s1b, s2a, s2b] = [super7[0], super7[3], super7[1], super7[2]];
  const finalist1 = simulateMatch(s1a, s1b, elos);
  const finalist2 = simulateMatch(s2a, s2b, elos);
  const champion = simulateMatch(finalist1, finalist2, elos);

  return {
    groupWinners: [sortedA[0], sortedB[0]],
    qualified: qualified.slice(0, 6), // exclude placeholder
    semis: [finalist1, finalist2],
    champion,
  };
}

function run() {
  const db = getDb();
  const teams = db.prepare('SELECT name, elo_rating FROM teams').all();
  const elos = Object.fromEntries(teams.map(t => [t.name, t.elo_rating]));

  // Add average elo for TBD qualifier
  const avgElo = Object.values(elos).reduce((a, b) => a + b, 0) / Object.values(elos).length;
  elos['TBD-Qualifier'] = avgElo * 0.85; // qualifiers slightly weaker than average

  const teamNames = teams.map(t => t.name);

  console.log(`🎲 Running ${N_SIMULATIONS.toLocaleString()} tournament simulations...`);

  const wins = Object.fromEntries(teamNames.map(t => [t, 0]));
  const semis = Object.fromEntries(teamNames.map(t => [t, 0]));
  const qualified = Object.fromEntries(teamNames.map(t => [t, 0]));

  for (let i = 0; i < N_SIMULATIONS; i++) {
    const result = runOneSim(teamNames, elos);
    if (wins[result.champion] !== undefined) wins[result.champion]++;
    for (const t of result.semis) if (semis[t] !== undefined) semis[t]++;
    for (const t of result.qualified) if (qualified[t] !== undefined) qualified[t]++;
  }

  // Create results table
  db.exec(`
    CREATE TABLE IF NOT EXISTS simulation_results (
      team_id           INTEGER PRIMARY KEY REFERENCES teams(id),
      championship_pct  REAL,
      semifinal_pct     REAL,
      group_advance_pct REAL,
      simulations_run   INTEGER
    );
  `);

  const upsert = db.prepare(`
    INSERT OR REPLACE INTO simulation_results (team_id, championship_pct, semifinal_pct, group_advance_pct, simulations_run)
    SELECT id, ?, ?, ?, ? FROM teams WHERE name = ?
  `);

  const insertAll = db.transaction(() => {
    for (const name of teamNames) {
      upsert.run(
        (wins[name] ?? 0) / N_SIMULATIONS,
        (semis[name] ?? 0) / N_SIMULATIONS,
        (qualified[name] ?? 0) / N_SIMULATIONS,
        N_SIMULATIONS,
        name
      );
    }
  });
  insertAll();

  console.log('\n🏆 Championship win probabilities:');
  const sorted = teamNames.sort((a, b) => wins[b] - wins[a]);
  for (const name of sorted) {
    const pct = ((wins[name] ?? 0) / N_SIMULATIONS * 100).toFixed(1);
    console.log(`   ${name.padEnd(20)} ${pct}%`);
  }
}

run();
