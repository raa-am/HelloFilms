import DOMPurify from 'dompurify'

// DOMPurify nécessite le DOM — côté serveur on retourne le texte brut sans balises
export function useSanitize() {
  function sanitize(html: string): string {
    if (import.meta.server) {
      return html.replace(/<[^>]*>/g, '')
    }
    return DOMPurify.sanitize(html)
  }

  return { sanitize }
}
