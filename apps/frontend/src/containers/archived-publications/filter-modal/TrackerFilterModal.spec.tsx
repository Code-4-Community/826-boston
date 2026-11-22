import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { describe, expect, it, vi } from 'vitest';
import TrackerFilterModal from './TrackerFilterModal';
import { TRACKER_SORT_OPTIONS } from './constants';
import {
  DEFAULT_TRACKER_FILTER_STATE,
  TrackerFilterState,
  TrackerSortOption,
} from '../../../types';

// The modal loads programs and staff from the API. These tests only look at the sort,
// so the requests never settle; that keeps late state updates out of the tests.
vi.mock('../../../api/apiClient', () => ({
  default: {
    getUsers: vi.fn(() => new Promise(() => undefined)),
    getAnthologies: vi.fn(() => new Promise(() => undefined)),
  },
}));

function renderModal(
  initialFilters: TrackerFilterState = DEFAULT_TRACKER_FILTER_STATE,
) {
  const onApply = vi.fn();
  const onClose = vi.fn();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <TrackerFilterModal
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
  TRACKER_SORT_OPTIONS.map((option) => sortButton(option.displayLabel))
    .filter((button) => button.getAttribute('aria-pressed') === 'true')
    .map((button) => button.textContent);

describe('TrackerFilterModal sort', () => {
  it('starts with no sort selected', () => {
    renderModal();

    expect(TRACKER_SORT_OPTIONS).toHaveLength(6);
    expect(selectedSorts()).toEqual([]);
  });

  it('shows the sort that was applied before', () => {
    renderModal({
      ...DEFAULT_TRACKER_FILTER_STATE,
      sortBy: TrackerSortOption.DATE_OLDEST,
    });

    expect(selectedSorts()).toEqual(['By Publication Date (Oldest First)']);
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

    fireEvent.click(sortButton('By Title (Z-A)'));
    fireEvent.click(screen.getByRole('button', { name: 'Save and Apply' }));

    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: TrackerSortOption.TITLE_DESC }),
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
      ...DEFAULT_TRACKER_FILTER_STATE,
      sortBy: TrackerSortOption.BYLINE_ASC,
    });

    fireEvent.click(sortButton('By Author (A-Z)'));
    fireEvent.click(screen.getByRole('button', { name: 'Save and Apply' }));

    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: null }),
    );
  });

  it('Reset filters applies the defaults right away and closes', () => {
    const { onApply, onClose } = renderModal({
      ...DEFAULT_TRACKER_FILTER_STATE,
      sortBy: TrackerSortOption.TITLE_DESC,
      programs: ['Tutoring'],
    });

    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));

    expect(onApply).toHaveBeenCalledWith(DEFAULT_TRACKER_FILTER_STATE);
    expect(onClose).toHaveBeenCalled();
  });
});
