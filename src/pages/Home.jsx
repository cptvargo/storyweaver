import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ALL_BOOKS } from '../utils/storyEngine'
import { publicUrl } from '../utils/publicUrl'
import BookDetail from '../components/Library/BookDetail'

const GENRE_ORDER = ['Romance', 'Murder Mystery', 'Interactive']

function groupByGenre(books) {
  const groups = {}
  books.forEach(book => {
    const g = book.genre || 'Other'
    if (!groups[g]) groups[g] = []
    groups[g].push(book)
  })
  return groups
}

export default function Home() {
  const navigate = useNavigate()
  const [selectedBook, setSelectedBook] = useLocalStorage('sw_selectedBook', null)
  const [detailBook, setDetailBook] = useState(null)

  const progressKey = selectedBook ? `sw_progress_${selectedBook.id}` : 'sw_progress_none'
  const [progress] = useLocalStorage(progressKey, null)
  const hasProgress = progress !== null && selectedBook !== null

  const groups = groupByGenre(ALL_BOOKS)
  const orderedGenres = [
    ...GENRE_ORDER.filter(g => groups[g]),
    ...Object.keys(groups).filter(g => !GENRE_ORDER.includes(g))
  ]

  const getBookProgress = (bookId) => {
    try {
      const item = window.localStorage.getItem(`sw_progress_${bookId}`)
      return item ? JSON.parse(item) : null
    } catch { return null }
  }

  const handleBeginReading = (book) => {
    setSelectedBook(book)
    navigate('/reader')
  }

  const handleStartOver = (book) => {
    setSelectedBook(book)
    window.localStorage.setItem(`sw_progress_${book.id}`, JSON.stringify({ chapterIndex: 1, pageIndex: 0 }))
    window.localStorage.removeItem(`sw_choices_${book.id}`)
    navigate('/reader')
  }

  return (
    <div className="home">

      {/* ── Hero ── */}
      <section className="home__hero">
        <img src="/hero_banner.png" alt="StoryWeaver" className="home__hero-img" />
      </section>

      {/* ── Continue Reading ── */}
      {hasProgress && (
        <div className="home__continue-wrap">
          <button className="home__continue" onClick={() => navigate('/reader')}>
            <span className="home__continue-eyebrow">▶ Continue Reading</span>
            <span className="home__continue-sub">
              {selectedBook.title}
              <span className="home__continue-dot">·</span>
              {selectedBook.format === 'episodes' ? 'Episode' : 'Chapter'} {progress.chapterIndex}
              {progress.pageIndex > 0 ? `, Page ${progress.pageIndex}` : ''}
            </span>
          </button>
        </div>
      )}

      {/* ── Genre sections ── */}
      <div className="home__library">
        {orderedGenres.map(genre => (
          <section key={genre} className="genre-section">
            <div className="genre-section__header">
              <span className="genre-section__eyebrow">{genre}</span>
              <span className="genre-section__rule" />
            </div>

            <div className="genre-section__row">
              {groups[genre].map(book => (
                <button
                  key={book.id}
                  className="genre-card"
                  onClick={() => setDetailBook(book)}
                >
                  <div className="genre-card__wrap">
                    {book.cover ? (
                      <img
                        src={publicUrl(book.cover)}
                        alt={book.title}
                        className="genre-card__img"
                        loading="lazy"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div className="genre-card__placeholder">
                        <span>{book.title}</span>
                      </div>
                    )}
                    <div className="genre-card__fade" />
                    <div className="genre-card__label">
                      <p className="genre-card__title">{book.title}</p>
                      {book.subtitle && (
                        <p className="genre-card__subtitle">{book.subtitle}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ── Book detail modal ── */}
      {detailBook && (
        <BookDetail
          book={detailBook}
          onClose={() => setDetailBook(null)}
          onRead={handleBeginReading}
          onStartOver={handleStartOver}
          savedProgress={getBookProgress(detailBook.id)}
        />
      )}
    </div>
  )
}
