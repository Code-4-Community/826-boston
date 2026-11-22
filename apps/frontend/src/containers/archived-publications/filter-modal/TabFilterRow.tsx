interface TabOption<T extends string> {
  value: T;
  displayLabel: string;
}

interface BaseProps<T extends string> {
  /** Row label shown in the left column. Omit for full-width rows (e.g. Sort). */
  label?: string;
  options: TabOption<T>[];
  /** When true, clicking the active tab deselects it (used for filters, not sort). */
  allowDeselect?: boolean;
}

interface SingleSelectProps<T extends string> extends BaseProps<T> {
  multiSelect?: false;
  selected: T | null;
  onChange: (value: T | null) => void;
}

interface MultiSelectProps<T extends string> extends BaseProps<T> {
  multiSelect: true;
  selected: T[];
  onChange: (values: T[]) => void;
}

type TabFilterRowProps<T extends string> =
  | SingleSelectProps<T>
  | MultiSelectProps<T>;

export default function TabFilterRow<T extends string>(
  props: TabFilterRowProps<T>,
) {
  const { label, options, allowDeselect = false } = props;

  const isActive = (value: T): boolean => {
    if (props.multiSelect) return props.selected.includes(value);
    return props.selected === value;
  };

  const handleClick = (value: T) => {
    if (props.multiSelect) {
      const next = props.selected.includes(value)
        ? props.selected.filter((v) => v !== value)
        : [...props.selected, value];
      props.onChange(next);
    } else {
      if (allowDeselect && props.selected === value) {
        props.onChange(null);
      } else {
        props.onChange(value);
      }
    }
  };

  return (
    <div className={`filter-tab-row${label ? ' filter-tab-row--labeled' : ''}`}>
      {label && <span className="filter-tab-label">{label}</span>}
      <div className="filter-tab-options">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`filter-tab-option${
              isActive(opt.value) ? ' filter-tab-option--active' : ''
            }`}
            aria-pressed={isActive(opt.value)}
            onClick={() => handleClick(opt.value)}
          >
            {opt.displayLabel}
          </button>
        ))}
      </div>
    </div>
  );
}
