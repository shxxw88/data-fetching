function NewButton({ onClick }) {
  return (
    <button className="new-button" onClick={onClick}>
      <span className="plus">+</span> 
      <span className="label">New Book</span>
    </button>
  );
}

export default NewButton;