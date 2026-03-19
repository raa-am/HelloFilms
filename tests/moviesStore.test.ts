import { describe, it, expect } from 'vitest'
import type { Movie } from '~/types/tmdb'

// Logique pure du store extraite pour les tests (sans dépendances Nuxt)
function createMoviesState() {
  const movies: Movie[] = []
  let query = ''
  let page = 2
  let totalPages = 1

  const hasMore = () => page <= totalPages

  function init(initialMovies: Movie[], total: number) {
    movies.splice(0, movies.length, ...initialMovies)
    totalPages = total
    page = 2
  }

  function setQuery(value: string) {
    query = value
    page = 1
    movies.splice(0, movies.length)
  }

  function incrementPage() {
    page += 1
  }

  function resetMovies() {
    movies.splice(0, movies.length)
    page = 2
    totalPages = 1
    query = ''
  }

  return { movies, getQuery: () => query, getPage: () => page, hasMore, init, setQuery, incrementPage, resetMovies }
}

const mockMovie = (id: number): Movie => ({
  id,
  title: `Film ${id}`,
  overview: '',
  poster_path: null,
  backdrop_path: null,
  release_date: '2024-01-01',
  vote_average: 7,
  vote_count: 100,
  genre_ids: []
})

describe('movies store - logique', () => {
  it('init charge les films et reset la page à 2', () => {
    const state = createMoviesState()
    state.init([mockMovie(1), mockMovie(2)], 5)
    expect(state.movies).toHaveLength(2)
    expect(state.getPage()).toBe(2)
  })

  it('hasMore retourne true si des pages restent', () => {
    const state = createMoviesState()
    state.init([mockMovie(1)], 3)
    expect(state.hasMore()).toBe(true)
  })

  it('hasMore retourne false quand toutes les pages sont chargées', () => {
    const state = createMoviesState()
    state.init([mockMovie(1)], 1)
    expect(state.hasMore()).toBe(false)
  })

  it('setQuery vide la liste et reset la page', () => {
    const state = createMoviesState()
    state.init([mockMovie(1), mockMovie(2)], 3)
    state.setQuery('batman')
    expect(state.movies).toHaveLength(0)
    expect(state.getQuery()).toBe('batman')
    expect(state.getPage()).toBe(1)
  })

  it('incrementPage augmente correctement la page', () => {
    const state = createMoviesState()
    state.init([mockMovie(1)], 5)
    state.incrementPage()
    expect(state.getPage()).toBe(3)
  })

  it('resetMovies vide tout l\'état', () => {
    const state = createMoviesState()
    state.init([mockMovie(1), mockMovie(2)], 5)
    state.setQuery('test')
    state.resetMovies()
    expect(state.movies).toHaveLength(0)
    expect(state.getQuery()).toBe('')
    expect(state.getPage()).toBe(2)
  })
})
