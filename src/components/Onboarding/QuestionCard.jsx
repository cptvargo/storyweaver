import { ICONS } from './OnboardingIcons'

export default function QuestionCard({ question, options, selected, onSelect }) {
  return (
    <div className="question-card">
      <h2 className="question-label">{question}</h2>
      <div className="option-grid">
        {options.map((opt) => {
          const Icon = ICONS[opt.id]
          const isActive = selected === opt.id
          return (
            <button
              key={opt.id}
              className={`option-btn${isActive ? ' option-btn--active' : ''}`}
              onClick={() => onSelect(opt.id)}
              type="button"
            >
              <span className="option-icon-wrap">
                {Icon && <Icon />}
              </span>
              <span className="option-label">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
