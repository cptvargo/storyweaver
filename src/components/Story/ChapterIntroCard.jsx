import { publicUrl } from '../../utils/publicUrl'

export default function ChapterIntroCard({ chapterMeta, chapterIndex }) {
  const title = chapterMeta?.title ?? `Chapter ${chapterIndex}`
  const mood = chapterMeta?.mood ?? null
  const image = chapterMeta?.image ?? null

  return (
    <div className="chapter-intro">
      {image && (
        <div className="chapter-intro__image-wrap">
          <img src={publicUrl(image)} alt={title} className="chapter-intro__image" />
          <div className="chapter-intro__image-fade" />
        </div>
      )}

      <div className="chapter-intro__content">
        <div className="chapter-intro__eyebrow">Chapter {chapterIndex}</div>
        <h1 className="chapter-intro__title">{title}</h1>
        {mood && <p className="chapter-intro__mood">{mood}</p>}
        <div className="chapter-intro__rule" />
        <p className="chapter-intro__hint">Swipe to begin</p>
      </div>
    </div>
  )
}
