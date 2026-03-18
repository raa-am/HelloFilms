<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">Movie Detail - Coming soon</h1>
    <p>Cette page sera remplie avec les informations du film (API TMDB).</p>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const movieId = route.params.id
</script>
