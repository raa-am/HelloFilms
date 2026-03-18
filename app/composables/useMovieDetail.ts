import type { MovieDetail, Credits, CrewMember } from '~/types/tmdb'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export function useMovieDetail(movieId: number | string) {
  const config = useRuntimeConfig()

  const movie = ref<MovieDetail | null>(null)
  const credits = ref<Credits | null>(null)
  const pending = ref(false)
  const error = ref<string | null>(null)

  const headers = {
    Authorization: `Bearer ${config.public.tmdbAccessToken}`,
    accept: 'application/json'
  }

  const params = new URLSearchParams({ language: 'fr-FR' })

  async function fetchDetail() {
    pending.value = true
    error.value = null

    try {
      // Fetch movie detail and credits in parallel
      const [movieData, creditsData] = await Promise.all([
        $fetch<MovieDetail>(`${TMDB_BASE_URL}/movie/${movieId}?${params}`, { headers }),
        $fetch<Credits>(`${TMDB_BASE_URL}/movie/${movieId}/credits?${params}`, { headers })
      ])

      movie.value = movieData
      credits.value = creditsData
    } catch (err) {
      error.value = 'Impossible de charger les informations du film.'
      console.error(err)
    } finally {
      pending.value = false
    }
  }

  // Top billed cast (first 10)
  const topCast = computed(() =>
    credits.value?.cast.slice(0, 10) ?? []
  )

  // Director(s) from crew
  const directors = computed<CrewMember[]>(() =>
    credits.value?.crew.filter(member => member.job === 'Director') ?? []
  )

  return {
    movie,
    credits,
    topCast,
    directors,
    pending,
    error,
    fetchDetail
  }
}
