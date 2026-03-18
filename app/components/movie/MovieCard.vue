<script setup lang="ts">
import type { Movie } from '~/types/tmdb'

const props = defineProps<{
  movie: Movie
}>()

const imageUrl = computed(() =>
  props.movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
    : null
)

const year = computed(() =>
  props.movie.release_date ? props.movie.release_date.slice(0, 4) : ''
)
</script>

<template>
  <NuxtLink
    :to="`/movies/${movie.id}`"
    class="group block"
  >
    <div class="rounded-xl overflow-hidden bg-elevated transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
      <div class="aspect-[2/3] bg-accented">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="movie.title"
          class="w-full h-full object-cover"
          loading="lazy"
        >
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-muted"
        >
          <UIcon
            name="i-lucide-film"
            class="size-12"
          />
        </div>
      </div>

      <div class="p-3">
        <p class="font-semibold text-sm leading-snug line-clamp-2">
          {{ movie.title }}
        </p>
        <div class="flex items-center justify-between mt-1">
          <span class="text-xs text-muted">{{ year }}</span>
          <div class="flex items-center gap-1">
            <UIcon
              name="i-lucide-star"
              class="size-3 text-yellow-400"
            />
            <span class="text-xs font-medium">{{ movie.vote_average.toFixed(1) }}</span>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
