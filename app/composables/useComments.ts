import type { Comment } from '~/types/comment'

export function useComments(movieId: string) {
  // Clé unique par film pour isoler les commentaires dans le localStorage
  const storageKey = `hellofilms:comments:${movieId}`

  const comments = useLocalStorage<Comment[]>(storageKey, [])

  const sorted = computed(() =>
    [...comments.value].sort((a, b) => b.createdAt - a.createdAt)
  )

  function add(data: Omit<Comment, 'id' | 'movieId' | 'createdAt'>) {
    comments.value.push({
      id: crypto.randomUUID(),
      movieId,
      createdAt: Date.now(),
      ...data
    })
  }

  return { comments: sorted, add }
}
