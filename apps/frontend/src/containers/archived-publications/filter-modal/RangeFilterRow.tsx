// RangeFilterRow renders a labeled row with min and max inputs.
// Used for Inventory (number) and Publication Date (year).
// Empty string values mean "no bound" (no lower / no upper limit).

interface RangeFilterRowProps {
  label: string;
  minValue: string;
  maxValue: string;
  minPlaceholder: string;
  maxPlaceholder: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  inputType?: 'text' | 'number';
}

export default function RangeFilterRow({
  label,
  minValue,
  maxValue,
  minPlaceholder,
  maxPlaceholder,
  onMinChange,
  onMaxChange,
  inputType = 'number',
}: RangeFilterRowProps) {
  return (
    <div className="filter-tab-row filter-tab-row--labeled">
      <span className="filter-tab-label">{label}</span>
      <div className="filter-range-inputs">
        <input
          type={inputType}
          className="filter-range-input"
          placeholder={minPlaceholder}
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
          min={inputType === 'number' ? 0 : undefined}
        />
        <span className="filter-range-separator">—</span>
        <input
          type={inputType}
          className="filter-range-input"
          placeholder={maxPlaceholder}
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
          min={inputType === 'number' ? 0 : undefined}
        />
      </div>
    </div>
  );
}
