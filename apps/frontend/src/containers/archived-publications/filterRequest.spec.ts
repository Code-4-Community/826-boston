import { describe, expect, it } from 'vitest';
import {
  buildFilterSortBody,
  buildTrackerBody,
  countActiveTrackerFilters,
} from './filterRequest';
import {
  DEFAULT_FILTER_STATE,
  DEFAULT_TRACKER_FILTER_STATE,
  FilterState,
  SortOption,
  TrackerFilterState,
  TrackerSortOption,
} from '../../types';

const withFilters = (overrides: Partial<FilterState>): FilterState => ({
  ...DEFAULT_FILTER_STATE,
  ...overrides,
});

const withTrackerFilters = (
  overrides: Partial<TrackerFilterState>,
): TrackerFilterState => ({
  ...DEFAULT_TRACKER_FILTER_STATE,
  ...overrides,
});

describe('buildFilterSortBody', () => {
  it('sends nothing at all when no sort and no filters are chosen', () => {
    expect(buildFilterSortBody(DEFAULT_FILTER_STATE)).toEqual({});
  });

  it('leaves sortBy out of the body when no sort is chosen', () => {
    const body = buildFilterSortBody(withFilters({ sortBy: null }));
    expect(body).not.toHaveProperty('sortBy');
  });

  it.each([
    [SortOption.TITLE_ASC, 'title-asc'],
    [SortOption.TITLE_DESC, 'title-desc'],
    [SortOption.AUTHOR_ASC, 'byline-asc'],
    [SortOption.AUTHOR_DESC, 'byline-desc'],
    [SortOption.DATE_NEWEST, 'date-recent'],
    [SortOption.DATE_OLDEST, 'date-oldest'],
  ])('maps %s to the backend sort %s', (sortBy, expected) => {
    expect(buildFilterSortBody(withFilters({ sortBy })).sortBy).toBe(expected);
  });

  it('sends only the filters that are set', () => {
    const body = buildFilterSortBody(
      withFilters({
        programs: ['Tutoring'],
        locationIds: [2, 5],
        themes: ['Identity'],
        genres: ['Poetry'],
      }),
    );

    expect(body).toEqual({
      programs: ['Tutoring'],
      locationIds: [2, 5],
      themes: ['Identity'],
      genres: ['Poetry'],
    });
  });

  it('sends a full date range as given', () => {
    const body = buildFilterSortBody(
      withFilters({ pubDateStart: '2025-01-15', pubDateEnd: '2026-02-03' }),
    );

    expect(body.pubDateRange).toEqual({
      start: '2025-01-15',
      end: '2026-02-03',
    });
  });

  it('leaves either end of the date range open when it is not set', () => {
    expect(
      buildFilterSortBody(withFilters({ pubDateStart: '2025-01-15' }))
        .pubDateRange,
    ).toEqual({ start: '2025-01-15', end: '2100-12-31' });

    expect(
      buildFilterSortBody(withFilters({ pubDateEnd: '2026-02-03' }))
        .pubDateRange,
    ).toEqual({ start: '1900-01-01', end: '2026-02-03' });
  });
});

describe('buildTrackerBody', () => {
  it('sends nothing at all when there is no search, sort or filter', () => {
    expect(buildTrackerBody('', DEFAULT_TRACKER_FILTER_STATE)).toEqual({});
  });

  it('leaves sortBy out of the body when no sort is chosen', () => {
    const body = buildTrackerBody('', withTrackerFilters({ sortBy: null }));
    expect(body).not.toHaveProperty('sortBy');
  });

  it.each(Object.values(TrackerSortOption))(
    'sends the chosen sort %s as it is',
    (sortBy) => {
      expect(buildTrackerBody('', withTrackerFilters({ sortBy })).sortBy).toBe(
        sortBy,
      );
    },
  );

  it('sends the search text and only the filters that are set', () => {
    const body = buildTrackerBody(
      'moon',
      withTrackerFilters({ programs: ['Tutoring'], staffIds: [3, 4] }),
    );

    expect(body).toEqual({
      search: 'moon',
      programs: ['Tutoring'],
      staffIds: [3, 4],
    });
  });
});

describe('countActiveTrackerFilters', () => {
  it('is zero with nothing chosen', () => {
    expect(countActiveTrackerFilters(DEFAULT_TRACKER_FILTER_STATE)).toBe(0);
  });

  it('counts a chosen sort as one, whichever it is', () => {
    expect(
      countActiveTrackerFilters(
        withTrackerFilters({ sortBy: TrackerSortOption.TITLE_ASC }),
      ),
    ).toBe(1);
    expect(
      countActiveTrackerFilters(
        withTrackerFilters({ sortBy: TrackerSortOption.DATE_OLDEST }),
      ),
    ).toBe(1);
  });

  it('counts each program and staff member, plus the sort', () => {
    expect(
      countActiveTrackerFilters(
        withTrackerFilters({
          sortBy: TrackerSortOption.BYLINE_DESC,
          programs: ['Tutoring', 'Young Authors'],
          staffIds: [7],
        }),
      ),
    ).toBe(4);
  });

  it('stops counting the sort once it is cleared again', () => {
    expect(
      countActiveTrackerFilters(
        withTrackerFilters({ sortBy: null, programs: ['Tutoring'] }),
      ),
    ).toBe(1);
  });
});
