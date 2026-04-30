export default function BookDetail({ book, onClose, onRead }) {
  if (!book) return null;

  return (
    <div className="book-detail">
      <button className="book-detail__backdrop" onClick={onClose} />

      <div className="book-detail__panel">
        <button className="book-detail__close" onClick={onClose}>
          ×
        </button>

        <div className="book-detail__cover-wrap">
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="book-detail__cover"
            />
          ) : (
            <div className="book-detail__placeholder">{book.title}</div>
          )}
        </div>

        <div className="book-detail__body">
          <span className="book-detail__genre">{book.genre}</span>
          <h2>{book.title}</h2>
          <p className="book-detail__subtitle">{book.subtitle}</p>
          <p className="book-detail__description">{book.description}</p>

          <div className="book-detail__meta">
            <span>{book.readingTime}</span>
            <span>{book.totalChapters} chapters</span>
          </div>

          <button className="btn btn--primary" onClick={() => onRead(book)}>
            Read This Story
          </button>
        </div>
      </div>
    </div>
  );
}
