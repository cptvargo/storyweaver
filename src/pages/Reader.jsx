import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { loadPage, ALL_BOOKS } from '../utils/storyEngine'
import { publicUrl } from '../utils/publicUrl'
import SceneRenderer from '../components/Story/SceneRenderer'
import ChapterIntroCard from '../components/Story/ChapterIntroCard'
import PageShell from '../components/Layout/PageShell'

const SWIPE_THRESHOLD = 50

// Key that uniquely identifies what is currently displayed
function makeKey(chapterIndex, pageIndex) {
  return pageIndex === 0 ? `intro-${chapterIndex}` : `${chapterIndex}-${pageIndex}`
}

export default function Reader() {
  const navigate = useNavigate()
  const [storedBook] = useLocalStorage('sw_selectedBook', null)
  // Always resolve against live imports so stale localStorage never misses new fields
  const selectedBook = storedBook
    ? (ALL_BOOKS.find((b) => b.id === storedBook.id) ?? storedBook)
    : null
  const [progress, setProgress] = useLocalStorage('sw_progress', {
    chapterIndex: 1,
    pageIndex: 0,
  })

  // Single state: { key, data } — avoids any synchronous setState inside effect
  const [pageState, setPageState] = useState({ key: null, data: null })

  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const chapterIndex = progress?.chapterIndex ?? 1
  const pageIndex = progress?.pageIndex ?? 0
  const totalChapters = selectedBook?.totalChapters ?? 1
  const isIntroCard = pageIndex === 0

  const chapterMeta =
    selectedBook?.chapters?.find((c) => c.chapterIndex === chapterIndex) ?? null

  const totalPages =
    chapterMeta?.totalPages ??
    selectedBook?.chapterPages?.[chapterIndex] ??
    12

  const currentKey = makeKey(chapterIndex, pageIndex)
  // loading is derived — true whenever the resolved key doesn't match what we need
  const loading = pageState.key !== currentKey
  const page = pageState.data

  useEffect(() => {
    if (!selectedBook) return
    const key = makeKey(chapterIndex, pageIndex)
    const load = isIntroCard
      ? Promise.resolve(null)
      : loadPage(selectedBook.id, chapterIndex, pageIndex)
    load.then((data) => {
      setPageState({ key, data })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }, [selectedBook, chapterIndex, pageIndex, isIntroCard])

  if (!selectedBook) {
    return (
      <PageShell centered>
        <div className="reader-empty">
          <p>No story selected.</p>
          <button className="btn btn--primary" onClick={() => navigate('/setup')}>
            Find a Story
          </button>
        </div>
      </PageShell>
    )
  }

  const getPrevChapterTotalPages = (idx) => {
    const meta = selectedBook?.chapters?.find((c) => c.chapterIndex === idx)
    return meta?.totalPages ?? selectedBook?.chapterPages?.[idx] ?? 12
  }

  const handleNextPage = () => {
    if (isIntroCard) {
      setProgress({ chapterIndex, pageIndex: 1 })
    } else if (pageIndex < totalPages) {
      setProgress({ chapterIndex, pageIndex: pageIndex + 1 })
    } else if (chapterIndex < totalChapters) {
      setProgress({ chapterIndex: chapterIndex + 1, pageIndex: 0 })
    }
  }

  const handlePrevPage = () => {
    if (isIntroCard) {
      if (chapterIndex > 1) {
        const prevPages = getPrevChapterTotalPages(chapterIndex - 1)
        setProgress({ chapterIndex: chapterIndex - 1, pageIndex: prevPages })
      }
    } else if (pageIndex > 1) {
      setProgress({ chapterIndex, pageIndex: pageIndex - 1 })
    } else {
      setProgress({ chapterIndex, pageIndex: 0 })
    }
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) handleNextPage()
      else handlePrevPage()
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  const isFinished = chapterIndex >= totalChapters && pageIndex >= totalPages

  const pov =
    page?.pov ??
    page?.blocks?.find((b) => b.type === 'internalThought')?.character ??
    null

  const pageLabel = isIntroCard
    ? 'Chapter Intro'
    : `Page ${pageIndex} of ${totalPages}`

  return (
    <PageShell>
      <div
        className="reader"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header — hidden on full-screen intro card */}
        {!isIntroCard && (
          <div className="reader__header">
            <button className="back-btn" onClick={() => navigate('/')}>
              ← Home
            </button>
            <div className="reader__book-info">
              {selectedBook.cover && (
                <img
                  src={publicUrl(selectedBook.cover)}
                  alt={selectedBook.title}
                  className="reader__cover-thumb"
                />
              )}
              <div className="reader__book-text">
                <span className="reader__book-title">{selectedBook.title}</span>
                <span className="reader__chapter-count">
                  Chapter {chapterIndex} · {pageLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="reader__loading">
            <div className="loading-spinner" />
          </div>
        ) : isIntroCard ? (
          /* Chapter intro card — pageIndex 0 */
          <div key={pageState.key} className="reader__page-content">
            <ChapterIntroCard
              chapterMeta={chapterMeta}
              chapterIndex={chapterIndex}
            />
          </div>
        ) : page ? (
          /* Story pages */
          <div key={pageState.key} className="reader__page-content">
            <div className="reader__chapter-header">
              {pageIndex === 1 && (
                <div className="chapter-number">Chapter {chapterIndex}</div>
              )}
              <h1 className="chapter-title">
                {page.chapterTitle || selectedBook.title}
              </h1>
              <div className="chapter-rule" />
            </div>

            <SceneRenderer
              scenes={[{ id: `page-${pageIndex}`, blocks: page.blocks }]}
              pov={pov}
            />

            <div className="reader__footer">
              <span className="reader__page-label">{pageLabel}</span>
            </div>

            {isFinished && (
              <div className="reader__finished">
                <div className="finished__mark">✦</div>
                <p className="finished__text">The End</p>
                <p className="finished__sub">{selectedBook.title}</p>
                <button
                  className="btn btn--ghost"
                  onClick={() => navigate('/')}
                >
                  Return Home
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="reader-empty">
            <p>Page not found.</p>
          </div>
        )}
      </div>
    </PageShell>
  )
}
