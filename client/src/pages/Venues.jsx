import { MapPin, Wind, Thermometer, Trophy, Shield, ArrowUpRight } from 'lucide-react';

const VENUES = [
  {
    name: 'Wanderers Stadium',
    city: 'Johannesburg, South Africa',
    role: 'The Grand Final (Nov 21, 2027)',
    altitude: '1,753 m (High Altitude)',
    avgScore: '315 runs',
    tossImpact: 'Bat 2nd (58% Win)',
    paceVsSpin: '72% Pace / 28% Spin',
    pitchCondition: 'Thin air promotes extraordinary carry, high six-hitting frequency, and true, fiery bounce for fast bowlers.',
    badge: 'Final Venue',
    badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
  },
  {
    name: 'Newlands Cricket Ground',
    city: 'Cape Town, South Africa',
    role: 'Semifinal 1 (Nov 17, 2027)',
    altitude: '15 m (Coastal)',
    avgScore: '272 runs',
    tossImpact: 'Bat 1st (54% Win)',
    paceVsSpin: '65% Pace / 35% Spin',
    pitchCondition: 'Overhead cloud cover off Table Mountain gives early seam and swing, transitioning into reliable spin on days 4 & 5.',
    badge: 'Semifinal 1',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  },
  {
    name: 'SuperSport Park',
    city: 'Centurion / Tshwane, South Africa',
    role: 'Semifinal 2 (Nov 18, 2027)',
    altitude: '1,440 m (High Altitude)',
    avgScore: '298 runs',
    tossImpact: 'Bat 2nd (56% Win)',
    paceVsSpin: '78% Pace / 22% Spin',
    pitchCondition: 'One of the fastest decks in world cricket. Relentless bounce and pace favor tearaway quicks and aggressive back-foot stroke play.',
    badge: 'Semifinal 2',
    badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
  },
  {
    name: 'Kingsmead Stadium',
    city: 'Durban, South Africa',
    role: 'Super 7 Key Fixtures',
    altitude: '10 m (Coastal Sub-tropical)',
    avgScore: '265 runs',
    tossImpact: 'Bowl 1st (62% Win under lights)',
    paceVsSpin: '75% Pace / 25% Spin',
    pitchCondition: 'Moist coastal sea breeze aids significant morning and twilight swing. Challenging conditions for top-order batters.',
    badge: 'Super 7',
    badgeColor: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
  },
  {
    name: 'Harare Sports Club',
    city: 'Harare, Zimbabwe',
    role: 'Host Group Phase & Super 7',
    altitude: '1,490 m',
    avgScore: '280 runs',
    tossImpact: 'Bat 1st (52% Win)',
    paceVsSpin: '58% Pace / 42% Spin',
    pitchCondition: 'Balanced surface with consistent bounce. Spinners find grip through the middle overs under dry afternoon sunshine.',
    badge: 'Group & Super 7',
    badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-400',
  },
  {
    name: 'Wanderers Cricket Ground',
    city: 'Windhoek, Namibia',
    role: 'Stage 1 Super Series (Oct 2, 2027)',
    altitude: '1,650 m',
    avgScore: '270 runs',
    tossImpact: 'Bat 1st (51% Win)',
    paceVsSpin: '62% Pace / 38% Spin',
    pitchCondition: 'Semi-arid desert climate produces firm clay pitches, rapid outfield speeds, and pronounced seam movement in morning sessions.',
    badge: 'Stage 1 Qualifier',
    badgeColor: 'border-teal-500/40 bg-teal-500/10 text-teal-400',
  },
];

export default function Venues() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <MapPin className="w-4 h-4 text-amber-400" />
          Tactical Intelligence
        </div>
        <h1 className="text-3xl font-black text-white">Host Stadiums & Pitch Profiles</h1>
        <p className="text-sm text-slate-400 mt-1">
          Detailed tactical profiles across the 12 tournament venues in South Africa, Zimbabwe, and Namibia
        </p>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VENUES.map((venue) => (
          <div
            key={venue.name}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5 transition-all hover:scale-[1.01]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${venue.badgeColor}`}>
                  {venue.badge}
                </span>
                <span className="text-xs font-semibold text-slate-400">{venue.altitude}</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{venue.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {venue.city}
                </p>
              </div>

              <div className="text-xs font-semibold text-amber-400">{venue.role}</div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {venue.pitchCondition}
              </p>
            </div>

            {/* Tactical Metrics Bar */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Avg 1st Innings:</span>
                <strong className="text-white font-mono">{venue.avgScore}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Toss Trend:</span>
                <strong className="text-amber-400">{venue.tossImpact}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Wickets Distribution:</span>
                <strong className="text-emerald-400">{venue.paceVsSpin}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
