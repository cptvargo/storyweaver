import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import logo from '/storyweaver_logo.png'

export default function Home() {
  const navigate = useNavigate()
  const [progress] = useLocalStorage('sw_progress', null)
  const [selectedBook] = useLocalStorage('sw_selectedBook', null)

  const hasProgress = progress !== null && selectedBook !== null

  return (
    <div className="home">
      {/* Layered atmospheric background — pure CSS, no images */}
      <div className="home__atmosphere" aria-hidden="true">
        <div className="home__glow home__glow--purple" />
        <div className="home__glow home__glow--gold" />
      </div>

      <div className="home__hero">
        <div className="home__halo" aria-hidden="true" />
        <img
          src={logo}
          alt="StoryWeaver — Weaving stories from moments that matter."
          className="home__logo-img"
        />
      </div>

      <div className="home__identity">
        <div className="home__ornament" aria-hidden="true">
          <span className="home__ornament-line" />
          <span className="home__ornament-mark">✦</span>
          <span className="home__ornament-line" />
        </div>
        <p className="home__tagline">Weaving stories from moments that matter.</p>
      </div>

      <div className="home__actions">
        <button
          className="btn btn--primary btn--large home__cta"
          onClick={() => navigate('/setup')}
        >
          Start a New Moment
        </button>

        {hasProgress && (
          <button
            className="btn btn--ghost btn--large"
            onClick={() => navigate('/reader')}
          >
            Continue Reading
            <span className="btn__sub">
              {selectedBook.title} · Ch. {progress.chapterIndex}
            </span>
          </button>
        )}

        <button
          className="home__link"
          onClick={() => navigate('/library')}
        >
          Browse the Library
        </button>
      </div>
    </div>
  )
}
