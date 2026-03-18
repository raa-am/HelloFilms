<script setup lang="ts">
import type { Comment } from '~/types/comment'

defineProps<{
  comments: Comment[]
}>()

function formatDate(ts: number) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(ts))
}
</script>

<template>
  <div class="space-y-4">
    <p
      v-if="comments.length === 0"
      class="text-sm text-muted text-center py-6"
    >
      Aucun commentaire pour ce film.
    </p>

    <UPageCard
      v-for="comment in comments"
      :key="comment.id"
      variant="subtle"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="font-semibold text-sm">
            {{ comment.username }}
          </p>
          <p class="text-xs text-muted mt-0.5">
            {{ formatDate(comment.createdAt) }}
          </p>
        </div>
        <UBadge
          color="primary"
          variant="subtle"
          class="shrink-0"
        >
          ★ {{ comment.rating }}/10
        </UBadge>
      </div>
      <p class="mt-3 text-sm leading-relaxed">
        {{ comment.message }}
      </p>
    </UPageCard>
  </div>
</template>
