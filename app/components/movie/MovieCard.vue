<script setup lang="ts">
import type { Movie } from '~/types/tmdb'

const props = defineProps<{
  movie: Movie
  index?: number
}>()

// w500 est un bon compromis qualité/performance pour une grille de cartes
const imageUrl = computed(() =>
  props.movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${props.movie.poster_path}`
    : null
)

// On extrait uniquement l'année depuis la date ISO (ex: "2024-03-15" → "2024")
const year = computed(() =>
  props.movie.release_date ? props.movie.release_date.slice(0, 4) : ''
)

const cardRef = ref<HTMLElement | null>(null)
const visible = ref(false)

// Déclenche l'animation uniquement quand la carte entre dans le viewport
useIntersectionObserver(cardRef, ([entry]) => {
  if (entry?.isIntersecting) {
    visible.value = true
  }
}, { threshold: 0.1 })

// Délai en cascade : les cartes d'une même rangée arrivent les unes après les autres
const delay = computed(() => `${((props.index ?? 0) % 4) * 80}ms`)
</script>

<template>
  <NuxtLink
    ref="cardRef"
    :to="`/movies/${movie.id}`"
    class="group block transition-all duration-500"
    :class="visible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-6'"
    :style="{ transitionDelay: delay }"
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
