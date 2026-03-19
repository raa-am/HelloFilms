# HelloFilms

Interface cinéma développée dans le cadre du test technique HelloCSE, en utilisant Nuxt 4 et l'API TMDB.

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI%204-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&labelColor=020420)](https://www.typescriptlang.org)
[![Powered by TMDB](https://img.shields.io/badge/Powered%20by-TMDB-01D277?labelColor=020420)](https://www.themoviedb.org)

**Demo** : [hello-films.vercel.app](https://hello-films.vercel.app)

---

## Fonctionnalités

### Liste des films
- Défilement infini via `useIntersectionObserver` (VueUse)
- Recherche en temps réel par nom de film (endpoint TMDB `search/movie`)
- Skeleton loaders pendant le chargement
- Clic sur un film → page détail

### Détail d'un film
- Affiche, titre, synopsis, réalisateur, casting principal, genres, note TMDB et nombre de votants

### Commentaires
- Formulaire par film persisté en localStorage
- Nom d'utilisateur (alpha, 3–50 caractères, requis)
- Message avec éditeur TinyMCE (alphanumérique, 3–500 caractères, requis)
- Note personnelle de 1 à 10
- Triés du plus récent au plus ancien

---

## Stack

| Outil | Rôle | Statut |
|---|---|---|
| **Nuxt 4** + Vue 3 | Framework SSR + Composition API | requis |
| **TypeScript** | Typage strict, pas de `any` | requis |
| **TailwindCSS** | Styling utilitaire | requis |
| **SCSS** | Styles globaux | requis |
| **Vuelidate** | Validation du formulaire de commentaires | requis |
| **VueUse** | `useIntersectionObserver`, `useLocalStorage` | requis |
| **ESLint + Stylelint** | Qualité du code | requis |
| **Vitest** | Tests unitaires | requis |
| **Pinia** | Store global (liste, recherche, état UI) | bonus |
| **Nuxt UI 4** | Composants UI | bonus |
| **TinyMCE** | Éditeur WYSIWYG pour les commentaires | bonus |

### Pourquoi Nuxt UI 4 plutôt que Vuetify ?

Vuetify était listé comme option dans le cahier des charges, mais j'ai préféré partir sur Nuxt UI 4. La raison principale c'est que Nuxt UI est construit sur TailwindCSS qui était déjà requis — ça évite d'avoir deux systèmes de styles qui se marchent dessus. Et comme c'est fait spécifiquement pour Nuxt, les composants comme `USkeleton` ou `UPageCard` s'intègrent sans friction. Vuetify aurait demandé plus de config pour le faire cohabiter avec Tailwind, j'ai préféré éviter ça.

### Pourquoi Pinia plutôt que Harlem ou createGlobalState ?

J'avais le choix entre les trois. `createGlobalState` de VueUse aurait pu suffire pour quelque chose de simple, mais dès qu'on a de la pagination, une recherche et du SSR à gérer, ça devient vite limité. VueUse est déjà utilisé dans le projet pour `useLocalStorage` et `useIntersectionObserver`, mais `createGlobalState` pour gérer un état global aussi complexe c'est pas vraiment sa vocation. Harlem je le connaissais de nom mais peu utilisé en pratique, et reprendre un projet avec un store peu répandu c'est toujours un peu pénible. Pinia c'est le choix standard aujourd'hui pour Vue 3, la doc est bonne, les DevTools fonctionnent bien avec, et `@pinia/nuxt` gère l'hydratation SSR automatiquement — pas grand chose à configurer.

### TinyMCE pour l'éditeur de commentaires

C'était la première fois que j'utilisais TinyMCE. Honnêtement je m'attendais à quelque chose de plus compliqué à intégrer, mais ça s'est révélé assez simple — le package `@tinymce/tinymce-vue` propose un composant prêt à l'emploi, et la config se fait via un objet `init` directement dans le template. En quelques heures j'avais l'éditeur en place avec la toolbar personnalisée, le thème sombre et le binding `v-model` qui fonctionne.

Le seul point un peu délicat était le rendu côté serveur : TinyMCE manipule directement le DOM, donc il faut le charger uniquement côté client avec `<ClientOnly>` et un import dynamique. Une fois ce détail réglé, ça tourne sans problème.

### Pourquoi Vitest plutôt que Jest ?

Sur un projet Nuxt 4 qui est full ESM, Jest c'est une vraie galère à configurer — il faut gérer la compatibilité ESM manuellement, souvent avec Babel, et les alias de chemins ne fonctionnent pas out of the box. Vitest partage la même config Vite que le projet, donc les alias `~` fonctionnent directement, pas de transpilation séparée, et les tests tournent nettement plus vite. La config tient en une vingtaine de lignes dans `vitest.config.ts`, c'est tout.

---

## Architecture

```
app/
├── components/
│   ├── movie/          # MovieCard, MovieCardSkeleton
│   └── comment/        # CommentForm, CommentList
├── composables/
│   ├── useMovies.ts        # liste paginée + recherche
│   ├── useMovieDetail.ts   # détail + crédits (appels parallèles)
│   └── useComments.ts      # CRUD localStorage
├── pages/
│   ├── index.vue           # liste des films
│   └── movies/[id].vue     # détail d'un film
├── stores/movies.ts        # Pinia
└── types/                  # interfaces TMDB et commentaires
tests/
├── useComments.test.ts     # 7 tests
├── moviesStore.test.ts     # 6 tests
└── validators.test.ts      # 14 tests
```

---

## Installation

```bash
pnpm install
```

Créer un fichier `.env` à la racine :

```env
NUXT_PUBLIC_TMDB_ACCESS_TOKEN=your_access_token
NUXT_PUBLIC_TMDB_API_KEY=your_api_key
```

> Clés disponibles sur [developer.themoviedb.org](https://developer.themoviedb.org/reference/intro/getting-started)

---

## Commandes

```bash
pnpm dev        # serveur de développement (http://localhost:3000)
pnpm build      # build production
pnpm preview    # prévisualisation du build
pnpm lint       # ESLint + Stylelint
pnpm typecheck  # vérification TypeScript
pnpm test       # 27 tests Vitest
```
