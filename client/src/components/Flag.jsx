// Map short names to ISO 3166-1 alpha-2 codes for flagcdn.com
const FLAG_CODES = {
  IND: 'in', AUS: 'au', ENG: 'gb-eng', PAK: 'pk', SA: 'za',
  NZ: 'nz', SL: 'lk', BAN: 'bd', AFG: 'af', ZIM: 'zw',
  NAM: 'na', WI: 'bb', IRE: 'ie', SCO: 'gb-sct',
  UAE: 'ae', NETH: 'nl', USA: 'us', OMA: 'om', NEP: 'np',
};

export function Flag({ code, size = 20 }) {
  const iso = FLAG_CODES[code];
  if (!iso) return <span style={{ fontSize: size * 0.8 }}>🏳</span>;
  return (
    <img
      src={`https://flagcdn.com/w40/${iso}.webp`}
      alt={code}
      style={{
        width: size,
        height: Math.round(size * 0.667),
        objectFit: 'cover',
        borderRadius: 2,
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
      }}
      loading="lazy"
    />
  );
}
