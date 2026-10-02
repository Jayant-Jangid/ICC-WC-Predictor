// In-Browser High-Speed Monte Carlo Simulation Engine
// Pure client-side computation — 0 server requests, 0ms latency

const ELO_SCALE = 400;

function winProb(eloA, eloB, tossBias = 0) {
  // tossBias: small modifier (+/- Elo equivalent)
  const diff = (eloB - eloA) - tossBias;
  return 1 / (1 + Math.pow(10, diff / ELO_SCALE));
}

function simulateMatch(teamA, teamB, eloMap, tossBias = 0) {
  const p = winProb(eloMap[teamA] ?? 1500, eloMap[teamB] ?? 1500, tossBias);
  return Math.random() < p ? teamA : teamB;
}

function simulateGroupStage(group, eloMap, tossBias = 0) {
  const points = Object.fromEntries(group.map(t => [t, 0]));
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const winner = simulateMatch(group[i], group[j], eloMap, tossBias);
      points[winner] += 2;
    }
  }
  return [...group].sort((a, b) => (points[b] - points[a]) || ((eloMap[b] ?? 1500) - (eloMap[a] ?? 1500)));
}

function simulateSuper7(qualified, eloMap, tossBias = 0) {
  const points = Object.fromEntries(qualified.map(t => [t, 0]));
  for (let i = 0; i < qualified.length; i++) {
    for (let j = i + 1; j < qualified.length; j++) {
      const winner = simulateMatch(qualified[i], qualified[j], eloMap, tossBias);
      points[winner] += 2;
    }
  }
  return [...qualified].sort((a, b) => (points[b] - points[a]) || ((eloMap[b] ?? 1500) - (eloMap[a] ?? 1500)));
}

export function runBrowserSimulation({
  baseTeams,
  eloModifiers = {},
  tossAdvantage = 0, // e.g. -20 to +20 Elo points
  iterations = 10000,
}) {
  // Build effective Elo map
  const eloMap = {};
  for (const t of baseTeams) {
    const mod = Number(eloModifiers[t.name] ?? 0);
    eloMap[t.name] = (t.eloRating ?? 1500) + mod;
  }

  // Qualifier placeholder
  const avgElo = Object.values(eloMap).reduce((a, b) => a + b, 0) / (Object.values(eloMap).length || 1);
  eloMap['TBD-Qualifier-1'] = avgElo * 0.85;
  eloMap['TBD-Qualifier-2'] = avgElo * 0.85;
  eloMap['TBD-Qualifier-3'] = avgElo * 0.85;

  const groupA = ['India', 'Australia', 'Pakistan', 'South Africa', 'Bangladesh', 'TBD-Qualifier-1', 'TBD-Qualifier-2'];
  const groupB = ['England', 'New Zealand', 'Sri Lanka', 'Afghanistan', 'Zimbabwe', 'Namibia', 'TBD-Qualifier-3'];

  const teamNames = baseTeams.map(t => t.name);
  const titles = Object.fromEntries(teamNames.map(t => [t, 0]));
  const semis = Object.fromEntries(teamNames.map(t => [t, 0]));
  const super7 = Object.fromEntries(teamNames.map(t => [t, 0]));

  for (let iter = 0; iter < iterations; iter++) {
    const sortedA = simulateGroupStage(groupA, eloMap, tossAdvantage);
    const sortedB = simulateGroupStage(groupB, eloMap, tossAdvantage);

    // Top 3 from each advance
    const top7Pool = [
      sortedA[0], sortedA[1], sortedA[2],
      sortedB[0], sortedB[1], sortedB[2],
      'TBD-Qualifier-1'
    ];

    for (const t of top7Pool) {
      if (super7[t] !== undefined) super7[t]++;
    }

    // Super 7 stage
    const super7Sorted = simulateSuper7(top7Pool, eloMap, tossAdvantage);

    // Top 4 into Semis
    const s1a = super7Sorted[0];
    const s1b = super7Sorted[3];
    const s2a = super7Sorted[1];
    const s2b = super7Sorted[2];

    const f1 = simulateMatch(s1a, s1b, eloMap, tossAdvantage);
    const f2 = simulateMatch(s2a, s2b, eloMap, tossAdvantage);

    if (semis[f1] !== undefined) semis[f1]++;
    if (semis[f2] !== undefined) semis[f2]++;

    // Final
    const champion = simulateMatch(f1, f2, eloMap, tossAdvantage);
    if (titles[champion] !== undefined) titles[champion]++;
  }

  return teamNames.map(name => {
    const teamObj = baseTeams.find(t => t.name === name);
    return {
      name,
      shortName: teamObj?.shortName ?? name,
      slug: teamObj?.slug ?? name.toLowerCase().replace(/\s+/g, '-'),
      baseElo: teamObj?.eloRating ?? 1500,
      adjustedElo: Math.round(eloMap[name]),
      championshipPct: parseFloat(((titles[name] / iterations) * 100).toFixed(1)),
      semifinalPct: parseFloat(((semis[name] / iterations) * 100).toFixed(1)),
      super7Pct: parseFloat(((super7[name] / iterations) * 100).toFixed(1)),
    };
  }).sort((a, b) => b.championshipPct - a.championshipPct);
}
