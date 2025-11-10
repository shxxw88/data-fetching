import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function loadBooksFallback() {
  try {
    const stored = localStorage.getItem("bookCatalog");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function BookDetails({ books = [] }) {
  const { id } = useParams();
  const idx = Number(id);
  const list = books.length ? books : loadBooksFallback();
  const book = Number.isFinite(idx) ? list[idx] : null;

  const [similar, setSimilar] = useState([]);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState("");

  useEffect(() => {
    if (!book) return;
    const baseQuery =
      (book.author && String(book.author).trim()) ||
      (book.title && String(book.title).trim()) ||
      (book.publisher && String(book.publisher).trim());

    if (!baseQuery) return;

    const q = encodeURIComponent(baseQuery);
    setSimLoading(true);
    setSimError("");
    fetch(`https://api.itbook.store/1.0/search/${q}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data?.books) ? data.books : [];
        const cleaned = items
          .filter((b) => b?.title && b.title !== book.title)
          .slice(0, 6);
        setSimilar(cleaned);
      })
      .catch((err) => setSimError(err.message || "Failed to load similar books"))
      .finally(() => setSimLoading(false));
  }, [id]); 

  if (!book) {
    return (
      <div className="book-details-container">
        <a href="/" className="back-btn">Back</a>
        <p>Book not found.</p>
      </div>
    );
  }

  const { title, author, publisher, year, language, pages, price, url } = book;

  const rows = [
    ["Author:", author],
    ["Publisher:", publisher],
    ["Published:", year],
    ["Language:", language],
    ["Pages:", pages],
    ["Price:", price || "N/A"],
  ];

  return (
    <div className="book-details-container">
      <div className="back-btn-container">
        <a href="/" className="back-btn">Back</a>
      </div>

      <div className="book-details-shell">
        <div className="details-cover">
          {url ? (
            <img src={url} alt={`Cover of ${title}`} />
          ) : (
            <div className="details-cover--placeholder">No cover</div>
          )}
        </div>

        <div className="details-info">
          <h2 className="details-title">{title}</h2>

          {rows.map(([label, value]) => (
            <div className="details-row" key={label}>
              <div className="details-label">{label}</div>
              <div className="details-value">{value || "—"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Similar books */}
      <section className="similar-section">
        <h3 className="similar-heading">Similar Books</h3>

        {simLoading && <p className="similar-status">Loading…</p>}
        {simError && <p className="similar-status error">Error: {simError}</p>}

        {!simLoading && !simError && similar.length === 0 && (
          <p className="similar-status">No similar results found.</p>
        )}

        {!simLoading && !simError && similar.length > 0 && (
          <div className="books-grid">
            {similar.map((b) => (
              <div className="book-card" key={b.isbn13}>
                {b.image && <img src={b.image} alt={`Cover of ${b.title}`} />}

                <div className="book-details">
                  <div className="book-title">{b.title}</div>
                  <div className="book-price">{b.price || "N/A"}</div>

                  <a
                    href={b.url}
                    target="_blank"
                    rel="noreferrer"
                    className="book-link"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
