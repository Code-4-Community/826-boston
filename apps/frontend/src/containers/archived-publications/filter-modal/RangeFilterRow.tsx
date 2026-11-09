// RangeFilterRow renders a labeled row with min and max inputs.
// Used for Inventory (number) and Publication Date (year).
// Empty string values mean "no bound" (no lower / no upper limit).

import { useEffect, useMemo, useRef, useState } from 'react';

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

interface DatePickerProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
}

function formatDate(value: string) {
  const date = parseDate(value);
  return date
    ? `${String(date.getMonth() + 1).padStart(2, '0')}/${String(
        date.getDate(),
      ).padStart(2, '0')}/${date.getFullYear()}`
    : '';
}

function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(date.getDate()).padStart(2, '0')}`;
}

function DatePicker({ value, placeholder, onChange }: DatePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedDate = parseDate(value);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(
    () =>
      selectedDate ??
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [month]);

  return (
    <div ref={rootRef} className="filter-date-picker">
      <button
        type="button"
        className={`filter-date-input${open ? ' filter-date-input--open' : ''}`}
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-label={placeholder}
      >
        <span className={value ? '' : 'filter-date-placeholder'}>
          {formatDate(value) || placeholder}
        </span>
        <span className="filter-calendar-icon" aria-hidden="true" />
      </button>
      {open && (
        <div className="filter-calendar" role="dialog" aria-label="Choose date">
          <div className="filter-calendar-header">
            <button
              type="button"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
              }
              aria-label="Previous month"
            >
              ‹
            </button>
            <span>
              {MONTHS[month.getMonth()]} {month.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
              }
              aria-label="Next month"
            >
              ›
            </button>
          </div>
          <div className="filter-calendar-weekdays">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="filter-calendar-days">
            {days.map((day) => {
              const iso = toIsoDate(day);
              const isSelected = iso === value;
              const isCurrentMonth = day.getMonth() === month.getMonth();
              return (
                <button
                  type="button"
                  key={iso}
                  className={`${
                    isCurrentMonth ? '' : 'filter-calendar-day--muted '
                  }${isSelected ? 'filter-calendar-day--selected' : ''}`}
                  onClick={() => {
                    onChange(iso);
                    setMonth(new Date(day.getFullYear(), day.getMonth(), 1));
                    setOpen(false);
                  }}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
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
    <div className="filter-tab-row filter-tab-row--labeled filter-date-row">
      <span className="filter-tab-label">{label}</span>
      <div className="filter-range-inputs">
        {inputType === 'text' ? (
          <DatePicker
            value={minValue}
            placeholder={minPlaceholder}
            onChange={onMinChange}
          />
        ) : (
          <input
            type={inputType}
            className="filter-range-input"
            placeholder={minPlaceholder}
            value={minValue}
            onChange={(e) => onMinChange(e.target.value)}
            min={inputType === 'number' ? 0 : undefined}
          />
        )}
        <span className="filter-range-separator">—</span>
        {inputType === 'text' ? (
          <DatePicker
            value={maxValue}
            placeholder={maxPlaceholder}
            onChange={onMaxChange}
          />
        ) : (
          <input
            type={inputType}
            className="filter-range-input"
            placeholder={maxPlaceholder}
            value={maxValue}
            onChange={(e) => onMaxChange(e.target.value)}
            min={inputType === 'number' ? 0 : undefined}
          />
        )}
      </div>
    </div>
  );
}
