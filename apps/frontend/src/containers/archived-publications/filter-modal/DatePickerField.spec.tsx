import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import DatePickerField from './DatePickerField';

// keeps the value in state the way the modal does
function Controlled({
  initial = '',
  onChange,
}: {
  initial?: string;
  onChange: (iso: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <DatePickerField
      value={value}
      onChange={(iso) => {
        setValue(iso);
        onChange(iso);
      }}
      ariaLabel="Start"
    />
  );
}

const input = () => screen.getByLabelText('Start') as HTMLInputElement;
const type = (digits: string) =>
  fireEvent.change(input(), { target: { value: digits } });
const openCalendar = () =>
  fireEvent.click(screen.getByRole('button', { name: /open calendar/i }));
const monthLabel = () =>
  document.querySelector('.filter-date-month')?.textContent;

describe('DatePickerField typing', () => {
  it('adds the slashes as digits are typed', () => {
    render(<Controlled onChange={vi.fn()} />);

    type('1225');
    expect(input().value).toBe('12/25');

    type('12252025');
    expect(input().value).toBe('12/25/2025');
  });

  it('reports a complete date as yyyy-mm-dd', () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    type('12252025');

    expect(onChange).toHaveBeenCalledWith('2025-12-25');
  });

  it('reports nothing while the date is incomplete', () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    type('122520');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('rejects a date that does not exist and clears it on blur', () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    type('02312025');
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.blur(input());
    expect(input().value).toBe('');
  });

  it('accepts 29 February only in a leap year', () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    type('02292025');
    expect(onChange).not.toHaveBeenCalled();

    type('02292024');
    expect(onChange).toHaveBeenCalledWith('2024-02-29');
  });

  it('keeps the year four digits long so the date stays valid ISO', () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    type('01010202');

    expect(onChange).toHaveBeenCalledWith('0202-01-01');
  });

  it('reports an empty value when the box is cleared', () => {
    const onChange = vi.fn();
    render(<Controlled initial="2025-12-25" onChange={onChange} />);

    type('');

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('puts a half-typed date back to the applied one on blur', () => {
    render(<Controlled initial="2025-12-25" onChange={vi.fn()} />);

    type('1201');
    fireEvent.blur(input());

    expect(input().value).toBe('12/25/2025');
  });

  it('follows the value when it changes from outside, such as Reset filters', () => {
    const { rerender } = render(
      <DatePickerField
        value="2025-12-25"
        onChange={vi.fn()}
        ariaLabel="Start"
      />,
    );
    expect(input().value).toBe('12/25/2025');

    rerender(<DatePickerField value="" onChange={vi.fn()} ariaLabel="Start" />);

    expect(input().value).toBe('');
  });
});

describe('DatePickerField calendar', () => {
  it('opens on the month of the chosen date', () => {
    render(<Controlled initial="2025-12-15" onChange={vi.fn()} />);

    openCalendar();

    expect(screen.getByRole('dialog', { name: 'Calendar' })).toBeTruthy();
    expect(monthLabel()).toBe('Dec 2025');
  });

  it('marks the chosen day', () => {
    render(<Controlled initial="2025-12-15" onChange={vi.fn()} />);

    openCalendar();

    const chosen = screen.getByRole('button', { name: '12/15/2025' });
    expect(chosen.getAttribute('aria-pressed')).toBe('true');
    const other = screen.getByRole('button', { name: '12/16/2025' });
    expect(other.getAttribute('aria-pressed')).toBe('false');
  });

  it('picks a day, fills the box and closes', () => {
    const onChange = vi.fn();
    render(<Controlled initial="2025-12-15" onChange={onChange} />);
    openCalendar();

    fireEvent.click(screen.getByRole('button', { name: '12/20/2025' }));

    expect(onChange).toHaveBeenCalledWith('2025-12-20');
    expect(input().value).toBe('12/20/2025');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('lets a day from the neighbouring month be picked', () => {
    const onChange = vi.fn();
    render(<Controlled initial="2025-12-15" onChange={onChange} />);
    openCalendar();

    // 30 November is shown in the first week of December 2025
    fireEvent.click(screen.getByRole('button', { name: '11/30/2025' }));

    expect(onChange).toHaveBeenCalledWith('2025-11-30');
  });

  it('moves between months, across the year boundary', () => {
    render(<Controlled initial="2025-12-15" onChange={vi.fn()} />);
    openCalendar();

    fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(monthLabel()).toBe('Jan 2026');

    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(monthLabel()).toBe('Nov 2025');
  });

  it('shows whole weeks, so February 2026 is exactly four rows', () => {
    render(<Controlled initial="2026-02-10" onChange={vi.fn()} />);
    openCalendar();

    // 1 February 2026 is a Sunday and the month has 28 days: 4 weeks + the weekday row
    expect(document.querySelectorAll('.filter-date-week')).toHaveLength(5);
  });

  it('closes when the toggle is pressed again', () => {
    render(<Controlled onChange={vi.fn()} />);

    openCalendar();
    openCalendar();

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on a click outside it', () => {
    render(<Controlled onChange={vi.fn()} />);
    openCalendar();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on Escape', () => {
    render(<Controlled onChange={vi.fn()} />);
    openCalendar();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('DatePickerField error state', () => {
  it('outlines the box and flags the input when hasError is set', () => {
    render(
      <DatePickerField
        value=""
        onChange={vi.fn()}
        ariaLabel="Start"
        hasError
      />,
    );

    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(
      document
        .querySelector('.filter-date-box')
        ?.classList.contains('filter-date-box--error'),
    ).toBe(true);
  });
});
