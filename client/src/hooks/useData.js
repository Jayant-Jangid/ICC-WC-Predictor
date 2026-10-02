import { useQuery } from '@tanstack/react-query';

const fetchJson = async (path) => {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
};

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => fetchJson('/data/teams.json'),
  });
}

export function useChampionshipOdds() {
  return useQuery({
    queryKey: ['championship-odds'],
    queryFn: () => fetchJson('/data/championship_odds.json'),
  });
}

export function useMatchups() {
  return useQuery({
    queryKey: ['matchups'],
    queryFn: () => fetchJson('/data/matchups.json'),
  });
}

export function useBracket() {
  return useQuery({
    queryKey: ['bracket'],
    queryFn: () => fetchJson('/data/bracket.json'),
  });
}

export function useEloHistory() {
  return useQuery({
    queryKey: ['elo-history'],
    queryFn: () => fetchJson('/data/elo_history.json'),
  });
}

export function useTeamEloHistory(shortName) {
  const { data, ...rest } = useEloHistory();
  return {
    data: data && shortName ? (data[shortName] ?? []) : [],
    ...rest,
  };
}

export function useTeamDetail(slug) {
  return useQuery({
    queryKey: ['team', slug],
    queryFn: () => fetchJson(`/data/teams/${slug}.json`),
    enabled: Boolean(slug),
  });
}
