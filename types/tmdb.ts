// TMDB API types

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

// Movie as returned in list/search endpoints
export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  genre_ids: number[]
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  original_language: string
  original_title: string
}

// Full movie detail (movie/{id} endpoint)
export interface MovieDetail {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  genres: Genre[]
  vote_average: number
  vote_count: number
  runtime: number | null
  status: string
  tagline: string
  popularity: number
  production_companies: ProductionCompany[]
  original_language: string
  original_title: string
  budget: number
  revenue: number
}

// Credits endpoint
export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
  known_for_department: string
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
  known_for_department: string
}

export interface Credits {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}

// Paginated list response
export interface PaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}
