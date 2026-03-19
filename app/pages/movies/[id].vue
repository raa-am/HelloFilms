<script setup lang="ts">
const route = useRoute()
const movieId = route.params.id as string
const { movie, topCast, directors, pending, error } = useMovieDetail(movieId)
const { comments, add } = useComments(movieId)

// w500 suffit pour l'affiche, on garde l'original pour le backdrop pleine largeur
const posterUrl = computed(() =>
  movie.value?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`
    : null
)

const backdropUrl = computed(() =>
  movie.value?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.value.backdrop_path}`
    : null
)

useSeoMeta({
  title: () => movie.value ? `${movie.value.title} — HelloFilms` : 'HelloFilms',
  description: () => movie.value?.overview ?? ''
})
</script>

<template>
  <div>
    <div
      v-if="backdropUrl"
      class="h-64 md:h-96 w-full bg-cover bg-center relative"
      :style="{ backgroundImage: `url(${backdropUrl})` }"
    >
      <div class="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
    </div>
    <USkeleton
      v-else-if="pending"
      class="h-64 md:h-96 w-full"
    />

    <UContainer class="py-8">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-1 text-sm text-muted hover:text-default mb-6"
      >
        <UIcon
          name="i-lucide-arrow-left"
          class="size-4"
        />
        Retour
      </NuxtLink>

      <div
        v-if="error"
        class="text-center py-12 text-red-500"
      >
        {{ error }}
      </div>

      <div
        v-else-if="pending"
        class="flex gap-8"
      >
        <USkeleton class="w-48 shrink-0 aspect-[2/3] rounded-xl" />
        <div class="flex-1 space-y-4 pt-2">
          <USkeleton class="h-8 w-2/3 rounded" />
          <USkeleton class="h-4 w-1/3 rounded" />
          <USkeleton class="h-24 w-full rounded" />
        </div>
      </div>

      <div
        v-else-if="movie"
        class="flex flex-col md:flex-row gap-8"
      >
        <div class="shrink-0">
          <img
            v-if="posterUrl"
            :src="posterUrl"
            :alt="movie.title"
            class="w-48 rounded-xl shadow-lg mx-auto md:mx-0"
          >
          <div
            v-else
            class="w-48 aspect-[2/3] rounded-xl bg-elevated flex items-center justify-center"
          >
            <UIcon
              name="i-lucide-film"
              class="size-12 text-muted"
            />
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <h1 class="text-3xl font-bold">
            {{ movie.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted">
            <span>{{ movie.release_date?.slice(0, 4) }}</span>
            <span v-if="movie.runtime">{{ movie.runtime }} min</span>
            <div class="flex items-center gap-1">
              <UIcon
                name="i-lucide-star"
                class="size-4 text-yellow-400"
              />
              <span class="font-semibold text-default">{{ movie.vote_average.toFixed(1) }}</span>
              <span>({{ movie.vote_count.toLocaleString('fr-FR') }} votes)</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mt-3">
            <UBadge
              v-for="genre in movie.genres"
              :key="genre.id"
              variant="subtle"
              color="primary"
            >
              {{ genre.name }}
            </UBadge>
          </div>

          <p
            v-if="movie.tagline"
            class="mt-4 italic text-muted text-sm"
          >
            « {{ movie.tagline }} »
          </p>

          <p class="mt-4 leading-relaxed text-sm">
            {{ movie.overview || 'Aucun synopsis disponible.' }}
          </p>

          <div
            v-if="directors.length"
            class="mt-4 text-sm"
          >
            <span class="text-muted">Réalisation — </span>
            <span class="font-medium">{{ directors.map(d => d.name).join(', ') }}</span>
          </div>

          <div
            v-if="topCast.length"
            class="mt-6"
          >
            <h2 class="font-semibold mb-3">
              Têtes d'affiche
            </h2>
            <div class="flex gap-3 overflow-x-auto pb-2 p-1">
              <div
                v-for="actor in topCast"
                :key="actor.id"
                class="shrink-0 w-20 text-center"
              >
                <div class="w-20 h-20 rounded-full overflow-hidden bg-elevated mx-auto mb-1 transition-transform duration-300 hover:scale-110">
                  <img
                    v-if="actor.profile_path"
                    :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
                    :alt="actor.name"
                    class="w-full h-full object-cover"
                  >
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center"
                  >
                    <UIcon
                      name="i-lucide-user"
                      class="size-8 text-muted"
                    />
                  </div>
                </div>
                <p class="text-xs font-medium leading-tight line-clamp-2">
                  {{ actor.name }}
                </p>
                <p class="text-xs text-muted leading-tight line-clamp-1 mt-0.5">
                  {{ actor.character }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template v-if="movie">
        <USeparator class="my-10" />
        <h2 class="text-xl font-semibold mb-6">
          Commentaires
        </h2>
        <div class="flex flex-col lg:flex-row gap-8 items-start">
          <!-- Formulaire sticky à gauche -->
          <div class="w-full lg:flex-1 lg:sticky lg:top-20">
            <CommentForm @submit="add" />
          </div>
          <!-- Liste des commentaires à droite -->
          <div class="w-full lg:flex-1 min-w-0">
            <CommentList :comments="comments" />
          </div>
        </div>
      </template>
    </UContainer>
  </div>
</template>
