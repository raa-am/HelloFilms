<script setup lang="ts">
import { useMoviesStore } from '~/stores/movies'
import type { PaginatedResponse, Movie } from '~/types/tmdb'

useSeoMeta({
  title: 'HelloFilms — Films du moment',
  description: 'Découvrez et explorez les meilleurs films du moment.'
})

const config = useRuntimeConfig()

const { data: initialData } = await useFetch<PaginatedResponse<Movie>>(
  'https://api.themoviedb.org/3/movie/popular',
  {
    headers: {
      Authorization: `Bearer ${config.public.tmdbAccessToken}`,
      accept: 'application/json'
    },
    query: { language: 'fr-FR', page: 1 }
  }
)

const store = useMoviesStore()

if (initialData.value) {
  store.init(initialData.value.results, initialData.value.total_pages)
}

const sentinel = ref<HTMLElement | null>(null)

useIntersectionObserver(sentinel, ([entry]) => {
  if (entry.isIntersecting && !store.pending && store.hasMore) {
    store.loadMore()
  }
})

function onSearch(value: string) {
  store.setQuery(value)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
      <h1 class="text-3xl font-bold flex-1">
        Films du moment
      </h1>
      <UInput
        :model-value="store.query"
        icon="i-lucide-search"
        placeholder="Rechercher un film..."
        class="w-full sm:w-72"
        @update:model-value="onSearch"
      />
    </div>

    <div v-if="store.error" class="text-center py-12 text-red-500">
      {{ store.error }}
    </div>

    <template v-else>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <MovieCard
          v-for="movie in store.movies"
          :key="movie.id"
          :movie="movie"
        />
        <template v-if="store.pending">
          <MovieCardSkeleton v-for="n in 10" :key="`sk-${n}`" />
        </template>
      </div>

      <div v-if="!store.pending && store.movies.length === 0" class="text-center py-12 text-muted">
        Aucun film trouvé.
      </div>

      <div ref="sentinel" class="h-4 mt-8" />
    </template>
  </div>
</template>
