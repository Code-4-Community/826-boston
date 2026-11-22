import { Task, TaskStatus } from '../types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Turns a YYYY-MM-DD string from the API (a task's timeFrame or dueBy) into a
 * Date at midnight, local time, on that same calendar day. Use this instead
 * of new Date(str): that reads the string as UTC midnight, which is the
 * previous evening in Boston, so every date would show up a day early.
 */
export function parseLocalDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// A date as YYYY-MM-DD in local time, so it compares directly with dueBy
export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getToday(): string {
  return toDateKey(new Date());
}

// Whole calendar days from one date to another. Counts calendar days rather
// than dividing elapsed time, so the 23 and 25 hour days around daylight
// saving changes don't throw the result off by one.
export function diffInDays(from: Date, to: Date): number {
  const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const toUtc = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((toUtc - fromUtc) / MS_PER_DAY);
}

/**
 * Whether a task should be flagged as overdue: its due date is before today
 * and it hasn't been marked Complete. A task due today is not overdue yet,
 * and completing a task clears the flag. `today` is a YYYY-MM-DD string from
 * getToday(); those strings sort in date order, so they compare directly.
 */
export function isOverdue(
  task: Pick<Task, 'status' | 'dueBy'>,
  today: string,
): boolean {
  return task.status !== TaskStatus.COMPLETE && task.dueBy < today;
}
