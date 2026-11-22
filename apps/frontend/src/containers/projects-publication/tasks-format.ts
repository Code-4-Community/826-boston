import { AreaOfWork } from '../../types';

export const AREA_OF_WORK_LABELS: Record<AreaOfWork, string> = {
  [AreaOfWork.PLANNING]: 'Planning',
  [AreaOfWork.PROGRAMMING]: 'Programming',
  [AreaOfWork.CHECKPOINT]: 'Checkpoint',
  [AreaOfWork.PRODUCTION]: 'Production',
};

// timeFrame and dueBy are YYYY-MM-DD strings. new Date() would read them as
// UTC midnight and show the previous day in Boston, so format their parts.
export function formatTimeFrame(date: string): string {
  const [, month, day] = date.split('-');
  return `Week of ${month}/${day}`;
}

export function formatDueBy(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return `${month}/${day}/${year}`;
}

/**
 * The Monday of the week containing a YYYY-MM-DD date, which is what a task's
 * timeFrame stores. A week starts on Monday here because that is how the
 * backend seeds and documents it ("Week of MM/DD" is that Monday).
 */
export function weekStart(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const d = new Date(2000, month - 1, day);
  // The constructor maps years 0-99 to 1900-1999, so set the year separately
  d.setFullYear(year);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  const pad = (n: number, length = 2) => String(n).padStart(length, '0');
  return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )}`;
}
