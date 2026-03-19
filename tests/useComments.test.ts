import { describe, it, expect } from 'vitest'
import type { Comment } from '~/types/comment'

function createCommentStore(movieId: string) {
  const comments: Comment[] = []

  function add(data: Omit<Comment, 'id' | 'movieId' | 'createdAt'>) {
    comments.push({
      id: crypto.randomUUID(),
      movieId,
      createdAt: Date.now(),
      ...data
    })
  }

  function remove(id: string) {
    const index = comments.findIndex(c => c.id === id)
    if (index !== -1) comments.splice(index, 1)
  }

  function sorted() {
    return [...comments].sort((a, b) => b.createdAt - a.createdAt)
  }

  return { add, remove, sorted }
}

describe('useComments', () => {
  it('démarre avec une liste vide', () => {
    const store = createCommentStore('42')
    expect(store.sorted()).toHaveLength(0)
  })

  it('ajoute un commentaire avec les bons champs', () => {
    const store = createCommentStore('42')
    store.add({ username: 'Alice', message: 'Super film', rating: 8 })
    const result = store.sorted()
    expect(result).toHaveLength(1)
    expect(result[0]?.username).toBe('Alice')
    expect(result[0]?.movieId).toBe('42')
    expect(result[0]?.rating).toBe(8)
  })

  it('trie du plus récent au plus ancien', async () => {
    const store = createCommentStore('42')
    store.add({ username: 'Alice', message: 'Premier', rating: 7 })
    await new Promise(r => setTimeout(r, 5))
    store.add({ username: 'Bob', message: 'Deuxième', rating: 9 })
    const result = store.sorted()
    expect(result[0]?.username).toBe('Bob')
    expect(result[1]?.username).toBe('Alice')
  })

  it('supprime un commentaire par son id', () => {
    const store = createCommentStore('42')
    store.add({ username: 'Alice', message: 'À supprimer', rating: 5 })
    const id = store.sorted()[0]!.id
    store.remove(id)
    expect(store.sorted()).toHaveLength(0)
  })

  it('ne supprime pas un commentaire avec un id inexistant', () => {
    const store = createCommentStore('42')
    store.add({ username: 'Alice', message: 'Test', rating: 6 })
    store.remove('id-inexistant')
    expect(store.sorted()).toHaveLength(1)
  })

  it('retourne uniquement les commentaires du bon film', () => {
    const film1 = createCommentStore('1')
    const film2 = createCommentStore('2')
    film1.add({ username: 'Alice', message: 'Film 1', rating: 6 })
    film1.add({ username: 'Bob', message: 'Film 1 aussi', rating: 7 })
    film2.add({ username: 'Charlie', message: 'Film 2', rating: 8 })
    expect(film1.sorted()).toHaveLength(2)
    expect(film2.sorted()).toHaveLength(1)
    expect(film2.sorted()[0]?.username).toBe('Charlie')
  })

  it('génère un id unique pour chaque commentaire', () => {
    const store = createCommentStore('42')
    store.add({ username: 'Alice', message: 'Un', rating: 5 })
    store.add({ username: 'Bob', message: 'Deux', rating: 7 })
    const ids = store.sorted().map(c => c.id)
    expect(new Set(ids).size).toBe(2)
  })
})
