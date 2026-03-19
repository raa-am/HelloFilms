<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, between, helpers } from '@vuelidate/validators'

const emit = defineEmits<{
  submit: [data: { username: string, message: string, rating: number }]
}>()

const form = reactive({
  username: '',
  message: '',
  rating: 0
})

// Lettres uniquement (accents inclus) — pas de chiffres ni de caractères spéciaux
const alphaOnly = helpers.withMessage(
  'Le nom ne doit contenir que des lettres.',
  helpers.regex(/^[a-zA-ZÀ-ÿ\s]+$/)
)

// Alphanumérique + ponctuation courante — on bloque le HTML et les caractères exotiques
const alphanumeric = helpers.withMessage(
  'Le message ne doit contenir que des caractères alphanumériques.',
  helpers.regex(/^[a-zA-Z0-9À-ÿ\s.,!?'"()-]+$/)
)

const rules = {
  username: {
    required: helpers.withMessage('Le nom est requis.', required),
    minLength: helpers.withMessage('Minimum 3 caractères.', minLength(3)),
    maxLength: helpers.withMessage('Maximum 50 caractères.', maxLength(50)),
    alphaOnly
  },
  message: {
    required: helpers.withMessage('Le message est requis.', required),
    minLength: helpers.withMessage('Minimum 3 caractères.', minLength(3)),
    maxLength: helpers.withMessage('Maximum 500 caractères.', maxLength(500)),
    alphanumeric
  },
  rating: {
    between: helpers.withMessage('La note doit être entre 1 et 10.', between(1, 10))
  }
}

const v$ = useVuelidate(rules, form)

async function onSubmit() {
  const valid = await v$.value.$validate()
  if (!valid) return

  emit('submit', { ...form })

  // On remet le formulaire à zéro après soumission
  form.username = ''
  form.message = ''
  form.rating = 0
  v$.value.$reset()
}
</script>

<template>
  <UPageCard
    title="Laisser un commentaire"
    variant="subtle"
  >
    <form
      class="space-y-4"
      @submit.prevent="onSubmit"
    >
      <UFormField
        label="Nom d'utilisateur"
        :error="v$.username.$error ? v$.username.$errors[0]?.$message as string : undefined"
      >
        <UInput
          v-model="form.username"
          placeholder="Votre nom"
          class="w-full"
          @blur="v$.username.$touch()"
        />
      </UFormField>

      <UFormField
        label="Message"
        :error="v$.message.$error ? v$.message.$errors[0]?.$message as string : undefined"
      >
        <UTextarea
          v-model="form.message"
          placeholder="Votre commentaire..."
          :rows="4"
          class="w-full"
          @blur="v$.message.$touch()"
        />
      </UFormField>

      <UFormField
        label="Note"
        :error="v$.rating.$error ? v$.rating.$errors[0]?.$message as string : undefined"
      >
        <div class="flex items-center gap-2">
          <UButton
            v-for="n in 10"
            :key="n"
            :variant="form.rating >= n ? 'solid' : 'outline'"
            color="primary"
            size="xs"
            class="w-8 h-8"
            type="button"
            @click="form.rating = n"
          >
            {{ n }}
          </UButton>
        </div>
      </UFormField>

      <UButton
        type="submit"
        color="primary"
        class="w-full"
      >
        Publier
      </UButton>
    </form>
  </UPageCard>
</template>
