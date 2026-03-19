<script setup lang="ts">
import type { Comment } from '~/types/comment'

const props = defineProps<{
  comments: Comment[]
}>()

type SortOrder = 'desc' | 'asc'
const order = ref<SortOrder>('desc')
const page = ref(1)
const perPage = 10

const sorted = computed(() =>
  [...props.comments].sort((a, b) =>
    order.value === 'desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
  )
)

const totalPages = computed(() => Math.ceil(sorted.value.length / perPage))

const paginated = computed(() => {
  const start = (page.value - 1) * perPage
  return sorted.value.slice(start, start + perPage)
})

// Remet la pagination à la première page quand l'ordre change
watch(order, () => {
  page.value = 1
})

const options = [
  { label: 'Plus récent', value: 'desc' as SortOrder },
  { label: 'Plus ancien', value: 'asc' as SortOrder }
]

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
    <div
      v-if="comments.length > 0"
      class="flex items-center justify-between"
    >
      <span class="text-sm text-muted">
        {{ comments.length }} commentaire{{ comments.length > 1 ? 's' : '' }}
      </span>
      <USelect
        v-model="order"
        :items="options"
        value-key="value"
        size="xs"
      />
    </div>

    <p
      v-if="comments.length === 0"
      class="text-sm text-muted text-center py-12"
    >
      Aucun commentaire pour ce film. Soyez le premier !
    </p>

    <div
      v-for="comment in paginated"
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
      <!-- v-html nécessaire car TinyMCE génère du HTML formaté — contenu validé par Vuelidate -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div
        class="text-sm leading-relaxed text-muted pl-9 prose prose-sm prose-invert max-w-none"
        v-html="comment.message"
      />
    </div>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-center gap-2 pt-2"
    >
      <UButton
        variant="ghost"
        size="xs"
        icon="i-lucide-chevron-left"
        :disabled="page === 1"
        @click="page--"
      />
      <button
        v-for="p in totalPages"
        :key="p"
        class="w-7 h-7 rounded text-xs font-semibold transition-colors"
        :class="p === page
          ? 'bg-primary text-white'
          : 'text-muted hover:text-default'"
        @click="page = p"
      >
        {{ p }}
      </button>
      <UButton
        variant="ghost"
        size="xs"
        icon="i-lucide-chevron-right"
        :disabled="page === totalPages"
        @click="page++"
      />
    </div>
  </div>
</template>
