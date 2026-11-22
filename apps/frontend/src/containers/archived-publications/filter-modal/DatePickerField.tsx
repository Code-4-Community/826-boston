import { useEffect, useRef, useState } from 'react';
import CalendarIcon from '../../../assets/icons/calendar.svg';
import PrevMonthIcon from '../../../assets/icons/date-picker-prev.svg';
import NextMonthIcon from '../../../assets/icons/date-picker-next.svg';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// dates are kept as yyyy-mm-dd strings and built from local parts, so no timezone
// conversion can shift the day; the year is padded so a typed 0202 stays valid ISO
function toIso(year: number, month: number, day: number): string {
  const yyyy = String(year).padStart(4, '0');
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function isoToDisplay(iso: string): string {
  const [year, month, day] = iso.split('-');
  return iso ? `${month}/${day}/${year}` : '';
}

// "12252025" or "12/25/2025" -> "12/25/2025" while the user is still typing
function formatTyped(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

// null unless the text is a complete, real calendar date (rejects 02/31/2025)
function displayToIso(display: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(display);
  if (!match) return null;
  const month = Number(match[1]) - 1;
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month, day);
  const isReal =
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day;
  return isReal ? toIso(year, month, day) : null;
}

interface CalendarCell {
  iso: string;
  day: number;
  inMonth: boolean;
}

// whole weeks (Sunday first) covering the month, including the neighbouring days
function buildWeeks(year: number, month: number): CalendarCell[][] {
  const leading = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekCount = Math.ceil((leading + daysInMonth) / 7);

  const weeks: CalendarCell[][] = [];
  for (let week = 0; week < weekCount; week++) {
    const cells: CalendarCell[] = [];
    for (let weekday = 0; weekday < 7; weekday++) {
      // Date normalises out-of-range days into the adjacent months
      const date = new Date(year, month, 1 - leading + week * 7 + weekday);
      cells.push({
        iso: toIso(date.getFullYear(), date.getMonth(), date.getDate()),
        day: date.getDate(),
        inMonth: date.getMonth() === month,
      });
    }
    weeks.push(cells);
  }
  return weeks;
}

function monthStartFor(iso: string): Date {
  const parts = iso ? iso.split('-').map(Number) : null;
  const base = parts ? new Date(parts[0], parts[1] - 1, 1) : new Date();
  return new Date(base.getFullYear(), base.getMonth(), 1);
}

interface DatePickerFieldProps {
  /** yyyy-mm-dd, or '' when empty. */
  value: string;
  onChange: (iso: string) => void;
  ariaLabel: string;
  /** Outlines the box in red, e.g. when the date doesn't fit with the other end of a range. */
  hasError?: boolean;
}

export default function DatePickerField({
  value,
  onChange,
  ariaLabel,
  hasError = false,
}: DatePickerFieldProps) {
  const [text, setText] = useState(isoToDisplay(value));
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => monthStartFor(value));
  const wrapperRef = useRef<HTMLDivElement>(null);

  // follow the value when it changes from outside, e.g. "Reset filters"
  useEffect(() => {
    setText(isoToDisplay(value));
  }, [value]);

  // close the calendar on a click outside it or on Escape
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

  const handleTyping = (raw: string) => {
    const formatted = formatTyped(raw);
    setText(formatted);

    if (formatted === '') {
      onChange('');
      return;
    }
    const iso = displayToIso(formatted);
    if (iso) {
      onChange(iso);
      setViewMonth(monthStartFor(iso));
    }
  };

  const toggleCalendar = () => {
    if (!isOpen) setViewMonth(monthStartFor(value));
    setIsOpen((open) => !open);
  };

  const shiftMonth = (delta: number) => {
    setViewMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + delta, 1),
    );
  };

  const pickDay = (iso: string) => {
    onChange(iso);
    setText(isoToDisplay(iso));
    setIsOpen(false);
  };

  const weeks = buildWeeks(viewMonth.getFullYear(), viewMonth.getMonth());
  const monthLabel = viewMonth.toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="filter-date-field" ref={wrapperRef}>
      <div
        className={`filter-date-box${
          hasError ? ' filter-date-box--error' : ''
        }`}
      >
        <input
          className="filter-date-input"
          type="text"
          inputMode="numeric"
          placeholder="mm/dd/yyyy"
          aria-label={ariaLabel}
          aria-invalid={hasError}
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          // drop a half-typed date so the box always shows what is applied
          onBlur={() => setText(isoToDisplay(value))}
        />
        <button
          type="button"
          className="filter-date-toggle"
          onClick={toggleCalendar}
          aria-label={`Open calendar for ${ariaLabel}`}
          aria-expanded={isOpen}
        >
          <img src={CalendarIcon} alt="" />
        </button>
      </div>

      {isOpen && (
        <div
          className="filter-date-popover"
          role="dialog"
          aria-label="Calendar"
        >
          <div className="filter-date-popover-header">
            <button
              type="button"
              className="filter-date-nav"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
            >
              <img src={PrevMonthIcon} alt="" />
            </button>
            <span className="filter-date-month">{monthLabel}</span>
            <button
              type="button"
              className="filter-date-nav"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
            >
              <img src={NextMonthIcon} alt="" />
            </button>
          </div>

          <div className="filter-date-grid">
            <div className="filter-date-week">
              {WEEKDAYS.map((weekday) => (
                <span key={weekday} className="filter-date-weekday">
                  {weekday}
                </span>
              ))}
            </div>
            {weeks.map((week) => (
              <div key={week[0].iso} className="filter-date-week">
                {week.map((cell) => (
                  <button
                    key={cell.iso}
                    type="button"
                    className={`filter-date-day${
                      cell.inMonth ? '' : ' filter-date-day--outside'
                    }${cell.iso === value ? ' filter-date-day--selected' : ''}`}
                    onClick={() => pickDay(cell.iso)}
                    aria-pressed={cell.iso === value}
                    aria-label={isoToDisplay(cell.iso)}
                  >
                    {cell.day}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
