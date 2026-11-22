export const DATE_RANGE_ERROR = "Start date can't be after end date.";

// Both dates are yyyy-mm-dd, so comparing them as text compares them as dates. Only a
// range with both ends set can be backwards, and the same day on both ends is fine.
export function isDateRangeInverted(start: string, end: string): boolean {
  return start !== '' && end !== '' && start > end;
}
