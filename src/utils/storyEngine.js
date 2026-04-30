// StoryEngine — matches user answers to the best local book by tag scoring.
// No AI, no generation. Pure local tag matching.

import whereWeFirstMetMeta from '../data/books/whereWeFirstMet/bookMeta.json'

// All available books. Add new entries here as the library grows.
const ALL_BOOKS = [whereWeFirstMetMeta]

// Load all page JSON files from src/data/books
const PAGE_MODULES = import.meta.glob('../data/books/*/chapter*/*.json')

function scoreBook(book, { genre, tone, mood }) {
  let score = 0
  const tags = book.tags.map((t) => t.toLowerCase())

  if (genre && tags.includes(genre.toLowerCase())) score += 2
  if (tone && tags.includes(tone.toLowerCase())) score += 1
  if (mood && tags.includes(mood.toLowerCase())) score += 1
  if (genre && book.genre.toLowerCase().includes(genre.toLowerCase())) score += 1

  return score
}

export function matchBook(userAnswers) {
  const scored = ALL_BOOKS.map((book) => ({
    book,
    score: scoreBook(book, userAnswers),
  }))

  scored.sort((a, b) => b.score - a.score)
  return scored[0].book
}

export async function loadPage(bookId, chapterIndex, pageNumber) {
  try {
    const path = `../data/books/${bookId}/chapter${chapterIndex}/${pageNumber}.json`
    const loader = PAGE_MODULES[path]

    if (!loader) {
      console.error(`Page not found: ${path}`)
      return null
    }

    const module = await loader()
    return module.default
  } catch (err) {
    console.error('Error loading page:', err)
    return null
  }
}

export async function loadChapterPages(bookId, chapterIndex, totalPages = 12) {
  const pages = []

  for (let page = 1; page <= totalPages; page++) {
    const pageData = await loadPage(bookId, chapterIndex, page)
    if (pageData) pages.push(pageData)
  }

  return pages
}

export { ALL_BOOKS }