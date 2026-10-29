import { useEffect, useMemo, useRef, useState } from 'react';

interface SearchableMultiSelectRowProps {
  label: string;
  placeholder: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export default function SearchableMultiSelectRow({
  label,
  placeholder,
  options,
  selected,
  onChange,
}: SearchableMultiSelectRowProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!controlRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);
  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.toLowerCase().includes(query.toLowerCase()),
      ),
    [options, query],
  );

  const toggle = (option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter((value) => value !== option)
        : [...selected, option],
    );
  };

  return (
    <div className="filter-search-row">
      <span className="filter-tab-label">{label}</span>
      <div ref={controlRef} className="filter-search-control">
        <div className="filter-search-input-wrapper">
          <input
            type="text"
            value={query}
            placeholder={placeholder}
            aria-label={label}
            onFocus={() => setIsOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
          />
          <span aria-hidden="true">⌕</span>
        </div>
        {selected.length > 0 && !isOpen && (
          <div className="filter-search-chips">
            {selected.map((option) => (
              <span key={option} className="filter-search-chip">
                {option}
                <button
                  type="button"
                  aria-label={`Remove ${option}`}
                  onClick={() =>
                    onChange(selected.filter((value) => value !== option))
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        {isOpen && (
          <div className="filter-search-options">
            {filteredOptions.map((option) => (
              <label key={option} className="filter-search-option">
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggle(option)}
                />
                <span>{option}</span>
              </label>
            ))}
            {filteredOptions.length === 0 && (
              <span className="filter-search-empty">No matches found</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
