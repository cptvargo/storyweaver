import { useEffect } from 'react'
import { publicUrl } from '../../utils/publicUrl'

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i

function ConsequenceBlock({ block, onConsequence }) {
  useEffect(() => { onConsequence?.(block) }, [])
  return null
}

export default function ContentBlock({ block, pov, povAliases, characters, onChoice, currentChoice, hasTag, onConsequence }) {
  if (block.condition && !hasTag?.(block.condition)) return null
  if (block.conditionNot && hasTag?.(block.conditionNot)) return null

  switch (block.type) {
    case 'narration':
      return <p className="block block--narration">{block.content}</p>

    case 'dialogue': {
      const portrait = (characters ?? {})[block.speaker]
      return (
        <div className="block block--dialogue">
          {portrait ? (
            <div className="dialogue__row">
              <img src={publicUrl(portrait)} alt={block.speaker} className="dialogue__portrait" loading="eager" onError={(e) => { e.target.style.display = 'none' }} />
              <div className="dialogue__body">
                <span className="dialogue__speaker">{block.speaker}</span>
                <p className="dialogue__line">&ldquo;{block.content}&rdquo;</p>
              </div>
            </div>
          ) : (
            <>
              <span className="dialogue__speaker">{block.speaker}</span>
              <p className="dialogue__line">&ldquo;{block.content}&rdquo;</p>
            </>
          )}
        </div>
      )
    }

    case 'internalThought':
      return (
        <div className="block block--thought">
          <p>{block.content}</p>
        </div>
      )

    case 'callStart':
      return (
        <div className="block block--call-indicator">
          <div className="call-indicator__bar">
            <span className="call-indicator__icon">📞</span>
            <span className="call-indicator__name">{block.caller}</span>
            <span className="call-indicator__label">{block.direction === 'outgoing' ? 'Outgoing Call' : 'Incoming Call'}</span>
          </div>
        </div>
      )

    case 'callEnd':
      return (
        <div className="block block--call-end">
          <span className="call-end__label">Call ended</span>
        </div>
      )

    case 'message': {
      const isSent = pov != null && (block.sender === pov || (povAliases ?? []).includes(block.sender))
      const side = isSent ? 'right' : 'left'
      const avatar = !isSent ? (characters ?? {})[block.sender] : null
      const bubbles = (
        <>
          {block.image && (
            <div className="message__bubble message__bubble--image">
              <img src={publicUrl(block.image)} alt="photo" className="message__photo" />
            </div>
          )}
          {block.content && (
            <div className="message__bubble">{block.content}</div>
          )}
        </>
      )
      return (
        <div className={`block block--message message--${side}`}>
          {!isSent && <span className="message__sender">{block.sender}</span>}
          {avatar ? (
            <div className="message__row">
              <img src={publicUrl(avatar)} alt={block.sender} className="message__avatar" loading="eager" onError={(e) => { e.target.style.display = 'none' }} />
              <div className="message__bubble-group">{bubbles}</div>
            </div>
          ) : bubbles}
        </div>
      )
    }

    case 'action':
      return <p className="block block--action">{block.content}</p>

    case 'letter':
      return <p className="block block--letter">{block.content}</p>

    case 'embed':
      return IMAGE_EXT.test(block.src) ? (
        <div className="block block--embed">
          <img src={publicUrl(block.src)} alt={block.alt || ''} className="embed__image" />
        </div>
      ) : (
        <div className="block block--embed">
          <iframe
            className="embed__frame"
            src={block.src}
            title={block.title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )

    case 'choice': {
      const isLocked = currentChoice !== null
      return (
        <div className="block block--choice">
          {block.prompt && <p className="choice__prompt">{block.prompt}</p>}
          <div className="choice__options">
            {block.options.map((opt) => {
              const isSelected = currentChoice?.id === opt.id
              return (
                <button
                  key={opt.id}
                  className={`choice__btn${isSelected ? ' choice__btn--selected' : ''}${isLocked && !isSelected ? ' choice__btn--dimmed' : ''}`}
                  onClick={() => !isLocked && onChoice?.(opt)}
                  disabled={isLocked}
                >
                  {opt.label}
                  {isSelected && <span className="choice__check">▶</span>}
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    case 'consequence':
      return <ConsequenceBlock block={block} onConsequence={onConsequence} />

    case 'episodeStats': {
      return (
        <div className="block block--episode-stats">
          <div className="episode-stats__header">
            <span className="episode-stats__rule" />
            <span className="episode-stats__title">{block.title ?? block.heading}</span>
            <span className="episode-stats__rule" />
          </div>
          <div className="episode-stats__rows">
            {block.stats.map((stat, i) => {
              const value = stat.value ?? stat.options?.find(opt => hasTag?.(opt.condition))?.value
              if (!value) return null
              return (
                <div key={i} className="episode-stats__row">
                  <span className="episode-stats__label">{stat.label}</span>
                  <span className="episode-stats__value">{value}</span>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    case 'nextEpisode': {
      return (
        <div className="block block--next-episode">
          <div className="next-episode__header">
            <span className="next-episode__eyebrow">On the Next Episode</span>
          </div>
          <div className="next-episode__scenes">
            {block.scenes.map((scene, i) => (
              <p key={i} className="next-episode__scene">{scene.text}</p>
            ))}
          </div>
        </div>
      )
    }

    default:
      return <p className="block">{block.content}</p>
  }
}
