import { useState } from "react";

export default function LoanManager({ books, loans, setLoans }) {
  const [borrower, setBorrower] = useState("");
  const [weeks, setWeeks] = useState(2);
  const [bookIndex, setBookIndex] = useState(0);

  // check which books are already loaned
  const isLoaned = (i) => loans.some((l) => l.bookIndex === i);

  // only show books that aren't loaned
  const available = books
    .map((b, i) => ({ i, title: b.title }))
    .filter((b) => !isLoaned(b.i));

  const allBorrowed = available.length === 0;

  const createLoan = (e) => {
    e.preventDefault();
    if (allBorrowed || !borrower.trim()) return;

    const w = Math.max(1, Math.min(4, Number(weeks) || 1));
    const due = new Date();
    due.setDate(due.getDate() + w * 7);

    setLoans((prev) => [
      ...prev,
      {
        id: `loan-${Date.now()}`,
        borrower: borrower.trim(),
        bookIndex: Number(bookIndex),
        weeks: w,
        dueISO: due.toISOString(),
      },
    ]);

    setBorrower("");
    setWeeks(2);
  };

  const fmt = (iso) => new Date(iso).toLocaleDateString();

  return (
    <div className="loan-manager">
      <h2>Manage Loans</h2>

      {/* show message if all books are borrowed */}
      {allBorrowed ? (
        <div className="loan-empty">All books are currently on loan.</div>
      ) : (
        <form className="loan-form" onSubmit={createLoan}>
          <div className="loan-field">
            <label>Name:</label>
            <input
              value={borrower}
              onChange={(e) => setBorrower(e.target.value)}
              required
            />
          </div>

          <div className="loan-field">
            <label>Book:</label>
            <select
              value={bookIndex}
              onChange={(e) => setBookIndex(Number(e.target.value))}
              required
            >
              {available.map((b) => (
                <option key={b.i} value={b.i}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          <div className="loan-field">
            <label>Loan period (weeks):</label>
            <input
              type="number"
              min="1"
              max="4"
              value={weeks}
              onChange={(e) => setWeeks(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="action-btn create-loan-btn">
            Submit
          </button>
        </form>
      )}

      {/* list of loaned books */}
      <div className="loaned-list">
        <h3>Currently on loan</h3>
        {loans.length === 0 ? (
          <p>No active loans.</p>
        ) : (
          <ul className="loan-items">
            {loans.map((loan) => {
              const book = books[loan.bookIndex];
              return (
                <li key={loan.id} className="loan-item">
                  <strong>{book?.title}</strong>
                  <div>Borrower: {loan.borrower}</div>
                  <div>Due date: {fmt(loan.dueISO)}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
