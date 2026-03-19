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

Vuetify était mentionné comme option dans le cahier des charges. Nuxt UI 4 a été préféré pour plusieurs raisons :

1. **Intégration native Nuxt** — conçu spécifiquement pour l'écosystème Nuxt, sans configuration supplémentaire
2. **Basé sur TailwindCSS** — déjà requis dans le projet, ce qui évite tout conflit de styles entre les deux systèmes
3. **Composants modernes** — `UPageCard`, `USkeleton`, `UForm` sont alignés avec les patterns Vue 3 et la Composition API

### Pourquoi Pinia plutôt que Harlem ou createGlobalState ?

Les trois options étaient mentionnées dans le cahier des charges. Pinia s'est imposé naturellement pour plusieurs raisons :

- **Standard Vue 3** — c'est la solution de store officielle recommandée par l'équipe Vue, ce qui garantit une bonne pérennité et une doc solide
- **Intégration Nuxt native** — le module `@pinia/nuxt` gère automatiquement le SSR et l'hydratation, sans configuration supplémentaire
- **DevTools** — Pinia s'intègre avec les Vue DevTools, ce qui facilite le debug de l'état global pendant le développement
- **`createGlobalState`** (VueUse) est pratique pour des états simples locaux, mais n'offre pas la persistance SSR ni l'outillage de Pinia — ça aurait été suffisant pour un petit composable, pas pour gérer la liste de films avec pagination et recherche
- **Harlem** est une alternative intéressante mais beaucoup moins répandue dans l'écosystème, ce qui aurait rendu le code moins lisible pour quelqu'un qui reprend le projet

### Pourquoi Vitest plutôt que Jest ?

Jest était mentionné comme option dans le cahier des charges. Vitest a été préféré car il partage la même configuration Vite que le projet — pas de transpilation séparée, pas de config babel, les mêmes alias de chemins fonctionnent directement. Concrètement, les tests s'exécutent beaucoup plus vite et la configuration se résume à un seul fichier `vitest.config.ts`. Avec Jest, il aurait fallu gérer la compatibilité ESM manuellement, ce qui est particulièrement pénible dans un projet Nuxt 4 full ESM.

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
