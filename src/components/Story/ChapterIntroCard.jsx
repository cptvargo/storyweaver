import { publicUrl } from '../../utils/publicUrl'

export default function ChapterIntroCard({ chapterMeta, chapterIndex }) {
  const title = chapterMeta?.title ?? `Chapter ${chapterIndex}`
  const mood = chapterMeta?.mood ?? null
  const image = chapterMeta?.image ?? null

  return (
    <div className="chapter-intro">
      {image && (
        <img src={publicUrl(image)} alt={title} className="chapter-intro__image" />
      )}
      <div className="chapter-intro__overlay">
        <div className="chapter-intro__text">
          <div className="chapter-intro__eyebrow">Chapter {chapterIndex}</div>
          <h1 className="chapter-intro__title">{title}</h1>
          {mood && <p className="chapter-intro__mood">{mood}</p>}
          <p className="chapter-intro__hint">Swipe to begin</p>
        </div>
      </div>
    </div>
  )
}
