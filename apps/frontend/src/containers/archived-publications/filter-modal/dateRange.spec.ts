import { describe, expect, it } from 'vitest';
import { isDateRangeInverted } from './dateRange';

describe('isDateRangeInverted', () => {
  it('is true when the start is after the end', () => {
    expect(isDateRangeInverted('2026-02-03', '2025-12-15')).toBe(true);
  });

  it('compares across months and years, not digit by digit', () => {
    expect(isDateRangeInverted('2025-12-01', '2026-01-01')).toBe(false);
    expect(isDateRangeInverted('2026-01-01', '2025-12-31')).toBe(true);
    expect(isDateRangeInverted('2025-02-10', '2025-10-02')).toBe(false);
  });

  it('is false for a normal range', () => {
    expect(isDateRangeInverted('2025-12-15', '2026-02-03')).toBe(false);
  });

  it('is false when both ends are the same day', () => {
    expect(isDateRangeInverted('2025-06-15', '2025-06-15')).toBe(false);
  });

  it('is false while either end is empty', () => {
    expect(isDateRangeInverted('', '2025-01-01')).toBe(false);
    expect(isDateRangeInverted('2026-01-01', '')).toBe(false);
    expect(isDateRangeInverted('', '')).toBe(false);
  });
});
