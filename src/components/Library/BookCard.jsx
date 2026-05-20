// Displays a single book's metadata in a card format
export default function BookCard({ book, onSelect }) {
  return (
    <div className="book-card">
      {book.cover && (
        <div className="book-card__cover-wrap">
          <img src={book.cover} alt={book.title} className="book-card__cover" />
        </div>
      )}
      <div className="book-card__body">
        <div className="book-card__genre">{book.genre}</div>
        <h2 className="book-card__title">{book.title}</h2>
        <p className="book-card__subtitle">{book.subtitle}</p>
        <p className="book-card__description">{book.description}</p>
        <div className="book-card__meta">
          <span>{book.readingTime}</span>
          <span>{book.totalChapters} chapters</span>
        </div>
        {onSelect && (
          <button className="btn btn--primary" onClick={() => onSelect(book)}>
            Read This Story
          </button>
        )}
      </div>
    </div>
  )
}
