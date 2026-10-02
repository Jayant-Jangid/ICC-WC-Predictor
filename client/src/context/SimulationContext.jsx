import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useTeams } from '../hooks/useData';
import { runLiveSimulation } from '../lib/simulationEngine';

const SimulationContext = createContext(null);

export const SIM_PRESETS = [
  {
    id: 'baseline',
    label: 'Standard Baseline',
    desc: 'Pure dynamic Elo rating and historical ODI baseline model',
    params: { hostAdvantage: 35, formWeight: 0.3, knockoutChaos: 1.0, spinBias: 0 },
  },
  {
    id: 'savanna',
    label: 'African Savanna Fortress',
    desc: 'Heavy home altitude & bounce advantage for SA, Zimbabwe & Namibia (+90 Elo)',
    params: { hostAdvantage: 90, formWeight: 0.4, knockoutChaos: 1.1, spinBias: -0.2 },
  },
  {
    id: 'chaos',
    label: 'Knockout Chaos & Upsets',
    desc: 'High-variance knockout match volatility — underdogs strike back',
    params: { hostAdvantage: 40, formWeight: 0.5, knockoutChaos: 1.4, spinBias: 0.2 },
  },
  {
    id: 'spin',
    label: 'Subcontinent Spin Choke',
    desc: 'Drier, abrasive African surfaces that reward mystery and wrist spinners',
    params: { hostAdvantage: 20, formWeight: 0.3, knockoutChaos: 1.05, spinBias: 0.6 },
  },
];

export function SimulationProvider({ children }) {
  const { data: rawTeams, isLoading } = useTeams();
  const [params, setParams] = useState(SIM_PRESETS[0].params);
  const [activePreset, setActivePreset] = useState('baseline');
  const [isSimulating, setIsSimulating] = useState(false);
  const [customSimResult, setCustomSimResult] = useState(null);
  const [simRunCount, setSimRunCount] = useState(50000);

  // Teams list with fallback/baseline
  const baselineTeams = useMemo(() => {
    if (!rawTeams) return [];
    return rawTeams.map(t => ({
      ...t,
      simChampionshipPct: Number(t.championshipPct ?? 0),
      simSemifinalPct: Number(t.semifinalPct ?? 0),
      simGroupAdvancePct: Number(t.groupAdvancePct ?? 0),
      diff: 0,
      effectiveElo: t.eloRating,
    }));
  }, [rawTeams]);

  // Execute simulation
  const executeSimulation = (customParams = params, nSims = 15000) => {
    if (!rawTeams || rawTeams.length === 0) return;
    setIsSimulating(true);

    // Give UI microtask to show loader
    setTimeout(() => {
      const results = runLiveSimulation(rawTeams, customParams, nSims);
      setCustomSimResult(results);
      setSimRunCount(nSims);
      setIsSimulating(false);
    }, 40);
  };

  const applyPreset = (presetId) => {
    const preset = SIM_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setActivePreset(presetId);
    setParams(preset.params);
    if (presetId === 'baseline') {
      setCustomSimResult(null);
      setSimRunCount(50000);
    } else {
      executeSimulation(preset.params, 20000);
    }
  };

  const resetToBaseline = () => {
    setActivePreset('baseline');
    setParams(SIM_PRESETS[0].params);
    setCustomSimResult(null);
    setSimRunCount(50000);
  };

  const activeTeams = customSimResult || baselineTeams;

  return (
    <SimulationContext.Provider
      value={{
        params,
        setParams,
        activePreset,
        applyPreset,
        isSimulating,
        executeSimulation,
        resetToBaseline,
        activeTeams,
        baselineTeams,
        isCustom: Boolean(customSimResult),
        simRunCount,
        isLoading,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
