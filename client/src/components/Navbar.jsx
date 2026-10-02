import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { Trophy, Swords, Compass, Activity, Zap, MapPin } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Overview', icon: Activity, end: true },
  { to: '/championship', label: 'Odds Board', icon: Trophy },
  { to: '/matchup', label: 'Matchups', icon: Swords },
  { to: '/bracket', label: 'Bracket', icon: Compass },
  { to: '/simulator', label: 'What-If Engine', icon: Zap },
  { to: '/venues', label: 'Host Venues', icon: MapPin },
];

export function Navbar() {
  const { isCustom } = useSimulation?.() || {};

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#070a12]/85 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 text-decoration-none group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              CWC
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-white leading-none">
                CWC<span className="text-amber-400">'27</span> <span className="text-slate-400 font-medium">Predictor</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase mt-0.5">
                Monte Carlo Model
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon size={13} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right tournament context info */}
        <div className="flex items-center gap-3">
          {isCustom && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
              <Zap size={11} className="fill-amber-400" />
              <span>Custom Model Active</span>
            </span>
          )}

          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider">
              Oct 2 – Nov 21, 2027
            </div>
            <div className="text-[10px] text-slate-400">
              South Africa · Zimbabwe · Namibia
            </div>
          </div>
        </div>
      </div>

      {/* Tablet & Mobile Nav row */}
      <div className="lg:hidden border-t border-white/5 px-4 py-2 flex items-center justify-around overflow-x-auto gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 whitespace-nowrap ${
                isActive ? 'text-amber-400 font-bold bg-white/5' : 'text-slate-400 hover:text-white'
              }`
            }
          >
            <Icon size={12} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </header>
  );
}
