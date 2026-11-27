import { useEffect, useMemo, useRef, useState } from 'react';
import SearchIcon from '../assets/icons/search-filter.svg';
import CloseSmallIcon from '../assets/icons/close-small.svg';
import CloseSmallDarkIcon from '../assets/icons/close-small-dark.svg';
import CheckIcon from '../assets/icons/check.svg';
import './SearchableMultiSelect.css';

type OptionValue = string | number;

export interface MultiSelectOption<Value extends OptionValue> {
  value: Value;
  label: string;
  // If provided, an icon with this label is rendered next to the option
  iconLabel?: string;
}

interface SearchableMultiSelectProps<Value extends OptionValue> {
  options: MultiSelectOption<Value>[];
  selected: Value[];
  onChange: (values: Value[]) => void;
  placeholder: string;
  // Whether the selected option should display as pills below the search box, or inside the search box
  selectionDisplay: 'pills' | 'inline';
}

export default function SearchableMultiSelect<Value extends OptionValue>({
  options,
  selected,
  onChange,
  placeholder,
  selectionDisplay,
}: SearchableMultiSelectProps<Value>) {
  const [searchText, setSearchText] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // outer container for the component
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDropdownOpen) return;

    // close the dropdown if the user clicks outside of it
    const handleMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    // close the dropdown if the user clicks escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const filteredOptions = useMemo(() => {
    const normalized = searchText.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(normalized),
    );
  }, [options, searchText]);

  const selectedOptions = options.filter((opt) => selected.includes(opt.value));

  const toggleOption = (value: Value) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  const showPills = selectionDisplay === 'pills';

  return (
    <div className="searchable-multi-select" ref={containerRef}>
      <div className="searchable-multi-select-field">
        <div className="searchable-multi-select-box">
          <div className="searchable-multi-select-tags">
            {!showPills &&
              selectedOptions.map((opt) => (
                <span key={opt.value} className="searchable-multi-select-tag">
                  {opt.iconLabel && (
                    <span
                      className="searchable-multi-select-option-icon"
                      aria-hidden="true"
                    >
                      {opt.iconLabel}
                    </span>
                  )}
                  {opt.label}
                  <button
                    type="button"
                    className="searchable-multi-select-tag-remove"
                    onClick={() => toggleOption(opt.value)}
                    aria-label={`Remove ${opt.label}`}
                  >
                    <img src={CloseSmallIcon} alt="" />
                  </button>
                </span>
              ))}

            <input
              className="searchable-multi-select-input"
              placeholder={
                showPills || selectedOptions.length === 0 ? placeholder : ''
              }
              value={searchText}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchText(e.target.value);
                setIsDropdownOpen(true);
              }}
            />
          </div>
          <img
            src={SearchIcon}
            alt=""
            className="searchable-multi-select-search-icon"
          />
        </div>

        {isDropdownOpen && (
          <div className="searchable-multi-select-dropdown">
            {filteredOptions.length === 0 ? (
              <div className="searchable-multi-select-message">
                No results found.
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selected.includes(opt.value);

                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`searchable-multi-select-option${
                      isSelected
                        ? ' searchable-multi-select-option--selected'
                        : ''
                    }`}
                    onClick={() => toggleOption(opt.value)}
                    aria-pressed={isSelected}
                  >
                    <span
                      className="searchable-multi-select-checkbox"
                      aria-hidden="true"
                    >
                      {isSelected && <img src={CheckIcon} alt="" />}
                    </span>
                    {opt.label}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {showPills && selectedOptions.length > 0 && (
        <div className="searchable-multi-select-pills">
          {selectedOptions.map((opt) => (
            <span key={opt.value} className="searchable-multi-select-pill">
              {opt.label}
              <button
                type="button"
                className="searchable-multi-select-pill-remove"
                onClick={() => toggleOption(opt.value)}
                aria-label={`Remove ${opt.label}`}
              >
                <img src={CloseSmallDarkIcon} alt="" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
