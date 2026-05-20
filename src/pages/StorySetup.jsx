import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { matchBook } from '../utils/storyEngine'
import QuestionCard from '../components/Onboarding/QuestionCard'
import genreData from '../data/genres.json'

const STEPS = [
  {
    key: 'genre',
    label: 'Genre',
    question: 'What genre calls to you?',
    options: genreData.genres,
  },
  {
    key: 'tone',
    label: 'Tone',
    question: 'What feeling do you want to carry?',
    options: genreData.tones,
  },
  {
    key: 'mood',
    label: 'Mood',
    question: 'What kind of story are you searching for?',
    options: genreData.moods,
  },
]

export default function StorySetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ genre: null, tone: null, mood: null })

  const [, setStoredAnswers] = useLocalStorage('sw_answers', null)
  const [, setSelectedBook] = useLocalStorage('sw_selectedBook', null)
  const [, setProgress] = useLocalStorage('sw_progress', null)
  const [, setOnboardingDone] = useLocalStorage('sw_onboardingDone', false)

  const current = STEPS[step]
  const currentAnswer = answers[current.key]
  const isLast = step === STEPS.length - 1
  const progressPct = ((step + 1) / STEPS.length) * 100

  const handleSelect = (id) => {
    setAnswers((prev) => ({ ...prev, [current.key]: id }))
  }

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1)
    else navigate('/')
  }

  const handleNext = () => {
    if (!currentAnswer) return
    if (!isLast) {
      setStep((s) => s + 1)
    } else {
      const book = matchBook(answers)
      setStoredAnswers(answers)
      setSelectedBook(book)
      setProgress({ chapterIndex: 1, pageIndex: 0 })
      setOnboardingDone(true)
      navigate('/reader')
    }
  }

  return (
    <div className="setup">
      {/* Thin gold progress bar */}
      <div className="setup__bar" style={{ width: `${progressPct}%` }} />

      {/* Ambient glow */}
      <div className="setup__atmosphere" aria-hidden="true" />

      {/* Top nav */}
      <div className="setup__topnav">
        <button className="setup__back" onClick={handleBack}>← Back</button>
        <div className="setup__step-nodes">
          {STEPS.map((s, i) => (
            <div key={i} className="setup__step-node-wrap">
              <div className={`setup__step-node${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}>
                {i < step ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1.5,5 4,7.5 8.5,2" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`setup__step-connector${i < step ? ' done' : ''}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Animated question area — key swap triggers enter animation */}
      <div key={step} className="setup__question-area">
        <span className="setup__step-tag">{current.label}</span>
        <QuestionCard
          question={current.question}
          options={current.options}
          selected={currentAnswer}
          onSelect={handleSelect}
        />
      </div>

      {/* CTA */}
      <div className="setup__footer">
        <button
          className={`btn btn--primary btn--large setup__cta${isLast ? ' setup__cta--final' : ''}`}
          onClick={handleNext}
          disabled={!currentAnswer}
        >
          {isLast ? 'Find My Story' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
