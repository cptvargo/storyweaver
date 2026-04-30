import { publicUrl } from '../../utils/publicUrl'

export default function BookCoverCard({ book, onClick }) {
  return (
    <button className="book-cover-card" onClick={onClick}>
      <div className="book-cover-card__image-wrap">
        {book.cover ? (
          <img
            src={publicUrl(book.cover)}
            alt={book.title}
            className="book-cover-card__image"
          />
        ) : (
          <div className="book-cover-card__placeholder">
            <span>{book.title}</span>
          </div>
        )}

        <div className="book-cover-card__fade" />
        <div className="book-cover-card__label">
          <span className="book-cover-card__genre">{book.genre}</span>
          <h2>{book.title}</h2>
        </div>
      </div>
    </button>
  )
}
