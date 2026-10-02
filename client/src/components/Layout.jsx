import React from 'react';
import { Navbar } from './Navbar';
import { Link } from 'react-router-dom';
import { Trophy, Shield, Activity, Compass, MapPin } from 'lucide-react';

export function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-16">
        {children}
      </main>

      <footer className="border-t border-white/10 bg-[#05070d] py-8 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>ICC Men's Cricket World Cup 2027 Analytics</span>
              </div>
              <p className="text-slate-400 text-xs max-w-md">
                Independent predictive analytics model powered by Cricsheet ball-by-ball history, dynamic Elo
                ratings, and 50,000 Monte Carlo tournament simulations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <Link to="/" className="hover:text-amber-400 transition-colors">Overview</Link>
              <Link to="/championship" className="hover:text-amber-400 transition-colors">Championship Board</Link>
              <Link to="/matchup" className="hover:text-amber-400 transition-colors">Matchup Simulator</Link>
              <Link to="/bracket" className="hover:text-amber-400 transition-colors">Tournament Bracket</Link>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-amber-400" />
              <span>Host Venues: Wanderers (Johannesburg) · Newlands (Cape Town) · Centurion · Harare · Windhoek</span>
            </div>
            <div>
              Co-hosted by South Africa, Zimbabwe & Namibia · Oct 2 – Nov 21, 2027
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
