import { defineStore } from 'pinia'
import type { Movie, PaginatedResponse } from '~/types/tmdb'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export const useMoviesStore = defineStore('movies', () => {
  const config = useRuntimeConfig()

  const movies = ref<Movie[]>([])
  const query = ref('')
  // La page démarre à 2 car la page 1 est chargée côté serveur via useFetch dans index.vue
  const page = ref(2)
  const totalPages = ref(1)
  const pending = ref(false)
  const error = ref<string | null>(null)

  const hasMore = computed(() => page.value <= totalPages.value)

  // Appelé depuis index.vue après le fetch SSR pour hydrater le store côté client
  function init(initialMovies: Movie[], total: number) {
    movies.value = initialMovies
    totalPages.value = total
    page.value = 2
  }

  async function fetchMovies(reset = false) {
    if (pending.value) return
    if (!reset && !hasMore.value) return

    pending.value = true
    error.value = null

    try {
      const currentPage = reset ? 1 : page.value
      // Bascule automatiquement vers l'endpoint de recherche si une query est active
      const endpoint = query.value.trim()
        ? `${TMDB_BASE_URL}/search/movie`
        : `${TMDB_BASE_URL}/movie/popular`

      const params = new URLSearchParams({
        language: 'fr-FR',
        page: String(currentPage),
        ...(query.value.trim() ? { query: query.value.trim() } : {})
      })

      const data = await $fetch<PaginatedResponse<Movie>>(`${endpoint}?${params}`, {
        headers: {
          Authorization: `Bearer ${config.public.tmdbAccessToken}`,
          accept: 'application/json'
        }
      })

      if (reset) {
        // On écrase la liste lors d'une nouvelle recherche ou d'un changement de query
        movies.value = data.results
        page.value = 2
      } else {
        movies.value.push(...data.results)
        page.value = currentPage + 1
      }

      totalPages.value = data.total_pages
    } catch (err) {
      error.value = 'Impossible de charger les films.'
      console.error(err)
    } finally {
      pending.value = false
    }
  }

  function setQuery(value: string) {
    query.value = value
    // Reset systématique à chaque nouvelle recherche pour repartir de la page 1
    fetchMovies(true)
  }

  function loadMore() {
    fetchMovies(false)
  }

  return {
    movies,
    query,
    page,
    totalPages,
    pending,
    error,
    hasMore,
    init,
    fetchMovies,
    setQuery,
    loadMore
  }
})
