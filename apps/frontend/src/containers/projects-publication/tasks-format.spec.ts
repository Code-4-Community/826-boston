import { describe, expect, it } from 'vitest';
import { formatDueBy, formatTimeFrame, weekStart } from './tasks-format';

describe('weekStart', () => {
  it('returns the Monday of the week for a day in the middle of it', () => {
    expect(weekStart('2026-10-07')).toBe('2026-10-05');
  });

  it('keeps a Monday as it is', () => {
    expect(weekStart('2026-10-05')).toBe('2026-10-05');
  });

  it('treats Sunday as the end of the week, not the start of the next', () => {
    expect(weekStart('2026-10-11')).toBe('2026-10-05');
  });

  it('keeps a year below 100 as typed, not as 19xx', () => {
    // new Date(50, ...) would mean 1950
    expect(weekStart('0050-06-15').startsWith('0050-')).toBe(true);
    expect(weekStart('0002-10-05').startsWith('0002-')).toBe(true);
  });

  it('crosses month and year boundaries', () => {
    expect(weekStart('2027-01-01')).toBe('2026-12-28');
    expect(weekStart('2026-11-03')).toBe('2026-11-02');
  });
});

describe('date formatting', () => {
  it('shows the stored day without shifting it by a time zone', () => {
    expect(formatTimeFrame('2026-10-05')).toBe('Week of 10/05');
    expect(formatDueBy('2026-10-10')).toBe('10/10/2026');
  });
});
