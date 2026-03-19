<script setup lang="ts">
import type { Comment } from '~/types/comment'

defineProps<{
  comments: Comment[]
}>()

// Formate un timestamp en date lisible, ex: "15 mars 2024"
function formatDate(ts: number) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(ts))
}
</script>

<template>
  <div class="space-y-3">
    <p
      v-if="comments.length === 0"
      class="text-sm text-muted text-center py-8"
    >
      Aucun commentaire pour ce film.
    </p>

    <div
      v-for="comment in comments"
      :key="comment.id"
      class="rounded-xl border border-default bg-elevated/40 p-4"
    >
      <div class="flex items-center justify-between gap-4 mb-2">
        <div class="flex items-center gap-2 min-w-0">
          <div class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span class="text-xs font-bold text-primary uppercase">{{ comment.username[0] }}</span>
          </div>
          <div class="min-w-0">
            <p class="font-semibold text-sm truncate">
              {{ comment.username }}
            </p>
            <p class="text-xs text-muted">
              {{ formatDate(comment.createdAt) }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0 text-yellow-400">
          <UIcon
            name="i-lucide-star"
            class="size-3.5"
          />
          <span class="text-xs font-semibold text-default">{{ comment.rating }}/10</span>
        </div>
      </div>
      <p class="text-sm leading-relaxed text-muted pl-9">
        {{ comment.message }}
      </p>
    </div>
  </div>
</template>
