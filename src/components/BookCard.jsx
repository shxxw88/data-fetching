function BookCard({ 
  id,
  title, 
  price, 
  image, 
  selected, 
  onClick,
  isOnLoan
}) {
  return (
    <div className={`book-card ${selected ? "selected" : ""}`} onClick={onClick}>
      {isOnLoan && <div className="loan-badge">On Loan</div>}
      {image && <img src={image} alt={`Cover of ${title}`} />}

      <div className="book-details">
        <div className="book-title">{title}</div>
        <div className="book-price">{price || "N/A"}</div>
        <a
          href={`/book/${id}`}
          className="book-link"
          onClick={(e) => e.stopPropagation()} /* prevent selection toggle */
        >
          View details
        </a>
      </div>
    </div>
  );
}

export default BookCard;
