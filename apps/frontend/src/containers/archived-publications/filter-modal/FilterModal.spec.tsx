import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { describe, expect, it, vi } from 'vitest';
import FilterModal from './FilterModal';
import { SORT_OPTIONS } from './constants';
import { DATE_RANGE_ERROR } from './dateRange';
import { DEFAULT_FILTER_STATE, FilterState, SortOption } from '../../../types';

// The attribute section loads its options from the API. These tests only look at the
// sort, so the requests never settle; that keeps late state updates out of the tests.
vi.mock('../../../api/apiClient', () => ({
  default: {
    getAnthologies: vi.fn(() => new Promise(() => undefined)),
    getInventories: vi.fn(() => new Promise(() => undefined)),
  },
}));

function renderModal(initialFilters: FilterState = DEFAULT_FILTER_STATE) {
  const onApply = vi.fn();
  const onClose = vi.fn();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <FilterModal
        initialFilters={initialFilters}
        onApply={onApply}
        onClose={onClose}
      />
    </QueryClientProvider>,
  );
  return { onApply, onClose };
}

const sortButton = (label: string) =>
  screen.getByRole('button', { name: label });

// labels of the sort options that are currently selected
const selectedSorts = () =>
  SORT_OPTIONS.map((option) => sortButton(option.displayLabel))
    .filter((button) => button.getAttribute('aria-pressed') === 'true')
    .map((button) => button.textContent);

describe('FilterModal sort', () => {
  it('starts with no sort selected', () => {
    renderModal();

    expect(SORT_OPTIONS).toHaveLength(6);
    expect(selectedSorts()).toEqual([]);
  });

  it('shows the sort that was applied before', () => {
    renderModal({ ...DEFAULT_FILTER_STATE, sortBy: SortOption.DATE_OLDEST });

    expect(selectedSorts()).toEqual(['By Publication Date (Oldest First)']);
  });

  it('selects a sort when it is clicked', () => {
    renderModal();

    fireEvent.click(sortButton('By Title (A-Z)'));

    expect(selectedSorts()).toEqual(['By Title (A-Z)']);
  });

  it('only ever has one sort selected', () => {
    renderModal();

    fireEvent.click(sortButton('By Title (A-Z)'));
    fireEvent.click(sortButton('By Author (Z-A)'));

    expect(selectedSorts()).toEqual(['By Author (Z-A)']);
  });

  it('clears the sort when the selected one is clicked again', () => {
    renderModal();

    fireEvent.click(sortButton('By Author (A-Z)'));
    fireEvent.click(sortButton('By Author (A-Z)'));

    expect(selectedSorts()).toEqual([]);
  });

  it('applies the chosen sort', () => {
    const { onApply, onClose } = renderModal();

    fireEvent.click(sortButton('By Author (A-Z)'));
    fireEvent.click(screen.getByRole('button', { name: 'Save and Apply' }));

    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: SortOption.AUTHOR_ASC }),
    );
    expect(onClose).toHaveBeenCalled();
  });

  it('applies "no sort" when nothing is selected', () => {
    const { onApply } = renderModal();

    fireEvent.click(screen.getByRole('button', { name: 'Save and Apply' }));

    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: null }),
    );
  });

  it('applies "no sort" after a sort was cleared again', () => {
    const { onApply } = renderModal({
      ...DEFAULT_FILTER_STATE,
      sortBy: SortOption.TITLE_DESC,
    });

    fireEvent.click(sortButton('By Title (Z-A)'));
    fireEvent.click(screen.getByRole('button', { name: 'Save and Apply' }));

    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: null }),
    );
  });

  it('Reset filters clears the sort', () => {
    renderModal({ ...DEFAULT_FILTER_STATE, sortBy: SortOption.TITLE_DESC });
    expect(selectedSorts()).toEqual(['By Title (Z-A)']);

    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));

    expect(selectedSorts()).toEqual([]);
  });
});

describe('FilterModal publication date range', () => {
  const startInput = () => screen.getByLabelText('Publication Date start');
  const endInput = () => screen.getByLabelText('Publication Date end');
  const saveButton = () =>
    screen.getByRole('button', { name: 'Save and Apply' }) as HTMLButtonElement;
  // typing digits is enough, the box adds the slashes
  const typeDate = (input: HTMLElement, digits: string) =>
    fireEvent.change(input, { target: { value: digits } });

  it('shows no error when no dates are set', () => {
    renderModal();

    expect(screen.queryByRole('alert')).toBeNull();
    expect(saveButton().disabled).toBe(false);
  });

  it('shows an error and blocks Save and Apply when the start is after the end', () => {
    renderModal();

    typeDate(startInput(), '12312025');
    typeDate(endInput(), '01012025');

    expect(screen.getByRole('alert').textContent).toBe(DATE_RANGE_ERROR);
    expect(saveButton().disabled).toBe(true);
    expect(startInput().getAttribute('aria-invalid')).toBe('true');
    expect(endInput().getAttribute('aria-invalid')).toBe('true');
  });

  it('does not apply a backwards range', () => {
    const { onApply, onClose } = renderModal();

    typeDate(startInput(), '12312025');
    typeDate(endInput(), '01012025');
    fireEvent.click(saveButton());

    expect(onApply).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('clears the error once the range makes sense again', () => {
    renderModal();
    typeDate(startInput(), '12312025');
    typeDate(endInput(), '01012025');
    expect(screen.queryByRole('alert')).not.toBeNull();

    typeDate(endInput(), '02012026');

    expect(screen.queryByRole('alert')).toBeNull();
    expect(saveButton().disabled).toBe(false);
    expect(startInput().getAttribute('aria-invalid')).toBe('false');
  });

  it('accepts the same day on both ends', () => {
    renderModal();

    typeDate(startInput(), '06152025');
    typeDate(endInput(), '06152025');

    expect(screen.queryByRole('alert')).toBeNull();
    expect(saveButton().disabled).toBe(false);
  });

  it('shows no error while only one end is set', () => {
    renderModal();

    typeDate(endInput(), '01012020');

    expect(screen.queryByRole('alert')).toBeNull();
    expect(saveButton().disabled).toBe(false);
  });

  it('flags a range that was applied before and is backwards', () => {
    renderModal({
      ...DEFAULT_FILTER_STATE,
      pubDateStart: '2026-02-03',
      pubDateEnd: '2025-12-15',
    });

    expect(screen.getByRole('alert').textContent).toBe(DATE_RANGE_ERROR);
  });

  it('Reset filters clears the error', () => {
    renderModal();
    typeDate(startInput(), '12312025');
    typeDate(endInput(), '01012025');
    expect(screen.queryByRole('alert')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));

    expect(screen.queryByRole('alert')).toBeNull();
    expect(saveButton().disabled).toBe(false);
  });

  it('applies a valid range as yyyy-mm-dd', () => {
    const { onApply } = renderModal();

    typeDate(startInput(), '01152025');
    typeDate(endInput(), '02032026');
    fireEvent.click(saveButton());

    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        pubDateStart: '2025-01-15',
        pubDateEnd: '2026-02-03',
      }),
    );
  });
});
