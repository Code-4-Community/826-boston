interface FilterModalHeaderProps {
  onClose: () => void;
  title?: string;
  /** Pass null to hide the subtitle. */
  subtitle?: string | null;
  /** Renders this icon instead of the ✕ character. */
  closeIconSrc?: string;
}

export default function FilterModalHeader({
  onClose,
  title = 'Sort and Filter',
  subtitle = 'Sort and apply filters to your Library view',
  closeIconSrc,
}: FilterModalHeaderProps) {
  return (
    <div className="filter-modal-header">
      <div className="filter-modal-title-group">
        <h2 className="filter-modal-title">{title}</h2>
        {subtitle && <p className="filter-modal-subtitle">{subtitle}</p>}
      </div>
      <button
        type="button"
        className="filter-modal-close"
        onClick={onClose}
        aria-label="Close filter modal"
      >
        {closeIconSrc ? <img src={closeIconSrc} alt="" /> : '✕'}
      </button>
    </div>
  );
}
