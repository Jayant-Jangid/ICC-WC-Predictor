import { useState, useTransition } from 'react';
import { useTeams, useChampionshipOdds } from '../hooks/useData';
import { runBrowserSimulation } from '../lib/simulator';
import { Sliders, Zap, RefreshCw, Trophy, Flame, ChevronRight, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Link } from 'react-router-dom';

export default function Simulator() {
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: oddsData } = useChampionshipOdds();

  const [isPending, startTransition] = useTransition();
  const [eloModifiers, setEloModifiers] = useState({});
  const [tossAdvantage, setTossAdvantage] = useState(0);
  const [iterations, setIterations] = useState(10000);
  const [results, setResults] = useState(null);
  const [computeTime, setComputeTime] = useState(null);

  const baseOddsMap = Object.fromEntries(
    (oddsData?.odds ?? []).map(o => [o.name, o.championshipPct])
  );

  const handleModifierChange = (teamName, val) => {
    setEloModifiers(prev => ({
      ...prev,
      [teamName]: Number(val),
    }));
  };

  const applyPreset = (presetType) => {
    if (presetType === 'reset') {
      setEloModifiers({});
      setTossAdvantage(0);
      setResults(null);
      setComputeTime(null);
      return;
    }

    if (presetType === 'host') {
      setEloModifiers({
        'South Africa': 45,
        'Zimbabwe': 40,
        'Namibia': 35,
      });
    } else if (presetType === 'subcontinent') {
      setEloModifiers({
        'India': 40,
        'Pakistan': 35,
        'Sri Lanka': 30,
        'Afghanistan': 30,
      });
    } else if (presetType === 'upset') {
      setEloModifiers({
        'Australia': -70,
        'India': -60,
        'New Zealand': 40,
        'South Africa': 50,
      });
    }
  };

  const handleRunSimulation = () => {
    if (!teams || teams.length === 0) return;

    startTransition(() => {
      const t0 = performance.now();
      const output = runBrowserSimulation({
        baseTeams: teams,
        eloModifiers,
        tossAdvantage,
        iterations,
      });
      const t1 = performance.now();

      setResults(output);
      setComputeTime(Math.round(t1 - t0));
    });
  };

  const activeResults = results ?? teams?.map(t => ({
    name: t.name,
    shortName: t.shortName,
    slug: t.slug,
    baseElo: t.eloRating,
    adjustedElo: t.eloRating + (eloModifiers[t.name] ?? 0),
    championshipPct: t.championshipPct,
    semifinalPct: t.semifinalPct,
    super7Pct: t.groupAdvancePct,
  })) ?? [];

  const chartData = activeResults.slice(0, 8).map(t => ({
    name: t.shortName,
    fullName: t.name,
    pct: t.championshipPct,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4 text-amber-400" />
            Client-Side Monte Carlo Engine
          </div>
          <h1 className="text-3xl font-black text-white">Custom "What-If" Scenario Simulator</h1>
          <p className="text-sm text-slate-400 mt-1">
            Execute up to 25,000 full tournament simulations directly on your device. Zero server calls.
          </p>
        </div>

        {computeTime !== null && (
          <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-emerald-300">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Simulated {iterations.toLocaleString()} runs in <strong>{computeTime} ms</strong> on your CPU</span>
          </div>
        )}
      </div>

      {/* Preset Scenarios */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Presets</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => applyPreset('host')}
            className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all"
          >
            <div className="text-xs font-bold text-amber-400">Host Surge</div>
            <div className="text-[11px] text-slate-400 mt-0.5">RSA, ZIM, NAM +40 Elo</div>
          </button>
          <button
            onClick={() => applyPreset('subcontinent')}
            className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all"
          >
            <div className="text-xs font-bold text-emerald-400">Spin Dominance</div>
            <div className="text-[11px] text-slate-400 mt-0.5">IND, PAK, SL, AFG +35 Elo</div>
          </button>
          <button
            onClick={() => applyPreset('upset')}
            className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all"
          >
            <div className="text-xs font-bold text-rose-400">Favorite Injuries</div>
            <div className="text-[11px] text-slate-400 mt-0.5">AUS & IND -60 Elo</div>
          </button>
          <button
            onClick={() => applyPreset('reset')}
            className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 text-left transition-all flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-bold text-slate-300">Reset All</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Default ratings</div>
            </div>
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Simulation Controls & Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Team Modifiers */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Team Strength Modifiers (Elo Points)
            </h2>
            <span className="text-xs text-slate-400">Range: -100 to +100</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 max-h-[380px] overflow-y-auto pr-2">
            {teams?.map((team) => {
              const currentMod = eloModifiers[team.name] ?? 0;
              return (
                <div key={team.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{team.name}</span>
                    <span className={`font-mono font-bold ${currentMod > 0 ? 'text-emerald-400' : currentMod < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                      {currentMod > 0 ? `+${currentMod}` : currentMod} pts ({team.eloRating + currentMod})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="5"
                    value={currentMod}
                    onChange={(e) => handleModifierChange(team.name, e.target.value)}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">Simulation Depth:</span>
              <div className="flex gap-1.5">
                {[5000, 10000, 25000].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => setIterations(cnt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      iterations === cnt
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {cnt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isPending}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              {isPending ? 'Simulating...' : 'Run Simulation'}
            </button>
          </div>
        </div>

        {/* Right Column: Visual Summary */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Live Forecast Chart
              </h3>
              <span className="text-xs text-slate-400">Top 8</span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl shadow-xl text-xs space-y-0.5">
                            <p className="font-bold text-white">{d.fullName}</p>
                            <p className="text-amber-400">Win Chance: <strong>{d.pct}%</strong></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="pct" radius={[4, 4, 0, 0]} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300">How it works:</span>
            <p>
              Your modifiers immediately shift the Elo distribution. The simulation simulates every group match, the Super 7 stage, and knockouts across {iterations.toLocaleString()} runs.
            </p>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Scenario Probability Board</h2>
          {results && (
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Custom Scenario Active
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4"># Rank</th>
                <th className="py-3 px-4">Nation</th>
                <th className="py-3 px-4">Simulated Elo</th>
                <th className="py-3 px-4 text-amber-400">Championship Win %</th>
                <th className="py-3 px-4">Change vs Base</th>
                <th className="py-3 px-4">Reach Semis %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {activeResults.map((team, idx) => {
                const basePct = baseOddsMap[team.name] ?? team.championshipPct;
                const diff = team.championshipPct - basePct;
                return (
                  <tr key={team.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-500">#{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      <Link to={`/teams/${team.slug}`} className="hover:text-amber-400 transition-colors">
                        {team.name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300 font-semibold">
                      {team.adjustedElo}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-base text-amber-400">
                      {team.championshipPct}%
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold">
                      {diff > 0.05 ? (
                        <span className="text-emerald-400 flex items-center gap-0.5">
                          <TrendingUp className="w-3.5 h-3.5" /> +{diff.toFixed(1)}%
                        </span>
                      ) : diff < -0.05 ? (
                        <span className="text-rose-400 flex items-center gap-0.5">
                          <TrendingDown className="w-3.5 h-3.5" /> {diff.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-slate-500">0.0%</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {team.semifinalPct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
