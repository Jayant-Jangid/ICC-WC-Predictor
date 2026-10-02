import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { useMatchups } from '../hooks/useData';
import { TeamCrest, TEAM_BRANDING } from '../lib/teamBranding';
import { SimulationControls } from '../components/SimulationControls';
import { getEloBadge } from '../lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Trophy,
  ArrowUpDown,
  TrendingUp,
  Table as TableIcon,
  BarChart2,
  Grid,
  Filter,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function Championship() {
  const { activeTeams, isSimulating, isCustom, baselineTeams } = useSimulation();
  const { data: matchups } = useMatchups();

  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'matrix' | 'chart'
  const [filterTier, setFilterTier] = useState('all'); // 'all' | 'heavy' | 'contender' | 'dark' | 'hosts'
  const [sortKey, setSortKey] = useState('simChampionshipPct');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter teams
  const filteredTeams = useMemo(() => {
    return activeTeams.filter((t) => {
      if (filterTier === 'heavy') return t.simChampionshipPct >= 15;
      if (filterTier === 'contender') return t.simChampionshipPct >= 4 && t.simChampionshipPct < 15;
      if (filterTier === 'dark') return t.simChampionshipPct < 4;
      if (filterTier === 'hosts') return ['SA', 'ZIM', 'NAM'].includes(t.shortName);
      return true;
    });
  }, [activeTeams, filterTier]);

  // Sort teams
  const sortedTeams = useMemo(() => {
    return [...filteredTeams].sort((a, b) => {
      let valA = a[sortKey] ?? 0;
      let valB = b[sortKey] ?? 0;
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredTeams, sortKey, sortAsc]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const maxProb = Math.max(...activeTeams.map((t) => t.simChampionshipPct || 0), 1);

  // Head-to-head lookup helper for the interactive matrix
  const getH2HProb = (teamA, teamB) => {
    if (teamA === teamB) return null;
    if (!matchups) {
      // Elo fallback
      const eloA = activeTeams.find((t) => t.shortName === teamA)?.effectiveElo || 1500;
      const eloB = activeTeams.find((t) => t.shortName === teamB)?.effectiveElo || 1500;
      return Number((1 / (1 + Math.pow(10, (eloB - eloA) / 400)) * 100).toFixed(1));
    }
    const key = `${teamA}-${teamB}`;
    const reverseKey = `${teamB}-${teamA}`;
    if (matchups[key]) return Number(matchups[key].teamA.winPct.toFixed(1));
    if (matchups[reverseKey]) return Number(matchups[reverseKey].teamB.winPct.toFixed(1));
    return 50.0;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Trophy size={14} />
          <span>Tournament Forecast & Probability Board</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Championship Win Probabilities
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Aggregated across 50,000 full Monte Carlo simulations with dynamic stage progression. Use the model
          controls below to test different tournament scenarios and pitch conditions.
        </p>
      </div>

      {/* Interactive Simulation Controls */}
      <SimulationControls />

      {/* View Switcher & Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Tier filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter size={12} />
            <span>Filter:</span>
          </span>
          {[
            { id: 'all', label: `All Teams (${activeTeams.length})` },
            { id: 'heavy', label: 'Heavyweights (>15%)' },
            { id: 'contender', label: 'Contenders (4–15%)' },
            { id: 'dark', label: 'Underdogs (<4%)' },
            { id: 'hosts', label: 'Host Nations (3)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTier(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterTier === tab.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-[#0b101e] p-1 rounded-lg border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'table' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TableIcon size={13} />
            <span>Standings Table</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'matrix' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid size={13} />
            <span>H2H Matrix</span>
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'chart' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 size={13} />
            <span>Distribution Chart</span>
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      {activeTab === 'table' && (
        <div className="glass-panel rounded-xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-white select-none"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Nation</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-white select-none"
                    onClick={() => handleSort('effectiveElo')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Elo Rating</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-white select-none"
                    onClick={() => handleSort('simChampionshipPct')}
                  >
                    <div className="flex items-center gap-1 text-amber-400">
                      <span>Win Title %</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-white select-none"
                    onClick={() => handleSort('simSemifinalPct')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Reach Semis</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-white select-none"
                    onClick={() => handleSort('simGroupAdvancePct')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Group Advance</span>
                      <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th className="py-3 px-4">Tactical Edge</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {sortedTeams.map((team, idx) => {
                    const badge = getEloBadge(team.effectiveElo || team.eloRating);
                    const brand = TEAM_BRANDING[team.shortName] || {};
                    const isTop = idx === 0;

                    return (
                      <motion.tr
                        key={team.shortName}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`data-row transition-colors ${
                          isTop ? 'bg-amber-500/[0.04]' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-4 text-center mono font-bold text-slate-400">
                          {idx + 1}
                        </td>

                        {/* Team + Crest */}
                        <td className="py-3.5 px-4">
                          <Link
                            to={`/teams/${team.slug}`}
                            className="flex items-center gap-3 group"
                          >
                            <TeamCrest shortName={team.shortName} size={32} />
                            <div>
                              <div className="font-bold text-white group-hover:text-amber-400 transition-colors">
                                {team.name}
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                <span className="mono">{team.shortName}</span>
                                <span>·</span>
                                <span>Rank #{brand.iccRank || team.iccRanking}</span>
                              </div>
                            </div>
                          </Link>
                        </td>

                        {/* Elo + Tier Badge */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="mono font-bold text-slate-200">
                              {team.effectiveElo || team.eloRating}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badge.color}`}>
                              {badge.label}
                            </span>
                          </div>
                        </td>

                        {/* Win Probability Bar + Pct */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1.5 min-w-[140px]">
                            <div className="flex items-center justify-between">
                              <span className="mono font-black text-amber-400 text-base">
                                {team.simChampionshipPct.toFixed(1)}%
                              </span>
                              {isCustom && team.diff !== 0 && (
                                <span
                                  className={`mono text-[10px] font-bold px-1 py-0.2 rounded ${
                                    team.diff > 0
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-rose-500/20 text-rose-400'
                                  }`}
                                >
                                  {team.diff > 0 ? `+${team.diff}%` : `${team.diff}%`}
                                </span>
                              )}
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(100, (team.simChampionshipPct / maxProb) * 100)}%`,
                                  background: isTop
                                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                                    : 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Semis % */}
                        <td className="py-3.5 px-4 mono text-slate-300 font-semibold">
                          {team.simSemifinalPct.toFixed(1)}%
                        </td>

                        {/* Group Advance % */}
                        <td className="py-3.5 px-4 mono text-slate-300 font-semibold">
                          {team.simGroupAdvancePct ? `${team.simGroupAdvancePct.toFixed(1)}%` : '—'}
                        </td>

                        {/* Tactical Edge */}
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          <span className="truncate max-w-[180px] block">
                            {brand.keyPlayer ? brand.keyPlayer.split('(')[0] : 'Balanced Squad'}
                          </span>
                        </td>

                        {/* Details Link */}
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/teams/${team.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
                          >
                            <span>Profile</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Head to Head Probability Matrix Tab */}
      {activeTab === 'matrix' && (
        <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">Head-to-Head Win Probability Matrix</h3>
            <p className="text-xs text-slate-400">
              Win probability of the Row Nation facing off against the Column Nation. Hover over any cell to inspect the projected odds.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs">
              <thead>
                <tr>
                  <th className="p-2 border border-white/10 bg-black/60 text-slate-400 font-bold">vs</th>
                  {activeTeams.slice(0, 11).map((col) => (
                    <th key={col.shortName} className="p-2 border border-white/10 bg-black/40 font-bold text-slate-300">
                      <div className="flex flex-col items-center gap-1">
                        <TeamCrest shortName={col.shortName} size={20} />
                        <span className="mono text-[10px]">{col.shortName}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeTeams.slice(0, 11).map((row) => (
                  <tr key={row.shortName}>
                    <td className="p-2 border border-white/10 bg-black/40 text-left font-bold text-white">
                      <div className="flex items-center gap-2">
                        <TeamCrest shortName={row.shortName} size={20} />
                        <span className="mono text-xs">{row.shortName}</span>
                      </div>
                    </td>
                    {activeTeams.slice(0, 11).map((col) => {
                      if (row.shortName === col.shortName) {
                        return (
                          <td key={col.shortName} className="p-2 border border-white/10 bg-black/60 text-slate-600">
                            —
                          </td>
                        );
                      }
                      const prob = getH2HProb(row.shortName, col.shortName);
                      const isHigh = prob >= 60;
                      const isLow = prob <= 40;

                      return (
                        <td
                          key={col.shortName}
                          className={`p-2 border border-white/10 mono font-bold transition-all hover:ring-2 hover:ring-amber-400 cursor-pointer ${
                            isHigh
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : isLow
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-white/5 text-slate-300'
                          }`}
                          title={`${row.name} has a ${prob}% projected win probability vs ${col.name}`}
                        >
                          {prob !== null ? `${prob.toFixed(0)}%` : '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Distribution Chart Tab */}
      {activeTab === 'chart' && (
        <div className="glass-panel rounded-xl p-6 border border-white/10 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">Championship Probability Distribution</h3>
            <p className="text-xs text-slate-400">Comparing title probability across all 14 participating nations.</p>
          </div>

          <div className="h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeTeams} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="shortName"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0b101e] border border-white/20 p-3 rounded-lg shadow-xl text-xs space-y-1">
                          <div className="font-bold text-white text-sm">{data.name}</div>
                          <div className="text-amber-400 font-bold mono">
                            Championship Win: {data.simChampionshipPct.toFixed(1)}%
                          </div>
                          <div className="text-slate-400 mono">Semi-Finals: {data.simSemifinalPct.toFixed(1)}%</div>
                          <div className="text-slate-400 mono">Elo Rating: {data.effectiveElo || data.eloRating}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="simChampionshipPct" radius={[4, 4, 0, 0]}>
                  {activeTeams.map((entry, index) => {
                    let fill = '#3b82f6';
                    if (index === 0) fill = '#f59e0b';
                    else if (index === 1) fill = '#3b82f6';
                    else if (index === 2) fill = '#10b981';
                    else if (entry.simChampionshipPct >= 5) fill = '#8b5cf6';
                    else fill = '#475569';
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
