import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './DatePicker.css';

// Custom date picker that replaces the native <input type="date"> popup so the
// calendar matches the app's design. Value format matches the native input:
// 'YYYY-MM-DD', or '' when empty.

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
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const POPOVER_WIDTH = 282;

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  'aria-label'?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

const toIso = (y: number, m: number, d: number) =>
  `${y}-${pad(m + 1)}-${pad(d)}`;

const parseIso = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? '');
  if (!match) return null;
  return { y: +match[1], m: +match[2] - 1, d: +match[3] };
};

const isoToDisplay = (value: string) => {
  const parsed = parseIso(value);
  return parsed ? `${pad(parsed.m + 1)}/${pad(parsed.d)}/${parsed.y}` : '';
};

// Parses a complete 'MM/DD/YYYY' string into ISO, or null if invalid.
const displayToIso = (text: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return null;
  const m = +match[1] - 1;
  const d = +match[2];
  const y = +match[3];
  const date = new Date(y, m, d);
  if (date.getFullYear() !== y || date.getMonth() !== m || date.getDate() !== d)
    return null;
  return toIso(y, m, d);
};

// Inserts slashes as the user types digits: 12252025 -> 12/25/2025.
const autoFormat = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export default function DatePicker({
  value,
  onChange,
  className = '',
  wrapperClassName = '',
  disabled = false,
  placeholder = 'mm/dd/yyyy',
  'aria-label': ariaLabel,
}: DatePickerProps) {
  const [text, setText] = useState(isoToDisplay(value));
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const today = new Date();
  const initial = parseIso(value);
  const [view, setView] = useState({
    y: initial?.y ?? today.getFullYear(),
    m: initial?.m ?? today.getMonth(),
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setText(isoToDisplay(value));
  }, [value]);

  const openCalendar = () => {
    if (disabled) return;
    const parsed = parseIso(value);
    setView({
      y: parsed?.y ?? today.getFullYear(),
      m: parsed?.m ?? today.getMonth(),
    });
    setOpen(true);
  };

  // Rendered in a portal with fixed positioning so modals with overflow
  // don't clip the calendar.
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      const popoverHeight = popoverRef.current?.offsetHeight ?? 320;
      const below = rect.bottom + 6;
      const top =
        below + popoverHeight > window.innerHeight &&
        rect.top - popoverHeight - 6 > 0
          ? rect.top - popoverHeight - 6
          : below;
      const left = Math.max(
        8,
        Math.min(rect.left, window.innerWidth - POPOVER_WIDTH - 8),
      );
      setPosition({ top, left });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, view]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !wrapperRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleTextChange = (raw: string) => {
    const formatted = autoFormat(raw);
    setText(formatted);
    if (formatted === '') {
      if (value) onChange('');
      return;
    }
    const iso = displayToIso(formatted);
    if (iso) {
      const parsed = parseIso(iso);
      if (parsed) setView({ y: parsed.y, m: parsed.m });
      if (iso !== value) onChange(iso);
    }
  };

  const shiftMonth = (delta: number) => {
    setView(({ y, m }) => {
      const next = new Date(y, m + delta, 1);
      return { y: next.getFullYear(), m: next.getMonth() };
    });
  };

  const selectDay = (y: number, m: number, d: number) => {
    const iso = toIso(y, m, d);
    setText(isoToDisplay(iso));
    if (iso !== value) onChange(iso);
    setOpen(false);
  };

  // Build the grid: leading days from the previous month, the current month,
  // then trailing days to finish the last week.
  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const date = new Date(view.y, view.m, i - firstWeekday + 1);
    return {
      y: date.getFullYear(),
      m: date.getMonth(),
      d: date.getDate(),
      outside: date.getMonth() !== view.m,
    };
  });
  const todayIso = toIso(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return (
    <div className={`date-picker ${wrapperClassName}`} ref={wrapperRef}>
      <input
        className={`date-picker__input ${className}`}
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={text}
        disabled={disabled}
        onChange={(event) => handleTextChange(event.target.value)}
        onClick={openCalendar}
        onBlur={() => setText(isoToDisplay(value))}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') openCalendar();
        }}
      />
      {!disabled && (
        <button
          type="button"
          className="date-picker__icon"
          aria-label="Open calendar"
          onClick={() => (open ? setOpen(false) : openCalendar())}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V10h14v10Zm0-12H5V6h14v2Zm-7 5H7v5h5v-5Z"
            />
          </svg>
        </button>
      )}

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className="date-picker__popover"
            style={{ top: position.top, left: position.left }}
            role="dialog"
            aria-label="Choose date"
          >
            <div className="date-picker__header">
              <button
                type="button"
                className="date-picker__nav"
                aria-label="Previous month"
                onClick={() => shiftMonth(-1)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 5l-7 7 7 7"
                  />
                </svg>
              </button>
              <span className="date-picker__title">
                {MONTHS[view.m]} {view.y}
              </span>
              <button
                type="button"
                className="date-picker__nav"
                aria-label="Next month"
                onClick={() => shiftMonth(1)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="date-picker__grid">
              {WEEKDAYS.map((day) => (
                <span key={day} className="date-picker__weekday">
                  {day}
                </span>
              ))}
              {cells.map(({ y, m, d, outside }) => {
                const iso = toIso(y, m, d);
                const classes = [
                  'date-picker__day',
                  outside && 'date-picker__day--outside',
                  iso === value && 'date-picker__day--selected',
                  iso === todayIso && 'date-picker__day--today',
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <button
                    key={iso}
                    type="button"
                    className={classes}
                    aria-pressed={iso === value}
                    onClick={() => selectDay(y, m, d)}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
