import { useState, useEffect } from "react";
import BookCard from "./components/BookCard";
import NewButton from "./components/NewButton";
import Modal from "./components/Modal";
import LoanManager from "./components/LoanManager";
import booksData from "../data/books.json";
import "./App.css";

function parsePrice(str) {
  if (!str) return NaN;
  const n = Number(String(str).replace(/[^0-9.]+/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

export default function App() {
  // Load books from localStorage if available
  const loadBooks = () => {
    const stored = localStorage.getItem("bookCatalog");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
  
    return booksData.map((b) => ({
      title: b.title || "",
      author: "",
      publisher: "",
      year: "",
      language: "",
      pages: "",
      price: b.price || "N/A",
      url: b.image || "",
      link: b.url || "",
      selected: false,
    }));
  };

  const [books, setBooks] = useState(loadBooks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", author: "", url: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [priceFilter, setPriceFilter] = useState("all");
  const [view, setView] = useState("books"); // "books" or "loans"
  
//Loan management state
const [loans, setLoans] = useState([]);

// LocalStorage sync
  useEffect(() => {
    localStorage.setItem("bookCatalog", JSON.stringify(books));
  }, [books]);

  // Selection toggle
  const handleSelect = (index) => {
    setBooks((prev) =>
      prev.map((b, i) => ({ ...b, selected: i === index ? !b.selected : false }))
    );
  };

  const handleDelete = () => {
    setBooks((prev) => prev.filter((b) => !b.selected));
  };

  const handleEdit = () => {
    const index = books.findIndex((b) => b.selected);
    if (index === -1) return;
    const b = books[index];
    setFormData({ title: b.title, author: b.author, url: b.url });
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBook = {
      title: formData.title,
      author: formData.author,
      price: "N/A",
      url: formData.url,
      link: formData.url,
      selected: false,
    };

    if (editIndex !== null) {
      setBooks((prev) =>
        prev.map((b, i) => (i === editIndex ? newBook : b))
      );
      setEditIndex(null);
    } else {
      setBooks((prev) => [...prev, newBook]);
    }

    setFormData({ title: "", author: "", url: "" });
    setIsModalOpen(false);
  };

  const hasSelection = books.some((b) => b.selected);

  // Filter 
  const filteredBooks = books.filter((b) => {
    const p = parsePrice(b.price);
    if (priceFilter === "all" || Number.isNaN(p)) return true;
    if (priceFilter === "lt10") return p < 10;
    if (priceFilter === "btw10_20") return p >= 10 && p <= 20;
    if (priceFilter === "gt20") return p > 20;
    return true;
  });

  return (
    <>
      <header>
        <h1>Book Catalog</h1>
      </header>
      <div className="view-toggle-container">
        <button
          className="view-toggle-btn"
          onClick={()=> setView((v) => (v === "books" ? "loans" : "books"))}
        >
          {view === "books" ? "Go to Loan Manager" : "Back to Book List"}
          </button>
      </div>

      {view === "books" ? (
      <div className="catalog">
        <div className="actions">
          <NewButton
            onClick={() => {
              setFormData({ title: "", author: "", url: "" });
              setEditIndex(null);
              setIsModalOpen(true);
            }}
          />
          <div className="action-buttons">
            <button
              className="action-btn update-btn"
              onClick={handleEdit}
              disabled={!hasSelection}
            >
              Update
            </button>
            <button
              className="action-btn delete-btn"
              onClick={handleDelete}
              disabled={!hasSelection}
            >
              Delete
            </button>
          </div>

          <div className="filters">
            <div className="filter-group">
              <label htmlFor="priceFilter">Filter by price</label>
              <select
                id="priceFilter"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="lt10">Under $10</option>
                <option value="btw10_20">$10–$20</option>
                <option value="gt20">Over $20</option>
              </select>
            </div>
          </div>
        </div>

        <div className="books-grid">
          {filteredBooks.map((book, i) => (
            <BookCard
              key={i}
              title={book.title}
              author={book.author}
              price={book.price}
              image={book.url}
              link={book.link}
              selected={book.selected}
              onClick={() => handleSelect(i)}
              isOnLoan={loans.some((l) => l.bookIndex === i)} 
            />
          ))}
        </div>
      </div>
      ) : (
      // Loan Manager View
        <LoanManager 
          books={books} 
          loans={loans}
          setLoans={setLoans}
          />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>{editIndex !== null ? "Edit Book" : "Add New Book"}</h2>
        <form onSubmit={handleSubmit} className="book-form">
          <label>Title:</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <label>Author:</label>
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
          <label>Cover URL:</label>
          <input
            name="url"
            value={formData.url}
            onChange={handleChange}
          />
          <div className="form-submit">
            <button
              type="submit"
              className={editIndex !== null ? "save-changes" : ""}
            >
              {editIndex !== null ? "Save Changes" : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      <footer>
        <p>&copy; Sharleen Wang 2025</p>
      </footer>
    </>
  );
}
