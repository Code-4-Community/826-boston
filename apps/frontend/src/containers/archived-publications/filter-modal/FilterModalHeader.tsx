interface FilterModalHeaderProps {
  onClose: () => void;
}

export default function FilterModalHeader({ onClose }: FilterModalHeaderProps) {
  return (
    <div className="filter-modal-header">
      <h2 className="filter-modal-title">Sort and Filter Results</h2>
      <button
        type="button"
        className="filter-modal-close"
        onClick={onClose}
        aria-label="Close filter modal"
      >
        ×
      </button>
    </div>
  );
}
