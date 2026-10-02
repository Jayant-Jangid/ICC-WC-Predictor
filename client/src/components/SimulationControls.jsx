import React, { useState } from 'react';
import { useSimulation, SIM_PRESETS } from '../context/SimulationContext';
import { Sliders, RotateCcw, Zap, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export function SimulationControls({ className = '' }) {
  const {
    params,
    setParams,
    activePreset,
    applyPreset,
    isSimulating,
    executeSimulation,
    resetToBaseline,
    isCustom,
    simRunCount,
  } = useSimulation();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`glass-panel rounded-xl p-4 sm:p-5 border border-white/10 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Preset Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 shrink-0 mr-1">
            <Zap size={14} className="fill-amber-400" />
            <span>Model Scenarios:</span>
          </div>
          {SIM_PRESETS.map((p) => {
            const isActive = activePreset === p.id && !isCustom;
            return (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                disabled={isSimulating}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/10'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
                title={p.desc}
              >
                {p.id === 'savanna' && <span>🇿🇦</span>}
                {p.id === 'chaos' && <span>⚡</span>}
                {p.id === 'spin' && <span>🌀</span>}
                {p.id === 'baseline' && <span>📊</span>}
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-auto">
          {isCustom && (
            <button
              onClick={resetToBaseline}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset to official 50,000 run baseline"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isExpanded
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Sliders size={13} />
            <span>Fine-Tune Weights</span>
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          <button
            onClick={() => executeSimulation(params, 20000)}
            disabled={isSimulating}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles size={13} className={isSimulating ? 'animate-spin' : ''} />
            <span>{isSimulating ? 'Simulating 20,000 cups...' : 'Run Simulation'}</span>
          </button>
        </div>
      </div>

      {/* Expanded Custom Parameters Slider Drawer */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in duration-200">
          {/* Host Advantage Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">African Host Advantage (SA/ZIM/NAM)</span>
              <span className="mono text-amber-400 font-bold">+{params.hostAdvantage} Elo</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              step="5"
              value={params.hostAdvantage}
              onChange={(e) => {
                const newParams = { ...params, hostAdvantage: Number(e.target.value) };
                setParams(newParams);
                executeSimulation(newParams, 15000);
              }}
            />
            <p className="text-[11px] text-slate-400">Boost for home crowd and highveld pitch familiarity.</p>
          </div>

          {/* Knockout Volatility / Chaos Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Knockout Upset Volatility</span>
              <span className="mono text-amber-400 font-bold">{params.knockoutChaos}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.6"
              step="0.05"
              value={params.knockoutChaos}
              onChange={(e) => {
                const newParams = { ...params, knockoutChaos: Number(e.target.value) };
                setParams(newParams);
                executeSimulation(newParams, 15000);
              }}
            />
            <p className="text-[11px] text-slate-400">Flattens favorite win rates in semi-finals and finals.</p>
          </div>

          {/* Subcontinent Spin Factor */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Pitch Dryness & Spin Bias</span>
              <span className="mono text-amber-400 font-bold">
                {params.spinBias > 0 ? `+${(params.spinBias * 100).toFixed(0)}%` : `${(params.spinBias * 100).toFixed(0)}%`}
              </span>
            </div>
            <input
              type="range"
              min="-0.4"
              max="0.8"
              step="0.1"
              value={params.spinBias}
              onChange={(e) => {
                const newParams = { ...params, spinBias: Number(e.target.value) };
                setParams(newParams);
                executeSimulation(newParams, 15000);
              }}
            />
            <p className="text-[11px] text-slate-400">Favors spin-heavy attacks (IND, AFG, SL, PAK).</p>
          </div>
        </div>
      )}

      {/* Model Active State Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {isCustom ? (
              <span className="text-amber-300 font-medium">
                Custom simulation active · {simRunCount.toLocaleString()} Monte Carlo runs
              </span>
            ) : (
              <span>Baseline model · 50,000 Monte Carlo runs</span>
            )}
          </span>
        </div>
        <div className="text-slate-500">
          Tournament Format: 14 Teams · Group Stage → Super 7 → Semis → Final
        </div>
      </div>
    </div>
  );
}
