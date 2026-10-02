import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPct(val) {
  if (val === null || val === undefined) return 'N/A';
  return `${Number(val).toFixed(1)}%`;
}

export function getEloBadge(elo) {
  if (elo >= 1700) return { label: 'Elite', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
  if (elo >= 1650) return { label: 'Strong Contender', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
  if (elo >= 1550) return { label: 'Competitive', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
  if (elo >= 1450) return { label: 'Mid-Tier', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
  return { label: 'Underdog', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30' };
}

export const TEAM_COLORS = {
  IND: { primary: '#1e40af', accent: '#f97316', text: 'India' },
  AUS: { primary: '#ca8a04', accent: '#15803d', text: 'Australia' },
  NZ:  { primary: '#0f172a', accent: '#94a3b8', text: 'New Zealand' },
  ENG: { primary: '#dc2626', accent: '#2563eb', text: 'England' },
  PAK: { primary: '#15803d', accent: '#84cc16', text: 'Pakistan' },
  SA:  { primary: '#047857', accent: '#eab308', text: 'South Africa' },
  SL:  { primary: '#1d4ed8', accent: '#facc15', text: 'Sri Lanka' },
  BAN: { primary: '#065f46', accent: '#dc2626', text: 'Bangladesh' },
  AFG: { primary: '#2563eb', accent: '#ef4444', text: 'Afghanistan' },
  ZIM: { primary: '#b91c1c', accent: '#eab308', text: 'Zimbabwe' },
  NAM: { primary: '#0369a1', accent: '#dc2626', text: 'Namibia' },
};
