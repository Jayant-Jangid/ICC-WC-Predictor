import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { useMatchups } from '../hooks/useData';
import { TeamCrest, TEAM_BRANDING, TOURNAMENT_VENUES } from '../lib/teamBranding';
import { SimulationControls } from '../components/SimulationControls';
import { WinProbabilityBar } from '../components/WinProbabilityBar';
import { getEloBadge } from '../lib/utils';
import { Trophy, Swords, ArrowRight, Shield, Zap, TrendingUp, Compass, Award } from 'lucide-react';

export default function Home() {
  const { activeTeams, isSimulating, isCustom, simRunCount } = useSimulation();
  const { data: matchups } = useMatchups();

  // Matchup selector state
  const [teamA, setTeamA] = useState('IND');
  const [teamB, setTeamB] = useState('AUS');
  const [selectedVenue, setSelectedVenue] = useState('wanderers');

  // Find head to head matchup
  const activeMatchup = useMemo(() => {
    if (!matchups || !teamA || !teamB || teamA === teamB) return null;
    const key = `${teamA}-${teamB}`;
    const reverseKey = `${teamB}-${teamA}`;

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
  }, [matchups, teamA, teamB]);

  // Top 3 heavyweights
  const top3 = activeTeams.slice(0, 3);
  // Next 8 teams (clean 8 teams for a 4-col x 2-row grid with ZERO blank spaces!)
  const chasingPack = activeTeams.slice(3, 11);

  const venueInfo = TOURNAMENT_VENUES.find((v) => v.id === selectedVenue) || TOURNAMENT_VENUES[0];

  return (
    <div className="space-y-12 pb-16">
      {/* Editorial Tournament Hero */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/25">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>ICC Men's Cricket World Cup 2027</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Oct 2 – Nov 21, 2027 · South Africa · Zimbabwe · Namibia
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
            Who wins the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
              2027 World Cup?
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Forecasting all 57 matches across the new 14-nation, 4-stage tournament format. Powered by dynamic
            Elo ratings, venue pitch synergies, and Monte Carlo simulations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/championship"
              className="px-5 py-2.5 rounded-lg text-sm font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Trophy size={16} />
              <span>Full Odds & Standings</span>
            </Link>
            <Link
              to="/matchup"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
            >
              <Swords size={16} />
              <span>Matchup Simulator</span>
            </Link>
            <Link
              to="/bracket"
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
            >
              <Compass size={16} />
              <span>Interactive Bracket</span>
            </Link>
          </div>
        </div>

        {/* Tournament Quick Stats Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10">
          <div className="bg-[#0b101d] p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white mono">14</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Nations</div>
          </div>
          <div className="bg-[#0b101d] p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white mono">57</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Matches</div>
          </div>
          <div className="bg-[#0b101d] p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mono">
              {simRunCount >= 1000 ? `${(simRunCount / 1000).toFixed(0)}k` : simRunCount}
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Simulations</div>
          </div>
          <div className="bg-[#0b101d] p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white mono">4</div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Tournament Stages</div>
          </div>
        </div>

        {/* Live Ongoing International Series Spotlight */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-emerald-950/40 border border-blue-500/30 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400">
                  Live Ongoing Bilateral Tour
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-300 font-semibold">India Tour of New Zealand (Nov 2026)</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  IND leads 2–1
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Series Update: New Zealand Roars Back in 4th ODI at Bay Oval
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                4th ODI: <strong>New Zealand won by 244 runs</strong> (NZ 333 all out; Will Young 125, Matt Henry historic 6/27 · IND 89 all out).
                5th and deciding ODI scheduled for Sunday. Both teams' Elo ratings and World Cup forecasts have been dynamically updated in the model!
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/matchup?teamA=IND&teamB=NZ"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md transition-all flex items-center gap-1.5"
              >
                <Swords size={13} />
                <span>Simulate IND vs NZ</span>
              </Link>
              <Link
                to="/teams/new-zealand"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-all"
              >
                NZ Squad
              </Link>
              <Link
                to="/teams/india"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-all"
              >
                IND Squad
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulation Sandbox Bar */}
      <section className="space-y-3">
        <div className="broadcast-header">
          <Zap size={14} className="text-amber-400" />
          <span>Interactive Monte Carlo Engine</span>
        </div>
        <SimulationControls />
      </section>

      {/* Heavyweights Showcase (Top 3 Tier 1 Favorites) */}
      <section className="space-y-4">
        <div className="broadcast-header">
          <Trophy size={14} className="text-amber-400" />
          <span>Title Favorites · Heavyweight Tier</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((team, idx) => {
            const brand = TEAM_BRANDING[team.shortName] || {};
            const badge = getEloBadge(team.eloRating);
            const isWinner = idx === 0;

            return (
              <motion.div
                key={team.shortName}
                layout
                className={`relative rounded-xl overflow-hidden glass-panel-interactive border transition-all ${
                  isWinner ? 'border-amber-500/40 shadow-lg shadow-amber-500/5' : 'border-white/10'
                }`}
              >
                {/* Kit color top stripe */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: brand.gradient || brand.primaryColor || '#d4a843' }}
                />

                <div className="p-5 space-y-4">
                  {/* Card Header: Crest + Name + Rank */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <TeamCrest shortName={team.shortName} size={44} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="mono text-xs font-bold text-slate-400">#{idx + 1}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white leading-tight mt-0.5">{team.name}</h3>
                        <p className="text-xs text-slate-400">
                          ICC Rank #{brand.iccRank || team.iccRanking} · {brand.worldCupTitles}x Champions
                        </p>
                      </div>
                    </div>

                    {isWinner && (
                      <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Award size={18} />
                      </span>
                    )}
                  </div>

                  {/* Big Odds Number */}
                  <div className="bg-black/30 rounded-lg p-3.5 border border-white/5 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        Championship Probability
                      </span>
                      {isCustom && team.diff !== 0 && (
                        <span
                          className={`mono text-xs font-bold px-1.5 py-0.5 rounded ${
                            team.diff > 0
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {team.diff > 0 ? `+${team.diff}%` : `${team.diff}%`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-amber-400 mono">
                        {team.simChampionshipPct.toFixed(1)}%
                      </span>
                      <span className="text-xs text-slate-400">to lift the trophy</span>
                    </div>

                    {/* Win Prob Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, team.simChampionshipPct * 2.5)}%`,
                          background: isWinner
                            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                            : 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Secondary Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/5 rounded p-2 border border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Reach Semi-Finals</div>
                      <div className="text-base font-bold text-white mono mt-0.5">
                        {team.simSemifinalPct.toFixed(1)}%
                      </div>
                    </div>
                    <div className="bg-white/5 rounded p-2 border border-white/5">
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Current Elo</div>
                      <div className="text-base font-bold text-white mono mt-0.5">
                        {team.effectiveElo || team.eloRating}
                      </div>
                    </div>
                  </div>

                  {/* Key Player Tag */}
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-white/5 flex items-center justify-between">
                    <span className="truncate">Key: {brand.keyPlayer || 'Core Squad'}</span>
                    <Link
                      to={`/teams/${team.slug}`}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 shrink-0 ml-2"
                    >
                      <span>Profile</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* The Chasing Pack & Dark Horses (8 teams = exactly 4 columns x 2 rows, ZERO empty boxes!) */}
      <section className="space-y-4">
        <div className="broadcast-header">
          <Shield size={14} className="text-slate-400" />
          <span>The Chasing Pack & Dark Horses</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {chasingPack.map((team, idx) => {
            const brand = TEAM_BRANDING[team.shortName] || {};
            const badge = getEloBadge(team.eloRating);

            return (
              <motion.div
                key={team.shortName}
                layout
                className="glass-panel-interactive rounded-xl p-4 border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <TeamCrest shortName={team.shortName} size={32} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="mono text-[11px] font-bold text-slate-400">#{idx + 4}</span>
                        <h4 className="text-sm font-bold text-white leading-tight">{team.name}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 mono">Elo {team.effectiveElo || team.eloRating}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="bg-black/20 rounded-lg p-2.5 border border-white/5 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Win Title</span>
                    <span className="text-xl font-extrabold text-white mono">
                      {team.simChampionshipPct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Reach Semis</span>
                    <span className="text-sm font-bold text-slate-300 mono">
                      {team.simSemifinalPct.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                  <span className="text-[11px] text-slate-400">
                    Adv. {team.simGroupAdvancePct ? `${team.simGroupAdvancePct.toFixed(0)}%` : '—'}
                  </span>
                  <Link
                    to={`/teams/${team.slug}`}
                    className="text-amber-400 hover:text-amber-300 font-semibold text-xs flex items-center gap-1"
                  >
                    <span>View Detail</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Head-to-Head Tactical Arena Quick Preview */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Swords size={15} />
              <span>Head-to-Head Tactical Simulator</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">Matchup Face-Off</h2>
          </div>
          <Link
            to={`/matchup?teamA=${teamA}&teamB=${teamB}`}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Open Tactical War Room</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Team Selectors & Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Team 1</label>
            <div className="flex items-center gap-2 bg-[#0d1424] border border-white/10 rounded-lg p-2">
              <TeamCrest shortName={teamA} size={28} />
              <select
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                className="bg-transparent text-sm font-semibold text-white w-full outline-none cursor-pointer"
              >
                {activeTeams.map((t) => (
                  <option key={t.shortName} value={t.shortName} className="bg-slate-900 text-white">
                    {t.name} ({t.shortName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Team 2</label>
            <div className="flex items-center gap-2 bg-[#0d1424] border border-white/10 rounded-lg p-2">
              <TeamCrest shortName={teamB} size={28} />
              <select
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                className="bg-transparent text-sm font-semibold text-white w-full outline-none cursor-pointer"
              >
                {activeTeams.map((t) => (
                  <option key={t.shortName} value={t.shortName} className="bg-slate-900 text-white">
                    {t.name} ({t.shortName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tournament Venue</label>
            <div className="bg-[#0d1424] border border-white/10 rounded-lg p-2">
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="bg-transparent text-sm font-semibold text-white w-full outline-none cursor-pointer"
              >
                {TOURNAMENT_VENUES.map((v) => (
                  <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                    {v.name} ({v.city})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Head to Head Display */}
        {activeMatchup ? (
          <div className="bg-black/30 rounded-xl p-5 border border-white/5 space-y-4">
            <WinProbabilityBar teamA={activeMatchup.teamA} teamB={activeMatchup.teamB} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">H2H ODI History</span>
                <span className="text-lg font-bold text-white mono">
                  {activeMatchup.h2h.aWins} – {activeMatchup.h2h.bWins}
                </span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  Across {activeMatchup.h2h.total} encounters
                </span>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Elo Differential</span>
                <span className="text-lg font-bold text-amber-400 mono">
                  Δ {Math.abs(activeMatchup.teamA.eloRating - activeMatchup.teamB.eloRating)} pts
                </span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  {activeMatchup.teamA.eloRating >= activeMatchup.teamB.eloRating
                    ? `${activeMatchup.teamA.name} favored`
                    : `${activeMatchup.teamB.name} favored`}
                </span>
              </div>

              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Venue Condition Factor</span>
                <span className="text-sm font-bold text-emerald-400 block truncate">{venueInfo.character}</span>
                <span className="text-slate-400 text-[11px] block mt-0.5 truncate">{venueInfo.name}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-sm text-slate-400 bg-white/5 rounded-xl">
            Select two different nations to simulate their head-to-head odds.
          </div>
        )}
      </section>

      {/* Tournament Format 4-Stage Pathway */}
      <section className="space-y-4">
        <div className="broadcast-header">
          <Compass size={14} className="text-slate-400" />
          <span>2027 Tournament Architecture</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="glass-panel rounded-xl p-4 border border-white/10 space-y-2">
            <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">
              Stage 01 · Play-In
            </div>
            <h4 className="text-base font-bold text-white">Super Series</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Preliminary playoff tournament held in Windhoek, Namibia. Final qualifier berth decided.
            </p>
            <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
              Windhoek · Oct 2, 2027
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-white/10 space-y-2">
            <div className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
              Stage 02 · Group Phase
            </div>
            <h4 className="text-base font-bold text-white">14 Nations in 2 Groups</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              7 teams per group. Full round-robin. Top 3 from Group A and Group B advance to Super 7.
            </p>
            <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
              42 Matches · Oct 7, 2027
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-white/10 space-y-2">
            <div className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">
              Stage 03 · Super 7
            </div>
            <h4 className="text-base font-bold text-white">Super 7 Stage</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Top 6 qualifying nations battle for the top 4 seeds. Points carry-over system applies.
            </p>
            <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
              12 Matches · Oct 25, 2027
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-amber-500/30 bg-amber-500/5 space-y-2">
            <div className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
              Stage 04 · Knockouts
            </div>
            <h4 className="text-base font-bold text-white">Semis & Grand Final</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              1v4 and 2v3 in Cape Town and Centurion. Grand Final at the Bullring, Wanderers Johannesburg.
            </p>
            <div className="text-[11px] font-mono text-amber-300/80 pt-2 border-t border-white/10">
              Nov 17 – Nov 21, 2027
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
