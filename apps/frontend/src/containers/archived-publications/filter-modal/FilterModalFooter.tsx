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
        Reset filters
      </button>
      <button
        type="button"
        className="filter-modal-btn filter-modal-btn--apply"
        onClick={onApply}
      >
        Save and Apply
      </button>
    </div>
  );
}
