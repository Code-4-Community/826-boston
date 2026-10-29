interface FilterModalFooterProps {
  onApply: () => void;
  onClear: () => void;
}

export default function FilterModalFooter({
  onApply,
  onClear,
}: FilterModalFooterProps) {
  return (
    <div className="filter-modal-footer">
      <button
        type="button"
        className="filter-modal-btn filter-modal-btn--clear"
        onClick={onClear}
      >
        Clear Filters
      </button>
      <button
        type="button"
        className="filter-modal-btn filter-modal-btn--apply"
        onClick={onApply}
      >
        Apply
      </button>
    </div>
  );
}
