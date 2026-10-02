import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBracket, useTeams } from '../hooks/useData';
import { TeamCrest, TEAM_BRANDING } from '../lib/teamBranding';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Compass,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Shield,
  ArrowRight,
  Flame,
  Share2,
  Check,
} from 'lucide-react';

export default function Bracket() {
  const { data: bracketData } = useBracket();
  const { data: teams } = useTeams();

  // User bracket state
  const [semi1Winner, setSemi1Winner] = useState('Australia');
  const [semi2Winner, setSemi2Winner] = useState('New Zealand');
  const [champion, setChampion] = useState('Australia');
  const [isSimulatingKnockouts, setIsSimulatingKnockouts] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('pick=')) {
      try {
        const val = hash.split('pick=')[1];
        const parsed = JSON.parse(atob(decodeURIComponent(val)));
        if (parsed.s1) setSemi1Winner(parsed.s1);
        if (parsed.s2) setSemi2Winner(parsed.s2);
        if (parsed.c) setChampion(parsed.c);
      } catch (e) {
        console.warn('Failed to parse shareable bracket state', e);
      }
    }
  }, []);

  const shareBracket = () => {
    try {
      const payload = { s1: semi1Winner, s2: semi2Winner, c: champion };
      const encoded = encodeURIComponent(btoa(JSON.stringify(payload)));
      const url = `${window.location.origin}${window.location.pathname}#pick=${encoded}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // Group A & Group B default lists
  const groupA = bracketData?.groupPredictions?.A || [
    { name: 'Australia', shortName: 'AUS', eloRating: 1763 },
    { name: 'South Africa', shortName: 'SA', eloRating: 1692 },
    { name: 'India', shortName: 'IND', eloRating: 1686 },
    { name: 'Pakistan', shortName: 'PAK', eloRating: 1658 },
    { name: 'Bangladesh', shortName: 'BAN', eloRating: 1465 },
    { name: 'Qualifier 1', shortName: 'Q1', eloRating: 1380 },
    { name: 'Qualifier 2', shortName: 'Q2', eloRating: 1350 },
  ];

  const groupB = bracketData?.groupPredictions?.B || [
    { name: 'New Zealand', shortName: 'NZ', eloRating: 1690 },
    { name: 'England', shortName: 'ENG', eloRating: 1602 },
    { name: 'Sri Lanka', shortName: 'SL', eloRating: 1580 },
    { name: 'Afghanistan', shortName: 'AFG', eloRating: 1510 },
    { name: 'Namibia', shortName: 'NAM', eloRating: 1360 },
    { name: 'Zimbabwe', shortName: 'ZIM', eloRating: 1354 },
    { name: 'Qualifier 3', shortName: 'Q3', eloRating: 1340 },
  ];

  // Super 7 qualified teams (top 3 from each + 1 qualifier)
  const super7Teams = [
    groupA[0],
    groupB[0],
    groupA[1],
    groupB[1],
    groupA[2],
    groupB[2],
    { name: 'Namibia (Host Q)', shortName: 'NAM', eloRating: 1360 },
  ].sort((a, b) => (b.eloRating || 0) - (a.eloRating || 0));

  // Top 4 from Super 7 go to Semis
  const semi1 = { teamA: super7Teams[0], teamB: super7Teams[3] }; // 1 vs 4
  const semi2 = { teamA: super7Teams[1], teamB: super7Teams[2] }; // 2 vs 3

  // Quick simulate knockouts based on Elo
  const simulateKnockouts = () => {
    setIsSimulatingKnockouts(true);
    setTimeout(() => {
      const p1 = 1 / (1 + Math.pow(10, ((semi1.teamB.eloRating || 1500) - (semi1.teamA.eloRating || 1500)) / 400));
      const w1 = Math.random() < p1 ? semi1.teamA.name : semi1.teamB.name;

      const p2 = 1 / (1 + Math.pow(10, ((semi2.teamB.eloRating || 1500) - (semi2.teamA.eloRating || 1500)) / 400));
      const w2 = Math.random() < p2 ? semi2.teamA.name : semi2.teamB.name;

      const eloW1 = teams?.find((t) => t.name === w1)?.eloRating || 1650;
      const eloW2 = teams?.find((t) => t.name === w2)?.eloRating || 1650;
      const pChamp = 1 / (1 + Math.pow(10, (eloW2 - eloW1) / 400));
      const champ = Math.random() < pChamp ? w1 : w2;

      setSemi1Winner(w1);
      setSemi2Winner(w2);
      setChampion(champ);
      setIsSimulatingKnockouts(false);
    }, 250);
  };

  const resetBracket = () => {
    setSemi1Winner(semi1.teamA.name);
    setSemi2Winner(semi2.teamA.name);
    setChampion(semi1.teamA.name);
  };

  const champTeam = teams?.find((t) => t.name === champion) || {
    shortName: 'AUS',
    name: champion,
  };
  const champBrand = TEAM_BRANDING[champTeam.shortName] || {};

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <Compass size={14} />
          <span>Interactive Tournament Pathway & Stages</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          2027 Tournament Bracket & Pathway
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Explore the official 4-stage architecture of the 2027 World Cup in South Africa, Zimbabwe, and Namibia.
          Click any knockout contender to advance them or simulate alternative tournament outcomes.
        </p>
      </div>

      {/* Stage 04 Knockout Tree Spotlight (Interactive) */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
              Stage 04 · Knockout Phase
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-0.5">Interactive Bracket Tree</h2>
            <p className="text-xs text-slate-400 mt-1">
              Click a nation to advance them to the Grand Final, or crown them World Champions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={shareBracket}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
              <span>{copied ? 'Link Copied!' : 'Share Bracket'}</span>
            </button>
            <button
              onClick={resetBracket}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
            <button
              onClick={simulateKnockouts}
              disabled={isSimulatingKnockouts}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={13} className={isSimulatingKnockouts ? 'animate-spin' : ''} />
              <span>Simulate Knockouts</span>
            </button>
          </div>
        </div>

        {/* Visual Bracket Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Semi-Final 1 */}
          <div className="space-y-4">
            <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>Semi-Final 1</span>
              <span>·</span>
              <span className="text-slate-500">Cape Town · Nov 17</span>
            </div>

            <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5">
              {[semi1.teamA, semi1.teamB].map((t) => {
                const isSelected = semi1Winner === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => {
                      setSemi1Winner(t.name);
                      if (champion !== t.name && champion !== semi2Winner) {
                        setChampion(t.name);
                      }
                    }}
                    className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/60 shadow-md shadow-amber-500/10'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <TeamCrest shortName={t.shortName} size={28} />
                      <div>
                        <div className="text-sm font-bold text-white">{t.name}</div>
                        <div className="text-[10px] text-slate-400 mono">Elo {t.eloRating}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-amber-400 text-xs font-bold uppercase flex items-center gap-1">
                        <span>Advance</span>
                        <ChevronRight size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grand Final Center Stage & Trophy */}
          <div className="space-y-4 text-center">
            <div className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
              Grand Final · Wanderers, Johannesburg · Nov 21
            </div>

            <motion.div
              layout
              className="bg-gradient-to-b from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/40 rounded-2xl p-6 space-y-4 shadow-xl shadow-amber-500/5"
            >
              <div className="flex justify-center">
                <div className="relative">
                  <TeamCrest shortName={champTeam.shortName} size={72} />
                  <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-amber-400 text-slate-950 font-bold shadow-md">
                    <Trophy size={16} />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-widest block">
                  Projected World Champion
                </span>
                <h3 className="text-2xl font-black text-white mt-1">{champion}</h3>
                <p className="text-xs text-slate-300 mt-1">
                  {champBrand.worldCupTitles}x Champions · ICC Rank #{champBrand.iccRank || 1}
                </p>
              </div>

              {/* Finalist Pickers */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Pick Final Winner:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setChampion(semi1Winner)}
                    className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      champion === semi1Winner
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {semi1Winner}
                  </button>
                  <button
                    onClick={() => setChampion(semi2Winner)}
                    className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      champion === semi2Winner
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {semi2Winner}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Semi-Final 2 */}
          <div className="space-y-4">
            <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 md:justify-end">
              <span>Semi-Final 2</span>
              <span>·</span>
              <span className="text-slate-500">Centurion · Nov 18</span>
            </div>

            <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5">
              {[semi2.teamA, semi2.teamB].map((t) => {
                const isSelected = semi2Winner === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => {
                      setSemi2Winner(t.name);
                      if (champion !== t.name && champion !== semi1Winner) {
                        setChampion(t.name);
                      }
                    }}
                    className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/60 shadow-md shadow-amber-500/10'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <TeamCrest shortName={t.shortName} size={28} />
                      <div>
                        <div className="text-sm font-bold text-white">{t.name}</div>
                        <div className="text-[10px] text-slate-400 mono">Elo {t.eloRating}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-amber-400 text-xs font-bold uppercase flex items-center gap-1">
                        <span>Advance</span>
                        <ChevronRight size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stage 03 Super 7 Stage */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest block">
              Stage 03 · Super 7 Stage
            </span>
            <h2 className="text-xl font-extrabold text-white mt-0.5">Top 6 Qualifying Teams + Play-In Berth</h2>
          </div>
          <div className="text-xs text-slate-400">Oct 25 – Nov 12, 2027 · Top 4 advance to Semis</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {super7Teams.map((t, idx) => {
            const isSemiQualifier = idx < 4;
            return (
              <div
                key={t.name}
                className={`p-3.5 rounded-xl border text-center space-y-2 ${
                  isSemiQualifier
                    ? 'bg-purple-500/10 border-purple-500/30'
                    : 'bg-white/5 border-white/5 opacity-75'
                }`}
              >
                <div className="flex justify-center">
                  <TeamCrest shortName={t.shortName} size={32} />
                </div>
                <div className="font-bold text-xs text-white truncate">{t.name}</div>
                <div className="mono text-[10px] text-slate-400">Elo {t.eloRating || 1360}</div>
                <div
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    isSemiQualifier ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {isSemiQualifier ? `Seed #${idx + 1}` : 'Eliminated'}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stage 02: Group Stage A & B */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block">
            Stage 02 · 14-Nation Group Phase
          </span>
          <h2 className="text-xl font-extrabold text-white mt-0.5">Group Stage Seedings & Standings</h2>
          <p className="text-xs text-slate-400">
            Full round-robin in each pool. Top 3 from Group A and Group B punch their ticket to Super 7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Group A */}
          <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
            <div className="p-4 bg-black/40 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <h3 className="font-bold text-white text-sm">Pool A · High-Octane Group</h3>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Top 3 Advance</span>
            </div>

            <div className="divide-y divide-white/5">
              {groupA.map((team, idx) => {
                const advances = idx < 3;
                return (
                  <div
                    key={team.name}
                    className={`p-3.5 flex items-center justify-between transition-colors ${
                      advances ? 'bg-emerald-500/[0.03]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="mono text-xs font-bold text-slate-400 w-4 text-center">{idx + 1}</span>
                      <TeamCrest shortName={team.shortName} size={24} />
                      <div>
                        <div className="text-xs font-bold text-white">{team.name}</div>
                        <div className="mono text-[10px] text-slate-400">{team.shortName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="mono text-xs text-slate-300 font-semibold">
                        {team.eloRating ? `Elo ${team.eloRating}` : 'Qualifier'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          advances ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {advances ? 'Super 7' : 'Group Exit'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group B */}
          <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
            <div className="p-4 bg-black/40 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <h3 className="font-bold text-white text-sm">Pool B · Host Nation Group</h3>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Top 3 Advance</span>
            </div>

            <div className="divide-y divide-white/5">
              {groupB.map((team, idx) => {
                const advances = idx < 3;
                return (
                  <div
                    key={team.name}
                    className={`p-3.5 flex items-center justify-between transition-colors ${
                      advances ? 'bg-emerald-500/[0.03]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="mono text-xs font-bold text-slate-400 w-4 text-center">{idx + 1}</span>
                      <TeamCrest shortName={team.shortName} size={24} />
                      <div>
                        <div className="text-xs font-bold text-white">{team.name}</div>
                        <div className="mono text-[10px] text-slate-400">{team.shortName}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="mono text-xs text-slate-300 font-semibold">
                        {team.eloRating ? `Elo ${team.eloRating}` : 'Qualifier'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          advances ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {advances ? 'Super 7' : 'Group Exit'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stage 01 Super Series */}
      <section className="glass-panel rounded-xl p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
            Stage 01 · Play-In Tournament
          </span>
          <h4 className="text-base font-bold text-white mt-0.5">Super Series in Windhoek, Namibia</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Played in early October 2027 in Namibia immediately before the main group phase. Decides the final
            remaining berth in the 14-team group stage.
          </p>
        </div>
        <div className="mono text-xs font-bold text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shrink-0">
          Namibia · Oct 2, 2027
        </div>
      </section>
    </div>
  );
}
