import type { MovieDetail, Credits, CrewMember } from '~/types/tmdb'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export function useMovieDetail(movieId: number | string) {
  const config = useRuntimeConfig()

  const headers = {
    Authorization: `Bearer ${config.public.tmdbAccessToken}`,
    accept: 'application/json'
  }

  // Les deux appels se font en parallèle — Nuxt les résout simultanément
  const { data: movie, status: movieStatus, error: movieError } = useFetch<MovieDetail>(
    `${TMDB_BASE_URL}/movie/${movieId}`,
    { headers, query: { language: 'fr-FR' } }
  )

  const { data: credits } = useFetch<Credits>(
    `${TMDB_BASE_URL}/movie/${movieId}/credits`,
    { headers, query: { language: 'fr-FR' } }
  )

  const pending = computed(() => movieStatus.value === 'pending')
  const error = computed(() => movieError.value ? 'Impossible de charger les informations du film.' : null)

  // On limite à 10 acteurs pour ne pas surcharger l'affichage
  const topCast = computed(() => credits.value?.cast.slice(0, 10) ?? [])

  const directors = computed<CrewMember[]>(() =>
    credits.value?.crew.filter(m => m.job === 'Director') ?? []
  )

  return { movie, credits, topCast, directors, pending, error }
}
