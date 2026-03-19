<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, between, helpers } from '@vuelidate/validators'

// Import dynamique pour éviter les erreurs SSR (TinyMCE manipule le DOM directement)
const Editor = defineAsyncComponent(() =>
  import('@tinymce/tinymce-vue').then(m => m.default)
)

const emit = defineEmits<{
  submit: [data: { username: string, message: string, rating: number }]
}>()

const form = reactive({
  username: '',
  message: '',
  rating: 0
})

// TinyMCE stocke du HTML — on extrait le texte brut pour la validation Vuelidate
const messageText = computed(() => {
  if (!form.message) return ''
  return form.message.replace(/<[^>]*>/g, '').trim()
})

// Lettres uniquement (accents inclus) — pas de chiffres ni de caractères spéciaux
const alphaOnly = helpers.withMessage(
  'Le nom ne doit contenir que des lettres.',
  helpers.regex(/^[a-zA-ZÀ-ÿ\s]+$/)
)

// Alphanumérique + ponctuation courante sur le texte brut extrait du HTML
const alphanumeric = helpers.withMessage(
  'Le message ne doit contenir que des caractères alphanumériques.',
  helpers.regex(/^[a-zA-Z0-9À-ÿ\s.,!?'"()\-\n]+$/)
)

const rules = {
  username: {
    required: helpers.withMessage('Le nom est requis.', required),
    minLength: helpers.withMessage('Minimum 3 caractères.', minLength(3)),
    maxLength: helpers.withMessage('Maximum 50 caractères.', maxLength(50)),
    alphaOnly
  },
  messageText: {
    required: helpers.withMessage('Le message est requis.', (val: string) => val.length > 0),
    minLength: helpers.withMessage('Minimum 3 caractères.', minLength(3)),
    maxLength: helpers.withMessage('Maximum 500 caractères.', maxLength(500)),
    alphanumeric
  },
  rating: {
    between: helpers.withMessage('La note doit être entre 1 et 10.', between(1, 10))
  }
}

// On valide sur un objet combinant form + messageText
const validationState = reactive({
  get username() { return form.username },
  get messageText() { return messageText.value },
  get rating() { return form.rating }
})

const v$ = useVuelidate(rules, validationState)

// Configuration TinyMCE — toolbar minimaliste adaptée aux commentaires
const editorConfig = {
  height: 180,
  menubar: false,
  plugins: ['lists', 'emoticons'],
  toolbar: 'bold italic underline | bullist numlist | emoticons',
  toolbar_mode: 'wrap',
  block_formats: '',
  content_style: 'body { background: #0f172b; color: #fff; font-family: inherit; font-size: 14px; }',
  skin: 'oxide-dark',
  content_css: 'dark'
}

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
  <div class="rounded-xl border border-default bg-elevated/40 p-5">
    <h3 class="font-semibold text-sm mb-4">
      Laisser un commentaire
    </h3>
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
        :error="v$.messageText.$error ? v$.messageText.$errors[0]?.$message as string : undefined"
        :hint="`${messageText.length} / 500`"
      >
        <!-- TinyMCE chargé uniquement côté client (pas de SSR) -->
        <ClientOnly>
          <Editor
            v-model="form.message"
            api-key="jrjcz5mhmnzr7xp1gfm9hfmnyjp5xksxyw0afg139uasgpo9"
            :init="editorConfig"
            @blur="v$.messageText.$touch()"
          />
          <template #fallback>
            <UTextarea
              v-model="form.message"
              placeholder="Votre avis sur ce film..."
              :rows="3"
              class="w-full"
            />
          </template>
        </ClientOnly>
      </UFormField>

      <UFormField
        label="Note"
        :error="v$.rating.$error ? v$.rating.$errors[0]?.$message as string : undefined"
      >
        <div class="flex items-center gap-1.5 flex-wrap">
          <button
            v-for="n in 10"
            :key="n"
            type="button"
            class="w-8 h-8 rounded-lg text-xs font-semibold transition-colors"
            :class="form.rating >= n
              ? 'bg-primary text-white'
              : 'bg-elevated border border-default text-muted hover:border-primary hover:text-primary'"
            @click="form.rating = n"
          >
            {{ n }}
          </button>
        </div>
      </UFormField>

      <UButton
        type="submit"
        color="primary"
      >
        Publier
      </UButton>
    </form>
  </div>
</template>
