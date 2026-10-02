import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTeamDetail, useTeamEloHistory, useTeams } from '../hooks/useData';
import { TeamCrest, TEAM_BRANDING } from '../lib/teamBranding';
import { getEloBadge } from '../lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Trophy,
  ArrowLeft,
  Calendar,
  Swords,
  TrendingUp,
  Shield,
  Activity,
  Flame,
  CheckCircle2,
  XCircle,
  Award,
  Users,
} from 'lucide-react';

export default function TeamProfile() {
  const { slug } = useParams();
  const { data: team, isLoading: teamLoading } = useTeamDetail(slug);
  const { data: allTeams } = useTeams();
  const teamOverview = allTeams?.find((t) => t.slug === slug);

  const shortName = team?.shortName || teamOverview?.shortName;
  const brand = TEAM_BRANDING[shortName] || { name: team?.name || slug, tactics: {} };
  const { data: eloHistory, isLoading: eloLoading } = useTeamEloHistory(shortName);

  if (teamLoading && !teamOverview) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        <span className="inline-block w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mr-2" />
        Loading national squad dossier...
      </div>
    );
  }

  const elo = team?.eloRating ?? teamOverview?.eloRating ?? 1500;
  const badge = getEloBadge(elo);
  const champPct = team?.championshipPct ?? teamOverview?.championshipPct ?? 0;
  const semiPct = team?.semifinalPct ?? teamOverview?.semifinalPct ?? 0;
  const groupAdvPct = team?.groupAdvancePct ?? teamOverview?.groupAdvancePct ?? 0;

  // Chart data formatting
  const chartData = (eloHistory || []).map((pt, i) => ({
    match: i + 1,
    date: pt.date ? pt.date.slice(0, 7) : `M${i + 1}`,
    elo: pt.elo ?? pt.eloRating ?? elo,
  }));

  const tactics = brand.tactics || {
    battingDepth: 85,
    paceAttack: 85,
    spinQuality: 85,
    fielding: 85,
    deathOvers: 85,
    clutchIndex: 80,
  };

  const pitchSynergy = brand.pitchSynergy || {
    paceBouncy: 85,
    seamSwing: 85,
    flatDeck: 85,
    dryTurner: 85,
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <Link
        to="/championship"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Championship Board</span>
      </Link>

      {/* Hero Header Banner */}
      <div className="relative glass-panel rounded-2xl overflow-hidden border border-white/10 p-6 sm:p-8">
        {/* Kit color top stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-2"
          style={{ background: brand.gradient || brand.primaryColor || '#d4a843' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          <div className="flex items-center gap-5">
            <TeamCrest shortName={shortName} size={72} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {shortName}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                  {badge.label}
                </span>
                <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                  <Award size={13} />
                  <span>ICC ODI Rank #{brand.iccRank || team?.iccRanking}</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
                {team?.name || teamOverview?.name}
              </h1>

              <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-3">
                <span>{brand.worldCupTitles}x World Cup Champions</span>
                <span>·</span>
                <span>Captain: <strong className="text-white">{brand.captain || 'Squad'}</strong></span>
                <span>·</span>
                <span>Key Anchor: <strong className="text-amber-400">{brand.keyPlayer || 'Core'}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Matchup Button */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Link
              to={`/matchup?teamA=${shortName}&teamB=${shortName === 'IND' ? 'AUS' : 'IND'}`}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
            >
              <Swords size={13} />
              <span>Simulate Matchup</span>
            </Link>
          </div>
        </div>

        {/* 4 Core Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10 mt-6">
          <div className="bg-[#0b101d] p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Current Dynamic Elo
            </span>
            <div className="text-2xl font-black text-white mono mt-1">{elo}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{badge.label} tier</div>
          </div>

          <div className="bg-[#0b101d] p-4">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              Championship Win
            </span>
            <div className="text-2xl font-black text-amber-400 mono mt-1">
              {Number(champPct).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">50,000 simulations</div>
          </div>

          <div className="bg-[#0b101d] p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Semi-Finals Probability
            </span>
            <div className="text-2xl font-black text-white mono mt-1">
              {Number(semiPct).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Top 4 qualification</div>
          </div>

          <div className="bg-[#0b101d] p-4">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Group Advance
            </span>
            <div className="text-2xl font-black text-emerald-400 mono mt-1">
              {groupAdvPct ? `${Number(groupAdvPct).toFixed(1)}%` : '—'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Top 3 into Super 7</div>
          </div>
        </div>
      </div>

      {/* Tactical Profile & Pitch Synergy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tactical Strengths Breakdown */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Shield size={14} />
            <span>Tactical Squad Ratings</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Tactical Attributes</h3>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Batting Depth & Power', val: tactics.battingDepth, color: 'bg-blue-500' },
              { label: 'Express Pace Battery', val: tactics.paceAttack, color: 'bg-amber-500' },
              { label: 'Spin & Mystery Choke', val: tactics.spinQuality, color: 'bg-emerald-500' },
              { label: 'Fielding & Ground Coverage', val: tactics.fielding, color: 'bg-purple-500' },
              { label: 'Death Overs Execution', val: tactics.deathOvers, color: 'bg-rose-500' },
              { label: 'ICC Knockout Clutch Index', val: tactics.clutchIndex, color: 'bg-amber-400' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{stat.label}</span>
                  <span className="mono font-bold text-white">{stat.val}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stat.color} transition-all duration-500`}
                    style={{ width: `${stat.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pitch Surface Synergy */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Flame size={14} />
            <span>South Africa & Zimbabwe Conditions</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Pitch Surface Synergy</h3>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Wanderers Pace Deck</span>
              <div className="text-xl font-bold text-white mono">{pitchSynergy.paceBouncy}%</div>
              <span className="text-[11px] text-slate-400 block">High altitude bounce response</span>
            </div>

            <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Newlands Sea Swing</span>
              <div className="text-xl font-bold text-white mono">{pitchSynergy.seamSwing}%</div>
              <span className="text-[11px] text-slate-400 block">Duke-style lateral movement</span>
            </div>

            <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Centurion Batting Track</span>
              <div className="text-xl font-bold text-white mono">{pitchSynergy.flatDeck}%</div>
              <span className="text-[11px] text-slate-400 block">High-scoring power hitting</span>
            </div>

            <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Harare Dry Turner</span>
              <div className="text-xl font-bold text-white mono">{pitchSynergy.dryTurner}%</div>
              <span className="text-[11px] text-slate-400 block">Slow abrasive red clay track</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400 border-t border-white/5">
            <span className="font-semibold text-slate-300">Home Condition Character:</span>{' '}
            {brand.homeConditions}
          </div>
        </div>
      </div>

      {/* Elo Rating History Chart */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Activity size={14} />
              <span>Historical Rating Trajectory</span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-0.5">Elo Progression Over Recent ODIs</h3>
          </div>
          <div className="mono text-xs text-slate-400">Current Rating: {elo}</div>
        </div>

        <div className="h-64 w-full pt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="eloGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  domain={['dataMin - 30', 'dataMax + 30']}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#0b101e] border border-white/20 p-2.5 rounded-lg text-xs space-y-0.5 shadow-xl">
                          <div className="text-slate-400">{d.date}</div>
                          <div className="text-white font-bold mono">Elo: {d.elo}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="elo"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#eloGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              No historical Elo datapoints available for this squad.
            </div>
          )}
        </div>
      </div>

      {/* Recent Match Form Dossier */}
      {team?.recentForm && team.recentForm.length > 0 && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <div className="p-5 bg-black/40 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-amber-400" />
              <h3 className="font-bold text-white text-base">Recent ODI Form & Results</h3>
            </div>
            <div className="text-xs text-slate-400">Last {team.recentForm.length} competitive matches</div>
          </div>

          <div className="divide-y divide-white/5">
            {team.recentForm.map((match, i) => {
              const isWin = match.result === 'W';
              return (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        isWin ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      }`}
                    >
                      {match.result}
                    </span>

                    <div className="flex items-center gap-2">
                      <TeamCrest shortName={match.opponentShort} size={24} />
                      <div>
                        <div className="text-xs font-bold text-white">vs {match.opponent}</div>
                        <div className="text-[11px] text-slate-400 mono">{match.date}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="mono text-xs font-semibold text-slate-300 block">{match.margin}</span>
                    <span className={`text-[10px] font-bold uppercase ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isWin ? 'Victory' : 'Defeat'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Player Squad & Individual Performance Dossier */}
      {team?.players && team.players.length > 0 && (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 space-y-0">
          <div className="p-5 bg-black/40 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-amber-400" />
              <h3 className="font-bold text-white text-base">Key Players & Squad Statistics</h3>
            </div>
            <div className="text-xs text-slate-400">
              {team.players.length} Key Players Profiled · Live Ongoing Series Monitoring
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/10 text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">Matches</th>
                  <th className="py-3 px-4 text-right">Batting Avg</th>
                  <th className="py-3 px-4 text-right">Strike Rate</th>
                  <th className="py-3 px-4 text-right">Bowling Avg</th>
                  <th className="py-3 px-4">Status / Recent Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {team.players.map((p, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">{p.name}</td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">{p.role}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400">{p.matches ?? '—'}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400">
                      {p.batting_avg ? Number(p.batting_avg).toFixed(1) : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-400">
                      {p.strike_rate ? Number(p.strike_rate).toFixed(1) : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-blue-400">
                      {p.bowling_avg ? Number(p.bowling_avg).toFixed(1) : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="inline-block px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[11px] text-slate-300 font-medium">
                        {p.status || 'Active Core'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
