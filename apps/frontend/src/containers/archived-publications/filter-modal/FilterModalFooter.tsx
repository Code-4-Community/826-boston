interface FilterModalFooterProps {
  onApply: () => void;
  onClear: () => void;
  /** Greys out Save and Apply, e.g. while the filters can't be applied as they are. */
  applyDisabled?: boolean;
}

export default function FilterModalFooter({
  onApply,
  onClear,
  applyDisabled = false,
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
        disabled={applyDisabled}
      >
        Save and Apply
      </button>
    </div>
  );
}
