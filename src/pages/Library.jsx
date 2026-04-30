import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ALL_BOOKS } from "../utils/storyEngine";
import logo from '/storyweaver_logo.png'
import BookCoverCard from "../components/Library/BookCoverCard";
import BookDetail from "../components/Library/BookDetail";

const BOOKS_PER_PAGE = 6;

export default function Library() {
  const navigate = useNavigate();
  const [, setSelectedBook] = useLocalStorage("sw_selectedBook", null);
  const [, setProgress] = useLocalStorage("sw_progress", null);
  const [detailBook, setDetailBook] = useState(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(ALL_BOOKS.length / BOOKS_PER_PAGE);
  const start = (page - 1) * BOOKS_PER_PAGE;
  const paginatedBooks = ALL_BOOKS.slice(start, start + BOOKS_PER_PAGE);

  const handleBeginReading = (book) => {
    setSelectedBook(book);
    setProgress({ chapterIndex: 1, pageIndex: 0 });
    navigate("/reader");
  };

  return (
    <div className="library">
      <div className="library__atmosphere" aria-hidden="true" />

      <div className="library__topnav">
        <button className="library__back" onClick={() => navigate("/")}>
          ← Home
        </button>

        <img
          src={logo}
          alt="StoryWeaver"
          className="library__logo"
        />
      </div>

      <div className="library__header">
        <h1 className="library__title">The Library</h1>
        <p className="library__subtitle">Curated stories, ready to read.</p>
      </div>

      <div className="library__grid">
        {paginatedBooks.map((book) => (
          <BookCoverCard
            key={book.id}
            book={book}
            onClick={() => setDetailBook(book)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="library__pagination">
          <button
            className="library__page-btn library__page-btn--arrow"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ←
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`library__page-btn${
                page === i + 1 ? " library__page-btn--active" : ""
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="library__page-btn library__page-btn--arrow"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            →
          </button>

          <span className="library__page-count">
            {start + 1}–{Math.min(start + BOOKS_PER_PAGE, ALL_BOOKS.length)} of{" "}
            {ALL_BOOKS.length} {ALL_BOOKS.length === 1 ? "story" : "stories"}
          </span>
        </div>
      )}

      {detailBook && (
        <BookDetail
          book={detailBook}
          onClose={() => setDetailBook(null)}
          onRead={handleBeginReading}
        />
      )}
    </div>
  );
}
