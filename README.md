# HelloFilms

Test technique réalisé pour HelloCSE — une interface de films utilisant l'API TMDB, développée avec Nuxt 4 et Vue 3.

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI%204-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&labelColor=020420)](https://www.typescriptlang.org)
[![Powered by TMDB](https://img.shields.io/badge/Powered%20by-TMDB-01D277?labelColor=020420)](https://www.themoviedb.org)

**Demo** : [hello-films.vercel.app](https://hello-films.vercel.app)

---

## Ce qui a été développé

### Liste des films
- Défilement infini avec `useIntersectionObserver` de VueUse
- Recherche par nom en temps réel via l'endpoint TMDB `search/movie`
- Skeleton loaders pendant les chargements
- Navigation vers la page détail au clic

### Détail d'un film
- Affiche, titre, synopsis, réalisateur, casting principal, genres, note TMDB et nombre de votants

### Commentaires
- Formulaire de commentaires stocké en localStorage, isolé par film
- Nom d'utilisateur : alpha, 3–50 caractères, requis
- Message : alphanumérique, 3–500 caractères, requis — avec éditeur TinyMCE
- Note personnelle : 1 à 10
- Affichage du plus récent au plus ancien

---

## Stack utilisée

| Outil | Rôle |
|---|---|
| **Nuxt 4** + Vue 3 Composition API | Framework principal |
| **TypeScript** | Typage strict sur l'ensemble du projet |
| **TailwindCSS** + **SCSS** | Styles |
| **Nuxt UI 4** | Composants UI |
| **Pinia** | Store global |
| **Vuelidate** | Validation du formulaire |
| **VueUse** | Utilitaires réactifs |
| **TinyMCE** | Éditeur WYSIWYG |
| **Vitest** | Tests unitaires |
| **ESLint** + **Stylelint** | Qualité de code |

### Sur le choix de Nuxt UI 4 plutôt que Vuetify

Le cahier des charges mentionnait Vuetify comme option bonus. J'ai préféré Nuxt UI 4 car il est construit sur TailwindCSS (déjà requis), s'intègre nativement dans l'écosystème Nuxt sans configuration supplémentaire, et évite les conflits de styles qui arrivent souvent en combinant Vuetify et Tailwind. Les composants proposés (UPageCard, USkeleton, UForm...) correspondent bien aux besoins du projet.

---

## Architecture du projet

```
app/
├── components/
│   ├── movie/              # MovieCard, MovieCardSkeleton
│   └── comment/            # CommentForm, CommentList
├── composables/
│   ├── useMovies.ts        # liste paginée + recherche
│   ├── useMovieDetail.ts   # détail + crédits en parallèle
│   └── useComments.ts      # lecture/écriture localStorage
├── pages/
│   ├── index.vue           # liste des films
│   └── movies/[id].vue     # détail d'un film
├── stores/movies.ts        # état global Pinia
└── types/                  # interfaces TMDB et commentaires
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

> Les clés sont disponibles sur [developer.themoviedb.org](https://developer.themoviedb.org/reference/intro/getting-started)

---

## Commandes

```bash
pnpm dev        # http://localhost:3000
pnpm build
pnpm preview
pnpm lint
pnpm typecheck
```

---

## Ce qui reste à finaliser

- [ ] Tests Vitest sur `useComments` et les validators
- [ ] Transitions entre les pages
- [ ] Quelques animations et améliorations visuelles
