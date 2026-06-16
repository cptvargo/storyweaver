import { useEffect } from 'react'
import { publicUrl } from '../../utils/publicUrl'

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i

function ConsequenceBlock({ block, onConsequence }) {
  useEffect(() => { onConsequence?.(block) }, [])
  return (
    <div className="block block--consequence">
      <span className="consequence__dot" />
      <span className="consequence__text">
        <strong>{block.character}</strong> {block.text}
      </span>
    </div>
  )
}

export default function ContentBlock({ block, pov, povAliases, characters, onChoice, currentChoice, hasTag, onConsequence }) {
  // Conditionally hidden blocks — only render if the player has the required tag
  if (block.condition && !hasTag?.(block.condition)) return null

  switch (block.type) {
    case 'narration':
      return <p className="block block--narration">{block.content}</p>

    case 'dialogue':
      return (
        <div className="block block--dialogue">
          <span className="dialogue__speaker">{block.speaker}</span>
          <p className="dialogue__line">&ldquo;{block.content}&rdquo;</p>
        </div>
      )

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
              <img src={publicUrl(avatar)} alt={block.sender} className="message__avatar" />
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

    default:
      return <p className="block">{block.content}</p>
  }
}
