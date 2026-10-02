// Comprehensive Cricket Team Branding, Vector Emblems, Venue Database, and Tactical Ratings
import React from 'react';

export const TEAM_BRANDING = {
  IND: {
    name: 'India',
    shortName: 'IND',
    slug: 'india',
    primaryColor: '#0038A8',
    secondaryColor: '#FF671F',
    accentColor: '#046A38',
    gradient: 'linear-gradient(135deg, #00227B 0%, #0047BA 50%, #FF671F 100%)',
    bgTint: 'rgba(0, 56, 168, 0.12)',
    borderTint: 'rgba(0, 56, 168, 0.3)',
    flagCode: 'in',
    iccRank: 1,
    worldCupTitles: 2, // 1983, 2011
    captain: 'Rohit Sharma / Hardik Pandya',
    keyPlayer: 'Jasprit Bumrah (Pace / Death Overs)',
    homeConditions: 'Spin friendly, high batting aggregates',
    tactics: {
      battingDepth: 94,
      paceAttack: 92,
      spinQuality: 96,
      fielding: 88,
      deathOvers: 93,
      clutchIndex: 82,
    },
    pitchSynergy: {
      paceBouncy: 82,
      seamSwing: 84,
      flatDeck: 95,
      dryTurner: 98,
    },
  },
  AUS: {
    name: 'Australia',
    shortName: 'AUS',
    slug: 'australia',
    primaryColor: '#FFCD00',
    secondaryColor: '#006432',
    accentColor: '#E65100',
    gradient: 'linear-gradient(135deg, #004D26 0%, #006432 50%, #FFCD00 100%)',
    bgTint: 'rgba(255, 205, 0, 0.12)',
    borderTint: 'rgba(255, 205, 0, 0.3)',
    flagCode: 'au',
    iccRank: 2,
    worldCupTitles: 6, // 1987, 1999, 2003, 2007, 2015, 2023
    captain: 'Pat Cummins',
    keyPlayer: 'Travis Head (Explosive Opener)',
    homeConditions: 'Extra bounce, hard fast pitches, large boundaries',
    tactics: {
      battingDepth: 91,
      paceAttack: 97,
      spinQuality: 84,
      fielding: 95,
      deathOvers: 92,
      clutchIndex: 99,
    },
    pitchSynergy: {
      paceBouncy: 98,
      seamSwing: 92,
      flatDeck: 90,
      dryTurner: 78,
    },
  },
  SA: {
    name: 'South Africa',
    shortName: 'SA',
    slug: 'south-africa',
    primaryColor: '#007A4D',
    secondaryColor: '#FFB81C',
    accentColor: '#D32F2F',
    gradient: 'linear-gradient(135deg, #004D30 0%, #007A4D 60%, #FFB81C 100%)',
    bgTint: 'rgba(0, 122, 77, 0.14)',
    borderTint: 'rgba(0, 122, 77, 0.35)',
    flagCode: 'za',
    iccRank: 6,
    worldCupTitles: 0,
    captain: 'Temba Bavuma',
    keyPlayer: 'Kagiso Rabada (Strike Pace)',
    homeConditions: 'Co-hosts: High altitude Wanderers bounce, Newlands swing',
    tactics: {
      battingDepth: 88,
      paceAttack: 95,
      spinQuality: 82,
      fielding: 93,
      deathOvers: 89,
      clutchIndex: 74,
    },
    pitchSynergy: {
      paceBouncy: 96,
      seamSwing: 94,
      flatDeck: 88,
      dryTurner: 75,
    },
  },
  NZ: {
    name: 'New Zealand',
    shortName: 'NZ',
    slug: 'new-zealand',
    primaryColor: '#1A1D20',
    secondaryColor: '#00A3E0',
    accentColor: '#F5F5F7',
    gradient: 'linear-gradient(135deg, #0D0E11 0%, #1E232A 60%, #00A3E0 100%)',
    bgTint: 'rgba(0, 163, 224, 0.12)',
    borderTint: 'rgba(0, 163, 224, 0.3)',
    flagCode: 'nz',
    iccRank: 3,
    worldCupTitles: 0,
    captain: 'Kane Williamson / Mitchell Santner',
    keyPlayer: 'Rachin Ravindra (All-Round Anchor)',
    homeConditions: 'Late swing, drop-in surfaces, disciplined strategy',
    tactics: {
      battingDepth: 89,
      paceAttack: 90,
      spinQuality: 86,
      fielding: 96,
      deathOvers: 88,
      clutchIndex: 88,
    },
    pitchSynergy: {
      paceBouncy: 86,
      seamSwing: 96,
      flatDeck: 85,
      dryTurner: 80,
    },
  },
  PAK: {
    name: 'Pakistan',
    shortName: 'PAK',
    slug: 'pakistan',
    primaryColor: '#01411C',
    secondaryColor: '#00A859',
    accentColor: '#F5F5F7',
    gradient: 'linear-gradient(135deg, #012811 0%, #01411C 60%, #00A859 100%)',
    bgTint: 'rgba(0, 168, 89, 0.12)',
    borderTint: 'rgba(0, 168, 89, 0.3)',
    flagCode: 'pk',
    iccRank: 5,
    worldCupTitles: 1, // 1992
    captain: 'Babar Azam / Shaheen Afridi',
    keyPlayer: 'Shaheen Shah Afridi (Left-Arm Pace)',
    homeConditions: 'Reverse swing, variable bounce, extreme volatility',
    tactics: {
      battingDepth: 82,
      paceAttack: 94,
      spinQuality: 84,
      fielding: 77,
      deathOvers: 90,
      clutchIndex: 85,
    },
    pitchSynergy: {
      paceBouncy: 91,
      seamSwing: 90,
      flatDeck: 84,
      dryTurner: 88,
    },
  },
  ENG: {
    name: 'England',
    shortName: 'ENG',
    slug: 'england',
    primaryColor: '#0C2340',
    secondaryColor: '#C8102E',
    accentColor: '#1E90FF',
    gradient: 'linear-gradient(135deg, #081728 0%, #0C2340 60%, #C8102E 100%)',
    bgTint: 'rgba(200, 16, 46, 0.12)',
    borderTint: 'rgba(200, 16, 46, 0.3)',
    flagCode: 'gb-eng',
    iccRank: 4,
    worldCupTitles: 1, // 2019
    captain: 'Jos Buttler',
    keyPlayer: 'Harry Brook (Ultra-Aggressive Batting)',
    homeConditions: 'Seaming duke conditions, aggressive ultra-intent',
    tactics: {
      battingDepth: 93,
      paceAttack: 88,
      spinQuality: 83,
      fielding: 89,
      deathOvers: 86,
      clutchIndex: 84,
    },
    pitchSynergy: {
      paceBouncy: 87,
      seamSwing: 93,
      flatDeck: 94,
      dryTurner: 76,
    },
  },
  SL: {
    name: 'Sri Lanka',
    shortName: 'SL',
    slug: 'sri-lanka',
    primaryColor: '#003366',
    secondaryColor: '#FFB703',
    accentColor: '#990000',
    gradient: 'linear-gradient(135deg, #001E3D 0%, #003366 60%, #FFB703 100%)',
    bgTint: 'rgba(255, 183, 3, 0.12)',
    borderTint: 'rgba(255, 183, 3, 0.3)',
    flagCode: 'lk',
    iccRank: 7,
    worldCupTitles: 1, // 1996
    captain: 'Charith Asalanka',
    keyPlayer: 'Wanindu Hasaranga (Wrist Spin)',
    homeConditions: 'Turning tracks, slow outfields, mystery spin',
    tactics: {
      battingDepth: 80,
      paceAttack: 83,
      spinQuality: 92,
      fielding: 85,
      deathOvers: 84,
      clutchIndex: 80,
    },
    pitchSynergy: {
      paceBouncy: 75,
      seamSwing: 78,
      flatDeck: 82,
      dryTurner: 97,
    },
  },
  AFG: {
    name: 'Afghanistan',
    shortName: 'AFG',
    slug: 'afghanistan',
    primaryColor: '#002B7F',
    secondaryColor: '#D32011',
    accentColor: '#007A3D',
    gradient: 'linear-gradient(135deg, #001A4D 0%, #002B7F 60%, #D32011 100%)',
    bgTint: 'rgba(0, 43, 127, 0.14)',
    borderTint: 'rgba(0, 43, 127, 0.35)',
    flagCode: 'af',
    iccRank: 9,
    worldCupTitles: 0,
    captain: 'Hashmatullah Shahidi',
    keyPlayer: 'Rashid Khan (World #1 T20/ODI Leg-spinner)',
    homeConditions: 'Extreme spin choke, fearless power striking',
    tactics: {
      battingDepth: 76,
      paceAttack: 84,
      spinQuality: 97,
      fielding: 83,
      deathOvers: 87,
      clutchIndex: 83,
    },
    pitchSynergy: {
      paceBouncy: 74,
      seamSwing: 77,
      flatDeck: 80,
      dryTurner: 99,
    },
  },
  BAN: {
    name: 'Bangladesh',
    shortName: 'BAN',
    slug: 'bangladesh',
    primaryColor: '#006A4E',
    secondaryColor: '#F42A41',
    accentColor: '#FFB81C',
    gradient: 'linear-gradient(135deg, #003D2D 0%, #006A4E 60%, #F42A41 100%)',
    bgTint: 'rgba(0, 106, 78, 0.12)',
    borderTint: 'rgba(0, 106, 78, 0.3)',
    flagCode: 'bd',
    iccRank: 8,
    worldCupTitles: 0,
    captain: 'Najmul Hossain Shanto',
    keyPlayer: 'Taskin Ahmed (Pace spearhead)',
    homeConditions: 'Low slow turning pitches at Mirpur',
    tactics: {
      battingDepth: 78,
      paceAttack: 82,
      spinQuality: 88,
      fielding: 80,
      deathOvers: 81,
      clutchIndex: 73,
    },
    pitchSynergy: {
      paceBouncy: 72,
      seamSwing: 75,
      flatDeck: 80,
      dryTurner: 93,
    },
  },
  ZIM: {
    name: 'Zimbabwe',
    shortName: 'ZIM',
    slug: 'zimbabwe',
    primaryColor: '#D40000',
    secondaryColor: '#FFD200',
    accentColor: '#00853F',
    gradient: 'linear-gradient(135deg, #7A0000 0%, #D40000 60%, #FFD200 100%)',
    bgTint: 'rgba(212, 0, 0, 0.12)',
    borderTint: 'rgba(212, 0, 0, 0.3)',
    flagCode: 'zw',
    iccRank: 10,
    worldCupTitles: 0,
    captain: 'Craig Ervine',
    keyPlayer: 'Sikandar Raza (Spin All-rounder & Clutch Finisher)',
    homeConditions: 'Co-hosts: Harare altitude, vociferous home support',
    tactics: {
      battingDepth: 74,
      paceAttack: 79,
      spinQuality: 82,
      fielding: 82,
      deathOvers: 78,
      clutchIndex: 82,
    },
    pitchSynergy: {
      paceBouncy: 85,
      seamSwing: 81,
      flatDeck: 80,
      dryTurner: 85,
    },
  },
  NAM: {
    name: 'Namibia',
    shortName: 'NAM',
    slug: 'namibia',
    primaryColor: '#003580',
    secondaryColor: '#D21034',
    accentColor: '#FFCE00',
    gradient: 'linear-gradient(135deg, #001F4D 0%, #003580 60%, #D21034 100%)',
    bgTint: 'rgba(0, 53, 128, 0.12)',
    borderTint: 'rgba(0, 53, 128, 0.3)',
    flagCode: 'na',
    iccRank: 11,
    worldCupTitles: 0,
    captain: 'Gerhard Erasmus',
    keyPlayer: 'Gerhard Erasmus (Captain, Spin & Anchor Bat)',
    homeConditions: 'Co-hosts: Windhoek dry heat, thin air at 1,700m elevation',
    tactics: {
      battingDepth: 72,
      paceAttack: 78,
      spinQuality: 80,
      fielding: 86,
      deathOvers: 76,
      clutchIndex: 80,
    },
    pitchSynergy: {
      paceBouncy: 84,
      seamSwing: 78,
      flatDeck: 82,
      dryTurner: 84,
    },
  },
};

export const TOURNAMENT_VENUES = [
  {
    id: 'wanderers',
    name: 'Wanderers Stadium',
    city: 'Johannesburg',
    country: 'South Africa',
    flag: 'za',
    altitude: '1,725m (High Altitude)',
    character: 'Extreme Pace & Bounce',
    avgFirstInnings: 312,
    pitchType: 'paceBouncy',
    description: 'The iconic Bullring. Thin highveld air produces massive sixes; fast wicket rewards genuine pace and steep bounce.',
  },
  {
    id: 'newlands',
    name: 'Newlands Cricket Ground',
    city: 'Cape Town',
    country: 'South Africa',
    flag: 'za',
    altitude: '15m (Sea Level)',
    character: 'Heavy Swing & Seam',
    avgFirstInnings: 268,
    pitchType: 'seamSwing',
    description: 'Sitting under Table Mountain, the sea breeze brings generous new-ball lateral swing and seam movement.',
  },
  {
    id: 'centurion',
    name: 'SuperSport Park',
    city: 'Centurion',
    country: 'South Africa',
    flag: 'za',
    altitude: '1,450m',
    character: 'Hard Deck & True Carry',
    avgFirstInnings: 295,
    pitchType: 'paceBouncy',
    description: 'Consistent hard surface with true carry to the keeper. Outfield is lightning quick for strokeplay.',
  },
  {
    id: 'harare',
    name: 'Harare Sports Club',
    city: 'Harare',
    country: 'Zimbabwe',
    flag: 'zw',
    altitude: '1,490m',
    character: 'Balanced · Turns 2nd Innings',
    avgFirstInnings: 274,
    pitchType: 'dryTurner',
    description: 'Red African soil deck that starts true for batting before breaking up to provide sharp turn for finger spinners.',
  },
  {
    id: 'windhoek',
    name: 'Wanderers Cricket Ground',
    city: 'Windhoek',
    country: 'Namibia',
    flag: 'na',
    altitude: '1,700m (Desert Highveld)',
    character: 'Dry Deck & Fierce Heat',
    avgFirstInnings: 282,
    pitchType: 'flatDeck',
    description: 'Dry Namibian desert heat and high elevation create rapid ball speed off the bat with minimal swing.',
  },
];

// Custom vector shields for each team
export function TeamCrest({ shortName, size = 32, className = '' }) {
  const brand = TEAM_BRANDING[shortName] || {
    primaryColor: '#334155',
    secondaryColor: '#64748b',
    name: shortName,
  };

  const p = brand.primaryColor;
  const s = brand.secondaryColor;
  const a = brand.accentColor || '#ffffff';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title={brand.name}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }}
      >
        {/* Shield Outer Rim */}
        <path
          d="M50 4 C78 4, 92 18, 92 46 C92 76, 50 96, 50 96 C50 96, 8 76, 8 46 C8 18, 22 4, 50 4 Z"
          fill={p}
          stroke={s}
          strokeWidth="4"
        />

        {/* Dynamic crest motif per nation */}
        {shortName === 'IND' && (
          <g transform="translate(50, 48)">
            {/* Ashoka Wheel Chakra & 24 spokes motif */}
            <circle r="22" stroke={s} strokeWidth="3" fill="#00227B" />
            <circle r="6" fill="#FF671F" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1="0"
                y1="-22"
                x2="0"
                y2="22"
                stroke={s}
                strokeWidth="2"
                transform={`rotate(${angle})`}
              />
            ))}
            <path d="M-18 -26 L18 -26" stroke="#FF671F" strokeWidth="4" strokeLinecap="round" />
            <path d="M-18 26 L18 26" stroke="#046A38" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {shortName === 'AUS' && (
          <g transform="translate(50, 48)">
            {/* Southern Cross constellation + Gold star */}
            <circle cx="0" cy="0" r="24" fill="#004D26" />
            {/* 7-pointed Southern Cross Federation Star */}
            <path
              d="M0 -18 L4 -5 L18 -5 L8 3 L12 16 L0 8 L-12 16 L-8 3 L-18 -5 L-4 -5 Z"
              fill={p}
            />
            <circle cx="12" cy="-12" r="2.5" fill="#FFFFFF" />
            <circle cx="-13" cy="-4" r="2.5" fill="#FFFFFF" />
            <circle cx="11" cy="11" r="2.5" fill="#FFFFFF" />
            <circle cx="-2" cy="18" r="2.5" fill="#FFFFFF" />
          </g>
        )}

        {shortName === 'SA' && (
          <g transform="translate(50, 48)">
            {/* King Protea floral bloom */}
            <circle cx="0" cy="0" r="24" fill="#004D30" />
            <path
              d="M0 -16 C-8 -4, -14 6, -14 14 C-14 20, 14 20, 14 14 C14 6, 8 -4, 0 -16 Z"
              fill="#FFB81C"
            />
            <path
              d="M0 -20 C-4 -8, -6 2, -6 12 C-6 16, 6 16, 6 12 C6 2, 4 -8, 0 -20 Z"
              fill="#D32F2F"
            />
            <circle cx="0" cy="4" r="5" fill="#FFFFFF" />
          </g>
        )}

        {shortName === 'NZ' && (
          <g transform="translate(50, 48)">
            {/* Silver Fern Frond */}
            <circle cx="0" cy="0" r="24" fill="#0D0E11" />
            <path
              d="M-12 14 Q-4 4 12 -14"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path d="M-8 8 L-4 4 M-4 4 L0 0 M0 0 L4 -4 M4 -4 L8 -8" stroke="#00A3E0" strokeWidth="2.5" />
            <circle cx="9" cy="-15" r="2.5" fill="#FFFFFF" />
          </g>
        )}

        {shortName === 'ENG' && (
          <g transform="translate(50, 48)">
            {/* Three Lions motif */}
            <circle cx="0" cy="0" r="24" fill="#0C2340" />
            <path d="M-12 -10 Q0 -14 12 -10 Q14 -6 10 -4 Q2 -8 -8 -4 Z" fill="#C8102E" />
            <path d="M-12 0 Q0 -4 12 0 Q14 4 10 6 Q2 2 -8 6 Z" fill="#C8102E" />
            <path d="M-12 10 Q0 6 12 10 Q14 14 10 16 Q2 12 -8 16 Z" fill="#C8102E" />
            <circle cx="-1" cy="-1" r="2" fill="#FFD700" />
          </g>
        )}

        {shortName === 'PAK' && (
          <g transform="translate(50, 48)">
            {/* Star and Crescent */}
            <circle cx="0" cy="0" r="24" fill="#012811" />
            <path
              d="M8 -14 A16 16 0 1 0 8 16 A13 13 0 1 1 8 -14 Z"
              fill="#FFFFFF"
            />
            <path
              d="M10 -2 L12 3 L17 4 L13 8 L14 13 L9 10 L5 13 L6 8 L2 4 L7 3 Z"
              fill="#00A859"
            />
          </g>
        )}

        {shortName === 'SL' && (
          <g transform="translate(50, 48)">
            {/* Heraldic Golden Lion */}
            <circle cx="0" cy="0" r="24" fill="#001E3D" />
            <path
              d="M-8 6 C-12 -2, -6 -12, 4 -12 C10 -12, 14 -6, 12 2 C10 8, 2 12, -4 12 Z"
              fill="#FFB703"
            />
            <line x1="8" y1="-14" x2="16" y2="-2" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="-2" cy="-4" r="2" fill="#990000" />
          </g>
        )}

        {shortName === 'AFG' && (
          <g transform="translate(50, 48)">
            {/* Mosque dome and wheat wreath */}
            <circle cx="0" cy="0" r="24" fill="#001A4D" />
            <path d="M0 -14 C-8 -4, -10 6, -10 14 L10 14 C10 6, 8 -4, 0 -14 Z" fill="#D32011" />
            <path d="M0 -18 L0 -10 M-5 -10 L5 -10" stroke="#FFCE00" strokeWidth="2" />
            <circle cx="0" cy="6" r="3" fill="#007A3D" />
          </g>
        )}

        {shortName === 'BAN' && (
          <g transform="translate(50, 48)">
            {/* Red Sun on Green Field */}
            <circle cx="0" cy="0" r="24" fill="#003D2D" />
            <circle cx="0" cy="0" r="14" fill="#F42A41" />
            <path d="M-6 -6 L-2 0 L-6 6 M6 -6 L2 0 L6 6" stroke="#FFB81C" strokeWidth="2" />
          </g>
        )}

        {shortName === 'ZIM' && (
          <g transform="translate(50, 48)">
            {/* Zimbabwe Great Bird silhouette */}
            <circle cx="0" cy="0" r="24" fill="#7A0000" />
            <path
              d="M-4 -14 C-2 -18, 6 -16, 8 -10 C10 -4, 4 4, 6 12 L-4 12 C-8 6, -8 -8, -4 -14 Z"
              fill="#FFD200"
            />
            <polygon points="-8,-6 -14,2 -8,6" fill="#00853F" />
          </g>
        )}

        {shortName === 'NAM' && (
          <g transform="translate(50, 48)">
            {/* Desert Sun burst */}
            <circle cx="0" cy="0" r="24" fill="#001F4D" />
            <circle cx="0" cy="0" r="10" fill="#FFCE00" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => (
              <line
                key={i}
                x1="0"
                y1="-16"
                x2="0"
                y2="-10"
                stroke="#FFCE00"
                strokeWidth="2.5"
                transform={`rotate(${ang})`}
              />
            ))}
            <line x1="-18" y1="14" x2="18" y2="-14" stroke="#D21034" strokeWidth="3" />
          </g>
        )}

        {/* Fallback for other teams / qualifiers */}
        {!['IND', 'AUS', 'SA', 'NZ', 'ENG', 'PAK', 'SL', 'AFG', 'BAN', 'ZIM', 'NAM'].includes(shortName) && (
          <text
            x="50"
            y="56"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="26"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            {shortName.slice(0, 3)}
          </text>
        )}

        {/* Shield Highlights */}
        <path
          d="M20 18 Q50 10 80 18"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
