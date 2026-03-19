<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

const is404 = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: is404.value ? 'Page introuvable — HelloFilms' : 'Erreur — HelloFilms'
})
</script>

<template>
  <UContainer class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-8xl font-bold text-primary mb-4">
        {{ error.statusCode }}
      </p>
      <h1 class="text-2xl font-semibold mb-2">
        {{ is404 ? 'Page introuvable' : 'Une erreur est survenue' }}
      </h1>
      <p class="text-muted text-sm mb-8">
        {{ is404 ? 'Le film ou la page que vous cherchez n\'existe pas.' : error.message }}
      </p>
      <NuxtLink to="/">
        <UButton
          color="primary"
          variant="outline"
        >
          Retour à l'accueil
        </UButton>
      </NuxtLink>
    </div>
  </UContainer>
</template>
