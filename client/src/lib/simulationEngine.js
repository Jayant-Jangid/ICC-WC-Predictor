// Client-Side Monte Carlo Tournament Simulation Engine for ICC CWC 2027
// Runs full 4-stage tournament simulations in browser (Group Stage -> Super 7 -> Semis -> Final)

const ELO_SCALE = 400;

function winProb(eloA, eloB) {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / ELO_SCALE));
}

function simulateMatch(teamA, teamB, elos, chaosMultiplier = 1.0) {
  const prob = winProb(elos[teamA], elos[teamB]);
  // Chaos modifier flattens the probability slightly towards 50% for knockout volatility
  const adjustedProb = chaosMultiplier === 1.0
    ? prob
    : 0.5 + (prob - 0.5) * (1 / chaosMultiplier);
  return Math.random() < adjustedProb ? teamA : teamB;
}

function simulateGroupRoundRobin(group, elos, chaos) {
  const points = Object.fromEntries(group.map(t => [t, 0]));
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const winner = simulateMatch(group[i], group[j], elos, chaos);
      points[winner] += 2;
    }
  }
  return [...group].sort((a, b) => (points[b] - points[a]) || (elos[b] - elos[a]));
}

export function runLiveSimulation(baselineTeams, params = {}, nSims = 15000) {
  const {
    hostAdvantage = 45,       // +45 Elo to SA, ZIM, NAM
    formWeight = 0.35,        // 0 to 1 scale
    knockoutChaos = 1.0,     // 1.0 = standard, 1.3 = chaotic, 0.8 = chalk
    spinBias = 0,             // boost subcontinent teams on dry tracks
  } = params;

  // Clone and adjust elos
  const elos = {};
  const hostShorts = ['SA', 'ZIM', 'NAM'];
  const spinShorts = ['IND', 'PAK', 'SL', 'AFG', 'BAN'];

  // Map team names to adjusted elos
  baselineTeams.forEach(t => {
    let elo = t.eloRating || 1500;
    if (hostShorts.includes(t.shortName)) {
      elo += hostAdvantage;
    }
    if (spinShorts.includes(t.shortName)) {
      elo += spinBias * 40;
    }
    // Form adjustment if formScore available
    if (t.formScore) {
      elo += (t.formScore - 0.5) * 80 * formWeight;
    }
    elos[t.name] = elo;
  });

  // Average elo for qualifier placeholder
  const eloValues = Object.values(elos);
  const avgElo = eloValues.reduce((a, b) => a + b, 0) / (eloValues.length || 1);
  elos['TBD-Qualifier'] = avgElo * 0.86;

  // Groups as configured
  const groupA = ['India', 'Australia', 'Pakistan', 'South Africa', 'Bangladesh', 'TBD-Qualifier', 'TBD-Qualifier-2'].map(
    t => elos[t] ? t : 'TBD-Qualifier'
  );
  const groupB = ['England', 'New Zealand', 'Sri Lanka', 'Afghanistan', 'Zimbabwe', 'Namibia', 'TBD-Qualifier-3'].map(
    t => elos[t] ? t : 'TBD-Qualifier'
  );

  const teamNames = baselineTeams.map(t => t.name);
  const titleWins = Object.fromEntries(teamNames.map(t => [t, 0]));
  const semisReach = Object.fromEntries(teamNames.map(t => [t, 0]));
  const groupAdvance = Object.fromEntries(teamNames.map(t => [t, 0]));

  for (let s = 0; s < nSims; s++) {
    // Stage 2: Group Stage
    const sortedA = simulateGroupRoundRobin(groupA, elos, 1.0);
    const sortedB = simulateGroupRoundRobin(groupB, elos, 1.0);

    const qualifiedA = sortedA.slice(0, 3);
    const qualifiedB = sortedB.slice(0, 3);

    for (const t of qualifiedA) if (groupAdvance[t] !== undefined) groupAdvance[t]++;
    for (const t of qualifiedB) if (groupAdvance[t] !== undefined) groupAdvance[t]++;

    // Stage 3: Super 7 Stage (Top 3 A + Top 3 B + 1 Qualifier)
    const super7Pool = [...qualifiedA, ...qualifiedB, 'TBD-Qualifier'];
    const super7Sorted = simulateGroupRoundRobin(super7Pool, elos, 1.0);

    // Stage 4: Top 4 -> Semi-Finals
    const [t1, t2, t3, t4] = super7Sorted.slice(0, 4);
    for (const t of [t1, t2, t3, t4]) {
      if (semisReach[t] !== undefined) semisReach[t]++;
    }

    // Knockouts with knockoutChaos factor
    const finalist1 = simulateMatch(t1, t4, elos, knockoutChaos);
    const finalist2 = simulateMatch(t2, t3, elos, knockoutChaos);
    const champion = simulateMatch(finalist1, finalist2, elos, knockoutChaos);

    if (titleWins[champion] !== undefined) {
      titleWins[champion]++;
    }
  }

  // Format return with diff from baseline
  const results = baselineTeams.map(t => {
    const simChampionshipPct = Number(((titleWins[t.name] || 0) / nSims * 100).toFixed(1));
    const simSemifinalPct = Number(((semisReach[t.name] || 0) / nSims * 100).toFixed(1));
    const simGroupAdvancePct = Number(((groupAdvance[t.name] || 0) / nSims * 100).toFixed(1));
    const basePct = Number(t.championshipPct || 0);
    const diff = Number((simChampionshipPct - basePct).toFixed(1));

    return {
      ...t,
      simChampionshipPct,
      simSemifinalPct,
      simGroupAdvancePct,
      diff,
      effectiveElo: Math.round(elos[t.name] || t.eloRating),
    };
  });

  return results.sort((a, b) => b.simChampionshipPct - a.simChampionshipPct);
}
