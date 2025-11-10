import { useState } from "react";

function BookCard({ 
  title, 
  price, 
  image, 
  link, 
  author, 
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
          href={link}
          target="_blank"
          rel="noreferrer"
          className="book-link"
          onClick={(e) => e.stopPropagation()} /* don't toggle when clicking link */
        >
          Learn more
        </a>
      </div>
    </div>
  );
}

export default BookCard;

