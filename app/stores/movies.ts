import { defineStore } from 'pinia'
import type { Movie, PaginatedResponse } from '~/types/tmdb'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export const useMoviesStore = defineStore('movies', () => {
  const config = useRuntimeConfig()

  const movies = ref<Movie[]>([])
  const query = ref('')
  const page = ref(1)
  const totalPages = ref(1)
  const pending = ref(false)
  const error = ref<string | null>(null)

  const headers = {
    Authorization: `Bearer ${config.public.tmdbAccessToken}`,
    accept: 'application/json'
  }

  const hasMore = computed(() => page.value <= totalPages.value)

  async function fetchMovies(reset = false) {
    if (pending.value) return
    if (!reset && !hasMore.value) return

    pending.value = true
    error.value = null

    try {
      const currentPage = reset ? 1 : page.value
      const endpoint = query.value.trim()
        ? `${TMDB_BASE_URL}/search/movie`
        : `${TMDB_BASE_URL}/movie/popular`

      const params = new URLSearchParams({
        language: 'fr-FR',
        page: String(currentPage),
        ...(query.value.trim() ? { query: query.value.trim() } : {})
      })

      const data = await $fetch<PaginatedResponse<Movie>>(
        `${endpoint}?${params}`,
        { headers }
      )

      if (reset) {
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
    fetchMovies,
    setQuery,
    loadMore
  }
})
