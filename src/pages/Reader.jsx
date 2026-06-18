import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useChoiceState } from '../hooks/useChoiceState'
import { loadPage, ALL_BOOKS } from '../utils/storyEngine'
import { publicUrl } from '../utils/publicUrl'
import SceneRenderer from '../components/Story/SceneRenderer'
import ChapterIntroCard from '../components/Story/ChapterIntroCard'
import RememberToast from '../components/Story/RememberToast'
import PageShell from '../components/Layout/PageShell'

const SWIPE_THRESHOLD = 50

function makeKey(chapterIndex, pageIndex) {
  return pageIndex === 0 ? `intro-${chapterIndex}` : `${chapterIndex}-${pageIndex}`
}

export default function Reader() {
  const navigate = useNavigate()
  const [storedBook] = useLocalStorage('sw_selectedBook', null)
  const selectedBook = storedBook
    ? (ALL_BOOKS.find((b) => b.id === storedBook.id) ?? storedBook)
    : null

  const progressKey = `sw_progress_${selectedBook?.id ?? 'default'}`
  const [progress, setProgress] = useLocalStorage(progressKey, {
    chapterIndex: 1,
    pageIndex: 0,
  })

  const { makeChoice, getChoice, hasTag, addTag } = useChoiceState(selectedBook?.id ?? 'default')
  const [rememberMessage, setRememberMessage] = useState(null)

  const [pageState, setPageState] = useState({ key: null, data: null })
  const [tocOpen, setTocOpen] = useState(false)

  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const isInteractive = selectedBook?.bookType === 'interactive'
  const format = selectedBook?.format ?? 'chapters'
  const unitLabel = format === 'episodes' ? 'Episode' : 'Chapter'

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
  const loading = pageState.key !== currentKey
  const page = pageState.data

  // Interactive: check if this page has a choice and whether it's been answered
  const pageHasChoice = isInteractive && page?.blocks?.some(b => b.type === 'choice')
  const currentChoice = isInteractive ? getChoice(chapterIndex, pageIndex) : null
  const pendingChoice = pageHasChoice && currentChoice === null

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
    } else if (pendingChoice) {
      // Blocked — must choose first
      return
    } else if (pageHasChoice && currentChoice) {
      // Navigate to the chosen branch
      setProgress({ chapterIndex, pageIndex: currentChoice.goto })
    } else if (page?.nextPage) {
      // Explicit convergence routing
      setProgress({ chapterIndex, pageIndex: page.nextPage })
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

  const handleChoice = (option) => {
    makeChoice(chapterIndex, pageIndex, option)
    if (option.remember) {
      setRememberMessage(option.remember)
    }
  }

  const handleConsequence = (block) => {
    setRememberMessage(`${block.character} ${block.text}`)
    if (block.id) addTag(block.id)
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

  const isLastAvailablePage = chapterIndex >= totalChapters && pageIndex >= totalPages
  const chapterCountPlanned = selectedBook?.chapterCountPlanned ?? totalChapters
  const hasMoreChaptersPlanned = chapterCountPlanned > totalChapters

  const pov =
    page?.pov ??
    page?.blocks?.find((b) => b.type === 'internalThought')?.character ??
    selectedBook?.pov ??
    null

  const povAliases = selectedBook?.povAliases ?? []
  const characters = selectedBook?.characters ?? {}

  const pageLabel = isIntroCard
    ? `${unitLabel} Intro`
    : `Page ${pageIndex} of ${totalPages}`

  return (
    <PageShell>
      <div
        className="reader"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Remember toast */}
        {rememberMessage && (
          <RememberToast
            message={rememberMessage}
            onDone={() => setRememberMessage(null)}
          />
        )}

        {/* Header — hidden on full-screen intro card */}
        {!isIntroCard && (
          <div className="reader__header">
            <div className="reader__header-row">
              <button className="back-btn" onClick={() => navigate('/')}>
                ← Home
              </button>
              <button className="toc-btn" onClick={() => setTocOpen(true)}>
                {format === 'episodes' ? 'Episodes' : 'Chapters'}
              </button>
            </div>
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
                  {unitLabel} {chapterIndex} · {pageLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TOC / Episode list modal */}
        {tocOpen && (
          <div className="toc-overlay" onClick={() => setTocOpen(false)}>
            <div className="toc-panel" onClick={(e) => e.stopPropagation()}>
              <div className="toc-panel__header">
                <span className="toc-panel__title">
                  {format === 'episodes' ? 'Episodes' : 'Chapters'}
                </span>
                <button className="toc-panel__close" onClick={() => setTocOpen(false)}>✕</button>
              </div>
              <div className="toc-panel__list">
                {selectedBook.chapters
                  .filter((c) => c.chapterIndex <= totalChapters)
                  .map((chapter) => (
                    <button
                      key={chapter.chapterIndex}
                      className={`toc-chapter${chapter.chapterIndex === chapterIndex ? ' toc-chapter--active' : ''}`}
                      onClick={() => {
                        setProgress({ chapterIndex: chapter.chapterIndex, pageIndex: 0 })
                        setTocOpen(false)
                      }}
                    >
                      <span className="toc-chapter__num">{unitLabel} {chapter.chapterIndex}</span>
                      <span className="toc-chapter__name">{chapter.title}</span>
                    </button>
                  ))}
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
          <div key={pageState.key} className="reader__page-content">
            <ChapterIntroCard
              chapterMeta={chapterMeta}
              chapterIndex={chapterIndex}
              format={format}
            />
          </div>
        ) : page ? (
          <div key={pageState.key} className="reader__page-content">
            <div className="reader__chapter-header">
              {pageIndex === 1 && (
                <div className="chapter-number">{unitLabel} {chapterIndex}</div>
              )}
              <h1 className="chapter-title">
                {page.chapterTitle || selectedBook.title}
              </h1>
              <div className="chapter-rule" />
            </div>

            <SceneRenderer
              scenes={[{ id: `page-${pageIndex}`, blocks: page.blocks }]}
              pov={pov}
              povAliases={povAliases}
              characters={characters}
              onChoice={handleChoice}
              currentChoice={currentChoice}
              hasTag={hasTag}
              onConsequence={handleConsequence}
            />

            {/* Pending choice indicator */}
            {pendingChoice && (
              <p className="choice__pending-hint">Make your choice to continue.</p>
            )}

            <div className="reader__footer">
              <span className="reader__page-label">{pageLabel}</span>
            </div>

            {isLastAvailablePage && (
              <div className="reader__finished">
                <div className="finished__mark">✦</div>
                {hasMoreChaptersPlanned ? (
                  <>
                    <p className="finished__text">To Be Continued</p>
                    <p className="finished__sub">
                      {format === 'episodes' ? 'Next episode coming soon.' : 'More chapters coming soon.'}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="finished__text">The End</p>
                    <p className="finished__sub">{selectedBook.title}</p>
                  </>
                )}
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
