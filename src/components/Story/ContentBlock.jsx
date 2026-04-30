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

    case 'message': {
      const isSent = pov != null && block.sender === pov
      const side = isSent ? 'right' : 'left'
      return (
        <div className={`block block--message message--${side}`}>
          <span className="message__sender">{block.sender}</span>
          <div className="message__bubble">{block.content}</div>
        </div>
      )
    }

    case 'action':
      return <p className="block block--action">{block.content}</p>

    default:
      return <p className="block">{block.content}</p>
  }
}
