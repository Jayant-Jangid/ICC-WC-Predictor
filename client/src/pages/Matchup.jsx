import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTeams, useMatchups } from '../hooks/useData';
import { TeamCrest, TEAM_BRANDING, TOURNAMENT_VENUES } from '../lib/teamBranding';
import { WinProbabilityBar } from '../components/WinProbabilityBar';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Swords,
  MapPin,
  Flame,
  Shield,
  Zap,
  RotateCcw,
  Sparkles,
  Trophy,
  Activity,
  ArrowRight,
} from 'lucide-react';

const FEATURED_RIVALRIES = [
  { a: 'IND', b: 'AUS', title: 'India vs Australia', sub: 'World Cup 2023 Final Rematch' },
  { a: 'IND', b: 'PAK', title: 'India vs Pakistan', sub: 'Greatest Rivalry in World Cricket' },
  { a: 'ENG', b: 'AUS', title: 'England vs Australia', sub: 'The Historic Ashes Rivalry' },
  { a: 'SA', b: 'NZ', title: 'South Africa vs New Zealand', sub: '2015 & 2023 Knockout Thrillers' },
  { a: 'SA', b: 'IND', title: 'South Africa vs India', sub: 'Co-Host Showdown at High Altitude' },
  { a: 'AFG', b: 'PAK', title: 'Afghanistan vs Pakistan', sub: 'Fierce Asian Neighbor Derby' },
];

export default function Matchup() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: teams } = useTeams();
  const { data: matchups } = useMatchups();

  const initialA = searchParams.get('teamA') || 'IND';
  const initialB = searchParams.get('teamB') || 'AUS';

  const [teamAShort, setTeamAShort] = useState(initialA);
  const [teamBShort, setTeamBShort] = useState(initialB);
  const [selectedVenueId, setSelectedVenueId] = useState('wanderers');
  const [selectedPitch, setSelectedPitch] = useState('paceBouncy'); // 'paceBouncy' | 'seamSwing' | 'flatDeck' | 'dryTurner'
  const [tossDecision, setTossDecision] = useState('none'); // 'a_bat' | 'b_bat' | 'none'
  const [simulatedBallByBall, setSimulatedBallByBall] = useState(null);

  const teamAInfo = TEAM_BRANDING[teamAShort] || { name: teamAShort, tactics: {} };
  const teamBInfo = TEAM_BRANDING[teamBShort] || { name: teamBShort, tactics: {} };
  const venue = TOURNAMENT_VENUES.find((v) => v.id === selectedVenueId) || TOURNAMENT_VENUES[0];

  const teamAData = teams?.find((t) => t.shortName === teamAShort);
  const teamBData = teams?.find((t) => t.shortName === teamBShort);

  // Find head to head matchup from baseline data
  const baseMatchup = useMemo(() => {
    if (!matchups || !teamAShort || !teamBShort || teamAShort === teamBShort) return null;
    const key = `${teamAShort}-${teamBShort}`;
    const reverseKey = `${teamBShort}-${teamAShort}`;

    if (matchups[key]) return matchups[key];
    if (matchups[reverseKey]) {
      const orig = matchups[reverseKey];
      return {
        teamA: orig.teamB,
        teamB: orig.teamA,
        h2h: {
          total: orig.h2h.total,
          aWins: orig.h2h.bWins,
          bWins: orig.h2h.aWins,
        },
      };
    }
    return null;
  }, [matchups, teamAShort, teamBShort]);

  // Adjust win probability dynamically based on pitch, venue, and toss!
  const dynamicMatchup = useMemo(() => {
    if (!baseMatchup) return null;

    let pctA = baseMatchup.teamA.winPct;
    let pctB = baseMatchup.teamB.winPct;

    // Pitch Synergy Modifier
    const synergyA = (teamAInfo.pitchSynergy?.[selectedPitch] || 85) - 85;
    const synergyB = (teamBInfo.pitchSynergy?.[selectedPitch] || 85) - 85;
    const pitchDelta = (synergyA - synergyB) * 0.4;
    pctA += pitchDelta;
    pctB -= pitchDelta;

    // Venue Host Nation Bonus
    if (venue.country === 'South Africa') {
      if (teamAShort === 'SA') pctA += 4.5;
      if (teamBShort === 'SA') pctB += 4.5;
    } else if (venue.country === 'Zimbabwe') {
      if (teamAShort === 'ZIM') pctA += 6.0;
      if (teamBShort === 'ZIM') pctB += 6.0;
    } else if (venue.country === 'Namibia') {
      if (teamAShort === 'NAM') pctA += 5.5;
      if (teamBShort === 'NAM') pctB += 5.5;
    }

    // Toss decision
    if (tossDecision === 'a_bat') {
      pctA += 1.8;
      pctB -= 1.8;
    } else if (tossDecision === 'b_bat') {
      pctB += 1.8;
      pctA -= 1.8;
    }

    // Normalize
    pctA = Math.max(5, Math.min(95, pctA));
    pctB = 100 - pctA;

    return {
      ...baseMatchup,
      teamA: { ...baseMatchup.teamA, winPct: Number(pctA.toFixed(1)) },
      teamB: { ...baseMatchup.teamB, winPct: Number(pctB.toFixed(1)) },
    };
  }, [baseMatchup, selectedPitch, selectedVenueId, tossDecision, teamAInfo, teamBInfo, venue]);

  // Radar chart data comparing the two teams' 6 attributes
  const radarData = useMemo(() => {
    const tA = teamAInfo.tactics || {};
    const tB = teamBInfo.tactics || {};

    return [
      { attribute: 'Batting Depth', TeamA: tA.battingDepth || 80, TeamB: tB.battingDepth || 80 },
      { attribute: 'Pace Attack', TeamA: tA.paceAttack || 80, TeamB: tB.paceAttack || 80 },
      { attribute: 'Spin Quality', TeamA: tA.spinQuality || 80, TeamB: tB.spinQuality || 80 },
      { attribute: 'Fielding', TeamA: tA.fielding || 80, TeamB: tB.fielding || 80 },
      { attribute: 'Death Overs', TeamA: tA.deathOvers || 80, TeamB: tB.deathOvers || 80 },
      { attribute: 'Clutch / Knockouts', TeamA: tA.clutchIndex || 80, TeamB: tB.clutchIndex || 80 },
    ];
  }, [teamAInfo, teamBInfo]);

  const selectRivalry = (a, b) => {
    setTeamAShort(a);
    setTeamBShort(b);
    setSearchParams({ teamA: a, teamB: b });
    setSimulatedBallByBall(null);
  };

  // Run a fun, fast animated ball-by-ball simulated chase
  const runMatchSimulation = () => {
    if (!dynamicMatchup) return;
    const aWins = Math.random() * 100 < dynamicMatchup.teamA.winPct;
    const margin = aWins
      ? Math.random() > 0.5
        ? `${Math.floor(Math.random() * 50 + 8)} runs`
        : `${Math.floor(Math.random() * 6 + 2)} wickets`
      : Math.random() > 0.5
      ? `${Math.floor(Math.random() * 50 + 8)} runs`
      : `${Math.floor(Math.random() * 6 + 2)} wickets`;

    setSimulatedBallByBall({
      winner: aWins ? dynamicMatchup.teamA.name : dynamicMatchup.teamB.name,
      winnerShort: aWins ? teamAShort : teamBShort,
      margin,
      scoreA: `${Math.floor(Math.random() * 60 + 270)}/${Math.floor(Math.random() * 4 + 6)}`,
      scoreB: `${Math.floor(Math.random() * 60 + 265)}/${Math.floor(Math.random() * 4 + 7)}`,
      playerOfMatch: aWins ? teamAInfo.keyPlayer?.split('(')[0] : teamBInfo.keyPlayer?.split('(')[0],
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Swords size={14} />
          <span>Tactical War Room & Predictive Match Center</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Head-to-Head Matchup Predictor
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Simulate any tournament clash with dynamic pitch conditions, highveld altitude factors, toss leverage,
          and tactical attribute radars.
        </p>
      </div>

      {/* Featured Marquee Rivalries */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured Marquee Clashes:</div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FEATURED_RIVALRIES.map((r) => {
            const isActive =
              (teamAShort === r.a && teamBShort === r.b) || (teamAShort === r.b && teamBShort === r.a);
            return (
              <button
                key={r.title}
                onClick={() => selectRivalry(r.a, r.b)}
                className={`px-3 py-2 rounded-xl text-left border transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-md shadow-amber-500/10'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <TeamCrest shortName={r.a} size={18} />
                  <span>vs</span>
                  <TeamCrest shortName={r.b} size={18} />
                  <span>{r.title}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{r.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Face-Off Arena Card */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 p-6 sm:p-8 space-y-8">
        {/* Teams Selectors & Giant Face-Off Banner */}
        <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-6">
          {/* Team A Profile */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <div className="flex items-center gap-3">
              <TeamCrest shortName={teamAShort} size={64} />
              <div>
                <select
                  value={teamAShort}
                  onChange={(e) => {
                    setTeamAShort(e.target.value);
                    setSearchParams({ teamA: e.target.value, teamB: teamBShort });
                    setSimulatedBallByBall(null);
                  }}
                  className="bg-[#0b101e] border border-white/20 rounded-lg px-3 py-1.5 text-lg font-black text-white outline-none cursor-pointer"
                >
                  {teams?.map((t) => (
                    <option key={t.shortName} value={t.shortName} className="bg-slate-900 text-white">
                      {t.name} ({t.shortName})
                    </option>
                  ))}
                </select>
                <div className="text-xs text-slate-400 mt-1">
                  Elo: <span className="mono text-white font-bold">{teamAData?.eloRating || 1600}</span> · ICC
                  Rank #{teamAInfo.iccRank || teamAData?.iccRanking}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 max-w-xs space-y-1">
              <div>
                <span className="font-semibold text-slate-300">Captain:</span> {teamAInfo.captain || 'Squad'}
              </div>
              <div>
                <span className="font-semibold text-slate-300">Key Anchor:</span> {teamAInfo.keyPlayer || 'Core'}
              </div>
            </div>
          </div>

          {/* Central VS Badge */}
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-black text-sm shadow-lg shadow-amber-500/20">
              VS
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              ODI Head-to-Head
            </span>
          </div>

          {/* Team B Profile */}
          <div className="md:col-span-2 flex flex-col items-center md:items-end text-center md:text-right space-y-3">
            <div className="flex items-center md:flex-row-reverse gap-3">
              <TeamCrest shortName={teamBShort} size={64} />
              <div>
                <select
                  value={teamBShort}
                  onChange={(e) => {
                    setTeamBShort(e.target.value);
                    setSearchParams({ teamA: teamAShort, teamB: e.target.value });
                    setSimulatedBallByBall(null);
                  }}
                  className="bg-[#0b101e] border border-white/20 rounded-lg px-3 py-1.5 text-lg font-black text-white outline-none cursor-pointer"
                >
                  {teams?.map((t) => (
                    <option key={t.shortName} value={t.shortName} className="bg-slate-900 text-white">
                      {t.name} ({t.shortName})
                    </option>
                  ))}
                </select>
                <div className="text-xs text-slate-400 mt-1">
                  Elo: <span className="mono text-white font-bold">{teamBData?.eloRating || 1600}</span> · ICC
                  Rank #{teamBInfo.iccRank || teamBData?.iccRanking}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 max-w-xs space-y-1">
              <div>
                <span className="font-semibold text-slate-300">Captain:</span> {teamBInfo.captain || 'Squad'}
              </div>
              <div>
                <span className="font-semibold text-slate-300">Key Anchor:</span> {teamBInfo.keyPlayer || 'Core'}
              </div>
            </div>
          </div>
        </div>

        {/* Win Probability Bar with Dynamic Calculations */}
        {dynamicMatchup ? (
          <div className="bg-black/30 rounded-xl p-5 border border-white/5 space-y-4">
            <WinProbabilityBar teamA={dynamicMatchup.teamA} teamB={dynamicMatchup.teamB} />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Encounters</span>
                <span className="text-xl font-bold text-white mono">{dynamicMatchup.h2h.total}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  {dynamicMatchup.teamA.name} Wins
                </span>
                <span className="text-xl font-bold text-blue-400 mono">{dynamicMatchup.h2h.aWins}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  {dynamicMatchup.teamB.name} Wins
                </span>
                <span className="text-xl font-bold text-amber-400 mono">{dynamicMatchup.h2h.bWins}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Elo Delta</span>
                <span className="text-xl font-bold text-slate-200 mono">
                  Δ {Math.abs(dynamicMatchup.teamA.eloRating - dynamicMatchup.teamB.eloRating)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-slate-400 bg-white/5 rounded-xl">
            Select two different nations to calculate predictive odds.
          </div>
        )}

        {/* Tactical Conditions & Venue Control Deck */}
        <div className="border-t border-white/10 pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Flame size={14} />
              <span>Simulate Match Conditions & Pitch Leverage</span>
            </div>
            <div className="text-xs text-slate-400">Real-time win probability shifts automatically</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Venue Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin size={13} className="text-amber-400" />
                <span>Stadium & Host Venue</span>
              </label>
              <select
                value={selectedVenueId}
                onChange={(e) => setSelectedVenueId(e.target.value)}
                className="w-full bg-[#0b101e] border border-white/20 rounded-lg p-2.5 text-xs font-semibold text-white outline-none cursor-pointer"
              >
                {TOURNAMENT_VENUES.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                    {v.name} ({v.city}, {v.country}) · {v.altitude}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">{venue.description}</p>
            </div>

            {/* Pitch Surface Character */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Activity size={13} className="text-emerald-400" />
                <span>Pitch Surface Character</span>
              </label>
              <select
                value={selectedPitch}
                onChange={(e) => setSelectedPitch(e.target.value)}
                className="w-full bg-[#0b101e] border border-white/20 rounded-lg p-2.5 text-xs font-semibold text-white outline-none cursor-pointer"
              >
                <option value="paceBouncy" className="bg-slate-900">
                  ⚡ Extreme Pace & Bounce (Wanderers Style)
                </option>
                <option value="seamSwing" className="bg-slate-900">
                  🌊 Seam & Lateral Swing (Newlands Table Mountain)
                </option>
                <option value="flatDeck" className="bg-slate-900">
                  🏏 True Batting Deck / High Score Track
                </option>
                <option value="dryTurner" className="bg-slate-900">
                  🌀 Abrasive Dry Turner (Harare Red Soil)
                </option>
              </select>
              <p className="text-[11px] text-slate-400">
                {selectedPitch === 'paceBouncy' && 'Rewards express 145km/h pacers and back-of-length hitmen.'}
                {selectedPitch === 'seamSwing' && 'Gives massive assistance to opening swing specialists.'}
                {selectedPitch === 'flatDeck' && '320+ par score; favors depth and power boundary hitters.'}
                {selectedPitch === 'dryTurner' && 'Drastic grip and spin; dampens pace advantage.'}
              </p>
            </div>

            {/* Toss Simulation */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Trophy size={13} className="text-blue-400" />
                <span>Toss Advantage</span>
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#0b101e] p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setTossDecision('none')}
                  className={`py-1.5 px-2 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    tossDecision === 'none' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Neutral
                </button>
                <button
                  onClick={() => setTossDecision('a_bat')}
                  className={`py-1.5 px-2 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    tossDecision === 'a_bat'
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {teamAShort} Bats 1st
                </button>
                <button
                  onClick={() => setTossDecision('b_bat')}
                  className={`py-1.5 px-2 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    tossDecision === 'b_bat'
                      ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {teamBShort} Bats 1st
                </button>
              </div>
              <div className="pt-2">
                <button
                  onClick={runMatchSimulation}
                  className="w-full py-2 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={13} />
                  <span>Simulate Instant Match</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Instant Match Simulation Result */}
        {simulatedBallByBall && (
          <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>Simulated Match Result · Wanderers ODI</span>
              </span>
              <button
                onClick={() => setSimulatedBallByBall(null)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="text-xl font-black text-white">
              {simulatedBallByBall.winner} won by {simulatedBallByBall.margin}
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-4 pt-1">
              <span>
                {teamAShort}: <strong className="mono">{simulatedBallByBall.scoreA}</strong>
              </span>
              <span>
                {teamBShort}: <strong className="mono">{simulatedBallByBall.scoreB}</strong>
              </span>
              <span>Player of the Match: <strong className="text-amber-400">{simulatedBallByBall.playerOfMatch}</strong></span>
            </div>
          </div>
        )}

        {/* Tactical Radar Chart & Attribute Battle */}
        <div className="border-t border-white/10 pt-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Shield size={14} />
              <span>Tactical Radar Comparison</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">Squad Strength Profiles</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Evaluating the 6 core tactical pillars of modern ODI cricket: Batting Depth, Express Pace, Spin
              Quality, Athletic Fielding, Death Overs Execution, and ICC Tournament Clutchness.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs p-2 rounded bg-white/5 border border-white/5">
                <span className="text-slate-300 font-semibold">{dynamicMatchup?.teamA.name} Advantage:</span>
                <span className="text-blue-400 font-bold">
                  {teamAInfo.tactics?.spinQuality > teamBInfo.tactics?.spinQuality ? 'Superior Spin Choke' : 'Deep Batting Lineup'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded bg-white/5 border border-white/5">
                <span className="text-slate-300 font-semibold">{dynamicMatchup?.teamB.name} Advantage:</span>
                <span className="text-amber-400 font-bold">
                  {teamBInfo.tactics?.paceAttack > teamAInfo.tactics?.paceAttack ? 'High-Velocity Pace Battery' : 'Knockout Clutch Factor'}
                </span>
              </div>
            </div>
          </div>

          {/* Radar Chart Component */}
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="attribute" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[60, 100]} stroke="rgba(255,255,255,0.1)" tick={false} />
                <Radar
                  name={dynamicMatchup?.teamA.name || 'Team 1'}
                  dataKey="TeamA"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
                <Radar
                  name={dynamicMatchup?.teamB.name || 'Team 2'}
                  dataKey="TeamB"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.4}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(val) => <span className="text-slate-200 font-bold">{val}</span>}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
