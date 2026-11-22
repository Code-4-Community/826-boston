import { describe, expect, it } from 'vitest';
import { TaskStatus } from '../types';
import {
  diffInDays,
  getToday,
  isOverdue,
  parseLocalDate,
  toDateKey,
} from './task-dates';

describe('parseLocalDate', () => {
  it('keeps the day the string says, in local time', () => {
    const date = parseLocalDate('2025-10-05');
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(9);
    expect(date.getDate()).toBe(5);
    expect(date.getHours()).toBe(0);
  });
});

describe('toDateKey', () => {
  it('round-trips with parseLocalDate', () => {
    expect(toDateKey(parseLocalDate('2025-01-09'))).toBe('2025-01-09');
  });

  it('getToday matches today in local time', () => {
    expect(getToday()).toBe(toDateKey(new Date()));
  });
});

describe('diffInDays', () => {
  it('counts calendar days', () => {
    expect(
      diffInDays(parseLocalDate('2025-10-05'), parseLocalDate('2025-10-10')),
    ).toBe(5);
    expect(
      diffInDays(parseLocalDate('2025-10-10'), parseLocalDate('2025-10-05')),
    ).toBe(-5);
    expect(
      diffInDays(parseLocalDate('2025-10-05'), parseLocalDate('2025-10-05')),
    ).toBe(0);
  });

  it('is not thrown off by daylight saving changes', () => {
    // US clocks go forward on 2025-03-09 and back on 2025-11-02
    expect(
      diffInDays(parseLocalDate('2025-03-08'), parseLocalDate('2025-03-10')),
    ).toBe(2);
    expect(
      diffInDays(parseLocalDate('2025-11-01'), parseLocalDate('2025-11-03')),
    ).toBe(2);
  });
});

describe('isOverdue', () => {
  it('is true for an open task past its due date', () => {
    expect(
      isOverdue(
        { status: TaskStatus.IN_PROGRESS, dueBy: '2025-10-04' },
        '2025-10-05',
      ),
    ).toBe(true);
  });

  it('is false on the due date itself', () => {
    expect(
      isOverdue(
        { status: TaskStatus.NOT_STARTED, dueBy: '2025-10-05' },
        '2025-10-05',
      ),
    ).toBe(false);
  });

  it('is false once the task is complete', () => {
    expect(
      isOverdue(
        { status: TaskStatus.COMPLETE, dueBy: '2020-01-01' },
        '2025-10-05',
      ),
    ).toBe(false);
  });
});
