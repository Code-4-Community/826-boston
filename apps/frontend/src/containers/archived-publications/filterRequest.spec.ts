import { describe, expect, it } from 'vitest';
import { buildFilterSortBody } from './filterRequest';
import { DEFAULT_FILTER_STATE, FilterState, SortOption } from '../../types';

const withFilters = (overrides: Partial<FilterState>): FilterState => ({
  ...DEFAULT_FILTER_STATE,
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
