import { publicUrl } from '../../utils/publicUrl'

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg)$/i

export default function ContentBlock({ block, pov }) {
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
      const isSent = pov != null && block.sender === pov
      const side = isSent ? 'right' : 'left'
      return (
        <div className={`block block--message message--${side}`}>
          {!isSent && <span className="message__sender">{block.sender}</span>}
          {block.image && (
            <div className="message__bubble message__bubble--image">
              <img src={publicUrl(block.image)} alt="photo" className="message__photo" />
            </div>
          )}
          {block.content && (
            <div className="message__bubble">{block.content}</div>
          )}
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

    default:
      return <p className="block">{block.content}</p>
  }
}
