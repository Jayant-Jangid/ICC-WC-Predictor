import { motion } from 'framer-motion';

export function WinProbabilityBar({ teamA, teamB }) {
  if (!teamA || !teamB) return null;

  const pctA = Number(teamA.winPct ?? 50);
  const pctB = Number(teamB.winPct ?? 50);
  const isAFavored = pctA >= pctB;
  const diff = Math.abs(teamA.eloRating - teamB.eloRating);

  return (
    <div style={{ width: '100%' }}>
      {/* Team labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{
            fontSize: 15,
            fontWeight: isAFavored ? 700 : 400,
            color: isAFavored ? '#fff' : 'var(--text-secondary)',
            letterSpacing: '-0.02em',
          }}>
            {teamA.name}
          </span>
          <span className="mono" style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6', letterSpacing: '-0.03em' }}>
            {pctA.toFixed(1)}%
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <span style={{
            fontSize: 15,
            fontWeight: !isAFavored ? 700 : 400,
            color: !isAFavored ? '#fff' : 'var(--text-secondary)',
            letterSpacing: '-0.02em',
          }}>
            {teamB.name}
          </span>
          <span className="mono" style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b', letterSpacing: '-0.03em' }}>
            {pctB.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Track */}
      <div className="prob-track">
        <motion.div
          className="prob-fill-a"
          initial={{ width: 0 }}
          animate={{ width: `${pctA}%` }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        />
        <motion.div
          className="prob-fill-b"
          initial={{ width: 0 }}
          animate={{ width: `${pctB}%` }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Elo context */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Elo {teamA.eloRating}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Δ {diff} pts rating gap
        </span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Elo {teamB.eloRating}
        </span>
      </div>
    </div>
  );
}
