import { useEffect, useMemo, useRef, useState } from 'react';
import SearchIcon from '../assets/icons/search.svg';
import CloseSmallIcon from '../assets/icons/close-small.svg';
import CheckIcon from '../assets/icons/check.svg';
import './SearchableMultiSelect.css';

export interface MultiSelectOption<T extends string | number> {
  value: T;
  label: string;
}

interface SearchableMultiSelectProps<T extends string | number> {
  /** Names the search box for screen readers; the surrounding layout shows the visible label. */
  label: string;
  options: MultiSelectOption<T>[];
  selected: T[];
  onChange: (values: T[]) => void;
  placeholder: string;
  /** Shows a circle with the option's first letter on each selected tag (used for staff). */
  showAvatar?: boolean;
  isLoading?: boolean;
  /** When set, shown in the dropdown instead of the options (e.g. the options failed to load). */
  errorMessage?: string;
}

export default function SearchableMultiSelect<T extends string | number>({
  label,
  options,
  selected,
  onChange,
  placeholder,
  showAvatar = false,
  isLoading = false,
  errorMessage,
}: SearchableMultiSelectProps<T>) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // close the dropdown on a click outside it or on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(normalized),
    );
  }, [options, query]);

  const selectedOptions = options.filter((opt) => selected.includes(opt.value));

  const toggle = (value: T) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  };

  const renderDropdownContent = () => {
    if (errorMessage) {
      return (
        <div className="searchable-multi-select-message">{errorMessage}</div>
      );
    }
    if (isLoading) {
      return <div className="searchable-multi-select-message">Loading...</div>;
    }
    if (filteredOptions.length === 0) {
      return (
        <div className="searchable-multi-select-message">No results found</div>
      );
    }

    return filteredOptions.map((opt) => {
      const isSelected = selected.includes(opt.value);

      return (
        <button
          key={opt.value}
          type="button"
          className={`searchable-multi-select-option${
            isSelected ? ' searchable-multi-select-option--selected' : ''
          }`}
          onClick={() => toggle(opt.value)}
          aria-pressed={isSelected}
        >
          <span className="searchable-multi-select-checkbox" aria-hidden="true">
            {isSelected && <img src={CheckIcon} alt="" />}
          </span>
          {opt.label}
        </button>
      );
    });
  };

  return (
    <div className="searchable-multi-select" ref={wrapperRef}>
      <div className="searchable-multi-select-box">
        <div className="searchable-multi-select-tags">
          {selectedOptions.map((opt) => (
            <span key={opt.value} className="searchable-multi-select-tag">
              {showAvatar && (
                <span
                  className="searchable-multi-select-avatar"
                  aria-hidden="true"
                >
                  {opt.label.charAt(0).toUpperCase()}
                </span>
              )}
              {opt.label}
              <button
                type="button"
                className="searchable-multi-select-tag-remove"
                onClick={() => toggle(opt.value)}
                aria-label={`Remove ${opt.label}`}
              >
                <img src={CloseSmallIcon} alt="" />
              </button>
            </span>
          ))}

          <input
            className="searchable-multi-select-input"
            placeholder={selectedOptions.length === 0 ? placeholder : ''}
            aria-label={label}
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
          />
        </div>
        <img
          src={SearchIcon}
          alt=""
          className="searchable-multi-select-search-icon"
        />
      </div>

      {isOpen && (
        <div className="searchable-multi-select-dropdown">
          {renderDropdownContent()}
        </div>
      )}
    </div>
  );
}
