interface FilterModalHeaderProps {
  onClose: () => void;
}

export default function FilterModalHeader({ onClose }: FilterModalHeaderProps) {
  return (
    <div className="filter-modal-header">
      <div className="filter-modal-title-group">
        <h2 className="filter-modal-title">Sort and Filter</h2>
        <p className="filter-modal-subtitle">
          Sort and apply filters to your Library view
        </p>
      </div>
      <button
        type="button"
        className="filter-modal-close"
        onClick={onClose}
        aria-label="Close filter modal"
      >
        ✕
      </button>
    </div>
  );
}
